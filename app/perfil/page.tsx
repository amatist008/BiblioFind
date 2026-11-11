import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AvatarPerfil } from "@/components/perfil/avatar-perfil";
import { FormularioPerfil } from "@/components/perfil/formulario-perfil";
import { TarjetaIndicador } from "@/components/perfil/tarjeta-indicador";
import { cerrarSesion } from "./actions";
import { obtenerPerfilActual } from "@/lib/data/perfil";

export const metadata: Metadata = {
  title: "Mi perfil",
  description: "Consulta y administra tus datos de cuenta en Biblioteca Next.",
};

const etiquetasRol = {
  bibliotecario: "Bibliotecario",
  coordinador: "Coordinador de sede",
  admin_red: "Administrador de red",
};

function mostrarFecha(fecha: string): string {
  const [anio, mes, dia] = fecha.split("-").map(Number);
  return new Intl.DateTimeFormat("es-CO", {
    dateStyle: "long",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(anio, mes - 1, dia)));
}

function TarjetaEstado({
  etiqueta,
  valor,
  detalle,
  validado,
}: {
  etiqueta: string;
  valor: string;
  detalle: string;
  validado: boolean;
}) {
  return (
    <article className="flex items-start gap-4 rounded-2xl border border-[#e9e1d8] bg-[#fbfaf7] p-5">
      <span
        aria-hidden="true"
        className={`mt-1 grid size-8 shrink-0 place-items-center rounded-full text-sm font-bold ${
          validado ? "bg-[#e6eee2] text-[#536b4c]" : "bg-[#f8eadc] text-[#9b5635]"
        }`}
      >
        {validado ? "✓" : "·"}
      </span>
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#93877d]">{etiqueta}</p>
        <p className="mt-1 font-semibold text-[#30241d]">{valor}</p>
        <p className="mt-1 text-xs leading-5 text-[#766a60]">{detalle}</p>
      </div>
    </article>
  );
}

