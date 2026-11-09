(()=>{
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const clamp=(x,a=0,b=1)=>Math.min(b,Math.max(a,x)),lerp=(a,b,t)=>a+(b-a)*t;
const sm=(a,b,x)=>{const t=clamp((x-a)/(b-a));return t*t*(3-2*t)};
const eio=t=>t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2, eo=t=>1-Math.pow(1-t,3);
const FP=null;
const track=$('#track'),stage=$('#stage'),sol=$('#sol');
$$('.tl').forEach(t=>t.addEventListener('click',e=>{if(e.target.closest('a'))return;const touch=matchMedia('(hover:none),(max-width:860px)').matches;if(touch||t.classList.contains('on')){location.href=t.dataset.href;return}$$('.tl').forEach(o=>o.classList.remove('on'));t.classList.add('on')}));
$$('.tl').forEach(t=>t.addEventListener('keydown',e=>{if(e.key==='Enter')location.href=t.dataset.href}));
/* scroll-in animation for the solutions section */
{const io=new IntersectionObserver(es=>es.forEach(en=>{if(en.isIntersecting){en.target.classList.add('in');io.unobserve(en.target)}}),{threshold:.12});$$('.rv,.tl').forEach(el=>io.observe(el))}

/* "Coming soon" for pages that are not built yet */
const toast=$('#toast');
$$('[data-soon]').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();toast.classList.add('show');clearTimeout(toast._t);toast._t=setTimeout(()=>toast.classList.remove('show'),1600)}));
const TOT=()=>track.offsetHeight-innerHeight;
const goSvc=e=>{e&&e.preventDefault();const tot=TOT();scrollTo({top:track.offsetTop+tot*.93,behavior:'smooth'})};
if(location.hash==='#services')addEventListener('load',()=>setTimeout(()=>goSvc(),350));
$$('[data-top]').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();scrollTo({top:0,behavior:'smooth'})}));
$('#goSvc').addEventListener('click',goSvc);$('#navSvc').addEventListener('click',goSvc);

/* Services accordion */
const its=$$('.it');
const openIt=i=>its.forEach(o=>o.classList.toggle('on',o===i));
its.forEach(i=>{
  i.addEventListener('pointerenter',e=>{if(e.pointerType==='mouse')openIt(i)});
  i.addEventListener('focus',()=>openIt(i));
  i.addEventListener('click',e=>{if(e.target.closest('.arr'))return;if(i.classList.contains('on'))location.href=i.dataset.href;else openIt(i)});
  i.addEventListener('keydown',e=>{if(e.key==='Enter'&&i.classList.contains('on'))location.href=i.dataset.href});
});

/* Rotating headline */
const shadow=$('#shadow'),phs=$$('.ph');
phs.forEach(p=>{p.innerHTML=p.textContent.trim().split(' ').map((w,i)=>`<span class="w"><span style="transition-delay:${i*70}ms">${w}</span></span>`).join(' ')});
let cur=0;phs[0].classList.add('in');
setInterval(()=>{const c=cur,n=(cur+1)%phs.length;phs[c].classList.remove('in');phs[c].classList.add('out');setTimeout(()=>phs[c].classList.remove('out'),900);phs[n].classList.add('in');cur=n},3800);
const md=(v,p)=>((v%p)+p)%p;

