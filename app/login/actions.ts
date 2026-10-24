'use server';

import { pool } from '@/lib/db';
import { redirect } from 'next/navigation';
import bcrypt from 'bcrypt'; // 👈 1. Importamos la librería de seguridad
import { SignJWT } from 'jose'; // 👈 1. Importamos la librería para firmar JWT
import { cookies } from 'next/headers'; // 👈 2. Importamos el manejador de cookies de Next.js


const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

export async function manejarLogin(prevState: any, formData: FormData) {
  const correo = formData.get('correo')?.toString() || '';
  const password = formData.get('password')?.toString() || '';

  if (!correo || !password) {
    return { error: 'Por favor completa todos los campos.' };
  }

  try {
    const [rows]: any = await pool.query(
      'SELECT * FROM cuenta WHERE correo = ?',
      [correo]
    );

    const cuenta = rows[0];

    // Si el correo no existe en la base de datos
    if (!cuenta) {
      return { error: 'Correo o contraseña incorrectos.' };
    }

    // 👈 2. Usamos bcrypt.compare para verificar la contraseña escrita contra el hash de MySQL
    const passwordMatch = await bcrypt.compare(password, cuenta.password_hash);

    if (!passwordMatch) {
      return { error: 'Correo o contraseña incorrectos.' };
    }

    // A) Creamos el Payload (la información que viajará dentro del token firmada de forma segura)
    const token = await new SignJWT({ 
      id: cuenta.id_cuenta, 
      correo: cuenta.correo 
    })
      .setProtectedHeader({ alg: 'HS256' }) // Usamos HMAC SHA256 (como vimos en la clase magistral)
      .setIssuedAt() // Fecha de emisión
      .setExpirationTime('24h') // El token expira en 24 horas (Seguridad clave)
      .sign(JWT_SECRET); // Firmamos matemáticamente con nuestra clave secreta

    // B) Guardamos el token en una Cookie HttpOnly ultra segura
    const cookieStore = await cookies();
    cookieStore.set({
      name: 'token_sesion', // Nombre de la cookie en el navegador
      value: token,         // El JWT firmado
      httpOnly: true,       // 🛡️ CRUCIAL: Impide que JavaScript (ataques XSS) lea la cookie
      secure: process.env.NODE_ENV === 'production', // Solo viaja por HTTPS en producción
      sameSite: 'strict',   // Protección contra ataques CSRF
      path: '/',            // Disponible en toda la aplicación
      maxAge: 60 * 60 * 24, // Dura 24 horas exactas
    });

  } catch (error: any) {

    if(error.message === 'NEXT_REDIRECT'){
      throw error;
    }
    console.error('Error en el login:', error);
    return { error: 'Ocurrió un error en el servidor. Inténtalo más tarde.' };
  }

  // Redirige al catálogo si el login es exitoso
  redirect('/');
}