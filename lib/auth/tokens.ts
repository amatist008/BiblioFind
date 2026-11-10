import "server-only";
import { createHash, randomBytes } from "node:crypto";

export function crearTokenCuenta(): string {
  return randomBytes(32).toString("base64url");
}

export function hashTokenCuenta(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export function crearUrlCuenta(ruta: string): string {
  const appUrl = process.env.APP_URL;
  if (!appUrl) {
    throw new Error("Falta APP_URL; define la URL pública de la aplicación.");
  }
  return new URL(ruta, appUrl).toString();
}
