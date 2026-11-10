"use client";

import Link from "next/link";
import { useActionState } from "react";
import type { EstadoAuth } from "@/lib/auth/tipos";
import { cambiarContrasena } from "./actions";

export function FormularioNuevaContrasena({ token }: { token: string }) {
  const action = cambiarContrasena.bind(null, token);
  const [state, formAction, isPending] = useActionState<EstadoAuth, FormData>(action, null);

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
      {!state?.success && (
        <form action={formAction} className="space-y-5">
          <div>
            <label htmlFor="password" className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-[#74675d]">
              Nueva contraseña
            </label>
            <input id="password" name="password" type="password" autoComplete="new-password" required disabled={isPending} className="w-full rounded-xl border border-[#ded8d0] bg-white px-4 py-3 text-sm outline-none focus:border-[#9b5635] focus:ring-4 focus:ring-[#9b5635]/10 disabled:opacity-60" />
          </div>
          <div>
            <label htmlFor="confirmar_password" className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-[#74675d]">
              Confirma la contraseña
            </label>
            <input id="confirmar_password" name="confirmar_password" type="password" autoComplete="new-password" required disabled={isPending} className="w-full rounded-xl border border-[#ded8d0] bg-white px-4 py-3 text-sm outline-none focus:border-[#9b5635] focus:ring-4 focus:ring-[#9b5635]/10 disabled:opacity-60" />
          </div>
          <button type="submit" disabled={isPending} className="w-full rounded-xl bg-[#211b18] px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-[#3b2d26] disabled:cursor-wait disabled:opacity-70">
            {isPending ? "Guardando..." : "Guardar contraseña nueva"}
          </button>
        </form>
      )}
      <p className="mt-6 text-center text-sm text-[#766a60]">
        <Link href="/login" className="font-semibold text-[#76503d] underline underline-offset-4">
          Volver a iniciar sesión
        </Link>
      </p>
    </>
  );
}
