(()=>{
const $$=s=>[...document.querySelectorAll(s)];
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.12});
$$('.rv').forEach(el=>io.observe(el));
const toast=document.getElementById('toast');
const say=t=>{toast.textContent=t;toast.classList.add('show');clearTimeout(toast._t);toast._t=setTimeout(()=>toast.classList.remove('show'),2200)};
$$('[data-soon]').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();say('Coming soon')}));
$$('[data-top]').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();scrollTo({top:0,behavior:'smooth'})}));
/* service cards: whole card opens the service page, the Request button keeps its own link */
$$('.sv[data-href]').forEach(c=>{c.addEventListener('click',e=>{if(e.target.closest('a'))return;location.href=c.dataset.href});c.addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.target.closest('a'))location.href=c.dataset.href})});
const f=document.getElementById('cform');
if(f){const t=new URLSearchParams(location.search).get('topic');if(t&&f.topic.querySelector('option[value="'+t+'"]'))f.topic.value=t;
f.addEventListener('submit',e=>{e.preventDefault();let ok=true;[...f.querySelectorAll('[required]')].forEach(i=>{const bad=!i.value.trim()||(i.type==='email'&&!/^\S+@\S+\.\S+$/.test(i.value));i.classList.toggle('invalid',bad);if(bad)ok=false});
if(!ok){say('Please complete the highlighted fields');return}say('Message sent. We will reply within two working days.');f.reset();if(t)f.topic.value=t})}

/* UAV hero: type eyebrow, title and subtitle one after another, once */
const uh=document.getElementById('uh');
if(uh){
  const els=[...uh.querySelectorAll('[data-tw]')];
  const reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
  const prep=el=>{const t=el.textContent.trim();el.setAttribute('aria-label',t);el.textContent='';const cs=[];
    t.split(' ').forEach((w,i,a)=>{const ws=document.createElement('span');ws.className='tw-w';ws.setAttribute('aria-hidden','true');
      [...w].forEach(ch=>{const c=document.createElement('span');c.className='tw-c';c.textContent=ch;ws.appendChild(c);cs.push(c)});
      el.appendChild(ws);if(i<a.length-1){const sp=document.createElement('span');sp.className='tw-c';sp.setAttribute('aria-hidden','true');sp.textContent=' ';el.appendChild(sp);cs.push(sp)}});
    el.classList.add('tw-go');return cs};
  const done=()=>uh.classList.add('ready');
  if(reduce){els.forEach(e=>e.classList.add('tw-go'));done()}
  else{
    const jobs=els.map(el=>({cs:prep(el),sp:+el.dataset.tw}));
    let j=0;
    const run=()=>{if(j>=jobs.length){setTimeout(done,150);return}
      const {cs,sp}=jobs[j];let i=0,prev=null;
      const tick=()=>{if(prev)prev.classList.remove('cur');
        if(i>=cs.length){j++;setTimeout(run,j<jobs.length?180:0);return}
        const c=cs[i++];c.classList.add('on','cur');prev=c;setTimeout(tick,sp)};
      tick()};
    uh.classList.add('typing');
    setTimeout(()=>{uh.classList.add('ready-back');uh.querySelector('.uh-back').style.opacity=1;uh.querySelector('.uh-back').style.transform='none';run()},350);
  }
}
})();
