"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const rutasDeCuenta = ["/login", "/register", "/forgot-password", "/reset-password", "/verify-email"];

export function EncabezadoSitio() {
  const pathname = usePathname();
  const esRutaDeCuenta = rutasDeCuenta.some(
    (ruta) => pathname === ruta || pathname.startsWith(`${ruta}/`),
  );

  if (esRutaDeCuenta) return null;

  return (
    <header className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-2xl font-semibold tracking-tight">
          BiblioFind
        </Link>
        <Link
          href="/login"
          className="rounded-sm border-2 border-black bg-[#2E01F7] px-4 py-2 text-sm font-semibold uppercase text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
        >
          Iniciar sesión
        </Link>
      </div>
    </header>
  );
}
