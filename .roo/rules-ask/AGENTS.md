# AGENTS.md — Ask Mode Rules

Domain context, naming conventions, and business rules for `bibliotecaNext`:

- **Single Sources of Truth**: Business logic and domain specs reside in `docs/reglas-de-negocio.md` (`RN-xx`), database structure in `docs/modelo-datos.md`, current roadmap/status in `docs/estado.md`, and UI decisions in `docs/diseno.md` (`DI-xx`). Do not invent rules when answering questions.
- **Naming Conventions**:
  - Database: Spanish, `snake_case`, singular names (`id_<tabla>`, e.g., `id_ejemplar`, `id_prestamo`). Statuses are defined as `ENUM` values.
  - TypeScript: Spanish identifier names aligned with DB entities (`LibroResumen`, `UsuarioSesion`, `RolEmpleado`).
- **Floating Collection (Colección Flotante, RN-13)**: Physical copies do not stay tied to their home branch. Returning a book at a different branch reassigns `id_sede` to the receiving branch, unlinks shelf location (`id_ubicacion = null`), and marks it `por_ubicar` (or `apartado` if a reservation is waiting at that branch).
- **Lazy Expiration (Vencimiento Perezoso, RN-48)**: No background crons or schedulers exist. Overdue reservation pickups and expired digital allocations transition lazily inside transactional operations (`procesarReservasVencidas`, `procesarColaDigital`).
- **Physical vs Digital Licensing**:
  - Physical: Controlled per copy (`ejemplar`) by branch (`sede`).
  - Digital: Controlled by license batches (`lote_licencia`) across the network, assigned to titles (`libro`), selecting earliest expiring batches that fulfill loan duration (RN-55).
- **Staff Roles**:
  - `admin_red`: Network admin without assigned branch (`id_sede = null`); cannot issue or return physical loans at desk.
  - `coordinador` / `bibliotecario`: Bound to a specific branch (`id_sede`); handle desk circulation and branch collection.
