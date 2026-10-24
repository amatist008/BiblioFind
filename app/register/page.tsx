'use client';

import { useActionState } from 'react';
import { manejarRegistro } from './actions';

export default function RegisterPage() {
    const [state, formAction, isPending] = useActionState(manejarRegistro, null);
    
    return (
      <main className="min-h-screen flex items-center justify-center bg-white p-4">
        {/* Tarjeta principal con el mismo estilo Neobrutalism */}
        <div className="w-full max-w-md bg-white border-3 rounded-sm border-black p-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] relative">
          
          {/* Enlace para volver al Login si ya tiene cuenta */}
          <div className="absolute top-4 right-4">
            <a 
              href="/login" 
              className="text-xs font-bold uppercase text-[#2E01F7] hover:underline"
            >
              ← Ir al Login
            </a>
          </div>

          <h1 className="text-3xl font-black uppercase tracking-wider mb-2 text-black mt-2">
            Registro
          </h1>
          <p className="text-gray-600 font-medium mb-6">
            Crea tu cuenta nueva de lector o empleado
          </p>

          {/* Mensaje de error en rojo estilo neobrutalista */}
          {state?.error && (
            <div className="mb-4 bg-red-100 border-2 border-black p-3 text-red-700 font-bold text-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              ⚠️ {state.error}
            </div>
          )}
  
          <form action={formAction} className="space-y-6">
            <div>
              <label className="block text-sm font-bold uppercase mb-1 text-black">
                Correo Electrónico
              </label>
              <input
                type="email"
                name="correo"
                required
                placeholder="tu@correo.com"
                className="w-full border-2 border-black p-3 font-medium bg-[#F3F4F6] focus:outline-none focus:bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
              />
            </div>
  
            <div>
              <label className="block text-sm font-bold uppercase mb-1 text-black">
                Contraseña
              </label>
              <input
                type="password"
                name="password"
                required
                placeholder="••••••••"
                className="w-full border-2 border-black p-3 font-medium bg-[#F3F4F6] focus:outline-none focus:bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
              />
            </div>
  
            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-[#2E01F7] border border-black py-3 rounded-sm font-bold text-white uppercase tracking-wide shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer mt-2"
            >
              {isPending ? 'Registrando...' : 'Crear Cuenta'}
            </button>
          </form>
        </div>
      </main>
    );
}