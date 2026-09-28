# Nutri APP — Handoff

## Estado actual (v1.18.0 — 2026-09-28)
- Repo: `github.com/alejandromartinherrer/nutri-app` (público, Pages activo).
- App: `https://alejandromartinherrer.github.io/nutri-app/` · HTML único `index.html`.
- Carpeta local: `C:\claude_projects\web-apps\nutri-app` · Node LTS v24 en el sistema.
- **635 asserts** en verde (UTC / Europe/Madrid / America/Los_Angeles). CI en cada push.
- Recetario: **236 platos** (166 SEED + 34 Realfooding + 36 del plan) + los que añada
  el usuario; 43 recetas nuevas en `RECETAS` (las 7 de desayunos y meriendas no son
  platos del catálogo: se abren desde el plan con `OpenRecetaSuelta`).
- **Plan del nutricionista** (v1.18.0): pestaña 📋 Plan, plan del día, raciones en la
  Semana, «Sorpréndeme» en modo plan e hidratos post-entreno en la compra. Fuente:
  PowerPoint de Escuela de Salud VIVE del 12-ago-2026 (carpeta de Drive «Alex y Jeza»).
- **Auditoría UX cerrada**: los 8 temas resueltos entre v1.8.0 y v1.12.0.

## Invariantes (NO romper — cada uno costó un incidente)
1. **`RefreshCatalog()` es el punto único de invalidación** del catálogo y de
   `_macroIndex`. `catalog = (SEED ∪ REALFOODING_DISHES ∪ PLAN_DISHES ∪ userDishes por
   nombre) − hidden`.
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
   Pone el **mismo menú a todos** (v1.15.0): se quitó el bloque que sobrescribía la
   comida de Noah con la categoría «Comidas Noah». Esa categoría sigue existiendo
   para asignarla a mano; no volver a automatizarla.
   **No repetir ingrediente (v1.15.1) es una REGLA, no un bonus**: el bonus de
   despensa vale +3/+5 y aplastaría cualquier puntuación. `Echoes()` descarta del
   pool; solo cede si el filtro deja el pool vacío (probado: 0 huecos sin llenar).
   El ingrediente sale de restar `COCINA` al nombre — **no** por frecuencia: medido,
   «pollo» está en el 17 % de los platos y colaba como genérico, y el `tipo` no lo
   tapa porque el pollo se reparte entre Ensaladas/Sopas/Pasta/Pollo.
   **El tope semanal (`CAP_TIPO`, v1.16.0) cuenta ingrediente Y grupo, nunca solo
   el grupo**: topar solo `tipo:"Pollo"` desviaba el bonus de despensa al pollo
   archivado como Pasta/Arroz — medido, 73 % de los 2º seguían llevando pollo con
   el contador marcando 29 %. Y solo el ingrediente se deja fuera las cenas de
   huevo («Tortilla de calabacín» no dice huevo). El `tipo` se normaliza
   (trim+minúsculas) y los contadores son `Map`: es texto libre y `__proto__` como
   clave rompía el conteo. `Echoes` compara **familias** (`TipoFamily`), no grupos.
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
11. **`MergeShopping` se aplica en LOS DOS sentidos** (v1.14.0): al adoptar
   (`AdoptRemote`, con el snapshot local tomado *antes* del `state=payload.state`)
   y **antes de cada PUT** en `CloudSave`. Si falta uno de los dos lados, ese lado
   vuelve a pisar la lista del otro móvil.
12. **En `MergeList` la lápida es TERMINAL**: si hay `graveyard[id]`, el ítem se
   descarta pase lo que pase con su `updatedAt`. No "revivir si la edición es más
   nueva": marcar como comprado una copia que aún no sabía del borrado resucitaría
   el ítem *y* borraría la lápida, con lo que el borrado ya no podría propagarse
   nunca. Un alta deliberada usa un `Uid()` nuevo, así que no le afecta.
   `DeleteWithUndo` entierra solo si el array es `state.extras`/`state.produce`;
   el "Deshacer" hace `Unbury` + `Stamp`.
