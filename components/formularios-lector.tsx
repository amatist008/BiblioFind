"use client";

import { useActionState } from "react";
import { claseBoton, claseCampo, claseEtiqueta, claseSelect, MensajeFormulario } from "@/components/ui-formulario";
import { registrarLector, verificarCorreo } from "@/lib/actions/cuenta";
import { reservarObra } from "@/lib/actions/reservas";
import type { EstadoFormulario } from "@/lib/definitions";
import InputTelefonoProfesional from "@/components/input-telefono"; // <-- Tu componente de teléfono

const estadoInicial: EstadoFormulario = {};

export function FormularioRegistro({ ciudades }: { ciudades: { id_ciudad: number; nombre: string; departamento: string }[] }) {
  const [estado, accion, pendiente] = useActionState(registrarLector, estadoInicial);
  const v = estado.valores ?? {};
  
  return (
    <form action={accion} className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="nombre" className={claseEtiqueta}>Nombre</label>
          <input placeholder="Escribe tu nombre" id="nombre" name="nombre" required maxLength={60} autoComplete="given-name" defaultValue={v.nombre} className={claseCampo} />
        </div>
        <div>
          <label htmlFor="apellido" className={claseEtiqueta}>Apellido</label>
          <input placeholder="Escribe tu apellido" id="apellido" name="apellido" required maxLength={60} autoComplete="family-name" defaultValue={v.apellido} className={claseCampo} />
        </div>
      </div>
      
      <div>
        <label htmlFor="fecha_nacimiento" className={claseEtiqueta}>Fecha de nacimiento</label>
        <input id="fecha_nacimiento" name="fecha_nacimiento" type="date" required autoComplete="bday"
               defaultValue={v.fecha_nacimiento} className={claseCampo} aria-describedby="ayuda-nacimiento" />
        <p id="ayuda-nacimiento" className="mt-1 text-xs text-muted-foreground">Algunos libros tienen clasificación por edad.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label htmlFor="tipo_documento" className={claseEtiqueta}>Documento</label>
          <select id="tipo_documento" name="tipo_documento" required defaultValue={v.tipo_documento ?? "CC"} className={claseSelect}>
            <option value="CC">Cédula (CC)</option>
            <option value="TI">Tarjeta de identidad (TI)</option>
            <option value="CE">Cédula de extranjería (CE)</option>
            <option value="PASAPORTE">Pasaporte</option>
          </select>
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="numero_documento" className={claseEtiqueta}>Número de documento</label>
          <input placeholder="Ej. 12345678" id="numero_documento" name="numero_documento" required maxLength={20} autoComplete="off"
                 defaultValue={v.numero_documento} className={claseCampo} aria-describedby="ayuda-documento" />
          <p id="ayuda-documento" className="mt-1 text-xs text-muted-foreground">Lo cotejamos con el original la primera vez que vayas a una sede.</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {/* ================= CAMPO DE TELÉFONO USANDO TU COMPONENTE ================= */}
        <div>
          <label htmlFor="telefono" className={claseEtiqueta}>Teléfono</label>
          <div className="mt-1">
            <InputTelefonoProfesional defaultValue={v.telefono} />
          </div>
          <p className="mt-1 text-xs text-zinc-500">Número de contacto para notificaciones de préstamos.</p>
        </div>

        <div>
          <label htmlFor="calle" className={claseEtiqueta}>Dirección</label>
          <input id="calle" name="calle" required maxLength={120} autoComplete="street-address" placeholder="Cra. 5 # 10-20"
                 defaultValue={v.calle} className={claseCampo} />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="id_ciudad" className={claseEtiqueta}>Ciudad</label>
          <select id="id_ciudad" name="id_ciudad" required defaultValue={v.id_ciudad ?? ""} className={claseSelect}>
            <option value="" disabled>Elige…</option>
            {ciudades.map((c) => <option key={c.id_ciudad} value={c.id_ciudad}>{c.nombre} ({c.departamento})</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="codigo_postal" className={claseEtiqueta}>
            Código postal <span className="font-normal text-muted-foreground">(opcional)</span>
          </label>
          <input placeholder="110111" id="codigo_postal" name="codigo_postal" inputMode="numeric" maxLength={10} autoComplete="postal-code"
                 defaultValue={v.codigo_postal} className={claseCampo} />
        </div>
      </div>

      <div>
        <label htmlFor="correo" className={claseEtiqueta}>Correo</label>
        <input placeholder="Ej. usuario@correo.com" id="correo" name="correo" type="email" required autoComplete="email" defaultValue={v.correo} className={claseCampo} />
      </div>

      <div>
        <label htmlFor="contrasena" className={claseEtiqueta}>Contraseña</label>
        <input id="contrasena" name="contrasena" type="password" required minLength={12} autoComplete="new-password"
               className={claseCampo} aria-describedby="ayuda-contrasena" />
        <p id="ayuda-contrasena" className="mt-1 text-xs text-muted-foreground">Mínimo 12 caracteres. Una frase larga es más segura que una palabra con símbolos.</p>
      </div>

      <MensajeFormulario estado={estado} />
      <button type="submit" disabled={pendiente} className={`${claseBoton} w-full`}>
        {pendiente ? "Creando cuenta…" : "Crear cuenta"}
      </button>
    </form>
  );
}