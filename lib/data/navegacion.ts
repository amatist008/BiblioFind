import "server-only";
import type { RowDataPacket } from "mysql2/promise";
import { obtenerIdCuentaDeSesion } from "@/lib/auth/sesion";
import { pool } from "@/lib/db";

type FilaCuentaNav = { id_cuenta: number } & RowDataPacket;

export async function obtenerCuentaParaNavegacion(): Promise<{ idCuenta: number } | null> {
  const idCuenta = await obtenerIdCuentaDeSesion();
  if (idCuenta === null) return null;

  const [cuentas] = await pool.execute<FilaCuentaNav[]>(
    `SELECT c.id_cuenta
     FROM cuenta c
     WHERE c.id_cuenta = ?
       AND c.fecha_verificacion IS NOT NULL
       AND c.fecha_desactivacion IS NULL
       AND (
         EXISTS (SELECT 1 FROM lector l WHERE l.id_cuenta = c.id_cuenta)
         OR EXISTS (SELECT 1 FROM empleado e WHERE e.id_cuenta = c.id_cuenta AND e.activo = TRUE)
       )`,
    [idCuenta],
  );
  const cuenta = cuentas[0];
  return cuenta ? { idCuenta: cuenta.id_cuenta } : null;
}
