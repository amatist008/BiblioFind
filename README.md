# bibliotecaNext

Sistema para administrar una red de bibliotecas: catálogo con ubicación física, préstamos y reservas,
préstamo digital con licencias y venta de libros. Proyecto de aprendizaje con Next.js (App Router),
TypeScript, Tailwind CSS y MySQL con SQL escrito a mano.

> **Estado:** Fase 3 en curso — autenticación de lectores; falta configurar el proveedor de correo para producción. Detalle y próximo paso en [docs/estado.md](docs/estado.md).

## Documentación

| Documento | Contenido |
|---|---|
| [docs/reglas-de-negocio.md](docs/reglas-de-negocio.md) | Cómo funciona el sistema (D-xx, RN-xx, C-xx). Fuente de verdad. |
| [docs/modelo-datos.md](docs/modelo-datos.md) | Modelo de datos por bloques, derivado de las reglas |
| [docs/estado.md](docs/estado.md) | En qué fase y paso vamos, y qué sigue |
| [db/consultas.sql](db/consultas.sql) | Consultas clave de la app, para ejecutar a mano |
| [CLAUDE.md](CLAUDE.md) | Contexto y reglas de trabajo para Claude Code |

## Requisitos

| Herramienta | Versión usada | Cómo comprobarla |
|---|---|---|
| Node.js | 22 LTS (22.23.2) | `node -v` |
| pnpm | 11.20.0 | `pnpm -v` |
| Docker + Docker Compose | Compose v2 o superior | `docker compose version` |
| Git con acceso SSH a GitHub | — | `ssh -T git@github.com` |

## Puesta en marcha en un equipo nuevo

```bash
git clone git@github.com:Parzivalml-35/bibliotecaNext.git
cd bibliotecaNext
cp .env.example .env        # y cambia las contraseñas en .env
```

Levantar MySQL (la primera vez descarga la imagen y ejecuta `db/init/*.sql`):

```bash
docker compose up -d --wait
```

MySQL queda en `127.0.0.1:3307` (usuario y base de datos según `.env`). Los scripts de `db/init/` **solo se
ejecutan con el volumen vacío**; para aplicar cambios de esquema hay que recrear la BD, lo que borra sus datos:

```bash
docker compose down -v && docker compose up -d --wait
```

Las bases existentes pueden recibir cambios aditivos mediante migraciones sin borrar sus datos. Para el
contacto laboral del perfil, ejecuta `pnpm db:migrate:perfil`; la migración es idempotente y también está
incluida en `db/init/01_schema.sql` para futuras instalaciones limpias.

Instalar dependencias y arrancar la app (con MySQL ya arriba):

```bash
pnpm install
pnpm dev                    # http://localhost:3000
```

La página de inicio debe mostrar el catálogo con 16 libros (por ejemplo "Cien años de soledad", con su tilde).

### Preparar la cuenta administradora

El seed incluye una cuenta con perfil `admin_red`, pero la contraseña es un marcador inutilizable. Para crear
un administrador o sustituir de forma segura la contraseña del existente, completa temporalmente en `.env`
`ADMIN_EMAIL`, `ADMIN_PASSWORD`, `ADMIN_NOMBRE` y `ADMIN_APELLIDO`. La contraseña debe tener al menos 12
caracteres y no más de 72 bytes UTF-8. Luego ejecuta:

```bash
pnpm admin:bootstrap
```

El script usa bcrypt, verifica o crea la cuenta y el perfil `admin_red` dentro de una transacción, y marca el
correo como verificado. Si el correo ya corresponde a una cuenta desactivada o a un empleado con otro rol,
se detiene sin cambiar nada. Al finalizar, elimina los valores `ADMIN_*` de `.env`; nunca uses una contraseña
predeterminada ni guardes esas credenciales en Git.

Detener todo al terminar:

- La app: `Ctrl+C` en la terminal de `pnpm dev`.
- MySQL: `docker compose stop` (conserva los datos; `down -v` en cambio **borra** el volumen).

Comprobaciones de código: `pnpm lint` y `pnpm build` (incluye el chequeo de TypeScript).

## Rutina al trabajar en dos equipos

1. **Al empezar:** `git pull`. Si cambió `pnpm-lock.yaml`, `pnpm install`; si cambió `db/`, recrear la BD.
2. **Al terminar:** actualizar `docs/estado.md`, hacer commit y `git push`.
3. Los datos de la BD no se sincronizan: se reconstruyen desde `db/*.sql`. Todo cambio de esquema va en un archivo versionado.
