"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AvatarPerfil } from "@/components/perfil/avatar-perfil";

const rutasDeCuenta = ["/login", "/register", "/forgot-password", "/reset-password", "/verify-email", "/perfil"];

type EncabezadoSitioProps = {
  cuenta: { idCuenta: number } | null;
};

export function EncabezadoSitio({ cuenta }: EncabezadoSitioProps) {
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
        <nav aria-label="Navegación de cuenta" className="flex items-center gap-3 sm:gap-4">
          {cuenta ? (
            <>
              <Link
                href="/perfil"
                className="rounded-lg px-2 py-2 text-sm font-medium text-zinc-600 transition-colors duration-200 hover:text-zinc-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9b5635] dark:text-zinc-300 dark:hover:text-white"
              >
                Mi perfil
              </Link>
              <Link
                href="/perfil"
                aria-label="Abrir mi perfil"
                className="rounded-full transition duration-200 hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9b5635]"
              >
                <AvatarPerfil
                  idCuenta={cuenta.idCuenta}
                  nombre="tu perfil"
                  size="sm"
                />
              </Link>
            </>
          ) : (
            <Link
              href="/login"
              className="rounded-sm border-2 border-black bg-[#2E01F7] px-4 py-2 text-xs font-semibold uppercase text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all duration-200 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9b5635] sm:text-sm"
            >
              Iniciar sesión
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
