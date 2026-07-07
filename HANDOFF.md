# Nutri APP — Handoff (para Cowork)

## Objetivo de la próxima sesión
Recetario **editable desde la app** (añadir/editar/borrar platos con macros) y
**Guardar → commit automático al repo GitHub** para que la app publicada se
actualice sola.

## Estado actual (v1.0.0 — FUNCIONANDO)
- Repo: `github.com/alejandromartinherrer/nutri-app` (público, Pages activo).
- App publicada: `https://alejandromartinherrer.github.io/nutri-app/`
- Instalada en iPhone (Añadir a pantalla de inicio). Funciona offline.
- Carpeta local (Cowork debe apuntar aquí):
  `C:\claude_projects\web-apps\nutri-app`
- Flujo de cambios: editar local → GitHub Desktop → Commit to main → Push
  → Pages republica → la app del iPhone se actualiza en la próxima apertura
  con red (SW network-first).
- ⚠️ Verificar al retomar: si el HTML del repo sigue llamándose
  `nutri-app.html` o ya se renombró a `index.html` (Pages sirve la raíz solo
  con index.html; el usuario confirmó "funciona perfecto" pero no con cuál).

## Archivos del repo
```
nutri-app/
├── index.html (o nutri-app.html — VERIFICAR)   app completa, 139KB
├── sw.js                                        offline (network-first)
├── test/test.js                                 95 tests, portable (lee el HTML)
├── .github/workflows/ci.yml                     CI: UTC + Madrid + LA
├── recetario/Recetario-saludable.xlsx           fuente de datos (NO conectada)
├── README.md · CHANGELOG.md · HANDOFF.md
```

## Schema v1 (NO reconstruir de memoria)
```
STORE_KEY = "nutri_app_v1"   (localStorage)
state = { catalog (rebuilt from SEED), hidden[], weeks{}, members[],
          inventory{frigo,conge}, produce[], extras[], theme, current }
_macroIndex = Map(name.lower -> {kcal,prot,carb,fat})
const APP_VERSION="1.0.0"; SCHEMA_VERSION=1; SEP=" · ";
const MEMBER_IDS=["nosotros","noah","iria"]
```
- Invalidación única: `RefreshCatalog()` (init / import / reset / idea-del).
- `ValidState()` valida load/import. `Ymd()` fechas locales (fix Madrid).
- Comida = 1º·2º, Cena = 1–2 platos (compositor, separador SEP).
- 166 platos con estilo + batch. Macros: ración adulto; niños ×0,6.

## Diseño propuesto para la nueva feature (discutir al retomar)
1. **Editor en la app** (vista Ideas): alta/edición/borrado de platos
   (nombre, curso, grupo, estilo, batch, macros).
   - CONFLICTO ARQUITECTÓNICO a resolver: hoy `RefreshCatalog()` reconstruye
     el catálogo desde SEED en cada arranque (los platos editados se
     perderían). Cambiar el modelo a: `catalog = SEED + state.userDishes[]
     (added/edited) − state.hidden[]`, todo persistido y exportado en JSON.
     `SCHEMA_VERSION → 2` con migración.
2. **Guardar → GitHub**: commit del HTML actualizado (o de un `recetario.json`
   separado) vía GitHub API `PUT /repos/{owner}/{repo}/contents/{path}`.
   - Requiere PAT fine-grained (solo repo nutri-app, permiso Contents:write)
     guardado en el dispositivo (localStorage) — evaluar riesgo y alternativa
     (p. ej. seguir con export manual + GitHub Desktop, o separar datos de
     código: la app carga `recetario.json` del repo y solo ese fichero se
     commitea).
   - Recomendación a evaluar primero: separar recetario a `recetario.json`
     (fetch en arranque con fallback a SEED embebido para offline). Simplifica
     el commit (fichero pequeño, sin tocar el HTML) y mantiene tests.

## Pendiente
- [ ] Verificar index.html vs nutri-app.html.
- [ ] Decidir arquitectura (userDishes vs recetario.json) antes de codificar.
- [ ] SCHEMA_VERSION 2 + migración si se toca el modelo.
- [ ] Actualizar test/test.js (95 → ampliar con editor + persistencia).
- [ ] CHANGELOG + APP_VERSION 1.1.0 al entregar.

## Riesgos
- PAT en el móvil = quien tenga el teléfono puede escribir en el repo.
- Editar catálogo rompe supuestos de MacroIndex/RefreshCatalog: tocar SOLO
  vía el punto de invalidación único.
- No degradar offline: la app debe seguir 100% funcional sin red.

## Prompt de reanudación (pegar en Cowork)
```
Retomo Nutri APP (PWA HTML monofichero, v1.0.0 publicada en GitHub Pages,
repo alejandromartinherrer/nutri-app, carpeta local
C:\claude_projects\web-apps\nutri-app). Lee HANDOFF.md del repo.
Objetivo: recetario editable desde la app + guardar con sync a GitHub.
Antes de codificar: (1) verifica si el HTML es index.html o nutri-app.html,
(2) proponme la arquitectura (userDishes persistido vs recetario.json
separado + GitHub API) con pros/contras y riesgos del token, y espera mi OK.
Restricciones: mantener offline-first, RefreshCatalog como punto único de
invalidación, SCHEMA_VERSION 2 con migración, actualizar tests y CHANGELOG.
```