13. **El plan es una REGLA, no una tabla** (v1.18.0). `PLAN_VIVE` es el documento del
   nutricionista (en código); en `state.plan` solo vive lo que decide la familia
   (`activo`, `entrenos`, `noches`, `ninosCole`). `PlanHidrato`: entreno de mañana →
   hidrato en la comida, de tarde → en la cena, descanso → sin hidrato denso; las
   excepciones las marca el hueco (`hid:"incluido"|"fijo"|"libre"`). Con los entrenos
   por defecto reproduce las tablas del plan celda a celda (hay test): si cambias
   `PLAN_VIVE.semana`, ese test te dice si te has desviado del documento.
   `EnsurePlanState` rellena lo que falta y **nunca** pisa una decisión ni sella.
14. **`state.plan` se fusiona POR CLAVE con sello, y la clave es el DÍA** (`plan.at`:
   `activo`, `ninosCole`, `e:<id>:<día>`, `n:<id>:<día>`), en los dos sentidos:
   `CloudSave` antes del PUT, `AdoptRemote` (snapshot local ANTES de
   `state=payload.state`) y las ramas recover/keep-local de `CloudPull` (con
   `SaveQuiet`). `ToggleEntreno`/`ToggleNoche` sellan solo el día tocado. Motivo: con
   «gana el último» del plan entero, cambiar los entrenos en un móvil borraba las
   noches que el otro acababa de marcar; y con la clave por persona, un móvil que aún
   no había recibido los cambios del otro (pasa en el despliegue, con un móvil en la
   v1.17) le pisaba la semana entera a esa persona al tocar un solo día. Una copia SIN
   `plan` (v1.17.1, o un archivo exportado antes) conserva el plan local
   (`AdoptRemote`, `ImportarCopia`). NO tratar una copia sin sellos como sellada en su
   `updatedAt` (haría ganar valores por defecto a ediciones reales), y NO dejar el
   móvil «pendiente» tras adoptar para forzar una subida del plan: rompe el pull de
   solo lectura (invariante 8) y puede subir semanas viejas encima de las del otro.
   Consecuencia aceptada: si un móvil en v1.17.1 sube una copia sin plan, el plan
   bueno no vuelve a la nube hasta el siguiente cambio en el móvil que lo tiene.
   `PlanKeys` usa SOLO las personas de `PLAN_VIVE.perfiles`: con los ids de la copia,
   una persona «__proto__» llegaba a `Object.prototype` por `PlanPut` y todo día de
   descanso se leía como «tarde». Un plan remoto que no es un objeto (`PlanValido`)
   cuenta como «sin plan».
15. **Las raciones siguen al plato REAL** (`PlanRacionInfo`, único lector de
   `sp.rac`/`sp.racPor`; una ración puede ser `{base,noche}`). Si el plato no es de
   las opciones del hueco, se calculan del plato, y el hidrato se lee de la RECETA
   (`DensoEnReceta`: ≥ 25 g o ≥ ½ pieza por ración, sin trazas ni opcionales; sin
   receta, el nombre y el grupo). Por el nombre fallaba en los dos sentidos: la pizza
   con base de coliflor era «hidrato» y el poke de salmón (150 g de arroz), «sin
   hidrato». «Sobre todo hidrato» solo si además el hidrato ES el plato
   (`DensoPrincipal`) y no hay proteína (`EsProteico`); si no, `AVISO_DESCANSO` con la
   ración de proteína. El pan del salmorejo no cuenta: el plan lo sirve en descanso.
16. **Compra**: `ServingsNeeded` cuenta PERSONAS (`MemberPersonas`: «nosotros» = 2); cada
   parte de un compuesto se escala con sus raciones (`IngredientesCompra`/`PartScale`,
   no `IngredientesDe`/`DishScale`); la clave de tachado es `ShopKey` (sin el « ×N» de
   «Todo junto»). «Libre» (`EsLibre`) no compra nada; `PlanHidratosCompra` añade el
   hidrato post-entreno (las recetas base del plan van sin hidrato). La línea «(el que
   sobró de la comida)» solo se omite para una CENA tras un pollo asado ese mismo día
   (`SobraSinCubrir`). `ScaleQty` lee cada cantidad entera («1 1/2», «1/2», «1½») y
   pone en plural lo que sigue a cada una; por eso la despensa («Ya está en casa»)
   recibe el nombre de la línea SIN escalar (`IngredientesCompraPares`): de «2
   limones» salía «Limones», otra fila junto a «Limón» que «Sorpréndeme» no
   reconocía. `ScaleQty` no escala tiempos ni temperaturas (tampoco el primer número
   de «10-12 min»), lee «1.000 g» como mil y «4/5 tomates» como rango. `SinRotulo`
   decide por lo que sigue a la etiqueta: fuera («Nota», «Horno»), «Opcional», solo
   una cantidad (la etiqueta ES el producto y se pliega: «2 cucharadas de salsa de
   soja»), un producto propio (la etiqueta se quita; `EsAlimento` reconoce «puré: 2
   patatas»), adjetivos o artículo (se deja como está). `ROTULO_GRUPO` compara la
   etiqueta ENTERA: «Salsa» es parte del plato, «Salsa de soja» es un producto.
   `RecipeParts` guarda `ver` (con etiquetas) para la ficha. Tras tocar cualquiera de
   estas funciones: `node test/recetas_diff.js [rev]` enseña, frente a un commit, cada
   línea de compra y de escalado que cambia en las 249 recetas; revísalas a ojo.
