# Nutri APP — Handoff

## Estado actual (v1.13.0 — 2026-08-26)
- Repo: `github.com/alejandromartinherrer/nutri-app` (público, Pages activo).
- App: `https://alejandromartinherrer.github.io/nutri-app/` · HTML único `index.html`.
- Carpeta local: `C:\claude_projects\web-apps\nutri-app` · Node LTS v24 en el sistema.
- **310 asserts** en verde (UTC / Europe/Madrid / America/Los_Angeles). CI en cada push.
- Recetario: **200 platos** (166 SEED + 34 Realfooding) + los que añada el usuario.
- **Auditoría UX cerrada**: los 8 temas resueltos entre v1.8.0 y v1.12.0.

## Invariantes (NO romper — cada uno costó un incidente)
1. **`RefreshCatalog()` es el punto único de invalidación** del catálogo y de
   `_macroIndex`. `catalog = (SEED ∪ REALFOODING_DISHES ∪ userDishes por nombre) − hidden`.
   SEED nunca se muta.
2. **`PickerTargets()`** (v1.7.1) nunca debe devolver un miembro inexistente. Sin
   esto vuelve el "miembro fantasma" `"null"`: los platos se guardaban en una celda
   invisible y parecía que la app no dejaba meter comidas. `SanitizeSlots()` limpia
   los datos ya corruptos al cargar y tras adoptar la nube.
3. **`MergeRecipeBook()`** (v1.6.1): `userDishes` + `hidden` se **fusionan por unión**
   en subida y bajada. El plan semanal sí es last-write-wins; el recetario NO. Sin
   esto, un dispositivo pisa las recetas del otro (pasó: se perdió una receta real).
4. **`input,select{font-size:16px}`**: único freno al auto-zoom de iOS al enfocar.
5. **`html{touch-action:manipulation}`**: mata el doble toque. El pellizco SÍ debe
   funcionar (se quitó `user-scalable=no` en v1.12.0, a propósito).
6. **`Surprise()/fillSlot`** solo rellena huecos vacíos; nunca pisa lo puesto a mano.
7. El **token de GitHub** vive solo en `localStorage["nutri_gh_token"]`. Jamás en
   `state`, ni en exportaciones, ni en `sync.json`. Hay test que lo cubre.
8. **El pull automático (`CloudPull({quiet:true})`) es de SOLO LECTURA** (v1.13.0).
   Nunca llama a `CloudSave`, nunca usa `Save()` (solo `SaveQuiet`) y nunca
   re-sella `updatedAt`. Si `CloudDirty()`, NO adopta: deja la pantalla como está
   y que suba el autoguardado. Motivo: un móvil sucio pero **viejo** (token
   caducado, sin token, mucho tiempo sin red) que promocionara su reloj borraría
   la semana entera del otro móvil — es peor que no tener refresco. Hay tests que
   fijan las tres cosas (`el pull NUNCA sube`, `SaveQuiet`, `NO re-sella`).
9. **`PullDeferred()` decide cuándo NO redibujar**: hoja abierta, `picker`,
   elemento editable enfocado (el buscador de Ideas vive en `#view`, no en una
   hoja), gesto/scroll en curso o ventana de «Deshacer» viva. Se evalúa **antes y
   después** del `await` de red. `FlushPendingPull()` lo desatasca al cerrar la
   hoja, al salir del buscador y al parar el scroll.
10. Pull y push comparten el candado **`_cloudBusy`**, tomado *antes* del `await`.
   Sin esto, un GET del pull puede solaparse con el PUT del guardado y dejar
   nube y móvil divergentes (misma clase de fallo que perdió una receta).

## Mapa rápido del código
- Estado y temas: `SeedState` · `THEMES` (la bandera `dark` SÍ se consume desde v1.12.0)
  · `ApplyTheme` (tokens `--surface-nav`, `--field-focus`, `--track`, `--faint`,
  `--ghost-bg`, `--del-ink` viven en `:root` / `:root.dark`, no en THEMES).
- Semana: `GoToThisWeek` (abre en hoy, solo hoy desplegado) · `VisibleSlots`
  (`state.hideDesAlm`) · `CountPlanned`/`PlannedLabel` ("10 de 14") ·
  `OpenCopyDay`/`DoCopyDay` (⧉) · gesto touch en `#view`.
