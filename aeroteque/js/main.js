const S70=MODELS.s70,TX5=MODELS.tx5;
gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.defaults({toggleActions:"play none play none"}); // reveals still play if the user jumps past them

/* "Coming soon" for every unbuilt page */
const toast=document.getElementById('toast');
document.querySelectorAll('[data-soon]').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();toast.classList.add('show');clearTimeout(toast._t);toast._t=setTimeout(()=>toast.classList.remove('show'),1600)}));

/* Accordion: hovered/tapped panel opens, others shrink (CSS flex transition) */
const its=[...document.querySelectorAll('.it')];
its.forEach(i=>['pointerenter','click'].forEach(ev=>i.addEventListener(ev,()=>{its.forEach(o=>o.classList.toggle('on',o===i))})));

/* Generic GLB scene: military-black matte material, auto-fit, returns {cam,render,model} */
function mount(id,uri,onReady,flip,col){
  const cv=document.getElementById(id),r=new THREE.WebGLRenderer({canvas:cv,alpha:true,antialias:true});
  r.setPixelRatio(Math.min(devicePixelRatio,2));
  const sc=new THREE.Scene(),cam=new THREE.PerspectiveCamera(32,1,.1,100),o={cam,sc,model:null,look:new THREE.Vector3()};
  sc.add(new THREE.HemisphereLight(0xffffff,0x555a60,1.5));
  const d=new THREE.DirectionalLight(0xffffff,2.6);d.position.set(3,6,4);sc.add(d);
  const rim=new THREE.DirectionalLight(0xbcd0ff,1.8);rim.position.set(-4,2,-5);sc.add(rim);
  const mat=new THREE.MeshStandardMaterial({color:col||0x1d2023,roughness:col?0.38:0.5,metalness:col?0.55:0.35});
  const bin=Uint8Array.from(atob(uri.split(',')[1]),c=>c.charCodeAt(0)).buffer;
  new THREE.GLTFLoader().parse(bin,'',g=>{
    const m=g.scene;if(flip)m.rotation.y=Math.PI;m.traverse(n=>{if(n.isMesh)n.material=mat});
    const b=new THREE.Box3().setFromObject(m),s=3.2/Math.max(...b.getSize(new THREE.Vector3()).toArray());
    m.scale.setScalar(s);const c=new THREE.Box3().setFromObject(m).getCenter(new THREE.Vector3());m.position.sub(c);
    const w=new THREE.Group();w.add(m);sc.add(w);o.model=w;onReady&&onReady(o)});
  o.vis=true;new IntersectionObserver(e=>{o.vis=e[0].isIntersecting}).observe(cv);o.render=()=>{if(!o.vis)return;const w=cv.clientWidth,h=cv.clientHeight;if(cv.width!==w*r.getPixelRatio()){r.setSize(w,h,false);cam.aspect=w/h;cam.updateProjectionMatrix()}cam.lookAt(o.look);r.render(sc,cam)};
  return o;
}

/* ===== HERO: TX-5 seen from above, nose toward the headline ===== */
const V3=THREE.Vector3,
 // model axes: +Z nose, +Y dorsal, X wing. qTop maps nose->screen-up, dorsal->camera. qFront = identity (nose to camera, wheels down)
 qTop=new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().makeBasis(new V3(-1,0,0),new V3(0,0,1),new V3(0,1,0))),
 qFront=new THREE.Quaternion(),st={p:0};
const hero=mount('c1',TX5);
function pose(t){
  const p=st.p,A=hero.cam.aspect||1.8,fr=A>1.2?.62:.92,D=Math.max(3.5,3.2/fr/(.5735*A)),H=.5735*D;
  hero.cam.position.set(0,0,D);
  if(!hero.model)return;
  hero.model.quaternion.copy(qTop).slerp(qFront,p);          // 3D flip: top view -> nose-on view
  hero.model.scale.setScalar(1+(A>1.2?.3:-.1)*p);
  hero.model.position.y=-H*(.14+.08*p)+Math.sin(t*1.2)*.03;    // settles low, right above the services
}
gsap.ticker.add(t=>{pose(t);hero.render()});
/* TIMELINE hero-scroll (scrub, hero pinned for 220% of viewport):
   0.15–0.85  plane flips from top view to front view (landing gear points down at services)
   0.20–0.70  headline drifts up and dims; shadow appears under the plane
   tags 01/02/03 each fade in then out in sequence (marketing index)
   0.85–1.00  hold */
const tl=gsap.timeline({scrollTrigger:{trigger:'#hero',start:'top top',end:'+=220%',pin:true,scrub:.8}});
tl.to(st,{p:1,duration:.7,ease:'power2.inOut'},.15)
  .to('.hero h1',{y:-40,opacity:.2,duration:.5},.2)
  .to('.shadow',{opacity:.55,duration:.3},.6)
  .to({},{duration:.15},.85);
