"use client";

import Link from "next/link";
import { useActionState } from "react";
import type { Ciudad } from "@/lib/auth/tipos";
import { manejarRegistro } from "./actions";

const claseCampo =
  "mt-1.5 w-full rounded-lg border border-[#ded8d0] bg-white px-3.5 py-2.5 text-sm text-[#291d16] shadow-sm outline-none transition placeholder:text-[#b4aaa1] focus:border-[#9b5635] focus:ring-4 focus:ring-[#9b5635]/10 disabled:opacity-60";

const claseEtiqueta = "block text-xs font-medium text-[#51453d]";

export function FormularioRegistro({ ciudades }: { ciudades: Ciudad[] }) {
  const [state, formAction, isPending] = useActionState(manejarRegistro, null);

  return (
    <>
      {state?.error && (
        <p role="alert" className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {state.error}
        </p>
      )}
      {state?.success && (
        <div role="status" className="mb-5 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm leading-6 text-emerald-900">
          {state.success}
        </div>
      )}
      <form action={formAction} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="nombre" className={claseEtiqueta}>Nombre</label>
            <input id="nombre" name="nombre" autoComplete="given-name" maxLength={60} required disabled={isPending} className={claseCampo} />
          </div>
          <div>
            <label htmlFor="apellido" className={claseEtiqueta}>Apellido</label>
            <input id="apellido" name="apellido" autoComplete="family-name" maxLength={60} required disabled={isPending} className={claseCampo} />
          </div>
        </div>

        <div>
          <label htmlFor="fecha_nacimiento" className={claseEtiqueta}>Fecha de nacimiento</label>
          <input id="fecha_nacimiento" name="fecha_nacimiento" type="date" autoComplete="bday" required disabled={isPending} className={claseCampo} />
          <p className="mt-1.5 text-[0.7rem] leading-5 text-[#93877d]">Algunos libros tienen clasificación por edad.</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-[minmax(0,0.72fr)_minmax(0,1.5fr)]">
          <div>
            <label htmlFor="tipo_documento" className={claseEtiqueta}>Documento</label>
            <select id="tipo_documento" name="tipo_documento" required disabled={isPending} defaultValue="CC" className={claseCampo}>
              <option value="CC">Cédula (CC)</option>
              <option value="TI">Tarjeta de identidad (TI)</option>
              <option value="CE">Cédula de extranjería (CE)</option>
              <option value="PASAPORTE">Pasaporte</option>
            </select>
          </div>
          <div>
            <label htmlFor="numero_documento" className={claseEtiqueta}>Número de documento</label>
            <input id="numero_documento" name="numero_documento" autoComplete="off" maxLength={20} required disabled={isPending} className={claseCampo} />
            <p className="mt-1.5 text-[0.7rem] leading-5 text-[#93877d]">Lo cotejamos con el original cuando visites una sede.</p>
          </div>
        </div>

        <div>
          <label htmlFor="telefono" className={claseEtiqueta}>Teléfono</label>
          <input id="telefono" name="telefono" type="tel" autoComplete="tel" maxLength={20} required disabled={isPending} className={claseCampo} />
        </div>

        <div>
          <label htmlFor="calle" className={claseEtiqueta}>Dirección</label>
          <input id="calle" name="calle" autoComplete="street-address" maxLength={120} required disabled={isPending} placeholder="Cra. 5 # 10-20" className={claseCampo} />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="id_ciudad" className={claseEtiqueta}>Ciudad</label>
            <select id="id_ciudad" name="id_ciudad" required disabled={isPending} defaultValue="" className={claseCampo}>
              <option value="" disabled>Elige...</option>
              {ciudades.map((ciudad) => (
                <option key={ciudad.id_ciudad} value={ciudad.id_ciudad}>
                  {ciudad.nombre}, {ciudad.departamento}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="codigo_postal" className={claseEtiqueta}>
              Código postal <span className="text-[#93877d]">(opcional)</span>
            </label>
            <input id="codigo_postal" name="codigo_postal" autoComplete="postal-code" maxLength={10} disabled={isPending} className={claseCampo} />
          </div>
        </div>

        <div>
          <label htmlFor="correo" className={claseEtiqueta}>Correo</label>
          <input id="correo" name="correo" type="email" autoComplete="email" maxLength={254} required disabled={isPending} placeholder="tu@correo.com" className={claseCampo} />
        </div>

        <div>
          <label htmlFor="password" className={claseEtiqueta}>Contraseña</label>
          <input id="password" name="password" type="password" autoComplete="new-password" required disabled={isPending} placeholder="Crea una contraseña" className={claseCampo} />
        </div>

        <button
          type="submit"
          disabled={isPending || ciudades.length === 0}
          className="w-full rounded-lg bg-[#211b18] px-5 py-3 text-sm font-semibold text-white shadow-[0_8px_20px_-12px_rgba(33,27,24,0.8)] transition hover:bg-[#3b2d26] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9b5635] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? "Creando cuenta..." : "Crear cuenta"}
        </button>
      </form>
      {ciudades.length === 0 && (
        <p role="alert" className="mt-3 text-sm text-red-800">
          No hay ciudades disponibles. Inténtalo más tarde.
        </p>
      )}
      <p className="mt-6 text-center text-sm text-[#766a60]">
        ¿Ya tienes cuenta?{" "}
        <Link href="/login" className="font-semibold text-[#76503d] underline decoration-[#c6a68c] underline-offset-4 hover:text-[#291d16]">
          Inicia sesión
        </Link>
      </p>
    </>
  );
}
