// ---- minimal DOM/localStorage stubs ----
const store={};
global.localStorage={getItem:k=>k in store?store[k]:null,setItem:(k,v)=>{store[k]=v},removeItem:k=>{delete store[k]}};
function fakeEl(){return {innerHTML:"",value:"",href:"",style:{},dataset:{},classList:{add(){},remove(){},contains(){return false},toggle(){}},focus(){},select(){},setSelectionRange(){},setAttribute(){},getAttribute(){return""},querySelector(){return null},querySelectorAll(){return[]},appendChild(){},addEventListener(){},removeEventListener(){},set oninput(f){},set onchange(f){},set onclick(f){},onload:null,files:[],click(){}}}
global.document={addEventListener(){},getElementById(){return fakeEl()},createElement(tag){return tag==="canvas"?fakeCanvas():fakeEl()},querySelector(){return fakeEl()},activeElement:null,head:{appendChild(){}},documentElement:{style:{setProperty(){},removeProperty(){}},classList:{add(){},remove(){},contains(){return false},toggle(){}},setAttribute(){},removeAttribute(){},dataset:{}},body:{appendChild(){},removeChild(){},dataset:{},classList:{add(){},remove(){},contains(){return false}}}};
global.navigator={};
global.URL={createObjectURL(){return"blob:"},revokeObjectURL(){}};
global.Blob=function(){};global.FileReader=function(){};
global.window={addEventListener(){},removeEventListener(){},innerHeight:812,scrollY:0,scrollTo(){}};
global.getComputedStyle=()=>({getPropertyValue:()=>""});
// The app arms a 60 s auto-pull timer at boot; unref it so the suite can exit.
const _setInterval=global.setInterval;
global.setInterval=(fn,ms)=>{const t=_setInterval(fn,ms); if(t&&t.unref)t.unref(); return t};
function fakeCtx(){return {set font(v){},set fillStyle(v){},set strokeStyle(v){},set lineWidth(v){},set textBaseline(v){},set textAlign(v){},measureText:t=>({width:String(t).length*16}),fillRect(){},strokeRect(){},beginPath(){},moveTo(){},lineTo(){},arcTo(){},arc(){},closePath(){},fill(){},stroke(){},fillText(){}}}
function fakeCanvas(){return {width:0,height:0,getContext(){return fakeCtx()},toDataURL(){return"data:image/png;base64,AAAA"}}}

// Load the app JS straight from the HTML (largest <script> block),
// so this test needs no build step and runs the shipped file as-is.
const fs=require('fs'),path=require('path');
const HTML=path.join(__dirname,'..','index.html');
const html=fs.readFileSync(HTML,'utf8');
let src=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)]
	.map(m=>m[1]).sort((a,b)=>b.length-a.length)[0];
if(!src){console.error('No <script> block found in '+HTML);process.exit(1);}

// expose new symbols for coverage of this round
src=src.replace("\"use strict\";","");
src+="\nglobal.__api={SeedState,Surprise,OpenPicker,ApplyDish,SetAway,ClearCell,DishesNeedingShopping,CountPlanned,MondayOf,AddDays,TodayISO,FmtLong,Ymd,escapeHtml,ValidState,BuildCatalog,RefreshCatalog,MacroIndex,SEP,APP_VERSION,SCHEMA_VERSION,STORE_KEY,LEGACY_STORE_KEY,ShowSheet,CloseSheet,Tokens,CurWeek,EnsureWeek,get state(){return state},set state(v){state=v},get picker(){return picker},CurThemeId,SetTheme,THEMES,SlotSummaryLines,RenderWeekCanvas,DishMacros,MealMacros,MemberWeekMacros,RenderMacros,RenderShoppingCanvas,OpenPicker,SaveComida,get picker(){return picker},set picker(v){picker=v},Load,Save,SaveQuiet,MigrateV1,ApplyTemplate,TemplateDish,DishRecipe,RECETAS,BuildSyncPayload,B64EncodeUtf8,B64DecodeUtf8,PickerCandidates,Norm,RenameDishInWeeks,RecipeParts,ScaleQty,IngredientesDe,Plantilla,DefaultPlantilla,CloudDirty,GH_BRANCH,GH_SYNC_PATH,DaysLeft,InvUrgent,PantryHas,PlannedCookDishes,IngSortKey,MergedIngredients,IsBought,ToggleBought,BoughtMap,REALFOODING_DISHES,DishTipo,MealTipos,DayTipos,TipoColor,MergeRecipeBook,RecipeBookSize,VisibleSlots,PickerTargets,SanitizeSlots,SLOTS,GoToThisWeek,DishNameHtml,get ui(){return ui},PickerWhoHtml,PickerLoadComposer,PickerFreeHtml,PickerListHtml,DeleteWithUndo,ToastAction,Toast,RecipeServings,ServingsNeeded,DishScale,PantryMatch,ResetWeeklyTicks,BoughtForPantry,SaveBackHome,IngShortName,AisleOf,AisleName,PlannedLabel,TipoFamily,Surprise,UndoSurprise,SurpriseAgain,AssignDishTo,DoCopyDay,DishWhenHtml,THEMES,SyncVerdict,AdoptRemote,PullDeferred,CloudPull,PushBackedOff,FlushPendingPull,SyncPickerKb,RenderPicker,PickerCtxHtml,COCINA,PLAN_DISHES,PLAN_VIVE,PLAN_LIBRE,PlanSlot,PlanPerfil,EnsurePlanState,PlanActivo,EntrenoDe,NocheDe,PostEntrenoSlot,PlanHidrato,PlanHidratoTexto,PlanHidratosCompra,PlanCumplimiento,PlanDishSet,EsLibre,EsAzul,PlanMealHtml,PlanDayBadges,PlanRacionInfo,RenderPlan,OpenPlanDia,OpenRecetaSuelta,TemporadaFria,NinosCole,PlanRacionHtml,ParseQty,ParseQtyUnit,NiceQty,PendingFirst,ClearListWithUndo,ConfirmSheet,CAP_TIPO,MainToks,TipoFamily,MergeList,MergeShopping,MergeGraves,PruneGraveyard,Stamp,Bury,Unbury,ShopSig,GRAVE_DAYS,IngredientesCompra,EscalaTxt,MergePlan,StampPlan,PlanComidaTxt,PlanPersonaDiaHtml,ImportarCopia,EsProteico,SinRotulo,SobraSinCubrir,PluralFrase,OpenDish,EsDenso,DensoEnReceta,DensoPrincipal,CantidadValor,IngredientesCompraPares,PlanKeys,ToggleEntreno,ToggleNoche};\n";
eval(src);
const A=global.__api;

// ---- tests ----
let pass=0,fail=0;
function ok(c,m){if(c){pass++}else{fail++;console.log("  ✗ FAIL:",m)}}

// ---- core: dates under different TZ ----
ok(A.AddDays("2026-06-22",1)==="2026-06-23","AddDays +1");
ok(A.AddDays("2026-06-22",-7)==="2026-06-15","AddDays -7 (prev week)");
ok(A.AddDays("2026-06-24",7)==="2026-07-01","AddDays +7 across month");
ok(A.MondayOf("2026-06-22")==="2026-06-22","MondayOf: Monday stays");
ok(A.MondayOf("2026-06-28")==="2026-06-22","MondayOf: Sunday -> week Monday");
ok(A.MondayOf("2026-01-01")==="2025-12-29","MondayOf across year boundary");
ok(A.FmtLong("2026-03-01")==="1 mar","FmtLong local");
ok(/^\d{4}-\d{2}-\d{2}$/.test(A.TodayISO()),"TodayISO format YYYY-MM-DD");
ok(A.Ymd(new Date(2026,0,5))==="2026-01-05","Ymd zero-pads");
// ---- escapeHtml ----
ok(A.escapeHtml('"&<>\'')==="&quot;&amp;&lt;&gt;&#39;","escapeHtml full");
// ---- Load validation ----
ok(A.ValidState(null)===false,"ValidState null");
ok(A.ValidState({members:[]})===false,"ValidState partial rejected");
ok(A.ValidState({weeks:{},members:[],inventory:{frigo:[],conge:[]},produce:[]})===true,"ValidState ok");
// ---- catalog ----
ok(A.BuildCatalog().length===166+A.REALFOODING_DISHES.length+A.PLAN_DISHES.length,"BuildCatalog returns SEED + Realfooding + plan");
// ---- version, SEP, macro index ----
ok(/^\d+\.\d+\.\d+$/.test(A.APP_VERSION),"APP_VERSION semver");
ok(Number.isInteger(A.SCHEMA_VERSION)&&A.SCHEMA_VERSION>=1,"SCHEMA_VERSION int");
ok(A.SEP===" · ","SEP constant");
A.state=A.SeedState(); A.RefreshCatalog();
const mi=A.MacroIndex();
ok(mi instanceof Map && mi.size>=166,"MacroIndex built with full catalog");
ok(A.DishMacros("LENTEJAS ESTOFADAS")===mi.get("lentejas estofadas"),"DishMacros served from index");
A.RefreshCatalog();
ok(A.MacroIndex()!==mi,"RefreshCatalog invalidates index");
// ---- composite meals ----
const ks=A.DishMacros("Lentejas estofadas").kcal, kp=A.DishMacros("Merluza al vapor con verduritas").kcal;
const comp=A.MealMacros("Lentejas estofadas · Merluza al vapor con verduritas");
ok(comp&&comp.kcal===ks+kp,"MealMacros sums 1º+2º");
ok(A.MealMacros("Lentejas estofadas").kcal===ks,"MealMacros single dish");
ok(A.MealMacros("Lentejas estofadas · Inventado XYZ").kcal===ks,"MealMacros partial match counts known part");
ok(A.MealMacros("Inventado A · Inventado B")===null,"MealMacros all-unknown -> null");
// ---- sample week ----
const adult=A.MemberWeekMacros(A.state.members.find(m=>m.id==="nosotros"));
ok(adult.counted===14&&adult.planned===14,"adult 14/14 (composite comidas count)");
ok(Math.round(adult.t.kcal/7)>1100,"adult daily kcal realistic with 1º+2º (>1100)");
// ---- composer: open comida picker parses existing into 1º/2º ----
A.OpenPicker(3,"Comida","nosotros",false);
ok(A.picker.sub==="pri","composer opens on slot 1");
ok(A.picker.pri==="Lentejas estofadas"&&A.picker.seg==="Merluza al vapor con verduritas","composer parsed existing 1º·2º");
// ---- build a new comida and save ----
A.OpenPicker(6,"Comida","nosotros",false);
A.picker.pri="Garbanzos con espinacas"; A.picker.seg="Atún a la plancha"; A.picker.applyAll=false; A.picker.member="nosotros";
A.SaveComida();
ok(A.CurWeek().days[6].slots.Comida.nosotros.dish==="Garbanzos con espinacas · Atún a la plancha","SaveComida composes 1º · 2º");
// ---- save with only 1º ----
A.OpenPicker(6,"Comida","nosotros",false); A.picker.pri="Lentejas estofadas"; A.picker.seg=null; A.picker.member="nosotros"; A.picker.applyAll=false;
A.SaveComida();
ok(A.CurWeek().days[6].slots.Comida.nosotros.dish==="Lentejas estofadas","SaveComida with only 1º");
// ---- cena composer (1 or 2 dishes) ----
ok(A.MealMacros(A.CurWeek().days[3].slots.Cena.nosotros.dish).kcal>0,"composite cena has macros");
A.OpenPicker(3,"Cena","nosotros",false);
ok(A.picker.sub==="pri","cena composer opens on slot 1");
ok(A.picker.pri==="Wok de verduras con pollo"&&A.picker.seg==="Tortilla francesa con jamón","cena composer parsed 2-dish");
// ---- build a 2-dish cena and save ----
A.OpenPicker(0,"Cena","nosotros",false);
A.picker.pri="Gambones al horno"; A.picker.seg="Revuelto de setas"; A.picker.member="nosotros"; A.picker.applyAll=false;
A.SaveComida();
ok(A.CurWeek().days[0].slots.Cena.nosotros.dish==="Gambones al horno · Revuelto de setas","cena saved as 2 dishes");
// ---- save single-dish cena ----
A.OpenPicker(0,"Cena","nosotros",false); A.picker.pri="Lubina al horno"; A.picker.seg=null; A.picker.member="nosotros"; A.picker.applyAll=false;
A.SaveComida();
ok(A.CurWeek().days[0].slots.Cena.nosotros.dish==="Lubina al horno","cena saved as 1 dish");
// ---- user deletions survive catalog re-seed; macro index invalidated ----
A.state=A.SeedState(); A.RefreshCatalog();
const catN=A.state.catalog.length;
ok(A.DishMacros("Gazpacho")!==null,"dish resolvable before delete");
(A.state.hidden=A.state.hidden||[]).push("gazpacho");
A.RefreshCatalog();
ok(A.state.catalog.length===catN-1,"hidden dish excluded on re-seed");
ok(A.DishMacros("Gazpacho")===null,"macro index dropped hidden dish");
A.state.hidden=[]; A.RefreshCatalog();
ok(A.state.catalog.length===catN,"clearing hidden restores full catalog");
// ---- sheet focus lifecycle ----
A.ShowSheet(); A.CloseSheet();
ok(true,"ShowSheet/CloseSheet focus mgmt safe");
// ---- slot summary ----
const mon=A.CurWeek().days[0];
ok(mon.slots.Comida.nosotros.dish==="Crema de calabaza · Pollo asado con hierbas","Mon comida nosotros = 1º·2º (sample)");
const comida=A.SlotSummaryLines(mon,"Comida");
ok(comida.length===2&&comida.some(l=>l.startsWith("Nosotros: Crema de calabaza · Pollo asado"))&&comida.some(l=>l==="Noah e Iria: Macarrones con tomate"),"slot summary: Mon comida grouped (1º·2º adults)");

// ==================== v2 (1.1.0) ====================
ok(A.SCHEMA_VERSION===2,"SCHEMA_VERSION is 2");
ok(A.STORE_KEY==="menu_semana_v2"&&A.LEGACY_STORE_KEY==="menu_semana_v1","store keys v2/v1");

// ---- userDishes upsert via RefreshCatalog (single invalidation point) ----
A.state=A.SeedState(); A.RefreshCatalog();
const base=A.state.catalog.length;
A.state.userDishes.push({name:"Plato De Prueba",course:"segundo",tipo:"Test",kcal:123,prot:10,carb:20,fat:5,receta:"Paso único."});
A.RefreshCatalog();
ok(A.state.catalog.length===base+1,"userDishes adds a new dish");
ok(A.DishMacros("Plato De Prueba")&&A.DishMacros("Plato De Prueba").kcal===123,"user dish macros indexed");
ok(A.DishRecipe("Plato De Prueba")==="Paso único.","user dish recipe served");
A.state.userDishes.push({name:"Lentejas estofadas",course:"primero",tipo:"Legumbres",kcal:999,prot:1,carb:1,fat:1});
A.RefreshCatalog();
ok(A.state.catalog.length===base+1,"editing a SEED dish upserts (no duplicate)");
ok(A.DishMacros("Lentejas estofadas").kcal===999,"user edit overrides SEED macros");
ok(A.state.catalog.find(c=>c.name==="Lentejas estofadas").user===true,"overridden dish flagged user");
A.state.hidden.push("plato de prueba"); A.RefreshCatalog();
ok(A.DishMacros("Plato De Prueba")===null,"hidden wins over userDishes");
A.state.userDishes=[]; A.state.hidden=[]; A.RefreshCatalog();
ok(A.state.catalog.length===base&&A.DishMacros("Lentejas estofadas").kcal!==999,"clearing userDishes restores SEED");

// ---- built-in recipe book ----
ok(Object.keys(A.RECETAS).length>=166,"RECETAS has >=166 entries");
ok(A.state.catalog.every(c=>!!A.RECETAS[c.name.trim().toLowerCase()]),"every catalog dish has a recipe");
ok(/tomate/i.test(A.DishRecipe("Gazpacho")),"recipe text plausible (Gazpacho)");
ok(!!A.DishRecipe("Avena con fruta"),"routine breakfast has recipe");
ok(A.DishRecipe("No Existe XYZ")===null,"unknown dish -> null recipe");

// ---- fixed desayuno/almuerzo routine ----
const wkNew=A.EnsureWeek("2026-08-03");
ok(wkNew.days[0].slots.Desayuno.nosotros.dish==="Avena con fruta","new week: Mon desayuno prefilled");
ok(wkNew.days[1].slots.Desayuno.iria.dish==="Tostada integral con aceite","new week: Tue desayuno kids prefilled");
ok(wkNew.days[0].slots.Almuerzo.noah.dish==="Fruta","new week: Mon almuerzo Noah = Fruta");
ok(wkNew.days[0].slots.Almuerzo.nosotros.dish==="","adults almuerzo stays empty (seed null)");
wkNew.days[0].slots.Desayuno.nosotros.dish="Café solo";
A.ApplyTemplate(wkNew);
ok(wkNew.days[0].slots.Desayuno.nosotros.dish==="Café solo","ApplyTemplate never overwrites manual edits");
wkNew.days[2].slots.Desayuno.nosotros={dish:"",invId:null,away:true};
A.ApplyTemplate(wkNew);
ok(wkNew.days[2].slots.Desayuno.nosotros.dish==="","ApplyTemplate skips away cells");
ok(A.TemplateDish(0,"Desayuno","noah")==="Avena con fruta","TemplateDish reads SEED routine");

// ---- migration v1 -> v2 ----
const v1={weeks:{},members:[],inventory:{frigo:[],conge:[]},produce:[]};
(function(){ const s=A.SeedState(); const w=s.weeks[Object.keys(s.weeks)[0]];
	w.days.forEach(d=>{ if(d.slots.Desayuno) Object.keys(d.slots.Desayuno).forEach(m=>d.slots.Desayuno[m]={dish:"",invId:null,away:false}); });
	v1.weeks[w.monday]=w; })();
A.MigrateV1(v1);
ok(Array.isArray(v1.userDishes)&&Array.isArray(v1.hidden),"migration adds userDishes[]/hidden[]");
ok(v1.weeks[Object.keys(v1.weeks)[0]].days[0].slots.Desayuno.nosotros.dish==="Avena con fruta","migration backfills empty desayunos");
// Load() picks up the legacy key when v2 is absent
localStorage.removeItem(A.STORE_KEY);
localStorage.setItem(A.LEGACY_STORE_KEY,JSON.stringify(v1));
ok(A.Load()===true,"Load migrates from legacy v1 key");
ok(Array.isArray(A.state.userDishes),"migrated state carries userDishes");
ok(localStorage.getItem(A.LEGACY_STORE_KEY)!==null,"v1 key kept as safety net");
localStorage.removeItem(A.LEGACY_STORE_KEY);
A.state=A.SeedState(); A.RefreshCatalog();

// ---- cloud sync payload (pure part; network is not under test) ----
A.state.updatedAt="2026-07-07T00:00:00.000Z";
const pay=A.BuildSyncPayload(A.state);
ok(pay.app==="nutri-app"&&pay.schema===2,"sync payload identity + schema");
ok(pay.state.catalog===undefined,"sync payload excludes catalog (reference data)");
ok(pay.state.weeks&&pay.state.members&&Array.isArray(pay.state.userDishes),"sync payload carries user data");
ok(pay.savedAt==="2026-07-07T00:00:00.000Z","sync savedAt mirrors updatedAt");
const s64="Ñoño 🍽 ½ albóndigas · AOVE";
ok(A.B64DecodeUtf8(A.B64EncodeUtf8(s64))===s64,"base64 utf-8 roundtrip");
ok(A.B64DecodeUtf8(A.B64EncodeUtf8(JSON.stringify(pay))).length===JSON.stringify(pay).length,"base64 roundtrip on full payload");

// ---- Save stamps updatedAt; SaveQuiet doesn't ----
A.state.updatedAt="2000-01-01T00:00:00.000Z";
A.SaveQuiet();
ok(A.state.updatedAt==="2000-01-01T00:00:00.000Z","SaveQuiet keeps updatedAt (boot/adopt writes)");
A.Save();
ok(A.state.updatedAt>"2000-01-01","Save stamps updatedAt (user edits)");

// ---- picker: search across all categories ----
A.picker={slot:"Comida",sub:"pri",tipo:null,search:"",all:false,dayIdx:0,member:"nosotros",applyAll:false};
const onlyPri=A.PickerCandidates();
ok(onlyPri.length>0&&onlyPri.every(c=>c.course==="primero"),"picker default scope = slot course");
A.picker.all=true;
const allC=A.PickerCandidates();
ok(new Set(allC.map(c=>c.course)).size>1,"picker.all spans every category");
ok(allC.length>onlyPri.length,"all-scope yields more candidates");
A.picker=null;

// ---- accent-insensitive search + rename propagation ----
ok(A.Norm("Atún África")==="atun africa","Norm strips accents + case");
A.state=A.SeedState(); A.RefreshCatalog();
A.picker={slot:"Cena",sub:"pri",tipo:null,search:"atun",all:true,dayIdx:0,member:"nosotros",applyAll:false};
ok(A.PickerCandidates().some(c=>/Atún/.test(c.name)),"search 'atun' finds 'Atún' dishes");
A.picker={slot:"Cena",sub:"pri",tipo:null,search:"ALBÓNDIGAS",all:true,dayIdx:0,member:"nosotros",applyAll:false};
ok(A.PickerCandidates().length>0,"uppercase accented query still matches");
A.picker=null;
const wkR=A.CurWeek();
wkR.days[0].slots.Comida.nosotros.dish="Lentejas estofadas · Atún a la plancha";
const nR=A.RenameDishInWeeks("Atún a la plancha","Atún plancha familiar");
ok(nR>=1,"rename touches planned cells");
ok(wkR.days[0].slots.Comida.nosotros.dish==="Lentejas estofadas · Atún plancha familiar","rename follows into composite cells");
ok(A.RenameDishInWeeks("No Existe Nada","X")===0,"rename with no matches is a no-op");

