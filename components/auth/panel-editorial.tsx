import Image from "next/image";

type PanelEditorialProps = {
  imagen: string;
  titulo: string;
  descripcion: string;
  pie: string;
  textoAlternativo: string;
};

export function PanelEditorial({
  imagen,
  titulo,
  descripcion,
  pie,
  textoAlternativo,
}: PanelEditorialProps) {
  return (
    <aside className="relative isolate flex min-h-[28rem] overflow-hidden rounded-[1.75rem] bg-[#1d302d] text-white shadow-[0_24px_70px_-35px_rgba(36,24,17,0.65)] lg:min-h-0">
      <Image
        src={imagen}
        alt={textoAlternativo}
        fill
        priority
        sizes="(min-width: 1024px) 50vw, 100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-transparent to-black/65" />
      <div className="relative flex w-full flex-col justify-between p-7 sm:p-10 lg:p-11">
        <span className="text-[0.65rem] font-semibold tracking-[0.22em] text-[#e7d5ab]">
          BIBLIOFIND
        </span>
        <div className="max-w-lg pb-2">
          <h2 className="max-w-md font-serif text-4xl font-semibold leading-[1.08] tracking-tight sm:text-5xl">
            {titulo}
          </h2>
          <p className="mt-5 max-w-md text-sm leading-6 text-[#f3e8cf] sm:text-base">
            {descripcion}
          </p>
        </div>
        <p className="text-xs text-white/65">{pie}</p>
      </div>
    </aside>
  );
}
