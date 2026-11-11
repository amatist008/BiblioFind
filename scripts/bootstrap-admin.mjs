import { Buffer } from "node:buffer";
import bcrypt from "bcrypt";
import mysql from "mysql2/promise";

function required(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Define ${name} en el entorno antes de continuar.`);
  }
  return value;
}

function fechaValida(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(date.valueOf()) && date.toISOString().slice(0, 10) === value;
}

async function main() {
  const correo = required("ADMIN_EMAIL").trim().toLowerCase();
  const nombre = required("ADMIN_NOMBRE").trim();
  const apellido = required("ADMIN_APELLIDO").trim();
  const password = required("ADMIN_PASSWORD");
  const fechaContratacion = process.env.ADMIN_FECHA_CONTRATACION?.trim() || null;

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo) || correo.length > 254) {
    throw new Error("ADMIN_EMAIL debe ser un correo válido de hasta 254 caracteres.");
  }
  if (!nombre || nombre.length > 60 || !apellido || apellido.length > 60) {
    throw new Error("ADMIN_NOMBRE y ADMIN_APELLIDO deben tener entre 1 y 60 caracteres.");
  }
  if (Array.from(password).length < 12 || Buffer.byteLength(password, "utf8") > 72) {
    throw new Error("ADMIN_PASSWORD debe tener al menos 12 caracteres y no superar 72 bytes UTF-8.");
  }
  if (fechaContratacion && !fechaValida(fechaContratacion)) {
    throw new Error("ADMIN_FECHA_CONTRATACION debe tener formato YYYY-MM-DD.");
  }

  const dbHost = required("DB_HOST");
  const dbPort = Number(required("DB_PORT"));
  const dbUser = required("MYSQL_USER");
  const dbPassword = process.env.MYSQL_PASSWORD;
  const dbName = required("MYSQL_DATABASE");
  if (!Number.isInteger(dbPort) || dbPort < 1 || dbPort > 65535) {
    throw new Error("DB_PORT debe ser un puerto válido.");
  }
  if (dbPassword === undefined) {
    throw new Error("Define MYSQL_PASSWORD en el entorno antes de continuar.");
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const connection = await mysql.createConnection({
    host: dbHost,
    port: dbPort,
    user: dbUser,
    password: dbPassword,
    database: dbName,
  });

  let transactionOpen = false;
  try {
    await connection.beginTransaction();
    transactionOpen = true;

    const [cuentas] = await connection.execute(
      `SELECT id_cuenta, fecha_desactivacion
       FROM cuenta
       WHERE correo = ?
       FOR UPDATE`,
      [correo],
    );

    let idCuenta;
    let cuentaCreada = false;
    if (cuentas[0]) {
      if (cuentas[0].fecha_desactivacion) {
        throw new Error("La cuenta ya existe y está desactivada; no se modificó.");
      }
      idCuenta = cuentas[0].id_cuenta;
      await connection.execute(
        `UPDATE cuenta
         SET password_hash = ?, fecha_verificacion = COALESCE(fecha_verificacion, NOW())
         WHERE id_cuenta = ?`,
        [passwordHash, idCuenta],
      );
    } else {
      const [cuenta] = await connection.execute(
        `INSERT INTO cuenta (correo, password_hash, fecha_verificacion)
         VALUES (?, ?, NOW())`,
        [correo, passwordHash],
      );
      idCuenta = cuenta.insertId;
      cuentaCreada = true;
    }

    const [empleados] = await connection.execute(
      `SELECT id_empleado, rol, activo
       FROM empleado
       WHERE id_cuenta = ?
       FOR UPDATE`,
      [idCuenta],
    );

    let empleadoCreado = false;
    if (empleados[0]) {
      if (empleados[0].rol !== "admin_red") {
        throw new Error("El correo ya pertenece a un empleado sin rol admin_red; no se modificó.");
      }
      if (!empleados[0].activo) {
        throw new Error("El empleado administrador existe pero está inactivo; no se modificó.");
      }
      await connection.execute(
        `UPDATE empleado
         SET nombre = ?, apellido = ?
         WHERE id_empleado = ?`,
        [nombre, apellido, empleados[0].id_empleado],
      );
    } else {
      await connection.execute(
        `INSERT INTO empleado (id_cuenta, nombre, apellido, rol, id_sede, fecha_contratacion)
         VALUES (?, ?, ?, 'admin_red', NULL, COALESCE(?, CURDATE()))`,
        [idCuenta, nombre, apellido, fechaContratacion],
      );
      empleadoCreado = true;
    }

    await connection.commit();
    transactionOpen = false;

    const estadoCuenta = cuentaCreada ? "creada" : "actualizada";
    const estadoEmpleado = empleadoCreado ? "creado" : "actualizado";
    console.info(`Administrador ${correo} listo: cuenta ${estadoCuenta}, perfil admin_red ${estadoEmpleado}.`);
  } catch (error) {
    if (transactionOpen) await connection.rollback();
    throw error;
  } finally {
    await connection.end();
  }
}

main().catch((error) => {
  console.error(`No se pudo preparar el administrador: ${error.message}`);
  process.exitCode = 1;
});
