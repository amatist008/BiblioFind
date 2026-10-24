import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  // Las páginas hijas ponen su propio título y la plantilla le agrega el sufijo: "Rayuela | Biblioteca Next".
  title: { default: "Biblioteca Next", template: "%s | Biblioteca Next" },
  description: "Catálogo de la red de bibliotecas: disponibilidad por sede y ubicación de cada libro.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {/* Encabezado compartido: el layout envuelve a todas las páginas de app/. */}
        <header className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
          <div className="mx-auto flex w-full max-w-6xl items-center px-4 py-4 sm:px-6 lg:px-8 justify-between">
            <Link href="/" className="text-2xl font-semibold tracking-tight">
              BiblioFind
            </Link>
            
            <Link href="/login" className="bg-[#2E01F7] text-white border-2 rounded-sm border-black px-4 py-2 font-semibold uppercase text-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all">
              Iniciar Sesión
            </Link>
            
          </div>
          
        </header>
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
