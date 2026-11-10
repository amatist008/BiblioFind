"use client";

import Link from "next/link";
import { useActionState } from "react";
import type { EstadoAuth } from "@/lib/auth/tipos";
import { verificarCorreo } from "./actions";

export function FormularioVerificacion({ token }: { token: string }) {
  const action = verificarCorreo.bind(null, token);
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
        <form action={formAction}>
          <input type="hidden" name="confirmar" value="true" />
          <button type="submit" disabled={isPending} className="w-full rounded-xl bg-[#211b18] px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-[#3b2d26] disabled:cursor-wait disabled:opacity-70">
            {isPending ? "Verificando..." : "Verificar mi correo"}
          </button>
        </form>
      )}
      <p className="mt-6 text-center text-sm text-[#766a60]">
        <Link href="/login" className="font-semibold text-[#76503d] underline underline-offset-4">
          Ir a iniciar sesión
        </Link>
      </p>
    </>
  );
}
