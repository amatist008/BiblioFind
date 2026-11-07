import { buttonVariants } from "@/components/ui/button";
import type { EstadoFormulario } from "@/lib/definitions";
import { cn } from "@/lib/utils";

// Piezas compartidas por los formularios de la Fase 3 (login, préstamo, devolución).
// Sin "use client": sirven tanto en Server como en Client Components.

export const claseSelect = cn(
  "mt-1 w-full rounded-md border border-zinc-300 bg-white px-3 pr-10 py-2 text-stone-800",
  "focus:outline-none focus:ring-2 focus:ring-[#B85C2A] focus:border-transparent transition-all",
  "dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 appearance-none",
  "bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23594332%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[length:1rem_1rem] bg-[right_0.75rem_center] bg-no-repeat"
);

export const claseEtiqueta = "block text-sm font-medium text-foreground";

// La forma del Input alineada con los tokens de diseño y tu componente de teléfono.
export const claseCampo = cn(
  "mt-1 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-stone-800",
  "focus:outline-none focus:ring-2 focus:ring-[#B85C2A] focus:border-transparent transition-all",
  "dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400"
);

// El botón principal unificando el estilo robusto que diseñaste con los estados de carga (pending).
export const claseBoton = cn(
  "w-full py-3.5 px-4 bg-stone-900 hover:bg-stone-800 text-white font-bold rounded-[10px] text-[15px] transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-wait"
);

// Mensaje de resultado. role="alert" hace que el lector de pantalla lo anuncie apenas aparece.
export function MensajeFormulario({ estado }: { estado: EstadoFormulario }) {
  if (estado.error) {
    return (
      <p role="alert" className="rounded-xl border border-danger/40 bg-danger-suave px-3 py-2 text-sm text-danger-texto">
        {estado.error}
      </p>
    );
  }
  if (estado.exito) {
    return (
      <p role="status" className="rounded-xl border border-success/40 bg-success-suave px-3 py-2 text-sm text-success-texto">
        {estado.exito}
      </p>
    );
  }
  return null;
}