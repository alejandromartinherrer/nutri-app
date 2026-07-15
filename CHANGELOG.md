# Changelog

## 1.6.0 — 2026-07-08 (Grupos de alimentos a la vista + más Realfooding)
### Nuevo
- **Etiquetas de tipo en la semana**: cada plato planificado muestra su grupo
  (Legumbres, Verduras, Pescado, Pollo, Carne, Huevos, Pasta…) con un color,
  para ver de un vistazo qué estás metiendo al planear. Las comidas «1º · 2º»
  muestran ambos grupos.
- **Resumen por día**: los días plegados enseñan puntos de color con los grupos
  de esa comida/cena, así ves «lo que toca» sin abrir el día.
- **+17 recetas Realfooding** (segunda tanda): cremas, ensaladas, curris de
  garbanzos, merluza al horno, sopa de miso, crepes de avena… El recetario
  pasa de 183 a 200 platos.
- Tests: 162 asserts.

## 1.5.0 — 2026-07-08 (Tachar comprados + recetas Realfooding)
### Nuevo
- **Marcar comprados** en «Para los platos de la semana»: toca un ingrediente
  para tacharlo (✓). Funciona en las dos vistas (Por plato y Todo junto) y el
  mismo ingrediente se tacha en todas partes. La cabecera muestra «X por
  comprar» y hay un botón **limpiar** para desmarcar todo.
  - El estado se guarda **por semana** (se reinicia solo al cambiar de semana)
    y viaja con la nube.
  - «Copiar lista» exporta solo **lo que falta** (excluye lo ya comprado).
  - En vista Por plato, cada plato muestra su progreso «comprados/total».
- **17 recetas Realfooding** (comida real, mínimamente procesada) añadidas al
  recetario, con macros y receta completa, estilo «Realfooding»: bowls,
  cremas, legumbres, pescados al horno, wok de tofu, tortitas de avena, etc.
  El recetario pasa de 166 a 183 platos.
- Tests: 153 asserts.

## 1.4.0 — 2026-07-08 (Dos vistas de la compra)
- «Para los platos de la semana» con conmutador **Por plato / Todo junto**:
  - **Por plato**: cada comida/cena con sus ingredientes desplegables (como
    en 1.3.2), con Expandir/Contraer todos.
  - **Todo junto**: una única lista con **todos los ingredientes de la semana**,
    sin repetir (dedupe sin tildes/mayúsculas) y ordenados por el nombre del
    ingrediente (no por la cantidad), para recorrer el súper de un tirón. Los
    platos sin receta se listan aparte para no perderlos.
- La vista elegida se recuerda (por dispositivo) y «Copiar lista» respeta la
  vista activa.
- Tests: 141 asserts.

## 1.3.2 — 2026-07-08 (La compra ahora sí muestra los ingredientes)
### Corregido
- «Para los platos de la semana» **rehecha**. Antes mostraba solo nombres de
  platos y, por un bug, ocultaba casi todos: un único enlace a la despensa
  (que «Sorpréndeme» ponía en la celda de la 1ª persona) marcaba el plato
  entero como «cubierto» y lo escondía. Resultado: solo se veían los
  desayunos. Ahora aparecen **todas** las comidas y cenas planificadas, cada
  una con **sus ingredientes** sacados de la receta.
### Nuevo comportamiento
- Cada plato es una fila plegable (número de ingredientes a la derecha); botón
  «▾ Ingredientes / ▴ Contraer» para abrir o cerrar todos a la vez.
- Los ingredientes que coinciden con algo de tu **despensa** se marcan
  «✓ ya tienes» (pista difusa, sin ocultar: si el nombre no cuadra, no se
  marca y no pasa nada).
- «Copiar lista» incluye ahora los ingredientes por plato (con «ya tienes»).
- El badge de la pestaña Compra cuenta lo que compras a mano (fruta/verdura +
  otros), no los platos.
- Solo comidas y cenas: desayunos/almuerzos son rutina (fruta, yogur…) y
  siguen en Fruta y verdura / Otros.
- Tests: 132 asserts.