// ==================== 1.2.0 ====================
// ---- recipe parsing ----
const rpz=A.RecipeParts(A.DishRecipe("Gazpacho"));
ok(rpz && rpz.items.length>=5 && /raciones/.test(rpz.base),"RecipeParts: base + items from real recipe");
ok(rpz.steps.startsWith("1."),"RecipeParts: steps extracted");
ok(A.RecipeParts(A.DishRecipe("Fruta"))===null,"RecipeParts: 'Sugerencia' recipes are not structured");
ok(A.RecipeParts(null)===null,"RecipeParts(null) -> null");
// commas inside parentheses don't split items
const rpj=A.RecipeParts("Ingredientes (2 raciones): alcachofas, judías verdes, guisantes (frescos, o congelados), sal.\n\n1. Listo.");
ok(rpj.items.length===4 && rpj.items[2]==="guisantes (frescos, o congelados)","RecipeParts: parens keep their commas");

// ---- servings scaling ----
ok(A.ScaleQty("250 g de lentejas",2)==="500 g de lentejas","ScaleQty ×2 grams");
ok(A.ScaleQty("½ cebolla",6)==="3 cebollas","ScaleQty ×6 unicode fraction (y en plural: v1.18.0)");
ok(A.ScaleQty("1,5 kg de sal gruesa",2)==="3 kg de sal gruesa","ScaleQty decimal comma");
ok(A.ScaleQty("garbanzos remojados 12 h",2)==="garbanzos remojados 12 h","ScaleQty leaves durations (h)");
ok(A.ScaleQty("congelado previamente 5 días",4)==="congelado previamente 5 días","ScaleQty leaves days");
ok(A.ScaleQty("crema de cacahuete 100 %",2)==="crema de cacahuete 100 %","ScaleQty leaves percentages");
ok(A.ScaleQty("2 dientes de ajo",6)==="12 dientes de ajo","ScaleQty ×6 integer");
ok(A.ScaleQty("¼ de col",2)==="½ de col","ScaleQty keeps nice fractions");
ok(A.ScaleQty("250 g de arroz",1)==="250 g de arroz","ScaleQty ×1 is identity");

// ---- shopping ingredients (composites merge) ----
const ingC=A.IngredientesDe("Lentejas estofadas · Atún a la plancha");
ok(Array.isArray(ingC) && ingC.length>6,"IngredientesDe merges composite parts");
ok(A.IngredientesDe("Plato Inventado Sin Receta")===null,"IngredientesDe unknown -> null");

// ---- editable weekly routine ----
A.state=A.SeedState(); A.RefreshCatalog();
const defP=A.DefaultPlantilla();
ok(defP.desayuno[0]==="Avena con fruta" && defP.almKids[0]==="Fruta" && defP.almAdults[0]==="","DefaultPlantilla derived from SEED");
ok(A.Plantilla().desayuno[0]==="Avena con fruta","Plantilla falls back to default");
A.state.plantilla={desayuno:["Café y tostada","","","","","",""],almKids:["Plátano","","","","","",""],almAdults:["Nueces","","","","","",""]};
ok(A.TemplateDish(0,"Desayuno","nosotros")==="Café y tostada","custom plantilla: desayuno");
ok(A.TemplateDish(0,"Almuerzo","noah")==="Plátano","custom plantilla: almuerzo kids");
ok(A.TemplateDish(0,"Almuerzo","nosotros")==="Nueces","custom plantilla: almuerzo adults");
const wkP=A.EnsureWeek("2026-09-07");
ok(wkP.days[0].slots.Desayuno.iria.dish==="Café y tostada","EnsureWeek uses custom plantilla");
ok(wkP.days[1].slots.Desayuno.iria.dish==="","empty plantilla slot -> stays empty");
A.state.plantilla=null;
ok(A.TemplateDish(0,"Desayuno","noah")==="Avena con fruta","plantilla reset -> SEED default");

// ---- cloud: dirty flag + data branch ----
ok(A.GH_BRANCH==="data","sync writes to the data branch (not main)");
A.state.updatedAt="2026-07-08T10:00:00.000Z"; A.state.lastSync="2026-07-08T09:00:00.000Z";
ok(A.CloudDirty()===true,"CloudDirty: edits newer than last upload");
A.state.lastSync="2026-07-08T11:00:00.000Z";
ok(A.CloudDirty()===false,"CloudDirty: clean after upload");
ok(A.BuildSyncPayload(A.state).state.plantilla===null,"sync payload carries plantilla (null ok)");

// ==================== 1.3.0 ====================
// ---- inventory expiry ----
const hoy=A.TodayISO();
ok(A.DaysLeft(null)===null,"DaysLeft(null) -> null");
ok(A.DaysLeft(hoy)===0,"DaysLeft(today) = 0");
ok(A.DaysLeft(A.AddDays(hoy,2))===2 && A.DaysLeft(A.AddDays(hoy,-1))===-1,"DaysLeft counts forward/backward");
ok(A.InvUrgent({pri:true})===true,"InvUrgent: starred");
ok(A.InvUrgent({cad:A.AddDays(hoy,2)})===true,"InvUrgent: expires in 2 days");
ok(A.InvUrgent({cad:A.AddDays(hoy,3)})===false,"InvUrgent: 3 days away is not urgent");
ok(A.InvUrgent({cad:A.AddDays(hoy,-5)})===true,"InvUrgent: already expired");
ok(A.InvUrgent({})===false && A.InvUrgent(null)===false,"InvUrgent: plain item / null");

// ==================== 1.3.2: shopping = ingredients per dish ====================
A.state=A.SeedState(); A.RefreshCatalog();
// PlannedCookDishes: distinct comida/cena, excludes desayuno/almuerzo routine
const cook=A.PlannedCookDishes();
ok(Array.isArray(cook)&&cook.length>0,"PlannedCookDishes returns dishes");
ok(!cook.includes("Fruta")&&!cook.includes("Yogur"),"PlannedCookDishes excludes breakfast/snack routine");
ok(cook.every((n,i)=>i===0||cook[i-1].localeCompare(n,"es")<=0),"PlannedCookDishes sorted");
// dedupe: a dish planned on many days/members appears once
const wkc=A.CurWeek();
wkc.days[0].slots.Comida.nosotros.dish="Gazpacho";
wkc.days[1].slots.Comida.nosotros.dish="Gazpacho";
ok(A.PlannedCookDishes().filter(n=>n==="Gazpacho").length===1,"PlannedCookDishes dedupes by name");
// away cells don't count
A.state=A.SeedState(); A.RefreshCatalog();
const wkc2=A.CurWeek();
A.state.members.forEach(m=>wkc2.days.forEach(d=>{d.slots.Comida[m.id]={dish:"",invId:null,away:true};d.slots.Cena[m.id]={dish:"",invId:null,away:true};}));
ok(A.PlannedCookDishes().length===0,"PlannedCookDishes ignores away/empty");

// PantryHas: fuzzy, accent-insensitive, token-based, respects qty
A.state=A.SeedState(); A.RefreshCatalog();
A.state.inventory.frigo=[{id:"x1",name:"Pollo entero",qty:1},{id:"x2",name:"Atún",qty:2}];
A.state.inventory.conge=[{id:"x3",name:"Guisantes",qty:0}];
ok(A.PantryHas("250 g de pollo")===true,"PantryHas: 'pollo' matches 'Pollo entero'");
ok(A.PantryHas("2 lomos de atun")===true,"PantryHas: accent-insensitive (atun ~ Atún)");
ok(A.PantryHas("300 g de guisantes")===false,"PantryHas: qty 0 doesn't count");
ok(A.PantryHas("2 dientes de ajo")===false,"PantryHas: no match -> false (hint, not filter)");
ok(A.PantryHas("")===false,"PantryHas('') -> false");

// ==================== 1.4.0: merged shopping view ====================
// IngSortKey clusters by the ingredient noun, not the leading quantity
ok(A.IngSortKey("250 g de lentejas")==="lentejas","IngSortKey strips qty+unit+de");
ok(A.IngSortKey("½ cebolla")==="cebolla","IngSortKey strips unicode fraction");
ok(A.IngSortKey("2 dientes de ajo")==="ajo","IngSortKey strips 'dientes de'");
ok(A.IngSortKey("1 cebolla morada").startsWith("cebolla"),"IngSortKey keeps noun for sorting");
ok(A.IngSortKey("AOVE")==="aove","IngSortKey passthrough when no qty");
ok(A.IngSortKey("1–2 rebanadas de pan integral").startsWith("pan"),"IngSortKey strips en-dash ranges (1–2)");
// MergedIngredients: single deduped list from the whole week
A.state=A.SeedState(); A.RefreshCatalog();
const wkm=A.CurWeek();
A.state.members.forEach(m=>wkm.days.forEach(d=>{d.slots.Comida[m.id]={dish:"",invId:null,away:false};d.slots.Cena[m.id]={dish:"",invId:null,away:false};}));
wkm.days[0].slots.Comida.nosotros.dish="Gazpacho";
wkm.days[1].slots.Comida.nosotros.dish="Salmorejo";   // both share tomato -> dedupe
const merged=A.MergedIngredients();
ok(Array.isArray(merged)&&merged.length>0,"MergedIngredients returns a list");
const lc=merged.map(x=>x.toLowerCase());
ok(new Set(lc).size===lc.length,"MergedIngredients has no exact duplicates");
ok(merged.every((x,i)=>i===0||A.AisleOf(merged[i-1])<A.AisleOf(x)||A.IngSortKey(merged[i-1]).localeCompare(A.IngSortKey(x),"es")<=0),"MergedIngredients sorted by aisle, then noun");

// ==================== 1.5.0: bought checklist + Realfooding ====================
// bought checklist, per week, keyed by Norm(ingredient)
A.state=A.SeedState(); A.RefreshCatalog();
const wkb=A.CurWeek();
A.state.members.forEach(m=>wkb.days.forEach(d=>{d.slots.Comida[m.id]={dish:"",invId:null,away:false};d.slots.Cena[m.id]={dish:"",invId:null,away:false};}));
wkb.days[0].slots.Comida.nosotros.dish="Gazpacho";
const gk=A.Norm("1 kg de tomate maduro");
ok(A.IsBought("1 kg de tomate maduro")===false,"IsBought false by default");
A.ToggleBought(gk);
ok(A.IsBought("1 kg de tomate maduro")===true,"ToggleBought marks bought");
ok(A.CurWeek().bought[gk]===1,"bought stored on the week object");
A.ToggleBought(gk);
ok(A.IsBought("1 kg de tomate maduro")===false,"ToggleBought unmarks");
// per-week isolation: another week starts clean
A.ToggleBought(gk);
const other=A.EnsureWeek("2026-10-05");
A.state.current="2026-10-05";
ok(A.IsBought("1 kg de tomate maduro")===false,"bought is per-week (clean on another week)");
A.state.current=wkb.monday;
ok(A.IsBought("1 kg de tomate maduro")===true,"bought persists on its own week");

// Realfooding dishes present in catalog with recipes + macros
A.state=A.SeedState(); A.RefreshCatalog();
ok(Array.isArray(A.REALFOODING_DISHES)&&A.REALFOODING_DISHES.length>=15,"REALFOODING_DISHES present");
const rf=A.state.catalog.filter(c=>c.estilo==="Realfooding");
ok(rf.length===A.REALFOODING_DISHES.length,"all Realfooding dishes in catalog");
ok(rf.every(c=>!!A.DishRecipe(c.name)),"every Realfooding dish has a recipe");
ok(rf.every(c=>A.DishMacros(c.name)&&typeof A.DishMacros(c.name).kcal==="number"),"every Realfooding dish has macros");
ok(!!A.DishRecipe("Tortitas de avena y plátano"),"sample Realfooding recipe resolvable");
ok(A.state.catalog.every(c=>!!A.RECETAS[c.name.trim().toLowerCase()]),"still: every catalog dish has a recipe (incl. Realfooding)");

