"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { PoolConnection, ResultSetHeader, RowDataPacket } from "mysql2/promise";
import type { EstadoAuth } from "@/lib/auth/tipos";
import { obtenerIdCuentaDeSesion } from "@/lib/auth/sesion";
import { pool } from "@/lib/db";

type FilaCuenta = { id_cuenta: number } & RowDataPacket;
type FilaPerfil = {
  id_lector: number | null;
  id_empleado: number | null;
} & RowDataPacket;

function leerCampo(formData: FormData, nombre: string): string {
  const valor = formData.get(nombre);
  return typeof valor === "string" ? valor.trim() : "";
}

export async function actualizarPerfil(
  _estadoAnterior: EstadoAuth,
  formData: FormData,
): Promise<EstadoAuth> {
  let idCuenta: number | null;
  try {
    idCuenta = await obtenerIdCuentaDeSesion();
  } catch (error) {
    console.error("Error al cargar la sesión para editar el perfil:", error);
    return { error: "No se pudo validar tu sesión. Inténtalo de nuevo." };
  }
  if (idCuenta === null) return { error: "Tu sesión ya no es válida. Inicia sesión de nuevo." };

  const nombre = leerCampo(formData, "nombre");
  const apellido = leerCampo(formData, "apellido");
  const telefono = leerCampo(formData, "telefono");
  const calle = leerCampo(formData, "calle");

  if (!nombre || !apellido) {
    return { error: "El nombre y el apellido son obligatorios." };
  }
  if (nombre.length > 60 || apellido.length > 60) {
    return { error: "El nombre y el apellido admiten hasta 60 caracteres." };
  }
  if (telefono.length > 20 || calle.length > 120) {
    return { error: "El teléfono admite hasta 20 caracteres y la dirección hasta 120." };
  }

  let conexion: PoolConnection;
  try {
    conexion = await pool.getConnection();
  } catch (error) {
    console.error("No se pudo abrir la conexión para actualizar el perfil:", error);
    return { error: "No se pudieron guardar tus datos. Inténtalo más tarde." };
  }
  let transaccionAbierta = false;
  try {
    await conexion.beginTransaction();
    transaccionAbierta = true;

    const [cuentas] = await conexion.execute<FilaCuenta[]>(
      `SELECT id_cuenta
       FROM cuenta
       WHERE id_cuenta = ? AND fecha_verificacion IS NOT NULL AND fecha_desactivacion IS NULL
       FOR UPDATE`,
      [idCuenta],
    );
    if (!cuentas[0]) {
      await conexion.rollback();
      transaccionAbierta = false;
      return { error: "Tu cuenta ya no está activa. Inicia sesión de nuevo." };
    }

    const [perfiles] = await conexion.execute<FilaPerfil[]>(
      `SELECT l.id_lector, e.id_empleado
       FROM cuenta c
       LEFT JOIN lector l ON l.id_cuenta = c.id_cuenta
       LEFT JOIN empleado e ON e.id_cuenta = c.id_cuenta AND e.activo = TRUE
       WHERE c.id_cuenta = ?
       FOR UPDATE`,
      [idCuenta],
    );
    const perfil = perfiles[0];
    if (!perfil || (perfil.id_lector === null && perfil.id_empleado === null)) {
      await conexion.rollback();
      transaccionAbierta = false;
      return { error: "No hay un perfil activo que puedas actualizar." };
    }

    if (perfil.id_lector !== null) {
      await conexion.execute<ResultSetHeader>(
        `UPDATE lector
         SET nombre = ?, apellido = ?, telefono = ?, calle = ?
         WHERE id_lector = ?`,
        [nombre, apellido, telefono || null, calle || null, perfil.id_lector],
      );
    }

    if (perfil.id_empleado !== null) {
      await conexion.execute<ResultSetHeader>(
        `UPDATE empleado
         SET nombre = ?, apellido = ?, telefono = ?, calle = ?
         WHERE id_empleado = ? AND activo = TRUE`,
        [nombre, apellido, telefono || null, calle || null, perfil.id_empleado],
      );
    }

    await conexion.commit();
    transaccionAbierta = false;
    revalidatePath("/perfil");
    return { success: "Tus datos de perfil se actualizaron." };
  } catch (error) {
    if (transaccionAbierta) await conexion.rollback();
    console.error("Error al actualizar el perfil:", error);
    return { error: "No se pudieron guardar tus datos. Inténtalo más tarde." };
  } finally {
    conexion.release();
  }
}

export async function cerrarSesion(): Promise<never> {
  (await cookies()).delete("token_sesion");
  redirect("/login");
}
