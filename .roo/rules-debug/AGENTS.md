# AGENTS.md — Debug Mode Rules

Non-obvious debugging gotchas and runtime pitfalls in `bibliotecaNext`:

- **Session DB Lookups**: The `sesion` cookie holds a raw `base64url` token, but the `sesion` table only stores `token_hash = SHA-256(raw_token)`. To debug or locate a session in the database, calculate `SHA-256` of the cookie value first.
- **Docker Volume Initialization**: Scripts in `db/init/` execute in alphabetical order ONLY during first container run with an empty volume. Schema changes in `db/init/*.sql` will not apply to existing instances unless you run `docker compose down -v && docker compose up -d`.
- **Database Port Collision**: MySQL is bound to port `3307` on `127.0.0.1` (`DB_PORT=3307` in `.env`). Attempting to connect to default `3306` will either fail or hit external containers.
- **Standalone Script Failures**: Never import `lib/db.ts` inside CLI scripts (`scripts/*.ts`). `lib/db.ts` enforces `import "server-only"`, throwing runtime crashes outside of Next.js. Scripts must open dedicated connections via `mysql.createConnection()`.
- **Missing Passwords for Seed Users**: All seed accounts (`@example.com`) have placeholder/invalid password hashes until `pnpm db:claves-dev` is executed with `DEV_PASSWORD` (min 12 characters in `.env`).
- **Digital PDF 404s**: Digital reading route `/leer/[isbn]/archivo` reads PDFs from local `storage/libros/` (gitignored). If missing, run `pnpm archivos:muestra` to generate mock PDF files.
- **Simulated Email Logs**: No external SMTP provider is configured (RN-70). Verification codes and reservation release notices are logged directly to the server terminal (`[correo simulado]`).
