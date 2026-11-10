"use server";

import type { ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { hashTokenCuenta } from "@/lib/auth/tokens";
import type { EstadoAuth } from "@/lib/auth/tipos";
import { pool } from "@/lib/db";

type FilaToken = {
  id_token: number;
  id_cuenta: number;
} & RowDataPacket;

export async function verificarCorreo(
  token: string,
  estadoAnterior: EstadoAuth,
  formData: FormData,
): Promise<EstadoAuth> {
  if (estadoAnterior?.success) return estadoAnterior;
  if (formData.get("confirmar") !== "true") {
    return { error: "Confirma la verificación desde el botón." };
  }

  const conexion = await pool.getConnection();
  try {
    await conexion.beginTransaction();
    const [tokens] = await conexion.execute<FilaToken[]>(
      `SELECT id_token, id_cuenta
       FROM token_cuenta
       WHERE token_hash = ? AND tipo = 'verificar_correo'
         AND usado_en IS NULL AND expira_en > NOW()
       FOR UPDATE`,
      [hashTokenCuenta(token)],
    );
    const registro = tokens[0];
    if (!registro) {
      await conexion.rollback();
      return { error: "El enlace no es válido o ya venció. Solicita uno nuevo." };
    }

    await conexion.execute<ResultSetHeader>(
      "UPDATE cuenta SET fecha_verificacion = NOW() WHERE id_cuenta = ? AND fecha_verificacion IS NULL",
      [registro.id_cuenta],
    );
    await conexion.execute<ResultSetHeader>(
      "UPDATE token_cuenta SET usado_en = NOW() WHERE id_token = ? AND usado_en IS NULL",
      [registro.id_token],
    );
    await conexion.commit();
    return { success: "Tu correo quedó verificado. Ya puedes iniciar sesión." };
  } catch (error) {
    await conexion.rollback();
    console.error("Error al verificar el correo:", error);
    return { error: "No se pudo verificar el correo. Inténtalo más tarde." };
  } finally {
    conexion.release();
  }
}
