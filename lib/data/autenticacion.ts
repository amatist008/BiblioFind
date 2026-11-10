import "server-only";
import { connection } from "next/server";
import type { RowDataPacket } from "mysql2/promise";
import { pool } from "@/lib/db";
import type { Ciudad } from "@/lib/auth/tipos";

type FilaCiudad = Ciudad & RowDataPacket;

export async function obtenerCiudades(): Promise<Ciudad[]> {
  await connection();
  const [ciudades] = await pool.execute<FilaCiudad[]>(
    "SELECT id_ciudad, nombre, departamento FROM ciudad ORDER BY nombre, departamento",
  );
  return ciudades;
}
