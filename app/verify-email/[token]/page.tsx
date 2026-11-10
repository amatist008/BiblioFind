import type { Metadata } from "next";
import { CabeceraAuth } from "@/components/auth/cabecera-auth";
import { FormularioVerificacion } from "./formulario-verificacion";

export const metadata: Metadata = {
  title: "Verificar correo",
};

export default async function VerifyEmailPage({
  params,
}: PageProps<"/verify-email/[token]">) {
  const { token } = await params;

  return (
    <main className="min-h-screen bg-[#f7f5f0] px-4 py-6 text-[#291d16] sm:px-8">
      <div className="mx-auto w-full max-w-5xl">
        <CabeceraAuth />
        <section className="mx-auto mt-20 max-w-md rounded-3xl border border-[#e7e0d8] bg-[#fbfaf7] p-7 shadow-[0_24px_70px_-45px_rgba(36,24,17,0.5)] sm:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#9b5635]">Un paso más</p>
          <h1 className="mt-3 font-serif text-3xl font-semibold">Verifica tu correo</h1>
          <p className="mt-3 mb-7 text-sm leading-6 text-[#766a60]">
            Confirma que esta dirección te pertenece para activar tu cuenta de lector.
          </p>
          <FormularioVerificacion token={token} />
        </section>
      </div>
    </main>
  );
}
