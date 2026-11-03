import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { FormularioLogin } from "@/components/formulario-login";
import { salir } from "@/lib/actions/sesion";
import { obtenerUsuario, rutaInterna } from "@/lib/sesion";
import { scriptTema } from "@/lib/tema";//libreria de los 3 temas para cambiar
import { BotonTema } from "@/components/boton-tema";
import { ScriptEnLinea } from "@/components/script-en-linea";

export const metadata: Metadata = { title: "Iniciar sesión" };

// Mensajes que exigirEmpleado() pide mostrar con ?motivo=. Se usa la clave para elegir un texto fijo:
// lo que venga en la URL nunca se pinta tal cual.
const MOTIVOS: Record<string, string> = {
  "sin-panel": "Esa cuenta no tiene acceso al panel de empleados.",
  "sin-cuenta-lector": "Esa cuenta no tiene perfil de lector.",
};

export default async function PaginaLogin({ searchParams }: PageProps<"/login">) {
  const { motivo, siguiente } = await searchParams;
  const usuario = await obtenerUsuario();
  // RN-83: a dónde volver al entrar. Se valida aquí para no poner en el formulario algo que no se va a usar,
  // y la acción lo vuelve a validar (es la que manda).
  const destino = rutaInterna(siguiente);
  if (usuario?.empleado) redirect("/panel"); // ya conectado como empleado: nada que hacer aquí

  const aviso = typeof motivo === "string" ? MOTIVOS[motivo] : undefined;

  return (
    <div className="fixed inset-0 z-50 w-full h-full flex bg-[#fbf9f6] text-[#1c1917] font-sans overflow-y-auto">
      
      {/* ================= COLUMNA IZQUIERDA: FORMULARIO Y LÓGICA ================= */}
      <div className="w-full lg:w-1/2 flex flex-col justify-between p-8 sm:p-12 lg:p-16 xl:p-20">
        
        {/* Cabecera interna del Login */}
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
        <div className="max-w-md w-full mx-auto my-auto py-8">
          
          <div className="mb-8 gap-5">
            <h1 className="mb-3 font-serif] text-3xl sm:text-4xl font-bold tracking-normal text-[#27150b] font">
              Bienvenido de nuevo
            </h1>
            <p className="text-[#594332] text-sm sm:text-base">
              Entra para seguir leyendo y gestionar tus pedidos.
            </p>
          </div>

          {aviso && (
            <div className="mb-6 p-4 rounded-xl bg-amber-50 border border-amber-200 text-sm text-amber-800">
              {aviso}
            </div>
          )}

          {usuario ? (
            // Conectado con una cuenta sin panel (un lector): ofrecer salir para entrar con otra.
            <div className="mt-6 space-y-4 text-sm bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
              <p className="text-stone-600">
                Iniciaste sesión como <strong className="text-stone-900">{usuario.correo}</strong>.
              </p>
              <form action={salir}>
                <button 
                  type="submit" 
                  className="w-full py-3 px-4 bg-stone-900 hover:bg-stone-800 text-white font-medium rounded-xl text-sm transition-all shadow-md"
                >
                  Cerrar sesión
                </button>
              </form>
            </div>
          ) : (
            <div className="space-y-6">
              <FormularioLogin siguiente={destino} />
              <p className="text-sm text-center text-[#594332d5]">
                ¿No tienes cuenta?{' '}
                <Link href="/registro" className="underline font-semibold text-[#594332] hover:underline">
                  Regístrate
                </Link>
              </p>
            </div>
          )}

        </div>

        {/* Footer izquierdo */}
        <div className="flex justify-center text-xs text-stone-400 text-center lg:text-left">
          Libros digitales y físicos, en un solo lugar.
        </div>
      </div>
{/* ================= COLUMNA DERECHA: TARJETA FLOTANTE CON LA ILUSTRACIÓN ================= */}
<div className="hidden lg:flex lg:w-1/2 p-6 items-center justify-center">
        <div className="w-full h-full bg-[#0B132B] rounded-[32px] relative overflow-hidden flex flex-col justify-between p-12 shadow-2xl border border-stone-800">
          
          {/* Imagen de fondo dentro de la tarjeta flotante */}
          <img 
            src="/background-login.jpg" 
            alt="Ilustración BiblioFind" 
            className="absolute inset-0 w-full h-full object-cover opacity-70"
          />

          {/* Capa oscura para contraste */}
          <div className="absolute inset-0 bg-[#0B132B]/20"></div>

          {/* Textos y elementos flotando dentro de la tarjeta */}
          <div className="relative z-10">
            <span className="text-xs uppercase tracking-widest text-[#E9D8A6] font-semibold">
              BIBLIOFIND
            </span>
          </div>

          <div className="relative z-10 max-w-md space-y-4 my-auto">
            <h2 className="text-4xl font-bold tracking-tight text-[#F4F1DE] font-serif leading-tight">
              Tu carné de lector <br />empieza aquí
            </h2>
            <p className="text-[#E9D8A6] text-base leading-relaxed">
              Renta libros físicos y digitales desde un solo lugar.
            </p>
          </div>

          <div className="relative z-10 text-xs text-[#F4F1DE]/60">
            Diseñado para amantes de la lectura.
          </div>

        </div>
      </div>

    </div>
  );
}