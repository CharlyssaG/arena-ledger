(function(){
const $=s=>document.querySelector(s);const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
let S=null,cfg=null,shown=0,busy=false,auto=false,timer=null,pending=null,disp=[],cur=null,txt='';
const POS={horn:[170,125],meadow:[62,72],forest:[170,38],swamp:[285,75],lake:[278,165],ruins:[170,214],cliffs:[58,172]};
const LET=v=>v<.8?'Gentle':v<1.1?'Standard':v<1.4?'Harsh':'Brutal';const HAZ=v=>v===0?'Off':v<1?'Rare':v<1.5?'Normal':'Frequent';
const FLAGS=()=>({carnage:+$('#s-car').value,sponsors:+$('#s-spons').value,hazards:+$('#s-haz').value,closing:$('#s-close').checked,alliances:$('#s-ally').checked,districtWin:$('#s-dist').checked});
function saveRoster(){try{localStorage.setItem('hg-roster',$('#roster-in').value);}catch(e){}}
function loadRoster(){try{return localStorage.getItem('hg-roster');}catch(e){return null;}}
function twistsOn(){return $('#q-on').checked?HG.TWISTS.filter(t=>$('#q-'+t.id).checked).map(t=>t.id):[];}
function upCount(){const r=HG.parseRoster($('#roster-in').value);const w=HG.WARN.slice();$('#count').textContent=r.length+' tributes · '+Math.ceil(r.length/2)+' districts';
 $('#warns').innerHTML=w.slice(0,8).map(x=>'<li>'+esc(x)+'</li>').join('')+(w.length>8?'<li>and '+(w.length-8)+' more.</li>':'');
 $('#v-car').textContent=LET(+$('#s-car').value);$('#v-haz').textContent=HAZ(+$('#s-haz').value);$('#v-spons').textContent=['Off','Scarce','Normal','Generous','Lavish'][Math.round(+$('#s-spons').value*2)];
 const n=twistsOn().length;$('#sum').textContent=r.length+' tributes · '+(arena?arena.name:'')+' · '+LET(+$('#s-car').value)+' lethality'+(n?' · '+n+' Quell twist'+(n>1?'s':''):'');}
function rollSeed(){$('#s-seed').value=Math.floor(Math.random()*900000)+100000;}
let arena=null;const clone=o=>JSON.parse(JSON.stringify(o));
function normArena(a){const base=HG.ARENAS.classic;const o=clone(a);o.name=o.name||'Custom Arena';o.zones=o.zones||{};Object.keys(HG.SLOTS).forEach(z=>{const d=Object.assign({},base.zones[z],o.zones[z]||{});['water','food','cover'].forEach(k=>d[k]=HG.clamp(+d[k]||0,0,1));d.foods=Array.isArray(d.foods)?d.foods.map(String):[];d.flav=Array.isArray(d.flav)?d.flav.map(String):[];d.name=String(d.name||'the Unnamed Ground');d.short=String(d.short||d.name);o.zones[z]=d;});
 o.hazards=Array.isArray(o.hazards)?o.hazards.filter(h=>h&&Array.isArray(h.z)&&Array.isArray(h.ann)&&h.ann.length).map(h=>({z:h.z.filter(z=>HG.SLOTS[z]),sev:HG.clamp(+h.sev||7,3,10),hurt:String(h.hurt||'an injury'),ann:h.ann.map(String),esc:String(h.esc||'{n} got clear.'),die:String(h.die||'{n} did not.'),fog:!!h.fog})):[];
 o.close=Array.isArray(o.close)?o.close.filter(z=>HG.SLOTS[z]&&z!=='horn'):base.close.slice();return o;}
function setArena(a){arena=normArena(a);arena.closeIdx={};arena.close.forEach((z,i)=>arena.closeIdx[z]=i+1);$('#a-name').value=arena.name;$('#a-haz').value=HG.hazardsToText(arena.hazards);$('#a-warn').innerHTML='';buildZones();prevMap();upCount();}
function arenaOut(){const a=clone(arena);a.name=$('#a-name').value.trim()||'Custom Arena';a.close=Object.keys(HG.SLOTS).filter(z=>z!=='horn'&&arena.closeIdx[z]>0).sort((x,y)=>arena.closeIdx[x]-arena.closeIdx[y]);delete a.closeIdx;return a;}
function buildZones(){$('#zones').innerHTML=Object.keys(HG.SLOTS).map(z=>{const d=arena.zones[z];const ix=arena.closeIdx[z]||0;const id=f=>'z-'+z+'-'+f;
 return '<div class="zed" data-z="'+z+'"><div class="lbl">'+HG.SLOTS[z]+'</div><input type="text" id="'+id('name')+'" data-f="name" aria-label="Full name, like the Pinewood" value="'+esc(d.name)+'"><input type="text" id="'+id('short')+'" data-f="short" aria-label="Short name for the map" value="'+esc(d.short)+'">'
 +['water','food','cover'].map(k=>'<label class="rg" for="'+id(k)+'"><span>'+k+'</span><input type="range" min="0" max="10" id="'+id(k)+'" data-f="'+k+'" value="'+Math.round(d[k]*10)+'"><span>'+Math.round(d[k]*10)+'</span></label>').join('')
 +'<input type="text" id="'+id('foods')+'" data-f="foods" aria-label="Foods found here, comma separated" placeholder="Foods, comma separated" value="'+esc(d.foods.join(', '))+'"><textarea id="'+id('flav')+'" data-f="flav" aria-label="Atmosphere lines, one per line" placeholder="Atmosphere lines, one per line">'+esc(d.flav.join('\n'))+'</textarea>'
 +'<div class="row2"><label><input type="checkbox" id="'+id('dirty')+'" data-f="dirty"'+(d.dirty?' checked':'')+'> Unsafe water</label>'+(z==='horn'?'':'<label for="'+id('close')+'">Closes <input type="number" id="'+id('close')+'" data-f="close" min="0" max="6" value="'+ix+'"></label>')+'</div></div>';}).join('');}
function mapSvg(cnt,closed,prev){let svg='<svg viewBox="0 0 340 268" role="img" aria-label="Arena map">';const seen={};
 Object.keys(HG.ZONES).forEach(z=>HG.ZONES[z].adj.forEach(a=>{const k=[z,a].sort().join();if(seen[k])return;seen[k]=1;svg+='<line class="edge" x1="'+POS[z][0]+'" y1="'+POS[z][1]+'" x2="'+POS[a][0]+'" y2="'+POS[a][1]+'"/>';}));
 Object.keys(POS).forEach(z=>{const n=(cnt[z]||[]).length;const lab=prev?(z==='horn'?'start':(arena.closeIdx[z]>0?'#'+arena.closeIdx[z]:'safe')):(closed.has(z)?'X':n);
  svg+='<g><title>'+esc(HG.ZONES[z].short+': '+((cnt[z]||[]).join(', ')||'empty'))+'</title><circle class="zn'+(closed.has(z)?' closed':'')+'" cx="'+POS[z][0]+'" cy="'+POS[z][1]+'" r="30"/><text class="zc" style="font-size:'+(prev?14:20)+'px" x="'+POS[z][0]+'" y="'+(POS[z][1]+5)+'">'+lab+'</text><text class="zt" x="'+POS[z][0]+'" y="'+(POS[z][1]+46)+'">'+esc(HG.ZONES[z].short)+'</text></g>';});return svg+'</svg>';}
function prevMap(){HG.applyArena(arenaOut());$('#amap').innerHTML=mapSvg({},new Set(),true);}
function mkDisp(){const first={};S.T.forEach(t=>first[t.first]=(first[t.first]||0)+1);const TT=/^(lord|lady|principal|professor|dr\.?|mr\.?|mrs\.?|ms\.?|captain|aunt|uncle|sir|king|queen|prince|princess|grams|the|man|mermaid|barnacle|flying|old|realistic|prince|general|colonel|major|professor|queen)$/i;disp=S.T.map(t=>first[t.first]>1||TT.test(t.first)?t.name:t.first);}
function chip(id){const t=S.T[id];const dead=cur&&cur.dead.has(id);return '<button type="button" class="nm'+(dead?' dead':'')+'" data-id="'+id+'" title="'+esc(t.name)+', District '+t.district+'"><b>'+t.district+'</b>'+esc(disp[id])+'</button>';}
function fmt(s){return esc(s).replace(/\[\[(\d+)\]\]/g,(m,i)=>chip(+i));}
function plain(s){return s.replace(/\[\[(\d+)\]\]/g,(m,i)=>S.T[+i].name);}
function begin(c,k){cfg=c;const roster=HG.parseRoster(c.txt);S=new HG.Sim(roster,Object.assign({seed:c.seed,arena:c.arena,twists:c.twists},c.flags));mkDisp();cur={dead:new Set()};shown=0;$('#feed').innerHTML='';screen('arena');auto=false;$('#b-auto').setAttribute('aria-pressed','false');$('#b-auto').textContent='Auto-play';
 document.querySelector('.top .sub').textContent=c.twists.length?c.edition:'A Hunger Games simulator';
 renderSide(S.T.map(t=>({id:t.id,alive:true,hp:100,zone:'horn',kills:0,inj:[],items:[],ally:null,fed:85,hyd:85,sanity:80})),new Set());$('#ph-t').textContent='The Reaping';$('#ph-s').textContent=S.T.length+' tributes';
 if(c.twists.length){const q=document.createElement('div');q.className='quell';q.innerHTML='<div class="lbl">By order of the Capitol</div><h3>'+esc(c.edition)+'</h3>'+c.twists.map(id=>{const t=HG.TWISTS.find(x=>x.id===id);return '<p><b>'+esc(t.name)+'</b>'+esc(t.read)+'</p>';}).join('');$('#feed').appendChild(q);}
 const pre=document.createElement('div');pre.className='ev gm';pre.textContent='The tributes rose into the arena on their plates. '+S.T.length+' of them, from '+Math.ceil(S.T.length/2)+' districts. This year the arena is '+(c.arena.name)+', and it begins at '+HG.ZONES.horn.name+'. The seed is '+c.seed+'.';$('#feed').appendChild(pre);$('#feed').appendChild(trainCard());
 const sp=+$('#s-spd').value;if(k){$('#s-spd').value='0';for(let i=0;i<k&&!S.over;i++)step(true);$('#s-spd').value=String(sp);}updBtns();}
function trainCard(){const d=document.createElement('section');d.className='train';const b=S.training;
 d.innerHTML='<h3>Training scores</h3><div class="sub">The Gamemakers have scored every tribute from 1 to 12. The Capitol has already placed its bets.</div><div class="trow h"><span>#</span><span>Tribute</span><span style="text-align:center">Score</span><span>Odds</span><span>Sponsors</span></div>'
  +b.map(r=>'<div class="trow"><span class="rk">'+r.rank+'</span><span>'+chip(r.id)+'</span><span class="sc'+(r.score>=9?' hi':r.score<=4?' lo':'')+'">'+r.score+'</span><span class="od">'+r.odds+' to 1</span><span class="tr">'+r.tier+'</span><span class="nt">'+esc(r.note)+' Patron: '+esc(r.patron)+', '+r.fund+' marks.</span></div>').join('');return d;}
function sponsorCard(sec,rec){if(!rec.board||!rec.board.length||!S.o.sponsors)return;if(rec.phase!=='night'&&!rec.gifts.length)return;const d=document.createElement('div');d.className='sboard';const mx=Math.max(1,rec.board[0].fund);
 d.innerHTML='<h3>Sponsor ledger</h3>'+(rec.gifts.length?rec.gifts.map(g=>'<div class="g">'+chip(g.id)+' received a '+esc(g.item)+' <i>from '+esc(g.patron)+', '+g.cost+' marks</i></div>').join(''):'<div class="g"><i>No parachutes this phase.</i></div>')
  +(rec.phase==='night'?'<div class="g" style="margin-top:6px;color:var(--dim);font:500 11px var(--mono);letter-spacing:.1em;text-transform:uppercase">Most backed</div>'+rec.board.map(r=>'<div class="bar2"><span>'+chip(r.id)+'</span><span class="b"><i style="width:'+Math.round(r.fund/mx*100)+'%"></i></span><span>'+r.fund+'</span></div>').join(''):'');sec.appendChild(d);}
function updBtns(){$('#b-next').disabled=busy||S.over;$('#b-next').textContent=S.over?'Games over':S.n===0?'Open the Bloodbath':'Next phase';}
function step(instant){if(busy||!S||S.over)return;const rec=S.next();shown++;reveal(rec,instant);}
function reveal(rec,instant){const sec=document.createElement('section');sec.className='phase '+rec.phase;
 const numTxt=rec.phase==='bloodbath'?'00':String(rec.day).padStart(2,'0');
 sec.innerHTML='<div class="pband '+(rec.phase==='night'?'night':'')+'"><span class="num">'+numTxt+'</span><span class="t">'+esc(rec.title)+'</span><span class="al">'+rec.alive+' alive</span></div>';
 $('#feed').appendChild(sec);$('#ph-t').textContent=rec.title;$('#ph-s').textContent=rec.alive+' remaining';busy=true;updBtns();let i=0;const sp=+$('#s-spd').value;
 const mode=$('#s-view').value;const dg=HG.digest(S,rec);let det=null;const dEl=()=>{const x=document.createElement('div');x.className='digest';x.innerHTML='<div class="hl">'+esc(dg.hl)+'</div><p>'+fmt(dg.text)+'</p>';return x;};
 const fin=()=>{pending=null;if(mode==='both')sec.appendChild(dEl());cannonCard(sec,rec);sponsorCard(sec,rec);if(det)sec.appendChild(det);renderSide(rec.snap,new Set(S.closed));busy=false;if(S.over)victor(sec);else if(auto&&!instant)timer=setTimeout(()=>step(),1100);updBtns();window.claude&&0;};
 const one=()=>{if(i>=rec.events.length){fin();return;}const e=rec.events[i++];const d=document.createElement('div');d.className='ev '+e.type;
  e.dead.forEach(id=>cur.dead.add(id));let h=fmt(e.text);if(e.dead.length)h+='<span class="tag">cannon</span>';d.innerHTML=h;sec.appendChild(d);
  e.dead.forEach(id=>document.querySelectorAll('.nm[data-id="'+id+'"]').forEach(n=>n.classList.add('dead')));
  if(sp>0&&!instant)d.scrollIntoView({block:'center',behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'auto':'smooth'});
  if(sp===0||instant)one();else timer=setTimeout(one,sp*(e.type==='death'?1.7:e.type==='gm'?1.3:1));};
 pending={flush:()=>{clearTimeout(timer);const sp0=sp;while(i<rec.events.length){const e=rec.events[i++];const d=document.createElement('div');d.className='ev '+e.type;e.dead.forEach(id=>cur.dead.add(id));d.innerHTML=fmt(e.text)+(e.dead.length?'<span class="tag">cannon</span>':'');sec.appendChild(d);e.dead.forEach(id=>document.querySelectorAll('.nm[data-id="'+id+'"]').forEach(n=>n.classList.add('dead')));}fin();}};
 if(mode==='sum'){rec.events.forEach(e=>e.dead.forEach(id=>cur.dead.add(id)));sec.appendChild(dEl());det=document.createElement('details');det.className='full';det.innerHTML='<summary>Play-by-play ('+rec.events.length+(rec.events.length===1?' event':' events')+')</summary>'+rec.events.map(e=>'<div class="ev '+e.type+'">'+fmt(e.text)+(e.dead.length?'<span class="tag">cannon</span>':'')+'</div>').join('');fin();if(!instant)sec.scrollIntoView({block:'start',behavior:'auto'});return;}
 one();}
function cannonCard(sec,rec){const d=document.createElement('div');if(!rec.cannons.length){d.className='quiet';d.textContent=rec.phase==='bloodbath'?'Somehow, no cannons sounded.':'The sky stayed silent. No cannons.';sec.appendChild(d);return;}
 d.className='cannon';const n=rec.cannons.length;d.innerHTML='<h3>'+n+' cannon'+(n>1?'s':'')+'</h3><ul>'+rec.cannons.map(id=>{const t=S.T[id];const how=t.killer!=null?'felled by '+chip(t.killer)+', '+esc(t.cause):esc(t.cause||'unknown causes');return '<li>'+chip(id)+' <i>District '+t.district+' · '+how+'</i></li>';}).join('')+'</ul>';sec.appendChild(d);d.scrollIntoView({block:'nearest',behavior:'auto'});}
function victor(sec){const vs=S.victors&&S.victors.length?S.victors:(S.victor?[S.victor]:[]);const v=vs[0];const d=document.createElement('div');d.className='victor';
 const order=[];S.phases.forEach(p=>p.cannons.forEach(id=>order.push([id,p.title])));
 const lead=S.T.slice().sort((a,b)=>b.kills.length-a.kills.length).filter(t=>t.kills.length>0).slice(0,3);const many=vs.length>1;
 d.innerHTML=v?'<div class="k">The '+(many?'victors':'victor')+' of the games</div><h2>'+esc(vs.map(x=>x.name).join(' & '))+'</h2><div class="k">District '+v.district+'</div><div class="stats"><div><b>'+vs.reduce((a,x)=>a+x.kills.length,0)+'</b><span>kills</span></div><div><b>'+S.day+'</b><span>days</span></div><div><b>'+vs.reduce((a,x)=>a+Math.round(x.hp),0)+'</b><span>health left</span></div><div><b>'+vs.reduce((a,x)=>a+x.inj.length,0)+'</b><span>wounds</span></div><div><b>'+v.score+'</b><span>training score</span></div><div><b>'+vs.reduce((a,x)=>a+x.gifts.length,0)+'</b><span>gifts</span></div></div><p class="note">'+(many?'They walked out of the arena together.':esc(v.first)+', once '+esc(v.bg)+', walked out of the arena alone.')+'</p>':'<h2>No victor</h2>';
 d.innerHTML+='<div class="brief"><h3>The Games in brief</h3>'+HG.finalDigest(S).map(x=>'<p><span class="lb">'+esc(x[0])+'</span>'+fmt(x[1])+'</p>').join('')+'</div><div class="ledger"><div class="lbl" style="margin-bottom:6px">Order of the fallen</div>'+order.map((o,i)=>'<p>'+(i+1)+'. '+chip(o[0])+' <i style="color:var(--dim)">'+esc(o[1])+' · scored '+S.T[o[0]].score+'</i></p>').join('')+'</div>'
  +(lead.length?'<p style="margin-top:14px">Most kills: '+lead.map(t=>chip(t.id)+' ('+t.kills.length+')').join(', ')+'.</p>':'')
  +'<div class="btns" style="justify-content:center;margin-top:16px"><button class="btn pri" id="v-new" type="button">New seed, same setup</button><button class="btn" id="v-same" type="button">Replay this seed</button><button class="btn" id="v-edit" type="button">Edit setup</button></div>';
 sec.appendChild(d);$('#v-new').onclick=()=>{rollSeed();go(+$('#s-seed').value);};$('#v-same').onclick=()=>go(cfg.seed);$('#v-edit').onclick=toSetup;d.scrollIntoView({block:'start',behavior:'auto'});}
function renderSide(snap,closed){const alive=snap.filter(s=>s.alive).length;$('#r-h').textContent='Tributes · '+alive+' of '+snap.length+' alive';
 $('#roster').innerHTML=snap.map(s=>{const t=S.T[s.id];const c=s.hp>60?'var(--moss)':s.hp>30?'var(--amber)':'var(--blood)';
  return '<button type="button" class="tc'+(s.alive?'':' dead')+'" data-id="'+s.id+'"><span class="n">'+esc(disp[s.id])+'</span><span class="m"><span>D'+t.district+'</span><span>'+(s.alive?HG.ZONES[s.zone].short:'fallen')+'</span><span>'+(s.kills?'x'+s.kills:'')+'</span></span><span class="hp"><i style="width:'+(s.alive?s.hp:0)+'%;background:'+c+'"></i></span></button>';}).join('');
 const cnt={};snap.forEach(x=>{if(x.alive)(cnt[x.zone]=cnt[x.zone]||[]).push(disp[x.id]);});$('#map').innerHTML=mapSvg(cnt,closed,false);}
function drawer(id){const t=S.T[id];const s=(S.phases.length?S.phases[S.phases.length-1].snap:null)||null;const st=s?s.find(x=>x.id===id):null;if(!busy||true){}
 const bar=(l,v)=>'<div class="st"><span>'+l+'</span><span class="b"><i style="width:'+v*10+'%"></i></span><span>'+v+'</span></div>';
 const al=S.T.filter(x=>x!==t&&t.ally!=null&&x.ally===t.ally&&x.alive).map(x=>chip(x.id));const gr=Object.keys(t.grudge).filter(k=>t.grudge[k]>0&&S.T[k].alive).map(k=>chip(+k));
 $('#dr').innerHTML='<button class="btn" id="dx" type="button" style="float:right">Close</button><h3>'+esc(t.name)+'</h3><div class="sb">District '+t.district+' · '+t.trait+' · formerly '+esc(t.bg)+'</div>'+bar('STR',t.str)+bar('SPD',t.spd)+bar('SMT',t.smt)+bar('STL',t.stl)+bar('SOC',t.soc)
  +'<h4>Standing</h4><p>Training score '+t.score+' (ranked '+t.rank+' of '+S.T.length+') · patron '+esc(t.patron)+' · '+(st&&st.fund!=null?st.fund:t.fund)+' marks in the fund'+(t.gifts.length?' · gifts: '+esc(t.gifts.join(', ')):'')+'</p><h4>Condition</h4><p>'+(t.alive?(st?('Health '+st.hp+' · fed '+st.fed+' · water '+st.hyd+' · nerve '+st.sanity+' · at '+esc(HG.ZONES[st.zone].short)):'Fresh on the plate'):'Fallen on '+(t.deathDay===0?'the Bloodbath':'day '+t.deathDay)+': '+esc(t.cause||'')+(t.killer!=null?' (by '+esc(disp[t.killer])+')':''))+'</p>'
  +'<h4>Carrying</h4><p>'+(t.items.length?esc(t.items.map(i=>i.n).join(', ')):'Nothing')+'</p><h4>Wounds</h4><p>'+(t.inj.length?esc(t.inj.map(i=>i.name).join(', ')):'None')+'</p>'
  +'<h4>Allies</h4><p>'+(al.length?al.join(', '):'Alone')+'</p><h4>Grudges</h4><p>'+(gr.length?gr.join(', '):'None')+'</p><h4>Kills</h4><p>'+(t.kills.length?t.kills.map(chip).join(', '):'None')+'</p>';
 $('#drawer').hidden=false;$('#dx').onclick=()=>$('#drawer').hidden=true;$('#dx').focus();}
function summaryText(){let o='ARENA LEDGER, THE GAMES IN BRIEF (seed '+cfg.seed+')\n\nTRAINING SCORES\n'+S.training.slice(0,6).map(r=>r.rank+'. '+S.T[r.id].name+' - '+r.score).join('\n')+'\n\n';S.phases.slice(0,shown).forEach(p=>{const d=HG.digest(S,p);o+=p.title.toUpperCase()+': '+d.hl+'\n'+plain(d.text)+'\n\n';});if(S.over)o+='THE GAMES IN BRIEF\n'+HG.finalDigest(S).map(x=>x[0]+': '+plain(x[1])).join('\n')+'\n';return o;}
function recapText(){let o='ARENA LEDGER (seed '+cfg.seed+')\n\nTRAINING SCORES\n'+S.training.map(r=>r.rank+'. '+S.T[r.id].name+' - '+r.score+' ('+r.odds+' to 1)').join('\n')+'\n\n';S.phases.slice(0,shown).forEach(p=>{o+=p.title.toUpperCase()+'\n';p.events.forEach(e=>o+='- '+plain(e.text)+'\n');if(p.cannons.length)o+='CANNONS: '+p.cannons.map(id=>S.T[id].name).join(', ')+'\n';o+='\n';});if(S.over&&S.victor)o+='VICTOR: '+S.victor.name+' (District '+S.victor.district+')\n';return o;}
function go(seed){begin({txt:$('#roster-in').value,seed,flags:FLAGS(),arena:arenaOut(),twists:twistsOn(),edition:$('#q-ed').value.trim()||'The Quarter Quell'},0);}
function toSetup(){clearTimeout(timer);busy=false;auto=false;screen(backTo);document.querySelector('.top .sub').textContent='A Hunger Games simulator';window.scrollTo(0,0);}
function tab(p){['trib','arena','rules'].forEach(x=>{$('#pane-'+x).hidden=x!==p;$('#t-'+x).setAttribute('aria-selected',x===p?'true':'false');});if(p==='arena')prevMap();}
function copyText(t,btn,label){let ok=false;try{navigator.clipboard.writeText(t).then(()=>{if(btn){btn.textContent='Copied';setTimeout(()=>btn.textContent=label,1400);}},()=>fb(t));ok=true;}catch(e){}if(!ok)fb(t);}
function fb(t){$('#dr').innerHTML='<button class="btn" id="dx" type="button" style="float:right">Close</button><h3>Copy this</h3><p class="note">Select all and copy.</p><textarea style="min-height:60vh" readonly>'+esc(t)+'</textarea>';$('#drawer').hidden=false;$('#dx').onclick=()=>$('#drawer').hidden=true;}
let backTo='home';const SCREENS=['home','gallery','ready','setup','arena'];function screen(n){SCREENS.forEach(s=>{const e=document.getElementById(s);if(e)e.hidden=s!==n;});window.scrollTo(0,0);}
function start(data){const cf=data&&data.cfg;$('#roster-in').value=(cf&&cf.txt)||loadRoster()||HG.DEFAULT_ROSTER;rollSeed();
 $('#a-pre').innerHTML=Object.keys(HG.ARENAS).map(k=>'<option value="'+k+'">'+esc(HG.ARENAS[k].name)+'</option>').join('')+'<option value="custom">Custom</option>';
 $('#q-list').innerHTML=HG.TWISTS.map(t=>'<label class="twist" for="q-'+t.id+'"><input type="checkbox" id="q-'+t.id+'"><b>'+esc(t.name)+'</b><span>'+esc(t.desc)+'</span></label>').join('');
 setArena(cf&&cf.arena?cf.arena:HG.ARENAS.classic);$('#a-pre').value=cf&&cf.arena?'custom':'classic';
 if(cf){$('#s-seed').value=cf.seed;const f=cf.flags;$('#s-car').value=f.carnage;if(f.sponsors!=null)$('#s-spons').value=f.sponsors;$('#s-haz').value=f.hazards;$('#s-close').checked=f.closing;$('#s-ally').checked=f.alliances;$('#s-dist').checked=!!f.districtWin;$('#q-ed').value=cf.edition||'The Quarter Quell';if(cf.twists&&cf.twists.length){$('#q-on').checked=true;$('#q-box').classList.remove('dim');cf.twists.forEach(id=>{const e=$('#q-'+id);if(e)e.checked=true;});}}
 upCount();
 document.querySelectorAll('.tab').forEach(b=>b.onclick=()=>tab(b.dataset.p));
 $('#roster-in').oninput=()=>{upCount();saveRoster();};$('#s-car').oninput=$('#s-haz').oninput=$('#s-spons').oninput=upCount;$('#s-close').onchange=$('#s-ally').onchange=$('#s-dist').onchange=upCount;
 $('#b-sample').onclick=()=>{$('#roster-in').value=HG.DEFAULT_ROSTER;upCount();saveRoster();};
 $('#b-tpl').onclick=()=>{$('#roster-in').value=HG.CSV_TEMPLATE;upCount();saveRoster();};$('#b-tplc').onclick=()=>copyText(HG.CSV_TEMPLATE,$('#b-tplc'),'Copy template');
 $('#b-shuf').onclick=()=>{const l=$('#roster-in').value.split('\n').filter(x=>x.trim());const h=/^\s*name\b/i.test(l[0]||'')&&l[0].includes(',')||/\t/.test(l[0]||'')&&/name/i.test(l[0]);const hd=h?l.shift():null;for(let i=l.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[l[i],l[j]]=[l[j],l[i]];}$('#roster-in').value=(hd?[hd]:[]).concat(l).join('\n');upCount();saveRoster();};
 $('#b-seed').onclick=rollSeed;
 $('#a-pre').onchange=()=>{const v=$('#a-pre').value;if(v!=='custom')setArena(HG.ARENAS[v]);};
 $('#a-name').oninput=()=>{arena.name=$('#a-name').value;$('#a-pre').value='custom';upCount();};
 $('#zones').addEventListener('input',e=>{const el=e.target;const box=el.closest('.zed');if(!box)return;const z=box.dataset.z,f=el.dataset.f,d=arena.zones[z];
  if(f==='water'||f==='food'||f==='cover'){d[f]=+el.value/10;el.nextElementSibling.textContent=el.value;}else if(f==='foods')d.foods=el.value.split(',').map(x=>x.trim()).filter(Boolean);else if(f==='flav')d.flav=el.value.split('\n').map(x=>x.trim()).filter(Boolean);
  else if(f==='dirty')d.dirty=el.checked;else if(f==='close')arena.closeIdx[z]=Math.max(0,Math.min(6,+el.value||0));else d[f]=el.value;$('#a-pre').value='custom';prevMap();});
 $('#a-haz').oninput=()=>{const r=HG.parseHazardLines($('#a-haz').value);$('#a-warn').innerHTML=r.warn.map(x=>'<li>'+esc(x)+'</li>').join('');if(!r.warn.length){arena.hazards=r.list;$('#a-pre').value='custom';}};
 $('#a-copy').onclick=()=>copyText(JSON.stringify(arenaOut(),null,1),$('#a-copy'),'Copy arena as JSON');
 $('#a-load').onclick=()=>{try{const o=JSON.parse($('#a-json').value);if(!o||typeof o!=='object'||!o.zones)throw new Error('Needs a zones object.');setArena(o);$('#a-pre').value='custom';}catch(e){$('#a-warn').innerHTML='<li>Could not load: '+esc(e.message)+'</li>';}};
 $('#q-on').onchange=()=>{$('#q-box').classList.toggle('dim',!$('#q-on').checked);upCount();};document.getElementById('q-list').addEventListener('change',upCount);
 $('#q-roll').onclick=()=>{$('#q-on').checked=true;$('#q-box').classList.remove('dim');HG.TWISTS.forEach(t=>$('#q-'+t.id).checked=false);$('#q-'+HG.pick(HG.TWISTS).id).checked=true;upCount();};
 $('#q-clear').onclick=()=>{HG.TWISTS.forEach(t=>$('#q-'+t.id).checked=false);upCount();};
 $('#b-start').onclick=()=>{const r=HG.parseRoster($('#roster-in').value);const e=$('#err');if(r.length<4){e.textContent='Add at least 4 tributes.';tab('trib');return;}if(r.length>48){e.textContent='The arena holds 48 tributes at most.';tab('trib');return;}
  const hz=HG.parseHazardLines($('#a-haz').value);if(hz.warn.length){e.textContent='Fix the hazard lines first.';tab('arena');return;}e.textContent='';go(+$('#s-seed').value||1);};
 $('#b-next').onclick=()=>step();$('#b-auto').onclick=()=>{auto=!auto;$('#b-auto').setAttribute('aria-pressed',auto);$('#b-auto').textContent=auto?'Pause':'Auto-play';if(auto&&!busy)step();else if(!auto)clearTimeout(timer);};
 $('#b-skip').onclick=()=>{if(pending)pending.flush();};$('#b-new').onclick=toSetup;
 $('#b-copys').onclick=()=>copyText(summaryText(),$('#b-copys'),'Copy summary');$('#b-copy').onclick=()=>copyText(recapText(),$('#b-copy'),'Copy recap');
 document.addEventListener('click',e=>{const n=e.target.closest('.nm,.tc');if(n&&S&&n.dataset.id!==undefined)drawer(+n.dataset.id);else if(e.target===$('#drawer'))$('#drawer').hidden=true;});
 document.addEventListener('keydown',e=>{if(e.key==='Escape')$('#drawer').hidden=true;});
 /* ---- presets, share links, community library, themes, display prefs ---- */
 const SBU='https://vxahxkphkavemduanhxs.supabase.co/rest/v1/rpc/',SBK='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ4YWh4a3Boa2F2ZW1kdWFuaHhzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTUzMTAyNTYsImV4cCI6MjExMDg4NjI1Nn0.e5-Y0XNgvGXScJMgDXEKQVM52MnY4y61uSa1_wV3Pk4';
 async function rpc(fn,args){const r=await fetch(SBU+fn,{method:'POST',headers:{apikey:SBK,Authorization:'Bearer '+SBK,'Content-Type':'application/json'},body:JSON.stringify(args||{})});const t=await r.text();let j=null;try{j=t?JSON.parse(t):null;}catch(e){}if(!r.ok)throw new Error((j&&j.message)||'Request failed ('+r.status+')');return j;}
 const msg=(id,t,bad)=>{const m=$('#'+id);if(!m)return;m.textContent=t||'';m.classList.toggle('bad',!!bad);};
 const store={get(k){try{return localStorage.getItem(k);}catch(e){return null;}},set(k,v){try{localStorage.setItem(k,v);}catch(e){}}};
 /* display prefs */
 const ZS=[1,1.22,1.45];let zi=+store.get('al-zoom')||0;if(!(zi>=0&&zi<=2))zi=0;let plain=store.get('al-plain')==='1';let curTheme=null;
 function applyZoom(){document.querySelector('.wrap').style.zoom=ZS[zi]===1?'':ZS[zi];$('#f-plus').disabled=zi>=2;$('#f-minus').disabled=zi<=0;store.set('al-zoom',zi);}
 function paintTheme(){const r=document.documentElement.style;const t=plain?null:curTheme;const set=(k,v)=>v?r.setProperty(k,v):r.removeProperty(k);set('--ink',t&&t.bg);set('--panel',t&&t.panel);set('--panel2',t&&t.panel2);set('--line',t&&t.line);set('--brass',t&&t.accent);set('--amber',t&&t.accent2);
  const b=$('#f-col');b.textContent=plain?'Colors: plain':'Colors: themed';b.setAttribute('aria-pressed',plain?'true':'false');}
 function applyTheme(t){curTheme=t||null;paintTheme();}
 $('#f-plus').onclick=()=>{if(zi<2){zi++;applyZoom();}};$('#f-minus').onclick=()=>{if(zi>0){zi--;applyZoom();}};
 $('#f-col').onclick=()=>{plain=!plain;store.set('al-plain',plain?'1':'0');paintTheme();};applyZoom();paintTheme();
 /* config snapshot/apply */
 function snap(){return{csv:$('#roster-in').value,arena:arenaOut(),flags:FLAGS(),twists:twistsOn(),edition:$('#q-ed').value.trim()||'The Quarter Quell',seed:+$('#s-seed').value||1};}
 function applyCfg(p,keepSeed){if(!p||typeof p.csv!=='string'||!p.arena||typeof p.arena!=='object')throw new Error('That setup is not valid.');
  const f=p.flags||{};const num=(v,a,b,d)=>{v=+v;return isFinite(v)?Math.max(a,Math.min(b,v)):d;};
  $('#roster-in').value=p.csv.slice(0,150000);saveRoster();setArena(p.arena);$('#a-pre').value='custom';
  $('#s-car').value=num(f.carnage,.6,1.6,1);$('#s-spons').value=num(f.sponsors,0,2,1);$('#s-haz').value=num(f.hazards,0,2,1);$('#s-close').checked=f.closing!==false;$('#s-ally').checked=f.alliances!==false;$('#s-dist').checked=!!f.districtWin;
  $('#q-ed').value=String(p.edition||'The Quarter Quell').slice(0,60);HG.TWISTS.forEach(t=>$('#q-'+t.id).checked=false);const tw=Array.isArray(p.twists)?p.twists:[];tw.forEach(id=>{const e=$('#q-'+id);if(e)e.checked=true;});$('#q-on').checked=tw.length>0;$('#q-box').classList.toggle('dim',!tw.length);
  if(!keepSeed&&p.seed)$('#s-seed').value=num(p.seed,1,999999999,1);upCount();}
 /* navigation */
 document.querySelectorAll('[data-go]').forEach(b=>b.onclick=()=>{const g=b.dataset.go;if(g==='home')applyTheme(null);screen(g);});
 $('#c-pre').onclick=()=>{applyTheme(null);screen('gallery');};
 $('#c-cus').onclick=()=>{applyTheme(null);backTo='setup';$('#su-h').textContent='Build a custom game';screen('setup');tab('trib');};
 /* gallery */
 const PR=window.PRESETS||[];let curPre=null;
 const cnt=p=>{const r=HG.parseRoster(p.csv);return r.length+' tributes · '+Math.ceil(r.length/2)+' districts';};
 (function buildGal(){const cats=[];PR.forEach(p=>{if(cats.indexOf(p.cat)<0)cats.push(p.cat);});
  $('#gal').innerHTML=cats.map(c=>'<h3 class="gh">'+esc(c)+'</h3><div class="gal">'+PR.filter(p=>p.cat===c).map(p=>'<button type="button" class="pcard" data-id="'+esc(p.id)+'" style="--ca:'+p.theme.accent+';--cp:'+p.theme.panel+';--cb:'+p.theme.accent2+'"><b>'+esc(p.name)+'</b><span>'+esc(p.blurb)+'</span><div class="pm">'+esc(cnt(p))+'</div></button>').join('')+'</div>').join('');})();
 $('#gal').addEventListener('click',e=>{const b=e.target.closest('.pcard');if(!b)return;const p=PR.find(x=>x.id===b.dataset.id);if(!p)return;curPre=p;applyCfg(Object.assign({},p,{seed:p.seeds&&p.seeds[0]?p.seeds[0][0]:undefined}));applyTheme(p.theme);openReady({name:p.name,blurb:p.blurb,seeds:p.seeds,edition:p.edition,twists:p.twists,meta:cnt(p)},'gallery');});
 /* ready screen */
 function openReady(o,backTarget){$('#rd-name').textContent=o.name;$('#rd-blurb').textContent=o.blurb||'';
  const tn=(o.twists||[]).map(id=>{const t=HG.TWISTS.find(x=>x.id===id);return t?t.name:id;});
  $('#rd-meta').textContent=[o.meta||cnt({csv:$('#roster-in').value}),o.edition&&tn.length?o.edition+' ('+tn.join(', ')+')':''].filter(Boolean).join(' · ');
  $('#rd-seeds').innerHTML=(o.seeds||[]).map(s=>'<button type="button" class="seedbtn" data-s="'+(+s[0])+'"><b>'+esc(s[1])+'</b><span>Seed '+(+s[0])+'</span></button>').join('');
  $('#rd-seeds').previousElementSibling.textContent=(o.seeds&&o.seeds.length)?'Pick a game (each seed is a different, repeatable story)':'Run a game';
  $('#rd-back').dataset.go=backTarget;$('#rd-back').textContent=backTarget==='gallery'?'← All presets':'← Back';msg('rd-msg','');backTo='ready';screen('ready');}
 function runSeed(seed){const r=HG.parseRoster($('#roster-in').value);if(r.length<4||r.length>48){msg('rd-msg','This setup needs 4 to 48 tributes. Use Customize to fix it.',1);return;}$('#s-seed').value=seed;upCount();$('#b-start').click();backTo='ready';}
 $('#rd-seeds').addEventListener('click',e=>{const b=e.target.closest('.seedbtn');if(b)runSeed(+b.dataset.s);});
 $('#rd-rand').onclick=()=>{rollSeed();runSeed(+$('#s-seed').value);};
 $('#rd-cus').onclick=()=>{$('#su-h').textContent='Customize';backTo='setup';screen('setup');tab('trib');};
 async function share(id,btn){btn.disabled=true;msg(id,'Making a link…');try{const code=await rpc('create_share',{p_payload:snap()});const u=location.origin+location.pathname+'?g='+code;msg(id,'Link copied: '+u);copyText(u,null,'');}catch(e){msg(id,'Could not make a link: '+e.message,1);}btn.disabled=false;}
 $('#rd-share').onclick=()=>share('rd-msg',$('#rd-share'));$('#p-share').onclick=()=>share('p-msg',$('#p-share'));
 /* community */
 function openDr(h){$('#dr').innerHTML='<button class="btn" id="dx" type="button" style="float:right">Close</button>'+h;$('#drawer').hidden=false;$('#dx').onclick=()=>$('#drawer').hidden=true;}
 $('#p-pub').onclick=()=>{const r=HG.parseRoster($('#roster-in').value);if(r.length<4||r.length>48){msg('p-msg','Add 4 to 48 tributes first.',1);return;}
  openDr('<h3>Publish as a community preset</h3><p class="note">This adds your current roster, arena and rules to the public list. Anyone can load it. Use made-up or fictional characters, not private people. There is no editing or deleting after publishing.</p><label class="lbl" for="pu-n">Name</label><input id="pu-n" type="text" maxlength="60" class="fld"><label class="lbl" for="pu-b" style="margin-top:10px;display:block">One-line description</label><input id="pu-b" type="text" maxlength="240" class="fld"><label class="lbl" for="pu-a" style="margin-top:10px;display:block">Your name (optional)</label><input id="pu-a" type="text" maxlength="40" class="fld"><div class="btns" style="margin-top:14px"><button class="btn pri" id="pu-go" type="button">Publish</button><span class="note" id="pu-m"></span></div>');
  $('#pu-go').onclick=async()=>{const n=$('#pu-n').value.trim();if(n.length<2){$('#pu-m').textContent='Give it a name.';return;}$('#pu-go').disabled=true;$('#pu-m').textContent='Publishing…';try{await rpc('publish_preset',{p_name:n,p_blurb:$('#pu-b').value,p_author:$('#pu-a').value,p_payload:snap()});$('#drawer').hidden=true;msg('p-msg','Published. It now appears in Community presets.');}catch(e){$('#pu-m').textContent='Could not publish: '+e.message;$('#pu-go').disabled=false;}};};
 $('#c-comm').onclick=async()=>{openDr('<h3>Community presets</h3><p class="note">Loading…</p>');try{const L=await rpc('list_presets');
  const h=L&&L.length?L.map(x=>'<div class="cp"><div><b>'+esc(x.name)+'</b>'+(x.author?' <span class="note">by '+esc(x.author)+'</span>':'')+'<div class="note" style="margin:2px 0 0">'+esc(x.blurb||'')+'</div></div><div class="btns"><button class="btn pri" type="button" data-l="'+(+x.id)+'" data-n="'+esc(x.name)+'" data-b="'+esc(x.blurb||'')+'">Load</button><button class="btn" type="button" data-r="'+(+x.id)+'" title="Report this preset">Report</button></div></div>').join(''):'<p class="note">Nothing here yet. Publish the first one from the custom builder.</p>';
  openDr('<h3>Community presets</h3>'+h);$('#dr').onclick=async e=>{const l=e.target.closest('[data-l]'),r=e.target.closest('[data-r]');if(l){try{const p=await rpc('get_preset',{p_id:+l.dataset.l});if(!p)throw new Error('This preset is no longer available.');applyCfg(p);applyTheme(null);$('#drawer').hidden=true;openReady({name:l.dataset.n,blurb:l.dataset.b,seeds:[[+$('#s-seed').value,'Run this setup']],edition:p.edition,twists:p.twists},'home');}catch(x){msg('h-msg','Could not load it: '+x.message,1);$('#drawer').hidden=true;}}
   else if(r){try{await rpc('report_preset',{p_id:+r.dataset.r});r.textContent='Reported';r.disabled=true;}catch(x){}}};}catch(e){openDr('<h3>Community presets</h3><p class="note bad">Could not load the list: '+esc(e.message)+'</p>');}};
 /* share links */
 (async()=>{const q=new URLSearchParams(location.search);const g=q.get('g');if(g&&/^[a-f0-9]{10}$/.test(g)){msg('h-msg','Loading shared setup…');try{const p=await rpc('get_share',{p_code:g});if(!p)throw new Error('That link has expired or does not exist.');applyCfg(p);msg('h-msg','');openReady({name:'Shared setup',blurb:'Someone shared this setup with you.',seeds:[[+$('#s-seed').value,'Run with the shared seed']],edition:p.edition,twists:p.twists},'home');}catch(e){msg('h-msg','Could not load that link: '+e.message,1);}}})();
 if(window.claude&&window.claude.hot&&window.claude.hot.snapshot)window.claude.hot.snapshot(()=>({cfg:cfg,k:shown}));
 if(cf&&data.k>0)begin(cf,data.k);}
const hot=window.claude&&window.claude.hot;if(hot&&hot.ready)hot.ready(start);else start((hot&&hot.data)||{});
})();
