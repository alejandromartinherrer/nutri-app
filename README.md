# Nutri APP

Planificador semanal de comidas familiar. **Un solo HTML**, sin
dependencias, offline, instalable como PWA en iOS.

Cuatro pestañas: **Semana** (planificar), **Despensa** (con caducidades),
**Compra** (ingredientes sacados de las recetas, escalados por comensales) y
**Recetario** (200 platos con macros y receta escalable ×1–×6). Los datos se
sincronizan entre dispositivos vía GitHub.

## Estructura

| Archivo | Rol |
|---|---|
| `index.html` | La app completa (UI + lógica + datos SEED + recetario con recetas) |
| `sw.js` | Service worker: offline tras la primera visita (opcional pero recomendado) |
| `data/sync.json` | Copia de la nube — vive en la rama **`data`** (la escribe la propia app) |
| `test/test.js` | Suite (279 asserts) que se ejecuta contra el HTML publicado, sin build |
| `.github/workflows/ci.yml` | CI: suite bajo UTC, Europe/Madrid y America/Los_Angeles |
| `CHANGELOG.md` | Historial de versiones |
| `recetario/` | Recetario-saludable.xlsx (entrada de datos original) |

## Despliegue (GitHub Pages, también desde iPhone)

1. Sube `index.html` y `sw.js` a la raíz del repo.
2. Settings → Pages → Deploy from branch → `main` → `/ (root)`.
3. Abre la URL en Safari → Compartir → **Añadir a pantalla de inicio**.

El SW requiere HTTPS (Pages lo es). Si falta `sw.js`, la app funciona
igual, solo pierde la garantía offline.

## Sincronización entre dispositivos (☁️)

- El botón **☁️** del encabezado sube el estado a `data/sync.json` en la
  rama **`data`** de este repo vía GitHub API (así los guardados no
  reconstruyen Pages ni ensucian `main`). Además hay **auto-guardado**
  ~30 s tras el último cambio, y un punto naranja en ☁️ marca cambios sin
  subir. Al abrir la app con red, se adopta la copia más reciente
  (`updatedAt`, last-write-wins) con opción **Deshacer** durante 8 s.
- Si la rama `data` se borrara, hay que recrearla (p. ej.
  `git push origin main:data`); la app no la crea sola.
- Requiere un **token fine-grained** (solo este repo, permiso *Contents:
  Read and write*, con caducidad), que se pega en Opciones → Nube (GitHub).
- El token vive solo en `localStorage` del dispositivo (clave
  `nutri_gh_token`), separado del estado: **nunca** viaja en exportaciones
  ni en `sync.json`.
- Riesgo asumido: quien tenga el dispositivo desbloqueado puede leer el
  token y escribir en este repo. Mitigación: alcance mínimo + caducidad.

## Flujo de cambios

1. Edita el HTML. Si cambias comportamiento: sube `APP_VERSION`
   (semver) y anota en `CHANGELOG.md`. `SCHEMA_VERSION` solo si rompe
   el estado guardado (añade migración en `Load()`).
2. `node test/test.js` en local (idealmente `TZ=Europe/Madrid`).
3. Push → la Action debe quedar en verde (3 zonas horarias).
4. Pages publica. Los usuarios reciben la nueva versión en la primera
   visita con red (estrategia network-first del SW).

## Datos y trazabilidad

- El **recetario base** es dato de referencia embebido (SEED + RECETAS):
  se reconstruye en cada arranque; actualizarlo = editar SEED + release.
- Las **ediciones del usuario** (`state.userDishes`, upsert por nombre)
  y los borrados (`state.hidden`) se aplican encima del SEED en
  `RefreshCatalog()` — punto único de invalidación — y persisten.
- El **estado del usuario** (semanas, despensa, compra, platos editados,
  tema) vive en `localStorage` (`menu_semana_v2`; migración automática
  desde `menu_semana_v1`). Backup: menú ⋯ → Exportar copia.
- Macros: estimación por ración estándar de adulto (niños ≈ ×0,6);
  no es medición.

## Límites conocidos

- Render por `innerHTML` completo: al re-renderizar se pierde
  foco/scroll. Aceptable al tamaño actual; rediseñar si crece.
- El SW cachea solo navegaciones (la app no tiene más assets: icono y
  manifest van inline; las llamadas a api.github.com no se interceptan).
- `Sorpréndeme` no propone cena de dos platos (decisión de producto).
- La nube es last-write-wins por `updatedAt`: si dos dispositivos editan
  a la vez sin guardar, gana el último en subir (uso familiar, aceptado).