/* Runway in one-point perspective, drawn on a canvas */
const rw=$('#rw'),rg=rw.getContext('2d');let rdpr=1,off=0;
function drawRunway(dt,P,kk){
  const sp=70*Math.pow(1-kk,2)+2+90*sm(0,.1,P)*(1-sm(.1,.2,P));off-=sp*dt;
  const w=W,h=H,hy=h*(.5+sm(.04,.34,P)*.58),f=h*.9,hc=1,Wr=1.5,zF=420;
  rg.setTransform(rdpr,0,0,rdpr,0,0);
  const sk=rg.createLinearGradient(0,0,0,Math.max(hy,1));sk.addColorStop(0,'#c3cad1');sk.addColorStop(1,'#eceeee');
  rg.fillStyle=sk;rg.fillRect(0,0,w,h);
  const haze=()=>{const g=rg.createRadialGradient(w/2,hy,0,w/2,hy,w*.55);g.addColorStop(0,'rgba(255,255,255,.7)');g.addColorStop(1,'rgba(255,255,255,0)');rg.fillStyle=g;rg.fillRect(0,0,w,h)};
  if(hy>=h){haze();return}
  const gr=rg.createLinearGradient(0,hy,0,h);gr.addColorStop(0,'#eceeee');gr.addColorStop(.22,'#cfd3d1');gr.addColorStop(1,'#a8adab');
  rg.fillStyle=gr;rg.fillRect(0,hy,w,h-hy);
  const X=(x,z)=>w/2+f*x/z,Y=z=>hy+f*hc/z,zn=Math.max(.5,f*hc/(h-hy));
  const quad=(x1,x2,z1,z2,col)=>{if(z2<=z1)return;rg.fillStyle=col;rg.beginPath();rg.moveTo(X(x1,z1),Y(z1));rg.lineTo(X(x2,z1),Y(z1));rg.lineTo(X(x2,z2),Y(z2));rg.lineTo(X(x1,z2),Y(z2));rg.closePath();rg.fill()};
  quad(-Wr-.9,Wr+.9,zn,zF,'#b7bbb9');          // shoulders
  quad(-Wr,Wr,zn,zF,'#575b60');                 // asphalt
  const white='#ecece9';
  quad(-Wr+.12,-Wr+.24,zn,zF,white);quad(Wr-.24,Wr-.12,zn,zF,white);
  const per=8,len=3.4;                          // centre line
  for(let z=-md(off,per);z<zF;z+=per)quad(-.08,.08,Math.max(z,zn),z+len,white);
  const pb=60;                                  // touchdown-zone bars
  for(let z=-md(off,pb)+8;z<zF;z+=pb)for(const sx of[-1,1]){quad(sx*.55,sx*.8,Math.max(z,zn),z+2.6,white);quad(sx*.95,sx*1.2,Math.max(z,zn),z+2.6,white)}
  for(let z=-md(off,7)+3;z<zF;z+=7){if(z<zn)continue;const i=Math.round((z+off)/7);const r=Math.max(.6,f*.02/z),y=Y(z);   // edge lights
    for(const sx of[-1,1]){rg.fillStyle=md(i,5)===0?'#a3212f':'#fbfbf6';rg.beginPath();rg.arc(X(sx*(Wr+.55),z),y,r,0,6.283);rg.fill()}}
  const fog=rg.createLinearGradient(0,hy,0,hy+h*.3);fog.addColorStop(0,'rgba(236,238,238,1)');fog.addColorStop(1,'rgba(236,238,238,0)');
  rg.fillStyle=fog;rg.fillRect(0,hy,w,h*.3);
  haze();                                       // drawn last, over sky and ground alike: no seam
}
/* Black cloth: SVG sheet pulled by the aircraft's tail */
const cloth=$('#cloth'),svg=$('#clothSvg'),fill=$('#clothFill'),edge=$('#clothEdge');
let W=0,H=0;
function sizeAll(){
  W=stage.clientWidth;H=stage.clientHeight;
  svg.setAttribute('width',W);svg.setAttribute('height',H*1.5);cloth.style.height=H*1.5+'px';
  rdpr=Math.min(devicePixelRatio||1,2);rw.width=W*rdpr;rw.height=H*rdpr;
  if(gl.ready){gl.r.setSize(W,H,false);gl.cam.aspect=W/H;gl.cam.updateProjectionMatrix()}
}

