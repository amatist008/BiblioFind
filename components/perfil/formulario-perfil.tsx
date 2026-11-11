"use client";

import { useActionState } from "react";
import type { PerfilActual } from "@/lib/data/perfil";
import { actualizarPerfil } from "@/app/perfil/actions";

const claseCampo =
  "mt-1.5 w-full rounded-xl border border-[#ded8d0] bg-white px-4 py-3 text-sm text-[#291d16] shadow-sm outline-none transition placeholder:text-[#b4aaa1] focus:border-[#9b5635] focus:ring-4 focus:ring-[#9b5635]/10 disabled:opacity-60";

const claseEtiqueta = "block text-sm font-medium text-[#51453d]";

export function FormularioPerfil({ perfil }: { perfil: PerfilActual }) {
  const [state, formAction, isPending] = useActionState(actualizarPerfil, null);
  const persona = perfil.lector ?? perfil.empleado;

  if (!persona) return null;

  const telefono = perfil.lector?.telefono ?? perfil.empleado?.telefono ?? "";
  const calle = perfil.lector?.calle ?? perfil.empleado?.calle ?? "";

  return (
    <section
      id="datos-personales"
      className="scroll-mt-24 rounded-3xl border border-[#e9e1d8] bg-[#fbfaf7] p-6 shadow-[0_20px_60px_-45px_rgba(36,24,17,0.5)] sm:p-8"
    >
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#9b5635]">
          Información de cuenta
        </p>
        <h2 className="mt-2 font-serif text-2xl font-semibold text-[#291d16]">
          Datos personales
        </h2>
        <p className="mt-2 text-sm leading-6 text-[#766a60]">
          El correo se usa para iniciar sesión y no se modifica desde esta página.
        </p>
      </div>

      {perfil.lector && perfil.empleado && (
        <p className="mb-5 rounded-xl border border-[#ead8c7] bg-[#f7efe5] px-4 py-3 text-sm leading-6 text-[#6f4a35]">
          Esta cuenta tiene perfiles de lector y empleado. Al guardar, nombre, apellido y contacto se
          actualizarán en ambos.
        </p>
      )}

      {state?.error && (
        <p role="alert" className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {state.error}
        </p>
      )}
      {state?.success && (
        <p role="status" className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
          {state.success}
        </p>
      )}

      <form action={formAction} className="space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="nombre" className={claseEtiqueta}>Nombre</label>
            <input
              id="nombre"
              name="nombre"
              autoComplete="given-name"
              defaultValue={persona.nombre}
              maxLength={60}
              required
              disabled={isPending}
              className={claseCampo}
            />
          </div>
          <div>
            <label htmlFor="apellido" className={claseEtiqueta}>Apellido</label>
            <input
              id="apellido"
              name="apellido"
              autoComplete="family-name"
              defaultValue={persona.apellido}
              maxLength={60}
              required
              disabled={isPending}
              className={claseCampo}
            />
          </div>
        </div>
        <div>
          <label htmlFor="telefono" className={claseEtiqueta}>Teléfono</label>
          <input
            id="telefono"
            name="telefono"
            type="tel"
            autoComplete="tel"
            defaultValue={telefono}
            maxLength={20}
            disabled={isPending}
            className={claseCampo}
          />
        </div>
        <div>
          <label htmlFor="calle" className={claseEtiqueta}>Dirección</label>
          <input
            id="calle"
            name="calle"
            autoComplete="street-address"
            defaultValue={calle}
            maxLength={120}
            disabled={isPending}
            className={claseCampo}
          />
        </div>
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex min-h-11 items-center justify-center rounded-xl bg-[#211b18] px-5 py-3 text-sm font-semibold text-white shadow-[0_8px_20px_-12px_rgba(33,27,24,0.8)] transition hover:bg-[#3b2d26] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9b5635] disabled:cursor-wait disabled:opacity-70"
        >
          {isPending ? "Guardando..." : "Guardar cambios"}
        </button>
      </form>
    </section>
  );
}
