import Link from "next/link";
import { Suspense } from "react";
import { BotonTema } from "@/components/boton-tema";
import { MenuUsuario } from "@/components/menu-usuario";
import { NavegacionPrincipal } from "@/components/navegacion-principal";

export function BarraNavegacion({ ocultarEnLogin = false }: { ocultarEnLogin?: boolean }) {
  return (
    <header className={`border-b border-border bg-card ${ocultarEnLogin ? 'hidden lg:hidden' : ''}`}>
      <div className="mx-auto flex w-full max-w-6xl items-center gap-2 px-4 py-3 sm:px-6 lg:px-8">
        <Suspense fallback={null}>
          <NavegacionPrincipal variante="movil" />
        </Suspense>
        <Link href="/" className="mr-4 font-heading text-lg font-semibold tracking-tight">
          Biblioteca Next
        </Link>
        <Suspense fallback={null}>
          <NavegacionPrincipal variante="barra" />
        </Suspense>
        <div className="ml-auto flex items-center gap-2">
          <BotonTema />
          <Suspense fallback={null}>
            <MenuUsuario />
          </Suspense>
        </div>
      </div>
    </header>
  );
}