/* Aircraft */
const gl={ready:false,L:2.3};
function startGL(){
  if(!window.THREE||!window.MODELS||!THREE.GLTFLoader)return;
  const cv=$('#gl'),r=new THREE.WebGLRenderer({canvas:cv,alpha:true,antialias:true});
  r.setPixelRatio(Math.min(devicePixelRatio||1,2));
  const sc=new THREE.Scene(),cam=new THREE.PerspectiveCamera(32,1,.1,200);
  sc.add(new THREE.HemisphereLight(0xffffff,0x555a60,1.5));
  const d=new THREE.DirectionalLight(0xffffff,2.6);d.position.set(3,6,4);sc.add(d);
  const rim=new THREE.DirectionalLight(0xbcd0ff,1.8);rim.position.set(-4,2,-5);sc.add(rim);
  const mat=new THREE.MeshStandardMaterial({color:0x1d2023,roughness:.5,metalness:.35});
  const bin=Uint8Array.from(atob(MODELS.tx5.split(',')[1]),c=>c.charCodeAt(0)).buffer;
  new THREE.GLTFLoader().parse(bin,'',g=>{
    const m=g.scene;m.traverse(n=>{if(n.isMesh)n.material=mat});
    const b=new THREE.Box3().setFromObject(m),s=3.2/Math.max(...b.getSize(new THREE.Vector3()).toArray());
    m.scale.setScalar(s);
    const b2=new THREE.Box3().setFromObject(m);m.position.sub(b2.getCenter(new THREE.Vector3()));
    gl.L=b2.getSize(new THREE.Vector3()).z;
    const grp=new THREE.Group();grp.add(m);sc.add(grp);
    Object.assign(gl,{r,cam,grp,ready:true,t0:performance.now()});
    r.setSize(W,H,false);cam.aspect=W/H;cam.updateProjectionMatrix();
  });
}


/* Process: slide deck (arrows, running bar, swap transition). The section is uncovered from under the black sheet */
const proc=$('#proc'),pDim=$('#procDim'),deck=$('#deck'),slT=$$('.sl-t'),slI=$$('.sl-i'),sgs=$$('.sg'),ctN=$('#ctN');
const RM=matchMedia('(prefers-reduced-motion:reduce)').matches;
let si=0;
function go(n){
  n=(n+slT.length)%slT.length;si=n;
  slT.forEach((e,i)=>e.classList.toggle('on',i===n));
  slI.forEach((e,i)=>e.classList.toggle('on',i===n));
  sgs.forEach((s,i)=>{s.classList.remove('on');s.classList.toggle('done',i<n)});
  void deck.offsetWidth;sgs[n].classList.add('on');
  ctN.textContent=n+1;
}
sgs.forEach((s,i)=>{s.addEventListener('click',()=>go(i));s.firstElementChild.addEventListener('animationend',()=>{if(!RM)go(si+1)})});
$('#prevS').addEventListener('click',()=>go(si-1));$('#nextS').addEventListener('click',()=>go(si+1));
{let x0=null;const r=$('#deckR');r.addEventListener('pointerdown',e=>{x0=e.clientX});addEventListener('pointerup',e=>{if(x0===null)return;const dx=e.clientX-x0;x0=null;if(Math.abs(dx)>50)go(si+(dx<0?1:-1))})}
deck.addEventListener('keydown',e=>{if(e.key==='ArrowRight')go(si+1);if(e.key==='ArrowLeft')go(si-1)});
go(0);
function procFrame(){
  const r=proc.getBoundingClientRect(),vh=innerHeight;
  if(r.bottom<-vh||r.top>vh*2)return;
  const travel=-r.top;
  pDim.style.opacity=(.6*(1-eo(clamp(travel/vh)))).toFixed(3);
  deck.classList.toggle('run',travel>vh*.75&&r.bottom>vh*.5);
}
/* Pointer parallax */
let tmx=0,tmy=0,mx=0,my=0;
addEventListener('pointermove',e=>{tmx=e.clientX/innerWidth*2-1;tmy=e.clientY/innerHeight*2-1},{passive:true});

/* Scroll -> progress */
const readP=()=>{if(FP!==null)return+FP;const r=track.getBoundingClientRect(),tot=TOT();return clamp(-r.top/tot)};
const hud=$('.hud'),copy=$('#copy'),alt=$('#alt');
const tiles=$$('.tl');
let P=FP!==null?+FP:0,last=performance.now(),born=last,frozen=false;

