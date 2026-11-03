# AGENTS.md — Architect Mode Rules

Architectural boundaries and data persistence invariants for `bibliotecaNext`:

- **Layered Architecture & Separation**:
  - `app/`: Presentation layer. Server Components handle read queries via `lib/data/`; Client Components handle user events and invoke Server Actions. Components NEVER write raw SQL or import `mysql2`.
  - `lib/data/`: Data Access Layer (DAL). Plain parameterized SQL functions. Read queries use `pool.execute()`; row-locking queries accept an explicit `conexion: PoolConnection`.
  - `lib/actions/`: Business & mutation layer. Files with `"use server"` expose action RPCs returning `EstadoFormulario`.
  - `lib/actions/reglas.ts`: Action domain logic and helpers (`server-only`, NO `"use server"`).
  - `lib/db.ts`: Connection pool and `enTransaccion()` transaction runner.
- **ORM-Free SQL**: Hand-written parameterized SQL using `mysql2/promise`. Dynamic configuration values (loan days, maximum concurrent loans, fine amounts) must be read from database tables (`tipo_lector`, `configuracion`), never hardcoded in code (C-04).
- **Transaction & Lock Discipline**: State-changing operations on copies (`ejemplar`), stock, or digital licenses must run inside `enTransaccion()`. Row locks (`FOR UPDATE` / `FOR SHARE`) must be acquired in canonical order across all actions to avoid distributed deadlocks.
- **Permission Matrix**: All panel authorization is governed exclusively by `lib/permisos.ts` (`PERMISOS`, `SECCIONES_PANEL`). Role definitions are kept unified between navigation rendering and backend enforcement (`exigirEmpleado()`).
- **Secure Digital Asset Storage**: E-book files (`storage/libros/`) are strictly isolated outside the `public/` web root, accessible only through route handlers (`app/leer/[isbn]/archivo/route.ts`) after verifying active digital loans or purchases (RN-29).
