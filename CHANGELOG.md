# Changelog

## 1.11.0 — 2026-07-21 (Menú de opciones: 7 entradas → 4)
- Las cuatro entradas de nube y copias se funden en **una sola: «🔐 Copia de
  seguridad»**, que además dice su propio estado en el menú («al día» /
  «cambios sin subir» / «sin configurar»), así que no hay que abrirla para mirar.
  - Fuera **«Guardar en la nube ahora»**: era exactamente el botón ☁️ de la cabecera.
  - **Exportar** e **importar** pasan dentro de esa pantalla, junto al token.
- **El token caducado ya no te deja tirado.** Antes el aviso decía «Opciones →
  Nube», que era una entrada de menú; ahora **abre la pantalla directamente**
  con el aviso y el campo listo. El token caduca cada 90 días: esto no podía
  depender de recordar dónde estaba la opción.
- **Importar ahora avisa antes de sustituir**: dice cuántas semanas y platos
  trae el archivo, pide confirmación y deja **Deshacer**. Antes reemplazaba
  todo tu estado en cuanto elegías el fichero.
- Mensajes de nube en cristiano: «Otro dispositivo subió cambios antes. Pulsa
  ☁️ otra vez.» y «No se ha subido. Tus datos están en el móvil y se
  reintentará» en vez de textos venidos de códigos HTTP.

## 1.10.0 — 2026-07-21 (Temas 1 y 3 de la auditoría)
### Nada se borra sin vuelta atrás (tema 1)
- **Deshacer en todos los borrados** de despensa, fruta/verdura y otros: el
  aviso trae un botón «Deshacer» durante 8 s que devuelve el elemento **a su
  posición exacta**. Antes desaparecía en silencio y para siempre.
- **Confirmación al borrar un plato con receta tuya escrita** — lo único que no
  se puede reconstruir. Si no tiene receta propia, se borra con Deshacer.
- Un aviso normal ya no puede pisar un «Deshacer» que estés a punto de pulsar.
- **Verbos honestos**: «Quitar» significaba dos cosas opuestas con el mismo
  rojo. Ahora es «Dejar vacío» (vaciar un hueco) y «Borrar del recetario».
### Compra y Despensa cierran el círculo (tema 3)
- **Botón «✅ Ya está en casa»**: al volver del súper, una hoja con todo lo que
  tachaste, un toque por producto para decir si va al frigo o al congelador, y
  entra en tu despensa. Los nombres se limpian solos («250 g de lentejas» →
  «Lentejas»). Al guardar se vacían los tachados de la semana.
  Antes no existía ningún camino de vuelta: planificar sí descontaba stock, así
  que la despensa se desfasaba y arrastraba a «ya tienes» y «Sorpréndeme».
- **Ingredientes escalados de verdad**: la receta es para 2 y coméis 4, o el
  plato se repite dos días → las cantidades se multiplican. El factor se
  muestra siempre («para 6 · ×1,5»), nunca es magia silenciosa.
- **Los tachados se reinician al cambiar de semana**. Antes el lunes abrías con
  la lista de la semana pasada tachada y mandabas al frutero un pedido
  incompleto sin enterarte.
- **«ya tienes» ya no se equivoca**: se compara el sustantivo principal del
  producto. «Caldo de pollo» dejó de marcar «400 g de pechuga de pollo», y
  ahora se lee qué producto concreto lo cubre («ya tienes: Caldo de pollo»).
- **La lista combinada va por pasillos del súper** (fruta y verdura · carne y
  pescado · frescos · despensa · congelados) en vez de por orden alfabético.
- **Badge honesto**: contaba 3 cuando quedaban 25 ingredientes por comprar.
- Renombrada a «🍳 Ingredientes de tus comidas y cenas».
- Tests: 251 asserts.

## 1.9.0 — 2026-07-21 (El selector de plato, rehecho — tema 2 de la auditoría)
### Nuevo
- **Chips «¿Para quién?»: Todos · Nosotros · Noah · Iria.** Sustituyen al
  interruptor «Aplicar a todos». Antes, si los tres comían lo mismo **no había
  forma de cambiar solo el plato de Iria**: la fila abría siempre en modo «para
  todos» y al apagar el interruptor caías en «Nosotros». Ahora eliges el
  comensal de un toque y el composer carga **su** plato actual.
- **Pista tras elegir el 1º**: «Elige un 2º si quieres, o pulsa Guardar ✓».
  La diferencia entre Desayuno (un toque) y Comida/Cena (componer + guardar)
  ya no hay que adivinarla.
- **Pista de texto libre siempre visible**: con el buscador vacío se lee
  «➕ ¿No está en la lista? Escríbelo y se usa tal cual».
### Corregido
- **El buscador ya no se destruye al teclear.** El selector se redibuja **por
  zonas**: al escribir solo se repinta la lista, no la hoja entera. El teclado
  del iPhone deja de parpadear, sobreviven autocorrector y dictado, y **el
  scroll se queda donde estaba** (verificado: 250 px → 250 px).
- **La hoja se apoya sobre el teclado** en vez de esconderse detrás: la altura
  del teclado se expone como `--kb` desde `visualViewport` y el sheet la
  descuenta. Antes quedaban ~250 px útiles con todo lo buscado tapado.
- Al elegir un plato, la hoja vuelve arriba, que es donde están el composer y
  el botón Guardar.

## 1.8.0 — 2026-07-21 (Primera tanda de la auditoría UX)
### Nuevo
- **La app abre siempre en la semana de hoy, con solo el día de hoy desplegado.**
  Antes se quedaba en la semana que dejaste abierta (si el domingo planificabas
  la siguiente, el lunes aterrizabas en la equivocada). Además se corrige al
  volver a la app tras pasar de medianoche. `GoToThisWeek()`.
