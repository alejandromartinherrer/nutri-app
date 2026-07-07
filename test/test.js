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
const HTML=path.join(__dirname,'..','planificador-comidas.html');
const html=fs.readFileSync(HTML,'utf8');
let src=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)]
	.map(m=>m[1]).sort((a,b)=>b.length-a.length)[0];
if(!src){console.error('No <script> block found in '+HTML);process.exit(1);}

// expose new symbols for coverage of this round
src=src.replace("\"use strict\";","");
src+="\nglobal.__api={SeedState,Surprise,OpenPicker,ApplyDish,SetAway,ClearCell,DishesNeedingShopping,CountPlanned,MondayOf,AddDays,TodayISO,FmtLong,Ymd,escapeHtml,ValidState,BuildCatalog,RefreshCatalog,MacroIndex,SEP,APP_VERSION,SCHEMA_VERSION,ShowSheet,CloseSheet,Tokens,CurWeek,EnsureWeek,get state(){return state},set state(v){state=v},get picker(){return picker},CurThemeId,SetTheme,THEMES,SlotSummaryLines,RenderWeekCanvas,DishMacros,MealMacros,MemberWeekMacros,RenderMacros,RenderShoppingCanvas,OpenPicker,SaveComida,get picker(){return picker},set picker(v){picker=v}};\n";
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
ok(A.escapeHtml('"&<>\'\')==="&quot;&amp;&lt;&gt;&#39;","escapeHtml full");
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

console.log(`\n${pass} passed, ${fail} failed`);
if(fail>0) process.exit(1);
