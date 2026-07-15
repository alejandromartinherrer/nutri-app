// ---- minimal DOM/localStorage stubs ----
const store={};
global.localStorage={getItem:k=>k in store?store[k]:null,setItem:(k,v)=>{store[k]=v},removeItem:k=>{delete store[k]}};
function fakeEl(){return {innerHTML:"",value:"",href:"",style:{},classList:{add(){},remove(){}},focus(){},select(){},setSelectionRange(){},setAttribute(){},getAttribute(){return""},querySelector(){return null},querySelectorAll(){return[]},appendChild(){},set oninput(f){},set onchange(f){},set onclick(f){},onload:null,files:[],click(){}}}
global.document={addEventListener(){},getElementById(){return fakeEl()},createElement(tag){return tag==="canvas"?fakeCanvas():fakeEl()},querySelector(){return fakeEl()},activeElement:null,head:{appendChild(){}},documentElement:{style:{setProperty(){},removeProperty(){}}},body:{appendChild(){},removeChild(){}}};
global.navigator={};
global.URL={createObjectURL(){return"blob:"},revokeObjectURL(){}};
global.Blob=function(){};global.FileReader=function(){};
global.window={};
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
src+="\nglobal.__api={SeedState,Surprise,OpenPicker,ApplyDish,SetAway,ClearCell,DishesNeedingShopping,CountPlanned,MondayOf,AddDays,TodayISO,FmtLong,Ymd,escapeHtml,ValidState,BuildCatalog,RefreshCatalog,MacroIndex,SEP,APP_VERSION,SCHEMA_VERSION,STORE_KEY,LEGACY_STORE_KEY,ShowSheet,CloseSheet,Tokens,CurWeek,EnsureWeek,get state(){return state},set state(v){state=v},get picker(){return picker},CurThemeId,SetTheme,THEMES,SlotSummaryLines,RenderWeekCanvas,DishMacros,MealMacros,MemberWeekMacros,RenderMacros,RenderShoppingCanvas,OpenPicker,SaveComida,get picker(){return picker},set picker(v){picker=v},Load,Save,SaveQuiet,MigrateV1,ApplyTemplate,TemplateDish,DishRecipe,RECETAS,BuildSyncPayload,B64EncodeUtf8,B64DecodeUtf8,PickerCandidates,Norm,RenameDishInWeeks,RecipeParts,ScaleQty,IngredientesDe,Plantilla,DefaultPlantilla,CloudDirty,GH_BRANCH,GH_SYNC_PATH,DaysLeft,InvUrgent,PantryHas,PlannedCookDishes};\n";
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
ok(A.BuildCatalog().length===166,"BuildCatalog returns full SEED catalog");
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

console.log(`\n${pass} passed, ${fail} failed`);
if(fail>0) process.exit(1);
