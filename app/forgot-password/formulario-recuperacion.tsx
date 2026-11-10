"use client";

import Link from "next/link";
import { useActionState } from "react";
import { solicitarRecuperacion } from "./actions";

export function FormularioRecuperacion() {
  const [state, formAction, isPending] = useActionState(solicitarRecuperacion, null);

  return (
    <>
      {state?.error && (
        <p role="alert" className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {state.error}
        </p>
      )}
      {state?.success && (
        <p role="status" className="mb-5 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm leading-6 text-emerald-900">
          {state.success}
        </p>
      )}
      <form action={formAction} className="space-y-5">
        <div>
          <label htmlFor="correo" className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-[#74675d]">
            Correo
          </label>
          <input
            id="correo"
            name="correo"
            type="email"
            autoComplete="email"
            required
            disabled={isPending}
            className="w-full rounded-xl border border-[#ded8d0] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#9b5635] focus:ring-4 focus:ring-[#9b5635]/10 disabled:opacity-60"
          />
        </div>
        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-xl bg-[#211b18] px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-[#3b2d26] disabled:cursor-wait disabled:opacity-70"
        >
          {isPending ? "Preparando enlace..." : "Enviar instrucciones"}
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-[#766a60]">
        <Link href="/login" className="font-semibold text-[#76503d] underline underline-offset-4">
          Volver a iniciar sesión
        </Link>
      </p>
    </>
  );
}