export default async function PerfilPage() {
  const perfil = await obtenerPerfilActual();
  if (!perfil) redirect("/login");

  const persona = perfil.lector ?? perfil.empleado;
  if (!persona) redirect("/login");
  const nombreCompleto = `${persona.nombre} ${persona.apellido}`;
  const perfilPrincipal = perfil.empleado
    ? etiquetasRol[perfil.empleado.rol]
    : "Lector";

  return (
    <main className="min-h-screen bg-[#f7f5f0] px-4 pb-14 text-[#291d16] sm:px-6 lg:px-8">
      <header className="mx-auto flex max-w-7xl items-center justify-between gap-4 border-b border-[#e8e0d7] py-5">
        <Link href="/" className="inline-flex items-center gap-3" aria-label="Biblioteca Next, ir al catálogo">
          <span className="grid size-10 place-items-center rounded-lg bg-[#b85b2a] font-serif text-xl font-bold text-white shadow-sm">
            B
          </span>
          <span className="font-serif text-lg font-bold tracking-tight text-[#291d16]">
            Biblioteca Next
          </span>
        </Link>
        <nav aria-label="Navegación de perfil" className="flex items-center gap-3 sm:gap-6">
          <Link href="/" className="text-sm font-medium text-[#766a60] transition hover:text-[#291d16]">
            Catálogo
          </Link>
          <a
            href="#datos-personales"
            className="hidden text-sm font-medium text-[#766a60] transition hover:text-[#291d16] sm:inline"
          >
            Mi información
          </a>
          <form action={cerrarSesion}>
            <button
              type="submit"
              className="rounded-xl border border-[#d9cfc5] bg-[#fbfaf7] px-4 py-2 text-sm font-semibold text-[#51453d] transition hover:border-[#9b5635] hover:text-[#291d16]"
            >
              Cerrar sesión
            </button>
          </form>
        </nav>
      </header>

      <div className="mx-auto max-w-7xl">
        <div className="mb-7 mt-8">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#9b5635]">
            Espacio personal
          </p>
          <h1 className="mt-2 font-serif text-3xl font-semibold tracking-tight sm:text-4xl">
            Mi perfil
          </h1>
          <p className="mt-2 text-sm text-[#766a60]">
            Tu actividad y tus datos, reunidos en un solo lugar.
          </p>
        </div>

        <section className="overflow-hidden rounded-[1.75rem] border border-[#e7ded4] bg-[#fcfbf8] shadow-[0_24px_70px_-45px_rgba(36,24,17,0.5)]">
          <div className="h-2 bg-gradient-to-r from-[#b85b2a] via-[#d2a06f] to-[#62745a]" />
          <div className="flex flex-col gap-6 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
            <div className="flex items-center gap-5">
              <AvatarPerfil idCuenta={perfil.idCuenta} nombre={nombreCompleto} />
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="font-serif text-2xl font-semibold text-[#291d16] sm:text-3xl">
                    {nombreCompleto}
                  </h2>
                  <span className="rounded-full border border-[#e8d5c4] bg-[#fbf2ea] px-3 py-1 text-xs font-semibold text-[#8d4e2f]">
                    {perfilPrincipal}
                  </span>
                </div>
                <p className="mt-2 text-sm text-[#766a60]">{perfil.correo}</p>
                <p className="mt-1 text-xs text-[#a1978d]">
                  Cuenta desde {mostrarFecha(perfil.fechaRegistro)}
                </p>
              </div>
            </div>
            <Link
              href="/"
              className="inline-flex min-h-11 items-center justify-center gap-2 self-start rounded-xl bg-[#211b18] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#3b2d26] sm:self-center"
            >
              <span aria-hidden="true">⌕</span>
              Explorar catálogo
            </Link>
          </div>
        </section>

        <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.55fr)_minmax(19rem,0.85fr)]">
          <div className="space-y-6">
            {perfil.lector && (
              <section aria-labelledby="lectura-titulo">
                <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#9b5635]">
                      Tu recorrido
                    </p>
                    <h2 id="lectura-titulo" className="mt-1 font-serif text-2xl font-semibold">
                      Actividad lectora
                    </h2>
                  </div>
                  <span className="rounded-full border border-[#e5ddd5] bg-[#fbfaf7] px-3 py-1.5 text-xs font-medium text-[#766a60]">
                    Lector {perfil.lector.tipoLector}
                  </span>
                </div>
                <div className="grid gap-3 sm:grid-cols-2 2xl:grid-cols-4">
                  <TarjetaIndicador
                    etiqueta="Préstamos físicos"
                    valor={perfil.lector.estadisticas.prestamosFisicos}
                    detalle="Préstamos registrados en tu cuenta"
                    acento="terracota"
                  />
                  <TarjetaIndicador
                    etiqueta="En casa"
                    valor={perfil.lector.estadisticas.prestamosFisicosActivos}
                    detalle="Préstamos físicos sin devolver"
                    acento="oliva"
                  />
                  <TarjetaIndicador
                    etiqueta="Lecturas digitales"
                    valor={perfil.lector.estadisticas.prestamosDigitalesActivos}
                    detalle="Préstamos digitales vigentes"
                  />
                  <TarjetaIndicador
                    etiqueta="Reservas"
                    valor={perfil.lector.estadisticas.reservasActivas}
                    detalle="Reservas activas o asignadas"
                    acento="terracota"
                  />
                </div>
              </section>
            )}

            {perfil.empleado && (
              <section aria-labelledby="laboral-titulo">
                <div className="mb-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#9b5635]">
                    Equipo de biblioteca
                  </p>
                  <h2 id="laboral-titulo" className="mt-1 font-serif text-2xl font-semibold">
                    Perfil laboral
                  </h2>
                </div>
                <div className="grid gap-3 sm:grid-cols-2 2xl:grid-cols-3">
                  <TarjetaIndicador
                    etiqueta="Rol"
                    valor={etiquetasRol[perfil.empleado.rol]}
                    detalle="Permisos asociados a tu función"
                    acento="terracota"
                  />
                  <TarjetaIndicador
                    etiqueta="Vinculación"
                    valor={mostrarFecha(perfil.empleado.fechaContratacion)}
                    detalle="Fecha de contratación"
                    acento="oliva"
                  />
                  <TarjetaIndicador
                    etiqueta="Sede"
                    valor={perfil.empleado.sede ?? "Red completa"}
                    detalle={perfil.empleado.sede ? "Sede asignada" : "Cobertura de la red"}
                  />
                </div>
              </section>
            )}

            <FormularioPerfil perfil={perfil} />
          </div>

          <aside className="space-y-6">
            <section aria-labelledby="estado-titulo">
              <div className="mb-4">
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#9b5635]">
                  Estado de la cuenta
                </p>
                <h2 id="estado-titulo" className="mt-1 font-serif text-2xl font-semibold">
                  Todo en orden
                </h2>
              </div>
              <div className="space-y-3">
                <TarjetaEstado
                  etiqueta="Correo"
                  valor="Verificado"
                  detalle="La dirección de correo está confirmada."
                  validado
                />
                {perfil.lector && (
                  <TarjetaEstado
                    etiqueta="Perfil lector"
                    valor={perfil.lector.documentoValidado ? "Documento validado" : "Validación pendiente"}
                    detalle={
                      perfil.lector.documentoValidado
                        ? "El documento fue cotejado en una sede."
                        : "Presenta tu documento original en una sede para solicitar préstamos físicos."
                    }
                    validado={perfil.lector.documentoValidado}
                  />
                )}
                {perfil.empleado && (
                  <TarjetaEstado
                    etiqueta="Perfil laboral"
                    valor="Activo"
                    detalle="Tu cuenta tiene un perfil de empleado activo."
                    validado
                  />
                )}
              </div>
            </section>

            {perfil.lector && (
              <section className="rounded-3xl border border-[#e9e1d8] bg-[#fbfaf7] p-6 shadow-[0_20px_60px_-45px_rgba(36,24,17,0.5)]">
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#9b5635]">
                  Tu perfil lector
                </p>
                <h2 className="mt-2 font-serif text-xl font-semibold">Datos de lector</h2>
                <div className="mt-4 space-y-3">
                  <div className="flex items-center justify-between gap-4 rounded-xl bg-[#f4f0e9] px-4 py-3">
                    <span className="text-xs font-medium text-[#766a60]">Nacimiento</span>
                    <span className="text-right text-sm font-semibold text-[#392c24]">
                      {mostrarFecha(perfil.lector.fechaNacimiento)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-4 rounded-xl bg-[#f4f0e9] px-4 py-3">
                    <span className="text-xs font-medium text-[#766a60]">Ciudad</span>
                    <span className="text-right text-sm font-semibold text-[#392c24]">
                      {perfil.lector.ciudad ?? "Sin registrar"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-4 rounded-xl bg-[#f4f0e9] px-4 py-3">
                    <span className="text-xs font-medium text-[#766a60]">Teléfono</span>
                    <span className="text-right text-sm font-semibold text-[#392c24]">
                      {perfil.lector.telefono ?? "Sin registrar"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-4 rounded-xl bg-[#f4f0e9] px-4 py-3">
                    <span className="text-xs font-medium text-[#766a60]">Dirección</span>
                    <span className="max-w-[65%] text-right text-sm font-semibold text-[#392c24]">
                      {perfil.lector.calle ?? "Sin registrar"}
                    </span>
                  </div>
                </div>
              </section>
            )}

            <section aria-labelledby="accesos-titulo">
              <div className="mb-4">
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#9b5635]">
                  A un paso
                </p>
                <h2 id="accesos-titulo" className="mt-1 font-serif text-2xl font-semibold">
                  Accesos rápidos
                </h2>
              </div>
              <div className="grid gap-3">
                <Link
                  href="/"
                  className="group flex items-center justify-between rounded-2xl border border-[#e9e1d8] bg-[#fbfaf7] p-4 transition hover:border-[#c89a78] hover:bg-white"
                >
                  <span className="flex items-center gap-3">
                    <span aria-hidden="true" className="grid size-10 place-items-center rounded-xl bg-[#f5e8dc] text-lg text-[#9b5635]">
                      ◫
                    </span>
                    <span>
                      <span className="block text-sm font-semibold text-[#392c24]">Explorar el catálogo</span>
                      <span className="mt-0.5 block text-xs text-[#766a60]">Encuentra tu próxima lectura</span>
                    </span>
                  </span>
                  <span aria-hidden="true" className="text-lg text-[#a1978d] transition group-hover:translate-x-1">→</span>
                </Link>
                <a
                  href="#datos-personales"
                  className="group flex items-center justify-between rounded-2xl border border-[#e9e1d8] bg-[#fbfaf7] p-4 transition hover:border-[#c89a78] hover:bg-white"
                >
                  <span className="flex items-center gap-3">
                    <span aria-hidden="true" className="grid size-10 place-items-center rounded-xl bg-[#edf0e8] text-lg text-[#536b4c]">
                      ✎
                    </span>
                    <span>
                      <span className="block text-sm font-semibold text-[#392c24]">Editar mis datos</span>
                      <span className="mt-0.5 block text-xs text-[#766a60]">Actualiza tu información de contacto</span>
                    </span>
                  </span>
                  <span aria-hidden="true" className="text-lg text-[#a1978d] transition group-hover:translate-x-1">→</span>
                </a>
              </div>
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}