## 1.3.1 — 2026-07-08
- «Enviar al frutero» ahora vive justo debajo de la sección Fruta y verdura
  (antes al final de la página); abajo queda solo «Copiar lista completa».

## 1.3.0 — 2026-07-08 (Caducidades, texto libre visible, expandir todo)
- **Caducidad en la despensa**: campo de fecha opcional al añadir; tocar un
  alimento lo edita (nombre/cantidad/unidad/caducidad). A ≤2 días se marca
  solo como «usar pronto» (con "caduca hoy/mañana/en 2 días"), en rojo si ya
  caducó, y pasa al grupo urgente: primero en despensa, en el picker y en
  «Sorpréndeme» (`DaysLeft`/`InvUrgent`).
- **Texto libre visible en el picker**: al escribir algo que no existe
  aparece un botón «➕ Usar “…” tal cual» (antes solo funcionaba pulsando
  Enter, indescubrible en móvil). Vale para 1º/2º/cenas y slots simples.
- **▾ Expandir / ▴ Contraer todos** los días de la semana con un botón sobre
  la lista.
- Tests: 122 asserts.

## 1.2.0 — 2026-07-08 (Sync sin fricción + recetas escalables)
### Características
- **Raciones escalables**: en la ficha de cada plato, chips ×1/×2/×4/×6 que
  multiplican las cantidades de los ingredientes (tiempos, temperaturas y
  porcentajes no se tocan). Fracciones bonitas (½, ¼, 1½).
- **Ingredientes en la compra**: cada plato «sin stock» tiene un botón 🧾 que
  despliega sus ingredientes (las composiciones 1º·2º suman ambos platos).
- **Rutina semanal editable**: Opciones → 🥣 Rutina semanal. 7 días ×
  (desayuno todos / almuerzo niños / almuerzo adultos). Vacío = no rellenar;
  «Restaurar original» vuelve a la rutina del SEED. Viaja con la nube.
- **Auto-guardado en la nube**: ~30 s después del último cambio (con token y
  con red), en silencio. El botón ☁️ sigue como acción manual.
- **Punto naranja en ☁️** cuando hay cambios sin subir (`updatedAt` >
  `lastSync`). Solo con token configurado.
- **Deshacer al adoptar la nube**: si al abrir llega una copia más reciente,
  el aviso lleva botón «Deshacer» (8 s) que restaura tu copia local y la
  marca como más nueva (se re-sube sola).
- **Los datos viven en la rama `data`**: los guardados ya no reconstruyen
  Pages ni ensucian el historial de `main`.

### Implementación
- `RecipeParts()` parsea la propia receta (sin duplicar datos);
  `ScaleQty()` escala cantidades respetando h/min/°C/%/días;
  `IngredientesDe()` fusiona composiciones.
- `state.plantilla` (opcional) con fallback a `DefaultPlantilla()` del SEED;
  `TemplateDish()` mantiene su firma.
- `CloudDirty()`/`UpdateCloudDot()`/`ScheduleAutoSync()`; adopción de nube
  fija `lastSync=updatedAt` para no marcar sucio lo recién bajado.
- Rama `data` creada desde `main` (incluye el último sync.json).
- Tests: **114 asserts** (28 nuevos).

## 1.1.1 — 2026-07-08 (Fixes móvil + auditoría)
- **Fix scroll en sheets (móvil)**: el contenido largo (fichas de receta,
  editor de platos) se salía por debajo de la pantalla sin poder llegar a
  «Guardar». Causa: `#sheetContent` sin `min-height:0` dentro del flex.
  Ahora el cuerpo scrollea dentro del sheet (88dvh máx.) y los campos se
  centran al enfocarse (teclado iOS).
- **Icono 📖 en Ideas**: cada plato con receta lo muestra junto al nombre —
  invita a tocar la fila para abrir la ficha.
- **Búsqueda sin tildes**: «atun» encuentra «Atún» (Ideas y picker).
- **Renombrar un plato actualiza las semanas planificadas** (también dentro
  de composiciones «1º · 2º»); antes quedaban referencias huérfanas cuyas
  macros dejaban de contar en silencio.
- Tests: 86 asserts (6 nuevos).

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
