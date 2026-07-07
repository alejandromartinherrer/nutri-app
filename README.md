# Nutri APP

Planificador semanal de comidas familiar. **Un solo HTML**, sin
dependencias, offline, instalable como PWA en iOS.

## Estructura

| Archivo | Rol |
|---|---|
| `nutri-app.html` | La app completa (UI + lógica + datos SEED) |
| `sw.js` | Service worker: offline tras la primera visita (opcional pero recomendado) |
| `test/test.js` | Suite (95 tests) que se ejecuta contra el HTML publicado, sin build |
| `.github/workflows/ci.yml` | CI: suite bajo UTC, Europe/Madrid y America/Los_Angeles |
| `CHANGELOG.md` | Historial de versiones |
| `recetario/` | Recetario-saludable.xlsx (entrada de datos) |

## Despliegue (GitHub Pages, también desde iPhone)

1. Sube `nutri-app.html` y `sw.js` a la raíz del repo
   (o renombra el HTML a `index.html`).
2. Settings → Pages → Deploy from branch → `main` → `/ (root)`.
3. Abre la URL en Safari → Compartir → **Añadir a pantalla de inicio**.

El SW requiere HTTPS (Pages lo es). Si falta `sw.js`, la app funciona
igual, solo pierde la garantía offline.

## Flujo de cambios

1. Edita el HTML. Si cambias comportamiento: sube `APP_VERSION`
   (semver) y anota en `CHANGELOG.md`. `SCHEMA_VERSION` solo si rompe
   el estado guardado.
2. `node test/test.js` en local (idealmente `TZ=Europe/Madrid`).
3. Push → la Action debe quedar en verde (3 zonas horarias).
4. Pages publica. Los usuarios reciben la nueva versión en la primera
   visita con red (estrategia network-first del SW).

## Datos y trazabilidad

- El **recetario** es dato de referencia embebido (SEED): se
  reconstruye en cada arranque; actualizarlo = editar SEED + release.
- El **estado del usuario** (semanas, despensa, compra, tema) vive en
  `localStorage` (`nutri_app_v1`). Backup: menú ⋯ → Exportar copia.
- Macros: estimación por ración estándar de adulto (niños ≈ ×0,6);
  no es medición. Inspiración: comida real / Futurlife21.

## Límites conocidos

- Render por `innerHTML` completo: al re-renderizar se pierde
  foco/scroll. Aceptable al tamaño actual; rediseñar si crece.
- El SW cachea solo navegaciones (la app no tiene más assets: icono y
  manifest van inline).
- `Sorpréndeme` no propone cena de dos platos (decisión de producto).
