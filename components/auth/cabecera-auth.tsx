import Link from "next/link";

export function CabeceraAuth() {
  return (
    <header className="flex items-center justify-between gap-4">
      <Link href="/" className="inline-flex items-center gap-3" aria-label="Biblioteca Next, ir al catálogo">
        <span className="grid size-10 place-items-center rounded-lg bg-[#b85b2a] font-serif text-xl font-bold text-white shadow-sm">
          B
        </span>
        <span className="font-serif text-lg font-bold tracking-tight text-[#291d16]">
          Biblioteca Next
        </span>
      </Link>
      <Link
        href="/"
        className="text-sm font-medium text-[#766a60] transition hover:text-[#291d16]"
      >
        Catálogo
      </Link>
    </header>
  );
}
