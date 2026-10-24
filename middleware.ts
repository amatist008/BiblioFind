import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // 1. Capturamos la cookie de sesión que guardamos en el login (Token_sesion)
  const token = request.cookies.get('token_sesion');

  // 2. Definimos cuál es la ruta a la que el usuario quiere entrar
  const currentPath = request.nextUrl.pathname;

  // 3. Verificamos si la ruta es privada (por ejemplo, /dashboard o cualquier ruta interna que definas)
  const isProtectedRoute = currentPath.startsWith('/dashboard');

  // 4. CONDICIÓN DE SEGURIDAD:
  // Si es una ruta protegida y el usuario NO tiene el token de sesión...
  if (isProtectedRoute && !token) {
    // ...lo redirigimos de inmediato al formulario de login
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 5. Si todo está bien, dejamos que la petición continúe su camino con normalidad
  return NextResponse.next();
}

// Configuración opcional para indicarle a Next.js en qué rutas exactas debe actuar el middleware
export const config = {
  matcher: ['/dashboard/:path*'], // Se aplicará a /dashboard y cualquier sub-ruta (ej: /dashboard/configuracion)
};