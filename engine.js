var HG = HG || {};
(function(HG){
let R = Math.random;
HG.seed = function(s){ let a = s>>>0; R = function(){ a|=0; a=a+0x6D2B79F5|0; let t=Math.imul(a^a>>>15,1|a); t=t+Math.imul(t^t>>>7,61|t)^t; return ((t^t>>>14)>>>0)/4294967296; }; };
HG.rand=()=>R();
HG.ri=(a,b)=>a+Math.floor(R()*(b-a+1));
HG.pick=a=>a[Math.floor(R()*a.length)];
HG.chance=p=>R()<p;
HG.clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
HG.shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(R()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;};
HG.wpick=(arr,wf)=>{let tot=0;const ws=arr.map(x=>{const w=Math.max(0,wf(x)||0);tot+=w;return w;});if(tot<=0)return null;let r=R()*tot;for(let i=0;i<arr.length;i++){r-=ws[i];if(r<=0)return arr[i];}return arr[arr.length-1];};

HG.ZONES={
 horn:{name:'the Cache',short:'Cache',water:.05,food:.1,cover:.1,adj:['meadow','forest','lake','ruins'],
  flav:['The brass horn threw long shadows across the trampled grass.','Wind moaned through the empty crates around the Cache.']},
 meadow:{name:'the Meadow',short:'Meadow',water:.2,food:.5,cover:.1,adj:['horn','forest','cliffs'],
  flav:['Tall grass hissed in the wind and hid nothing.','Bees drifted over the meadow, unbothered by any of it.']},
 forest:{name:'the Pinewood',short:'Pinewood',water:.35,food:.75,cover:.85,adj:['horn','meadow','swamp','lake'],
  flav:['Needles muffled every step in the Pinewood.','Something small and unseen kept rustling in the pines.']},
 lake:{name:'the Lake Shore',short:'Lake Shore',water:1,food:.5,cover:.35,adj:['horn','forest','ruins'],
  flav:['The lake lay flat and gray, throwing back the sky.','Reeds clicked together along the Lake Shore.']},
 swamp:{name:'the Bog',short:'Bog',water:.7,food:.3,cover:.65,adj:['forest','ruins'],
  flav:['Mist sat on the Bog like a held breath.','Every footstep in the Bog came with a wet, sucking sound.']},
 ruins:{name:'the Sunken Ruins',short:'Ruins',water:.4,food:.2,cover:.7,adj:['horn','lake','swamp','cliffs'],
  flav:['Half-drowned columns leaned over the Sunken Ruins.','Water dripped somewhere deep in the Ruins, steady as a metronome.']},
 cliffs:{name:'the Ashen Cliffs',short:'Cliffs',water:.1,food:.2,cover:.5,adj:['meadow','ruins'],
  flav:['Gray ash drifted off the Cliffs and settled on everything.','The Ashen Cliffs gave a view for miles, and gave the same view to everyone looking back.']}
};
HG.PRON={she:{s:'she',o:'her',p:'her',r:'herself'},he:{s:'he',o:'him',p:'his',r:'himself'},they:{s:'they',o:'them',p:'their',r:'themself'}};
HG.TRAITS={
 brave:{aggr:.6,mercy:.5,caut:.2,loy:.6,flair:.4},cunning:{aggr:.5,mercy:.3,caut:.7,loy:.3,flair:.2},
 kind:{aggr:.1,mercy:.9,caut:.5,loy:.8,flair:.3},ruthless:{aggr:.9,mercy:.05,caut:.4,loy:.2,flair:.5},
 paranoid:{aggr:.4,mercy:.3,caut:.9,loy:.1,flair:.1},steady:{aggr:.4,mercy:.6,caut:.6,loy:.7,flair:.1},
 reckless:{aggr:.8,mercy:.4,caut:.05,loy:.4,flair:.7},showy:{aggr:.5,mercy:.4,caut:.2,loy:.4,flair:.95}};
HG.BGS=['a baker’s apprentice','a ferry deckhand','a substitute teacher','a bee keeper','a dock welder','a night-shift nurse aide','a clock repairer','a seamstress','a hog farmer','a lighthouse keeper’s kid','a pastry chef','a chimney sweep','a courier','a street musician','a quarry hand','a net mender','a librarian’s assistant','a stable hand','a sign painter','a cannery worker','a glassblower','a tram conductor','a ratcatcher','a mill hand','a candle maker','a roofer','a puppeteer','a pickle merchant'];
HG.TICS=['counted the seconds between thunderclaps','hummed one tuneless note over and over','talked quietly to nobody','kept touching the same scar','tied and retied a bootlace','whispered a list of everyone back home','tapped a rhythm on every surface','chewed a blade of grass down to nothing','checked behind them every ten steps','traced sector numbers in the dirt','rationed out jokes the way others rationed water','smoothed the creases out of a torn map scrap'];
HG.ITEMS={
 knife:{n:'knife',kind:'weapon',cls:'blade',atk:3,lethal:.5},machete:{n:'machete',kind:'weapon',cls:'blade',atk:5,lethal:.7},
 sword:{n:'sword',kind:'weapon',cls:'blade',atk:6,lethal:.8},hatchet:{n:'hatchet',kind:'weapon',cls:'blunt',atk:4,lethal:.65},
 club:{n:'spiked club',kind:'weapon',cls:'blunt',atk:5,lethal:.7},stick:{n:'sharpened stick',kind:'weapon',cls:'pole',atk:2,lethal:.35},
 spear:{n:'spear',kind:'weapon',cls:'pole',atk:4,lethal:.7},trident:{n:'trident',kind:'weapon',cls:'pole',atk:5,lethal:.75},
 bow:{n:'bow',kind:'weapon',cls:'ranged',atk:5,lethal:.8,uses:6},sling:{n:'slingshot',kind:'weapon',cls:'ranged',atk:2,lethal:.3,uses:10},
 darts:{n:'set of throwing knives',kind:'weapon',cls:'ranged',atk:4,lethal:.7,uses:5},
 medkit:{n:'medkit',kind:'med',uses:2},herbs:{n:'bundle of healing herbs',kind:'med',uses:1},
 rations:{n:'ration pack',kind:'food',uses:2},bread:{n:'loaf of Syndicate bread',kind:'food',uses:2},
 waterskin:{n:'waterskin',kind:'water',uses:3},wire:{n:'coil of snare wire',kind:'tool',uses:2},
 tarp:{n:'waxed tarp',kind:'tool',uses:3},flint:{n:'fire striker',kind:'tool',uses:5},
 binocs:{n:'pair of binoculars',kind:'tool',uses:9},berries:{n:'vial of black-market toxin',kind:'poison',uses:1},
 vest:{n:'ballistic vest',kind:'armor',uses:3},serum:{n:'field serum',kind:'serum',uses:1},stims:{n:'combat stimulant',kind:'boost',uses:1}};
HG.item=function(id){const d=HG.ITEMS[id];return Object.assign({id},d,{uses:d.uses||1});};
HG.WEAPON_POOL=['knife','machete','sword','hatchet','club','spear','trident','bow','darts','sling'];
HG.DEFAULT_ROSTER=`Maren Holloway|she
Teodor Vance|he
Iris Calloway|she
Bram Okafor|he
Lucia Ferreira|she
Dex Lindqvist|they
Sable Quinn|she
Rowan Mbeki|he
Odessa Pike|she
Caspian Rhee|he
Juniper Tolliver|they
Anselm Park|he
Wren Castellanos|she
Hollis Dunmore|he
Nadia Brightwater|she
Cormac Ibarra|he
Marigold Sato|she
Fitch Halloran|he
Pilar Nakamura|she
Gideon Strand|he
Thea Lindgren|she
Ozzie Bellamy|they
Briar Ashgrove|she
Tobias Vell|he`;
HG.WARN=[];
const ALIAS={name:'name',pronouns:'pron',pronoun:'pron',pron:'pron',trait:'trait',personality:'trait',background:'bg',bg:'bg',former:'bg',district:'district',sector:'district',dist:'district',champion:'victor',veteran:'victor',str:'str',strength:'str',spd:'spd',speed:'spd',smt:'smt',smarts:'smt',smart:'smt',stl:'stl',stealth:'stl',soc:'soc',social:'soc',items:'items',item:'items',alliance:'ally',ally:'ally',group:'ally',victor:'victor',bio:'bio',notes:'bio',note:'bio',score:'score',training:'score',rating:'score',sponsors:'fund',sponsor:'fund',funds:'fund',fund:'fund',patron:'patron'};
HG.findItem=function(s){s=s.trim().toLowerCase();if(!s)return null;for(const k in HG.ITEMS){if(k===s||HG.ITEMS[k].n.toLowerCase()===s)return k;}for(const k in HG.ITEMS){if(HG.ITEMS[k].n.toLowerCase().includes(s)||s.includes(k))return k;}return null;};
function setField(o,key,val,row){val=(val||'').trim();if(!val)return;const k=ALIAS[key.toLowerCase().trim()];if(!k){HG.WARN.push('Row '+row+': unknown column "'+key+'".');return;}
 if(k==='pron'){const v=val.toLowerCase().replace(/[^a-z]/g,'');const m={she:'she',her:'she',female:'she',f:'she',he:'he',him:'he',male:'he',m:'he',they:'they',them:'they',nb:'they'}[v];if(m)o.pron=m;else HG.WARN.push('Row '+row+': pronouns "'+val+'" not recognized, rolled instead.');}
 else if(k==='trait'){const v=val.toLowerCase();if(HG.TRAITS[v])o.trait=v;else HG.WARN.push('Row '+row+': trait "'+val+'" not recognized, rolled instead.');}
 else if(['str','spd','smt','stl','soc'].includes(k)){const n=parseInt(val,10);if(n>=1&&n<=10)o[k]=n;else HG.WARN.push('Row '+row+': '+k.toUpperCase()+' must be 1 to 10.');}
 else if(k==='district'){const n=parseInt(val,10);if(n>=1&&n<=99)o.district=n;else HG.WARN.push('Row '+row+': sector must be a number.');}
 else if(k==='items'){o.items=[];val.split(/[;,]/).forEach(x=>{if(!x.trim())return;const id=HG.findItem(x);if(id)o.items.push(id);else HG.WARN.push('Row '+row+': unknown item "'+x.trim()+'".');});}
 else if(k==='score'){const n=parseInt(val,10);if(n>=1&&n<=12)o.score=n;else HG.WARN.push('Row '+row+': score must be 1 to 12.');}
 else if(k==='fund'){const n=parseInt(val.replace(/[^0-9]/g,''),10);if(n>=0)o.fund=n;else HG.WARN.push('Row '+row+': sponsors must be a number.');}
 else if(k==='patron'){o.patron=val;}
 else if(k==='victor'){o.victor=/^(y|yes|true|1|x|victor|champion)/i.test(val);}
 else o[k]=val;}
function splitRow(line,d){const out=[];let cur='',q=false;for(let i=0;i<line.length;i++){const c=line[i];if(q){if(c==='"'){if(line[i+1]==='"'){cur+='"';i++;}else q=false;}else cur+=c;}else if(c==='"')q=true;else if(c===d){out.push(cur);cur='';}else cur+=c;}out.push(cur);return out;}
HG.parseRoster=function(txt){HG.WARN=[];const lines=txt.split('\n').map(l=>l.replace(/\r$/,'')).filter(l=>l.trim());if(!lines.length)return [];
 const d=lines[0].includes('\t')?'\t':',';const head=splitRow(lines[0],d).map(x=>x.trim().toLowerCase());const csv=head.includes('name')&&head.length>1;const res=[];
 if(csv){lines.slice(1).forEach((l,i)=>{const c=splitRow(l,d);const o={};head.forEach((h,j)=>{if(h==='name')o.name=(c[j]||'').trim();else if(h)setField(o,h,c[j],i+1);});if(o.name)res.push(o);});}
 else lines.forEach((l,i)=>{const p=l.split('|').map(x=>x.trim());const o={name:p[0]};p.slice(1).forEach(x=>{if(!x)return;x.split(/\s+(?=[a-z]+=)/i).forEach(tok=>{const mm=tok.match(/^([a-z]+)\s*=\s*(.*)$/i);if(mm&&ALIAS[mm[1].toLowerCase()]){setField(o,mm[1],mm[2],i+1);}else{const lx=tok.toLowerCase();if(HG.PRON[lx])o.pron=lx;else if(HG.TRAITS[lx])o.trait=lx;else if(tok)o.bg=tok;}});});if(o.name)res.push(o);});
 return res;};
HG.makeTribute=function(i,spec){const st=()=>HG.clamp(HG.ri(2,9)+(HG.chance(.15)?1:0),1,10);
 const pron=spec.pron||HG.pick(['she','he','she','he','they']);const tk=spec.trait||HG.pick(Object.keys(HG.TRAITS));
 const t={id:i,name:spec.name,first:spec.name.split(' ')[0],district:spec.district||Math.floor(i/2)+1,pron,p:HG.PRON[pron],trait:tk,tr:HG.TRAITS[tk],
  bg:spec.bg||HG.pick(HG.BGS),tic:HG.pick(HG.TICS),str:spec.str||st(),spd:spec.spd||st(),smt:spec.smt||st(),stl:spec.stl||st(),soc:spec.soc||st(),bio:spec.bio||'',victor:!!spec.victor,allyLabel:spec.ally||null,startItems:spec.items||[],
  hp:100,fed:85,hyd:85,sanity:80,inj:[],items:[],ally:null,bond:{},grudge:{},zone:'horn',kills:[],alive:true,fame:HG.ri(0,3),edge:false,sick:0,thirstTurns:0,acted:false,hist:[],deathDay:null,cause:null,killer:null,bound:false,score:spec.score||0,fund:spec.fund!=null?spec.fund:-1,patron:spec.patron||'',gifts:[],spent:0,earned:0,rank:0};
 return t;};
})(HG);
(function(HG){
const Z=(name,short,w,f,c,foods,flav,extra)=>Object.assign({name,short,water:w,food:f,cover:c,foods,flav},extra||{});
HG.SLOTS={horn:'Center (start)',forest:'North',meadow:'Northwest',swamp:'Northeast',lake:'East',ruins:'South',cliffs:'Southwest'};
HG.SLOT_ALIAS={center:'horn',north:'forest',northwest:'meadow',northeast:'swamp',east:'lake',south:'ruins',southwest:'cliffs'};
const H=(z,sev,hurt,ann,esc,die,fog)=>({z,sev,hurt,ann,esc,die,fog:!!fog});
HG.ARENAS={
 classic:{name:'Classic Wilds',close:['cliffs','swamp','meadow','ruins','lake','forest'],zones:{
  horn:Z('the Cache','Cache',.05,.1,.1,['crumbs in a split supply crate'],['The brass horn threw long shadows across the trampled grass.','Wind moaned through the empty crates around the Cache.']),
  meadow:Z('the Meadow','Meadow',.2,.5,.1,['wild onions','sweet clover','a nest of quail eggs'],['Tall grass hissed in the wind and hid nothing.','Bees drifted over the meadow, unbothered by any of it.']),
  forest:Z('the Pinewood','Pinewood',.35,.75,.85,['pine nuts','chanterelles','a snared rabbit','fat blackberries'],['Needles muffled every step in the Pinewood.','Something small and unseen kept rustling in the pines.']),
  lake:Z('the Lake Shore','Lake Shore',1,.5,.35,['freshwater mussels','cattail roots','a stunned perch'],['The lake lay flat and gray, throwing back the sky.','Reeds clicked together along the Lake Shore.']),
  swamp:Z('the Bog','Bog',.7,.3,.65,['frog legs','water chestnuts'],['Mist sat on the Bog like a held breath.','Every footstep in the Bog came with a wet, sucking sound.'],{dirty:true}),
  ruins:Z('the Sunken Ruins','Ruins',.4,.2,.7,['cave moss and snails','a cache of dried figs behind a fallen slab'],['Half-drowned columns leaned over the Sunken Ruins.','Water dripped somewhere deep in the Ruins, steady as a metronome.']),
  cliffs:Z('the Ashen Cliffs','Cliffs',.1,.2,.5,['gull eggs','lichen and a few tough berries'],['Gray ash drifted off the Cliffs and settled on everything.','The Ashen Cliffs gave a view for miles, and gave the same view to everyone looking back.'])},
  hazards:[H(['lake','swamp','ruins'],7,'a near-drowning',['A hollow roar came down the valley. A wall of water slammed into {zone}, swallowing the reeds.','Somewhere an enormous sluice gate opened, and a flood arrived in {zone} without warning.'],'{n} scrambled up a pillar and watched the flood go by beneath {p} boots.','{n} was swept off {p} feet and did not come back up.'),
   H(['forest','meadow'],7,'burns along the arm',['Smoke on the horizon, then flames: a wildfire tore across {zone} faster than anyone could run.','The Overseers set {zone} on fire. It was efficient and unsubtle.'],'{n} found a streambed and crouched in it until the fire burned past.','{n} went the wrong way, and the smoke closed over {o}.'),
   H(['forest','swamp','ruins','cliffs','meadow','lake'],8,'venom stings and bites',['A shimmer in the air at {zone}: glass wasps, big as thumbs, poured out of a hollow tree.','Something with too many teeth was loosed into {zone}: engineered hounds, bred to hunt by smell.'],'{n} dove into water and held {p} breath until the buzzing and snapping moved on.','{n} was too slow to the water. The flatline sounded within the hour.'),
   H(['meadow','cliffs','lake'],6,'a lightning burn',['The sky over {zone} turned the color of a bruise. Lightning started walking across the ground.','A storm built over {zone} with unnatural speed, throwing hail and bolts at anyone in the open.'],'{n} dropped into a ditch and let the lightning go over.','A bolt found {n} on open ground. It was over before the thunder.'),
   H(['swamp','ruins','forest'],6,'a head full of voices',['A pale fog crept through {zone}, smelling faintly of sugar. Those who breathed it saw things.','Hallucinogenic mist rolled across {zone}, and the arena quietly began to lie.'],'{n} tied a wet cloth over {p} face and held on until it passed.','{n} walked off a ledge {s} swore was a staircase.',true)]},
 frozen:{name:'Frozen Wastes',close:['cliffs','swamp','meadow','ruins','lake','forest'],zones:{
  horn:Z('the Ice Spire','Spire',.3,.05,.1,['frozen rations in a split crate'],['The Spire hummed in the wind, one blue tooth against a white sky.','Ice crystals sang against the base of the Spire.']),
  meadow:Z('the Snowfield','Snowfield',.15,.3,.05,['a frozen rabbit nobody else had found','lichen scraped from stones'],['The Snowfield glared white in every direction, and every footprint told a story.','A ground blizzard ran its fingers across the Snowfield.']),
  forest:Z('the Black Spruce','Spruce',.3,.6,.85,['a snow hare','frost-sweetened berries','spruce tips steeped into bitter tea'],['Snow slid from the spruce boughs in soft, heavy sighs.','Every branch in the Spruce wore a glove of frost.']),
  lake:Z('the Frozen Lake','Frozen Lake',1,.5,.2,['a perch from an ice hole','fish gutted on the ice'],['The ice on the lake groaned like a living thing.','Black cracks ran under the Frozen Lake like veins.']),
  swamp:Z('the Steam Vents','Vents',.7,.25,.6,['hot-spring eggs','pale cave moss'],['Sulfur steam curled from cracks in the Vents.','Hot ground ticked under every footstep.'],{dirty:true}),
  ruins:Z('the Buried Station','Station',.35,.2,.75,['canned peaches in a collapsed pantry','old crackers in a sealed drawer'],['Frost furred every pipe in the Buried Station.','A dead intercom crackled once, and went quiet.']),
  cliffs:Z('the Glacier Wall','Glacier',.4,.1,.5,['a handful of frozen berries in a crevice','crumbs in an abandoned pack'],['The Glacier Wall cracked in the cold like a distant gunshot.','Blue light moved inside the Glacier Wall, slow and ancient.'])},
  hazards:[H(['cliffs','meadow','forest'],7,'a crushed shoulder',['The Glacier Wall let go. A river of snow poured across {zone} with a sound like the sky tearing.','A slab of snow slid loose above {zone} and came down faster than anyone could think.'],'{n} dove behind a boulder as the white wave thundered past.','{n} was buried under the slide. The flatline was the only sound afterward.'),
   H(['meadow','lake','cliffs','forest'],6,'frostbitten fingers',['A whiteout swallowed {zone}. Wind, ice, and not a landmark in sight.','The temperature in {zone} dropped forty degrees in minutes, and the snow began to scream.'],'{n} dug into a drift and waited out the worst of it.','{n} wandered off into the white. {s} was found a long time later.'),
   H(['lake'],7,'near-freezing water',['The ice on the lake cracked end to end. {zone} turned into a field of floating plates.','A deep boom rolled across {zone} as the ice gave way.'],'{n} leapt from plate to plate and made the shore with a wet gasp.','{n} went through the ice and the current took {o} under.'),
   H(['forest','ruins','meadow'],8,'bites and gashes',['Pale shapes slid through {zone}: frost wolves, bred long and lean, with eyes that held the light.','Howling started at the edge of {zone}. The Overseers had released something hungry.'],'{n} climbed fast and stayed up until the howling moved off.','{n} could not outrun them.'),
   H(['swamp'],6,'scalding burns',['The Vents erupted. A column of boiling steam punched out of {zone}.','Without warning, {zone} began to scream: geysers, everywhere.'],'{n} threw {r} flat and felt the steam pass overhead.','{n} was too close to the vent when it blew.')]},
 drowned:{name:'Drowned City',close:['cliffs','swamp','meadow','ruins','lake','forest'],zones:{
  horn:Z('the Clock Tower','Tower',.1,.1,.1,['tinned goods in a looted kiosk'],['The Clock Tower stood stopped at 4:17, forever.','Pigeons wheeled around the Clock Tower, unbothered by contestants.']),
  meadow:Z('the Market Roofs','Roofs',.15,.3,.2,['dried fruit in a roof garden','a pigeon, plucked with apologies'],['Tarps and rooftops stretched out like a second city above the first.','Laundry lines snapped overhead on the Market Roofs.']),
  forest:Z('the Overgrown Park','Park',.35,.75,.8,['plums from a feral orchard','dandelion greens','a squirrel, patiently trapped'],['Ivy swallowed the benches in the Overgrown Park.','A lone swing creaked somewhere in the Park.']),
  lake:Z('the Flooded Canal','Canal',1,.5,.3,['eels from a drowned crate','mussels clinging to the quay'],['Green water slid along the Canal, quiet and deep.','Gondola hulls knocked against each other in the Flooded Canal.']),
  swamp:Z('the Sewer Maze','Sewers',.8,.2,.7,['mushrooms from a damp wall','pale river crayfish'],['Every tunnel in the Sewers sounded like the one before it.','Dripping echoed through the Sewers, always from behind.'],{dirty:true}),
  ruins:Z('the Sunken Metro','Metro',.5,.2,.8,['canned beans in a station kiosk','dry crackers in a conductor’s locker'],['Dead escalators descended into black water in the Sunken Metro.','A flickering sign above the Metro platform said NEXT TRAIN: NEVER.']),
  cliffs:Z('the Crane Yard','Yard',.1,.15,.5,['a thermos of cold soup left in a cab','packed lunch in a rusted toolbox'],['Cranes leaned over the Yard like gray herons.','Chains clanked against steel in the Crane Yard.'])},
  hazards:[H(['lake','swamp','ruins'],7,'a near-drowning',['The tide came in at {zone}, a surge as high as a house.','Sirens wailed, and a wall of seawater poured into {zone}.'],'{n} climbed a lamppost and watched the surge roll beneath {p} feet.','{n} was swept away by the tide and never surfaced.'),
   H(['meadow','cliffs','forest'],7,'broken ribs',['A rusted crane finally gave way over {zone} and the world fell down.','A tower of masonry in {zone} chose that moment to collapse.'],'{n} ran through the dust and came out the other side coughing.','{n} was buried under the falling masonry.'),
   H(['swamp','ruins','forest'],8,'rat bites',['The walls of {zone} began to move: rat-mods, big as dogs, in their hundreds.','A chittering tide poured through {zone}, teeth first.'],'{n} scrambled onto a ledge and kicked until the swarm went around.','{n} was overrun before {s} could climb.'),
   H(['forest','meadow'],6,'a head full of voices',['A yellow smog drifted through {zone}, sweet and sticky. Those who breathed it saw things.','Spore clouds burst across {zone}, and the city began to whisper.'],'{n} tied a scarf over {p} face and held on.','{n} stepped off a rooftop edge {s} thought was a bridge.',true)]},
 desert:{name:'Salt Desert',close:['meadow','cliffs','swamp','ruins','lake','forest'],zones:{
  horn:Z('the Sundial','Sundial',.05,.1,.1,['dates from a spilled crate'],['The Sundial’s shadow crept across the sand like a slow hand.','Heat shimmered around the Sundial until it seemed to float.']),
  meadow:Z('the Dune Sea','Dunes',.02,.15,.05,['a lizard, cooked on a hot rock','pale cactus fruit'],['Dunes rolled to the horizon, each one identical to the last.','Wind combed the Dune Sea and erased every footprint.']),
  forest:Z('the Oasis Grove','Oasis',.8,.7,.7,['dates','figs','a startled desert hare'],['Palms rattled over the Oasis Grove and the water shone like glass.','Shade and a smell of water: the Oasis Grove was an invitation and a trap.']),
  lake:Z('the Cistern','Cistern',.9,.3,.5,['cave fish from the cistern pool','blind shrimp'],['Cool air breathed up out of the Cistern.','Torch-black stone steps led down into the Cistern, and every sound came back doubled.']),
  swamp:Z('the Brine Pans','Brine',.6,.2,.3,['salt-crusted samphire','a handful of brine shrimp'],['White salt crackled under every step across the Brine Pans.','The Brine Pans threw the sun back up like a mirror.'],{dirty:true}),
  ruins:Z('the Bone Quarry','Quarry',.2,.2,.7,['a hoard of pine nuts in a dead nest','jerky in a long-abandoned pack'],['Stone ribs the size of houses rose out of the Bone Quarry.','The Quarry smelled of dust, old stone, and old death.']),
  cliffs:Z('the Red Mesa','Mesa',.1,.25,.5,['prickly pear','a bird’s egg in a high ledge'],['The Red Mesa glowed like a coal at dusk.','Hot wind sighed up the walls of the Red Mesa.'])},
  hazards:[H(['meadow','cliffs','swamp'],7,'sand-scoured skin',['A wall of sand towered over {zone} and rolled in without a sound.','The horizon at {zone} went brown, then black. A sandstorm.'],'{n} wrapped {p} head and lay flat until the roar passed.','{n} lost the way in the sand, and the sand kept {o}.'),
   H(['meadow','swamp','horn','cliffs'],6,'heatstroke',['The sun over {zone} turned vicious. The Overseers cranked the heat past anything human.','A heat dome settled on {zone} and the air began to cook.'],'{n} found a sliver of shade and did not move for hours.','{n} collapsed in the heat and did not get up.'),
   H(['lake','ruins'],7,'a bruising tumble',['A wall of brown water roared through {zone}: a flash flood, in a desert, on schedule.','Thunder rolled somewhere far away, and {zone} filled with moving water.'],'{n} scrambled up a ledge as the flood went by.','{n} was swept off {p} feet and slammed into the stone.'),
   H(['ruins','cliffs','meadow'],8,'venomous stings',['Something skittered out of the stone at {zone}: scorpion-mods, the size of cats.','The sand at {zone} began to move. Pale, jointed legs, and a lot of them.'],'{n} leapt onto a boulder and watched the tide of pale legs go under.','{n} was stung before {s} could get away.')]}
};
HG.TWISTS=[
 {id:'veterans',name:'Veterans return',desc:'Contestants marked Champion in your roster are past champions: +2 to every stat, big crowd favorites, but they start hurt and haunted.',read:'This year, past victors will be reaped back into the arena.'},
 {id:'longnight',name:'The long night',desc:'Fires are forbidden. Nights are deadlier and hazard-heavy; days are quiet.',read:'The sun is a gift this year. The dark is not.'},
 {id:'scarcity',name:'Scarcity',desc:'Hunger and thirst bite harder, foraging yields less, the Cache holds fewer supplies.',read:'The arena will not feed you. Whatever you eat, you must earn.'},
 {id:'audience',name:'The audience rules',desc:'Sponsors are far more generous to favorites, and the Syndicate periodically punishes the least-liked contestant.',read:'This year, the audience holds the whip. Be loved, or be punished.'},
 {id:'empty',name:'Empty Cache',desc:'No weapons at the start. Only supplies. Everything sharp must be built, found or sent.',read:'The Cache holds nothing that can kill. What happens next is up to you.'},
 {id:'bound',name:'Bound pairs',desc:'Sector partners start allied and cannot leave each other. When one falls, the other is badly hurt.',read:'Contestants from each sector will go in together, and fall together.'},
 {id:'tide',name:'Rising tide',desc:'A zone closes every phase from day 2. The Games are short and the funnel is brutal.',read:'The arena will shrink fast this year. Keep moving.'},
 {id:'menagerie',name:'Mutant menagerie',desc:'Hazards strike more than twice as often, and often twice in a row.',read:'The Overseers have been busy in the labs this year.'}];
HG.CSV_TEMPLATE='Name,Pronouns,Trait,Background,Sector,STR,SPD,SMT,STL,SOC,Items,Alliance,Victor,Bio,Score,Sponsors,Patron\n"Maren Holloway",she,brave,"a baker\'s apprentice",1,7,6,5,4,6,"knife, rations",Careers,,"Loud laugh, steady hands.",9,400,Cassian Voss\n"Teodor Vance",he,cunning,"a clock repairer",1,8,5,7,6,4,sword,Careers,,,,,\n"Dex Lindqvist",they,,,,,,,,,,,,,,,';
const fillTx=(s,t)=>s.replace(/\{n\}/g,HG.N(t)).replace(/\{p\}/g,t.p.p).replace(/\{o\}/g,t.p.o).replace(/\{s\}/g,t.p.s).replace(/\{r\}/g,t.p.r);HG.fillTx=fillTx;
HG.applyArena=function(a){a=a||HG.ARENAS.classic;Object.keys(HG.SLOTS).forEach(id=>{const z=a.zones[id]||HG.ARENAS.classic.zones[id];Object.assign(HG.ZONES[id],{name:z.name,short:z.short||z.name,water:z.water,food:z.food,cover:z.cover,foods:z.foods&&z.foods.length?z.foods:['scraps of something edible'],flav:z.flav&&z.flav.length?z.flav:['The arena offered nothing new.'],dirty:!!z.dirty});});
 HG.HAZARDS=(a.hazards&&a.hazards.length?a.hazards:[]).map(h=>Object.assign({},h));HG.CLOSE=(a.close&&a.close.length?a.close:HG.ARENAS.classic.close).filter(id=>id!=='horn');HG.ARENA_NAME=a.name||'Custom Arena';};
HG.parseHazardLines=function(txt){const out=[],warn=[];txt.split('\n').map(l=>l.trim()).filter(Boolean).forEach((l,i)=>{const p=l.split('|').map(x=>x.trim());if(p.length<6){warn.push('Hazard line '+(i+1)+' needs 6 parts.');return;}
 const zs=p[0].toLowerCase()==='all'?Object.keys(HG.SLOTS):p[0].split(',').map(x=>x.trim().toLowerCase()).map(x=>HG.SLOT_ALIAS[x]||(HG.SLOTS[x]?x:null)).filter(Boolean);if(!zs.length){warn.push('Hazard line '+(i+1)+': no valid zones.');return;}
 out.push({z:zs,sev:HG.clamp(+p[1]||7,3,10),hurt:p[2],ann:p[3].split('//').map(x=>x.trim()).filter(Boolean),esc:p[4],die:p[5],fog:/fog|halluc/i.test(p[6]||'')});});return {list:out,warn};};
HG.hazardsToText=function(hs){const rev={};Object.keys(HG.SLOT_ALIAS).forEach(k=>rev[HG.SLOT_ALIAS[k]]=k);return hs.map(h=>[h.z.map(z=>rev[z]).join(','),h.sev,h.hurt,h.ann.join(' // '),h.esc,h.die].concat(h.fog?['fog']:[]).join(' | ')).join('\n');};
HG.applyArena(HG.ARENAS.classic);
})(HG);
(function(HG){
const {rand,ri,pick,chance,clamp,shuffle,wpick}=HG;
const N=t=>`[[${t.id}]]`;HG.N=N;
function Sim(roster,opts){
 this.o=Object.assign({seed:Date.now()%1e9,sponsors:1,carnage:1,hazards:1,closing:true,alliances:true,districtWin:false,twists:[],arena:null},opts||{});
 HG.applyArena(this.o.arena||HG.ARENAS.classic);this.tws=new Set(this.o.twists||[]);this.shocks=[];
 HG.seed(this.o.seed);
 this.T=roster.map((s,i)=>HG.makeTribute(i,s));this.gl=[];this.vc={};this.setup();this.scoreAll();this.training=this.trainingBoard();
 this.day=0;this.phase='bloodbath';this.n=0;this.closed=new Set();this.nextAlly=1;this.evUse={};this.recent=[];this.vc={};
 this.drops=[];this.traps=[];this.fires=new Set();this.buf=[];this.cannons=[];this.over=false;this.victor=null;this.phases=[];this.feastOn=false;this.feastDone=false;
}
const P=Sim.prototype;HG.Sim=Sim;
HG.PATRONS=['Cassian Voss','Lucilla Brandt','Marcus Orlo','Seraphina Quill','Ottavian Pell','Delphine Marrow','Corvin Thale','Isolde Fenwick','Barnabas Crane','Aurelia Sparks','Percival Dunne','Valentina Ross','Octavia Kell','Magnus Hale'];
P.power0=function(t){return (t.str+t.spd+t.smt+t.stl)/4*.8+t.soc*.2+(t.startItems.some(id=>HG.ITEMS[id]&&HG.ITEMS[id].kind==='weapon')?.6:0)+(t.victor?1:0);};
P.scoreAll=function(){const pats=shuffle(HG.PATRONS.slice());this.T.forEach((t,i)=>{
  if(!t.score)t.score=clamp(Math.round(this.power0(t)*1.15+ri(-1,1)+(t.tr.aggr>.6?.4:0)),1,12);
  if(!t.patron)t.patron=pats[i%pats.length];
  if(t.fund<0)t.fund=Math.round((60+t.score*26+t.soc*14+t.fame*20+ri(0,60))*(.6+.4*(this.o.sponsors||0)));
  t.fund0=t.fund;});
 const o=this.T.slice().sort((a,b)=>b.score-a.score||this.power0(b)-this.power0(a));o.forEach((t,i)=>t.rank=i+1);};
P.trainingBoard=function(){const T=this.T;const pw=T.map(t=>Math.pow(this.power0(t)+t.score*.5,5));const sum=pw.reduce((a,b)=>a+b,0);
 const f=T.map(t=>t.fund).sort((a,b)=>a-b),med=f[Math.floor(f.length/2)];
 const note=s=>s>=11?this.V('tn11',['The Overseers stood and applauded.','A perfect, or nearly perfect, session. Nobody in the room breathed.','They are calling this one a threat.']):s>=9?this.V('tn9',['The Overseers leaned forward in their seats.','A strong showing, and everybody noticed.','Confident, polished, and dangerous.']):s>=7?this.V('tn7',['Solid. No one in the room was surprised.','Competent, and not much more.','They did what was asked, and did it well.']):s>=5?this.V('tn5',['Forgettable, which can be useful.','The Overseers did not look up from their wine.','Average in every way that matters.']):s>=3?this.V('tn3',['A rough session. The room was kind about it.','Nobody expects much from this one.','The Overseers wrote something down. It was not flattering.']):this.V('tn1',['A disaster. The Syndicate is already laying odds against.','The Overseers stopped taking notes.','Hopeless, or very good at looking it.']);
 return T.slice().sort((a,b)=>a.rank-b.rank).map(t=>{const p=pw[t.id]/sum;const od=Math.max(1,Math.round(1/p-1));const tier=t.fund>=med*1.5?'Darling':t.fund>=med*1.1?'Favored':t.fund>=med*.8?'Watched':'Overlooked';
  return {id:t.id,rank:t.rank,score:t.score,odds:od,tier,fund:t.fund,patron:t.patron,note:note(t.score)};});};
P.pay=function(t,n){if(!t||!t.alive||!n)return;t.fund+=Math.round(n);t.earned+=Math.round(n);};
P.tw=function(id){return this.tws.has(id);};
P.setup=function(){this.T.forEach(t=>{if(this.tw('veterans')&&t.victor){['str','spd','smt','stl','soc'].forEach(k=>t[k]=Math.min(10,t[k]+2));t.hp=85;t.sanity=60;t.fame+=3;}t.startItems.forEach(id=>this.give(t,id));});
 const g={};this.T.forEach(t=>{if(t.allyLabel)(g[t.allyLabel.toLowerCase()]=g[t.allyLabel.toLowerCase()]||[]).push(t);});Object.keys(g).forEach(k=>{const a=g[k];for(let i=1;i<a.length;i++)this.join(a[0],a[i]);});
 if(this.tw('bound')){const d={};this.T.forEach(t=>(d[t.district]=d[t.district]||[]).push(t));Object.keys(d).forEach(k=>{const a=d[k];if(a.length>=2){for(let i=1;i<a.length;i++)this.join(a[0],a[i]);a.forEach(x=>x.bound=true);}});}};
P.alive=function(){return this.T.filter(t=>t.alive);};
P.inZone=function(z,ex){return this.T.filter(t=>t.alive&&t.zone===z&&t!==ex);};
P.allies=function(t){return t.ally==null?[]:this.T.filter(x=>x.alive&&x!==t&&x.ally===t.ally);};
P.V=function(key,arr){const w=arr.map((_,i)=>1/(1+Math.pow(this.vc[key+i]||0,2)*1.6));let tot=w.reduce((a,b)=>a+b,0),r=rand()*tot,k=0;for(;k<arr.length-1;k++){r-=w[k];if(r<=0)break;}this.vc[key+k]=(this.vc[key+k]||0)+1;return arr[k];};
P.tail=function(t){const o=[];const Zd=HG.ZONES[t.zone];
 if(t.hp<45)o.push('Every step hurt.','The pain had become a second heartbeat.');
 if(t.fed<35)o.push('Hunger gnawed at the edges of every thought.');
 if(t.hyd<35)o.push('Thirst had cracked '+t.p.p+' lips.');
 if(t.sanity<35)o.push('The edges of things had begun to shimmer.');
 if(t.kills.length>=2)o.push('The count of the dead sat heavy on '+t.p.o+'.');
 if(this.phase==='night')o.push('The cold crept up out of the ground.','Stars crowded the sky, indifferent.','Something called far away and was not answered.');
 else o.push('Sunlight lay hard and flat across the arena.','A hot wind pushed through and left again.');
 const tt={paranoid:['Every shadow got a second look.','Twice, it checked the treeline before moving.'],cunning:['It filed the location away for later.','Another small advantage, quietly banked.'],kind:['A thought for the others, hungry somewhere.','It hoped the rest of them were all right, and meant it.'],ruthless:['No time to feel anything about it.','The count of the dead was just arithmetic.'],showy:['Somewhere, a camera was surely getting a good angle.','It made sure to look good doing it.'],reckless:['No effort was made to hide the tracks.','Caution had never been the plan.'],brave:['It squared up to the quiet and the quiet blinked first.','Fear was there. So was the next step.'],steady:['One hour at a time, and then the next.','Slow and steady, same as ever.']}[t.trait]||[];
 if(chance(.5)&&tt.length)return pick(tt).replace(/^(It|Twice, it)/,m=>m==='It'?N(t):'Twice, '+N(t));
 const f=pick(Zd.flav);o.push(f);return pick(o);};
P.say=function(text,type,ids,zone,nt){text=text.replace(/^([a-z])/,m=>m.toUpperCase());if(!nt&&(type==='plain'||type==='gift'||type==='heal')&&ids&&ids.length===1&&chance(.22)){const t=this.T[ids[0]];if(t&&t.alive){const tl=this.tail(t);if(!text.includes(tl))text+=' '+tl;}}const dead=this.cannons.slice(this.lastC||0);this.lastC=this.cannons.length;this.buf.push({text,type:type||'plain',ids:ids||[],dead});};
P.weapon=function(t){let b=null;t.items.forEach(i=>{if(i.kind==='weapon'&&i.uses>0&&(!b||i.atk>b.atk))b=i;});return b;};
P.has=function(t,kind){return t.items.find(i=>i.kind===kind&&i.uses>0)||null;};
P.use=function(t,it){it.uses--;if(it.uses<=0)t.items=t.items.filter(x=>x!==it);};
P.give=function(t,id){const it=HG.item(id);t.items.push(it);return it;};
P.bond=function(a,b,d){a.bond[b.id]=clamp((a.bond[b.id]||0)+d,-10,10);b.bond[a.id]=clamp((b.bond[a.id]||0)+d,-10,10);};
P.hurt=function(t,dmg,name,sev){t.hp-=dmg;if(name)t.inj.push({name,sev:sev||1,age:0});};
P.power=function(t,bonus){const w=this.weapon(t);return t.str+(w?w.atk:0)+t.hp/25-t.inj.reduce((a,i)=>a+i.sev,0)-(t.fed<20?1.5:0)-(t.sanity<30?1:0)+rand()*4+(bonus||0)+(t.tr.aggr>.7?.6:0)+(t.boostDay===this.day?2.6:0)+Math.min(1.2,(t.gifts?t.gifts.length:0)*.25)+this.backing(t);};
P.backing=function(t){const sp=this.o.sponsors||0;if(!sp)return 0;if(this._fm==null){const f=this.T.map(x=>x.fund0).sort((a,b)=>a-b);this._fm=f[f.length>>1];this._fs=Math.max(60,f[f.length-1]-f[0]);}return clamp((t.fund0-this._fm)/this._fs*3.2*sp,-1.6*sp,2.4*sp);};
P.join=function(a,b){if(a.ally==null&&b.ally==null){a.ally=b.ally=this.nextAlly++;}else if(a.ally==null)a.ally=b.ally;else if(b.ally==null)b.ally=a.ally;else{const o=b.ally;this.T.forEach(x=>{if(x.ally===o)x.ally=a.ally;});}this.bond(a,b,3);};
P.leave=function(t){if(t.alive&&t.bound&&this.T.some(x=>x.alive&&x!==t&&x.bound&&x.district===t.district&&x.ally!=null&&x.ally===t.ally))return;const g=t.ally;t.ally=null;if(g!=null&&this.T.filter(x=>x.alive&&x.ally===g).length<2)this.T.forEach(x=>{if(x.ally===g)x.ally=null;});};
const cap=s=>s[0].toUpperCase()+s.slice(1);
P.kill=function(v,k,cause){v.alive=false;v.hp=0;v.cause=cause;v.killer=k?k.id:null;v.deathDay=this.day;v.deathPhase=this.phase;this.cannons.push(v.id);
 const loot=[];
 if(k){k.kills.push(v.id);k.fame+=2;this.pay(k,ri(35,70));k.sanity-=k.tr.mercy>.4?14:5;k.edge=false;v.items.forEach(i=>{if(i.kind!=='poison'||chance(.5)){k.items.push(i);loot.push(i.n);}});v.items=[];}else{v.items.forEach(i=>this.drops.push({zone:v.zone,item:i,from:v.id}));v.items=[];}
 this.T.forEach(x=>{if(x.alive&&x!==v){const b=x.bond[v.id]||0;if(b>=3){x.sanity-=10+b*2;x.grief=v.id;if(k&&k!==x)x.grudge[k.id]=(x.grudge[k.id]||0)+b;}}});
 if(v.bound){const pr=this.T.find(x=>x.alive&&x.bound&&x.district===v.district);if(pr){pr.hp=Math.max(3,pr.hp-25);pr.sanity-=20;this.shocks.push([pr.id,v.id]);}}
 this.leave(v);this.traps=this.traps.filter(t=>t.owner!==v.id);return loot;};
P.injury=function(cls){return pick({blade:['a slashed forearm','a deep thigh gash','a cut along the ribs'],blunt:['cracked ribs','a split brow','a broken wrist'],pole:['a punctured shoulder','a gouged calf'],ranged:['an arrow through the shoulder','a graze across the ribs','a bolt in the thigh'],none:['a twisted knee','a bloody nose and a black eye','a sprained ankle','a bitten hand']}[cls]);};
const KILL={
 blade:(w,l,wp)=>[`${N(w)} drove the ${wp} home and held ${N(l)} up until the fight went out of ${l.p.o}.`,`${N(l)} swung first. ${N(w)}'s ${wp} answered, and that settled the argument.`,`One clean, ugly stroke. ${N(w)} stood over ${N(l)} afterward, breathing like a bellows.`,`${N(w)} caught ${N(l)} mid-stumble with the ${wp} and did not hesitate.`],
 blunt:(w,l,wp)=>[`${N(w)} brought the ${wp} down once. ${N(l)} did not get up.`,`The ${wp} met ${N(l)}'s skull with a sound ${N(w)} would hear again at night.`,`${N(l)} blocked the first swing. The second one finished it.`],
 pole:(w,l,wp)=>[`${N(w)} planted the ${wp} through ${N(l)} and pinned ${l.p.o} to the dirt.`,`${N(l)} backed into a wall of stone, and ${N(w)}'s ${wp} did the rest.`,`A long thrust, a short gasp. ${N(l)} was gone before ${N(w)} pulled the ${wp} free.`],
 ranged:(w,l,wp)=>[`${N(w)} let fly from cover with the ${wp}; ${N(l)} dropped mid-stride.`,`The ${wp} was faster than ${N(l)} ever was.`,`Three shots, one hit. It was enough for ${N(w)} and far too much for ${N(l)}.`],
 none:(w,l)=>[`${N(w)} got both hands around ${N(l)}'s throat and kept them there.`,`${N(w)} cracked ${N(l)}'s head against a rock, then sat down shaking.`,`${N(w)} had nothing but ${w.p.p} hands, and wanted it more than ${N(l)} did.`]};
const KILLBB={
 blade:(w,l,wp)=>[`${N(w)}'s ${wp} opened ${N(l)} from hip to ribs. ${N(l)} looked surprised, then folded into the grass.`,`${N(l)} screamed once as the ${wp} went in, and kept screaming until ${N(w)} made it stop.`,`A wet, ugly sound, and ${N(l)} dropped at the foot of the crates, red spreading under ${l.p.o}.`,`${N(w)} cut ${N(l)}'s legs out from under ${l.p.o} and finished it before ${N(l)} hit the ground.`],
 blunt:(w,l,wp)=>[`The ${wp} caved in the side of ${N(l)}'s skull. ${N(l)} was dead before ${l.p.s} fell.`,`${N(w)} swung until ${N(l)} stopped moving, then swung once more to be sure.`,`Bone cracked. ${N(l)} went down hard and stayed there, one hand still reaching for a pack.`],
 pole:(w,l,wp)=>[`${N(w)} drove the ${wp} through ${N(l)} and lifted ${l.p.o} off the ground. Nobody else in the melee even looked.`,`The ${wp} took ${N(l)} through the stomach. ${N(l)} sat down very slowly, holding the shaft, and did not get up.`,`${N(l)} was pinned to the dirt, hands scrabbling at the ${wp}, until ${N(w)} put a boot on ${l.p.o} and wrenched it free.`],
 ranged:(w,l,wp)=>[`${N(w)} took aim over a crate and put the ${wp} into ${N(l)}'s back. ${N(l)} went down still clutching a pack.`,`${N(l)} ran. The ${wp} caught ${l.p.o} ten strides short of the grass.`,`One shot. ${N(l)} dropped onto the crates and slid off them, leaving a long red streak.`],
 none:(w,l)=>[`${N(w)} wrestled ${N(l)} into the dirt, got both thumbs under ${l.p.p} jaw, and did not let up.`,`${N(w)} slammed ${N(l)}'s head onto the edge of a crate, again and again, until it stopped mattering.`,`Barehanded and screaming, ${N(w)} dragged ${N(l)} down into the churned mud and held ${l.p.o} there.`]};
const WOUNDBB=(w,l,inj)=>[`${N(w)} laid ${N(l)} open with a vicious blow, and ${N(l)} staggered off clutching ${inj}, trailing blood across the grass.`,`${N(l)} went down hard with ${inj}, scrambled up screaming, and ran, leaving red footprints.`,`${N(w)} left ${N(l)} with ${inj} and no desire for round two.`];
const WOUND=(w,l,inj)=>[`${N(w)} got the better of ${N(l)}, who limped away with ${inj}.`,`${N(l)} took ${inj} and fled; ${N(w)} had no legs left to follow.`,`The fight ended in ${inj} for ${N(l)} and a ragged retreat.`,`${N(w)} drove ${N(l)} off. ${N(l)} left a trail of blood and ${inj}.`];
P.useStim=function(t){const it=t.items.find(i=>i.kind==='boost'&&i.uses>0);if(!it||t.boostDay===this.day)return false;it.uses--;t.items=t.items.filter(i=>i.uses>0||i.kind!=='boost');t.boostDay=this.day;return true;};
P.duel=function(a,b,o){o=o||{};const sa=this.useStim(a),sb=this.useStim(b);const pa=this.power(a,o.ambush?3:0),pb=this.power(b,0);const w=o.force?a:(pa>=pb?a:b),l=w===a?b:a;const m=Math.abs(pa-pb);
 const wp=this.weapon(w),cls=wp?wp.cls:'none';if(wp&&wp.cls==='ranged'&&wp.uses>0)wp.uses--;
 let pk=(.14+m*.07+(wp?wp.lethal*.3:0))*this.o.carnage*(this.phase==='bloodbath'?1.9:1)*(l.hp<35?1.5:1)*(o.lethal||1)*(this.tw('longnight')&&this.phase==='night'?1.25:1);pk=clamp(pk,0,.95);
 const vest=l.items.find(i=>i.kind==='armor'&&i.uses>0);let vtxt='';if(vest){pk*=.45;vest.uses--;vtxt=` The ${vest.n} took the worst of it.`;if(vest.uses<=0)l.items=l.items.filter(i=>i!==vest);}
 let text,killed=false;
 if(chance(pk)){killed=true;const loot=this.kill(l,w,cls==='none'?'bare hands':wp.n);text=this.phase==='bloodbath'&&chance(.8)?this.V('killbb'+cls,KILLBB[cls](w,l,wp&&wp.n)):this.V('kill'+cls,KILL[cls](w,l,wp&&wp.n));if(loot.length)text+=` ${N(w)} took the ${loot.slice(0,2).join(' and the ')}.`;}
 else{const inj=this.injury(cls);const sev=m>4?2:1;this.hurt(l,ri(10,22)+m*2,inj,sev);if(m<2&&chance(.6))this.hurt(w,ri(4,10),this.injury('none'),1);
  text=this.phase==='bloodbath'?this.V('woundbb',WOUNDBB(w,l,inj)):this.V('wound',WOUND(w,l,inj));if(l.hp<=0){this.kill(l,w,'wounds');text+=` It was not enough. ${N(l)} bled out before moving on.`;killed=true;}
  else{this.bond(w,l,-2);l.grudge[w.id]=(l.grudge[w.id]||0)+2;const adj=HG.ZONES[l.zone].adj.filter(z=>!this.closed.has(z));if(adj.length&&chance(.7))l.zone=pick(adj);}}
 if(vtxt&&!killed)text+=vtxt;if(sa||sb)text+=` ${N(sa?a:b)} had slammed a combat stimulant first.`;
 return {w,l,killed,text};};
})(HG);
(function(HG){
const {rand,ri,pick,chance,clamp}=HG;const N=HG.N;HG.EVENTS=[];
const Z=t=>HG.ZONES[t.zone];const cap=s=>s[0].toUpperCase()+s.slice(1);const sub=t=>cap(t.p.s);
const ev=(id,k,w,run,ph)=>HG.EVENTS.push({id,k,w,run,ph:ph||null});
const night=S=>S.phase==='night';
ev('forage','solo',(S,c)=>{const t=c.t;return Z(t).food*(t.fed<70?(75-t.fed)/14+.5:.1);},(S,c)=>{const t=c.t,f=pick(Z(t).foods);
 if(t.smt<=3&&chance(.25)){S.hurt(t,ri(14,24),'a poisoned gut',2);t.sick=2;S.say(S.V('forbad',[`${N(t)} ate ${f} without checking it twice. The cramps arrived within the hour.`,`Hunger overruled caution: ${N(t)} swallowed ${f} and spent the next stretch doubled over.`,`${cap(f)} looked fine. It was not. ${N(t)} learned that the hard way.`]),'hurt',[t.id]);if(t.hp<=0){S.kill(t,null,'poisoned food');S.say(`${N(t)} did not recover from the bad meal.`,'death',[t.id]);}return;}
 t.fed=clamp(t.fed+ri(28,40)*(S.tw('scarcity')?.7:1),0,100);
 S.say(S.V('forage',[`${N(t)} turned up ${f} and ate until the hunger loosened its grip.`,`A patient search paid off in ${f} for ${N(t)}.`,`${N(t)} found ${f}, checked it twice, and ate it anyway.`,`${cap(f)} was all there was. ${N(t)} ate it slowly, like a feast.`,`${N(t)} crouched over ${f} and ate with one eye on the horizon.`,`Some luck at last: ${f}. ${N(t)} wasted none of it.`,`An hour of foraging gave ${N(t)} ${f}, and a little less to be afraid of.`]),'plain',[t.id]);});
ev('drink','solo',(S,c)=>{const t=c.t;return (Z(t).water>=.3||S.has(t,'water'))?(t.hyd<65?(70-t.hyd)/12+Z(t).water+.3:.08):0;},(S,c)=>{const t=c.t;
 if(Z(t).water<.3){const w=S.has(t,'water');S.use(t,w);t.hyd=clamp(t.hyd+35,0,100);S.say(`${N(t)} rationed a few swallows from the waterskin.`,'plain',[t.id]);return;}
 if(Z(t).dirty&&t.smt<6&&chance(.4)){t.hyd=clamp(t.hyd+30,0,100);S.hurt(t,8,'a fever',1);S.say(`${N(t)} drank the ${Z(t).short} water because there was nothing else. It stayed down. For a while.`,'hurt',[t.id]);return;}
 t.hyd=clamp(t.hyd+ri(40,55),0,100);S.say(S.V('drink',[`${N(t)} drank deep at the water's edge, then watched the far bank for a long minute before leaving.`,`Cupped hands, cold water, a moment of something close to peace for ${N(t)}.`,`${N(t)} filled up and washed the grit from ${t.p.p} face.`,`${N(t)} found clean water and nearly wept.`,`${N(t)} drank, rinsed ${t.p.p} wounds, and drank again.`,`There was water, and for once nobody else. ${N(t)} took ${t.p.p} time.`,`${N(t)} lay flat and drank straight from the source, too thirsty to be careful.`,`${N(t)} boiled a little water, then gave up waiting and drank some anyway.`,`${N(t)} topped off every container and kept one eye on the treeline.`,`The water tasted of stone and iron. ${N(t)} had never tasted anything better.`]),'plain',[t.id]);});
ev('rest','solo',(S,c)=>{const t=c.t;return (t.hp<85||t.inj.length?1:.2)*(Z(t).cover+.35)*(t.fed>25?1:.2);},(S,c)=>{const t=c.t;t.hp=clamp(t.hp+(S.has(t,'tool')?16:12),0,100);t.sanity=clamp(t.sanity+4,0,100);
 const d=[`${N(t)} found a hollow out of the wind and slept in short, wary pieces.`,`Hidden and still, ${N(t)} let ${t.p.p} body knit itself back together.`,`${N(t)} wedged into a crack in the world and did nothing at all. It helped.`];
 const n=[`${N(t)} bedded down in the dark with ${t.p.p} back against stone and one hand on ${t.p.p} weapon.`,`${N(t)} slept in snatches, waking at every sound.`,`${N(t)} kept a cold camp, no fire, no sound, and rested while the dark did the hiding.`];
 S.say(S.V(night(S)?'restn':'restd',night(S)?n:d),'plain',[t.id]);});
ev('treat','solo',(S,c)=>{const t=c.t;if(!t.inj.length)return 0;return S.has(t,'med')?2:(Z(t).food>=.6||Z(t).water>=.9?.7:.2)*(t.smt/6);},(S,c)=>{const t=c.t;const m=S.has(t,'med');const worst=t.inj.sort((a,b)=>b.sev-a.sev)[0];
 if(m){S.use(t,m);t.inj=t.inj.filter(i=>i!==worst);t.hp=clamp(t.hp+18,0,100);S.say(S.V('treatm',[`${N(t)} used the ${m.n} on ${worst.name}, hands steadier than expected.`,`${N(t)} cleaned ${worst.name} with the ${m.n} and bit down on a strip of cloth.`]),'heal',[t.id]);}
 else{worst.sev--;if(worst.sev<=0)t.inj=t.inj.filter(i=>i!==worst);t.hp=clamp(t.hp+6,0,100);S.say(S.V('treat',[`${N(t)} packed ${worst.name} with moss and bound it with a torn sleeve.`,`With cold water and clenched teeth, ${N(t)} cleaned ${worst.name} as best ${t.p.s} could.`,`${N(t)} made a splint, a bandage, and a promise, and put them all on ${worst.name}.`]),'heal',[t.id]);}});
ev('craft','solo',(S,c)=>S.weapon(c.t)?.06:.9*(c.t.smt/6),(S,c)=>{const t=c.t;const id=t.smt>=7?pick(['spear','sling']):pick(['stick','stick','sling']);const it=S.give(t,id);
 S.say(S.V('craft',[`${N(t)} spent a quiet hour whittling a ${it.n} out of whatever the arena offered.`,`Out of scraps and stubbornness, ${N(t)} built a ${it.n}.`,`${N(t)} had no weapon, so ${t.p.s} made one: a ${it.n}, ugly but sharp.`]),'plain',[t.id]);});
ev('trap','solo',(S,c)=>{const t=c.t;if(S.traps.filter(x=>x.owner===t.id).length>=2)return 0;return (S.has(t,'tool')?1.2:.25)*(t.tr.caut+.3)*(t.smt/6)*(Z(t).cover+.3);},(S,c)=>{const t=c.t;S.traps.push({owner:t.id,zone:t.zone});
 S.say(S.V('trap',[`${N(t)} strung a tripwire across a game trail and covered the ends with leaves.`,`${N(t)} dug a shallow pit, lined it with sharpened stakes, and laid branches over the top.`,`A deadfall, carefully balanced: ${N(t)} spent the hour making a very patient weapon.`,`${N(t)} rigged a snare at the one gap everyone would have to cross, and backed away stepping in ${t.p.p} own footprints.`]),'plain',[t.id]);});
ev('trapHit','solo',(S,c)=>{const t=c.t;return S.traps.some(x=>x.zone===t.zone&&x.owner!==t.id&&!(t.ally!=null&&t.ally===S.T[x.owner].ally))?3:0;},(S,c)=>{const t=c.t;const tr=S.traps.find(x=>x.zone===t.zone&&x.owner!==t.id&&!(t.ally!=null&&t.ally===S.T[x.owner].ally));const ow=S.T[tr.owner];
 S.traps=S.traps.filter(x=>x!==tr);
 if(t.smt+rand()*6>8){S.say(S.V('tph',[`${N(t)} caught the glint of wire at ankle height, stepped carefully over ${N(ow)}'s handiwork, and cut it free.`,`${N(t)} noticed the leaves were too neat, found ${N(ow)}'s trap underneath, and sprung it with a stick.`,`${N(t)} walked right up to ${N(ow)}'s trap, saw it, and walked right back out.`,`Something about the trail felt wrong to ${N(t)}. It was ${N(ow)}'s work, and ${N(t)} was not fooled.`]),'plain',[t.id,ow.id]);return;}
 S.hurt(t,ri(18,34),'a snare-torn leg',2);
 if(t.hp<=0||chance(.12)){S.kill(t,ow,'trap');S.say(`${N(t)} walked into ${N(ow)}'s trap and never walked out. The flatline fired before ${N(ow)} even knew.`,'death',[t.id,ow.id]);}
 else S.say(`${N(t)} stepped wrong. ${N(ow)}'s trap snapped shut around ${t.p.p} leg, and ${t.p.s} limped away leaving a trail.`,'hurt',[t.id,ow.id]);});
ev('hunt','solo',(S,c)=>{const t=c.t,w=S.weapon(t);return (w&&(w.cls==='ranged'||w.cls==='pole')?.9:.2)*(t.fed<65?1.6:.5)*Z(t).food;},(S,c)=>{const t=c.t,w=S.weapon(t);if(w&&w.cls==='ranged'&&w.uses>0)w.uses--;
 t.fed=clamp(t.fed+45,0,100);S.say(S.V('hunt',[`${N(t)} took down a rabbit with one clean shot and ate without a fire.`,`${N(t)} stalked a wild turkey for an hour and was rewarded with a real dinner.`,`${N(t)} skinned the day's catch quickly and buried the evidence.`,`${N(t)} sat motionless for most of an hour, then moved once. Dinner.`]),'plain',[t.id]);});
ev('scout','solo',(S,c)=>.22+c.t.tr.caut*.3+(S.has(c.t,'tool')?.2:0),(S,c)=>{const t=c.t;const os=S.alive().filter(x=>x!==t&&x.zone!==t.zone);const o=os.length?pick(os):null;t.edge=true;if(o)t.intel=o.id;
 S.say(o?S.V('scout',[`From a high perch, ${N(t)} picked out ${N(o)} near ${HG.ZONES[o.zone].name}. Useful, and sobering.`,`${N(t)} scrambled up for a view and spotted a thread of smoke: ${N(o)}, over by ${HG.ZONES[o.zone].short}.`,`${N(t)} watched ${HG.ZONES[o.zone].name} for an hour and learned how ${N(o)} moved.`,`Through a gap in the terrain, ${N(t)} caught a glimpse of ${N(o)} and filed it away.`,`${N(t)} found a boot print, followed it a short way, and saw ${N(o)} in the distance.`,`Crouched in a drainage ditch, ${N(t)} counted ${N(o)}'s movements until they made a pattern.`,`${N(t)} heard ${N(o)} before seeing ${HG.ZONES[o.zone].short}, and kept very still.`]):`${N(t)} surveyed the arena and saw only empty ground.`,'plain',[t.id].concat(o?[o.id]:[]));});
ev('fire','solo',(S,c)=>S.tw('longnight')?0:(c.t.stl<6||c.t.sanity<45?.6:.15)*(c.t.fed<40||c.t.hyd<40?.5:1),(S,c)=>{const t=c.t;S.fires.add(t.zone);t.sanity=clamp(t.sanity+6,0,100);
 S.say(S.V('fire',[`${N(t)} lit a fire. It was warm, it was bright, and it could be seen from half the arena.`,`The smell of woodsmoke drifted out of ${Z(t).name}. ${N(t)} had decided warmth mattered more than hiding.`,`${N(t)} fed a small fire all night and told ${t.p.r} nobody was close enough to see it.`]),'plain',[t.id]);},'night');
ev('nightmare','solo',(S,c)=>c.t.sanity<55?1.8:.1,(S,c)=>{const t=c.t;t.sanity=clamp(t.sanity-6,0,100);
 const l=t.sanity<25&&chance(.4);if(l)S.hurt(t,ri(5,10),null);S.say(l?`${N(t)} heard voices calling from the dark and followed them into the trees. ${sub(t)} came back scratched and shaking.`:S.V('night',[`${N(t)} woke screaming at a threat that was not there.`,`${N(t)} saw a familiar face at the edge of the dark, and then remembered where ${t.p.s} was.`,`Sleep would not come for ${N(t)}; neither would silence.`]),'plain',[t.id]);},'night');
ev('quiet','solo',(S,c)=>.3,(S,c)=>{const t=c.t;t.sanity=clamp(t.sanity+3,0,100);
 S.say(S.V('quiet',[`${N(t)} ${t.tic}, a habit left over from life as ${t.bg}.`,`No one was watching, but ${N(t)} ${t.tic} anyway.`,`${N(t)} ${t.tic}. Being ${t.bg} had taught ${t.p.o} patience, and patience was the only thing left to spend.`,`${N(t)} sat very still for a while, listening. The arena listened back.`,`For a few quiet minutes, ${N(t)} did nothing at all, which was its own kind of strategy.`,`${N(t)} ${t.tic}. It did not help, but it did not hurt.`,`${N(t)} counted ${t.p.p} supplies twice and did not like the total either time.`]),'plain',[t.id],null,true);});
ev('atmos','solo',(S,c)=>.14,(S,c)=>{const t=c.t;S.say(`${pick(Z(t).flav)} ${N(t)} kept moving.`,'plain',[t.id],null,true);});
const GIFTS={med:[['herbs',150],['medkit',300]],food:[['rations',120],['bread',110]],armor:[['vest',380]],boost:[['stims',260]],serum:[['serum',330]],water:[['waterskin',90]],weapon:[['sling',160],['knife',220],['hatchet',280],['spear',300],['machete',340],['bow',450],['sword',520]],tool:[['binocs',200],['flint',110],['wire',100]]};
function need(S,t){const n=[];if(t.hp<60)n.push('med');if(t.fed<40)n.push('food');if(t.hyd<40)n.push('water');if(!S.weapon(t))n.push('weapon');return n;}
ev('sponsor','solo',(S,c)=>{const t=c.t;if(S.day<1||!S.o.sponsors)return 0;const nd=need(S,t);if(t.fund<90)return 0;const aud=S.tw("audience")?2:1;
 if(nd.length)return S.o.sponsors*Math.min(nd.length,2)*(t.fund/200)*aud*1.1;
 if(t.fund<260)return 0;return S.o.sponsors*(t.fund/520)*aud*(1+t.fame*.08)*.9;},(S,c)=>{const t=c.t;const nd=need(S,t);let kind;
 if(nd.length){kind=t.hp<35&&nd.includes('med')?'med':pick(nd);}else{const opts=[];if(!t.items.some(i=>i.kind==='armor'&&i.uses>0))opts.push('armor','armor');opts.push('boost');const w=S.weapon(t);if(!w||w.atk<5)opts.push('weapon');if(t.hp<95)opts.push('serum');kind=pick(opts);}
 let menu=GIFTS[kind].filter(g=>g[1]<=t.fund);if(kind==='weapon'){const w=S.weapon(t);menu=menu.filter(g=>HG.ITEMS[g[0]].atk>(w?w.atk:0));}
 if(kind==='med'&&t.hp<45&&t.fund>=330)menu=[['serum',330]];if(!menu.length)return;
 const pickd=chance(.65)?menu[menu.length-1]:pick(menu);const it=S.give(t,pickd[0]);const cost=pickd[1];t.fund-=cost;t.spent+=cost;t.gifts.push(it.n);S.gl.push({id:t.id,item:it.n,cost,patron:t.patron});t.fame=Math.max(0,t.fame-1);
 const P_=t.patron;S.say(S.V('spons',[`A silver drone drop drifted down to ${N(t)}: a ${it.n}. ${P_} had put ${cost} credits behind it.`,`${N(t)} did something the audience liked, and ${P_} paid for it: a ${it.n}, ${cost} credits.`,`Out of the empty sky, a drone drop. Inside, a ${it.n} and a note from ${P_} that ${N(t)} read twice and burned.`,`The Syndicate was feeling generous. ${P_} sent ${N(t)} a ${it.n}, and the price was ${cost} credits.`,`A gift reached ${N(t)} just in time: a ${it.n}, courtesy of ${P_}.`,`${N(t)} had been noticed. ${P_} spent ${cost} credits on a ${it.n} to prove it.`]),'gift',[t.id]);});
ev('serum','solo',(S,c)=>{const t=c.t;return t.hp<50&&t.items.some(i=>i.kind==='serum'&&i.uses>0)?6:0;},(S,c)=>{const t=c.t;const it=t.items.find(i=>i.kind==='serum'&&i.uses>0);it.uses--;t.items=t.items.filter(i=>i!==it);t.hp=Math.min(100,t.hp+65);t.inj=[];S.say(S.V('serum',[`${N(t)} jammed the field serum into ${t.p.p} thigh and watched the wounds close. ${t.p.s[0].toUpperCase()+t.p.s.slice(1)} could breathe again.`,`${N(t)} cracked the serum vial. Within a minute, ${t.p.p} hands stopped shaking and the bleeding stopped.`,`The serum burned like acid and worked like a miracle. ${N(t)} was back on ${t.p.p} feet.`]),'plain',[t.id]);});
ev('dry','solo',(S,c)=>{const t=c.t;if(S.day<2||!S.o.sponsors||!need(S,t).length||t.fund>=80||t.dryDay===S.day)return 0;return .1;},(S,c)=>{const t=c.t;t.dryDay=S.day;t.fame=Math.max(0,t.fame-1);const P_=t.patron;S.say(S.V('dry',[`${N(t)} looked up and waited for a drone drop. ${P_} had stopped answering.`,`No gift came for ${N(t)}. The Syndicate's money had moved on.`,`${N(t)} needed help, and the sponsors were busy backing someone else.`,`${N(t)} held up a hand to the sky, as if that might shake something loose. Nothing fell.`]),'plain',[t.id]);});
ev('cache','solo',(S,c)=>(S.day>0?.12:0)*(Z(c.t).cover+.3),(S,c)=>{const t=c.t;const id=pick(['rations','waterskin','knife','herbs','wire','tarp','flint','binocs','sling']);const it=S.give(t,id);
 S.say(S.V('cache',[`${N(t)} stumbled over a half-buried supply pod and pulled out a ${it.n}.`,`A hollow tree hid a cache. ${N(t)} left with a ${it.n} and a new respect for luck.`,`${N(t)} noticed a patch of freshly turned earth. Underneath: a ${it.n}.`]),'gift',[t.id]);});
ev('salvage','solo',(S,c)=>S.drops.some(d=>d.zone===c.t.zone)?1.6:0,(S,c)=>{const t=c.t;const d=S.drops.find(x=>x.zone===t.zone);S.drops=S.drops.filter(x=>x!==d);t.items.push(d.item);const v=S.T[d.from];t.sanity=clamp(t.sanity-3,0,100);
 S.say(S.V('salv',[`${N(t)} found what ${N(v)} had left behind: a ${d.item.n}, still warm from the pack.`,`${N(v)}'s abandoned camp had one useful thing left in it: a ${d.item.n}. ${N(t)} took it and did not linger.`,`${N(t)} picked through ${N(v)}'s last campsite and came away with a ${d.item.n}.`]),'gift',[t.id,v.id]);});
ev('mishap','solo',(S,c)=>.1+(night(S)?.06:0),(S,c)=>{const t=c.t;const m=pick([['fell from a rotten branch','a wrenched back','fall'],['stepped on a nest of wasps','wasp stings across the neck','wasps'],['was caught by a small rockslide','a crushed foot','rockslide'],[night(S)?'met a copperhead in the dark':'put a hand down on a sunning copperhead','a snakebite on the ankle','snakebite']]);
 S.hurt(t,ri(12,28),m[1],2);if(t.hp<=0){S.kill(t,null,m[2]);S.say(`${N(t)} ${m[0]}, and that was the end of it.`,'death',[t.id]);}else S.say(`${N(t)} ${m[0]} and got away with ${m[1]}.`,'hurt',[t.id]);});
ev('grief','solo',(S,c)=>c.t.grief!=null?4:0,(S,c)=>{const t=c.t;const v=S.T[t.grief];t.grief=null;t.sanity=clamp(t.sanity-8,0,100);
 S.say(S.V('grief',[`${N(t)} sat very still for a long time, thinking about ${N(v)}.`,`${N(t)} kept turning to say something to ${N(v)}, then remembering.`,`The flatline had been for ${N(v)}. ${N(t)} had not stopped hearing it.`]),'plain',[t.id,v.id]);});
})(HG);
(function(HG){
const {rand,ri,pick,chance,clamp}=HG;const N=HG.N;
const ev=(id,k,w,run,ph)=>HG.EVENTS.push({id,k,w,run,ph:ph||null});
const same=(t,o)=>t.ally!=null&&t.ally===o.ally;
const host=(t,o)=>!same(t,o);
const cap=s=>s[0].toUpperCase()+s.slice(1);
ev('ambush','duo',(S,c)=>{const{t,o}=c;if(!host(t,o))return 0;return (t.tr.aggr*1.4+.15)*(o.tr.aggr<.3?1.45:1)*(t.stl>5?1.3:1)*(S.weapon(t)?1.3:.6)*(1+(t.grudge[o.id]||0)*.3)*(t.edge?1.6:1)*(t.intel===o.id?1.5:1)*(S.phase==='night'?1.2:1);},(S,c)=>{const{t,o}=c;
 t.edge=false;const d=S.duel(t,o,{ambush:true});const win=d.w===t;
 const pre=win?S.V('amb',[`${N(t)} had been tracking ${N(o)} since the last flatline.`,`${N(o)} never heard ${N(t)} coming.`,`${N(t)} waited in the brush until ${N(o)} turned ${o.p.p} back.`,`${N(t)} chose the moment, and the moment chose ${N(o)}.`,`${N(t)} followed ${N(o)}'s tracks until they stopped being careful.`]):S.V('ambr',[`${N(t)} crept up on ${N(o)}, but ${N(o)} had been listening the whole time.`,`${N(t)} thought ${N(o)} was alone. ${N(o)} had been waiting for company.`,`The ambush went wrong the moment ${N(o)} turned around.`,`${N(t)} struck first and ${N(o)} struck back harder.`]);
 S.say(`${pre} ${d.text}`,d.killed?'death':'fight',[t.id,o.id]);});
ev('clash','duo',(S,c)=>{const{t,o}=c;if(!host(t,o))return 0;return (.3+t.tr.aggr*.5)*(.5+o.tr.aggr*.5)*(HG.ZONES[t.zone].cover<.4?1.3:.8);},(S,c)=>{const{t,o}=c;
 const pre=S.V('clash',[`${N(t)} and ${N(o)} came around opposite sides of the same boulder.`,`Neither ${N(t)} nor ${N(o)} had planned to be here. Neither backed down.`,`${N(t)} and ${N(o)} met on open ground with nowhere good to run.`,`A branch snapped. ${N(t)} and ${N(o)} saw each other at the same moment.`,`${N(o)} rounded a bend and walked straight into ${N(t)}.`]);
 const d=S.duel(t,o);S.say(`${pre} ${d.text}`,d.killed?'death':'fight',[t.id,o.id]);});
ev('chase','duo',(S,c)=>{const{t,o}=c;return host(t,o)?(.45+(1-t.tr.mercy)*.4)*(1+(t.grudge[o.id]||0)*.2):0;},(S,c)=>{const{t,o}=c;
 if(t.spd+rand()*4>o.spd+rand()*4+1){const d=S.duel(t,o,{ambush:true,force:true});S.say(`${S.V('chs',[`${N(o)} bolted and ${N(t)} ran ${o.p.o} down.`,`${N(o)} ran. ${N(t)} was faster.`,`It was a short chase and a bad one for ${N(o)}.`])} ${d.text}`,d.killed?'death':'fight',[t.id,o.id]);}
 else{const adj=HG.ZONES[o.zone].adj.filter(z=>!S.closed.has(z));if(adj.length)o.zone=pick(adj);const drop=o.items.find(i=>i.kind!=='weapon');let tx=S.V('chsl',[`${N(t)} chased ${N(o)} across open ground and lost ${o.p.o} in the terrain.`,`${N(o)} ran, doubled back, and vanished. ${N(t)} spent an hour on a trail that went nowhere.`,`${N(t)} gave chase, but ${N(o)} knew the ground better and slipped away.`,`${N(o)} threw something to slow ${N(t)} down and was gone by the time ${N(t)} looked up.`]);
  if(drop&&chance(.5)){o.items=o.items.filter(i=>i!==drop);t.items.push(drop);tx+=` ${N(o)} dropped the ${drop.n} in the panic, and ${N(t)} kept it.`;}S.say(tx,'plain',[t.id,o.id]);}});
ev('steal','duo',(S,c)=>{const{t,o}=c;return host(t,o)&&o.items.length?(t.stl/7)*.7*(o.items.length>1?1.2:1):0;},(S,c)=>{const{t,o}=c;const it=pick(o.items);const nt=S.phase==='night';
 if(t.stl+rand()*5>o.smt+rand()*4+1){o.items=o.items.filter(i=>i!==it);t.items.push(it);S.say(S.V(nt?'stn':'std',nt?[`${N(t)} slipped into ${N(o)}'s camp while ${o.p.s} slept and walked out with the ${it.n}.`,`In the dark, ${N(t)} lifted the ${it.n} from beside ${N(o)}'s sleeping hand.`]:[`While ${N(o)} was off checking the perimeter, ${N(t)} lifted the ${it.n} and was gone.`,`${N(t)} waited for ${N(o)} to look the other way, then took the ${it.n} like it had never been there.`]),'plain',[t.id,o.id]);}
 else{const d=S.duel(o,t,{lethal:.6});S.say(`${S.V('stl2',[`${N(t)} reached for ${N(o)}'s ${it.n} and found ${o.p.o} already awake.`,`${N(o)}'s eyes opened the moment ${N(t)}'s fingers closed on the ${it.n}.`,`A floorboard of leaves gave ${N(t)} away as ${t.p.s} went for ${N(o)}'s ${it.n}.`])} ${d.text}`,d.killed?'death':'fight',[t.id,o.id]);}});
ev('ally','duo',(S,c)=>{const{t,o}=c;if(!S.o.alliances||!host(t,o)||S.alive().length<5||S.phase==='bloodbath')return 0;if((t.ally!=null&&S.allies(t).length>=3)||(o.ally!=null&&S.allies(o).length>=3))return 0;
 return (t.soc/6)*(t.tr.loy+.25)*(o.tr.loy+.25)*(((t.grudge[o.id]||0)+(o.grudge[t.id]||0))>0?0:1)*(S.day<4?1.2:.6);},(S,c)=>{const{t,o}=c;
 if(t.soc+rand()*4>o.tr.caut*5+rand()*3){S.join(t,o);S.say(S.V('ally',[`${N(t)} approached ${N(o)} with open hands and a half-smile. Within the hour they were trading watch schedules.`,`It started as a standoff and ended as a handshake: ${N(t)} and ${N(o)} agreed to stay alive together, for now.`,`${N(t)} offered ${N(o)} a deal. ${N(o)} thought about it for a very long time, then took it.`]),'ally',[t.id,o.id]);}
 else{S.say(`${N(t)} tried to make peace with ${N(o)}. ${N(o)} wanted none of it and walked away without turning around.`,'plain',[t.id,o.id]);}});
ev('parley','duo',(S,c)=>host(c.t,c.o)?(c.t.tr.caut+.2)*.7:0,(S,c)=>{const{t,o}=c;S.say(S.V('parley',[`${N(t)} and ${N(o)} stared each other down over twenty yards of nothing, then both backed away. Neither slept well.`,`${N(t)} lifted a weapon. ${N(o)} lifted a weapon. A long, shaking minute later, both lowered them.`,`A look, a nod, and ${N(t)} and ${N(o)} went their separate ways. Nobody wanted to be the first to start.`,`${N(t)} held up an empty hand. ${N(o)} backed off slowly. Neither turned around until the trees hid the other.`,`${N(t)} and ${N(o)} traded a long, flat stare, and then the arena let them both walk.`]),'plain',[t.id,o.id]);});
ev('mercy','duo',(S,c)=>{const{t,o}=c;return host(t,o)?t.tr.mercy*1.4*(o.hp<65?1.5:.5)*(t.hp>o.hp?1:.4):0;},(S,c)=>{const{t,o}=c;S.bond(t,o,4);o.fame+=1;t.fame+=1;S.pay(t,ri(25,45));S.pay(o,ri(10,25));
 S.say(S.V('mercy',[`${N(t)} had ${N(o)} on the ground and a weapon at ${o.p.p} throat. ${N(t)} lowered it, said \"Run,\" and meant it.`,`${N(o)} closed ${o.p.p} eyes and waited. ${N(t)} walked away instead. The audience would talk about it for days.`,`${N(t)} could have ended it. Instead ${N(t)} left a ration pack beside ${N(o)} and disappeared into the trees.`]),'ally',[t.id,o.id]);});
ev('share','duo',(S,c)=>{const{t,o}=c;if(!(same(t,o)||(t.bond[o.id]||0)>=3))return 0;const food=S.has(t,'food')||S.has(t,'water');return food&&(o.fed<50||o.hyd<50)?(t.tr.mercy+.3)*1.5:0;},(S,c)=>{const{t,o}=c;const f=S.has(t,'food'),w=S.has(t,'water');if(f){S.use(t,f);o.fed=clamp(o.fed+40,0,100);}else{S.use(t,w);o.hyd=clamp(o.hyd+40,0,100);}S.bond(t,o,2);
 S.say(S.V('share',[`${N(t)} split the last of the ${f?f.n:w.n} with ${N(o)} without being asked.`,`${N(o)} was shaking with hunger. ${N(t)} pushed the ${f?f.n:w.n} across the dirt and said nothing.`]),'ally',[t.id,o.id]);});
ev('argue','duo',(S,c)=>{const{t,o}=c;return same(t,o)?(1-t.tr.loy)*.9*(S.alive().length<10?1.6:1):0;},(S,c)=>{const{t,o}=c;S.bond(t,o,-3);
 if((t.bond[o.id]||0)<=0&&chance(.6)){S.leave(t);S.say(`${N(t)} and ${N(o)} argued over who had been pulling their weight. It ended with ${N(t)} walking off alone.`,'plain',[t.id,o.id]);}else S.say(S.V('argue',[`${N(t)} and ${N(o)} snapped at each other over a shared canteen. They made up, mostly.`,`An old resentment surfaced between ${N(t)} and ${N(o)}. The alliance held, but it creaked.`]),'plain',[t.id,o.id]);});
ev('betray','duo',(S,c)=>{const{t,o}=c;if(!same(t,o)||(t.bound&&o.bound&&t.district===o.district))return 0;const n=S.alive().length;return (1-t.tr.loy)*t.tr.aggr*(n<8?2.2:.35)*((t.bond[o.id]||0)<5?1:.3);},(S,c)=>{const{t,o}=c;S.leave(t);
 const pre=S.V('betr',[`${N(t)} shared the last of the food with ${N(o)}, waited for an opening, and then took everything.`,`${N(o)} turned ${o.p.p} back, trusting ${N(t)}. It was the last mistake ${N(o)} made as an ally.`,`The alliance had always had an expiration date. ${N(t)} simply chose the day.`]);
 const d=S.duel(t,o,{ambush:true,lethal:1.25});S.say(`${pre} ${d.text}`,d.killed?'death':'fight',[t.id,o.id]);});
ev('revenge','duo',(S,c)=>{const{t,o}=c;return host(t,o)?Math.min(5,(t.grudge[o.id]||0))*.9:0;},(S,c)=>{const{t,o}=c;t.grudge[o.id]=0;
 const d=S.duel(t,o,{ambush:true,lethal:1.2});S.say(`${N(t)} had been looking for ${N(o)} ever since the flatline sounded. ${d.text}`,d.killed?'death':'fight',[t.id,o.id]);});
ev('heal','duo',(S,c)=>{const{t,o}=c;return (same(t,o)||(t.bond[o.id]||0)>=3)&&o.inj.length?(t.tr.mercy+.3)*(S.has(t,'med')?2:.8):0;},(S,c)=>{const{t,o}=c;const m=S.has(t,'med');const w=o.inj.sort((a,b)=>b.sev-a.sev)[0];
 if(m)S.use(t,m);o.inj=o.inj.filter(i=>i!==w);o.hp=clamp(o.hp+(m?20:10),0,100);S.bond(t,o,2);
 S.say(S.V('heal',[`${N(t)} knelt beside ${N(o)} and tended ${w.name} ${m?'with the '+m.n:'with whatever was on hand'}.`,`${N(o)} could barely stand. ${N(t)} took the weight and walked ${o.p.o} to cover.`]),'heal',[t.id,o.id]);});
ev('confide','duo',(S,c)=>{const{t,o}=c;return same(t,o)||(t.bond[o.id]||0)>=2?(S.phase==='night'?1.4:.5):0;},(S,c)=>{const{t,o}=c;S.bond(t,o,2);t.sanity=clamp(t.sanity+8,0,100);o.sanity=clamp(o.sanity+8,0,100);
 S.say(S.V('conf',[`${S.phase==='night'?'Under a cold sky':'In a rare quiet stretch'}, ${N(t)} told ${N(o)} what life had been like as ${t.bg}. ${N(o)} listened without interrupting.`,`${N(o)} asked ${N(t)} what ${t.p.s} would do if ${t.p.s} won. ${N(t)} had no answer, and then a small one.`,`${N(t)} and ${N(o)} traded the names of everyone they missed, one by one, until it got too heavy.`]),'ally',[t.id,o.id]);});
ev('poison','duo',(S,c)=>{const{t,o}=c;return host(t,o)&&S.has(t,'poison')?(t.tr.caut+.4)*1.6:0;},(S,c)=>{const{t,o}=c;const p=S.has(t,'poison');S.use(t,p);
 if(o.smt+rand()*4<7){S.kill(o,t,'nightlock');S.say(`${N(t)} left a handful of berries where ${N(o)} would find them. ${N(o)} was hungry enough not to ask why they were so ripe.`,'death',[t.id,o.id]);}
 else S.say(`${N(o)} sniffed the berries ${N(t)} had left out, thought about it, and threw them in the river. ${N(t)} watched from the trees, unseen.`,'plain',[t.id,o.id]);});
ev('packhunt','grp',(S,c)=>(c.grp.some(x=>x.fed<65)?1.2:.2)*HG.ZONES[c.t.zone].food,(S,c)=>{c.grp.forEach(x=>x.fed=clamp(x.fed+35,0,100));S.say(`${HG.list(c.grp.map(N))} worked as one: one flushed the game, the others closed the net. Dinner was a rare thing.`,'ally',c.grp.map(x=>x.id));});
ev('gang','grp',(S,c)=>c.o&&host(c.t,c.o)&&c.grp.length>=2?(1.1+c.t.tr.aggr):0,(S,c)=>{const g=c.grp.slice().sort((a,b)=>S.power(b)-S.power(a));const a=g[0],b=g[1],o=c.o;
 const d=S.duel(a,o,{ambush:true,lethal:1.5});S.say(`${N(a)} and ${N(b)} cornered ${N(o)} at the edge of ${HG.ZONES[o.zone].name}. ${d.text}`,d.killed?'death':'fight',[a.id,b.id,o.id]);});
ev('split','grp',(S,c)=>S.alive().length<=6?2.4:.05,(S,c)=>{c.grp.forEach(x=>S.leave(x));S.say(`${HG.list(c.grp.map(N))} stood at a fork in the trail. The alliance ended with a nod nobody believed, and footprints leading in different directions.`);});
ev('campfire','grp',(S,c)=>S.phase==='night'?.9:0,(S,c)=>{c.grp.forEach(x=>{x.sanity=clamp(x.sanity+6,0,100);});for(let i=1;i<c.grp.length;i++)S.bond(c.grp[0],c.grp[i],1);
 S.say(S.V('camp',[`${HG.list(c.grp.map(N))} traded watches and, for one night, almost forgot where they were.`,`Somebody told a bad joke. ${HG.list(c.grp.map(N))} laughed too loudly and then went quiet together.`]),'ally',c.grp.map(x=>x.id));});
})(HG);
(function(HG){
const {rand,ri,pick,chance,clamp,shuffle,wpick}=HG;const N=HG.N;const P=HG.Sim.prototype;
HG.list=a=>a.length<2?a.join(''):a.slice(0,-1).join(', ')+' and '+a[a.length-1];
const L=ts=>HG.list(ts.map(N));HG.L=L;
P.snap=function(){return this.T.map(t=>({fund:t.fund,id:t.id,alive:t.alive,hp:Math.round(t.hp),zone:t.zone,kills:t.kills.length,inj:t.inj.map(i=>i.name),items:t.items.map(i=>i.n),ally:t.ally,fed:Math.round(t.fed),hyd:Math.round(t.hyd),sanity:Math.round(t.sanity)}));};
P.lastOne=function(){const al=this.alive();return al.length<=1||(this.o.districtWin&&al.every(t=>t.district===al[0].district));};
P.same=(a,b)=>a.ally!=null&&a.ally===b.ally;
P.safeKill=function(t,k,cause){if(this.alive().length<=1){t.hp=Math.max(t.hp,6);return false;}this.kill(t,k,cause);return true;};
P.next=function(){
 if(this.over)return null;
 if(this.n===0){this.phase='bloodbath';this.day=0;}else if(this.phase==='bloodbath'||this.phase==='night'){this.phase='day';this.day++;}else this.phase='night';
 this.n++;this.buf=[];this.gl=[];this.cannons=[];this.lastC=0;this.T.forEach(t=>t.acted=false);
 if(this.phase==='bloodbath')this.bloodbath();
 else{this.upkeep();if(!this.lastOne())this.arena();if(!this.lastOne())this.move();if(!this.lastOne())this.actions();}
 this.fires=new Set();
 this.flushShocks();
 const al=this.alive();if(this.lastOne()){this.over=true;this.victors=al;this.victor=al[0]||null;}
 const title=this.phase==='bloodbath'?'The Cull':(this.phase==='day'?'Day ':'Night ')+this.day;
 const rec={n:this.n,day:this.day,phase:this.phase,title,events:this.buf,cannons:this.cannons.slice(),snap:this.snap(),alive:al.length,gifts:this.gl.slice(),board:al.slice().sort((a,b)=>b.fund-a.fund).slice(0,5).map(t=>({id:t.id,fund:t.fund}))};this.phases.push(rec);return rec;};
const DEATH={dehydration:t=>[`${N(t)} had gone too long without water. The flatline fired at dawn over a very quiet body.`,`Thirst finished what the arena started. ${N(t)} died where ${t.p.s} had fallen.`],
 starvation:t=>[`${N(t)} ran out of everything, hunger last of all.`,`${N(t)} starved slowly, and the audience watched every hour of it.`],
 infection:t=>[`The wound would not close. ${N(t)} faded in a fever, muttering the name of home.`,`${N(t)}'s infection won the long argument.`],
 wounds:t=>[`${N(t)} bled out slowly, alone, with nobody to hear.`,`The wounds caught up with ${N(t)} at last.`]};
P.upkeep=function(){const day=this.phase==='day';this.alive().forEach(t=>this.pay(t,(ri(6,16)+t.fame*4+t.soc*2+(t.hp<40?8:0))*(this.tw('audience')?1.6:1)));
 this.alive().forEach(t=>{const sc=this.tw('scarcity');t.fed-=(day?9:6)*(t.sick?1.4:1)*(sc?1.35:1);t.hyd-=(day?14:9)*(sc?1.25:1);if(t.fed<=0){t.fed=0;t.hp-=12;}if(t.hyd<=0){t.hyd=0;t.hp-=18;t.thirstTurns++;}else t.thirstTurns=0;
  let inf=false;t.inj.forEach(i=>{t.hp-=i.sev*2.5;i.age++;if(i.sev>=2&&i.age>=2&&!inf&&!t.inj.some(x=>x.name==='an infection')&&chance(.28))inf=true;});
  if(inf)t.inj.push({name:'an infection',sev:2,age:0});if(t.sick>0){t.hp-=5;t.sick--;}
  t.sanity=clamp(t.sanity-(day?1:3)-(t.hp<30?3:0),0,100);if(t.fed>50&&t.hyd>50&&!t.inj.length)t.hp=clamp(t.hp+6,0,100);t.hp=Math.min(t.hp,100);});
 this.alive().forEach(t=>{if(t.hp<=0){const cause=t.hyd<=0?'dehydration':t.fed<=0?'starvation':t.inj.some(i=>i.name==='an infection')?'infection':'wounds';
  if(this.safeKill(t,null,cause))this.say(this.V('upk'+cause,DEATH[cause](t)),'death',[t.id]);}});};
P.arena=function(){
 if(this.o.closing&&(this.tw('tide')?this.day>=2:(this.phase==='day'&&this.day>=3))){const z=HG.CLOSE.find(x=>!this.closed.has(x));if(z&&this.alive().length>2){this.closed.add(z);const Zn=HG.ZONES[z].name;
  this.say(this.V('close',[`A tone sounded across the arena. By nightfall ${Zn} would be uninhabitable: a wall of grey fog was rolling in from its edges.`,`The ground in ${Zn} began to split. The Overseers wanted everyone elsewhere, and soon.`,`A Syndicate voice announced the closure of ${Zn}. Not a suggestion.`,`Flares of warning smoke went up around ${Zn}. Anyone still there had until dark.`,`${Zn} was being taken away from them. The Overseers made sure everyone knew it.`,`A horn blew three times over ${Zn}. The message needed no translation.`,`The Overseers sealed ${Zn} at nightfall's edge, and the edges began to move inward.`]),'gm',[]);
  const esc=[];this.inZone(z).forEach(t=>{const adj=HG.ZONES[z].adj.filter(x=>!this.closed.has(x));const to=adj.length?pick(adj):'horn';
   if(t.spd+rand()*5<7){t.hp-=ri(18,32);t.inj.push({name:'burned lungs',sev:2,age:0});if(t.hp<=0&&this.safeKill(t,null,'the closing zone')){this.say(`${N(t)} was too slow. The fog took ${t.p.o} before ${t.p.s} reached the edge.`,'death',[t.id]);return;}
    t.zone=to;this.say(this.V('clh',[`${N(t)} ran, but not fast enough, and staggered clear coughing.`,`${N(t)} reached the edge with burning lungs and fell through it on hands and knees.`]),'hurt',[t.id]);}
   else{t.zone=to;esc.push(t);}});
  if(esc.length)this.say(esc.length>1?this.V('clg',[`${HG.L(esc)} outran the fog with seconds to spare.`,`${HG.L(esc)} cleared the edge just ahead of the fog and did not look back.`]):this.V('cls',[`${N(esc[0])} outran the fog with seconds to spare.`,`${N(esc[0])} cleared the edge just ahead of the fog and did not look back.`]),'plain',esc.map(x=>x.id));}}
 if(this.day>=12&&this.alive().length>1){const v=this.alive().sort((a,b)=>this.power(a)-this.power(b))[0];this.alive().forEach(t=>t.zone='horn');
  if(this.safeKill(v,null,'Overseer hounds'))this.say(`The Overseers lost patience. Engineered hounds poured onto the plain and ${N(v)}, the weakest in sight, was caught first.`,'death',[v.id]);}
 if(this.day===3&&this.phase==='day'&&!this.feastOn){this.feastOn=true;this.say(`A voice rolled across the arena: a feast awaits at ${HG.ZONES.horn.name} tonight. Everything you need, for those brave enough to come and get it.`,'gm',[]);}
 if(this.day===3&&this.phase==='night'&&this.feastOn&&!this.feastDone){this.feastDone=true;this.feast();}
 const hr=.2*this.o.hazards*(this.tw('menagerie')?2.2:1)*(this.tw('longnight')?(this.phase==='night'?2:.4):1);
 if(chance(hr)&&this.alive().length>3){this.hazard();if(this.tw('menagerie')&&chance(.4)&&this.alive().length>3)this.hazard();}
 if(this.tw('audience')&&this.phase==='day'&&this.day>=2&&chance(.45)&&this.alive().length>3)this.poll();};
P.poll=function(){const al=this.alive();const m=Math.min.apply(null,al.map(t=>t.fame));const v=HG.pick(al.filter(t=>t.fame===m));
 this.say(`The Syndicate polled its viewers, and the least-loved contestant was ${N(v)}. Engineered hounds were released within sight of ${v.p.o}.`,'gm',[v.id]);
 v.hp-=HG.ri(24,40);v.inj.push({name:'hound bites',sev:2,age:0});if(v.hp<=0||(v.spd+HG.rand()*5<6&&HG.chance(.4))){if(this.safeKill(v,null,'Syndicate hounds')){this.say(`${N(v)} was run to ground by the pack.`,'death',[v.id]);return;}}
 this.say(`${N(v)} fought clear of the hounds, bloodied and furious.`,'hurt',[v.id]);};
P.flushShocks=function(){this.shocks.forEach(s=>{const a=this.T[s[0]],b=this.T[s[1]];if(a.alive)this.say(`${N(a)} felt the bond to ${N(b)} snap like a cut rope and dropped to one knee.`,'hurt',[a.id,b.id]);});this.shocks=[];};
HG.digest=function(S,rec){const T=S.T,L=HG.L;let a_=((S.o.seed|0)*2654435761+rec.n*40503)>>>0;const rr=()=>{a_=(a_+0x6D2B79F5)>>>0;let t=a_;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return((t^t>>>14)>>>0)/4294967296;};
 S.dvc=S.dvc||{};const V=(key,arr)=>{const w=arr.map((_,i)=>1/(1+Math.pow(S.dvc[key+i]||0,2)*1.6));let tot=w.reduce((x,y)=>x+y,0),r=rr()*tot,k=0;for(;k<arr.length-1;k++){r-=w[k];if(r<=0)break;}S.dvc[key+k]=(S.dvc[key+k]||0)+1;return arr[k];};const c=rec.cannons.map(id=>T[id]);const ph=rec.phase,pw=ph==='night'?'night':'day';
 const horn=HG.ZONES.horn.name;const tot=T.length;
 const kc={};c.forEach(v=>{if(v.killer!=null)kc[v.killer]=(kc[v.killer]||0)+1;});
 const top=Object.keys(kc).sort((a,b)=>kc[b]-kc[a])[0];
 let hl;
 if(ph==='bloodbath')hl=c.length>=tot*.45?V('dh0',['Blood on the grass','The Cache ate well','A massacre']):c.length>=tot*.2?V('dh1',['A brutal opening','Carnage at the horn']):V('dh2',['A cautious start','The Syndicate wanted more']);
 else hl=c.length===0?V('dq0',pw==='night'?['A quiet night','Nobody fell tonight','The dark let everyone live']:['A quiet day','Nobody fell today','A day of small mercies']):c.length===1?V('dq1',['One flatline','A single fall','Down to one fewer']):c.length<=3?V('dq2',['A rough stretch','The flatlines kept coming','Blood was spilled']):V('dq3',['A slaughter','No one was safe','The sky never stopped booming']);
 const out=[];
 if(ph==='bloodbath')out.push(c.length?V('do0',[`The gong sounded, and ${c.length} of ${tot} contestants never left ${horn}.`,`${c.length} of ${tot} contestants fell at the opening gong.`,`The first minute at ${horn} took ${c.length} of ${tot} contestants.`]):`The gong sounded and, somehow, everyone walked away.`);
 else out.push(c.length?V('do1',[`${c.length===1?'One contestant':c.length+' contestants'} did not live to see the next phase.`,`The ${pw} cost ${c.length===1?'one contestant':c.length+' contestants'}.`,`${L(c)} ${c.length===1?'is':'are'} gone.`]):V('do2',[`Nobody died, and the arena felt almost normal. Almost.`,`No flatlines ${pw==='night'?'tonight':'today'}; the contestants kept their heads down.`]));
 if(c.length&&c.length<=5){out.push(V('dd',['The roll call: ','Gone: ','Down: '])+c.map(v=>{const k=v.killer!=null?T[v.killer]:null;return N(v)+(k?' (to '+N(k)+')':' ('+String(v.cause||'the arena').toLowerCase()+')');}).join(', ')+'.');}
 else if(c.length>5){out.push('The cannons: '+c.slice(0,6).map(N).join(', ')+' and '+(c.length-6>0?(c.length-6)+' more':'more')+'.');}
 if(top&&kc[top]>=2)out.push(V('dt',[`${N(T[top])} did most of the damage with ${kc[top]} kills.`,`${N(T[top])} had a busy ${ph==='bloodbath'?'opening':pw}: ${kc[top]} kills.`,`${N(T[top])} is on a roll (${kc[top]} this phase).`]));
 else if(rec.gifts&&rec.gifts.length)out.push(V('dg',[`${rec.gifts.length===1?'A drone drop':rec.gifts.length+' drone drops'} drifted down, worth ${rec.gifts.reduce((a,g)=>a+g.cost,0)} credits.`,`The sponsors spent ${rec.gifts.reduce((a,g)=>a+g.cost,0)} credits on ${L(rec.gifts.map(g=>T[g.id]))}.`]));
 const gm=rec.events.filter(e=>e.type==='gm').length;
 if(gm>=3&&!(top&&kc[top]>=2))out.push(V('dgm',['The Overseers made their presence felt.','The Overseers were busy.','The arena itself fought back.']));
 const al=rec.snap.filter(t=>t.alive);const hurt=al.slice().sort((a,b)=>a.hp-b.hp)[0];
 if(hurt&&hurt.hp<35&&al.length>1)out.push(V('dh',[`${N(T[hurt.id])} is barely hanging on (${hurt.hp} health).`,`Keep an eye on ${N(T[hurt.id])}: ${hurt.hp} health and falling.`]));
 out.push(al.length===1?`One left.`:V('da',[`${al.length} remain.`,`${al.length} still standing.`,`${al.length} to go.`]));
 return {hl,text:out.join(' ')};};
HG.finalDigest=function(S){const T=S.T,N_=N;const items=[];const order=[];S.phases.forEach(p=>p.cannons.forEach(id=>order.push({id,p})));
 const vs=S.victors&&S.victors.length?S.victors:(S.victor?[S.victor]:[]);
 if(vs.length)items.push(['Champion',vs.map(N_).join(' and ')+(vs.length>1?' win together after ':' wins after ')+S.day+' days, '+vs.reduce((a,x)=>a+x.kills.length,0)+' kills, training score '+vs[0].score+' (ranked '+vs[0].rank+' of '+T.length+').']);
 if(order.length){const f=order[0],ft=T[f.id];items.push(['First blood',N_(ft)+(ft.killer!=null?' fell to '+N_(T[ft.killer]):' fell')+' in '+f.p.title+'.']);}
 const bb=S.phases[0];if(bb)items.push(['Opening toll',bb.cannons.length+' of '+T.length+' died in the Cull.']);
 const dp=S.phases.slice(1).slice().sort((a,b)=>b.cannons.length-a.cannons.length)[0];if(dp&&dp.cannons.length>1)items.push(['Deadliest stretch',dp.title+', with '+dp.cannons.length+' flatlines.']);
 const tk=T.slice().sort((a,b)=>b.kills.length-a.kills.length)[0];if(tk&&tk.kills.length)items.push(['Top killer',N_(tk)+', '+tk.kills.length+' kills.']);
 const fav=T.filter(t=>t.rank<=4&&t.deathDay!=null&&!vs.includes(t)).sort((a,b)=>a.deathDay-b.deathDay||a.rank-b.rank)[0];if(fav)items.push(['Biggest flop',N_(fav)+', ranked #'+fav.rank+' in training with a '+fav.score+', out '+(fav.deathDay===0?'in the Cull':'on day '+fav.deathDay)+'.']);
 const ud=order.slice(-4).map(o=>T[o.id]).filter(t=>t.rank>T.length/2&&!vs.includes(t)).sort((a,b)=>b.rank-a.rank)[0];if(ud)items.push(['Underdog run',N_(ud)+' scored a '+ud.score+' (ranked #'+ud.rank+') and still made the final stretch.']);
 const gs=T.slice().sort((a,b)=>b.gifts.length-a.gifts.length)[0];if(gs&&gs.gifts.length)items.push(['Sponsor darling',N_(gs)+', '+gs.gifts.length+(gs.gifts.length===1?' drone drop, ':' drone drops, ')+gs.spent+' credits spent by '+gs.patron+' and friends.']);
 items.push(['Total flatlines',order.length+' across '+(S.phases.length)+' phases.']);
 return items;};
})(HG);
(function(HG){
const {rand,ri,pick,chance,clamp,shuffle,wpick}=HG;const N=HG.N;const P=HG.Sim.prototype;const L=HG.L;
const cap=s=>s[0].toUpperCase()+s.slice(1);
P.hazard=function(){const crowd={};this.alive().forEach(t=>crowd[t.zone]=(crowd[t.zone]||0)+1);if(!HG.HAZARDS.length)return;const h=pick(HG.HAZARDS);const zs=h.z.filter(z=>!this.closed.has(z)&&crowd[z]);if(!zs.length)return;const z=pick(zs);const Zn=HG.ZONES[z].name;
 this.say(this.V('hz'+HG.HAZARDS.indexOf(h),h.ann).replace(/\{zone\}/g,Zn),'gm',[]);
 let dn=0;const esc=[];this.inZone(z).forEach(t=>{const adj=HG.ZONES[z].adj.filter(x=>!this.closed.has(x));
  if(t.spd*.6+t.smt*.4+rand()*5>=h.sev){if(adj.length)t.zone=pick(adj);esc.push(t);}
  else{t.hp-=ri(22,40);t.inj.push({name:h.hurt,sev:2,age:0});if(h.fog)t.sanity-=25;if(t.hp<=0||chance(.18)){if(this.safeKill(t,null,'Overseer hazard')){dn++;this.say(dn===1?HG.fillTx(h.die,t):this.V('hzd',[`${N(t)} did not make it out.`,`${N(t)} was lost to it, and the flatline followed.`,`By the time it passed, ${N(t)} was gone.`,`${N(t)} went down and stayed down.`]),'death',[t.id]);return;}}if(adj.length)t.zone=pick(adj);this.say(this.V('hzh',[`${N(t)} came out of it with ${h.hurt}.`,`${N(t)} was caught, and left with ${h.hurt}.`,`It cost ${N(t)} ${h.hurt} to get clear.`]),'hurt',[t.id]);}});
 if(esc.length===1)this.say(HG.fillTx(h.esc,esc[0]),'plain',[esc[0].id]);else if(esc.length>1)this.say(this.V('hzg',[`${HG.L(esc)} each found a way through it.`,`${HG.L(esc)} scrambled clear, shaken but whole.`,`${HG.L(esc)} made it out, by luck or by nerve.`]),'plain',esc.map(x=>x.id));
 if(h.fog){const vs=this.inZone(z);if(vs.length>=2){const a=vs[0],b=vs[1];const d=this.duel(a,b,{lethal:.7});this.say(`In the haze, ${N(a)} saw a monster where ${N(b)} stood. ${d.text}`,d.killed?'death':'fight',[a.id,b.id]);}}};
P.feast=function(){const at=this.alive().filter(t=>chance(clamp(.2+t.tr.aggr*.25+(!this.weapon(t)?.3:0)+(t.fed<35||t.hyd<35?.2:0)+(t.hp<50?.1:0)-t.tr.caut*.2,.1,.85)));
 if(at.length<2){this.say('The feast went untouched. Nobody trusted it.','gm',[]);return;}
 at.forEach(t=>{t.zone='horn';t.acted=true;});this.say(`${L(at)} each decided need outweighed fear, and converged on ${HG.ZONES.horn.name} under cover of night.`,'gm',at.map(t=>t.id));
 {const gs=at.map(t=>({t,it:this.give(t,pick(this.tw('empty')?['medkit','rations','waterskin','herbs']:['medkit','sword','bow','machete','rations','waterskin','trident']))}));
 const art=n=>(/^[aeiou]/i.test(n)?'an ':'a ')+n;
 const parts=gs.map(g=>`${N(g.t)} ${pick(['grabbed','snatched','scooped up','seized'])} ${art(g.it.n)}`);
 this.say(this.V('fl',[`At the table, ${HG.list(parts)}. Then they vanished into the dark.`,`The table was stripped in seconds: ${parts.join('; ')}.`,`No one lingered. ${HG.list(parts)}, and gone.`]),'gift',at.map(t=>t.id));}
 shuffle(at).forEach(t=>{if(!t.alive||this.lastOne())return;const os=at.filter(x=>x.alive&&x!==t&&!this.same(t,x));if(!os.length)return;const o=pick(os);if(chance(.55)){const d=this.duel(t,o,{lethal:1.15});this.say(`At the feast, ${N(t)} and ${N(o)} reached the last pack at the same time. ${d.text}`,d.killed?'death':'fight',[t.id,o.id]);}});};
P.melee=function(g){this.say(this.V('mel',[`${L(g)} collided at the supply table, and nobody had time to sort friend from foe.`,`A knot of bodies formed around a stack of crates: ${L(g)}, all swinging at once.`,`${L(g)} reached the weapons together. Within seconds it was a brawl.`]),'fight',g.map(t=>t.id));
 let pool=g.slice(),r=0;while(pool.length>1&&r++<5){const a=pick(pool);const b=pick(pool.filter(x=>x!==a));const d=this.duel(a,b,{lethal:1.15});this.say(d.text,d.killed?'death':'fight',[a.id,b.id]);pool=pool.filter(x=>x.alive&&(d.killed||x!==d.l));}};
P.bloodbath=function(){const all=this.T.slice();const hn=HG.ZONES.horn.name;
 this.say(this.V('bbstart',[`The gong sounded. ${all.length} contestants launched off their plates, and everything ${hn} held was suddenly within reach.`,`${all.length} contestants burst off their plates as the countdown hit zero. ${cap(hn)} glittered with everything worth killing for.`]),'gm',[]);
 const rush=[],flee=[];all.forEach(t=>(chance(clamp((.42+t.spd*.02+t.tr.aggr*.35-t.tr.caut*.28)*(.55+.45*this.o.carnage),.12,.95))?rush:flee).push(t));
 while(rush.length<4&&flee.length){rush.push(flee.splice(Math.floor(rand()*flee.length),1)[0]);}
 const grpz={};flee.forEach(t=>{const to=wpick(['forest','lake','meadow','ruins'],z=>({forest:1.4,lake:.9,meadow:.9,ruins:.8})[z]);t.zone=to;(grpz[to]=grpz[to]||[]).push(t);});
 Object.keys(grpz).forEach(z=>{const ns=[],gs=[];grpz[z].forEach(t=>{if(chance(.3)){const it=this.give(t,pick(this.tw('empty')?['rations','waterskin','tarp','herbs','flint']:['rations','waterskin','tarp','herbs','knife','flint']));gs.push([t,it]);}else ns.push(t);});
  if(ns.length)this.say(this.V('bbf'+(ns.length>1?'m':'s'),ns.length>1?[`${L(ns)} bolted for ${HG.ZONES[z].name} with nothing but the clothes they wore.`,`${L(ns)} took one look at the carnage starting and ran the other way, toward ${HG.ZONES[z].name}.`,`Empty-handed and not looking back: ${L(ns)} made for ${HG.ZONES[z].name}.`]:[`${N(ns[0])} sprinted for ${HG.ZONES[z].name} with nothing but the clothes on ${ns[0].p.p} back.`,`${N(ns[0])} did not even glance at ${hn}, and made for ${HG.ZONES[z].name}.`,`${N(ns[0])} ran, and kept running.`]),'plain',ns.map(t=>t.id));
  gs.forEach(([t,it])=>this.say(this.V('bbfi',[`${N(t)} snagged a ${it.n} off the grass and kept running, never looking back.`,`${N(t)} scooped up a ${it.n} on the way out and made for ${HG.ZONES[z].name}.`,`A ${it.n} lay in ${N(t)}'s path. ${N(t)} grabbed it without breaking stride.`]),'gift',[t.id]));});
 const pool=this.tw('empty')?['rations','medkit','waterskin','wire','tarp','flint','binocs','herbs']:HG.WEAPON_POOL;const armed=[];rush.forEach(t=>{if(!this.weapon(t)){armed.push([t,this.give(t,pick(pool))]);}});
 for(let i=0;i<armed.length;i+=4){const ch=armed.slice(i,i+4);this.say(`${pick(['At the table, ','Among the crates, ','Over the supplies, ','In the first scramble, '])}${ch.map((x,j)=>(j===0?N(x[0])+' '+pick(['snatched','seized','wrenched up','came up with','dragged out']):N(x[0]))+' '+(/^[aeiou]/i.test(x[1].n)?'an ':'a ')+x[1].n).join(', ').replace(/, ([^,]*)$/,' and $1')}.`,'gift',ch.map(x=>x[0].id));}
 const gone=new Set();const q=shuffle(rush);while(q.length){const t=q.shift();if(!t.alive)continue;
  const k=q.length>=2&&chance(.3)?(q.length>=3&&chance(.4)?3:2):1;const grp=[t].concat(q.splice(0,k)).filter(x=>x.alive);
  if(grp.length>=3){this.melee(grp);}
  else if(grp.length===2){const a=grp[0],b=grp[1];if(this.same(a,b)){const it=this.give(a,pick(['rations','medkit','waterskin','wire']));this.say(`${N(a)} and ${N(b)} covered each other's backs and cleared a corner of the table, leaving with a ${it.n}.`,'ally',[a.id,b.id]);}
   else{const pre=this.V('bbduel',[`${N(a)} and ${N(b)} went for the same pack, and neither let go.`,`${N(a)} swung at ${N(b)} across a crate and ${N(b)} swung back.`,`${N(b)} saw ${N(a)} reaching for the last good weapon and went for ${a.p.o}.`,`${N(a)} shoved ${N(b)} aside. It was a mistake.`]);const d=this.duel(a,b);this.say(`${pre} ${d.text}`,d.killed?'death':'fight',[a.id,b.id]);}}
  else if(chance(.7)){const it=this.give(t,pick(['rations','medkit','waterskin','wire','tarp']));this.say(this.V('bbloot',[`${N(t)} ripped open a crate, stuffed a ${it.n} into a pack, and slipped away from the carnage.`,`${N(t)} found a ${it.n}, ignored the screaming, and ran.`]),'gift',[t.id]);gone.add(t.id);t.zone=pick(HG.ZONES.horn.adj);}
  else{gone.add(t.id);t.zone=pick(HG.ZONES.horn.adj);this.say(`${N(t)} saw what the table was turning into and slipped out of the fighting empty-handed.`,'plain',[t.id]);}}
 const shooters=rush.filter(x=>x.alive&&!gone.has(x.id)&&this.weapon(x)&&this.weapon(x).cls==='ranged'&&this.weapon(x).uses>0);
 flee.forEach(t=>{if(!t.alive)return;const s=shooters.find(x=>x.alive&&x!==t);const ch=rush.filter(x=>x.alive&&!gone.has(x.id)&&x!==t&&x.spd>t.spd&&this.weapon(x)&&['blade','blunt','pole'].includes(this.weapon(x).cls));
  if(s&&chance(.3)){const d=this.duel(s,t,{lethal:1.5,force:true});this.say(`${this.V('shot',[`${N(t)} was almost at the trees when ${N(s)} turned from the table and took aim.`,`${N(s)} spotted ${N(t)} sprinting for cover and did not let it get there.`,`${N(t)} had nearly cleared the open ground. ${N(s)} had a clear line.`,`Halfway to the treeline, ${N(t)} glanced back and saw ${N(s)} already drawing.`])} ${d.text}`,d.killed?'death':'fight',[s.id,t.id]);}
  else if(ch.length&&chance(.2)){const c=pick(ch);const d=this.duel(c,t,{ambush:true,lethal:1.4,force:true});this.say(`${N(c)} caught ${N(t)} at the edge of the clearing. ${d.text}`,d.killed?'death':'fight',[c.id,t.id]);}});
 rush.forEach(t=>{if(t.alive&&t.zone==='horn'&&chance(.55))t.zone=pick(HG.ZONES.horn.adj);});
 const k=this.cannons.length;this.say(k?this.V('bbend',[`By the time the grass stopped moving, ${k} contestant${k>1?'s':''} lay still around ${hn}.`,`The survivors scattered. Behind them, ${k} body${k>1?'ies':''} ${k>1?'lay':'lay'} in the churned grass.`,`Less than two minutes. ${k} flatline${k>1?'s':''} would sound before anyone caught ${HG.pick?'':''}their breath.`].map(x=>x.replace('bodyies','bodies'))):'Somehow, nobody had died. Yet.','gm',[]);};
P.move=function(){const seen=new Set();const alive=this.alive();const cnt={};alive.forEach(t=>cnt[t.zone]=(cnt[t.zone]||0)+1);
 const dec=t=>{const opts=[t.zone].concat(HG.ZONES[t.zone].adj).filter(z=>!this.closed.has(z));let best=t.zone,bs=-99;
  opts.forEach(z=>{const Zd=HG.ZONES[z];let s=rand()*.6;if(t.hyd<50)s+=Zd.water*1.5;if(t.fed<45)s+=Zd.food;if(!this.weapon(t)&&z==='horn'&&this.day<3)s+=.6;s+=(cnt[z]||0)*(t.tr.aggr-.45)*.5+Zd.cover*t.tr.caut*.8;if(z===t.zone)s+=.55;if(this.day>=6&&z==='horn')s+=.5;if(s>bs){bs=s;best=z;}});return best;};
 shuffle(alive).forEach(t=>{if(seen.has(t.id))return;const grp=[t].concat(this.allies(t).filter(x=>x.zone===t.zone));grp.forEach(x=>seen.add(x.id));const to=dec(t);
  if(to!==t.zone){const from=t.zone;grp.forEach(x=>x.zone=to);if(chance(.18)){const W={w:['following the scent of water','needing a drink badly','sure there had to be water nearby'],f:['hunting for food','following a rumor of berries','with an empty stomach for a compass'],h:['on a hunch','because staying felt wrong','trusting nothing but instinct','with the flatline fire still in their ears']};const why=pick(t.hyd<50?W.w:t.fed<45?W.f:W.h);const F=HG.ZONES[from].name,T=HG.ZONES[to].name,Ls=L(grp);this.say(this.V('trv',[`${Ls} left ${F} for ${T}, ${why}.`,`${Ls} broke camp and headed for ${T}, ${why}.`,`${Ls} moved on from ${F}, ${why}, and ended up in ${T}.`,`${cap(why)}, ${Ls} made for ${T}.`]),'move',grp.map(x=>x.id));}}});};
P.actions=function(){const order=shuffle(this.alive());
 const rw=(e,w)=>w*Math.pow(.6,this.recent.slice(-30).filter(x=>x===e.id).length);
 for(const t of order){if(!t.alive||t.acted)continue;if(this.lastOne())break;
  const mates=this.inZone(t.zone,t).filter(x=>!x.acted);const cov=HG.ZONES[t.zone].cover;
  const grp=t.ally!=null?[t].concat(this.allies(t).filter(x=>x.zone===t.zone&&!x.acted)):[t];
  const pEnc=mates.length?clamp(.2+.13*mates.length-cov*.25+(this.fires.has(t.zone)?.2:0)+t.tr.aggr*.15+(this.day>=5?.15:0)+(mates.some(x=>this.same(t,x))?.2:0),.05,.88):0;
  let ran=false;
  if(mates.length&&chance(pEnc)){const o=wpick(mates,x=>1+(t.grudge[x.id]||0)*2+(this.same(t,x)?1.5:0)+(t.intel===x.id?2:0));
   const en=mates.filter(x=>!this.same(t,x));const cands=[];
   HG.EVENTS.forEach(e=>{if(e.ph&&e.ph!==this.phase)return;if(e.k==='duo'){const c={t,o};const w=e.w(this,c);if(w>0)cands.push({e,c,w:rw(e,w)});}
    else if(e.k==='grp'&&grp.length>=2){const c={t,grp,o:en.length?pick(en):null};const w=e.w(this,c);if(w>0)cands.push({e,c,w:rw(e,w)});}});
   const ch=wpick(cands,x=>x.w);
   if(ch){ch.e.run(this,ch.c);this.recent.push(ch.e.id);t.acted=true;if(ch.e.k==='duo')ch.c.o.acted=true;if(ch.e.k==='grp')ch.c.grp.forEach(x=>x.acted=true);ran=true;}}
  if(!ran){const cands=[];HG.EVENTS.forEach(e=>{if(e.k!=='solo'||(e.ph&&e.ph!==this.phase))return;const c={t};const w=e.w(this,c);if(w>0)cands.push({e,c,w:rw(e,w)});});
   const ch=wpick(cands,x=>x.w);if(ch){ch.e.run(this,ch.c);this.recent.push(ch.e.id);}t.acted=true;}}};
})(HG);

