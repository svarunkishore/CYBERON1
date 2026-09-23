const CTF_UNSTOP_URL="https://unstop.com/",ESCAPE_RUN_UNSTOP_URL="https://unstop.com/events/escape-rush-symbiosis-center-for-information-technology-scit-pune-1760128",SNAPCHAIN_UNSTOP_URL="https://unstop.com/events/snap-chain-symbiosis-center-for-information-technology-scit-pune-1760151 ",ENDGAME_UNSTOP_URL="https://unstop.com/events/end-game-symbiosis-center-for-information-technology-scit-pune-1760176";
const events=[
{number:"01",name:"CTF",url:CTF_UNSTOP_URL,logo:"assets/ctf.png",description:"[EVENT DESCRIPTION COMING SOON]"},{number:"02",name:"ESCAPE RUSH",url:ESCAPE_RUN_UNSTOP_URL,logo:"assets/escaperush.png",description:"A fortress has fallen.\nAEGIS was not cracked by skill,\nbut by weak passwords and human error.\nRecover the shattered key before the breach spreads."},
{number:"03",name:"SNAPCHAIN",url:SNAPCHAIN_UNSTOP_URL,logo:"assets/snapchain.png",description:"Snap Chain is a team-based cybersecurity relay challenge where every player becomes one link in the defence chain. Four players take on four different challenges, and every challenge must be completed correctly to keep the chain intact."},{number:"04",name:"ENDGAME",url:ENDGAME_UNSTOP_URL,logo:"assets/endgame.png",description:"End Game tests judgement, memory, coordination, control, and threat detection.\nRound 1 – Secure the Shot.\nRound 2 – The Last Mile.\nRound 3 – Straw Maze.\nRound 4 – The Deepfake Duel.\nThe enemy has evolved. Have you?"}];
const grid=document.getElementById("eventGrid");
if(grid)grid.innerHTML=events.map(e=>`<a class="event-card reveal" href="${e.url}" target="_blank" rel="noopener noreferrer" aria-label="Open ${e.name} on Unstop"><div class="event-visual"><div class="gridlines"></div><img class="event-logo" src="${e.logo}" alt="${e.name} logo" loading="lazy" decoding="async"></div><div class="event-content"><div class="event-number">${e.number} / CHAMBER</div><h3>${e.name}</h3><p>${e.description}</p><div class="contacts"><b>POINT OF CONTACT</b><span>Contact 01<br>[NAME TO BE ADDED]<br>[EMAIL TO BE ADDED]<br>[PHONE TO BE ADDED]</span><span>Contact 02<br>[NAME TO BE ADDED]<br>[EMAIL TO BE ADDED]<br>[PHONE TO BE ADDED]</span></div></div></a>`).join("");
const nav=document.getElementById("nav");window.addEventListener("scroll",()=>nav&&nav.classList.toggle("scrolled",scrollY>20),{passive:true});
const countdownChip=document.getElementById("countdownChip"),countdownValue=document.getElementById("countdownValue");
const countdownTarget=new Date("2026-10-03T00:00:00+05:30");
const countdownDateFormatter=new Intl.DateTimeFormat("en-IN",{day:"2-digit",month:"long",year:"numeric",timeZone:"Asia/Kolkata"});
function updateCountdown(){if(!countdownValue)return;const diff=Math.max(countdownTarget.getTime()-Date.now(),0),totalSeconds=Math.floor(diff/1000),days=Math.floor(totalSeconds/86400),hours=Math.floor((totalSeconds%86400)/3600),minutes=Math.floor((totalSeconds%3600)/60),seconds=totalSeconds%60;countdownValue.textContent=`${String(days).padStart(2,"0")}D ${String(hours).padStart(2,"0")}H ${String(minutes).padStart(2,"0")}M ${String(seconds).padStart(2,"0")}S`;if(countdownChip)countdownChip.title=countdownDateFormatter.format(countdownTarget)}
updateCountdown();setInterval(updateCountdown,1000);
const ob=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add("visible");ob.unobserve(e.target)}}),{threshold:.12});document.querySelectorAll(".reveal").forEach(e=>ob.observe(e));

