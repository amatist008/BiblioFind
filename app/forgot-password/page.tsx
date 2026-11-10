import type { Metadata } from "next";
import { CabeceraAuth } from "@/components/auth/cabecera-auth";
import { FormularioRecuperacion } from "./formulario-recuperacion";

export const metadata: Metadata = {
  title: "Recuperar contraseña",
};

export default function ForgotPasswordPage() {
  return (
    <main className="min-h-screen bg-[#f7f5f0] px-4 py-6 text-[#291d16] sm:px-8">
      <div className="mx-auto w-full max-w-5xl">
        <CabeceraAuth />
        <section className="mx-auto mt-20 max-w-md rounded-3xl border border-[#e7e0d8] bg-[#fbfaf7] p-7 shadow-[0_24px_70px_-45px_rgba(36,24,17,0.5)] sm:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#9b5635]">Acceso a tu cuenta</p>
          <h1 className="mt-3 font-serif text-3xl font-semibold">Recupera tu contraseña</h1>
          <p className="mt-3 mb-7 text-sm leading-6 text-[#766a60]">
            Escribe el correo de tu cuenta y te enviaremos un enlace para crear una contraseña nueva.
          </p>
          <FormularioRecuperacion />
        </section>
      </div>
    </main>
  );
}
