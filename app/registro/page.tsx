import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { FormularioRegistro } from "@/components/formularios-lector";
import { listarCiudades } from "@/lib/data/lectores";
import { obtenerUsuario } from "@/lib/sesion";
import { BotonTema } from "@/components/boton-tema";

export const metadata: Metadata = { title: "Crear cuenta" };

export default async function PaginaRegistro({ searchParams }: PageProps<"/registro">) {
  if (await obtenerUsuario()) redirect("/cuenta"); // ya conectado
  const { enviado } = await searchParams;
  const ciudades = await listarCiudades();

  return (
    <div className="fixed inset-0 z-50 w-full h-full flex bg-[#fbf9f6] text-[#1c1917] font-sans overflow-hidden">
      
      {/* ================= COLUMNA IZQUIERDA: TARJETA FLOTANTE CON IMAGEN (EFECTO ESPEJO) ================= */}
      <div className="hidden lg:flex lg:w-1/2 p-6 items-center justify-center">
        <div className="w-full h-full bg-[#0B132B] rounded-[32px] relative overflow-hidden flex flex-col justify-between p-12 shadow-2xl border border-stone-800">
          
          {/* Imagen de fondo (cambia el nombre por tu archivo JPG real en public/) */}
          <img 
            src="/light-background-register.jpeg" 
            alt="Ilustración Registro BiblioFind" 
            className="absolute inset-0 w-full h-full object-cover opacity-75"
          />

          {/* Capa oscura para contraste perfecto */}
          <div className="absolute inset-0 bg-[#0B132B]/40"></div>

          <div className="relative z-10">
            <span className="text-xs uppercase tracking-widest text-[#E9D8A6] font-semibold">
              BIBLIOFIND
            </span>
          </div>

          <div className="relative z-10 max-w-md space-y-4 my-auto">
            <h2 className="text-4xl font-bold tracking-tight text-[#F4F1DE] font-serif leading-tight">
              Únete a nuestra <br />comunidad lectora
            </h2>
            <p className="text-[#E9D8A6] text-base leading-relaxed">
              Gestiona tus préstamos y descubre miles de historias en un solo lugar.
            </p>
          </div>

          <div className="relative z-10 text-xs text-[#F4F1DE]/60">
            Empieza tu viaje hoy.
          </div>

        </div>
      </div>

      {/* ================= COLUMNA DERECHA: FORMULARIO DE REGISTRO CON SCROLL ================= */}
      <div className="w-full lg:w-1/2 flex flex-col justify-between p-8 sm:p-12 lg:p-16 overflow-y-auto">
        
        {/* Cabecera interna */}
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#B85C2A] rounded-b-sm flex items-center justify-center text-white font-bold shadow-sm font-serif">
              B
            </div>
            <span className="font-semibold text-lg tracking-tight font-serif text-[#1a1a1a]">Biblioteca Next</span>
          </div>
          <div className="flex items-center gap-6">
            <BotonTema />
            <Link href="/" className="text-sm font-medium text-stone-600 hover:text-stone-900 transition-colors">
              Catálogo
            </Link>
          </div>
        </header>

        {/* Contenedor central del Formulario */}
        <div className="mt-15 max-w-xl w-full mx-auto py-4">
          <h1 className="mb-3 font-serif] text-2xl sm:text-4xl font-bold tracking-normal text-[#27150b] font">
            Crea tu cuenta de lector
          </h1>

          {enviado === "1" ? (
            <div role="status" className="mt-6 space-y-3 text-sm bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
              <p className="text-stone-800">Si el correo es válido, te enviamos un enlace para verificarlo. Ábrelo para activar tu cuenta.</p>
              <p className="text-zinc-500">En este entorno de desarrollo el correo no se envía: el enlace aparece en la consola del servidor.</p>
              <p><Link href="/login" className="font-medium underline underline-offset-4 text-[#B85C2A]">Ir a iniciar sesión</Link></p>
            </div>
          ) : (
            <>
              <p className="mt-1 mb-10 text-sm text-[#594332]">
                Con la cuenta verificada puedes reservar y leer libros digitales. Para llevarte libros físicos, presenta tu documento en cualquier sede.
              </p>
              <FormularioRegistro ciudades={ciudades} />
            </>
          )}
        </div>

        <div className="space-y-6">
              <p className="text-sm text-center text-[#594332d5]">
                ¿Ya tienes una cuenta?{' '}
                <Link href="/login" className="underline font-semibold text-[#594332] hover:underline">
                  Ingresa
                </Link>
              </p>
            </div>

        {/* Footer izquierdo */}
        <div className="flex justify-center text-xs text-stone-400 text-center lg:text-left pt-6">
          Libros digitales y físicos, en un solo lugar.
        </div>

      </div>

    </div>
  );
}