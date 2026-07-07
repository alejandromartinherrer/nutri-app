# Changelog

## 1.1.0 — 2026-07-07 (Recetario vivo + Nube)
### Características
- **Recetario editable**: tocar un plato en Ideas abre su ficha (macros +
  receta); botón Editar para cambiar nombre, categoría, macros y receta.
  Los cambios viven en `state.userDishes` y sobreviven a cada arranque.
- **Recetas incluidas**: las 166 fichas traen receta (ingredientes + pasos),
  también las rutinas de desayuno/almuerzo. La receta escrita por el usuario
  siempre gana a la incluida.
- **Desayunos y almuerzos fijos**: cada semana nueva llega pre-rellenada con
  la rutina semanal (avena/tostada/yogur; fruta/yogur/sándwich niños).
  La plantilla nunca pisa celdas editadas ni «fuera de casa».
- **Guardar en la nube (☁️)**: commit de `data/sync.json` al propio repo vía
  GitHub API con token fine-grained (solo este repo, Contents: write).
  Al abrir con red, gana la copia más reciente (`updatedAt`). El token vive
  solo en `localStorage` (clave aparte) y nunca se exporta ni se sube.
- **Macros por día y por semana**: cada macro muestra g/día (negrita) y
  g/semana (atenuado); nota explicativa actualizada.
- **Buscar en todas las categorías**: pestaña «Todas» en Ideas y conmutador
  «Solo X / Todas las categorías» en el picker de Comida/Cena.
- Botón **Hoy** rediseñado (píldora con texto; resaltado al estar en otra
  semana) y ahora persiste el salto (faltaba `Save()`).
- Sin zoom por doble toque (viewport + `touch-action: manipulation`).
- Retirada la mención a Futurlife21 en «Acerca de».

### Implementación
- `SCHEMA_VERSION 2` (`menu_semana_v2`) con migración automática desde v1
  (añade `userDishes[]`, rellena rutinas vacías; la clave v1 se conserva).
- `RefreshCatalog()` sigue siendo el punto único de invalidación:
  `catalog = (SEED ∪ userDishes por nombre) − hidden`.
- `Save()` estampa `updatedAt`; `SaveQuiet()` para escrituras de arranque
  y adopción de nube (una simple apertura nunca gana a una edición real).
- Fix: `test/test.js` apuntaba a `planificador-comidas.html` (roto desde el
  rename a index.html) y tenía un error de sintaxis en la línea 44 — la
  suite nunca había compilado. Corregida y ampliada: **80 asserts** en verde
  en UTC / Europe/Madrid / America/Los_Angeles.

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