document.querySelectorAll('.tag').forEach((e,i)=>tl.fromTo(e,{opacity:0,y:24},{opacity:1,y:0,duration:.1},.08+i*.27).to(e,{opacity:0,duration:.07},.26+i*.27));
/* nav collapses to the logo after the first scroll */
const nav=document.querySelector('nav');addEventListener('scroll',()=>nav.classList.toggle('min',scrollY>60),{passive:true});
/* marquee + index rows */
const mq=document.querySelector('#mq div');mq.innerHTML+=mq.innerHTML;
/* ===== LIFECYCLE: second airframe flies through 5 poses as the list advances ===== */
const E=(x,y,z)=>new THREE.Quaternion().setFromEuler(new THREE.Euler(x,y,z,'YXZ')),
 qTopR=new THREE.Quaternion().setFromAxisAngle(new V3(0,0,1),-Math.PI/2).multiply(qTop);
// pose table: orientation, resting x / y (fractions of visible width / height), scale
const R=[{q:qTop,x:.26,y:-.02,s:1.5},{q:E(0,-1.5708,0),x:.24,y:.03,s:1.7},{q:E(.55,-.75,.25),x:.24,y:0,s:1.6},{q:E(0,0,.25),x:.2,y:-.02,s:2},{q:qTopR,x:.2,y:0,s:1.9}];
const life=mount('c3',S70,null,true),P={x:1.25,pose:0,k:1},items=[...document.querySelectorAll('.lf li')];
gsap.ticker.add(t=>{const c=life.cam;c.position.set(0,0,7);const A=c.aspect||1.8,Wv=.5735*7*A,Hv=.5735*7,r=R[P.pose];
  if(life.model){life.model.quaternion.copy(r.q);life.model.scale.setScalar(r.s*P.k*Math.min(1,A/1.3));life.model.position.set(P.x*Wv,r.y*Hv+(A<1?-.3*Hv:0)+Math.sin(t*1.1)*.05,0)}
  life.render()});
/* TIMELINE lifecycle (scrub, pinned for 500%). Each step = 1 unit:
   [0,.3]    plane exits LEFT (ease-in)
   .3        instant swap to next pose, parked off-screen RIGHT
   [.3,.65]  flies in from the RIGHT to its resting spot
   [.65,1]   slow 12% zoom while the step is read
   The active list item switches at the swap moment. */
const tl2=gsap.timeline({scrollTrigger:{trigger:'#life',start:'top top',end:'+=500%',pin:true,scrub:.8,onUpdate:s=>{const T=s.progress*5,a=T<1.3?0:Math.min(4,Math.floor(T-.3));items.forEach((li,i)=>li.classList.toggle('on',i===a))}}});
R.forEach((r,i)=>{
  if(i===0)tl2.fromTo(P,{x:1.25},{x:r.x,duration:.65,ease:'power3.out'},0);
  else tl2.to(P,{x:-1.25,duration:.3,ease:'power2.in'},i).set(P,{x:1.25,pose:i,k:1},i+.3).to(P,{x:r.x,duration:.35,ease:'power3.out'},i+.3);
  tl2.to(P,{k:1.12,duration:.35,ease:'none'},i+.65);
});

/* ===== STANDARD: TX-5 appears out of nothing (scale 0 + spin), then turns pose by pose while the list builds ===== */
const qs=[E(.45,-.8,.12),E(.08,1.5708,0),qTop.clone(),E(0,0,.2)],sv=[1.1,1.25,1.35,1.5];   // pose quaternions + scale per pose
const std=mount('c4',TX5,null,false,0x9aa1a8),U={s:0,spin:-9.4,u:0},sitems=[...document.querySelectorAll('.sd li')];
const qa=new THREE.Quaternion(),qb=new THREE.Quaternion(),qy=new THREE.Quaternion(),Yax=new V3(0,1,0);
gsap.ticker.add(()=>{const c=std.cam;c.position.set(0,0,7);const A=c.aspect||1.8,Wv=.5735*7*A,Hv=.5735*7,mob=A<1,k=Math.min(1,A/1.3),a=Math.min(Math.floor(U.u),2),f=U.u-a;
  if(std.model){qa.copy(qs[a]).slerp(qb.copy(qs[a+1]),f);qy.setFromAxisAngle(Yax,U.spin);std.model.quaternion.copy(qy).multiply(qa);
    std.model.scale.setScalar(Math.max(U.s,.001)*(sv[a]+(sv[a+1]-sv[a])*f)*k);std.model.position.set(mob?0:-.2*Wv,mob?.2*Hv:0,0)}
  const ac=Math.round(U.u),vis=U.s>.55;sitems.forEach((li,n)=>{li.classList.toggle('show',vis&&n<=ac);li.classList.toggle('on',vis&&n===ac)});
  std.render()});
