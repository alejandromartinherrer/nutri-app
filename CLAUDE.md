# nutri-app — instrucciones para Claude

App web pública (GitHub Pages) de planificación de menús. **Un solo `index.html`** autocontenido
(~3.400 líneas: CSS inline, JS inline, datos embebidos) más `sw.js`. Sin build, sin framework,
sin `package.json`, sin dependencias externas. Documentación: `README.md`, `CHANGELOG.md`,
`HANDOFF.md`.

## Ejecutar y probar
- Local: `python -m http.server 8123` (configurado en `.claude/launch.json`) → http://localhost:8123
- Tests: `node test/test.js` — Node plano, sin framework. Extrae el `<script>` mayor de
  `index.html`, lo evalúa con stubs de DOM/localStorage y expone la API interna en `global.__api`.
  ~400 asserts. CI (`.github/workflows/ci.yml`) los corre en tres zonas horarias (UTC,
  Europe/Madrid, America/Los_Angeles): **toda lógica de fechas debe pasar en las tres**.
- Despliegue: GitHub Pages desde `main` (manual en Settings → Pages). No hay job de deploy.

## Dónde está cada cosa (`index.html`)
- Datos embebidos: `SEED` (catálogo base), `RECETAS`, `REALFOODING_DISHES`, `THEMES`, `AISLES`, `COCINA`.
- Estado: variable global `state` + `Load()` / `Save()` / `SaveQuiet()`; persistencia en
  `localStorage` (`STORE_KEY = "menu_semana_v2"`); token de GitHub en `localStorage["nutri_gh_token"]`
  y **nunca sale de ahí**.
- Render: `innerHTML` completo de `#view` (límite conocido, documentado en `README.md`).
- PWA: manifest generado en runtime desde el icono en base64; `sw.js` network-first solo para navegaciones.
- Sync en la nube: la app lee y escribe `data/sync.json` en la rama **`data`** vía GitHub API.
  **La copia de `data/sync.json` en `main` NO es la viva**: no editarla a mano ni tocar la rama `data`.

## Convenciones
- UI y documentación en español; identificadores en inglés (PascalCase en funciones, camelCase en variables).
- CSS con variables en `:root` (`--bg`, `--card`, `--ink`, `--muted`, `--line`, `--aub`, `--herb`,
  `--amber`, `--red`…), tema oscuro con `:root.dark`, escala de texto con `data-txt`. Sin preprocesador.
- Versionado: `APP_VERSION` (semver) y `SCHEMA_VERSION` (entero, migraciones de `state`) en
  `index.html`; cada versión con entrada en `CHANGELOG.md`; commits con prefijo `vX.Y.Z: …`,
  `docs: …`, `ci: …`.
- `HANDOFF.md` lista los **invariantes de negocio** con el incidente que motivó cada uno: léelo
  antes de tocar sync, listas de la compra, fechas o el composer de comidas. Un cambio que roce
  un invariante necesita un test que lo cubra.
- Hermana: `calendario-familiar` (misma estructura, sin código común). Los cambios de patrón
  (`sw.js`, sync, esqueleto de tests) suelen replicarse en las dos.

## Flujo de trabajo
1. Cambios en `index.html`; añadir o ajustar asserts en `test/test.js`.
2. `node test/test.js` en verde antes de dar nada por terminado.
3. Subir `APP_VERSION` (y `SCHEMA_VERSION` si cambia el formato de `state`) y anotar `CHANGELOG.md`.
