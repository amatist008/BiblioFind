<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# AGENTS.md
This file provides guidance to agents when working with code in this repository.

## Non-Obvious Project Gotchas
- **Database**: MySQL 8.4 via `mysql2/promise` (NOT PostgreSQL, no ORM). Connects to port **3307** by default (avoiding 3306 host collisions).
- **Standalone Scripts**: `scripts/*.ts` must NEVER import `lib/db.ts` because it uses Next.js `server-only`. Use `mysql.createConnection()` directly. Run scripts with `node --env-file=.env scripts/<file>.ts`.
- **Dev Seeds**: Run `pnpm db:claves-dev` to set `DEV_PASSWORD` (min 12 chars in `.env`) for `@example.com` accounts, and `pnpm archivos:muestra` to generate mock PDFs in `storage/libros/`.
- **Transactions & Concurrency**: All copy/license mutations use `enTransaccion()` with strict lock acquisition order to prevent deadlocks:
  - Physical: `ejemplar` -> `reservas` -> `lector`.
  - Digital: `lector` -> `lotes` -> `(prestamos y reservas)`.
- **Floating Collection (RN-13)**: Returning a book at a different branch transfers ownership to that branch (`id_sede`), unlinks shelf location (`id_ubicacion = null`), and marks it `por_ubicar` (or `apartado` if reservations wait there).
- **Lazy Expiration (RN-48)**: No background cron jobs. Expired physical and digital reservations are cleaned up inside transactional actions before checking availability.
- **Session Auth (RN-63, RN-64)**: Cookie stores raw token; DB stores `SHA-256(token)`. `obtenerUsuario()` uses `React.cache()` for per-request memoization, validating active DB state every request.
- **Roles**: `admin_red` has `id_sede = null` and cannot perform desk loans/returns. Only `bibliotecario` and `coordinador` possess branch context for desk actions.
- **Action Helpers**: `lib/actions/reglas.ts` does NOT have `"use server"` so its helpers are not exposed as public RPC endpoints; uses `"server-only"`. Mutations return `EstadoFormulario` handled by `operar()`.