- **Tocar el nombre de un plato en la Semana abre su receta**, con sus macros y
  el escalado ×1/×2/×4/×6. Un 📖 discreto marca qué nombres son pulsables; el
  resto de la fila sigue abriendo el selector para cambiar el plato. En las
  comidas de dos platos, cada parte abre la suya. El texto libre (sin receta)
  no es pulsable.
- **El buscador del recetario manda sobre la pestaña**: si escribes, busca en
  los 201 platos y cada resultado muestra su categoría. Antes, buscar «salmón»
  desde la pestaña *Primeros* daba «Nada aquí todavía» teniendo 8 platos de
  salmón — el camino directo a crear duplicados.
### Corregido
- **Zonas táctiles al mínimo de Apple.** Antes había controles de 18–30 px: la
  casilla de tachar en el súper (24), la estrella de la despensa (23), los
  botones de borrar (30), «para todos ›» (18), «+ añadir» (19) y la propia fila
  para añadir una comida (30). Ahora el mínimo real es 38–44 px en todo, sin
  mover el diseño (relleno compensado con margen negativo, y área de toque
  invisible alrededor de las casillas).
- **Los filtros de tipo se ven enteros**: los 9 chips y las 5 pestañas del
  recetario pasan a varias líneas en vez de esconderse en un scroll horizontal
  que no se intuía (antes se veían 3 de 9).
- El nombre del plato ahora pesa más que la etiqueta del comensal (15,5 px / 600).
### Eliminado
- **«Reiniciar con los datos de ejemplo».** Borraba todo sin confirmación y
  estaba pegada a «Acerca de». La app ya no la necesita.

## 1.7.3 — 2026-07-21 (Texto libre también sin scrollear)
- El botón **«➕ Usar «…» tal cual»** sale ahora **justo debajo del buscador**,
  donde acabas de escribir, en vez de al principio de la lista de platos (que
  queda más abajo). Visible sin scrollear.
- Si no hay coincidencias, la lista lo dice («Sin coincidencias en el
  recetario») en vez de quedarse vacía.

## 1.7.2 — 2026-07-21 (Guardar sin scrollear)
- En el selector de plato, **Guardar / Quitar / Fuera de casa** pasan a estar
  **encima de «Usar de tu despensa»**, justo debajo del buscador, en vez de al
  final de toda la lista de platos. Antes había que bajar ~3000 px para
  guardar; ahora el botón queda visible sin scrollear (y como el panel se
  redibuja arriba al elegir un plato, lo tienes delante al terminar).
- «Quitar» a la izquierda y «Fuera de casa» a la derecha, con separador bajo
  el bloque de acciones.

## 1.7.1 — 2026-07-21 (Fix crítico: platos que se guardaban en un miembro fantasma)
### Corregido
- **«No me deja meter comidas y cenas».** Si abrías el selector con
  **«para todos ›»** y después apagabas el interruptor *Aplicar a todos*,
  `picker.member` seguía siendo `null`: el plato se escribía en una celda
  fantasma con clave `"null"` en vez de en Nosotros/Noah/Iria. La app parecía
  ignorar lo que añadías y el plato «desaparecía» (afectaba también a
  *Quitar* y *Fuera de casa*).
  - `PickerTargets()` ya nunca devuelve un miembro inexistente.
  - Al apagar *Aplicar a todos* se selecciona automáticamente un miembro real.
- **Auto-reparación de datos ya corruptos**: `SanitizeSlots()` se ejecuta al
  cargar y al adoptar la copia de la nube. Elimina las celdas fantasma y, si
  el plato solo estaba ahí (los miembros reales vacíos), **lo recupera** para
  todos antes de borrar la celda. Nada se pierde.
- Tests: 186 asserts (13 nuevos que cubren el fallo y la reparación).

## 1.7.0 — 2026-07-20 (Desayuno y almuerzo opcionales en la semana)
- Nuevo interruptor junto a «Contraer todos»: **🍳 Desayuno y almuerzo /
  Solo comida y cena**. Permite ocultar/mostrar las filas de desayuno y
  almuerzo al planear la semana, para cuando solo quieres programar comida y
  cena. La preferencia se recuerda (por dispositivo) y no borra nada: al
  reactivarlo vuelven a aparecer. `VisibleSlots()` filtra los slots.
- Tests: 173 asserts.

## 1.6.1 — 2026-07-20 (Fix crítico: recetas ya no se pierden al sincronizar)
### Corregido
- **Pérdida de recetas entre dispositivos.** La sincronización era
  «último-que-guarda-gana» sobre todo el estado, así que una receta añadida
  en un dispositivo desaparecía si otro dispositivo (que nunca la tuvo)
  guardaba después. Ahora el «recetario» (`userDishes` + borrados `hidden`)
  se **fusiona por unión** en ambos sentidos:
  - Al subir: se une lo que hay en la nube antes de escribir (no se pisa una
    receta de otro dispositivo).
  - Al bajar: si lo local es más nuevo, igualmente se recuperan las recetas
    que solo están en la nube (antes se ignoraban); al adoptar la nube se
    conservan las recetas que solo estaban en local.
  - Los borrados siguen mandando (una receta borrada no «revive»).
  El plan semanal sigue siendo último-que-guarda-gana (correcto ahí).
- Recuperada la receta «Chicken Curry (Versión Thermomix)» desde el historial.
- Tests: 169 asserts.

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
