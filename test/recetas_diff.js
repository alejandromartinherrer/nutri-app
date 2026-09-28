// node test/recetas_diff.js [rev]   (rev por defecto: HEAD)
// Compara, entre el index.html de la copia de trabajo y el de <rev>, lo que la app
// hace con TODAS las RECETAS: las líneas de la compra (RecipeParts.items) y cada
// línea escalada ×1,5 / ×2 / ×3 (ScaleQty). Para revisar a ojo, línea a línea,
// cualquier cambio en RecipeParts, SinRotulo, ScaleQty o PluralFrase antes de darlo
// por bueno. No es un test: no falla, enseña.
const fs=require('fs'), path=require('path'), vm=require('vm'), cp=require('child_process');
function carga(html){
	const store={};
	const el=()=>({innerHTML:"",value:"",style:{},dataset:{},classList:{add(){},remove(){},contains(){return false},toggle(){}},
		focus(){},setAttribute(){},getAttribute(){return""},querySelector(){return null},querySelectorAll(){return[]},appendChild(){},addEventListener(){},removeEventListener(){}});
	const ctx={console,setTimeout,clearTimeout,setInterval:()=>0,Date,Math,JSON,Promise,Map,Set,Array,Object,String,Number,RegExp,Error,isFinite,parseFloat,parseInt,
		encodeURIComponent,decodeURIComponent,escape,unescape,TextEncoder,TextDecoder,
		btoa:s=>Buffer.from(s,'binary').toString('base64'),atob:s=>Buffer.from(s,'base64').toString('binary'),
		localStorage:{getItem:k=>k in store?store[k]:null,setItem:(k,v)=>{store[k]=String(v)},removeItem:k=>{delete store[k]}},
		document:{addEventListener(){},getElementById:el,createElement:()=>Object.assign(el(),{getContext:()=>({measureText:()=>({width:0})}),toDataURL:()=>""}),
			querySelector:el,activeElement:null,head:{appendChild(){}},body:{appendChild(){},removeChild(){},dataset:{},classList:{add(){},remove(){},contains(){return false}}},
			documentElement:{style:{setProperty(){},removeProperty(){}},classList:{add(){},remove(){},contains(){return false},toggle(){}},setAttribute(){},removeAttribute(){},dataset:{}}},
		navigator:{},URL:{createObjectURL(){return""},revokeObjectURL(){}},Blob:function(){},FileReader:function(){},
		window:{addEventListener(){},removeEventListener(){},innerHeight:812,scrollY:0,scrollTo(){}},getComputedStyle:()=>({getPropertyValue:()=>""}),
		fetch:async()=>{throw new Error("sin red")}};
	ctx.global=ctx; vm.createContext(ctx);
	const src=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m=>m[1]).sort((a,b)=>b.length-a.length)[0].replace("\"use strict\";","");
	vm.runInContext(src+"\n;global.__g=n=>eval(n);",ctx);
	return n=>ctx.__g(n);
}
const rev=process.argv[2]||"HEAD", raiz=path.join(__dirname,"..");
const NUEVO=carga(fs.readFileSync(path.join(raiz,"index.html"),"utf8"));
const VIEJO=carga(cp.execSync(`git -C "${raiz}" cat-file -p ${rev}:index.html`,{encoding:"utf8",maxBuffer:64*1024*1024}));
const R=NUEVO("RECETAS"), rpN=NUEVO("RecipeParts"), rpV=VIEJO("RecipeParts"), esN=NUEVO("ScaleQty"), esV=VIEJO("ScaleQty");
let items=0, lineas=0;
Object.keys(R).sort().forEach(k=>{
	const a=rpV(R[k]), b=rpN(R[k]);
	if(JSON.stringify(a&&a.items)!==JSON.stringify(b&&b.items)){ items++; console.log("COMPRA  "+k+"\n   antes: "+JSON.stringify(a&&a.items)+"\n   ahora: "+JSON.stringify(b&&b.items)); }
	(b?b.items:[]).forEach(x=>[1.5,2,3].forEach(f=>{ const o=esV(x,f), n=esN(x,f); if(o!==n){ lineas++; console.log("ESCALA  «"+x+"» ×"+f+"\n   antes: "+o+"\n   ahora: "+n); } }));
});
console.log(`\n${Object.keys(R).length} recetas · compra distinta en ${items} · líneas escaladas distintas: ${lineas} (frente a ${rev})`);
