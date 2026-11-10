import type { Metadata } from "next";
import { CabeceraAuth } from "@/components/auth/cabecera-auth";
import { PanelEditorial } from "@/components/auth/panel-editorial";
import { FormularioLogin } from "./formulario-login";

export const metadata: Metadata = {
  title: "Iniciar sesión",
  description: "Entra a Biblioteca Next para continuar leyendo y gestionar tus pedidos.",
};

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-[#f7f5f0] p-3 text-[#291d16] sm:p-5">
      <div className="grid min-h-[calc(100vh-1.5rem)] grid-cols-1 gap-4 sm:min-h-[calc(100vh-2.5rem)] lg:grid-cols-2">
        <section className="flex min-h-[38rem] flex-col rounded-[1.75rem] px-5 py-6 sm:px-8 sm:py-8 lg:px-10 lg:py-9">
          <CabeceraAuth />
          <div className="mx-auto flex w-full max-w-[26rem] flex-1 items-center py-12">
            <div className="w-full">
              <h1 className="font-serif text-4xl font-semibold leading-tight tracking-tight text-[#291d16] sm:text-[2.7rem]">
                Bienvenido de nuevo
              </h1>
              <p className="mt-3 mb-8 text-sm leading-6 text-[#766a60] sm:text-base">
                Entra para seguir leyendo y gestionar tus pedidos.
              </p>
              <FormularioLogin />
            </div>
          </div>
          <p className="pt-4 text-center text-xs text-[#a49a90]">
            Libros digitales y físicos, en un solo lugar.
          </p>
        </section>
        <PanelEditorial
          imagen="/espiral-lectora.svg"
          textoAlternativo="Espiral artística en tonos verdes y tierra que enmarca a una persona"
          titulo="Tu carné de lector empieza aquí"
          descripcion="Renta libros físicos y digitales desde un solo lugar."
          pie="Diseñado para amantes de la lectura."
        />
      </div>
    </main>
  );
}
