# Nutri APP v1.0.0 — Compacto

## Estado actual
- App HTML monofichero funcional (139KB).
- 166 platos (75 originales + 91 Futurlife21: sabores mundo, caprichos sanos, batch cooking).
- 95 tests (UTC, Europe/Madrid, America/Los_Angeles).
- Repo GitHub `nutri-app` listo para Pages.

## Feature set final
- Semana planner: lun–dom, 4 slots (Desayuno, Almuerzo, Comida, Cena).
- Comida: 1º + 2º (ambos opcionales, cursos distintos) — composición `" · "`.
- Cena: 1–2 platos (igual compositor).
- Despensa (frigo+conge), compra (produce+dishes needing shopping), macros/persona, recetario (Ideas), temas.
- Export/Import JSON, WhatsApp menú+frutero, Sorpréndeme (comida 1º+2º, cena único).
- PWA: instalable iOS, offline (SW), no dependencias.

## Schema v1 (CRITICAL)
```
state = {
  catalog: [...],           // rebuilt from SEED en init/import/reset
  hidden: ["lower_name"],   // user deletions survive re-seed
  weeks: {iso_lun: {days}},
  members: [{id, name, color, factor}],
  inventory: {frigo, conge},
  produce: [{id, name, qty, unit, done}],
  extras: [{id, name, done}],
  theme: "fresco",
  current: "2026-06-22"     // lun de la semana actual
}
_macroIndex = Map(name.toLowerCase() -> {kcal, prot, carb, fat})
_lastFocus = HTMLElement | null  // focus restore on sheet close
```

## Invalidation points (EXACT)
- `init()` → `RefreshCatalog()` + normalize extras/hidden.
- `import(data)` → `ValidState(data)` + `RefreshCatalog()`.
- `reset` → `SeedState()` + `RefreshCatalog()`.
- `idea-del` → invalidate index + persist deletion → `state.hidden`.

## Constants (NO MAGIC STRINGS)
```js
const APP_VERSION = "1.0.0"
const SCHEMA_VERSION = 1
const STORE_KEY = "nutri_app_v" + SCHEMA_VERSION
const SEP = " · "
const MEMBER_IDS = ["nosotros","noah","iria"]
```

## Critical functions
- `Ymd(d)` — local YYYY-MM-DD (fixes UTC off-by-one in Madrid).
- `BuildCatalog()` — SEED.catalog + id + estilo + batch; used by RefreshCatalog().
- `MacroIndex()` — memoized Map; invalidate on RefreshCatalog().
- `DishMacros(name)` → O(1) via index.
- `MealMacros(dish)` — splits by SEP, sums macros.
- `ValidState(s)` — shape check; used in Load() + import.
- `RefreshCatalog()` — singular invalidation point; rebuild catalog + index, apply hidden list.

## Offline strategy
- SW: network-first (always try network, fallback to cache). Navigations only.
- Auto-register in init() (silent if unsupported/missing).
- Best-effort: app works without SW, just no fallback.

## Accessibility
- Viewport: zoom enabled (no `maximum-scale`).
- Buttons: real `<button>` + `aria-label`, not `<div>`.
- Sheet: `role="dialog"` + `aria-modal`, focus trap (open/close/Esc).
- Focus mgmt: `_lastFocus` → restore on close.

## Files (repo structure)
```
nutri-app/
├── nutri-app.html           (app, v1.0.0)
├── sw.js                    (offline)
├── test/test.js             (95 tests, portable)
├── .github/workflows/ci.yml (GitHub Actions, 3 TZ)
├── README.md                (deploy, structure, limits)
├── CHANGELOG.md             (versions, breaking changes)
├── HANDOFF.md               (this file)
└── recetario/
    └── Recetario-saludable.xlsx
```

## Known limits
- Render: full re-render by innerHTML (loses focus/scroll). Acceptable; redesign if grows.
- Meals: composed via `SEP` constant (not flexible for other delimiters).
- Catalog filtering: `O(1)` via MacroIndex, but invalidate on SEED changes.
- Dates: Ymd() is local; no timezone conversion (correct for single-region app).
- Missing: ingredientes/compra real, batch cooking automation, balance semanal por tipo, historial/no-repeat.

## Próximos pasos
1. GitHub: create repo `nutri-app` → Pages → URL.
2. Safari iPhone: open URL → Compartir → Añadir a pantalla de inicio.
3. Optional: commit HANDOFF.md si alguien retoma en 6+ meses.

## Riesgos
- localStorage corruption → ValidState() catches, re-seeds (safe).
- SEED changes → RefreshCatalog() ensures catalog updated; user deletions (hidden) survive.
- SW missing → app works (no offline fallback).
- Dates in UTC+X zones: fixed via Ymd().
- MacroIndex stale: only if RefreshCatalog() not called (see invalidation points).

## Resumption prompt (2 líneas)
```
Nutri APP v1.0.0: PWA planner comidas (166 platos). Crítico: Ymd (dates local), RefreshCatalog (catalog re-seed), 
state.hidden (user deletions), MacroIndex (O(1)), ValidState (load robust), SEP="·", MEMBER_IDS constant. 
Schema v1: {catalog (rebuilt), hidden, weeks, members, inventory, produce, extras, theme, current}.
Next: GitHub repo nutri-app → Pages → iPhone.
```