17. **«Sorpréndeme» en modo plan**: cada hueco sale SOLO de `pri`/`seg` de su
   `PlanSlot` y siguen valiendo la despensa, el no-repetir y el tope (con `reservas`
   para las claves que comparten TODAS las opciones de un hueco). El pescado azul es
   objetivo de los ADULTOS: solo cuentan los huecos donde «nosotros» come en casa
   (`adultosComen`), y `planBonus` decide en cada hueco con `huecosTop`/`huecosAny`;
   la previsión ignora los huecos que la despensa se va a quedar. Un +1 fijo al primer
   azul dejaba el lunes siempre azul y 3 por semana; contar los huecos de los niños
   dejaba a los adultos con 0–1 cuando comían fuera. `EsAzul` es el ÚNICO criterio
   (lo usan `Surprise` y `PlanCumplimiento`; `AZUL_SIN_NOMBRE` para platos cuyo
   nombre no lo dice). Una comida que no come nadie (adultos fuera, niños en el cole:
   `comen`) no se rellena ni se reserva en el tope. `invMatch` compara en singular y
   por el grupo solo enlaza productos genéricos («Pescado», no «Carne picada»).
18. **`AdoptRemote` conserva `state.current`**: la semana en pantalla es navegación de
   este móvil, no dato de la familia (adoptar llevaba a la semana que el otro tenía
   abierta).
19. **«Deshacer» y 🎲 de «Sorpréndeme» deshacen comida a comida** (`DeshacerTirada`):
   solo lo que la tirada puso y nadie ha tocado desde entonces. Volver a poner la
   semana guardada entera borraba lo puesto a mano después de tirar y lo tachado en
   la compra, sin forma de recuperarlo. «Deshacer» actúa sobre la semana tirada
   aunque se vea otra; 🎲 solo si la semana tirada es la que se ve.

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
  **Modo teclado** (`SyncPickerKb` → clase `.pk-kb` en `.sheet-body`): con el
  teclado subido se pliegan who/composer/acciones/despensa/filtros y queda
  `#pickSearchBar` fijo + `#pickList`. Se dispara con la **altura medida** del
  teclado (no con `focus`): así no compite con un toque en un resultado y se
  deshace solo. `PickerCtxHtml` (`#pickCtx`) muestra "Eligiendo 2º · 1º: …",
  lo único que se perdería al plegar el composer.
- Compra: `PlannedCookDishes` · `IngredientesCompra`/`IngredientesCompraPares` (`PartScale`,
  `SobraSinCubrir`) · `ScaleQty` (`CantidadValor`/`CantidadFmt`, `PluralFrase`) ·
  `EscalaTxt` (cabecera «para 4 · Salmorejo ×1 · Pavo ×2») · `MergedIngredients` (suma
  «×N», `ShopKey`) · `PlanHidratosCompra` · `ServingsNeeded`/`MemberPersonas`/
  `RecipeServings` · `PantryMatch` (sustantivo principal, `Singular`) · `AISLES`/
  `AisleOf` (conservas y aliños a Despensa, mirando fuera de paréntesis) ·
  `BoughtForPantry`/`SaveBackHome` ("Ya está en casa") · `ResetWeeklyTicks`.
- Recetas: `RecipeParts` → `{base, items, ver, steps}`: `ver` con etiquetas (la ficha),
  `items` = `SinRotulo` (la compra: quita «adobo:», pliega «Pollo: 500 g»). `ScaleQty`
  pone en plural lo que pasa de 1 a varios (`PluralFrase`/`PluralEs`).
