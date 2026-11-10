import type { Metadata } from "next";
import { CabeceraAuth } from "@/components/auth/cabecera-auth";
import { PanelEditorial } from "@/components/auth/panel-editorial";
import { obtenerCiudades } from "@/lib/data/autenticacion";
import { FormularioRegistro } from "./formulario-registro";

export const metadata: Metadata = {
  title: "Crear cuenta de lector",
  description: "Crea tu cuenta en Biblioteca Next y descubre miles de historias.",
};

export default async function RegisterPage() {
  const ciudades = await obtenerCiudades();

  return (
    <main className="min-h-screen bg-[#f7f5f0] p-3 text-[#291d16] sm:p-5">
      <div className="grid min-h-[calc(100vh-1.5rem)] grid-cols-1 gap-4 sm:min-h-[calc(100vh-2.5rem)] lg:grid-cols-[minmax(0,1fr)_minmax(0,0.98fr)]">
        <PanelEditorial
          imagen="/pueblo-de-historias.svg"
          textoAlternativo="Ilustración de un pueblo de casas-libro junto a un canal iluminado"
          titulo="Únete a nuestra comunidad lectora"
          descripcion="Gestiona tus préstamos y descubre miles de historias en un solo lugar."
          pie="Empieza tu viaje hoy."
        />
        <section className="flex flex-col px-5 py-6 sm:px-8 sm:py-8 lg:px-10 lg:py-9">
          <CabeceraAuth />
          <div className="mx-auto w-full max-w-[38rem] flex-1 py-10 lg:py-3">
            <h1 className="font-serif text-3xl font-semibold leading-tight tracking-tight text-[#291d16] sm:text-4xl">
              Crea tu cuenta de lector
            </h1>
            <p className="mt-3 mb-7 max-w-2xl text-sm leading-6 text-[#766a60]">
              Con la cuenta verificada puedes reservar y leer libros digitales. Para llevarte libros físicos,
              presenta tu documento en cualquier sede.
            </p>
            <FormularioRegistro ciudades={ciudades} />
          </div>
        </section>
      </div>
    </main>
  );
}
