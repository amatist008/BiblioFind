import Image from "next/image";

type AvatarPerfilProps = {
  idCuenta: number;
  nombre: string;
  size?: "sm" | "lg";
};

export function AvatarPerfil({ idCuenta, nombre, size = "lg" }: AvatarPerfilProps) {
  const avatar = `https://api.dicebear.com/10.x/lorelei/svg?seed=${encodeURIComponent(String(idCuenta))}`;
  const dimensiones = size === "sm"
    ? { caja: "size-8 border-2", imagen: 32 }
    : { caja: "size-24 border-4", imagen: 96 };

  return (
    <div className={`${dimensiones.caja} shrink-0 overflow-hidden rounded-full border-white bg-[#ead8c7] shadow-[0_4px_14px_-8px_rgba(54,36,23,0.6)]`}>
      <Image
        src={avatar}
        alt={`Avatar de ${nombre}`}
        width={dimensiones.imagen}
        height={dimensiones.imagen}
        unoptimized
        priority={size === "lg"}
        className="size-full object-cover"
      />
    </div>
  );
}