/* TIMELINE standard (scrub, pinned 450%):
   [0,1]      plane scales up from nothing while spinning 1.5 turns; glow fades in; row 01 appears
   1 / 2.2 / 3.4  each moves to the next pose (slerp) over 1 unit; rows are added and the active one lights up
   4.4–5      hold on the nose-on view */
const tl3=gsap.timeline({scrollTrigger:{trigger:'#std',start:'top top',end:'+=450%',pin:true,scrub:.8}});
tl3.to(U,{s:1,spin:0,duration:1,ease:'power3.out'},0).fromTo('.std-glow',{opacity:0,scale:.2},{opacity:1,scale:1,duration:1},0);
[0,1,2].forEach(n=>tl3.to(U,{u:n+1,duration:1,ease:'power2.inOut'},1+n*1.2));
tl3.to({},{duration:.6},4.4);
gsap.from('.wm',{y:80,opacity:0,duration:1.2,ease:'power3.out',scrollTrigger:{trigger:'.wm',start:'top 98%'}});

/* Reveal timeline: every .rv rises in when 85% into view */
gsap.utils.toArray('.rv').forEach(e=>gsap.from(e,{y:36,opacity:0,duration:1,ease:'power3.out',scrollTrigger:{trigger:e,start:'top 85%'}}));
gsap.from('.cert',{y:40,opacity:0,stagger:.12,duration:.9,scrollTrigger:{trigger:'.certs',start:'top 80%'}});
gsap.from('.it',{y:60,opacity:0,stagger:.1,duration:.9,scrollTrigger:{trigger:'#acc',start:'top 85%'}});

/* WHY US: dot-matrix aircraft that morph (quad -> flying wing) and flee the cursor */
(function(){
  const cv=document.getElementById('c2'),x=cv.getContext('2d'),N=900,P=[];let W,H,m={x:-999,y:-999},shape=0,T=[[],[]];
  const ring=(cx,cy,r,n)=>{for(let i=0;i<n;i++){const a=i/n*6.283;T[0].push([cx+Math.cos(a)*r,cy+Math.sin(a)*r])}};
  const line=(a,b,c,d,n,k)=>{for(let i=0;i<n;i++){const t=i/n;T[k].push([a+(c-a)*t,b+(d-b)*t])}};
  // shape 0: quadcopter, top view (unit square -1..1)
  ring(0,0,.16,60);[[-.6,-.6],[.6,-.6],[-.6,.6],[.6,.6]].forEach(([a,b])=>{ring(a,b,.3,95);ring(a,b,.06,12);line(0,0,a,b,60,0)});
  // shape 1: flying-wing outline
  const wing=[[0,-.85],[.95,.45],[.55,.62],[.18,.4],[0,.7],[-.18,.4],[-.55,.62],[-.95,.45],[0,-.85]];
  for(let i=0;i<8;i++)line(wing[i][0],wing[i][1],wing[i+1][0],wing[i+1][1],110,1);
  for(let i=0;i<N;i++)P.push({x:Math.random()*400,y:Math.random()*400,vx:0,vy:0,k:i});
  function fit(){const d=devicePixelRatio;W=cv.clientWidth;H=cv.clientHeight;cv.width=W*d;cv.height=H*d;x.setTransform(d,0,0,d,0,0)}
  fit();addEventListener('resize',fit);
  cv.addEventListener('pointermove',e=>{const b=cv.getBoundingClientRect();m.x=e.clientX-b.left;m.y=e.clientY-b.top});
  cv.addEventListener('pointerleave',()=>m.x=-999);
  setInterval(()=>shape=1-shape,4500); // morph every 4.5s
  gsap.ticker.add(()=>{
    x.clearRect(0,0,W,H);x.fillStyle='#fff';const s=Math.min(W,H)*.46,L=T[shape],t=performance.now()/1000;
    for(const p of P){
      const q=L[p.k%L.length],tx=W/2+q[0]*s+Math.sin(t+p.k)*1.2,ty=H/2+q[1]*s+Math.cos(t+p.k)*1.2;
      let dx=m.x-p.x,dy=m.y-p.y,d=Math.hypot(dx,dy);
      if(d<90){p.vx-=dx/d*2.2;p.vy-=dy/d*2.2}
      p.vx+=(tx-p.x)*.012;p.vy+=(ty-p.y)*.012;p.vx*=.88;p.vy*=.88;p.x+=p.vx;p.y+=p.vy;
      x.fillRect(p.x,p.y,1.8,1.8)}
  });
})();