- Recetario: `DishRecipe` (usuario > `RECETAS`) · `RecipeParts`/`ScaleQty` ·
  `OpenDish` (ficha, escalado ×1–6) · `OpenPlanDish`/`AssignDishTo` (no toca el
  picker global) · `DishWhenHtml` · `TipoFamily` (6 familias, todas AA).
- Picker: render **por zonas** (`PaintPickerHead/Filters/List`) — al teclear solo se
  repinta la lista, `#pickSearch` nunca se destruye. Chips "¿Para quién?" (`pwho`).
- Compra: `PlannedCookDishes` · `IngredientesDe(n,factor)` · `DishScale`
  (`ServingsNeeded`/`RecipeServings`) · `PantryMatch` (sustantivo principal) ·
  `AISLES`/`AisleOf` · `BoughtForPantry`/`SaveBackHome` ("Ya está en casa") ·
  `ResetWeeklyTicks`.
- Seguridad de datos: `DeleteWithUndo` · `ConfirmSheet` · `ToastAction` (ventana
  protegida: un toast normal no pisa un "Deshacer").
- Nube: `CloudSave` · `CloudPull({boot|quiet})`/`AdoptRemote`/`SyncVerdict`/
  `PullDeferred`/`FlushPendingPull` · 4 estados del botón (`unset`/`dirty`/
  `failed`/al día) · reintento en `online` y al pasar a segundo plano ·
  freno progresivo del envío (`PushBackedOff`, hasta 5 min) · disparadores del
  refresco: `visibilitychange→visible`, `pageshow` (bfcache de iOS), `online` y
  `setInterval` de 60 s (5 min si no hay token: el límite anónimo de GitHub es
  por IP y los dos móviles comparten router).

## Trampas conocidas
- **NO reescribir `index.html` con `open(p,'w')` en Python**: truncó el fichero a
  0 bytes (2026-07-21). Usar la herramienta Edit, o fichero temporal + `os.replace`.
- Los **stubs de DOM de `test/test.js`** son mínimos: si añades una API del DOM
  (`classList.contains`, `addEventListener`, `dataset`…) hay que ampliarlos o la
  suite peta antes de ejecutar un solo assert.
- `git show | python` en Windows **corrompe UTF-8** (cp1252): volcar a fichero y
  leer con `encoding='utf-8'`.
- Los commits `app: sync` los hace la propia app en la rama **`data`**; si esa rama
  se borra hay que recrearla (`git push origin main:data`).
- El repo es **público**: descargar funciona SIN token, subir NO. Por eso un móvil
  sin token parece sincronizado (ve los cambios del otro) pero lo suyo no sale
  nunca. El punto hueco del botón ☁️ (`.unset`) es la señal.
- `test/test.js` **desactiva (`unref`) el `setInterval`** del refresco; sin eso la
  suite se queda colgada y el CI no termina.

## Pendiente / a vigilar
- [ ] **El token caduca el 6-oct-2026.** Al fallar, la app abre sola la pantalla de
      copia pidiendo uno nuevo — no hace falta recordar dónde estaba.
- [ ] **Fusión de «Otros» y «Fruta y verdura» (paso 2 del refresco automático).**
      Hoy esas dos listas son «gana el último»: si los dos editan a la vez, uno
      pisa al otro (el recetario sí se fusiona por unión). Diseñado y verificado
      pero NO implementado, porque la unión simple **rompe el borrado**: sin
      lápidas, el ítem borrado por uno reaparece en el pull *y* en el push del
      otro. Requiere borrado suave: `state.graveyard={id:borradoEnISO}` escrito en
      `DeleteWithUndo`, `updatedAt` por ítem (en alta y en cada toque), unión por
      `id` descartando los que tengan lápida, y **la lápida manda siempre** (si no,
      marcar «comprado» sobre una copia vieja resucita lo borrado); un alta nueva
      genera `Uid()` nuevo, así que no la afecta. Aplicar en los dos sentidos
      (`AdoptRemote` y antes del PUT de `CloudSave`) y podar a los 60 días.
- [ ] Ideas no auditadas, por si se retoma: lista de compra agrupada por producto
      (sumando cantidades reales, no por plato) y aviso de alimento a punto de
      caducar que no esté planificado.
