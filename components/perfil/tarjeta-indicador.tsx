type TarjetaIndicadorProps = {
  etiqueta: string;
  valor: string | number;
  detalle: string;
  acento?: "terracota" | "oliva" | "oscuro";
};

const colores = {
  terracota: "border-[#ead5c5] bg-[#fbf2ea] text-[#8d4e2f]",
  oliva: "border-[#dce3d6] bg-[#f2f5ef] text-[#536b4c]",
  oscuro: "border-[#e5ddd5] bg-[#f8f6f2] text-[#392c24]",
};

export function TarjetaIndicador({
  etiqueta,
  valor,
  detalle,
  acento = "oscuro",
}: TarjetaIndicadorProps) {
  return (
    <article className={`rounded-2xl border p-5 ${colores[acento]}`}>
      <p className="text-xs font-semibold uppercase tracking-[0.12em] opacity-75">{etiqueta}</p>
      <p className="mt-3 font-serif text-3xl font-semibold leading-none">{valor}</p>
      <p className="mt-2 text-xs leading-5 opacity-75">{detalle}</p>
    </article>
  );
}