- Plan: `PLAN_VIVE` (perfiles, `semana[dow][slot]` con `pri`/`seg`/`calor`/`frio`/
  `rac`/`racPor`/`hid`/`nota`/`notaSi`/`notaAsado`) · `PlanHidrato` · `PlanRacionInfo`/
  `PlanRacionHtml`/`PlanMealHtml` (Semana) · `PlanComidaTxt`/`PlanPersonaDiaHtml`/
  `OpenPlanDia` (plan del día) · `RenderPlan` (pestaña) · `PlanCumplimiento` ·
  `EnsurePlanState`/`StampPlan`/`MergePlan` (`PlanKeys`/`PlanGet`/`PlanPut`, por día) ·
  `ToggleEntreno`/`ToggleNoche` · en `Surprise`: `PlanPick`, `planBonus` (`orden`,
  `quedan`), `reservas`/`libera`, `invMatch` (nombre antes que grupo), `comen`;
  `DeshacerTirada` (lo usan `UndoSurprise` y `SurpriseAgain`).
- Descanso: `EsDenso` (`DensoEnReceta`) · `DensoPrincipal` · `EsProteico` ·
  `AVISO_DESCANSO`.
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
- **Nada de `git stash` en este repo**: con `core.autocrlf=true` reescribe
  `index.html` y `test.js` en CRLF (el blob es LF).
- Las estadísticas de «Sorpréndeme» en los tests van con **lunes fijo** y despensa
  vaciada: con la semana de hoy dependen del día en que corre el CI (temporada) y de la
  despensa semilla.
- Un assert de ausencia de texto necesita límite de palabra: `/ayuno/i` casa con
  «Desayuno».
- El `getElementById` de los stubs devuelve un elemento NUEVO en cada llamada: para
  leer lo que pinta una hoja, sustitúyelo en el test por uno que guarde los elementos
  (ver el test de la ficha de la quiche).

## Pendiente / a vigilar
- [ ] **El token caduca el 6-oct-2026.** Al fallar, la app abre sola la pantalla de
      copia pidiendo uno nuevo — no hace falta recordar dónde estaba.
- [x] ~~Fusión de «Otros» y «Fruta y verdura»~~ — hecho en v1.14.0 (invariantes 11 y 12).
- [ ] Lo único que sigue siendo «gana el último» es el **plan semanal** (y el
      inventario/tema). Es lo aceptado desde el principio para uso familiar: dos
      personas rara vez planifican la misma celda a la vez. Si algún día molesta,
      la vía es fusionar el plan **por celda**, no cambiar el criterio global.
- [ ] Ideas no auditadas, por si se retoma: lista de compra agrupada por producto
      (sumando cantidades reales, no por plato) y aviso de alimento a punto de
      caducar que no esté planificado.
- [ ] **Plan del nutricionista — pendiente de decidir o aplazado** (revisión de la
      v1.18.0):
      - La infografía pide legumbre 3–4 días por semana y la tabla semanal pone una
        (miércoles). No es un fallo: los dos documentos no coinciden; preguntar al
        nutricionista. Si cambia, es una línea en `PLAN_VIVE.reglas`/`semana`.
      - Si los adultos comen fuera el miércoles, la semana se queda sin legumbre (el
        chip «Legumbre 0» avisa). Recolocarla en otro hueco no es trivial.
      - El selector manual no destaca las opciones del plan para ese hueco.
      - «← Volver al plan del día» no conserva el scroll; el botón 📋 del día mide 35 px.
      - `EsAzul` mira el nombre (más `AZUL_SIN_NOMBRE`), no las cantidades de la
        receta: una lata de atún en la ensalada mixta no cuenta.
      - En modo plan, `tipo:pollo` llega a 3 cenas en ~28 % de las semanas: el plan
        pone pavo o pollo el martes, el viernes y el domingo, y el tope cede ante él.
      - «Nueces» en la despensa marca como «ya tienes» la nuez moscada (misma palabra
        principal; hoy ninguna receta la lleva).
      - Macros de las ensaladas de legumbre: estimación sin fuente fiable.
      - `IngShortName` deja nombres mejorables en «Ya está en casa».
- [x] **Privacidad** (decidido por el usuario, 2026-09-28): el repo es PÚBLICO. La
      suplementación y el objetivo corporal del plan NO están en el código (hay test);
      nombres, entrenos, noches de Jeza y raciones sí, como ya lo estaban las semanas y
      la compra en la rama `data`. Si algún día se quiere todo privado: sincronizar
      contra un repo privado (lecturas con token) y sacar el plan personal a datos.
