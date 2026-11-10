"use client";

import Link from "next/link";
import { useActionState } from "react";
import { manejarLogin } from "./actions";

export function FormularioLogin() {
  const [state, formAction, isPending] = useActionState(manejarLogin, null);

  return (
    <div>
      {state?.error && (
        <p role="alert" className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {state.error}
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
            placeholder="tu@correo.com"
            className="w-full rounded-xl border border-[#ded8d0] bg-white px-4 py-3 text-sm text-[#291d16] shadow-sm outline-none transition placeholder:text-[#b4aaa1] focus:border-[#9b5635] focus:ring-4 focus:ring-[#9b5635]/10 disabled:opacity-60"
          />
        </div>
        <div>
          <div className="mb-2 flex items-center justify-between gap-3">
            <label htmlFor="password" className="text-xs font-semibold uppercase tracking-[0.12em] text-[#74675d]">
              Contraseña
            </label>
            <Link href="/forgot-password" className="text-xs font-semibold text-[#76503d] underline decoration-[#c6a68c] underline-offset-4 hover:text-[#291d16]">
              ¿La olvidaste?
            </Link>
          </div>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            disabled={isPending}
            placeholder="Tu contraseña"
            className="w-full rounded-xl border border-[#ded8d0] bg-white px-4 py-3 text-sm text-[#291d16] shadow-sm outline-none transition placeholder:text-[#b4aaa1] focus:border-[#9b5635] focus:ring-4 focus:ring-[#9b5635]/10 disabled:opacity-60"
          />
        </div>
        <label className="flex cursor-pointer items-center gap-3 text-sm text-[#766a60]">
          <input
            type="checkbox"
            name="recordar"
            value="true"
            disabled={isPending}
            className="size-4 rounded border-[#c9bfb5] accent-[#33241c] focus:ring-[#9b5635]"
          />
          Mantener sesión iniciada
        </label>
        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-xl bg-[#211b18] px-5 py-3.5 text-sm font-semibold text-white shadow-[0_8px_20px_-12px_rgba(33,27,24,0.8)] transition hover:bg-[#3b2d26] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9b5635] disabled:cursor-wait disabled:opacity-70"
        >
          {isPending ? "Verificando..." : "Entrar"}
        </button>
      </form>
      <p className="mt-7 text-center text-sm text-[#766a60]">
        ¿No tienes cuenta?{" "}
        <Link href="/register" className="font-semibold text-[#76503d] underline decoration-[#c6a68c] underline-offset-4 hover:text-[#291d16]">
          Regístrate
        </Link>
      </p>
    </div>
  );
}
