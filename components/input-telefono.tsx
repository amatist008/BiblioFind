'use client';

import React, { useState } from 'react';
import PhoneInput from 'react-phone-number-input';
import { Value } from 'react-phone-number-input';
import 'react-phone-number-input/style.css'; // Importante para que los estilos y banderas de la librería funcionen

interface InputTelefonoProps {
  defaultValue?: string;
}

export default function InputTelefonoProfesional({ defaultValue = '' }: InputTelefonoProps) {
  const [valorTelefono, setValorTelefono] = useState<Value | undefined>(
    (defaultValue as Value) || ''
  );

  return (
    <div className="w-full">
      {/* 
        CONTENEDOR DE TAILWIND ADAPTADO A BIBLIOFIND: 
        Cambiamos el azul por tu tono ocre #B85C2A para mantener la consistencia
      */}
      <div className=" flex items-center rounded-md border border-zinc-300 bg-white px-3 py-2.5 focus-within:border-transparent focus-within:ring-2 focus-within:ring-[#B85C2A] transition-all dark:border-zinc-700 dark:bg-zinc-900">
        
        <PhoneInput
          international
          defaultCountry="CO" // Colombia por defecto
          value={valorTelefono}
          onChange={setValorTelefono}
          placeholder="300 000 0000"
          className="flex w-full items-center gap-2 text-sm text-stone-800 dark:text-zinc-100"
          numberInputProps={{
            className: " w-full bg-transparent text-[15px] text-stone-800 placeholder:text-zinc-400 focus:outline-none dark:text-zinc-100",
          }}
        />
      </div>

      {/* Input oculto para que tu Server Action (registrarLector) reciba el número al enviar el formulario */}
      <input type="hidden" name="telefono" value={valorTelefono ?? ''} />
    </div>
  );
}