function frame(now){
  const dt=Math.min(.05,(now-last)/1000);last=now;const t=now/1000;
  const target=readP(),prev=P;
  P=FP!==null?target:P+(target-P)*(1-Math.exp(-dt*8));
  const v=Math.abs(P-prev)/Math.max(dt,.001);
  if(!W)sizeAll();

  const done=FP===null&&P>.82&&target>.82;
  if(!(done&&frozen)){
  /* headline and phrase band: the band drifts behind the aircraft and is gone after the first scroll */
  const hc=sm(0,.07,P);
  copy.style.opacity=1-hc;copy.style.transform=`translate3d(0,${(-hc*50).toFixed(1)}px,0)`;copy.style.visibility=hc>=1?'hidden':'visible';
  const kk=gl.ready?eo(clamp((now-gl.t0)/3600)):0;
  drawRunway(dt,P,kk);

  /* aircraft + cloth share one set of numbers */
  const A=W/H,fr=A>1.6?.38:lerp(.8,.38,clamp((A-.5)/1.1)),D=Math.max(3.5,3.2/fr/(.5735*A)),Hv=.5735*D;
  const th=sm(0,.16,P)*1.25,scl=1+.16*sm(0,.2,P);
  const tail=((gl.L*scl)/2*Math.sin(th)+.1*scl)/Hv;
  const droneY=lerp(.7,-.55,eio(clamp((P-.03)/.62)));
  const slack=.5*(1-sm(.03,.26,P));
  const peak=lerp(droneY+tail+slack,-.2,sm(.6,.8,P));                    // cloth tip, as a fraction of stage height
  const sag=.16*H+Math.sin(t*9)*H*.012*clamp((done?0:v)*.35);

  if(gl.ready){
    const it=(now-gl.t0)/1000,k=eo(clamp(it/3.6));
    const cam=gl.cam;cam.position.set(0,0,D);cam.lookAt(0,0,0);
    mx+=(tmx-mx)*.05;my+=(tmy-my)*.05;
    const calm=1-sm(0,.2,P);
    gl.grp.position.set(0,(.5-droneY)*Hv,lerp(-80,0,k));
    gl.grp.scale.setScalar(scl);
    gl.grp.rotation.set(-th+my*.07*calm,mx*.32*calm+(1-k)*.5,Math.sin(t*.9)*.04+(1-k)*.3,'YXZ');
    gl.r.domElement.style.opacity=clamp(it/.5);
    gl.r.render(gl.cam.parent||gl.grp.parent,cam);
  }

  shadow.style.top=((droneY+.095)*H).toFixed(1)+'px';shadow.style.opacity=(kk*.55*(1-sm(0,.09,P))).toFixed(3);
  cloth.style.transform=`translate3d(0,${(peak*H).toFixed(1)}px,0)`;
  const w=W,h=H*1.5,px=w/2;
  const top=`M0 ${sag.toFixed(1)} C${w*.28} ${(sag*.98).toFixed(1)} ${w*.44} ${(sag*.5).toFixed(1)} ${px} 0 C${w*.56} ${(sag*.5).toFixed(1)} ${w*.72} ${(sag*.98).toFixed(1)} ${w} ${sag.toFixed(1)}`;
  edge.setAttribute('d',top);fill.setAttribute('d',`${top} L${w} ${h} L0 ${h}Z`);

  hud.style.opacity=1-sm(.3,.45,P);
  alt.textContent='ALT '+String(Math.round(P*1200)).padStart(4,'0')+' M';

  }
  frozen=done;

  /* tile parallax (only while the solutions section is on screen) */
  {const vh=innerHeight,sr=sol.getBoundingClientRect();if(sr.top<vh&&sr.bottom>0)for(const t of tiles){const r=t.getBoundingClientRect();if(r.bottom<0||r.top>vh)continue;t.style.setProperty('--py',(((r.top+r.height/2)/vh-.5)*-40).toFixed(1)+'px')}}
  procFrame();
  requestAnimationFrame(frame);
}
addEventListener('resize',()=>{W=0;frozen=false});
if(location.hash==='#services')scrollTo(0,track.offsetTop+TOT()*.93);
sizeAll();startGL();requestAnimationFrame(frame);
/* Boot cover: lifted once fonts and the 3D model are ready (or after a safety timeout) */
{const root=document.documentElement,b=document.getElementById('boot');let done=false;
const lift=()=>{if(done)return;done=true;root.classList.remove('booting');if(b){b.classList.add('off');setTimeout(()=>b.remove(),800)}};
const fonts=document.fonts&&document.fonts.ready?document.fonts.ready:Promise.resolve();
const model=new Promise(r=>{const t=setInterval(()=>{if(gl.ready){clearInterval(t);r()}},60)});
Promise.all([fonts,model]).then(()=>requestAnimationFrame(()=>requestAnimationFrame(lift)));
setTimeout(lift,5000);}

})();
