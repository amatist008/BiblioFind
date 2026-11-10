"use server";

import { Buffer } from "node:buffer";
import bcrypt from "bcrypt";
import type { RowDataPacket } from "mysql2/promise";
import { cookies } from "next/headers";
import { hashTokenCuenta } from "@/lib/auth/tokens";
import type { EstadoAuth } from "@/lib/auth/tipos";
import { pool } from "@/lib/db";

type FilaToken = { id_cuenta: number } & RowDataPacket;

export async function cambiarContrasena(
  token: string,
  _estadoAnterior: EstadoAuth,
  formData: FormData,
): Promise<EstadoAuth> {
  const passwordValor = formData.get("password");
  const confirmarValor = formData.get("confirmar_password");
  const password = typeof passwordValor === "string" ? passwordValor : "";
  const confirmarPassword = typeof confirmarValor === "string" ? confirmarValor : "";
  if (!password || password !== confirmarPassword) {
    return { error: "Las contraseñas no coinciden." };
  }
  if (Buffer.byteLength(password, "utf8") > 72) {
    return { error: "La contraseña no puede superar los 72 bytes." };
  }

  const conexion = await pool.getConnection();
  try {
    await conexion.beginTransaction();
    const [tokens] = await conexion.execute<FilaToken[]>(
      `SELECT id_cuenta
       FROM token_cuenta
       WHERE token_hash = ? AND tipo = 'recuperar_contrasena'
         AND usado_en IS NULL AND expira_en > NOW()
       FOR UPDATE`,
      [hashTokenCuenta(token)],
    );
    const registro = tokens[0];
    if (!registro) {
      await conexion.rollback();
      return { error: "El enlace no es válido o ya venció. Solicita uno nuevo." };
    }

    const hashContrasena = await bcrypt.hash(password, 10);
    await conexion.execute(
      "UPDATE cuenta SET password_hash = ? WHERE id_cuenta = ?",
      [hashContrasena, registro.id_cuenta],
    );
    await conexion.execute(
      `UPDATE token_cuenta
       SET usado_en = NOW()
       WHERE id_cuenta = ? AND tipo = 'recuperar_contrasena' AND usado_en IS NULL`,
      [registro.id_cuenta],
    );
    await conexion.commit();
    (await cookies()).delete("token_sesion");
    return { success: "Tu contraseña se actualizó. Ya puedes iniciar sesión." };
  } catch (error) {
    await conexion.rollback();
    console.error("Error al cambiar la contraseña:", error);
    return { error: "No se pudo actualizar la contraseña. Inténtalo más tarde." };
  } finally {
    conexion.release();
  }
}
