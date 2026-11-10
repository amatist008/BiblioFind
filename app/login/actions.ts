"use server";

import bcrypt from "bcrypt";
import { SignJWT } from "jose";
import type { RowDataPacket } from "mysql2/promise";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { pool } from "@/lib/db";
import type { EstadoAuth } from "@/lib/auth/tipos";

type FilaCuenta = {
  id_cuenta: number;
  correo: string;
  password_hash: string;
  fecha_verificacion: Date | null;
  fecha_desactivacion: Date | null;
} & RowDataPacket;

export async function manejarLogin(
  _estadoAnterior: EstadoAuth,
  formData: FormData,
): Promise<EstadoAuth> {
  const correoValor = formData.get("correo");
  const passwordValor = formData.get("password");
  const correo = typeof correoValor === "string" ? correoValor.trim().toLowerCase() : "";
  const password = typeof passwordValor === "string" ? passwordValor : "";
  const recordar = formData.get("recordar") === "true";

  if (!correo || !password) {
    return { error: "Por favor completa todos los campos." };
  }

  try {
    const [cuentas] = await pool.execute<FilaCuenta[]>(
      `SELECT id_cuenta, correo, password_hash, fecha_verificacion, fecha_desactivacion
       FROM cuenta
       WHERE correo = ?`,
      [correo],
    );
    const cuenta = cuentas[0];

    if (!cuenta || !(await bcrypt.compare(password, cuenta.password_hash))) {
      return { error: "Correo o contraseña incorrectos." };
    }

    if (cuenta.fecha_desactivacion) {
      return { error: "Esta cuenta está desactivada. Contacta con una sede para recibir ayuda." };
    }

    if (!cuenta.fecha_verificacion) {
      return { error: "Verifica tu correo desde el enlace que te enviamos antes de iniciar sesión." };
    }

    const secreto = process.env.JWT_SECRET;
    if (!secreto) {
      throw new Error("Falta la variable de entorno JWT_SECRET.");
    }

    const duracionSegundos = recordar ? 60 * 60 * 24 * 30 : 60 * 60 * 24;
    const token = await new SignJWT({
      id: cuenta.id_cuenta,
      correo: cuenta.correo,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime(`${duracionSegundos}s`)
      .sign(new TextEncoder().encode(secreto));

    const cookieStore = await cookies();
    cookieStore.set({
      name: "token_sesion",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: duracionSegundos,
    });
  } catch (error) {
    console.error("Error en el login:", error);
    return { error: "Ocurrió un error en el servidor. Inténtalo más tarde." };
  }

  redirect("/");
}
