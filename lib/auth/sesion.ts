import "server-only";
import { cookies } from "next/headers";
import { errors, jwtVerify } from "jose";

const COOKIE_SESION = "token_sesion";

export async function obtenerIdCuentaDeSesion(): Promise<number | null> {
  const cookie = (await cookies()).get(COOKIE_SESION)?.value;
  if (!cookie) return null;

  const secreto = process.env.JWT_SECRET;
  if (!secreto) {
    throw new Error("Falta la variable de entorno JWT_SECRET.");
  }

  try {
    const { payload } = await jwtVerify(
      cookie,
      new TextEncoder().encode(secreto),
      { algorithms: ["HS256"] },
    );
    const id = payload.id;
    return typeof id === "number" && Number.isSafeInteger(id) && id > 0 ? id : null;
  } catch (error) {
    if (error instanceof errors.JOSEError) return null;
    throw error;
  }
}
