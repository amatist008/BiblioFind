"use server";

import { Buffer } from "node:buffer";
import bcrypt from "bcrypt";
import type { ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { crearTokenCuenta, crearUrlCuenta, hashTokenCuenta } from "@/lib/auth/tokens";
import type { EstadoAuth } from "@/lib/auth/tipos";
import { pool } from "@/lib/db";

type FilaId = { id: number } & RowDataPacket;
type TipoDocumento = "CC" | "TI" | "CE" | "PASAPORTE";

function valorTexto(formData: FormData, nombre: string): string {
  const valor = formData.get(nombre);
  return typeof valor === "string" ? valor.trim() : "";
}

function fechaNacimientoValida(valor: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(valor)) return false;
  const fecha = new Date(`${valor}T00:00:00.000Z`);
  return !Number.isNaN(fecha.valueOf())
    && fecha.toISOString().slice(0, 10) === valor
    && valor <= new Date().toISOString().slice(0, 10);
}

function edadAlDiaDeHoy(fechaNacimiento: string): number {
  const fecha = new Date(`${fechaNacimiento}T00:00:00.000Z`);
  const hoy = new Date();
  let edad = hoy.getUTCFullYear() - fecha.getUTCFullYear();
  if (
    hoy.getUTCMonth() < fecha.getUTCMonth()
    || (hoy.getUTCMonth() === fecha.getUTCMonth() && hoy.getUTCDate() < fecha.getUTCDate())
  ) {
    edad -= 1;
  }
  return edad;
}

function esDuplicado(error: unknown): boolean {
  return typeof error === "object"
    && error !== null
    && "code" in error
    && error.code === "ER_DUP_ENTRY";
}

export async function manejarRegistro(
  _estadoAnterior: EstadoAuth,
  formData: FormData,
): Promise<EstadoAuth> {
  const nombre = valorTexto(formData, "nombre");
  const apellido = valorTexto(formData, "apellido");
  const fechaNacimiento = valorTexto(formData, "fecha_nacimiento");
  const tipoDocumento = valorTexto(formData, "tipo_documento");
  const numeroDocumento = valorTexto(formData, "numero_documento");
  const telefono = valorTexto(formData, "telefono");
  const calle = valorTexto(formData, "calle");
  const ciudadTexto = valorTexto(formData, "id_ciudad");
  const codigoPostal = valorTexto(formData, "codigo_postal");
  const correo = valorTexto(formData, "correo").toLowerCase();
  const passwordValor = formData.get("password");
  const password = typeof passwordValor === "string" ? passwordValor : "";
  const idCiudad = Number(ciudadTexto);
  const tiposDocumento: TipoDocumento[] = ["CC", "TI", "CE", "PASAPORTE"];

  if (!nombre || !apellido || !fechaNacimiento || !tipoDocumento || !numeroDocumento
    || !telefono || !calle || !ciudadTexto || !correo || !password) {
    return { error: "Completa todos los campos obligatorios." };
  }
  if (nombre.length > 60 || apellido.length > 60 || telefono.length > 20
    || calle.length > 120 || codigoPostal.length > 10 || numeroDocumento.length > 20
    || correo.length > 254) {
    return { error: "Uno o más campos superan la longitud permitida." };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
    return { error: "Escribe un correo válido." };
  }
  if (Buffer.byteLength(password, "utf8") > 72) {
    return { error: "La contraseña no puede superar los 72 bytes." };
  }
  if (!fechaNacimientoValida(fechaNacimiento)) {
    return { error: "Selecciona una fecha de nacimiento válida." };
  }
  const tipoDocumentoValido = tiposDocumento.find((tipo) => tipo === tipoDocumento);
  if (!tipoDocumentoValido) {
    return { error: "Selecciona un tipo de documento válido." };
  }
  if (!Number.isSafeInteger(idCiudad) || idCiudad < 1) {
    return { error: "Selecciona una ciudad válida." };
  }

  if (process.env.NODE_ENV !== "development") {
    return { error: "El registro requiere configurar el envío de correo antes de habilitarse fuera del entorno de desarrollo." };
  }

  const edad = edadAlDiaDeHoy(fechaNacimiento);
  const tipoLector = edad < 18 ? "Infantil" : "Estándar";
  const token = crearTokenCuenta();
  let urlVerificacion: string;

  try {
    urlVerificacion = crearUrlCuenta(`/verify-email/${token}`);
  } catch (error) {
    console.error("No se pudo preparar la verificación del correo:", error);
    return { error: "No se pudo preparar el enlace de verificación. Revisa la configuración de la aplicación." };
  }

  let ciudades: FilaId[];
  let tipos: FilaId[];
  try {
    [ciudades] = await pool.execute<FilaId[]>(
      "SELECT id_ciudad AS id FROM ciudad WHERE id_ciudad = ?",
      [idCiudad],
    );
    [tipos] = await pool.execute<FilaId[]>(
      "SELECT id_tipo_lector AS id FROM tipo_lector WHERE nombre = ?",
      [tipoLector],
    );
  } catch (error) {
    console.error("Error al consultar los datos del registro:", error);
    return { error: "No se pudo completar el registro. Inténtalo más tarde." };
  }
  if (!ciudades[0]) return { error: "La ciudad seleccionada ya no está disponible." };
  if (!tipos[0]) {
    console.error(`No existe el tipo de lector requerido: ${tipoLector}.`);
    return { error: "No se pudo completar el registro. Inténtalo más tarde." };
  }

  const conexion = await pool.getConnection();
  try {
    await conexion.beginTransaction();
    const hashContrasena = await bcrypt.hash(password, 10);
    const [cuenta] = await conexion.execute<ResultSetHeader>(
      "INSERT INTO cuenta (correo, password_hash) VALUES (?, ?)",
      [correo, hashContrasena],
    );
    await conexion.execute<ResultSetHeader>(
      `INSERT INTO lector
         (id_cuenta, id_tipo_lector, nombre, apellido, fecha_nacimiento, telefono, calle,
          codigo_postal, id_ciudad, tipo_documento, numero_documento)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        cuenta.insertId,
        tipos[0].id,
        nombre,
        apellido,
        fechaNacimiento,
        telefono,
        calle,
        codigoPostal || null,
        idCiudad,
        tipoDocumentoValido,
        numeroDocumento,
      ],
    );
    await conexion.execute<ResultSetHeader>(
      `INSERT INTO token_cuenta (id_cuenta, token_hash, tipo, expira_en)
       VALUES (?, ?, 'verificar_correo', DATE_ADD(NOW(), INTERVAL 24 HOUR))`,
      [cuenta.insertId, hashTokenCuenta(token)],
    );
    await conexion.commit();
  } catch (error) {
    await conexion.rollback();
    if (esDuplicado(error)) {
      return { error: "Ya existe una cuenta con ese correo o documento." };
    }
    console.error("Error en el registro:", error);
    return { error: "Ocurrió un error en el servidor al registrarse." };
  } finally {
    conexion.release();
  }

  console.info(`Enlace de verificación para ${correo}: ${urlVerificacion}`);
  return {
    success: "Cuenta creada. En desarrollo, el enlace de verificación quedó en la terminal del servidor.",
  };
}