/* ===== HERO CANVAS =====
   Same visual (castle art + drifting gold sparkles + vignette glow) but:
   - the castle's color filter and the radial glow are rendered ONCE to an
     off-screen buffer instead of being recomputed on every single frame
   - per-particle canvas shadowBlur (very slow) is gone; a plain radial
     gradient sprite is drawn instead
   - the animation loop is paused whenever the hero is off-screen or the
     tab isn't visible, instead of running forever in the background */
const canvas=document.getElementById("heroCanvas"),ctx=canvas.getContext("2d");
let W,H,dpr,ps=[],buffer=null,bufCtx=null,sparkle=null;
const castle=new Image();castle.decoding="async";castle.src="assets/castle-golden.jpg";

function buildSparkleSprite(){
  const s=document.createElement("canvas"),size=48;s.width=size;s.height=size;
  const c=s.getContext("2d"),g=c.createRadialGradient(size/2,size/2,0,size/2,size/2,size/2);
  g.addColorStop(0,"rgba(255,208,90,1)");g.addColorStop(.4,"rgba(255,181,31,.55)");g.addColorStop(1,"rgba(255,181,31,0)");
  c.fillStyle=g;c.beginPath();c.arc(size/2,size/2,size/2,0,Math.PI*2);c.fill();
  return s;
}
sparkle=buildSparkleSprite();

function renderBuffer(){
  if(!buffer){buffer=document.createElement("canvas");bufCtx=buffer.getContext("2d")}
  buffer.width=canvas.width;buffer.height=canvas.height;
  bufCtx.setTransform(dpr,0,0,dpr,0,0);
  bufCtx.clearRect(0,0,W,H);
  const cx=W*.5,cy=H*.52;
  if(castle.complete&&castle.naturalWidth){
    bufCtx.save();bufCtx.filter="saturate(1.18) brightness(.86) contrast(1.12)";bufCtx.globalAlpha=.96;
    bufCtx.drawImage(castle,0,0,W,H);bufCtx.restore();
    const glow=bufCtx.createRadialGradient(cx,cy*.8,40,cx,cy*.8,Math.max(W,H)*.72);
    glow.addColorStop(0,"rgba(255,194,49,.12)");glow.addColorStop(.42,"rgba(255,160,20,.035)");glow.addColorStop(1,"rgba(0,0,0,.55)");
    bufCtx.fillStyle=glow;bufCtx.fillRect(0,0,W,H);
  }
}

function resize(){
  dpr=Math.min(devicePixelRatio||1,1.5);
  W=canvas.clientWidth;H=canvas.clientHeight;
  canvas.width=W*dpr;canvas.height=H*dpr;
  ctx.setTransform(dpr,0,0,dpr,0,0);
  const count=W<600?26:60;
  ps=Array.from({length:count},()=>({x:Math.random()*W,y:Math.random()*H,s:1+Math.random()*5,vx:(Math.random()-.5)*.18,vy:(Math.random()-.5)*.18,phase:Math.random()*6.28}));
  renderBuffer();
}
castle.addEventListener("load",renderBuffer);

function draw(){
  ctx.clearRect(0,0,W,H);
  if(buffer)ctx.drawImage(buffer,0,0,W,H);
  const cx=W*.5,cy=H*.52;
  ctx.save();ctx.globalCompositeOperation="screen";
  for(const p of ps){
    let dx=cx-p.x,dy=cy-p.y,d=Math.hypot(dx,dy)||1;
    p.x+=p.vx+dx/d*.018;p.y+=p.vy+dy/d*.018;p.phase+=.025;
    if(p.x<0||p.x>W||p.y<0||p.y>H){p.x=Math.random()*W;p.y=Math.random()*H}
    const a=.12+.11*(Math.sin(p.phase)+1),size=p.s*3.2;
    ctx.globalAlpha=a;
    ctx.drawImage(sparkle,p.x-size,p.y-size,size*2,size*2);
  }
  ctx.restore();
}