// ---- food-group tags in the week ----
A.state=A.SeedState(); A.RefreshCatalog();
ok(A.DishTipo("Lentejas estofadas")==="Legumbres","DishTipo from catalog");
ok(A.DishTipo("Salmón a la plancha")==="Pescado","DishTipo pescado");
ok(A.DishTipo("Plato Inventado XYZ")===null,"DishTipo unknown -> null");
const mt=A.MealTipos("Lentejas estofadas · Salmón a la plancha");
ok(mt.length===2&&mt.includes("Legumbres")&&mt.includes("Pescado"),"MealTipos splits composite");
ok(A.MealTipos("Gazpacho · Gazpacho").length===1,"MealTipos dedupes same tipo");
ok(A.MealTipos("").length===0,"MealTipos empty");
ok(/^#/.test(A.TipoColor("Legumbres"))&&/^#/.test(A.TipoColor("Cualquiera")),"TipoColor always a hex (known + fallback)");
const wkt=A.CurWeek();
A.state.members.forEach(m=>wkt.days.forEach(d=>{d.slots.Comida[m.id]={dish:"",invId:null,away:false};d.slots.Cena[m.id]={dish:"",invId:null,away:false};}));
wkt.days[0].slots.Comida.nosotros.dish="Lentejas estofadas";
wkt.days[0].slots.Cena.nosotros.dish="Salmón a la plancha";
const dt=A.DayTipos(wkt.days[0]);
ok(dt.includes("Legumbres")&&dt.includes("Pescado"),"DayTipos from comida+cena");
ok(A.DayTipos(wkt.days[1]).length===0,"DayTipos empty day -> []");

// ==================== 1.6.1: recipe book merge (no more lost recipes) ====================
// a recipe present only in the cloud survives a merge into local
let tgt={userDishes:[{name:"Local Only",kcal:100}],hidden:["a"]};
let cloudSrc={userDishes:[{name:"Cloud Only",kcal:200},{name:"Local Only",kcal:999}],hidden:["b"]};
A.MergeRecipeBook(tgt,cloudSrc);
const names=tgt.userDishes.map(d=>d.name).sort();
ok(names.length===2&&names[0]==="Cloud Only"&&names[1]==="Local Only","merge unions userDishes by name");
ok(tgt.userDishes.find(d=>d.name==="Local Only").kcal===100,"merge: target wins on same name");
ok(tgt.hidden.includes("a")&&tgt.hidden.includes("b"),"merge unions hidden (deletions survive)");
ok(A.MergeRecipeBook({userDishes:[],hidden:[]},null).userDishes.length===0,"merge with null source is a no-op");
ok(A.RecipeBookSize({userDishes:[1,2],hidden:[3]})===3,"RecipeBookSize counts dishes+hidden");
// deletion wins over a stale copy: dish in source.userDishes but hidden in target
A.state=A.SeedState(); A.RefreshCatalog();
A.state.userDishes=[]; A.state.hidden=["gazpacho"];
A.MergeRecipeBook(A.state,{userDishes:[{name:"Gazpacho",course:"primero",kcal:1}],hidden:[]});
A.RefreshCatalog();
ok(A.DishMacros("Gazpacho")===null,"merge: a hidden dish stays hidden even if the other copy still lists it");
// additive recovery: local lacks a user recipe the cloud has -> gained
A.state=A.SeedState(); A.RefreshCatalog();
A.state.userDishes=[]; A.state.hidden=[];
const b0=A.RecipeBookSize(A.state);
A.MergeRecipeBook(A.state,{userDishes:[{name:"Mi Receta Nube",course:"segundo",kcal:400}],hidden:[]});
ok(A.RecipeBookSize(A.state)===b0+1,"merge recovers a cloud-only recipe");

// ==================== 1.7.0: optional desayuno/almuerzo in the week ====================
A.state=A.SeedState(); A.RefreshCatalog();
ok(A.VisibleSlots().length===4,"VisibleSlots: all 4 meals by default");
ok(A.VisibleSlots().join()==="Desayuno,Almuerzo,Comida,Cena","VisibleSlots default order");
A.state.hideDesAlm=true;
ok(A.VisibleSlots().join()==="Comida,Cena","VisibleSlots hides desayuno/almuerzo when off");
A.state.hideDesAlm=false;
ok(A.VisibleSlots().length===4,"VisibleSlots restores all when on");

// ============ 1.7.1: phantom "null" member cells (dishes vanishing) ============
A.state=A.SeedState(); A.RefreshCatalog();
// repro of the reported bug: open via "para todos" then switch it OFF
A.OpenPicker(2,"Comida",null,true);
ok(A.picker.member===null&&A.picker.applyAll===true,"repro: 'para todos' opens with member=null");
A.picker.applyAll=false;                       // (what ptoggle-all used to do)
const tg=A.PickerTargets();
ok(tg.length===3&&tg.indexOf(null)<0&&tg.indexOf("null")<0,"PickerTargets never returns a phantom member");
ok(tg.every(id=>A.state.members.some(m=>m.id===id)),"PickerTargets only real member ids");
// a real single-member pick still targets exactly that member
A.picker.member="noah";
ok(A.PickerTargets().join()==="noah","PickerTargets honours a real single member");
A.picker.applyAll=true;
ok(A.PickerTargets().length===3,"PickerTargets applyAll -> everyone");
// end-to-end: saving after the toggle writes to real members, not a ghost
A.state=A.SeedState(); A.RefreshCatalog();
const wkg=A.CurWeek();
A.state.members.forEach(m=>{wkg.days[2].slots.Comida[m.id]={dish:"",invId:null,away:false};});
A.OpenPicker(2,"Comida",null,true);
A.picker.applyAll=false; A.picker.pri="Gazpacho"; A.picker.seg=null;
A.SaveComida();
const slotG=A.CurWeek().days[2].slots.Comida;
ok(!("null" in slotG),"no phantom 'null' key is created any more");
ok(A.state.members.every(m=>slotG[m.id].dish==="Gazpacho"),"the dish actually lands on real members");

// SanitizeSlots heals existing corruption
A.state=A.SeedState(); A.RefreshCatalog();
const wkS=A.CurWeek();
// case 1: ghost holds a dish and real members are empty -> recover for everyone
A.state.members.forEach(m=>{wkS.days[3].slots.Cena[m.id]={dish:"",invId:null,away:false};});
wkS.days[3].slots.Cena["null"]={dish:"Atún Wow",invId:null,away:false};
// case 2: ghost duplicates what everyone already has -> just drop it
A.state.members.forEach(m=>{wkS.days[4].slots.Comida[m.id]={dish:"Lentejas estofadas",invId:null,away:false};});
wkS.days[4].slots.Comida["null"]={dish:"Lentejas estofadas",invId:null,away:false};
const healed=A.SanitizeSlots(A.state);
ok(healed===2,"SanitizeSlots removes every phantom cell");
ok(!("null" in A.CurWeek().days[3].slots.Cena)&&!("null" in A.CurWeek().days[4].slots.Comida),"phantoms gone");
ok(A.state.members.every(m=>A.CurWeek().days[3].slots.Cena[m.id].dish==="Atún Wow"),"lost dish recovered for everyone");
ok(A.state.members.every(m=>A.CurWeek().days[4].slots.Comida[m.id].dish==="Lentejas estofadas"),"duplicate ghost dropped without side effects");
ok(A.SanitizeSlots(A.state)===0,"SanitizeSlots is idempotent");
ok(A.SanitizeSlots(null)===0&&A.SanitizeSlots({})===0,"SanitizeSlots tolerates junk input");

// ============ 1.8.0: arranque en la semana de hoy + receta desde la semana ============
A.state=A.SeedState(); A.RefreshCatalog();
// GoToThisWeek: semana actual, solo HOY desplegado
A.state.current="2026-01-05";                     // semana vieja, como la deja una sesión anterior
A.ui.collapsed={};
const wkT=A.GoToThisWeek();
const hoyISO=A.TodayISO(), lunHoy=A.MondayOf(hoyISO);
ok(A.state.current===lunHoy,"GoToThisWeek salta a la semana de hoy");
ok(wkT.monday===lunHoy,"GoToThisWeek devuelve la semana de hoy");
ok(A.ui.collapsed[hoyISO]===false,"hoy queda desplegado");
const otros=wkT.days.filter(d=>d.date!==hoyISO);
ok(otros.length===6&&otros.every(d=>A.ui.collapsed[d.date]===true),"los otros 6 días quedan contraídos");
// idempotente y sin perder datos
wkT.days[0].slots.Comida.nosotros.dish="Gazpacho";
A.GoToThisWeek();
ok(A.CurWeek().days[0].slots.Comida.nosotros.dish==="Gazpacho","GoToThisWeek no borra lo planificado");

// DishNameHtml: los platos con receta son pulsables; el texto libre no
const htmlCon=A.DishNameHtml("Gazpacho");
ok(/data-action="dish-open"/.test(htmlCon)&&/data-name="Gazpacho"/.test(htmlCon),"plato con receta -> pulsable");
ok(/📖/.test(htmlCon),"lleva el icono de receta como pista visual");
const htmlSin=A.DishNameHtml("Invento Mío Sin Receta");
ok(!/data-action/.test(htmlSin),"texto libre sin receta -> NO pulsable");
ok(htmlSin==="Invento Mío Sin Receta","texto libre se pinta tal cual");
// compuesto: cada parte por separado
const htmlComp=A.DishNameHtml("Gazpacho"+A.SEP+"Salmón a la plancha");
ok((htmlComp.match(/data-action="dish-open"/g)||[]).length===2,"plato compuesto -> una diana por parte");
ok(/dish-sep/.test(htmlComp),"el separador se mantiene visible");
// escapado: un nombre con comillas no rompe el atributo
A.state.userDishes=[{name:'Pollo "especial" <b>',course:"segundo",kcal:1,receta:"Paso."}];
A.RefreshCatalog();
const htmlEsc=A.DishNameHtml('Pollo "especial" <b>');
ok(!/<b>/.test(htmlEsc)&&/&quot;/.test(htmlEsc),"el nombre se escapa en texto y en atributo");
A.state.userDishes=[]; A.RefreshCatalog();

// ResetSeed eliminado del producto
ok(typeof A.SeedState==="function","SeedState sigue existiendo (uso interno)");
ok(html.indexOf('data-action="reset"')<0,"la opción de reinicio ya no existe en la UI");

// ============ 1.9.0: selector por zonas + chips de comensal ============
A.state=A.SeedState(); A.RefreshCatalog();
const wkPick=A.CurWeek();
wkPick.days[1].slots.Comida.nosotros={dish:"Lentejas estofadas",invId:null,away:false};
wkPick.days[1].slots.Comida.noah={dish:"Macarrones con tomate",invId:null,away:false};
wkPick.days[1].slots.Comida.iria={dish:"Macarrones con tomate",invId:null,away:false};
A.OpenPicker(1,"Comida",null,true);
// chips: uno por comensal + "Todos"
const whoHtml=A.PickerWhoHtml();
ok((whoHtml.match(/data-paction="pwho"/g)||[]).length===4,"hay un chip por comensal + Todos");
ok(/data-m=""/.test(whoHtml),"el chip Todos usa data-m vacio");
A.state.members.forEach(m=>ok(whoHtml.indexOf('data-m="'+m.id+'"')>=0,"chip para "+m.id));
ok(/class="who on"/.test(whoHtml),"Todos aparece marcado al abrir con applyAll");
// elegir un comensal concreto recarga SU plato en el composer
A.picker.applyAll=false; A.picker.member="noah";
A.PickerLoadComposer();
ok(A.picker.pri==="Macarrones con tomate","el composer carga el plato del comensal elegido");
ok(A.PickerTargets().join()==="noah","solo se apunta a ese comensal");
A.picker.applyAll=true; A.picker.member=null;
A.PickerLoadComposer();
ok(A.picker.pri==="Lentejas estofadas","con Todos, el composer usa el primer comensal");
ok(A.PickerTargets().length===3,"con Todos se apunta a los tres");
// el chip marcado sigue al estado
A.picker.applyAll=false; A.picker.member="iria";
ok(/data-m="iria"[^>]*>/.test(A.PickerWhoHtml().replace(/class="who on" /,'MARK ')) || /who on"[^>]*data-m="iria"/.test(A.PickerWhoHtml()),"el chip activo refleja al comensal");
// zona de texto libre: pista con buscador vacio, boton al escribir algo nuevo
A.picker.search="";
ok(/free-hint/.test(A.PickerFreeHtml()),"buscador vacio -> pista de texto libre");
A.picker.search="Invento Rarisimo";
ok(/data-paction="pfree"/.test(A.PickerFreeHtml()),"texto sin coincidencia -> boton de texto libre");
A.picker.search="Gazpacho"; A.picker.all=true;
ok(A.PickerFreeHtml()==="","coincidencia exacta -> sin boton de texto libre");
// la lista se genera sola (zona independiente)
A.picker.search=""; A.picker.tipo=null;
ok(/data-paction="pchoose"/.test(A.PickerListHtml()),"la lista se pinta por su cuenta");
A.picker=null;

// ============ 1.10.0: deshacer al borrar + circulo Compra/Despensa ============
A.state=A.SeedState(); A.RefreshCatalog();
// --- DeleteWithUndo: quita, y el callback lo devuelve a su sitio ---
const arrU=[{id:"a",name:"Uno"},{id:"b",name:"Dos"},{id:"c",name:"Tres"}];
const quitado=A.DeleteWithUndo(arrU,1);
ok(quitado&&quitado.name==="Dos","DeleteWithUndo devuelve el item quitado");
ok(arrU.length===2&&arrU.map(x=>x.name).join()==="Uno,Tres","el item desaparece de la lista");
ok(typeof A.ToastAction==="function","hay mecanismo de deshacer");
ok(A.DeleteWithUndo(arrU,-1)===null&&A.DeleteWithUndo(arrU,9)===null,"indices invalidos no rompen nada");

// --- escalado por comensales y repeticiones ---
const wkS2=A.CurWeek();
A.state.members.forEach(m=>wkS2.days.forEach(d=>{d.slots.Comida[m.id]={dish:"",invId:null,away:false};d.slots.Cena[m.id]={dish:"",invId:null,away:false};}));
A.state.members.forEach(m=>{wkS2.days[0].slots.Comida[m.id]={dish:"Gazpacho",invId:null,away:false};});
ok(A.RecipeServings("Gazpacho")===4,"RecipeServings lee las raciones de la receta");
// «Nosotros» son Alex y Jeza (2 personas) + Noah + Iria = 4 (v1.18.0: antes contaba casillas, 3)
ok(A.ServingsNeeded("Gazpacho")===4,"ServingsNeeded cuenta las PERSONAS planificadas (Nosotros = 2)");
ok(A.DishScale("Gazpacho")===1,"receta para 4 y comen 4 -> no se escala");
// el mismo plato dos dias: 8 raciones sobre una receta de 4 -> x2
A.state.members.forEach(m=>{wkS2.days[1].slots.Comida[m.id]={dish:"Gazpacho",invId:null,away:false};});
ok(A.ServingsNeeded("Gazpacho")===8,"cocinarlo dos dias duplica las raciones");
ok(A.DishScale("Gazpacho")===2,"8 raciones sobre receta de 4 -> x2");
const ingEsc=A.IngredientesDe("Gazpacho",A.DishScale("Gazpacho"));
ok(ingEsc.some(x=>/2 kg de tomate/.test(x)),"los ingredientes salen escalados (1 kg -> 2 kg)");
ok(A.IngredientesDe("Gazpacho").some(x=>/1 kg de tomate/.test(x)),"sin factor, cantidades originales");
// los 'fuera de casa' no cuentan
A.state.members.forEach(m=>{wkS2.days[1].slots.Comida[m.id]={dish:"",invId:null,away:true};});
ok(A.ServingsNeeded("Gazpacho")===4,"fuera de casa no suma raciones");

// --- PantryMatch: palabra completa, y dice QUE producto casa ---
A.state.inventory.frigo=[{id:"p1",name:"Caldo de pollo",qty:1}];
A.state.inventory.conge=[];
ok(A.PantryMatch("400 g de pechuga de pollo")===null,"'Caldo de pollo' ya no marca 'pechuga de pollo'");
const mm2=A.PantryMatch("200 ml de caldo de pollo");
ok(mm2&&mm2.name==="Caldo de pollo","casa cuando estan todas sus palabras");
A.state.inventory.frigo=[{id:"p2",name:"Tomate",qty:2}];
ok(A.PantryMatch("3 tomates maduros")!==null,"tolera el plural");
A.state.inventory.frigo=[{id:"p3",name:"Atun",qty:0}];
ok(A.PantryMatch("2 latas de atun")===null,"cantidad 0 no cuenta");

// --- reinicio semanal de tachados ---
A.state=A.SeedState(); A.RefreshCatalog();
A.state.produce.forEach(p=>p.done=true); A.state.extras=[{id:"e1",name:"Papel",done:true}];
A.state.shopWeek="2020-01-06";
const limpiados=A.ResetWeeklyTicks();
ok(limpiados>0,"al cambiar de semana se limpian los tachados");
ok(A.state.produce.every(p=>!p.done)&&A.state.extras.every(x=>!x.done),"todo queda sin tachar");
ok(A.state.shopWeek===A.state.current,"se recuerda la semana ya limpiada");
ok(A.ResetWeeklyTicks()===0,"no vuelve a limpiar en la misma semana");

// --- volver del super: lo comprado entra en la despensa ---
A.state=A.SeedState(); A.RefreshCatalog();
const wkH=A.CurWeek();
A.state.members.forEach(m=>wkH.days.forEach(d=>{d.slots.Comida[m.id]={dish:"",invId:null,away:false};d.slots.Cena[m.id]={dish:"",invId:null,away:false};}));
wkH.days[0].slots.Comida.nosotros={dish:"Gazpacho",invId:null,away:false};
const primero=A.MergedIngredients()[0];
A.ToggleBought(A.Norm(primero));
A.state.produce[0].done=true;
const cesta=A.BoughtForPantry();
ok(cesta.length>=2,"la cesta recoge ingredientes tachados y fruta tachada");
ok(cesta.every(i=>!/^\d/.test(i.name)),"los nombres van sin cantidad ('250 g de X' -> 'X')");
ok(A.IngShortName("250 g de lentejas")==="Lentejas","IngShortName limpia y capitaliza");
ok(A.IngShortName("1½ pepino pequeño")==="Pepino pequeño","IngShortName conserva acentos y ñ");
ok(A.IngShortName("¾ diente de ajo")==="Ajo","IngShortName quita 'diente de'");
ok(A.IngShortName("aceitunas (opcional)")==="Aceitunas","IngShortName quita el '(opcional)' final");
// guardar: entra en la despensa y se limpian los tachados
A.ui.homePick={}; cesta.forEach(i=>A.ui.homePick[i.name]="frigo");
const antesFrigo=A.state.inventory.frigo.length;
A.SaveBackHome();
ok(A.state.inventory.frigo.length===antesFrigo+cesta.length,"todo lo elegido entra en el frigo");
ok(Object.keys(A.CurWeek().bought||{}).length===0,"los tachados de la semana se limpian");
ok(A.state.produce.every(p=>!p.done),"la fruta tachada se limpia");
// repetir un producto suma cantidad en vez de duplicar la fila
const nomRep=A.state.inventory.frigo[A.state.inventory.frigo.length-1].name;
const qtyAntes=A.state.inventory.frigo.find(x=>x.name===nomRep).qty;
A.ui.homePick={}; A.ui.homePick[nomRep]="frigo";
A.state.produce.push({id:"px",name:nomRep,qty:1,unit:"ud",done:true});
A.SaveBackHome();
ok(A.state.inventory.frigo.find(x=>x.name===nomRep).qty===qtyAntes+1,"un producto repetido suma cantidad");

// --- pasillos del super ---
ok(A.AisleName(A.AisleOf("3 tomates maduros"))==="Fruta y verdura","tomate -> fruta y verdura");
ok(A.AisleName(A.AisleOf("2 lomos de salmón"))==="Carne y pescado","salmon -> carne y pescado");
ok(A.AisleName(A.AisleOf("4 huevos"))==="Frescos y lácteos","huevos -> frescos");
ok(A.AisleName(A.AisleOf("350 g de lentejas"))==="Despensa","lentejas -> despensa");
ok(A.AisleName(A.AisleOf("algo rarisimo"))==="Despensa","lo desconocido cae en despensa");
// la lista combinada sale agrupada por pasillo
A.state=A.SeedState(); A.RefreshCatalog();
const mrg=A.MergedIngredients();
const aisles=mrg.map(A.AisleOf);
ok(aisles.every((a,i)=>i===0||aisles[i-1]<=a),"la lista combinada va ordenada por pasillo");

// ============ 1.12.0: contador honesto, sorpresa reversible, copiar dia, temas ============
A.state=A.SeedState(); A.RefreshCatalog();
// --- contador: huecos, no comensales; respeta lo que se ve ---
const wkC=A.GoToThisWeek();
A.state.members.forEach(m=>wkC.days.forEach(d=>A.SLOTS.forEach(s=>{d.slots[s][m.id]={dish:"",invId:null,away:false}})));
A.state.hideDesAlm=true;
ok(A.CountPlanned().total===14,"solo comidas y cenas visibles -> 14 huecos");
ok(A.CountPlanned().done===0,"semana vacia -> 0 planificados");
ok(A.PlannedLabel()==="0 de 14 comidas y cenas","etiqueta con denominador");
A.state.members.forEach(m=>{wkC.days[0].slots.Comida[m.id]={dish:"Gazpacho",invId:null,away:false}});
ok(A.CountPlanned().done===1,"un hueco con 3 comensales cuenta UNA vez");
// 'fuera de casa' no cuenta como planificado
A.state.members.forEach(m=>{wkC.days[1].slots.Cena[m.id]={dish:"",invId:null,away:true}});
ok(A.CountPlanned().done===1,"'fuera de casa' no cuenta como planificado");
A.state.hideDesAlm=false;
ok(A.CountPlanned().total===28,"al mostrar desayunos/almuerzos el total sube a 28");
A.state.hideDesAlm=true;
// semana completa
A.state.members.forEach(m=>wkC.days.forEach(d=>{d.slots.Comida[m.id]={dish:"Gazpacho",invId:null,away:false};d.slots.Cena[m.id]={dish:"Gazpacho",invId:null,away:false}}));
ok(/completa/.test(A.PlannedLabel()),"semana llena -> 'semana completa'");

// --- Sorprendeme reversible ---
A.state=A.SeedState(); A.RefreshCatalog(); A.state.plan.activo=false; // modo libre
const wkSu=A.GoToThisWeek();
A.state.members.forEach(m=>wkSu.days.forEach(d=>{d.slots.Comida[m.id]={dish:"",invId:null,away:false};d.slots.Cena[m.id]={dish:"",invId:null,away:false}}));
A.state.members.forEach(m=>{wkSu.days[0].slots.Comida[m.id]={dish:"Mi plato a mano",invId:null,away:false}});
const antesSu=A.CountPlanned().done;
A.Surprise();
const trasSu=A.CountPlanned().done;
ok(trasSu>antesSu,"Sorprendeme rellena huecos");
ok(A.CurWeek().days[0].slots.Comida.nosotros.dish==="Mi plato a mano","no pisa lo puesto a mano");
A.UndoSurprise();
ok(A.CountPlanned().done===antesSu,"Deshacer devuelve la semana a como estaba");
ok(A.CurWeek().days[0].slots.Comida.nosotros.dish==="Mi plato a mano","y conserva lo manual");
A.Surprise(); const tras2=A.CountPlanned().done;
A.SurpriseAgain();
ok(A.CountPlanned().done===tras2,"'otra vez' deshace y vuelve a tirar (mismo numero de huecos)");
A.UndoSurprise();

// --- planificar desde la ficha / copiar dia ---
A.state=A.SeedState(); A.RefreshCatalog();
const wkA=A.GoToThisWeek();
A.state.members.forEach(m=>wkA.days.forEach(d=>{d.slots.Comida[m.id]={dish:"",invId:null,away:false};d.slots.Cena[m.id]={dish:"",invId:null,away:false}}));
ok(A.AssignDishTo(2,"Cena","Gazpacho")===true,"AssignDishTo coloca el plato");
ok(A.state.members.every(m=>A.CurWeek().days[2].slots.Cena[m.id].dish==="Gazpacho"),"lo pone para todos");
ok(!("null" in A.CurWeek().days[2].slots.Cena),"sin miembro fantasma");
ok(/Ya esta semana/.test(A.DishWhenHtml("Gazpacho")),"la ficha dice donde esta planificado");
ok(A.DishWhenHtml("Plato Que No Existe")==="","si no esta planificado, no muestra nada");
// copiar el dia 2 al 3 y al 4
A.state.members.forEach(m=>{wkA.days[2].slots.Comida[m.id]={dish:"Lentejas estofadas",invId:null,away:false}});
A.ui.copyPick={}; A.ui.copyPick[wkA.days[3].date]=true; A.ui.copyPick[wkA.days[4].date]=true;
A.DoCopyDay(2);
ok(A.CurWeek().days[3].slots.Comida.nosotros.dish==="Lentejas estofadas"&&A.CurWeek().days[3].slots.Cena.nosotros.dish==="Gazpacho","copia comida y cena al dia elegido");
ok(A.CurWeek().days[4].slots.Comida.nosotros.dish==="Lentejas estofadas","copia a varios dias a la vez");
ok(A.CurWeek().days[5].slots.Comida.nosotros.dish==="","no toca los dias no elegidos");

// --- temas: la bandera dark existe y los colores de grupo son 6 familias ---
ok(A.THEMES.noche.dark===true,"el tema Noche declara que es oscuro");
ok(Object.keys(A.THEMES).every(k=>k==="noche"||!A.THEMES[k].dark),"los demas temas son claros");
const fam=A.TipoFamily("Legumbres");
ok(fam&&fam.bg&&fam.ink,"cada grupo tiene fondo suave y tinta oscura");
ok(A.TipoFamily("Verduras").dot===A.TipoFamily("Ensaladas").dot,"verduras y ensaladas comparten familia");
ok(A.TipoFamily("Pescado").dot!==A.TipoFamily("Pollo").dot,"pescado y pollo se distinguen");
ok(A.TipoFamily("Legumbres").dot!==A.TipoFamily("Pasta").dot,"legumbres y pasta ya NO son el mismo marron");
const familias=new Set(["Legumbres","Verduras","Pasta","Pescado","Pollo","Huevos"].map(t=>A.TipoFamily(t).dot));
ok(familias.size===6,"seis familias realmente distintas");
ok(A.TipoFamily("Inventado").dot,"un tipo desconocido tiene color de reserva");

// ============ 1.13.0: pull automatico (sin cerrar y abrir la app) ============
// --- SyncVerdict: la decision, aislada de la red ---
const V=(l,ls,r)=>A.SyncVerdict({localUpdatedAt:l,localLastSync:ls,remoteUpdatedAt:r,valid:true});
ok(V("2026-08-02T10:00:00Z","2026-08-02T10:00:00Z","2026-08-02T09:00:00Z")==="recover","nube mas vieja -> solo recuperar recetas");
ok(V("2026-08-02T10:00:00Z","2026-08-02T10:00:00Z","2026-08-02T10:00:00Z")==="recover","misma hora -> nada que adoptar");
ok(V("2026-08-02T10:00:00Z","2026-08-02T10:00:00Z","2026-08-02T11:00:00Z")==="adopt","nube mas nueva y movil al dia -> adoptar");
ok(V("2026-08-02T10:00:00Z","2026-08-02T09:00:00Z","2026-08-02T11:00:00Z")==="keep-local","nube mas nueva PERO hay cambios sin subir -> no pisar lo local");
ok(V("2026-08-02T10:00:00Z","",  "2026-08-02T11:00:00Z")==="keep-local","nunca subido = sin subir -> no pisar");
ok(A.SyncVerdict({valid:false,remoteUpdatedAt:"2026-08-02T11:00:00Z"})==="skip","payload invalido -> no tocar nada");
ok(A.SyncVerdict({valid:true,remoteUpdatedAt:""})==="skip","sin fecha remota -> no tocar nada");
ok(A.SyncVerdict(null)==="skip","SyncVerdict(null) no rompe");

// --- adoptar la nube NO puede perder una receta local (el incidente historico) ---
A.state=A.SeedState(); A.RefreshCatalog();
A.state.userDishes=[{name:"Mi Receta Local",course:"segundo",kcal:400,receta:"Paso."}];
A.state.hidden=["gazpacho"];
A.state.updatedAt="2026-08-02T10:00:00.000Z"; A.state.lastSync="2026-08-02T10:00:00.000Z";
const libroAntes=A.RecipeBookSize(A.state);
const remoto=JSON.parse(JSON.stringify(A.SeedState()));
remoto.userDishes=[{name:"Receta De Ella",course:"primero",kcal:200,receta:"Paso."}];
remoto.hidden=[]; remoto.updatedAt="2026-08-02T11:00:00.000Z";
remoto.extras=[{id:"e9",name:"Papel de horno",done:false}];
A.AdoptRemote({state:remoto},{quiet:true});
ok(A.state.userDishes.some(d=>d.name==="Mi Receta Local"),"adoptar conserva la receta que solo estaba en este movil");
ok(A.state.userDishes.some(d=>d.name==="Receta De Ella"),"y trae la receta del otro movil");
ok(A.RecipeBookSize(A.state)>=libroAntes,"el recetario nunca encoge al adoptar");
ok(A.state.hidden.includes("gazpacho"),"los borrados locales del recetario sobreviven");
ok(A.state.extras.some(x=>x.name==="Papel de horno"),"llega lo que el otro movil anadio a Otros");
// --- y no deja el movil 'sucio': sin esto habria pull/push infinito ---
ok(A.CloudDirty()===false,"tras adoptar, el movil queda limpio (sin bucle subir/bajar)");
ok(A.state.lastSync===A.state.updatedAt,"lastSync apunta a la copia adoptada");
ok(A.state.updatedAt==="2026-08-02T11:00:00.000Z","adoptar NO re-sella el reloj (no puede pisar al otro movil)");

// --- adoptar cura celdas fantasma que lleguen de un movil viejo ---
A.state=A.SeedState(); A.RefreshCatalog();
A.state.updatedAt="2026-08-02T10:00:00.000Z"; A.state.lastSync="2026-08-02T10:00:00.000Z";
const remoto2=JSON.parse(JSON.stringify(A.SeedState()));
remoto2.updatedAt="2026-08-02T12:00:00.000Z";
const lunR=Object.keys(remoto2.weeks)[0];
remoto2.weeks[lunR].days[3].slots.Cena["null"]={dish:"Atun Fantasma",invId:null,away:false};
remoto2.members.forEach(m=>{remoto2.weeks[lunR].days[3].slots.Cena[m.id]={dish:"",invId:null,away:false};});
A.state.current=lunR;
A.AdoptRemote({state:remoto2},{quiet:true});
ok(!("null" in A.state.weeks[lunR].days[3].slots.Cena),"adoptar limpia el miembro fantasma");
ok(A.state.members.every(m=>A.state.weeks[lunR].days[3].slots.Cena[m.id].dish==="Atun Fantasma"),"y recupera el plato para todos");

// --- los guardias: nunca redibujar encima de lo que estas haciendo ---
A.state=A.SeedState(); A.RefreshCatalog();
A.picker=null; A.ToastAction._until=0; global.document.activeElement=null;   // (tests anteriores dejan un «Deshacer» vivo)
ok(A.PullDeferred()===false,"sin nada abierto, el pull puede aplicarse");
A.OpenPicker(1,"Comida","nosotros",false);
ok(A.PullDeferred()===true,"con el selector abierto se aplaza");
A.picker=null; A.ToastAction._until=0;
ok(A.PullDeferred()===false,"al cerrarlo vuelve a poder aplicarse");
global.document.activeElement={tagName:"INPUT"};
ok(A.PullDeferred()===true,"mientras escribes se aplaza (buscador de Ideas incluido)");
global.document.activeElement={tagName:"TEXTAREA"};
ok(A.PullDeferred()===true,"tambien en un area de texto");
global.document.activeElement=null;
A.ToastAction("Quitado «X»","Deshacer",()=>{});
ok(A.PullDeferred()===true,"con un «Deshacer» vivo se aplaza (no se lo comemos)");
A.ToastAction._until=0;
ok(A.PullDeferred()===false,"pasada la ventana de Deshacer, via libre");

// --- el push tiene freno: un token caducado no reintenta cada minuto ---
ok(A.PushBackedOff()===false,"sin fallos, no hay freno al subir");

// --- el pull no crea caminos de escritura nuevos ---
ok(html.indexOf("CloudPullOnBoot")<0,"CloudPullOnBoot ya no existe (un unico punto de entrada)");
const cuerpoPull=src.slice(src.indexOf("async function CloudPull("),src.indexOf("function FlushPendingPull"))
	.replace(/\/\*[\s\S]*?\*\//g,"").replace(/\/\/.*$/gm,"");        // sin comentarios
ok(!/\bCloudSave\s*\(/.test(cuerpoPull),"el pull NUNCA sube: no puede pisar la semana del otro movil");
ok(/if\(quiet\)\{\s*SaveQuiet\(\)/.test(cuerpoPull),"el pull silencioso escribe con SaveQuiet (nunca sella el reloj)");
ok(cuerpoPull.indexOf("_cloudBusy=true")>0,"el pull coge el mismo candado que el guardado");
ok(/finally\{\s*_cloudBusy=false/.test(cuerpoPull),"y lo suelta siempre");

// ============ 1.13.0: el teclado ya no tapa las sugerencias ============
// Medido en un iPhone simulado: con el teclado subido la hoja baja a 307 px y la
// lista empezaba 314 px POR DEBAJO de lo visible -> 0 resultados a la vista.
A.state=A.SeedState(); A.RefreshCatalog(); A.GoToThisWeek();
A.OpenPicker(1,"Comida","nosotros",false);
ok(A.SyncPickerKb(336)===true,"teclado subido + selector abierto -> modo busqueda");
ok(A.SyncPickerKb(0)===false,"teclado bajado -> vuelve el selector completo");
ok(A.SyncPickerKb(30)===false,"una barra pequena no cuenta como teclado");
A.picker=null;
ok(A.SyncPickerKb(336)===false,"sin selector abierto no se toca nada");
// el marcado tiene los ganchos que el CSS necesita
A.OpenPicker(1,"Comida","nosotros",false);
A.RenderPicker();
ok(html.indexOf('id="pickSearchBar"')>0,"el campo va en su propia barra (para poder fijarla)");
ok(html.indexOf('id="pickInv"')>0,"la despensa es plegable como bloque");
ok(html.indexOf('pk-who-lab')>0,"la etiqueta «¿Para quien?» se puede plegar");
// y el CSS pliega justo lo que sobra, dejando campo + resultados
const cssKb=html.slice(html.indexOf(".pk-kb .pk-who-lab"),html.indexOf(".pk-kb .pick-list")+60);
["#pickWho","#pickComposer",".pick-actions","#pickInv","#pickFilters"].forEach(sel=>
	ok(cssKb.indexOf(sel)>0,"con el teclado se pliega "+sel));
ok(/\.pk-kb #pickSearchBar\{position:sticky/.test(html),"el campo queda fijo arriba mientras buscas");
ok(cssKb.indexOf("#pickList")<0 && cssKb.indexOf("#pickFree")<0,"la lista y el texto libre NUNCA se ocultan");
// el modo no re-renderiza: el campo (y el cursor) tienen que sobrevivir
const cuerpoKb=src.slice(src.indexOf("function SyncPickerKb"),src.indexOf("/* zone painters"));
ok(cuerpoKb.indexOf("RenderPicker")<0 && cuerpoKb.indexOf("innerHTML")<0,"cambiar de modo no destruye el campo de busqueda");
// al plegar el composer no puedes perder de vista QUE plato estas eligiendo
A.OpenPicker(1,"Comida","nosotros",false);
A.picker.pri=null; A.picker.seg=null; A.picker.sub="pri";
ok(/Eligiendo <b>1º<\/b>/.test(A.PickerCtxHtml()),"dice que estas eligiendo el 1º");
A.picker.pri="Crema de lentejas rojas"; A.picker.sub="seg";
const ctx=A.PickerCtxHtml();
ok(/Eligiendo <b>2º<\/b>/.test(ctx)&&/1º: Crema de lentejas rojas/.test(ctx),"al pasar al 2º recuerda el 1º elegido");
A.picker.pri='Pollo "raro" <b>';
ok(A.PickerCtxHtml().indexOf("<b>P")<0,"el nombre se escapa en la linea de contexto");
A.OpenPicker(1,"Desayuno","nosotros",false);
ok(A.PickerCtxHtml()==="","en desayuno/almuerzo no hay 1º y 2º: sin linea");
A.picker=null;

// ============ 1.14.0: «Otros» y «Fruta y verdura» se fusionan (con lapidas) ============
const T1="2026-08-02T10:00:00.000Z", T2="2026-08-02T11:00:00.000Z", T3="2026-08-02T12:00:00.000Z";
// --- lo que motiva todo: dos altas a la vez ya no se pisan ---
let ml=A.MergeList([{id:"a",name:"Papel",updatedAt:T1}],[{id:"b",name:"Bolsas",updatedAt:T1}],{});
ok(ml.length===2&&ml.some(x=>x.id==="a")&&ml.some(x=>x.id==="b"),"dos altas simultaneas sobreviven las dos");
// --- gana la edicion mas reciente (y un des-marcado puede ganar a un marcado) ---
ml=A.MergeList([{id:"x",done:true,updatedAt:T1}],[{id:"x",done:false,updatedAt:T2}],{});
ok(ml.length===1&&ml[0].done===false,"en el mismo item gana el toque mas reciente");
ml=A.MergeList([{id:"x",done:false,updatedAt:T3}],[{id:"x",done:true,updatedAt:T2}],{});
ok(ml[0].done===false,"des-marcar tambien puede ganar (no siempre manda el 'comprado')");
// --- la lapida manda SIEMPRE: el fallo que encontro la verificacion adversaria ---
ok(A.MergeList([{id:"y",updatedAt:T1}],[],{y:T2}).length===0,"lo borrado no vuelve");
ok(A.MergeList([],[{id:"y",updatedAt:T1}],{y:T2}).length===0,"tampoco vuelve viniendo del otro movil");
ok(A.MergeList([{id:"y",done:true,updatedAt:T3}],[],{y:T2}).length===0,
	"marcar como comprado una copia vieja NO resucita lo que el otro borro");
// --- las lapidas se unen quedandose con la mas reciente, y se podan ---
const g=A.MergeGraves({a:T1,b:T2},{a:T3});
ok(g.a===T3&&g.b===T2,"al unir lapidas se queda la mas reciente");
const ahora=Date.parse("2026-08-02T00:00:00.000Z");
const podado=A.PruneGraveyard({vieja:"2026-01-01T00:00:00.000Z",nueva:"2026-08-01T00:00:00.000Z"},ahora,90);
ok(!("vieja" in podado)&&("nueva" in podado),"las lapidas viejas se podan; las recientes no");
ok(A.GRAVE_DAYS>=90,"el margen de poda deja de sobra para un movil apagado semanas");

// --- de punta a punta: adoptar la nube no pierde ni resucita nada ---
A.state=A.SeedState(); A.RefreshCatalog(); A.GoToThisWeek();
A.state.extras=[{id:"mio",name:"Papel de horno",done:false,updatedAt:T2}];
A.state.produce=[{id:"pf",name:"Peras",qty:6,unit:"ud",done:false,updatedAt:T2}];
A.state.graveyard={borrado:T2};                      // yo borre «borrado»
A.state.updatedAt=T1; A.state.lastSync=T1;
const nube=JSON.parse(JSON.stringify(A.SeedState()));
nube.extras=[{id:"suyo",name:"Bolsas",done:false,updatedAt:T2},
             {id:"borrado",name:"Leche",done:true,updatedAt:T3}];  // ella lo marco DESPUES de que yo lo borrara
nube.produce=[{id:"pn",name:"Manzanas",qty:4,unit:"ud",done:false,updatedAt:T2}];
nube.graveyard={}; nube.updatedAt=T3;
A.AdoptRemote({state:nube},{quiet:true});
const nom=A.state.extras.map(x=>x.name).sort();
ok(nom.includes("Papel de horno"),"al adoptar conservo lo MIO de Otros");
ok(nom.includes("Bolsas"),"y recibo lo SUYO");
ok(!nom.includes("Leche"),"lo que borre no reaparece aunque ella lo tocara despues");
ok(A.state.graveyard.borrado===T2,"la lapida viaja para que el otro movil tambien lo borre");
const prod=A.state.produce.map(p=>p.name).sort();
ok(prod.includes("Peras")&&prod.includes("Manzanas"),"la fruta tambien se fusiona en ambos sentidos");

// --- borrar deja lapida; deshacer la retira ---
A.state=A.SeedState(); A.RefreshCatalog();
A.state.graveyard={};
A.state.extras=[{id:"e1",name:"Uno",done:false,updatedAt:T1},{id:"e2",name:"Dos",done:false,updatedAt:T1}];
A.DeleteWithUndo(A.state.extras,1);
ok(A.state.extras.length===1&&!!A.state.graveyard.e2,"al borrar de Otros queda lapida");
ok(A.MergeList(A.state.extras,[{id:"e2",name:"Dos",updatedAt:T1}],A.state.graveyard).length===1,
	"y la copia del otro movil no lo devuelve");
// deshacer: reproducimos lo que hace el callback del boton (Unbury + Stamp + volver a meterlo)
A.state.extras=[{id:"e1",name:"Uno",done:false,updatedAt:T1},{id:"e2",name:"Dos",done:false,updatedAt:T1}];
A.state.graveyard={};
const borradoE=A.DeleteWithUndo(A.state.extras,1);
A.Unbury(borradoE.id); A.Stamp(borradoE); A.state.extras.push(borradoE);
ok(!A.state.graveyard.e2,"deshacer retira la lapida");
ok(A.MergeList(A.state.extras,[],A.state.graveyard).some(x=>x.id==="e2"),"y el item restaurado se queda");
// borrar en OTRAS listas (despensa, recetario) no ensucia el cementerio
A.state.graveyard={};
const inv=A.state.inventory.frigo;
A.DeleteWithUndo(inv,0);
ok(Object.keys(A.state.graveyard).length===0,"borrar en la despensa no crea lapidas (solo las listas compartidas)");

// --- la lapida se sincroniza y no rompe copias antiguas ---
A.state=A.SeedState(); A.RefreshCatalog(); A.state.updatedAt=T1;
ok(A.BuildSyncPayload(A.state).state.graveyard!==undefined,"el cementerio viaja en la copia de la nube");
ok(A.ValidState({weeks:{},members:[],inventory:{frigo:[],conge:[]},produce:[]})===true,
	"una copia antigua SIN cementerio sigue siendo valida");
ok(A.MergeShopping({extras:[],produce:[]},null).extras.length===0,"MergeShopping con origen nulo no rompe");
// altas y toques sellan la hora (si no, la fusion no sabria cual es mas nueva)
ok(/\bStamp\(/.test(html.slice(html.indexOf('case "ex-add"'),html.indexOf('case "ex-add"')+400)),"el alta en Otros sella la hora");
ok(/\bStamp\(x\)/.test(html.slice(html.indexOf('case "ex-done"'),html.indexOf('case "ex-done"')+300)),"marcar comprado sella la hora");

// ============ 1.15.0: Sorprendeme pone el MISMO menu a toda la familia ============
A.state=A.SeedState(); A.RefreshCatalog(); A.state.plan.activo=false; // modo libre
const wkMis=A.GoToThisWeek();
A.state.members.forEach(m=>wkMis.days.forEach(d=>{
	d.slots.Comida[m.id]={dish:"",invId:null,away:false};
	d.slots.Cena[m.id]={dish:"",invId:null,away:false};}));
A.Surprise();
let discrepan=0, huecos=0;
A.CurWeek().days.forEach(d=>["Comida","Cena"].forEach(s=>{
	const platos=A.state.members.map(m=>d.slots[s][m.id].dish);
	if(platos.some(Boolean)){ huecos++; if(new Set(platos).size>1) discrepan++; }
}));
ok(huecos>0,"Sorprendeme rellena la semana");
ok(discrepan===0,"todos los comensales reciben EXACTAMENTE el mismo plato");
// en concreto, Noah ya no recibe una comida aparte
ok(A.CurWeek().days.every(d=>d.slots.Comida.noah.dish===d.slots.Comida.nosotros.dish),
	"Noah come lo mismo que los adultos (ya no se le asigna «Comidas Noah» solo a el)");
// pero la categoria sigue existiendo para ponerla A MANO
ok(A.state.catalog.some(c=>c.course==="noah"),"la categoria «Comidas Noah» sigue en el recetario");
ok(html.indexOf('{value:"noah",label:"Comidas Noah"}')>0,"y se puede elegir al crear/editar un plato");
// y se mantiene lo de siempre: no pisa lo puesto a mano
A.state.members.forEach(m=>wkMis.days.forEach(d=>{
	d.slots.Comida[m.id]={dish:"",invId:null,away:false};
	d.slots.Cena[m.id]={dish:"",invId:null,away:false};}));
A.state.members.forEach(m=>{wkMis.days[2].slots.Comida[m.id]={dish:"A mano",invId:null,away:false};});
A.Surprise();
ok(A.state.members.every(m=>A.CurWeek().days[2].slots.Comida[m.id].dish==="A mano"),
	"Sorprendeme sigue sin pisar lo puesto a mano");

// ---- y el 1o y el 2o no repiten ingrediente (v1.15.0) ----
// COCINA separa "como se cocina" de "que se cocina"; lo que queda del nombre es
// el ingrediente. Medido antes: 14% de las comidas salian tipo "berenjena
// rellena de verduras . berenjena rellena de quinoa".
ok(A.COCINA.has("horno")&&A.COCINA.has("plancha")&&A.COCINA.has("ensalada")&&A.COCINA.has("verduras"),
	"COCINA recoge formas de cocinar y rellenos");
ok(!A.COCINA.has("pollo")&&!A.COCINA.has("berenjena")&&!A.COCINA.has("lentejas"),
	"pero NO los ingredientes (fallo real: por frecuencia, «pollo» colaba como generico)");
const ingr = n => A.Tokens(n).filter(t=>!A.COCINA.has(t));
let ecos=0, mismoGrupo=0, comidasVistas=0, sinRellenar=0, huecosVistos=0;
for(let it=0; it<8; it++){
	A.state=A.SeedState(); A.RefreshCatalog(); A.state.plan.activo=false; // modo libre
	const wkE=A.GoToThisWeek();
	A.state.members.forEach(m=>wkE.days.forEach(d=>{
		d.slots.Comida[m.id]={dish:"",invId:null,away:false};
		d.slots.Cena[m.id]={dish:"",invId:null,away:false};}));
	// despensa cargada y prioritaria: es lo que disparaba el fallo (+5 al plato que casa)
	A.state.inventory.frigo=[{id:"b1",name:"Berenjena",qty:3,pri:true},{id:"b2",name:"Pollo",qty:2,pri:true}];
	A.Surprise();
	A.CurWeek().days.forEach(d=>{
		const c=d.slots.Comida.nosotros.dish, ce=d.slots.Cena.nosotros.dish;
		huecosVistos+=2; if(!c) sinRellenar++; if(!ce) sinRellenar++;
		const partes=c.split(A.SEP).map(x=>x.trim()).filter(Boolean);
		if(partes.length!==2) return;
		comidasVistas++;
		const a=ingr(partes[0]), b=new Set(ingr(partes[1]));
		if(a.some(t=>b.has(t))) ecos++;
		const t1=A.DishTipo(partes[0]), t2=A.DishTipo(partes[1]);
		if(t1&&t2&&t1===t2) mismoGrupo++;
	});
}
ok(comidasVistas>30,"hay comidas de dos platos que revisar");
ok(ecos===0,"el 2o nunca repite el ingrediente principal del 1o, ni con la despensa empujando");
ok(mismoGrupo===0,"ni el mismo grupo de comida");
ok(sinRellenar===0,"la regla nunca deja un hueco sin rellenar (cede si no hay alternativa)");

// ---- tope semanal por grupo de comida (v1.16.0) ----
// Con pollo y huevos marcados como urgentes, el 2o salia Pollo el 89% de la
// semana y la cena Huevos el 81%: el bonus de despensa (+5) manda sobre todo.
ok(A.CAP_TIPO===2,"un grupo no se repite mas de 2 veces por turno y semana");
let excesos=0, huecosCap=0, semanasCap=0;
for(let it=0; it<8; it++){
	A.state=A.SeedState(); A.RefreshCatalog(); A.state.plan.activo=false; // modo libre
	const wkT=A.GoToThisWeek();
	A.state.members.forEach(m=>wkT.days.forEach(d=>{
		d.slots.Comida[m.id]={dish:"",invId:null,away:false};
		d.slots.Cena[m.id]={dish:"",invId:null,away:false};}));
	A.state.inventory.frigo=[{id:"p",name:"Pollo",qty:2,pri:true},{id:"h",name:"Huevos",qty:6,pri:true}];
	A.state.inventory.conge=[];
	A.Surprise();
	semanasCap++;
	const c1={},c2={},cc={};
	A.CurWeek().days.forEach(d=>{
		const partes=d.slots.Comida.nosotros.dish.split(A.SEP).map(x=>x.trim()).filter(Boolean);
		const cena=d.slots.Cena.nosotros.dish;
		if(!partes.length) huecosCap++;
		if(!cena) huecosCap++;
		if(partes[0]){const g=A.DishTipo(partes[0]); if(g) c1[g]=(c1[g]||0)+1;}
		if(partes[1]){const g=A.DishTipo(partes[1]); if(g) c2[g]=(c2[g]||0)+1;}
		if(cena){const g=A.DishTipo(cena); if(g) cc[g]=(cc[g]||0)+1;}
	});
	[c1,c2,cc].forEach(o=>Object.values(o).forEach(v=>{ if(v>A.CAP_TIPO) excesos++; }));
}
ok(semanasCap===8,"se generaron las semanas de prueba");
// el tope cuenta el INGREDIENTE, no la etiqueta: los platos de pollo estan
// repartidos entre Pollo, Pasta, Arroz y Ensaladas, asi que topar solo la
// etiqueta dejaba el pollo en el 73% de los 2os (medido) mientras el contador
// decia 29%. Se cuentan las dos cosas.
ok(A.MainToks("Pad thai de pollo ligero").has("pollo"),
	"un plato de pollo etiquetado como Pasta sigue contando como pollo");
ok(!A.MainToks("Pollo al horno con verduras").has("horno")&&!A.MainToks("Pollo al horno con verduras").has("verduras"),
	"pero las palabras de cocina no cuentan como ingrediente");
ok(A.TipoFamily("Pasta").dot===A.TipoFamily("Arroz y cereales").dot,
	"Pasta y Arroz son la misma familia (por eso no se sirven juntos)");
ok(excesos===0,"ningun grupo pasa del tope en 1o, 2o ni cenas (ni con la despensa empujando)");
ok(huecosCap===0,"el tope no deja huecos sin rellenar");
// y cede cuando de verdad no hay alternativa: recetario reducido a 3 cenas del mismo grupo
A.state=A.SeedState(); A.RefreshCatalog(); A.state.plan.activo=false; // modo libre
const cenasTodas=A.state.catalog.filter(c=>c.course==="cena");
const dejar=new Set(cenasTodas.filter(c=>c.tipo==="Huevos").slice(0,3).map(c=>c.name.toLowerCase()));
A.state.hidden=cenasTodas.filter(c=>!dejar.has(c.name.toLowerCase())).map(c=>c.name.trim().toLowerCase());
A.RefreshCatalog();
const wkP2=A.GoToThisWeek();
A.state.members.forEach(m=>wkP2.days.forEach(d=>{d.slots.Cena[m.id]={dish:"",invId:null,away:false};}));
A.Surprise();
ok(A.CurWeek().days.every(d=>!!d.slots.Cena.nosotros.dish),
	"con solo 3 cenas posibles del mismo grupo, el tope cede y rellena igual");
A.state.hidden=[]; A.RefreshCatalog();

// ============ 1.17.0: lo comprado baja al final + vaciar la lista ============
// --- al marcar algo, baja al final (solo al pintar: el array NO se toca) ---
const lst=[{id:"a",name:"Peras",done:false},{id:"b",name:"Tomates",done:true},
           {id:"c",name:"Lechuga",done:false},{id:"d",name:"Ajos",done:true}];
const vista=A.PendingFirst(lst);
ok(vista.map(x=>x.name).join()==="Peras,Lechuga,Tomates,Ajos","lo comprado baja al final");
ok(vista.slice(0,2).every(x=>!x.done)&&vista.slice(2).every(x=>x.done),"pendientes arriba, comprados abajo");
ok(lst.map(x=>x.name).join()==="Peras,Tomates,Lechuga,Ajos","el array original NO se reordena (la nube fusiona por id)");
ok(A.PendingFirst([]).length===0&&A.PendingFirst(null).length===0,"lista vacia o nula no rompe");
// el orden entre iguales se respeta (no baraja la lista a cada toque)
const est=[{id:"1",name:"A",done:false},{id:"2",name:"B",done:false},{id:"3",name:"C",done:false}];
ok(A.PendingFirst(est).map(x=>x.name).join()==="A,B,C","sin nada comprado, el orden no cambia");

// --- vaciar la lista entera, con Deshacer y lapidas ---
A.state=A.SeedState(); A.RefreshCatalog(); A.state.graveyard={};
A.state.extras=[{id:"x1",name:"Papel",done:true},{id:"x2",name:"Bolsas",done:false}];
const quitados=A.ClearListWithUndo(A.state.extras,"Otros");
ok(quitados===2&&A.state.extras.length===0,"vaciar quita todo de una vez");
ok(!!A.state.graveyard.x1&&!!A.state.graveyard.x2,"deja lapida de cada uno (el otro movil no los resucita)");
ok(A.ClearListWithUndo([],"vacia")===0,"vaciar una lista ya vacia no hace nada");
// borrar en bloque en otras listas no ensucia el cementerio
A.state.graveyard={};
A.ClearListWithUndo(A.state.inventory.frigo,"frigo");
ok(Object.keys(A.state.graveyard).length===0,"vaciar la despensa no crea lapidas (solo las listas compartidas)");

// ============ 1.17.1: medio kilo para el frutero ============
// El campo era type="number" y el navegador BORRABA lo que no entendia: "0,5"
// (como se escribe en espanol), "1/2" y "½" llegaban vacios y el producto se
// guardaba SIN cantidad, sin avisar.
ok(!/if\(f\.type==="number"\)inp\.type/.test(src),"el campo de cantidad ya no es type=number");
ok(/inp\.type="text"; inp\.inputMode="decimal"/.test(src),"es texto con teclado numerico: no se pierde nada");
// como lo escribe la gente
ok(A.ParseQty("0,5")===0.5,"coma decimal (espanol)");
ok(A.ParseQty("0.5")===0.5,"punto decimal");
ok(A.ParseQty("1/2")===0.5,"fraccion 1/2");
ok(A.ParseQty("3/4")===0.75,"fraccion 3/4");
ok(A.ParseQty("½")===0.5,"simbolo ½");
ok(A.ParseQty("1 1/2")===1.5,"mixto 1 1/2");
ok(A.ParseQty("1½")===1.5,"mixto 1½");
ok(A.ParseQty("2")===2&&A.ParseQty("12")===12,"enteros de siempre");
ok(A.ParseQty("")===null&&A.ParseQty(null)===null&&A.ParseQty("   ")===null,"vacio -> sin cantidad");
ok(A.ParseQty("hola")===null,"texto sin numero -> sin cantidad");
ok(A.ParseQty("1/0")===null||A.ParseQty("1/0")===1,"dividir entre cero no rompe");
// "0,5 kg" todo en la casilla de cantidad: se queda con las dos cosas
const qu=A.ParseQtyUnit("0,5 kg");
ok(qu.qty===0.5&&qu.unit==="kg","«0,5 kg» en una sola casilla conserva la unidad");
ok(A.ParseQtyUnit("1/2kg").unit==="kg","tambien pegado: «1/2kg»");
ok(A.ParseQtyUnit("3").unit==="","si solo hay numero, no inventa unidad");
// y se muestra como se lee en una lista de la compra
ok(A.NiceQty(0.5)==="½"&&A.NiceQty(1.5)==="1½"&&A.NiceQty(0.75)==="¾","medios y cuartos con simbolo");
ok(A.NiceQty(3)==="3","los enteros, enteros");
ok(A.NiceQty(0.3)==="0,3","lo demas, con coma");
ok(A.NiceQty(null)===""&&A.NiceQty(undefined)==="","sin cantidad no pinta nada");
// de punta a punta: lo que se manda al frutero
A.state=A.SeedState(); A.RefreshCatalog(); A.GoToThisWeek();
A.state.produce=[{id:"q1",name:"Tomates",qty:A.ParseQty("0,5"),unit:"kg",done:false}];
ok(A.NiceQty(A.state.produce[0].qty)+" kg"==="½ kg","el frutero recibe «½ kg», no «0.5 kg»");

// ============ 1.14.1: orden de la pestana Compra ============
// primero las dos listas que se escriben a mano, y al final la que calcula la app
const compraHtml=html.slice(html.indexOf("Lista de la compra"),html.indexOf("RENDER: MACROS"));
const iFruta=compraHtml.indexOf("🍎 Fruta y verdura");
const iOtros=compraHtml.indexOf("📝 Otros");
const iIngr =compraHtml.indexOf("🍳 Ingredientes");
ok(iFruta>=0&&iOtros>=0&&iIngr>=0,"las tres secciones de Compra siguen ahi");
ok(iFruta<iOtros&&iOtros<iIngr,"orden en pantalla: fruta y verdura -> otros -> ingredientes");
// el texto que se copia debe seguir el MISMO orden que la pantalla
const copiaSrc=src.slice(src.indexOf("function CopyShop"),src.indexOf("function CopyText"));
const cFruta=copiaSrc.indexOf("🍎 Fruta y verdura");
const cOtros=copiaSrc.indexOf("📝 Otros");
const cIngr =copiaSrc.indexOf("🍳 Para los platos");
ok(cFruta<cOtros&&cOtros<cIngr,"al copiar la lista, el mismo orden que en pantalla");
// «Enviar al frutero» tiene que seguir colgando de Fruta y verdura
ok(compraHtml.indexOf("share-shop")>iFruta&&compraHtml.indexOf("share-shop")<iOtros,
	"«Enviar al frutero» sigue dentro de Fruta y verdura");

// ============ 1.18.0: plan del nutricionista (Escuela de Salud VIVE) ============
// --- los datos del plan están completos y apuntan a recetas que existen ---
A.state=A.SeedState(); A.RefreshCatalog();
ok(A.PLAN_VIVE.semana.length===7,"el plan tiene los 7 días");
ok(A.PLAN_VIVE.semana.every(d=>d.Comida&&d.Cena),"cada día tiene comida y cena");
const enCatalogo=n=>A.state.catalog.some(c=>c.name.trim().toLowerCase()===n.trim().toLowerCase());
const rotos=[];
A.PLAN_VIVE.semana.forEach((d,i)=>["Comida","Cena"].forEach(s=>(d[s].pri||[]).concat(d[s].seg||[]).forEach(n=>{ if(!enCatalogo(n)) rotos.push(i+s+":"+n); })));
ok(rotos.length===0,"todos los platos que propone el plan existen en el recetario"+(rotos.length?" — faltan: "+rotos.join(", "):""));
const rutinaRota=[];
A.PLAN_VIVE.perfiles.forEach(pf=>pf.desayunos.concat(pf.meriendaEntreno,pf.meriendaDescanso).forEach(n=>{ if(!A.DishRecipe(n)) rutinaRota.push(n); }));
ok(rutinaRota.length===0,"desayunos y meriendas del plan tienen receta");
ok(A.PLAN_DISHES.length>=30&&A.PLAN_DISHES.every(d=>d.estilo==="Plan VIVE"),"los platos nuevos del plan van marcados «Plan VIVE»");
ok(A.PLAN_DISHES.every(d=>!!A.DishRecipe(d.name)),"cada plato nuevo del plan trae su receta");

// --- estado: valores por defecto sin pisar decisiones ---
ok(A.state.plan&&A.state.plan.activo===true,"el plan viene activado");
ok(A.EntrenoDe("alex",0)==="tarde"&&A.EntrenoDe("alex",2)==="tarde"&&A.EntrenoDe("alex",5)==="mañana","Alex: Crossfit lunes y miércoles por la tarde, sábado por la mañana");
ok(A.EntrenoDe("jeza",1)==="mañana"&&A.EntrenoDe("jeza",3)==="mañana","Jeza: martes y jueves por la mañana");
ok(A.EntrenoDe("alex",1)===null&&A.EntrenoDe("jeza",0)===null,"los demás días, descanso");
A.state.plan.entrenos.alex={}; A.EnsurePlanState(A.state);
ok(Object.keys(A.state.plan.entrenos.alex).length===0,"una semana de entrenos vaciada a propósito NO se rellena sola");
A.state.plan="basura"; A.EnsurePlanState(A.state);
ok(A.state.plan&&typeof A.state.plan==="object"&&A.state.plan.activo===true,"un plan corrupto se repara");
A.state=A.SeedState(); A.RefreshCatalog();

// --- LA REGLA reproduce las tablas del nutricionista celda a celda ---
const H=(p,d,s)=>A.PlanHidrato(p,d,s).tipo;
// Alex (entrena lun y mié tarde, sáb mañana)
ok(H("alex",0,"Comida")==="no"&&H("alex",0,"Cena")==="post","Alex lunes: comida sin hidrato, cena post-entreno con patata/boniato");
ok(H("alex",1,"Comida")==="no"&&H("alex",1,"Cena")==="no","Alex martes: tacos «sin arroz/patata»");
ok(H("alex",2,"Comida")==="incluido"&&H("alex",2,"Cena")==="post","Alex miércoles: legumbre + cena con arroz o patatas gajo");
ok(H("alex",3,"Comida")==="no","Alex jueves: salmón «sin boniato/arroz»");
ok(H("alex",4,"Comida")==="no"&&H("alex",4,"Cena")==="no","Alex viernes: descanso");
ok(H("alex",5,"Comida")==="incluido"&&H("alex",5,"Cena")==="libre","Alex sábado: paella y cena libre");
ok(H("alex",6,"Comida")==="fijo"&&H("alex",6,"Cena")==="no","Alex domingo: patata 150–180 g a mediodía, César sin hidrato");
// Jeza (entrena mar y jue mañana)
ok(H("jeza",0,"Cena")==="no","Jeza lunes: pescado SIN patata (es su descanso)");
ok(H("jeza",1,"Comida")==="post"&&H("jeza",1,"Cena")==="no","Jeza martes: comida con 40 g de arroz, cena sin");
ok(H("jeza",2,"Cena")==="no","Jeza miércoles: ternera o pollo SIN arroz");
ok(H("jeza",3,"Comida")==="post","Jeza jueves: 150 g de boniato o arroz con el salmón");
ok(H("jeza",6,"Comida")==="fijo","Jeza domingo: su patata pequeña (100 g)");
ok(/40 g de arroz/.test(A.PlanHidratoTexto(A.PlanPerfil("jeza"),A.PlanSlot(1,"Comida"))),"la ración de arroz de Jeza es 40 g en crudo");
ok(/50 g de arroz/.test(A.PlanHidratoTexto(A.PlanPerfil("alex"),A.PlanSlot(2,"Cena"))),"la de Alex, 50 g");
// y si cambian los entrenos, los hidratos se mueven con ellos
A.state.plan.entrenos.alex={"4":"mañana"};
ok(H("alex",4,"Comida")==="post"&&H("alex",0,"Cena")==="no","cambiar el día de entreno recoloca el hidrato (viernes mañana -> comida del viernes)");
A.state.plan.entrenos.alex={"4":"tarde"};
ok(H("alex",4,"Cena")==="post"&&H("alex",4,"Comida")==="no","entreno de tarde -> el hidrato va a la cena");
A.state=A.SeedState(); A.RefreshCatalog();

// --- «Sorpréndeme» en modo plan: cada hueco sale de las opciones de su día ---
const enHueco=(sp,dish)=>dish.split(A.SEP).map(x=>x.trim()).every(p=>(sp.pri||[]).concat(sp.seg||[]).some(n=>n.toLowerCase()===p.toLowerCase()));
let fuera=0, huecosVacios=0, sinAzul=0, azulTotal=0, semanasPlan=0, libreMal=0, legMal=0;
for(let it=0; it<12; it++){
	A.state=A.SeedState(); A.RefreshCatalog();
	const w=A.GoToThisWeek();
	A.state.members.forEach(m=>w.days.forEach(d=>{ d.slots.Comida[m.id]={dish:"",invId:null,away:false}; d.slots.Cena[m.id]={dish:"",invId:null,away:false}; }));
	A.Surprise(); semanasPlan++;
	let azul=0;
	A.CurWeek().days.forEach((d,i)=>["Comida","Cena"].forEach(s=>{
		const dish=d.slots[s].nosotros.dish, sp=A.PlanSlot(i,s);
		if(!dish){ huecosVacios++; return; }
		if(sp.hid==="libre"){ if(!A.EsLibre(dish)) libreMal++; return; }
		if(!enHueco(sp,dish)) fuera++;
		if(A.EsAzul(dish)) azul++;
	}));
	if(!A.CurWeek().days[2].slots.Comida.nosotros.dish.split(A.SEP).some(p=>A.DishTipo(p.trim())==="Legumbres")) legMal++;
	if(azul<1) sinAzul++; azulTotal+=azul;
}
ok(semanasPlan===12,"se generaron las semanas del plan");
ok(fuera===0,"TODOS los platos salen de las opciones del plan para ese día y comida");
ok(huecosVacios===0,"no queda ningún hueco sin rellenar");
ok(libreMal===0,"la cena del sábado es siempre «Libre»");
ok(legMal===0,"el miércoles a mediodía siempre hay legumbre");
ok(sinAzul===0,"siempre hay al menos un pescado azul en la semana");
ok(azulTotal/semanasPlan>=1.4,"y la media se acerca a los 2 de la infografía ("+(azulTotal/semanasPlan).toFixed(2)+")");
// respeta lo puesto a mano y no toca lo que ya hay
A.state=A.SeedState(); A.RefreshCatalog();
const wm=A.GoToThisWeek();
A.state.members.forEach(m=>wm.days.forEach(d=>{ d.slots.Comida[m.id]={dish:"",invId:null,away:false}; d.slots.Cena[m.id]={dish:"",invId:null,away:false}; }));
A.state.members.forEach(m=>{ wm.days[0].slots.Comida[m.id]={dish:"Alubias con verduras",invId:null,away:false}; });
A.Surprise();
ok(A.CurWeek().days[0].slots.Comida.nosotros.dish==="Alubias con verduras","en modo plan tampoco pisa lo puesto a mano");
// la cena libre no genera compra ni cuenta como plato sin receta
ok(A.PlannedCookDishes().indexOf(A.PLAN_LIBRE)<0&&A.PlannedCookDishes().every(n=>!A.EsLibre(n)),"«Libre» no entra en la lista de la compra");
// con el plan apagado vuelve a elegir de todo el recetario
A.state=A.SeedState(); A.RefreshCatalog(); A.state.plan.activo=false;
const wf=A.GoToThisWeek();
A.state.members.forEach(m=>wf.days.forEach(d=>{ d.slots.Comida[m.id]={dish:"",invId:null,away:false}; d.slots.Cena[m.id]={dish:"",invId:null,away:false}; }));
A.Surprise();
ok(A.CurWeek().days.every(d=>!A.EsLibre(d.slots.Cena.nosotros.dish)),"plan apagado: no hay cena libre, es el Sorpréndeme de siempre");

// --- hidratos post-entreno en la compra (la base del plan va sin hidrato) ---
A.state=A.SeedState(); A.RefreshCatalog();
const wc=A.GoToThisWeek();
A.state.members.forEach(m=>wc.days.forEach(d=>{ d.slots.Comida[m.id]={dish:"",invId:null,away:false}; d.slots.Cena[m.id]={dish:"",invId:null,away:false}; }));
A.Surprise();
const pc=A.PlanHidratosCompra();
ok(pc.length===4,"4 raciones de hidrato post-entreno en una semana tipo ("+pc.length+")");
ok(pc.some(x=>/180 g de patata \(Alex · lun\)/.test(x))&&pc.some(x=>/50 g de arroz \(Alex · mié\)/.test(x)),"Alex: patata el lunes y arroz el miércoles, en cena");
ok(pc.some(x=>/40 g de arroz \(Jeza · mar\)/.test(x))&&pc.some(x=>/150 g de boniato \(Jeza · jue\)/.test(x)),"Jeza: arroz el martes y boniato el jueves, en comida");
ok(pc.every(x=>A.MergedIngredients().indexOf(x)>=0),"van dentro de la lista de la compra");
A.state.members.forEach(m=>{ wc.days[0].slots.Cena[m.id]={dish:"",invId:null,away:true}; });
ok(!A.PlanHidratosCompra().some(x=>/Alex · lun/.test(x)),"si esa cena se come fuera, no se compra su patata");
A.state.plan.activo=false;
ok(A.PlanHidratosCompra().length===0,"plan apagado: sin hidratos extra");
A.state.plan.activo=true;

// --- raciones según el plato REAL, no según el del plan ---
const info=(p,d,s,dish)=>A.PlanRacionInfo(A.PlanPerfil(p),d,s,dish);
ok(info("alex",0,"Comida","Pechuga de pollo a la plancha").rac==="200 g","plato del plan -> la ración del plan");
ok(info("jeza",0,"Comida","Alubias con verduras").hid==="incluido","legumbre puesta a mano -> «la legumbre es su hidrato»");
ok(info("alex",4,"Comida","Macarrones con pesto y calabacín").hid==="aviso","pasta en día de descanso -> aviso de quitar el hidrato");
ok(info("alex",0,"Cena","Macarrones con pesto y calabacín").hid==="incluido","pasta tras entrenar -> el plato ya trae su hidrato");
ok(info("jeza",1,"Cena","Pollo al ajillo").rac==="150 g","proteína fuera del plan -> los gramos de cada uno");

// --- cumplimiento semanal ---
const cum=A.PlanCumplimiento();
ok(cum.libre===1&&cum.legumbre>=1&&cum.pescado>=2&&cum.roja<=2,"una semana del plan cumple: libre 1, legumbre, 2 pescados, carne roja ≤2");

// --- los niños en el cole (lunes a viernes) ---
A.state=A.SeedState(); A.RefreshCatalog(); A.state.plan.ninosCole=true;
const wn=A.GoToThisWeek();
A.state.members.forEach(m=>wn.days.forEach(d=>{ d.slots.Comida[m.id]={dish:"",invId:null,away:false}; d.slots.Cena[m.id]={dish:"",invId:null,away:false}; }));
A.Surprise();
const wn2=A.CurWeek();
ok([0,1,2,3,4].every(i=>wn2.days[i].slots.Comida.noah.away&&wn2.days[i].slots.Comida.iria.away&&!!wn2.days[i].slots.Comida.nosotros.dish),"cole: de lunes a viernes los niños comen fuera y los adultos tienen comida");
ok([5,6].every(i=>!!wn2.days[i].slots.Comida.noah.dish),"el fin de semana comen en casa");
ok(wn2.days.every(d=>!!d.slots.Cena.noah.dish),"y cenan siempre en casa");
// fillSlot: uno fuera no deja a los demás sin comida; todos fuera, sí se respeta
A.state=A.SeedState(); A.RefreshCatalog();
const wa=A.GoToThisWeek();
A.state.members.forEach(m=>wa.days.forEach(d=>{ d.slots.Comida[m.id]={dish:"",invId:null,away:false}; d.slots.Cena[m.id]={dish:"",invId:null,away:false}; }));
wa.days[2].slots.Cena.iria={dish:"",invId:null,away:true};
A.state.members.forEach(m=>{ wa.days[3].slots.Cena[m.id]={dish:"",invId:null,away:true}; });
A.Surprise();
const wa2=A.CurWeek();
ok(!!wa2.days[2].slots.Cena.nosotros.dish&&wa2.days[2].slots.Cena.iria.away,"Iria cena fuera: el resto sí tiene cena, e Iria sigue fuera");
ok(A.state.members.every(m=>wa2.days[3].slots.Cena[m.id].away&&!wa2.days[3].slots.Cena[m.id].dish),"si cena fuera TODO el mundo, no se rellena");

// --- sincronización: una copia sin plan (móvil con versión vieja) no borra el plan ---
A.state=A.SeedState(); A.RefreshCatalog();
A.state.plan.entrenos.alex={"1":"mañana"};
A.state.current="2026-09-28";
const vieja=JSON.parse(JSON.stringify(A.state)); delete vieja.plan; delete vieja.catalog;
vieja.updatedAt="2099-01-01T00:00:00.000Z"; vieja.current="2026-09-21";
A.AdoptRemote({state:vieja},{quiet:true});
ok(A.EntrenoDe("alex",1)==="mañana","adoptar una copia SIN plan conserva los entrenos de este móvil");
ok(A.state.current==="2026-09-28","y conserva la semana que este móvil tiene abierta (no salta a la del otro)");

// --- temporada y pescado azul ---
ok(A.TemporadaFria("2026-01-12")===true&&A.TemporadaFria("2026-07-13")===false,"enero es frío, julio no");
ok(A.EsAzul("Salmón a la plancha")&&A.EsAzul("Boquerones al horno")&&!A.EsAzul("Merluza al horno sobre cama de verduras"),"pescado azul reconocido");

// --- recetario: la pestaña Plan y las recetas de rutina ---
ok(A.PlanDishSet().size>=40,"la pestaña Plan del recetario reúne los platos del plan");
ok(!!A.DishRecipe("Porridge de avena con semillas y fruta")&&!!A.DishRecipe("Avena con fruta"),"los desayunos tienen receta aunque no estén en el catálogo");
// el salmorejo ya no rompe la lista de la compra
ok(A.RecipeParts(A.DishRecipe("Salmorejo")).items.every(it=>!/:/.test(it)&&!/\.\s/.test(it)),"el salmorejo ya no mete «sal. Para servir: …» en la compra");

// ============ 1.18.0 (2/3): arreglos del triaje (cazador de errores) ============
// semana vacía (la de hoy, o la del lunes que se pida) para los 3 miembros
const semanaVacia=lunes=>{
	A.state=A.SeedState(); A.RefreshCatalog();
	let w; if(lunes){ A.state.current=lunes; w=A.EnsureWeek(lunes); } else w=A.GoToThisWeek();
	A.state.members.forEach(m=>w.days.forEach(d=>{ d.slots.Comida[m.id]={dish:"",invId:null,away:false}; d.slots.Cena[m.id]={dish:"",invId:null,away:false}; }));
	return w;
};
const ponPlato=(w,dow,slot,dish)=>A.state.members.forEach(m=>{ w.days[dow].slots[slot][m.id]={dish,invId:null,away:false}; });

// --- A1: «Todo junto» suma las líneas idénticas de platos distintos ---
let wT=semanaVacia();
ponPlato(wT,3,"Cena","Pisto con huevo"); ponPlato(wT,4,"Cena","Fajitas de pavo con pimientos y guacamole");
const mgT=A.MergedIngredients();
ok(mgT.includes("1 cebolla ×2")&&!mgT.includes("1 cebolla"),"«Todo junto» suma las líneas repetidas (1 cebolla ×2)");
ok(mgT.includes("1 pimiento rojo ×2")&&mgT.filter(x=>/^sal$/i.test(x)).length===1,"las líneas con cantidad se suman; la sal sale una vez");
A.CurWeek().bought={}; A.ToggleBought(A.Norm("1 cebolla"));
ok(A.IsBought("1 cebolla ×2"),"tachar la línea de un plato marca la línea junta");
ok(A.BoughtForPantry().some(i=>i.name==="Cebolla"),"la despensa recibe «Cebolla», sin el ×2");

// --- A2 + A3: cada parte del compuesto con sus raciones; «Nosotros» son dos personas ---
wT=semanaVacia();
ponPlato(wT,0,"Comida","Salmorejo · Pavo a la plancha");
const icT=A.IngredientesCompra("Salmorejo · Pavo a la plancha");
ok(icT.includes("1 kg de tomate maduro")&&icT.includes("4 filetes gruesos de pavo"),"cada parte del compuesto se escala con sus propias raciones");
ok(!A.MergedIngredients().includes("2 filetes gruesos de pavo"),"ya no se compra pavo para 2");
ok(A.EscalaTxt("Salmorejo · Pavo a la plancha")==="Salmorejo ×1 · Pavo ×2","la cabecera dice el factor de cada parte (con la primera palabra: el nombre entero ya está encima)");
ponPlato(wT,3,"Comida","Ensalada de lechuga, aguacate, queso fresco y nueces · Atún a la plancha");
ok(A.IngredientesCompra("Ensalada de lechuga, aguacate, queso fresco y nueces · Atún a la plancha").includes("700 g de atún en 4 lomos"),"atún para 4: el peso escala con los lomos, no el peso POR lomo");
wT=semanaVacia();
ponPlato(wT,4,"Cena","Tacos de lechuga con pavo y guacamole");
ok(A.ServingsNeeded("Tacos de lechuga con pavo y guacamole")===4&&A.DishScale("Tacos de lechuga con pavo y guacamole")===2,"Nosotros son dos personas (4 comensales)");
ok(A.MergedIngredients().includes("600 g de pavo picado"),"pavo para 4");
["noah","iria"].forEach(id=>{ wT.days[4].slots.Cena[id]={dish:"",invId:null,away:true}; });
ok(A.ServingsNeeded("Tacos de lechuga con pavo y guacamole")===2,"con los niños fuera, 2 raciones");

// --- A4 + A5 + A16: «Sorpréndeme» en modo plan, medido sobre muchas semanas con fecha fija ---
// (fecha fija: el assert de ≥1,4 de arriba depende del día en que corre el CI)
{
	// claves que TODAS las opciones de un hueco comparten: esas no tienen alternativa
	const forz={pri:new Map(),seg:new Map(),cena:new Map()};
	A.PLAN_VIVE.semana.forEach(d=>["Comida","Cena"].forEach(s=>{ const sp=d[s]; if(!sp||sp.hid==="libre") return;
		[["pri",sp.pri],["seg",sp.seg]].forEach(([k,names])=>{ if(!names||!names.length) return;
			let c=null; names.forEach(n=>{ const t=A.MainToks(n); c=c?new Set([...c].filter(y=>t.has(y))):t; });
			const cur=s==="Comida"?k:"cena"; c.forEach(y=>forz[cur].set(y,(forz[cur].get(y)||0)+1)); }); }));
	let azulMal=0, blancosLunes=0, excesosP=0, ecosP=0, fajitas=0, repes=0, semanasP=0;
	const tiradas=[["2026-07-13",100],["2026-01-12",40]];
	tiradas.forEach(([lunes,n])=>{ for(let it=0; it<n; it++){
		const w=semanaVacia(lunes); A.state.inventory.frigo=[]; A.state.inventory.conge=[];
		A.Surprise(); semanasP++;
		const W=A.CurWeek();
		if(A.PlanCumplimiento().azul!==2) azulMal++;
		const cnt={pri:new Map(),seg:new Map(),cena:new Map()}, suma=(m,t)=>m.set(t,(m.get(t)||0)+1);
		W.days.forEach(d=>{
			const c=d.slots.Comida.nosotros.dish, x=d.slots.Cena.nosotros.dish;
			if(c){ const p=c.split(A.SEP).map(t=>t.trim());
				if(p[1]){ const a=A.MainToks(p[0]), b=A.MainToks(p[1]); if([...a].some(t=>b.has(t))) ecosP++; }
				A.MainToks(p[0]).forEach(t=>suma(cnt.pri,t)); if(p[1]) A.MainToks(p[1]).forEach(t=>suma(cnt.seg,t)); }
			if(x&&!A.EsLibre(x)) A.MainToks(x).forEach(t=>suma(cnt.cena,t));
		});
		Object.keys(cnt).forEach(cur=>cnt[cur].forEach((v,k)=>{ if(v>Math.max(A.CAP_TIPO,forz[cur].get(k)||0)) excesosP++; }));
		if(lunes==="2026-07-13"){
			if(it<40 && !A.EsAzul(W.days[0].slots.Cena.nosotros.dish)) blancosLunes++;
			if(W.days[4].slots.Cena.nosotros.dish==="Fajitas de pavo con pimientos y guacamole") fajitas++;
			if(W.days[0].slots.Comida.nosotros.dish.split(A.SEP)[0].trim()===W.days[1].slots.Cena.nosotros.dish.split(A.SEP)[0].trim()) repes++;
		}
	}});
	ok(semanasP===140,"se generaron las semanas de prueba del plan");
	ok(azulMal===0,"exactamente 2 pescados azules por semana, en verano y en invierno ("+azulMal+" semanas fuera)");
	ok(blancosLunes>=8,"el lunes también sale pescado blanco ("+blancosLunes+"/40)");
	ok(excesosP===0&&ecosP===0,"modo plan: el tope semanal y el no-repetir se cumplen ("+excesosP+" excesos, "+ecosP+" ecos)");
	ok(fajitas>=30,"las fajitas del plan salen el viernes ("+fajitas+"/100)");
	ok(repes===0,"el primero del lunes no se repite el martes por la noche ("+repes+"/100)");
}

// --- A6: un producto genérico de la despensa («Verduras») no elige el plato ---
{
	let martesNoCrema=0, mieEnsalada=0, merluzaLunes=0;
	const ensLeg=A.PlanSlot(2,"Comida").calor;
	for(let it=0; it<30; it++){
		semanaVacia("2026-07-13"); A.state.inventory.frigo=[]; A.state.inventory.conge=[{id:"v",name:"Verduras",qty:1}];
		A.Surprise();
		const W=A.CurWeek();
		if(W.days[1].slots.Cena.nosotros.dish.split(A.SEP)[0].trim()!=="Crema de verduras") martesNoCrema++;
		if(ensLeg.indexOf(W.days[2].slots.Comida.nosotros.dish)>=0) mieEnsalada++;
	}
	for(let it=0; it<10; it++){
		semanaVacia("2026-07-13"); A.state.inventory.conge=[]; A.state.inventory.frigo=[{id:"m",name:"Merluza",qty:1,pri:true}];
		A.Surprise();
		if(A.CurWeek().days[0].slots.Cena.nosotros.dish==="Merluza al horno sobre cama de verduras") merluzaLunes++;
	}
	ok(martesNoCrema>=1,"una bolsa de «Verduras» no fija la crema del martes ("+martesNoCrema+"/30 sin crema)");
	ok(mieEnsalada>=25,"en julio el miércoles sigue siendo legumbre en ensalada ("+mieEnsalada+"/30)");
	ok(merluzaLunes===10,"y la despensa sigue mandando: merluza prioritaria -> merluza el lunes ("+merluzaLunes+"/10)");
}

// --- A7: domingo con entreno de mañana: la patata del pollo asado ES su hidrato post-entreno ---
wT=semanaVacia();
A.state.plan.entrenos.alex={"6":"mañana"};
ponPlato(wT,6,"Comida","Pollo asado con verduras asadas y patata");
ok(info("alex",6,"Comida","Pollo asado con verduras asadas y patata").hid==="incluido","la patata del plato es su hidrato post-entreno");
ok(!A.PlanHidratosCompra().some(x=>/Alex · dom/.test(x)),"no se compra patata extra el domingo");

// --- A8: el pollo de la cena del domingo sale del asado de la comida (no se compra dos veces) ---
wT=semanaVacia();
ponPlato(wT,6,"Comida","Pollo asado con verduras asadas y patata"); ponPlato(wT,6,"Cena","Ensalada César ligera con pollo");
ok(!A.MergedIngredients().some(x=>/sobr[oó]/.test(x)),"el pollo de la cena sale del de la comida");
A.CurWeek().bought={}; A.MergedIngredients().forEach(x=>A.ToggleBought(A.Norm(x)));
ok(!A.BoughtForPantry().some(i=>/pollo asado/i.test(i.name)),"no entra un «Pollo asado» fantasma en la despensa");
ponPlato(wT,6,"Comida","Lentejas estofadas");
ok(A.MergedIngredients().some(x=>/400 g de pollo asado/.test(x)),"sin asado a mediodía, el pollo de la cena sí se compra");

// --- A9: RecipeParts separa por «;» y «. Mayúscula» de primer nivel y quita las etiquetas «adobo:» ---
ok(JSON.stringify(A.RecipeParts("Ingredientes (2 raciones): 400 g de pollo; adobo: comino, sal.\n\n1. x").items)===JSON.stringify(["400 g de pollo","comino","sal"]),"RecipeParts separa por ; y quita la etiqueta");
ok(JSON.stringify(A.RecipeParts("Ingredientes: 2 huevos, sal. Para servir: perejil (picado; fino)\n\n1. x").items)===JSON.stringify(["2 huevos","sal","perejil (picado; fino)"]),"y por «. Mayúscula», sin tocar lo que va entre paréntesis");
{
	const malos=Object.entries(A.RECETAS).filter(([k,v])=>{ const r=A.RecipeParts(v); return r&&!r.items.every(it=>!/[:;]|\.\s/.test(it.replace(/\([^)]*\)/g,""))); }).map(([k])=>k);
	ok(malos.length===0,"ningún ingrediente lleva etiqueta, ; ni . interior"+(malos.length?" — "+malos.slice(0,5).join(", "):""));
}
ok(A.RecipeParts(A.DishRecipe("Atún a la plancha")).items.includes("ensalada o pimientos asados"),"la guarnición del atún sale como línea propia");

// --- A10: el plan se fusiona por clave con sello (cada día de entreno y de noche de cada uno, activo, cole) ---
{
	const base=()=>{ const s=A.SeedState(); s.current="2026-09-28"; return s; };
	// the Plan tab stamps the day tapped: a whole new week = its 7 days stamped
	const semana=(pl,id,dias,ts)=>{ pl.entrenos[id]=dias; pl.at=pl.at||{}; for(let d=0;d<7;d++) pl.at["e:"+id+":"+d]=ts; };
	// 1) adoptar la copia del otro móvil conserva lo que este móvil cambió después
	A.state=base(); A.RefreshCatalog();
	semana(A.state.plan,"alex",{"1":"tarde"},"2026-09-28T10:00:00.000Z");
	const remota=base(); delete remota.catalog;
	remota.plan.noches.jeza=[2]; remota.plan.at={"n:jeza:2":"2026-09-28T10:00:05.000Z"}; remota.updatedAt="2026-09-28T10:00:06.000Z";
	A.AdoptRemote({state:JSON.parse(JSON.stringify(remota))},{quiet:true});
	ok(A.EntrenoDe("alex",1)==="tarde"&&A.EntrenoDe("alex",0)===null&&A.NocheDe("jeza",2),"adoptar conserva los entrenos de este móvil y trae las noches del otro");
	// 2) al revés (lo que hacen CloudSave y el pull con cambios sin subir)
	const loc=base(); semana(loc.plan,"alex",{"1":"tarde"},"2026-09-28T10:00:00.000Z");
	const rem=base(); rem.plan.noches.jeza=[2]; rem.plan.at={"n:jeza:2":"2026-09-28T10:00:05.000Z"};
	ok(A.MergePlan(loc,rem)===true&&loc.plan.entrenos.alex["1"]==="tarde"&&loc.plan.noches.jeza.join()==="2"&&loc.plan.at["n:jeza:2"]==="2026-09-28T10:00:05.000Z","MergePlan conserva los dos cambios y trae el sello");
	ok(A.MergePlan(loc,rem)===false,"fusionar otra vez no cambia nada");
	loc.plan.noches.jeza.push(4);
	ok(rem.plan.noches.jeza.join()==="2","la fusión copia el valor, no lo comparte");
	// 3) un plan por defecto (sin sellos) pierde frente a uno sellado
	const def=base(), sel=base(); semana(sel.plan,"alex",{"4":"mañana"},"2026-09-28T09:00:00.000Z");
	A.MergePlan(def,sel);
	ok(def.plan.entrenos.alex["4"]==="mañana"&&!def.plan.entrenos.alex["0"],"un plan por defecto pierde frente a uno sellado");
	const sel2=base(); semana(sel2.plan,"alex",{"4":"mañana"},"2026-09-28T09:00:00.000Z");
	A.MergePlan(sel2,base());
	ok(sel2.plan.entrenos.alex["4"]==="mañana"&&!sel2.plan.entrenos.alex["0"],"y el sellado no se pisa con los valores por defecto");
	// 4) cambiar algo en la pestaña Plan lo sella
	A.state=base(); A.RefreshCatalog(); A.StampPlan("e:alex:3");
	ok(!!(A.state.plan.at&&A.state.plan.at["e:alex:3"]),"StampPlan sella la clave");
	ok(A.MergePlan({plan:"basura"},sel)===false,"un plan corrupto no rompe la fusión");
	// 5) POR DÍA: un móvil que aún no tenía los cambios del otro (pasa mientras uno sigue en la
	// v1.17) toca un día y solo ese día cambia; antes se llevaba la semana entera de esa persona
	const a=base(); delete a.plan.entrenos.alex["0"]; a.plan.entrenos.alex["1"]="tarde";
	a.plan.at={"e:alex:0":"2026-09-28T10:00:00.000Z","e:alex:1":"2026-09-28T10:00:00.000Z"};
	const b=base(); b.plan.entrenos.alex["4"]="mañana"; b.plan.at={"e:alex:4":"2026-09-28T10:05:00.000Z"};
	A.MergePlan(a,b); A.MergePlan(b,a);
	ok(JSON.stringify(a.plan.entrenos.alex)===JSON.stringify(b.plan.entrenos.alex)&&JSON.stringify(a.plan.entrenos.alex)===JSON.stringify({"1":"tarde","2":"tarde","4":"mañana","5":"mañana"}),
		"los dos móviles acaban con los cambios de los dos, día a día "+JSON.stringify(a.plan.entrenos.alex));
	const na=base(); na.plan.noches.jeza=[1]; na.plan.at={"n:jeza:1":"2026-09-28T10:00:00.000Z"};
	const nb=base(); nb.plan.noches.jeza=[5]; nb.plan.at={"n:jeza:5":"2026-09-28T10:01:00.000Z"};
	A.MergePlan(na,nb); A.MergePlan(nb,na);
	ok(na.plan.noches.jeza.join()==="1,5"&&nb.plan.noches.jeza.join()==="1,5","las noches marcadas en móviles distintos se suman");
}

// --- A11: el tema Noche redefine los fondos suaves (el nombre del día de los entrenos era invisible) ---
ok(/:root\.dark\{[^}]*--herb-soft:/.test(html)&&/:root\.dark\{[^}]*--amber-soft:/.test(html),"el tema oscuro redefine --herb-soft y --amber-soft");
ok(/:root\.dark \.inv-chip\{color:var\(--herb\)\}/.test(html),"y los chips de la despensa (texto fijo oscuro) cambian de color en Noche");

// --- A12: la fila de 7 días del editor de entrenos siempre cabe ---
ok(/\.pv-days[^{]*\{[^}]*grid-template-columns:repeat\(7,minmax\(0,1fr\)\)/.test(html),"la fila de 7 días es una rejilla que siempre cabe");
A.state=A.SeedState(); A.RefreshCatalog(); A.state.plan.entrenos.jeza={"0":"mañana"};
ok(!/class="st">mañana</.test(A.RenderPlan())&&/class="st">mañ\.</.test(A.RenderPlan()),"etiqueta corta en la celda («mañ.»)");
A.state=A.SeedState(); A.RefreshCatalog();

// --- A13: el plan del día solo muestra la nota del hueco si va con ese plato ---
wT=semanaVacia("2026-10-05");
const txtT=(dow,slot)=>A.PlanComidaTxt(A.PlanPerfil("alex"),dow,slot,A.CurWeek().days[dow]);
ok(/algo de pan/.test(txtT(0,"Comida")),"hueco vacío: la nota del plan se ve");
ponPlato(wT,0,"Comida","Crema de calabaza · Pechuga de pollo a la plancha");
ok(!/salmorejo/i.test(txtT(0,"Comida")),"sin nota de salmorejo junto a una crema");
ponPlato(wT,0,"Comida","Salmorejo · Pechuga de pollo a la plancha");
ok(/algo de pan/.test(txtT(0,"Comida")),"con el salmorejo, sí");
ponPlato(wT,0,"Comida","Alubias con verduras");
ok(!/algo de pan/.test(txtT(0,"Comida")),"ni junto a un plato que no es del hueco");
ponPlato(wT,6,"Comida","Lentejas estofadas");
ok(!/Guarda el pollo/.test(txtT(6,"Comida")),"sin «Guarda el pollo» si a mediodía no hay pollo asado");
ponPlato(wT,6,"Comida","Pollo asado con verduras asadas y patata");
ok(/Guarda el pollo/.test(txtT(6,"Comida")),"con el pollo asado, sí");
ponPlato(wT,4,"Cena","Tacos de lechuga con pavo y guacamole");
ok(!/sin tortilla/.test(txtT(4,"Cena")),"la nota de las fajitas no sale junto a los tacos de lechuga");
ponPlato(wT,5,"Cena","Pizza casera de verduras");
ok(/sin que se vaya la cabeza/.test(txtT(5,"Cena"))&&!/descanso/.test(txtT(5,"Cena")),"cena libre con un plato a mano: solo la nota de «libre», sin avisos");

// --- A15: plato que es solo hidrato en día de descanso: un mensaje que se pueda cumplir ---
const ieT=info("alex",4,"Comida","Espaguetis integrales con tomate");
ok(ieT.hid==="aviso"&&ieT.rac===""&&/sobre todo hidrato/.test(ieT.txt||""),"plato de hidrato en descanso: mensaje cumplible");
ok(/sobre todo hidrato/.test(A.PlanRacionHtml(A.PlanPerfil("alex"),4,"Comida","Espaguetis integrales con tomate")),"y es el que se pinta");
ok(/sin arroz, pasta, patata ni pan/.test(A.PlanRacionHtml(A.PlanPerfil("alex"),4,"Comida","Merluza al vapor con verduritas · Espaguetis integrales con tomate")),"si solo una parte es hidrato, se quita esa parte");

// --- A18: ayuno solo para quien lo tiene pautado, también los días de entreno de tarde ---
A.state=A.SeedState(); A.RefreshCatalog(); A.GoToThisWeek();
const d0T=A.CurWeek().days[0];
ok(!/\bayuno/i.test(A.PlanPersonaDiaHtml(A.PlanPerfil("jeza"),0,d0T)),"a Jeza no se le pauta ayuno (su desayuno prioritario es el bowl)");
const hxT=A.PlanPersonaDiaHtml(A.PlanPerfil("alex"),0,d0T);
ok(/Mínimo 3 días/.test(hxT)&&/Pre-entreno/.test(hxT),"Alex: ayuno también el día de entreno de tarde, y su pre-entreno");
ok(!/Mínimo 3 días/.test(A.PlanPersonaDiaHtml(A.PlanPerfil("alex"),5,A.CurWeek().days[5]))&&/más hidrato/.test(A.PlanPersonaDiaHtml(A.PlanPerfil("alex"),5,A.CurWeek().days[5])),"Alex el sábado (entreno de mañana): sin ayuno y desayuno con más hidrato");

// --- A19: los textos dicen lo que hace la app ---
A.state=A.SeedState(); A.RefreshCatalog(); A.GoToThisWeek();
A.state.plan.activo=false;
ok(/no se muestran raciones/.test(A.RenderPlan()),"el interruptor dice todo lo que apaga");
A.state.plan.activo=true;
ok(/hidratos post-entreno en la compra/.test(A.RenderPlan())&&/Seguir el plan del nutricionista/.test(A.RenderPlan()),"y lo que enciende");
ok(!/^<b>Fuera<\/b>/.test(A.PLAN_VIVE.tipoDia.descanso.l[1])&&/nada de fuentes densas/.test(A.PLAN_VIVE.tipoDia.descanso.l[1]),"descanso: «en comida y cena, nada de fuentes densas» (sin doble lectura)");
ok(/Esta semana/.test(A.RenderPlan()),"la semana de hoy se llama «Esta semana»");
A.state.current=A.AddDays(A.MondayOf(A.TodayISO()),7); A.EnsureWeek(A.state.current);
const rpT=A.RenderPlan();
ok(/Semana del/.test(rpT)&&!/Esta semana/.test(rpT),"otra semana: el título dice cuál es");

// --- A20: importar una copia de antes de la v1.18 (sin plan) conserva los entrenos ---
A.state=A.SeedState(); A.RefreshCatalog(); A.GoToThisWeek();
A.state.plan.entrenos.alex={"1":"mañana"};
{
	const f=JSON.parse(JSON.stringify(A.state)); delete f.plan; delete f.catalog;
	A.ImportarCopia(f);
	ok(A.EntrenoDe("alex",1)==="mañana","importar una copia sin plan conserva los entrenos");
	const g=JSON.parse(JSON.stringify(A.state)); delete g.catalog; g.plan.entrenos.alex={"3":"tarde"};
	A.ImportarCopia(g);
	ok(A.EntrenoDe("alex",3)==="tarde"&&A.EntrenoDe("alex",1)===null,"una copia CON plan sí trae el suyo");
}

// --- A22: pasillos: conservas, caldos y aliños a la despensa; uvas a la frutería ---
{
	const casos=[["1 cucharada de vinagre de manzana","Despensa"],["400 g de tomate triturado","Despensa"],["1 l de caldo de pollo","Despensa"],
		["200 g de atún en aceite de oliva (escurrido)","Despensa"],["2 latas de sardinillas","Despensa"],["pipas de calabaza","Despensa"],
		["120 g de uvas","Fruta y verdura"],["eneldo fresco","Fruta y verdura"],["220 g de palitos de cangrejo","Frescos y lácteos"],
		["1 kg de tomate maduro","Fruta y verdura"],["400 g de pechuga de pollo","Carne y pescado"]];
	const mal=casos.filter(([x,a])=>A.AisleName(A.AisleOf(x))!==a);
	ok(mal.length===0,"conservas y aliños a la despensa; uvas a la frutería"+(mal.length?" — "+mal.map(([x])=>x+" → "+A.AisleName(A.AisleOf(x))).join(", "):""));
}

// --- A23: bordes de temporada, el plan viaja en la copia y arrancar con un store sin plan no ensucia ---
ok(A.TemporadaFria("2026-09-30")===false&&A.TemporadaFria("2026-10-01")===true&&A.TemporadaFria("2026-04-30")===true&&A.TemporadaFria("2026-05-01")===false,"bordes de temporada (octubre–abril)");
A.state=A.SeedState(); A.RefreshCatalog();
{
	const py=A.BuildSyncPayload(A.state);
	ok(!!py.state.plan&&!!py.state.plan.entrenos&&!py.state.catalog&&!/nutri_gh_token/.test(JSON.stringify(py)),"el plan viaja en la copia; el catálogo y el token, no");
	const s0=JSON.parse(JSON.stringify(A.state)); delete s0.plan; delete s0.catalog;
	s0.updatedAt=s0.lastSync="2026-09-28T10:00:00.000Z";
	localStorage.setItem(A.STORE_KEY,JSON.stringify(s0));
	ok(A.Load()===true,"el store sin plan se carga");
	A.EnsurePlanState(A.state);
	ok(!A.CloudDirty()&&A.state.updatedAt==="2026-09-28T10:00:00.000Z"&&!A.state.plan.at,"rellenar el plan por defecto no ensucia, no re-sella y no sella claves del plan");
	// y el arranque guarda con SaveQuiet: un Save() ahí subiría el plan por defecto de cada móvil que se actualice
	const initSrc=src.slice(src.indexOf("(function init(){"),src.indexOf("CloudPull({boot:true})"));
	ok(initSrc.length>0&&/EnsurePlanState\(state\)/.test(initSrc)&&/SaveQuiet\(\)/.test(initSrc)&&!/\bSave\(\)/.test(initSrc),"el arranque rellena el plan y guarda SIN sellar (SaveQuiet, nunca Save)");
	localStorage.removeItem(A.STORE_KEY);
}
A.state=A.SeedState(); A.RefreshCatalog();

// --- A14: la cena libre no lleva avisos de hidratos, sea cual sea el plato ---
ok(info("alex",5,"Cena","Pizza casera de verduras").hid==="libre"&&A.PlanRacionHtml(A.PlanPerfil("alex"),5,"Cena","Pizza casera de verduras")==="","la cena libre no lleva avisos de hidratos");

// --- A17: raciones según la opción elegida del hueco; la noche de Jeza ya la sabe la app ---
A.state=A.SeedState(); A.RefreshCatalog();
ok(info("alex",4,"Comida","Judías verdes salteadas con pollo").rac==="150–170 g de pollo","viernes con pollo: solo los gramos de pollo, sin «2 huevos + frutos secos»");
ok(info("jeza",4,"Comida","Judías verdes salteadas con almendras, huevo duro y queso de cabra").rac==="1 huevo + ½ puñado de frutos secos","viernes con huevo: solo el huevo y los frutos secos");
ok(info("alex",3,"Cena","Pisto con huevo").rac==="2 huevos"&&info("alex",3,"Cena","Pisto con pollo desmigado").rac==="150 g de pollo","jueves: el pisto con huevo lleva huevos; el de pollo, pollo");
A.state.plan.noches.jeza=[6];
ok(info("jeza",6,"Cena","Ensalada César ligera con pollo").rac==="150 g","Jeza trabaja el domingo por la noche -> 150 g");
ok(/Jeza<\/b> 150 g ·/.test(A.PlanRacionHtml(A.PlanPerfil("jeza"),6,"Cena")),"la pestaña Plan (sin plato) también resuelve su noche");
A.state.plan.noches.jeza=[];
ok(info("jeza",6,"Cena","Ensalada César ligera con pollo").rac==="120 g","sin trabajar esa noche -> 120 g");
ok(/Jeza<\/b> 120 g ·/.test(A.PlanRacionHtml(A.PlanPerfil("jeza"),6,"Cena"))&&!/object/i.test(A.PlanRacionHtml(A.PlanPerfil("jeza"),6,"Cena")),"la pestaña Plan sin noche: 120 g (nunca «[object Object]»)");
ok(/2 huevos \+ 1 puñado/.test(A.PlanRacionHtml(A.PlanPerfil("alex"),4,"Comida")),"sin plato elegido, el viernes sigue mostrando las dos opciones");
A.state=A.SeedState(); A.RefreshCatalog();

// --- A21: el pisto con pollo dice cuánto pollo comprar (en crudo) y cómo cocinarlo ---
{
	const rp=A.DishRecipe("Pisto con pollo desmigado");
	ok(/550 g de pechuga de pollo/.test(rp)&&/Cuece la pechuga/.test(rp),"el pisto con pollo dice cuánto pollo comprar y cómo cocinarlo");
	ok(/Sirve 150 g de pollo a Alex y a Jeza/.test(rp)&&!/cocida/i.test(A.RecipeParts(rp).items.join("|")),"sirve 150 g a cada adulto; la compra no pide «pechuga cocida»");
	const pis=A.PLAN_DISHES.find(d=>d.name==="Pisto con pollo desmigado");
	ok(pis&&pis.prot===33&&pis.kcal===335,"macros del pisto con pollo al día (33 g de proteína)");
	const pollo=A.RecipeParts(rp).items.find(x=>/pechuga/.test(x));
	ok(pollo&&A.AisleName(A.AisleOf(pollo))==="Carne y pescado","la pechuga en crudo va a carnicería");
}

// ============ 1.18.0 (3/3): lo que encontró el verificador tras la primera ronda ============
// --- R1 + N3: el pescado azul es de los ADULTOS; si comen fuera, no se gasta en los niños ---
{
	const cuenta=(lunes,n,prep)=>{ const h={}; for(let it=0; it<n; it++){
		const w=semanaVacia(lunes); A.state.inventory.frigo=[]; A.state.inventory.conge=[]; prep(w);
		A.Surprise(); const a=A.PlanCumplimiento().azul; h[a]=(h[a]||0)+1; } return h; };
	const fuera=(w,dias)=>dias.forEach(i=>{ w.days[i].slots.Comida.nosotros={dish:"",invId:null,away:true}; });
	const jue=cuenta("2026-07-13",60,w=>fuera(w,[3]));
	ok(jue[2]===60,"adultos fuera el jueves a mediodía: siguen saliendo sus 2 azules "+JSON.stringify(jue));
	const lv=cuenta("2026-07-13",40,w=>fuera(w,[0,1,2,3,4]));
	ok(lv[1]===40,"adultos fuera de lunes a viernes a mediodía: 1 azul (el máximo posible), nunca 0 "+JSON.stringify(lv));
	const inv=cuenta("2026-01-12",40,w=>ponPlato(w,0,"Cena","Merluza al horno sobre cama de verduras"));
	ok(inv[2]===40,"invierno con merluza a mano el lunes: el 2º azul sale aunque sea fuera de temporada "+JSON.stringify(inv));
	const pri=cuenta("2026-01-12",40,w=>{ A.state.inventory.frigo=[{id:"m",name:"Merluza",qty:1,pri:true}]; });
	ok(pri[2]===40,"invierno con merluza prioritaria en la nevera: 2 azules "+JSON.stringify(pri));
	// the kids' own lunch comes BEFORE the adults' Thursday: an oily fish there must not count
	const mie=cuenta("2026-07-13",60,w=>fuera(w,[2]));
	ok(mie[2]===60,"adultos fuera el miércoles: el azul de la ensalada de los niños no cuenta para ellos "+JSON.stringify(mie));
}

// --- R7: la despensa se enlaza por el NOMBRE del plato antes que por su grupo ---
{
	let pavo=0;
	for(let it=0; it<20; it++){
		semanaVacia("2026-10-05"); A.state.inventory.conge=[];
		A.state.inventory.frigo=[{id:"po",name:"Pollo",qty:1},{id:"pv",name:"Filetes de pavo",qty:1}];
		A.Surprise();
		if(A.CurWeek().days[4].slots.Cena.nosotros.invId==="pv") pavo++;
	}
	ok(pavo===20,"los tacos o las fajitas de pavo gastan los «Filetes de pavo», no el «Pollo» ("+pavo+"/20)");
}

// --- R2: proteína con guarnición densa en descanso: su ración, sin la guarnición ---
{
	const im=info("alex",0,"Comida","Merluza al horno con verduras y patata");
	ok(im.hid==="aviso"&&!!im.rac&&!/sobre todo hidrato/.test(im.txt||""),"merluza con patata en descanso: con su ración, no «sobre todo hidrato»");
	ok(/sin arroz, pasta, patata ni pan \(o muy poco\)/.test(A.PlanRacionHtml(A.PlanPerfil("alex"),0,"Comida","Merluza al horno con verduras y patata")),"y el aviso que se pinta se puede cumplir");
	const ie=info("alex",0,"Comida","Espaguetis integrales con tomate");
	ok(ie.hid==="aviso"&&/sobre todo hidrato/.test(ie.txt||""),"la pasta sola sigue siendo «sobre todo hidrato»");
	ok(A.EsProteico("Pollo teriyaki con arroz integral")&&A.EsProteico("Espaguetis con gambas")&&!A.EsProteico("Macarrones con tomate")&&!A.EsProteico("Pizza casera de verduras"),"EsProteico mira el grupo y el nombre");
	const wE=semanaVacia("2026-10-05"); ponPlato(wE,0,"Comida","Espaguetis integrales con tomate");
	ok(!/pv-rac">\s*·/.test(A.PlanComidaTxt(A.PlanPerfil("alex"),0,"Comida",A.CurWeek().days[0])),"sin ración, el plan del día no empieza la línea con «·»");
}

// --- R3: la cabecera de «Por plato» parte línea en vez de sacar el 📖 y el contador de la tarjeta ---
ok(/\.need-h \.need-nm\{[^}]*min-width:0/.test(html)&&/\.need-h \.need-x\{[^}]*white-space:normal/.test(html),"la cabecera de un plato puede partir línea");

// --- R4: una receta propia escrita «Pollo: 500 g» no pierde el producto en la compra ---
{
	const rp=A.RecipeParts("Ingredientes (4 raciones): Pollo: 500 g, Huevos: 4, AOVE: 2 cucharadas, Sal: al gusto, Opcional: guindilla; adobo: comino.\n\n1. x");
	ok(JSON.stringify(rp.items)===JSON.stringify(["500 g de pollo","4 huevos","2 cucharadas de AOVE","sal al gusto","guindilla (opcional)","comino"]),"«Pollo: 500 g» → «500 g de pollo»; las etiquetas de grupo se siguen quitando "+JSON.stringify(rp.items));
	ok(rp.ver[0]==="Pollo: 500 g"&&rp.ver.includes("adobo: comino"),"la ficha de la receta conserva el texto con sus etiquetas");
	const q=A.RecipeParts(A.RECETAS["quiche de verduras integral"]);
	ok(q&&q.ver.some(x=>/^base:/i.test(x))&&!q.items.some(x=>/^base:/i.test(x)),"la quiche: «base:» en la ficha, no en la compra");
	// and the sheet really paints `ver` (the stub's getElementById does not keep elements)
	const gid=document.getElementById, cap={};
	document.getElementById=id=>cap[id]||(cap[id]=fakeEl());
	try{ const dq=A.state.catalog.find(x=>x.name.trim().toLowerCase()==="quiche de verduras integral");
		A.OpenDish(dq.id);
		ok(/• base:/i.test(cap.sheetContent.innerHTML)&&/• relleno:/i.test(cap.sheetContent.innerHTML),"la ficha de la quiche pinta «base:» y «relleno:»");
	}finally{ document.getElementById=gid; }
}

// --- R6 + N2: el pollo que sobra del asado cubre SOLO la cena de ese día ---
{
	const wS=semanaVacia("2026-10-05");
	ponPlato(wS,6,"Comida","Pollo asado con verduras asadas y patata"); ponPlato(wS,6,"Cena","Ensalada César ligera con pollo");
	ponPlato(wS,1,"Comida","Ensalada César ligera con pollo");
	const mg=A.MergedIngredients();
	ok(mg.includes("400 g de pollo asado")&&!mg.some(x=>/sobr[oó]/.test(x)),"la César del martes a mediodía compra su pollo, y no lo llama «el que sobró»");
	const txtD=()=>A.PlanComidaTxt(A.PlanPerfil("alex"),6,"Cena",A.CurWeek().days[6]);
	ok(/Aprovecha el pollo que sobró/.test(txtD()),"con pollo asado a mediodía, la cena del domingo lo aprovecha");
	ponPlato(wS,6,"Comida","Lentejas estofadas");
	ok(/Evita salsas/.test(txtD())&&!/Aprovecha el pollo/.test(txtD()),"sin asado, la nota ya no dice que aproveche el pollo de la comida");
	ok(A.MergedIngredients().some(x=>/^800 g de pollo asado$/.test(x)),"y la compra pide el pollo de las dos Césares, sin «sobra»");
	// the roast covers that day's DINNER only: a César eaten at the same lunch has no leftovers yet
	const wL=semanaVacia("2026-10-05");
	wL.days[6].slots.Comida.nosotros={dish:"Pollo asado con verduras asadas y patata",invId:null,away:false};
	["noah","iria"].forEach(id=>{ wL.days[6].slots.Comida[id]={dish:"Ensalada César ligera con pollo",invId:null,away:false}; });
	ok(A.MergedIngredients().includes("400 g de pollo asado"),"la César de los niños a mediodía, junto al asado, compra su pollo");
}

// --- N1: el cableado de la fusión del plan (A10) está protegido (mata los 4 mutantes que sobrevivían) ---
{
	const sinCom=s=>s.replace(/\/\*[\s\S]*?\*\//g,"").replace(/\/\/.*$/gm,"");
	const pull=sinCom(src.slice(src.indexOf("async function CloudPull("),src.indexOf("function FlushPendingPull")));
	const save=sinCom(src.slice(src.indexOf("async function CloudSave("),src.indexOf("async function CloudPull(")));
	const adopt=sinCom(src.slice(src.indexOf("function AdoptRemote("),src.indexOf("async function CloudPull(")));
	ok(/MergePlan\(state,\s*payload\.state\)/.test(pull),"el pull (recover / keep-local) fusiona el plan");
	ok(/MergePlan\(state,\s*payload\.state\)/.test(save)&&save.indexOf("MergePlan(")<save.indexOf('method:"PUT"'),"CloudSave fusiona el plan ANTES del PUT");
	ok(/MergePlan\(state,\s*\{plan:localPlan\}\)/.test(adopt),"AdoptRemote fusiona el plan de este móvil");
	[["vive-activo","StampPlan("],["vive-ent","ToggleEntreno("],["vive-noche","ToggleNoche("],["vive-cole","StampPlan("]].forEach(([a,f])=>{ const i=src.indexOf('case "'+a+'"'), c=src.slice(i,src.indexOf("case ",i+6));
		ok(i>0&&c.indexOf(f)>=0&&c.indexOf(f)<c.indexOf("Save()"),a+" sella su clave antes de guardar"); });
	// the day buttons stamp THAT day (per person-week, a stale phone replaced the whole week)
	A.state=A.SeedState(); A.RefreshCatalog();
	A.ToggleEntreno("alex",3);
	ok(A.state.plan.entrenos.alex["3"]==="mañana"&&!!A.state.plan.at["e:alex:3"]&&Object.keys(A.state.plan.at).length===1,"tocar el jueves de Alex: «mañana», y solo se sella ese día");
	A.ToggleEntreno("alex",3); A.ToggleEntreno("alex",3);
	ok(A.state.plan.entrenos.alex["3"]===undefined,"descanso → mañana → tarde → descanso");
	A.ToggleNoche("jeza",6);
	ok(A.NocheDe("jeza",6)&&!!A.state.plan.at["n:jeza:6"],"marcar la noche del domingo de Jeza sella «n:jeza:6»");
	A.state=A.SeedState(); A.RefreshCatalog();
}

// --- N4 + contraste: «Fuera de casa» en Noche; el ámbar sobre fondo claro ---
ok(/\.btn\.warn\{background:var\(--ghost-bg\)/.test(html),"el botón «Fuera de casa» usa el fondo de los botones secundarios (oscuro en Noche)");
{
	// the selector list of each rule "{color:X}" (last line before the brace)
	const regla=(sel,color)=>{ const m=html.match(new RegExp("[^{}]*\\{color:"+color+"\\}","g"))||[];
		return m.some(r=>r.split("{")[0].split("\n").pop().split(",").some(s=>s.trim()===":root:not(.dark) "+sel)); };
	ok([".pv-d.t",".btn.warn",".pl-carb",".pv-chip.warn"].every(s=>regla(s,"#9A4F1E")),"el ámbar sobre fondo claro va más oscuro (entrenos, «Fuera de casa», hidratos, avisos)");
	ok([".pv-d.m",".pv-chip.ok"].every(s=>regla(s,"#2A7050"))&&regla(".pv-nota","#58615C"),"y el verde y las notas del plan también (≥ 5:1)");
}

// --- plurales al escalar (con «Nosotros» = 2 personas, casi todo va ×2) ---
{
	const P=[["1 aguacate maduro",2,"2 aguacates maduros"],["1 pimiento rojo grande",2,"2 pimientos rojos grandes"],["1 limón (zumo)",2,"2 limones (zumo)"],
		["1 diente de ajo",3,"3 dientes de ajo"],["1 calabacín mediano",2,"2 calabacines medianos"],["1 kg de patatas",2,"2 kg de patatas"],
		["½ cebolla",2,"1 cebolla"],["1 o 2 guindillas",2,"2 o 4 guindillas"],["1 huevo L",2,"2 huevos L"],["1 tortilla integral",2,"2 tortillas integrales"],
		["1 cda. de aceite",2,"2 cda. de aceite"],["1 lomo de salmón (unos 150 g)",2,"2 lomos de salmón (unos 300 g)"],["1 yogur natural",2,"2 yogures naturales"],
		["1 nuez moscada",2,"2 nueces moscadas"],["250 g de lentejas",2,"500 g de lentejas"]];
	const mal=P.filter(([x,f,e])=>A.ScaleQty(x,f)!==e);
	ok(mal.length===0,"al pasar de una unidad a varias, el ingrediente va en plural"+(mal.length?" — "+mal.map(([x,f])=>x+" ×"+f+" → "+A.ScaleQty(x,f)).join(" | "):""));
	A.state=A.SeedState(); A.RefreshCatalog();
	A.state.inventory.frigo=[{id:"l",name:"Limón",qty:1},{id:"y",name:"Yogures",qty:1},{id:"c",name:"Carne picada",qty:1}]; A.state.inventory.conge=[];
	ok(A.PantryHas("2 limones (zumo)")&&A.PantryHas("2 yogures naturales")&&A.PantryHas("500 g de carnes variadas"),"y la despensa los sigue reconociendo («ya tienes»)");
	A.state=A.SeedState(); A.RefreshCatalog();
}

// ============ 1.18.0: tercera ronda (lo que encontraron los verificadores finales) ============
// --- cantidades escritas a mano, y plural detrás de CADA cantidad ---
{
	const P=[["1/2 kg de tomate",2,"1 kg de tomate"],["1 1/2 taza de arroz",2,"3 tazas de arroz"],["1½ vasos de leche",2,"3 vasos de leche"],
		["25/30 g de nueces",2,"50/60 g de nueces"],["zumo de 1 limón",2,"zumo de 2 limones"],["1 pera o 1 manzana",2,"2 peras o 2 manzanas"],
		["salsa: 1 aguacate",2,"salsa: 2 aguacates"],["1 brick de leche",2,"2 bricks de leche"],["1 plátano muy maduro",2,"2 plátanos muy maduros"],
		["1 cebolla bien picada",2,"2 cebollas bien picadas"],["1 lt de caldo",2,"2 lt de caldo"],["1 sobre de levadura",2,"2 sobres de levadura"],
		["1 queso francés",2,"2 quesos franceses"],["1 coliflor",2,"2 coliflores"],["1¼ taza",2,"2½ tazas"],["125 g de queso",1.5,"187,5 g de queso"]];
	const mal=P.filter(([x,f,e])=>A.ScaleQty(x,f)!==e);
	ok(mal.length===0,"fracciones a mano y plurales detrás de cada cantidad"+(mal.length?" — "+mal.map(([x,f])=>x+" ×"+f+" → "+A.ScaleQty(x,f)).join(" | "):""));
	A.state=A.SeedState(); A.RefreshCatalog(); A.state.inventory.frigo=[{id:"cf",name:"Coliflor",qty:1}]; A.state.inventory.conge=[];
	ok(A.PantryHas("2 coliflores"),"«2 coliflores» sigue casando con la «Coliflor» de la despensa");
	ok(A.RecipeServings("Tortilla francesa")===1&&A.RecipeServings("Tostada integral de aguacate y huevo")===1,"una receta «(1 ración)» es de 1 ración (se leía como 2 y se compraba la mitad)");
}

// --- etiquetas en recetas propias: según la ETIQUETA ---
{
	const it=A.RecipeParts("Ingredientes (2 raciones): Cebolla: 1 grande, Nota: comprar el día antes, Horno: 180 °C, Para la salsa: 2 cucharadas, Huevo: 2, Mantequilla: 50 g (a temperatura ambiente), Aceite de oliva: un chorrito.\n\n1. x").items;
	ok(JSON.stringify(it)===JSON.stringify(["Cebolla: 1 grande","Para la salsa: 2 cucharadas","2 huevos","50 g de mantequilla (a temperatura ambiente)","Aceite de oliva: un chorrito"]),
		"la etiqueta que ES el producto se queda; «Nota:» y «Horno:» no se compran "+JSON.stringify(it));
	const malos=Object.entries(A.RECETAS).filter(([k,v])=>{ const r=A.RecipeParts(v); return r&&r.items.some(x=>/:/.test(x.replace(/\([^)]*\)/g,""))); }).map(([k])=>k);
	ok(malos.length===0,"en las RECETAS de la app todas las etiquetas son de grupo y se siguen quitando"+(malos.length?" — "+malos.join(", "):""));
}

// --- la despensa recibe el producto como lo nombra la RECETA, no la línea escalada ---
{
	const w=semanaVacia("2026-10-05");
	ponPlato(w,0,"Cena","Lubina al horno");
	const linea=A.MergedIngredients().find(x=>/limones/.test(x));
	ok(!!linea,"la compra dice «2 limones» (lubina de 2 raciones para 4)");
	A.CurWeek().bought={}; A.ToggleBought(A.Norm(linea));
	const bp=A.BoughtForPantry().map(i=>i.name);
	ok(bp.includes("Limón")&&!bp.some(n=>/^Limones/.test(n)),"«Ya está en casa» ofrece «Limón», no «Limones» "+JSON.stringify(bp));
	A.state.inventory.frigo=[{id:"l",name:"Limón",qty:1}]; A.state.produce=[{id:"p1",name:"Limones",done:true}]; A.state.extras=[];
	A.ui.homePick={"Limón":"frigo","Limones":"frigo"};
	A.SaveBackHome();
	const lim=A.state.inventory.frigo.filter(x=>/^lim/i.test(x.name));
	ok(lim.length===1&&lim[0].qty===3,"«Limones» se suma a tu «Limón» en vez de abrir otra fila "+JSON.stringify(lim));
}

// --- «Sorpréndeme»: plurales en la despensa, enlace por grupo solo para productos genéricos ---
{
	let cal=0, raro=0;
	for(let it=0; it<10; it++){
		semanaVacia("2026-01-12"); A.state.inventory.conge=[]; A.state.inventory.frigo=[{id:"c",name:"Calabacines",qty:1,pri:true}];
		A.Surprise();
		if(A.CurWeek().days.some(d=>["Comida","Cena"].some(s=>d.slots[s].nosotros.invId==="c"&&/calabac/i.test(d.slots[s].nosotros.dish)))) cal++;
	}
	A.state=A.SeedState(); A.RefreshCatalog();
	for(let it=0; it<20; it++){
		const w=A.GoToThisWeek(); A.state.plan.activo=false;
		A.state.members.forEach(m=>w.days.forEach(d=>{ d.slots.Comida[m.id]={dish:"",invId:null,away:false}; d.slots.Cena[m.id]={dish:"",invId:null,away:false}; }));
		A.state.inventory.conge=[]; A.state.inventory.frigo=[{id:"cp",name:"Carne picada",qty:1,pri:true}];
		A.Surprise();
		A.CurWeek().days.forEach(d=>["Comida","Cena"].forEach(s=>{ const c=d.slots[s].nosotros; if(c.invId==="cp"&&!/carne|picad/i.test(c.dish)) raro++; }));
	}
	ok(cal===10,"«Calabacines» en la nevera cuenta para la crema de calabacín ("+cal+"/10)");
	ok(raro===0,"la «Carne picada» no se enlaza a un plato que no la lleva ("+raro+" enlaces raros)");
	A.state=A.SeedState(); A.RefreshCatalog();
}

// --- pescado azul: la despensa en un hueco POSTERIOR ya no deja la semana en 1 ---
{
	const cuenta=(lunes,n,frigo)=>{ const h={}; for(let it=0; it<n; it++){ semanaVacia(lunes); A.state.inventory.conge=[]; A.state.inventory.frigo=frigo();
		A.Surprise(); const a=A.PlanCumplimiento().azul; h[a]=(h[a]||0)+1; } return h; };
	const ver=cuenta("2026-07-13",40,()=>[{id:"b",name:"Bacalao",qty:1,pri:true}]);
	const inv=cuenta("2026-01-12",40,()=>[{id:"b",name:"Bacalao",qty:1,pri:true}]);
	ok(ver[2]===40&&inv[2]===40,"con bacalao que caduca (se queda el jueves), siguen saliendo 2 azules: verano "+JSON.stringify(ver)+", invierno "+JSON.stringify(inv));
	ok(A.EsAzul("Ensalada empedrada")&&A.EsAzul("Salmón a la plancha")&&!A.EsAzul("Merluza al horno sobre cama de verduras"),"la empedrada (200 g de atún) cuenta como pescado azul");
	const w=semanaVacia("2026-07-13"); ponPlato(w,2,"Comida","Ensalada empedrada");
	ok(A.PlanCumplimiento().azul===1&&A.PlanCumplimiento().pescado===1,"y la pestaña Plan la cuenta igual que «Sorpréndeme»");
	ok(!A.MainToks("Merluza al horno sobre cama de verduras").has("cama")&&!A.MainToks("Ensalada templada de quinoa, boniato y feta").has("templada"),"«sobre cama» y «templada» son forma de cocinar, no ingrediente");
}

// --- día de descanso: el hidrato se lee de la RECETA ---
{
	const d=(p)=>info("alex",4,"Comida",p);
	ok(d("Pizza con base de coliflor").hid==="no"&&d("Lasaña de calabacín").hid==="no","pizza de coliflor y lasaña de calabacín: sin hidrato denso (ni masa ni placas)");
	const pk=d("Poke de salmón");
	ok(pk.hid==="aviso"&&/sin arroz, pasta, patata ni pan/.test(pk.txt)&&pk.rac==="200 g","poke de salmón: su ración y sin el arroz");
	ok(d("Paella de pollo y verduras").rac==="200 g","paella de pollo: ración de proteína, no «plato normal»");
	ok(d("Tostada integral de aguacate y huevo").hid==="aviso"&&/huevo/.test(d("Tostada integral de aguacate y huevo").rac),"tostada con huevo: aviso (1–2 rebanadas de pan) y ración en huevos");
	ok(d("Judías verdes con patata").hid==="aviso"&&!/sobre todo hidrato/.test(d("Judías verdes con patata").txt),"judías verdes con patata: sin la patata, no «cámbialo»");
	ok(/sobre todo hidrato/.test(d("Espaguetis integrales con tomate").txt||""),"la pasta sola sigue siendo «sobre todo hidrato»");
	ok(A.EsDenso("Salmorejo")===false,"el pan del salmorejo es del propio plan (lo pone en días de descanso)");
	// after a workout, a dish that brings its own carb needs none bought
	const w=semanaVacia("2026-10-05"); ponPlato(w,2,"Cena","Poke de salmón");
	ok(info("alex",2,"Cena","Poke de salmón").hid==="incluido"&&!A.PlanHidratosCompra().some(x=>/Alex · mié/.test(x)),"poke tras el entreno de Alex: ya trae su hidrato, no se compra patata");
}

// --- varios ---
{
	// the header by position when both parts start with the same word
	const w=semanaVacia("2026-10-05"); ponPlato(w,0,"Comida","Judías verdes con patata · Judías verdes salteadas con pollo");
	ok(/^1\.º ×[\d,]+ · 2\.º ×[\d,]+$/.test(A.EscalaTxt("Judías verdes con patata · Judías verdes salteadas con pollo")),"cabecera «1.º ×2 · 2.º ×1» si las dos partes empiezan igual: "+A.EscalaTxt("Judías verdes con patata · Judías verdes salteadas con pollo"));
	// the Sunday note: the roast eaten by anyone at home
	const w2=semanaVacia("2026-10-05");
	w2.days[6].slots.Comida.nosotros={dish:"",invId:null,away:true};
	["noah","iria"].forEach(id=>{ w2.days[6].slots.Comida[id]={dish:"Pollo asado con verduras asadas y patata",invId:null,away:false}; });
	ponPlato(w2,6,"Cena","Ensalada César ligera con pollo");
	ok(/Aprovecha el pollo/.test(A.PlanComidaTxt(A.PlanPerfil("alex"),6,"Cena",A.CurWeek().days[6])),"si el asado lo comen los niños, la cena de los adultos también aprovecha las sobras");
	// and "keep the leftovers for dinner" only when someone dines at home
	const w3=semanaVacia("2026-10-05"); ponPlato(w3,6,"Comida","Pollo asado con verduras asadas y patata");
	const nota=()=>A.PlanComidaTxt(A.PlanPerfil("alex"),6,"Comida",A.CurWeek().days[6]);
	ok(/Guarda el pollo/.test(nota()),"con cena en casa, «Guarda el pollo que sobre para la cena»");
	A.state.members.forEach(m=>{ w3.days[6].slots.Cena[m.id]={dish:"",invId:null,away:true}; });
	ok(!/Guarda el pollo/.test(nota()),"con todos fuera esa noche, sin esa nota");
	// looking back at last week's list does not untick this week's
	A.state=A.SeedState(); A.RefreshCatalog(); A.GoToThisWeek();
	const hoy=A.state.current; A.state.shopWeek=hoy; A.state.produce.forEach(p=>p.done=true);
	A.state.current=A.AddDays(hoy,-7);
	ok(A.ResetWeeklyTicks()===0&&A.state.produce.every(p=>p.done)&&A.state.shopWeek===hoy,"abrir la compra de la semana pasada no destacha la de esta");
	A.state.current=A.AddDays(hoy,7);
	ok(A.ResetWeeklyTicks()>0&&A.state.shopWeek===A.state.current,"la semana que viene sí empieza limpia");
}

// --- 🎲 y «Deshacer» solo deshacen lo que puso la tirada ---
{
	semanaVacia("2026-10-05"); A.state.inventory.frigo=[]; A.state.inventory.conge=[];
	A.Surprise();
	A.state.members.forEach(m=>{ A.CurWeek().days[1].slots.Cena[m.id]={dish:"Pizza con base de coliflor",invId:null,away:false}; });
	A.CurWeek().bought={}; A.ToggleBought(A.Norm("1 cebolla"));
	A.SurpriseAgain();
	ok(A.CurWeek().days[1].slots.Cena.nosotros.dish==="Pizza con base de coliflor"&&A.IsBought("1 cebolla"),"🎲 no borra lo que pusiste a mano después de tirar, ni lo tachado");
	// and what you change AFTER this roll survives «Deshacer» too
	A.state.members.forEach(m=>{ A.CurWeek().days[2].slots.Cena[m.id]={dish:"Tortilla de patatas",invId:null,away:false}; });
	A.ToggleBought(A.Norm("2 limones"));
	const llenos=A.CountPlanned().done;
	A.UndoSurprise();
	const W=A.CurWeek();
	ok(W.days[1].slots.Cena.nosotros.dish==="Pizza con base de coliflor"&&W.days[2].slots.Cena.nosotros.dish==="Tortilla de patatas"&&A.CountPlanned().done<llenos&&A.IsBought("1 cebolla")&&A.IsBought("2 limones"),
		"«Deshacer» quita lo de la tirada y deja lo tuyo (también lo cambiado después)");
}

// --- cole + adultos fuera a mediodía: nadie come esa comida, no se rellena ni se cuenta ---
{
	const w=semanaVacia("2026-10-05"); A.state.plan.ninosCole=true; A.state.inventory.frigo=[]; A.state.inventory.conge=[];
	w.days[0].slots.Comida.nosotros={dish:"",invId:null,away:true};
	// the toast must count the meals really planned (it said 14 with 13)
	let aviso=""; const _ta=ToastAction; ToastAction=(m)=>{ aviso=m; };
	try{ A.Surprise(); }finally{ ToastAction=_ta; }
	const reales=A.CurWeek().days.reduce((n,d)=>n+["Comida","Cena"].filter(s=>A.state.members.some(m=>d.slots[s][m.id].dish)).length,0);
	ok(new RegExp(": "+reales+" comidas").test(aviso),"el aviso cuenta las comidas de verdad ("+aviso+" / "+reales+")");
	const c=A.CurWeek().days[0].slots.Comida;
	ok(A.state.members.every(m=>!c[m.id].dish&&c[m.id].away),"el lunes a mediodía (adultos fuera, niños en el cole) queda vacío y todos «fuera»");
	ok(A.CurWeek().days[1].slots.Comida.nosotros.dish&&A.CurWeek().days[1].slots.Comida.noah.away,"el martes sí: comen los adultos y los niños en el cole");
	A.state.plan.ninosCole=false;
}

// ============ 1.18.0: cuarta ronda (revisor final de la tercera) ============
// --- recetas propias: el hidrato con medidas de casa ---
{
	A.state=A.SeedState(); A.RefreshCatalog();
	const propias=[["Arroz de la abuela","Arroz y cereales","Ingredientes (2 raciones): 1 taza de arroz, 1 pimiento.\n\n1. x"],
		["Pasta al pesto casera","Pasta","Ingredientes (2 raciones): 200 gr de pasta, albahaca.\n\n1. x"],
		["Espaguetis de la casa","Otros","Ingredientes (2 raciones): spaghetti, tomate.\n\n1. x"],
		["Pizza del viernes","Verduras","Ingredientes (2 raciones): 1 base de pizza, tomate, mozzarella.\n\n1. x"],
		["Fusilli con tomate","Pasta","Ingredientes (2 raciones): 200 g de fusilli, tomate.\n\n1. x"]];
	A.state.userDishes=propias.map(([n,t,r])=>({name:n,course:"cena",tipo:t,receta:r}));
	A.RefreshCatalog();
	const no=propias.filter(([n])=>!A.EsDenso(n)).map(([n])=>n);
	ok(no.length===0,"«1 taza de arroz», «200 gr de pasta», «spaghetti», «1 base de pizza» y una pasta sin nombrar son hidrato"+(no.length?" — "+no.join(", "):""));
	// and "gr" are grams for the trace rule too: a few noodles in a soup for four are not a carb serving
	A.state.userDishes.push({name:"Caldo con fideos",course:"cena",tipo:"Sopas y cremas",receta:"Ingredientes (4 raciones): 40 gr de fideos finos, 1 l de caldo.\n\n1. x"});
	A.RefreshCatalog();
	ok(A.EsDenso("Caldo con fideos")===false,"«40 gr de fideos» para 4 es una traza, no un plato de hidrato");
	A.state=A.SeedState(); A.RefreshCatalog();
}

// --- etiquetas: se compara la etiqueta ENTERA, y según lo que la sigue ---
{
	const C=[["Salsa de soja: 2 cucharadas","2 cucharadas de salsa de soja"],["Caldo de pollo: 500 ml","500 ml de caldo de pollo"],["Caldo: 1 litro","1 litro de caldo"],
		["Especias: comino","comino"],["Verduras: 1 calabacín","1 calabacín"],["Hummus: 1 tarrina","1 tarrina de hummus"],["Garbanzos: 1 bote (400 g)","1 bote de garbanzos (400 g)"],
		["Base de pizza: 1","1 base de pizza"],["Mezcla de especias: 1 cdta","1 cdta de mezcla de especias"],["Relleno: 3 huevos","3 huevos"],["Masa: 1 lámina de hojaldre","1 lámina de hojaldre"],
		["Proteína: 200 g de pollo","200 g de pollo"],["Ingredientes para la salsa: 2 tomates","2 tomates"],["Limón: 2","2 limones"],["Tiempo total: 30 min",""],["Raciones: 4",""],
		["Temperatura del horno: 200 ºC",""],["Cebolla: 1 grande","Cebolla: 1 grande"],["Aceite de oliva: un chorrito","Aceite de oliva: un chorrito"],
		["puré: 2 patatas","2 patatas"],["Pan: 4 rebanadas","4 rebanadas de pan"]];
	const mal=C.filter(([x,e])=>A.SinRotulo(x)!==e);
	ok(mal.length===0,"etiquetas de recetas propias"+(mal.length?" — "+mal.map(([x])=>x+" → «"+A.SinRotulo(x)+"»").join(" | "):""));
	ok(A.IngShortName("Cebolla: 1 grande")==="Cebolla"&&A.IngShortName("1 bote de garbanzos (400 g)")==="Garbanzos"&&A.IngShortName("1 tarrina de hummus")==="Hummus","«Ya está en casa» nombra el producto («Cebolla», «Garbanzos», «Hummus»)");
}

// --- cantidades: rangos, millares, tiempos y lo que ya iba en plural ---
{
	const P=[["4/5 tomates",2,"8/10 tomates"],["2/3 dientes de ajo",2,"4/6 dientes de ajo"],["y 1 más",2,"y 2 más"],["(o 2 si son grandes)",2,"(o 4 si son grandes)"],
		["2 cafés",2,"4 cafés"],["(o 1 huevo)",2,"(o 2 huevos)"],["1.000 g de harina",2,"2000 g de harina"],["cocer 10-12 min",2,"cocer 10-12 min"],["asar 180-200 °C",2,"asar 180-200 °C"],
		["harina 00",2,"harina 00"],["5 g de levadura",1.5,"7,5 g de levadura"],["1 1/2 taza de arroz",2,"3 tazas de arroz"],["1 hora y 30 min",2,"1 hora y 30 min"],["1/2 kg de tomate",2,"1 kg de tomate"],
		["1,5 kg de patatas",1.5,"2¼ kg de patatas"],["patatas (1 kg)",2,"patatas (2 kg)"],["harina (1 cdta)",2,"harina (2 cdta)"]];
	const mal=P.filter(([x,f,e])=>A.ScaleQty(x,f)!==e);
	ok(mal.length===0,"rangos, millares, tiempos y plurales ya puestos"+(mal.length?" — "+mal.map(([x,f])=>x+" ×"+f+" → "+A.ScaleQty(x,f)).join(" | "):""));
}

// --- una copia manipulada no toca Object.prototype; un plan que no es un plan no borra el tuyo ---
{
	A.state=A.SeedState(); A.RefreshCatalog();
	const mala=JSON.parse('{"plan":{"entrenos":{"__proto__":{"3":"tarde"}},"noches":{"__proto__":[3]},"at":{"e:__proto__:3":"2030-01-01T00:00:00.000Z","n:__proto__:3":"2030-01-01T00:00:00.000Z"}}}');
	let err=null; try{ A.MergePlan(A.state,mala); }catch(e){ err=e; }
	ok(!err&&({})[3]===undefined&&A.EntrenoDe("alex",3)===null,"una copia con «__proto__» como persona no contamina nada");
	A.state.plan.entrenos.alex={"4":"tarde"}; A.state.plan.at={"e:alex:4":"2026-09-28T10:00:00.000Z"};
	const rem=A.SeedState(); delete rem.catalog; rem.plan="basura"; rem.updatedAt="2026-09-28T11:00:00.000Z";
	A.AdoptRemote({state:rem},{quiet:true});
	ok(A.EntrenoDe("alex",4)==="tarde","adoptar una copia cuyo plan no es un plan conserva el tuyo");
	A.state=A.SeedState(); A.RefreshCatalog();
}

// --- «Deshacer» desde otra semana; 🎲 no toca la semana que no ves ---
{
	const wA=semanaVacia("2026-10-05"); A.state.inventory.frigo=[]; A.state.inventory.conge=[];
	A.Surprise(); const llenas=A.CountPlanned().done;
	A.state.current="2026-10-12"; A.EnsureWeek("2026-10-12");
	A.UndoSurprise();
	A.state.current="2026-10-05";
	ok(llenas>0&&A.CountPlanned().done<llenas,"«Deshacer» deshace la tirada aunque estés viendo otra semana");
	semanaVacia("2026-10-05"); A.Surprise(); const tA=JSON.stringify(A.state.weeks["2026-10-05"].days);
	A.state.current="2026-10-12"; const wB=A.EnsureWeek("2026-10-12");
	A.state.members.forEach(m=>wB.days.forEach(d=>{ d.slots.Comida[m.id]={dish:"",invId:null,away:false}; d.slots.Cena[m.id]={dish:"",invId:null,away:false}; }));
	A.SurpriseAgain();
	ok(JSON.stringify(A.state.weeks["2026-10-05"].days)===tA&&A.CountPlanned().done>0,"🎲 en otra semana tira esa y deja la anterior como estaba");
}

// --- mirar la compra de una semana lejana no congela el destachado semanal ---
{
	A.state=A.SeedState(); A.RefreshCatalog(); A.GoToThisWeek();
	const hoy=A.state.current;
	A.state.shopWeek=A.AddDays(hoy,56); A.state.produce.forEach(p=>p.done=true);
	ok(A.ResetWeeklyTicks()>0&&A.state.shopWeek===hoy,"tras mirar la semana de dentro de 8, la de hoy vuelve a ser la de la compra");
}

// --- varios: posición con 3 partes; azul ya puesto dentro de un compuesto ---
{
	const w=semanaVacia("2026-10-05");
	const tres="Judías verdes con patata · Plato sin receta de prueba · Judías verdes salteadas con pollo";
	ponPlato(w,0,"Comida",tres);
	ok(/^1\.º ×[\d,]+ · 3\.º ×[\d,]+$/.test(A.EscalaTxt(tres)),"con 3 partes, la posición cuenta todas: "+A.EscalaTxt(tres));
	let bien=0;
	for(let it=0; it<20; it++){
		const w2=semanaVacia("2026-07-13"); A.state.inventory.frigo=[]; A.state.inventory.conge=[];
		ponPlato(w2,2,"Comida","Ensalada empedrada · Pollo a la plancha con espárragos y champiñones");
		A.Surprise(); if(A.PlanCumplimiento().azul===2) bien++;
	}
	ok(bien===20,"un azul puesto a mano dentro de un plato compuesto cuenta para los 2 de la semana ("+bien+"/20)");
}

// --- privacidad (decisión del usuario, 2026-09-28): el repo es PÚBLICO; del plan personal
// no se publican ni la suplementación ni el objetivo corporal ---
{
	A.state=A.SeedState(); A.RefreshCatalog(); A.GoToThisWeek();
	ok(!("objetivo" in A.PLAN_VIVE)&&A.PLAN_VIVE.perfiles.every(p=>!("suplementos" in p)),"el plan del código no lleva suplementación ni objetivo corporal");
	const txt=A.RenderPlan()+A.PLAN_VIVE.perfiles.map(pf=>A.PlanPersonaDiaHtml(pf,0,A.CurWeek().days[0])).join("");
	ok(!/suplement|objetivo:/i.test(txt),"ni la pestaña Plan ni el plan del día los muestran");
}


console.log(`\n${pass} passed, ${fail} failed`);
if(fail>0) process.exit(1);
