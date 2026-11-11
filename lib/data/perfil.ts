import "server-only";
import type { RowDataPacket } from "mysql2/promise";
import { obtenerIdCuentaDeSesion } from "@/lib/auth/sesion";
import { pool } from "@/lib/db";

export type EstadisticasLector = {
  prestamosFisicos: number;
  prestamosFisicosActivos: number;
  prestamosDigitalesActivos: number;
  reservasActivas: number;
};

export type PerfilLector = {
  idLector: number;
  nombre: string;
  apellido: string;
  fechaNacimiento: string;
  telefono: string | null;
  calle: string | null;
  ciudad: string | null;
  tipoLector: string;
  documentoValidado: boolean;
  estadisticas: EstadisticasLector;
};

export type PerfilEmpleado = {
  idEmpleado: number;
  nombre: string;
  apellido: string;
  telefono: string | null;
  calle: string | null;
  rol: "bibliotecario" | "coordinador" | "admin_red";
  fechaContratacion: string;
  sede: string | null;
};

export type PerfilActual = {
  idCuenta: number;
  correo: string;
  fechaRegistro: string;
  lector: PerfilLector | null;
  empleado: PerfilEmpleado | null;
};

type FilaPerfil = {
  id_cuenta: number;
  correo: string;
  fecha_registro: string;
  id_lector: number | null;
  lector_nombre: string | null;
  lector_apellido: string | null;
  fecha_nacimiento: string | null;
  lector_telefono: string | null;
  lector_calle: string | null;
  ciudad: string | null;
  tipo_lector: string | null;
  fecha_validacion: Date | string | null;
  id_empleado: number | null;
  empleado_activo: number | null;
  empleado_nombre: string | null;
  empleado_apellido: string | null;
  empleado_telefono: string | null;
  empleado_calle: string | null;
  rol: PerfilEmpleado["rol"] | null;
  fecha_contratacion: string | null;
  sede: string | null;
} & RowDataPacket;

type FilaEstadisticas = {
  prestamos_fisicos: number;
  prestamos_fisicos_activos: number;
  prestamos_digitales_activos: number;
  reservas_activas: number;
} & RowDataPacket;

function fechaRequerida(valor: string | null, columna: string): string {
  if (valor === null) {
    throw new Error(`El perfil tiene un dato requerido vacío: ${columna}.`);
  }
  return valor;
}

export async function obtenerPerfilActual(): Promise<PerfilActual | null> {
  const idCuenta = await obtenerIdCuentaDeSesion();
  if (idCuenta === null) return null;

  const [filas] = await pool.execute<FilaPerfil[]>(
    `SELECT c.id_cuenta, c.correo, DATE_FORMAT(c.fecha_registro, '%Y-%m-%d') AS fecha_registro,
            l.id_lector, l.nombre AS lector_nombre, l.apellido AS lector_apellido,
            DATE_FORMAT(l.fecha_nacimiento, '%Y-%m-%d') AS fecha_nacimiento,
            l.telefono AS lector_telefono, l.calle AS lector_calle,
            ci.nombre AS ciudad, tl.nombre AS tipo_lector, l.fecha_validacion,
            e.id_empleado, e.activo AS empleado_activo,
            e.nombre AS empleado_nombre, e.apellido AS empleado_apellido,
            e.telefono AS empleado_telefono, e.calle AS empleado_calle,
            e.rol, DATE_FORMAT(e.fecha_contratacion, '%Y-%m-%d') AS fecha_contratacion, s.nombre AS sede
     FROM cuenta c
     LEFT JOIN lector l ON l.id_cuenta = c.id_cuenta
     LEFT JOIN ciudad ci ON ci.id_ciudad = l.id_ciudad
     LEFT JOIN tipo_lector tl ON tl.id_tipo_lector = l.id_tipo_lector
     LEFT JOIN empleado e ON e.id_cuenta = c.id_cuenta
     LEFT JOIN sede s ON s.id_sede = e.id_sede
     WHERE c.id_cuenta = ?
       AND c.fecha_verificacion IS NOT NULL
       AND c.fecha_desactivacion IS NULL`,
    [idCuenta],
  );
  const fila = filas[0];
  if (!fila) return null;

  const lector: PerfilLector | null = fila.id_lector !== null
    ? {
        idLector: fila.id_lector,
        nombre: fila.lector_nombre ?? "",
        apellido: fila.lector_apellido ?? "",
        fechaNacimiento: fechaRequerida(fila.fecha_nacimiento, "lector.fecha_nacimiento"),
        telefono: fila.lector_telefono,
        calle: fila.lector_calle,
        ciudad: fila.ciudad,
        tipoLector: fila.tipo_lector ?? "Lector",
        documentoValidado: fila.fecha_validacion !== null,
        estadisticas: { prestamosFisicos: 0, prestamosFisicosActivos: 0, prestamosDigitalesActivos: 0, reservasActivas: 0 },
      }
    : null;

  const empleado: PerfilEmpleado | null = fila.id_empleado !== null
    && fila.empleado_activo === 1
    && fila.rol !== null
    && fila.fecha_contratacion !== null
    ? {
        idEmpleado: fila.id_empleado,
        nombre: fila.empleado_nombre ?? "",
        apellido: fila.empleado_apellido ?? "",
        telefono: fila.empleado_telefono,
        calle: fila.empleado_calle,
        rol: fila.rol,
        fechaContratacion: fechaRequerida(fila.fecha_contratacion, "empleado.fecha_contratacion"),
        sede: fila.sede,
      }
    : null;

  if (!lector && !empleado) return null;

  if (lector) {
    const [estadisticas] = await pool.execute<FilaEstadisticas[]>(
      `SELECT
         (SELECT COUNT(*) FROM prestamo_fisico WHERE id_lector = ?) AS prestamos_fisicos,
         (SELECT COUNT(*) FROM prestamo_fisico WHERE id_lector = ? AND fecha_devolucion IS NULL) AS prestamos_fisicos_activos,
         (SELECT COUNT(*) FROM prestamo_digital
          WHERE id_lector = ? AND fecha_devolucion IS NULL AND fecha_fin > NOW()) AS prestamos_digitales_activos,
         ((SELECT COUNT(*) FROM reserva_fisica WHERE id_lector = ? AND estado IN ('activa', 'asignada'))
          + (SELECT COUNT(*) FROM reserva_digital WHERE id_lector = ? AND estado IN ('activa', 'asignada'))) AS reservas_activas`,
      [lector.idLector, lector.idLector, lector.idLector, lector.idLector, lector.idLector],
    );
    const cuenta = estadisticas[0];
    lector.estadisticas = {
      prestamosFisicos: Number(cuenta?.prestamos_fisicos ?? 0),
      prestamosFisicosActivos: Number(cuenta?.prestamos_fisicos_activos ?? 0),
      prestamosDigitalesActivos: Number(cuenta?.prestamos_digitales_activos ?? 0),
      reservasActivas: Number(cuenta?.reservas_activas ?? 0),
    };
  }

  return {
    idCuenta: fila.id_cuenta,
    correo: fila.correo,
    fechaRegistro: fechaRequerida(fila.fecha_registro, "cuenta.fecha_registro"),
    lector,
    empleado,
  };
}
