# AGENTS.md — Code Mode Rules

Non-obvious coding rules and internal conventions for `bibliotecaNext`:

- **Action Boundary & Security**: Server Actions in `lib/actions/*.ts` have `"use server"`. Shared helpers live strictly in `lib/actions/reglas.ts` (has `import "server-only"`, NEVER `"use server"`) to avoid inadvertently exposing helper functions as public RPC endpoints.
- **Action Error Handling**: Throw `ErrorDeRegla` inside `operar()` callbacks to trigger automatic `ROLLBACK` via `enTransaccion()` and expose clean user-facing error messages in `EstadoFormulario.error`. Any non-`ErrorDeRegla` is masked as a generic error to prevent information leakage.
- **Strict Lock Hierarchy**: To prevent MySQL deadlocks (`ER_LOCK_DEADLOCK`), lock rows in deterministic sequence:
  - Desk/Circulation: `bloquearEjemplarPorCodigo` -> `bloquearReserva...` -> `bloquearLectorPorDocumento`.
  - Digital Lending: `bloquearLectorDigital` -> `bloquearLotesDelTitulo` -> `(prestamo / reservas)`.
- **Decimal Numbers**: `lib/db.ts` sets `decimalNumbers: true` in the connection pool configuration. MySQL `DECIMAL` types return as JavaScript `number` (not strings).
- **Session Resolution**: Do not read cookies directly in components. Call `obtenerUsuario()` (memoized per-request via `React.cache()`). For route/action guards, use `exigirEmpleado(permiso?)` or `exigirLector()`.
- **Client Components Separation**: Components receiving DB rows must only consume plain serializable objects typed in `lib/definitions.ts`. Never perform SQL queries inside components.
- **Open Redirect Guard**: When redirecting after login or state changes, always sanitize target paths using `rutaInterna()` from `lib/sesion.ts`.
