# Changelog

## 1.0.0 — 2026-07-02 (Nutri APP Launch)
### Características
- Planificador semanal (lun–dom), 4 slots: Desayuno, Almuerzo, Comida, Cena.
- **Comida:** 1º + 2º (ambos opcionales, cursos distintos) — composición `" · "`.
- **Cena:** 1–2 platos (igual compositor que comida).
- Despensa (frigo+conge), compra (produce+dishes needing shopping).
- Macros por persona: Nosotros (adulto ×1), Noah e Iria (×0,6).
- Recetario: 166 platos (75 originales + 91 Futurlife21: sabores mundo, caprichos sanos, batch cooking).
- Export/Import JSON, WhatsApp (menú + frutero), Sorpréndeme, 5 temas.
- PWA instalable iOS, offline (Service Worker), no dependencias.

### Implementación
- Fechas: `Ymd()` (local, sin UTC round-trip) — fix para Madrid UTC+1/+2.
- Catálogo: `RefreshCatalog()` (singular invalidation point) — actualizaciones llegan a usuarios instalados.
- Macros: `MacroIndex` (Map memoizado, O(1)) + `MealMacros` (suma composición `" · "`).
- User deletions: `state.hidden` (array, persisted) — sobreviven re-seed.
- Accesibilidad: zoom habilitado, botones reales, dialog (role + aria-modal + focus trap + Esc).
- Validación: `ValidState()` — load/import robusto.
- SW: network-first (online = always refresh cache; offline = fallback).
- Tests: 95 (UTC, Europe/Madrid, America/Los_Angeles).
- CI: GitHub Actions, auto-run en 3 zonas horarias.

### Breaking changes (vs. Planificador v1.1.0)
- Store key: `menu_semana_v1` → `nutri_app_v1`.
- App version: 1.1.0 → 1.0.0 (fresh start).
- Name: Planificador → Nutri APP.