let rafId=null,heroVisible=true;
function loop(){draw();rafId=requestAnimationFrame(loop)}
function startLoop(){if(rafId===null)rafId=requestAnimationFrame(loop)}
function stopLoop(){if(rafId!==null){cancelAnimationFrame(rafId);rafId=null}}

resize();addEventListener("resize",resize);
if(!matchMedia("(prefers-reduced-motion: reduce)").matches){
  startLoop();
  const heroObserver=new IntersectionObserver(es=>{
    heroVisible=es.some(e=>e.isIntersecting);
    if(heroVisible&&!document.hidden)startLoop();else stopLoop();
  },{threshold:0});
  heroObserver.observe(canvas);
  document.addEventListener("visibilitychange",()=>{
    if(document.hidden)stopLoop();else if(heroVisible)startLoop();
  });
}else{
  draw();
}

/* ===== ROYAL CINEMATIC INTERACTION LAYER ===== */
(function(){
  const reduceMotion=matchMedia("(prefers-reduced-motion: reduce)").matches;
  const curtain=document.createElement('div');
  curtain.className='royal-curtain';
  document.body.appendChild(curtain);

  if(!reduceMotion){
    const particleCount=window.innerWidth<700?10:20;
    for(let i=0;i<particleCount;i++){
      const p=document.createElement('i');
      p.className='royal-particle';
      p.style.left=(Math.random()*100)+'vw';
      p.style.top=(Math.random()*100)+'vh';
      p.style.transform=`scale(${0.5+Math.random()*1.5})`;
      p.style.animation=`royalFloat ${7+Math.random()*10}s ease-in-out ${-Math.random()*10}s infinite`;
      document.body.appendChild(p);
    }
    const style=document.createElement('style');
    style.textContent=`
      @keyframes royalFloat{0%{translate:0 0;opacity:.15}25%{translate:18px -35px;opacity:.75}50%{translate:-8px -70px;opacity:.25}75%{translate:-24px -30px;opacity:.65}100%{translate:0 0;opacity:.15}}
      body.motion-paused .royal-particle,body.motion-paused .hero:after,body.motion-paused .event-visual:before,body.motion-paused .btn-ghost:before,body.motion-paused .cta-section:before,body.motion-paused .hero h1{animation-play-state:paused!important}
    `;
    document.head.appendChild(style);
    document.addEventListener("visibilitychange",()=>{document.body.classList.toggle("motion-paused",document.hidden)});
  }

  let lastY=scrollY;
  let ticking=false;
  function onScroll(){
    const y=scrollY, delta=Math.abs(y-lastY);
    if(!reduceMotion&&delta>28){curtain.classList.add('active');clearTimeout(onScroll._t);onScroll._t=setTimeout(()=>curtain.classList.remove('active'),180)}
    lastY=y;
    if(!ticking){
      requestAnimationFrame(()=>{
        const hero=document.querySelector('.hero');
        if(hero){
          const progress=Math.min(Math.max(y/Math.max(hero.offsetHeight,1),0),1);
          hero.style.setProperty('--scroll-progress',progress.toFixed(3));
          hero.style.setProperty('--hero-depth',`${progress*34}px`);
        }
        ticking=false;
      });
      ticking=true;
    }
  }
  addEventListener('scroll',onScroll,{passive:true});

  const glow=document.querySelector('.cursor-glow');
  if(glow&&!reduceMotion){
    let gx=0,gy=0,gRaf=null;
    addEventListener('pointermove',e=>{
      gx=e.clientX;gy=e.clientY;
      if(gRaf===null)gRaf=requestAnimationFrame(()=>{glow.style.transform=`translate3d(${gx}px,${gy}px,0) translate(-50%,-50%)`;gRaf=null});
    },{passive:true});
  }
})();
