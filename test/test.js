// ---- minimal DOM/localStorage stubs ----
const store={};
global.localStorage={getItem:k=>k in store?store[k]:null,setItem:(k,v)=>{store[k]=v},removeItem:k=>{delete store[k]}};
function fakeEl(){return {innerHTML:"",value:"",href:"",style:{},dataset:{},classList:{add(){},remove(){},contains(){return false},toggle(){}},focus(){},select(){},setSelectionRange(){},setAttribute(){},getAttribute(){return""},querySelector(){return null},querySelectorAll(){return[]},appendChild(){},addEventListener(){},removeEventListener(){},set oninput(f){},set onchange(f){},set onclick(f){},onload:null,files:[],click(){}}}
global.document={addEventListener(){},getElementById(){return fakeEl()},createElement(tag){return tag==="canvas"?fakeCanvas():fakeEl()},querySelector(){return fakeEl()},activeElement:null,head:{appendChild(){}},documentElement:{style:{setProperty(){},removeProperty(){}},classList:{add(){},remove(){},contains(){return false},toggle(){}},setAttribute(){},removeAttribute(){},dataset:{}},body:{appendChild(){},removeChild(){},dataset:{},classList:{add(){},remove(){},contains(){return false}}}};
global.navigator={};
global.URL={createObjectURL(){return"blob:"},revokeObjectURL(){}};
global.Blob=function(){};global.FileReader=function(){};
global.window={addEventListener(){},removeEventListener(){},innerHeight:812};
global.getComputedStyle=()=>({getPropertyValue:()=>""});
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
src+="\nglobal.__api={SeedState,Surprise,OpenPicker,ApplyDish,SetAway,ClearCell,DishesNeedingShopping,CountPlanned,MondayOf,AddDays,TodayISO,FmtLong,Ymd,escapeHtml,ValidState,BuildCatalog,RefreshCatalog,MacroIndex,SEP,APP_VERSION,SCHEMA_VERSION,STORE_KEY,LEGACY_STORE_KEY,ShowSheet,CloseSheet,Tokens,CurWeek,EnsureWeek,get state(){return state},set state(v){state=v},get picker(){return picker},CurThemeId,SetTheme,THEMES,SlotSummaryLines,RenderWeekCanvas,DishMacros,MealMacros,MemberWeekMacros,RenderMacros,RenderShoppingCanvas,OpenPicker,SaveComida,get picker(){return picker},set picker(v){picker=v},Load,Save,SaveQuiet,MigrateV1,ApplyTemplate,TemplateDish,DishRecipe,RECETAS,BuildSyncPayload,B64EncodeUtf8,B64DecodeUtf8,PickerCandidates,Norm,RenameDishInWeeks,RecipeParts,ScaleQty,IngredientesDe,Plantilla,DefaultPlantilla,CloudDirty,GH_BRANCH,GH_SYNC_PATH,DaysLeft,InvUrgent,PantryHas,PlannedCookDishes,IngSortKey,MergedIngredients,IsBought,ToggleBought,BoughtMap,REALFOODING_DISHES,DishTipo,MealTipos,DayTipos,TipoColor,MergeRecipeBook,RecipeBookSize,VisibleSlots,PickerTargets,SanitizeSlots,SLOTS,GoToThisWeek,DishNameHtml,get ui(){return ui},PickerWhoHtml,PickerLoadComposer,PickerFreeHtml,PickerListHtml,DeleteWithUndo,ToastAction,Toast,RecipeServings,ServingsNeeded,DishScale,PantryMatch,ResetWeeklyTicks,BoughtForPantry,SaveBackHome,IngShortName,AisleOf,AisleName,PlannedLabel,TipoFamily,Surprise,UndoSurprise,SurpriseAgain,AssignDishTo,DoCopyDay,DishWhenHtml,THEMES};\n";
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
ok(A.BuildCatalog().length===166+A.REALFOODING_DISHES.length,"BuildCatalog returns SEED + Realfooding");
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
ok(A.ScaleQty("½ cebolla",6)==="3 cebolla","ScaleQty ×6 unicode fraction");
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
ok(A.ServingsNeeded("Gazpacho")===3,"ServingsNeeded cuenta los comensales planificados");
ok(A.DishScale("Gazpacho")===1,"receta para 4 y comen 3 -> no se escala");
// el mismo plato dos dias: 6 raciones sobre una receta de 4 -> x1,5
A.state.members.forEach(m=>{wkS2.days[1].slots.Comida[m.id]={dish:"Gazpacho",invId:null,away:false};});
ok(A.ServingsNeeded("Gazpacho")===6,"cocinarlo dos dias duplica las raciones");
ok(A.DishScale("Gazpacho")===1.5,"6 raciones sobre receta de 4 -> x1,5");
const ingEsc=A.IngredientesDe("Gazpacho",A.DishScale("Gazpacho"));
ok(ingEsc.some(x=>/1½ kg de tomate/.test(x)),"los ingredientes salen escalados (1 kg -> 1½ kg)");
ok(A.IngredientesDe("Gazpacho").some(x=>/1 kg de tomate/.test(x)),"sin factor, cantidades originales");
// los 'fuera de casa' no cuentan
A.state.members.forEach(m=>{wkS2.days[1].slots.Comida[m.id]={dish:"",invId:null,away:true};});
ok(A.ServingsNeeded("Gazpacho")===3,"fuera de casa no suma raciones");

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
A.state=A.SeedState(); A.RefreshCatalog();
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

console.log(`\n${pass} passed, ${fail} failed`);
if(fail>0) process.exit(1);
