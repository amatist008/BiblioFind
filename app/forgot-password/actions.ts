"use server";

import type { ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { crearTokenCuenta, crearUrlCuenta, hashTokenCuenta } from "@/lib/auth/tokens";
import type { EstadoAuth } from "@/lib/auth/tipos";
import { pool } from "@/lib/db";

type FilaCuenta = { id_cuenta: number } & RowDataPacket;

export async function solicitarRecuperacion(
  _estadoAnterior: EstadoAuth,
  formData: FormData,
): Promise<EstadoAuth> {
  if (process.env.NODE_ENV !== "development") {
    return { error: "La recuperación por correo no está configurada en este entorno." };
  }

  const correoValor = formData.get("correo");
  const correo = typeof correoValor === "string" ? correoValor.trim().toLowerCase() : "";
  if (!correo || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
    return { error: "Escribe un correo válido." };
  }

  try {
    const [cuentas] = await pool.execute<FilaCuenta[]>(
      "SELECT id_cuenta FROM cuenta WHERE correo = ?",
      [correo],
    );
    const cuenta = cuentas[0];
    if (!cuenta) {
      return {
        success: "Si existe una cuenta con ese correo, recibirás instrucciones. En desarrollo, revisa la terminal del servidor.",
      };
    }

    const token = crearTokenCuenta();
    const url = crearUrlCuenta(`/reset-password/${token}`);
    const conexion = await pool.getConnection();
    try {
      await conexion.beginTransaction();
      await conexion.execute<ResultSetHeader>(
        `UPDATE token_cuenta
         SET usado_en = NOW()
         WHERE id_cuenta = ? AND tipo = 'recuperar_contrasena' AND usado_en IS NULL`,
        [cuenta.id_cuenta],
      );
      await conexion.execute<ResultSetHeader>(
        `INSERT INTO token_cuenta (id_cuenta, token_hash, tipo, expira_en)
         VALUES (?, ?, 'recuperar_contrasena', DATE_ADD(NOW(), INTERVAL 30 MINUTE))`,
        [cuenta.id_cuenta, hashTokenCuenta(token)],
      );
      await conexion.commit();
    } catch (error) {
      await conexion.rollback();
      throw error;
    } finally {
      conexion.release();
    }

    console.info(`Enlace de recuperación para ${correo}: ${url}`);
    return {
      success: "Si existe una cuenta con ese correo, recibirás instrucciones. En desarrollo, revisa la terminal del servidor.",
    };
  } catch (error) {
    console.error("Error al solicitar recuperación de contraseña:", error);
    return { error: "No se pudo preparar la recuperación. Inténtalo más tarde." };
  }
}
