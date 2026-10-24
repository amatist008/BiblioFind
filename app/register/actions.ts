'use server';

import { pool } from '@/lib/db';
import { redirect } from 'next/navigation';
import bcrypt from 'bcrypt';

export async function manejarRegistro(prevState: any, formData: FormData) {
  const correo = formData.get('correo')?.toString() || '';
  const password = formData.get('password')?.toString() || '';

  if (!correo || !password) {
    return { error: 'Por favor completa todos los campos.' };
  }

  try {
    // 1. Verificamos si el correo ya está registrado en la base de datos
    const [existingRows]: any = await pool.query(
      'SELECT * FROM cuenta WHERE correo = ?',
      [correo]
    );

    if (existingRows.length > 0) {
      return { error: 'Este correo ya está registrado.' };
    }

    // 2. MAGIA DE SEGURIDAD: Encriptamos la contraseña con bcrypt
    // El número '10' es el "salt rounds" (costo computacional del cifrado, el estándar de la industria)
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // 3. Guardamos el correo y la contraseña encriptada (password_hash) en MySQL
    await pool.query(
      'INSERT INTO cuenta (correo, password_hash) VALUES (?, ?)',
      [correo, hashedPassword]
    );

  } catch (error) {
    console.error('Error en el registro:', error);
    return { error: 'Ocurrió un error en el servidor al registrarse.' };
  }

  // 4. Si todo sale bien, redirigimos al usuario al login para que ingrese con su nueva cuenta
  redirect('/login');
}