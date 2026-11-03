import type { EstadoFormulario } from "@/lib/definitions";

// Piezas compartidas por los formularios de la Fase 3 (login, préstamo, devolución).
// Sin "use client": sirven tanto en Server como en Client Components

export const claseSelect = "mt-1 w-full rounded-md border border-zinc-300 bg-white px-3 pr-10 py-2 text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#B85C2A] focus:border-transparent transition-all dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23594332%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[length:1rem_1rem] bg-[right_0.75rem_center] bg-no-repeat";

export const claseEtiqueta = "block text-sm font-medium text-zinc-700 dark:text-zinc-300";

export const claseCampo =
  "mt-1 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#B85C2A] focus:border-transparent transition-all dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100";

// disabled:opacity-60 + disabled:cursor-wait: mientras la acción corre (pending), el botón se ve inactivo.
export const claseBoton =
  "w-full py-3.5 px-4 bg-stone-900 hover:bg-stone-800 text-white font-bold rounded-[10px] text-[15px] transition-all hover:shadow-lg disabled:opacity-50";

// Mensaje de resultado. role="alert" hace que el lector de pantalla lo anuncie apenas aparece (el error
// llega sin recargar la página); role="status" es la versión cortés, para confirmaciones.
export function MensajeFormulario({ estado }: { estado: EstadoFormulario }) {
  if (estado.error) {
    return (
      <p role="alert" className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-200">
        {estado.error}
      </p>
    );
  }
  if (estado.exito) {
    return (
      <p role="status" className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-200">
        {estado.exito}
      </p>
    );
  }
  return null;
}