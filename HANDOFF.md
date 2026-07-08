# Nutri APP — Handoff

## Estado actual (v1.1.0 — 2026-07-07)
- Repo: `github.com/alejandromartinherrer/nutri-app` (público, Pages activo).
- App publicada: `https://alejandromartinherrer.github.io/nutri-app/`
- HTML: **index.html** (verificado; ya no existe nutri-app.html).
- Carpeta local: `C:\claude_projects\web-apps\nutri-app`
- Tests: **80 asserts en verde** (UTC/Madrid/LA). Nota: la suite estaba rota
  desde el inicio (sintaxis en línea 44 + nombre de fichero antiguo); ya
  compila y corre. Node LTS v24 instalado en el sistema (`node test/test.js`).

## Entregado en v1.1.0
1. **Recetario editable** — `state.userDishes[]` (upsert por nombre sobre
   SEED), editor completo en Ideas (nombre/categoría/tipo/estilo/batch/
   macros/receta). Ficha de plato al tocar: macros + receta.
2. **RECETAS embebidas** — las 166 + 6 rutinas, clave = nombre lowercased.
   `DishRecipe(name)`: receta del usuario gana a la embebida.
3. **Rutina fija desayuno/almuerzo** — `ApplyTemplate(week)` desde SEED.week
   en `EnsureWeek` + migración. Solo rellena celdas vacías no-away.
4. **SCHEMA v2** — `menu_semana_v2`; `MigrateV1()` desde `menu_semana_v1`
   (clave v1 se conserva como red de seguridad).
5. **Nube (☁️)** — `data/sync.json` vía GitHub Contents API. PAT fine-grained
   en `localStorage["nutri_gh_token"]` (NUNCA en state/export/sync.json).
   `Save()` estampa `updatedAt`; `SaveQuiet()` no (boot/adopt). Pull al
   arrancar con red: adopta si `remote.updatedAt > local.updatedAt`.
6. Macros g/día + g/semana; búsqueda «Todas» (Ideas y picker `picker.all`);
   sin double-tap zoom; botón Hoy píldora con estados here/away; Acerca de
   sin Futurlife21.

## PENDIENTE para que la nube funcione (acción del usuario)
1. Crear token: GitHub → Settings → Developer settings → Fine-grained
   tokens → Only select repositories: `nutri-app` → Contents: Read and
   write → caducidad (p. ej. 90 días).
2. En la app: Opciones (⋯) → «Nube (GitHub) — configurar» → pegar token.
3. Probar: ☁️ → debe aparecer `data/sync.json` en el repo. En el iPhone,
   configurar el mismo token y abrir la app: adoptará la copia.

## Invariantes (no romper)
- `RefreshCatalog()` = punto ÚNICO de invalidación del catálogo/_macroIndex.
  catalog = (SEED ∪ userDishes por nombre) − hidden. SEED nunca se muta.
- Offline-first: el arranque nunca espera red (CloudPullOnBoot es
  fire-and-forget con catch silencioso).
- El token jamás entra en `state`, exportaciones ni `sync.json`
  (test lo cubre: BuildSyncPayload excluye catalog; payload sin token).
- `Ymd()` para fechas locales; nada de toISOString() para date-only.
- Tests portables: leen el `<script>` más largo de index.html; los stubs
  de DOM en test.js solo implementan classList add/remove (no toggle).

## Ideas futuras (no comprometidas)
- Editar la rutina de desayunos desde la UI (hoy es SEED-only).
- Sync automático (debounced) además del botón manual.
- Indicador visual de «cambios sin subir» en el botón ☁️.
- Lista de la compra generada desde los ingredientes de las recetas.
