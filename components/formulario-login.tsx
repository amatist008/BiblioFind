"use client";

import { useActionState } from "react";
import { MensajeFormulario } from "@/components/ui-formulario";
import { iniciarSesion } from "@/lib/actions/sesion";
import type { EstadoFormulario } from "@/lib/definitions";

const estadoInicial: EstadoFormulario = {};

export function FormularioLogin({ siguiente }: { siguiente: string | null }) {
  const [estado, accion, pendiente] = useActionState(iniciarSesion, estadoInicial);

  return (
    <form action={accion} className="space-y-5">
      {siguiente && <input type="hidden" name="siguiente" value={siguiente} />}
      
      {/* Campo de Correo */}
      <div>
        <label htmlFor="correo" className="block text-xs uppercase font-semibold text-stone-700 tracking-wider mb-2">
          Correo
        </label>
        <input 
          id="correo" 
          name="correo" 
          type="email" 
          autoComplete="username" 
          required
          defaultValue={estado.valores?.correo} 
          placeholder="tu@correo.com"
          className="w-full px-4 py-3 rounded-lg bg-white border border-[#dcd6ce] text-stone-900 placeholder-stone-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#B85C2A] focus:border-transparent transition-all" 
        />
      </div>

      {/* Campo de Contraseña */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label htmlFor="contrasena" className="block text-xs font-semibold text-stone-700 uppercase tracking-wider">
            Contraseña
          </label>
          <a href="#" className="text-xs underline font-semibold text-stone-700 hover:text-stone-900 transition-colors">
            ¿La olvidaste?
          </a>
        </div>
        <input 
          id="contrasena" 
          name="contrasena" 
          type="password" 
          autoComplete="current-password" 
          required
          placeholder="Tu contraseña"
          className="w-full px-4 py-3 rounded-lg bg-white border border-[#dcd6ce] text-stone-900 placeholder-stone-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#B85C2A] focus:border-transparent transition-all" 
        />
      </div>

      <div className="flex items-center pt-1">
        <input
          id="remember"
          type="checkbox"
          className="w-4 h-4 text-[#594332] border-stone-300 rounded focus:ring-stone-900"
        />
        <label htmlFor="remember" className="ml-2 text-sm text-[#594332]">
          Mantener sesión iniciada
        </label>
      </div>

      <MensajeFormulario estado={estado} />
      
      {/* Botón de Entrar */}
      <button 
        type="submit" 
        disabled={pendiente} 
        className="w-full py-3.5 px-4 bg-stone-900 hover:bg-stone-800 text-white font-bold rounded-[10px] text-[14px] transition-all hover:shadow-lg disabled:opacity-50"
      >
        {pendiente ? "Entrando…" : "Entrar"}
      </button>
    </form>
  );
}