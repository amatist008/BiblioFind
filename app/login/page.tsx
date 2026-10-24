'use client';

import { useActionState } from 'react';
import { manejarLogin } from './actions';


export default function LoginPage() {
    const [state, formAction, isPending] = useActionState(manejarLogin, null);
    return (
      <main className="min-h-screen flex items-center justify-center bg-white p-4">


        {/* Tarjeta principal del Login con estilo Neobrutalism */}
        <div className="w-full max-w-md">

            <div className='w-full px-4 py-14 flex justify-end'>
                <a href="/register"
                className='text-sm font-bold text-[#2E01F7] hover:underline bg-white transition-all'
                >
                    Crear cuenta →
                </a>
            </div>

          <h1 className="text-3xl font-black uppercase tracking-wider mb-2 text-black text-center">
            Bienvenido
          </h1>
          <p className="text-gray-600 font-medium mb-6 text-center">
            Ingresa a tu cuenta de lector o empleado
          </p>

          {/* Mensaje de error en rojo con estilo neobrutalista */}
        {state?.error && (
          <div className="mb-4 bg-red-100 border-2 border-black p-3 text-red-700 font-bold text-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            ⚠️ {state.error}
          </div>
        )}
  
          <form action={formAction} className="space-y-6 ">
            <div className='flex justify-center'>
              <input
                type="email"
                name='correo'
                required
                disabled={isPending}//Se deshabilita el input si esta cargando
                placeholder="tu@correo.com"
                className="w-76 border-2 rounded-sm border-black p-3 font-medium bg-[#F3F4F6] focus:outline-none focus:bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
              />
            </div>
  
            <div className='flex justify-center w-full'>
              <input
                type="password"
                name='password'
                required
                disabled={isPending}//Se deshabilita el input si esta cargando
                placeholder="••••••••"
                className="w-76 border-2 rounded-sm border-black p-3 font-medium bg-[#F3F4F6] focus:outline-none focus:bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
              />
            </div>

            <div className='flex justify-center'>
            <button
              type="submit"
              disabled={isPending}//Bloqueamos fisicamente el boton para evitar el doble clic
              
              className="w-48 bg-[#2E01F7] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] border-1 rounded-sm border-black px-4 py-2 font-bold text-white tracking-wide hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer mt-2 ${
                isPending 
                ? 'bg-gray-400 cursor-not-allowed shadow-none translate-x-[2px] translate-y-[2px]'
                : 'bg-[#2E01F7] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] cursor-pointer'
                "
            >
              {isPending ? 'Verificando...' : 'Iniciar Sesión'}
            </button>
            </div>
          </form>
        </div>
      </main>
    );
  }