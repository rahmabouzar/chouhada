const AM=["جانفي","فيفري","مارس","أفريل","ماي","جوان","جويلية","أوت","سبتمبر","أكتوبر","نوفمبر","ديسمبر"];
const fmt=d=>{const[y,m,j]=d.split("-");return +j+" "+AM[m-1]+" 19"+y};
const norm=s=>(s||"").toString().toLowerCase().normalize("NFD")
 .replace(/[\u0300-\u036f\u064b-\u065f\u0670\u0640]/g,"")
 .replace(/[أإآٱ]/g,"ا").replace(/ى/g,"ي").replace(/ة/g,"ه")
 .replace(/[’'`\-]/g,"").replace(/\s+/g," ").trim();
const bare=t=>t.length>3&&t.startsWith("ال")?t.slice(2):t;
const toks=s=>norm(s).split(" ").filter(Boolean).map(bare);
const names=d=>[d.fa,d.fl,...d.alt];
const matchName=(d,q)=>{const k=norm(q);if(!k)return false;const kb=bare(k);
 return names(d).some(n=>norm(n)===k||toks(n).includes(kb))};
const initial=n=>(toks(n)[0]||"")[0];
const matchLetter=(d,L)=>names(d).some(n=>initial(n)===norm(L));

const AR="ابتثجحخدذرزسشصضطظعغفقكلمنهوي".split(""),FR="ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const $=id=>document.getElementById(id),grid=$("grid"),status=$("status"),q=$("q"),lw=$("letters");
let lang="ar",active="";
const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));

function render(list,msg){
 status.textContent=msg;
 if(!list.length){grid.innerHTML='<div class="empty">لا توجد نتائج في قاعدة البيانات الحالية. جرّب كتابة الاسم بطريقة أخرى (مثل Mostefa أو Mustapha) أو اختر حرفًا.</div>';return}
 grid.innerHTML=list.map(d=>{
  const a=encodeURIComponent((d.fa+" "+d.la).trim()+" الثورة التحريرية الجزائرية"),f=encodeURIComponent(d.fl+" "+d.ll+" guerre d’Algérie");
  return `<article class="card"><h3>${esc((d.fa+" "+d.la).trim())}</h3>
  <p class="fr">${esc(d.fl+" "+d.ll)}</p>${d.s?'<span class="badge">طالب/ة</span>':""}
  ${d.y?`<div class="meta">${esc(d.y)}</div>`:""}${d.bio?`<p class="bio">${esc(d.bio)}</p>`:""}
  <div class="links"><a target="_blank" rel="noopener" href="https://www.google.com/search?q=${a}">ابحث عن سيرته</a>
  <a target="_blank" rel="noopener" href="https://www.google.com/search?q=${f}">Biographie</a></div></article>`}).join("")}

const showAll=()=>{q.value="";active="";mark();render(DATA,`${DATA.length} اسمًا في القاعدة — ابحث بالاسم أو اختر حرفًا`)};
function byName(){active="";mark();const v=q.value;if(!norm(v)){showAll();return}
 const r=DATA.filter(d=>matchName(d,v));
 render(r,r.length?`وُجد ${r.length} شهيد يحملون الاسم «${v.trim()}»`:`لا نتائج للاسم «${v.trim()}»`)}
function byLetter(L){q.value="";active=L;mark();const r=DATA.filter(d=>matchLetter(d,L));
 render(r,`${r.length} شهيد تبدأ أسماؤهم بالحرف «${L}»`)}
function mark(){lw.querySelectorAll("button").forEach(b=>b.setAttribute("aria-pressed",b.textContent===active))}
function buildLetters(){lw.innerHTML=(lang==="ar"?AR:FR).map(l=>{const n=DATA.filter(d=>matchLetter(d,l)).length;
 return `<button type="button" aria-pressed="false" ${n?"":"disabled"} title="${n?n+' اسم':'لا أسماء'}">${l}</button>`}).join("");
 lw.querySelectorAll("button:not(:disabled)").forEach(b=>b.onclick=()=>byLetter(b.textContent))}
function setLang(l){lang=l;$("tAr").setAttribute("aria-pressed",l==="ar");$("tFr").setAttribute("aria-pressed",l==="fr");active="";buildLetters()}

q.addEventListener("input",byName);$("goBtn").onclick=byName;$("allBtn").onclick=showAll;
q.addEventListener("keydown",e=>{if(e.key==="Enter")byName()});
$("tAr").onclick=()=>setLang("ar");$("tFr").onclick=()=>setLang("fr");
$("cnt").textContent=DATA.length;buildLetters();showAll();
