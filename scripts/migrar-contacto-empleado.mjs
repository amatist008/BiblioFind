import { readFile } from "node:fs/promises";
import mysql from "mysql2/promise";

function required(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Define ${name} antes de ejecutar la migración.`);
  }
  return value;
}

async function main() {
  const migration = await readFile(
    new URL("../db/migrations/20261111_contacto_empleado.sql", import.meta.url),
    "utf8",
  );
  const connection = await mysql.createConnection({
    host: required("DB_HOST"),
    port: Number(required("DB_PORT")),
    user: required("MYSQL_USER"),
    password: required("MYSQL_PASSWORD"),
    database: required("MYSQL_DATABASE"),
  });

  try {
    const statements = migration
      .split(/;\s*(?:\r?\n|$)/)
      .map((statement) => statement.trim())
      .filter(Boolean);

    for (const statement of statements) {
      const column = statement.match(/ADD COLUMN\s+([a-zA-Z0-9_]+)/i)?.[1];
      if (!column) {
        throw new Error("La migración contiene una instrucción distinta a ADD COLUMN.");
      }

      const [columns] = await connection.execute(
        `SELECT COUNT(*) AS cantidad
         FROM information_schema.columns
         WHERE table_schema = DATABASE() AND table_name = 'empleado' AND column_name = ?`,
        [column],
      );
      if (columns[0].cantidad === 0) {
        await connection.query(statement);
      }
    }

    console.info("Migración de teléfono y dirección de empleado aplicada.");
  } finally {
    await connection.end();
  }
}

main().catch((error) => {
  console.error(`No se pudo aplicar la migración de perfil: ${error.message}`);
  process.exitCode = 1;
});
