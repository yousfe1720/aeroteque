(()=>{
const $$=s=>[...document.querySelectorAll(s)];
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.12});
$$('.rv').forEach(el=>io.observe(el));
const toast=document.getElementById('toast');
const say=t=>{toast.textContent=t;toast.classList.add('show');clearTimeout(toast._t);toast._t=setTimeout(()=>toast.classList.remove('show'),2200)};
$$('[data-soon]').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();say('Coming soon')}));
$$('[data-top]').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();scrollTo({top:0,behavior:'smooth'})}));
const f=document.getElementById('cform');
if(f){const t=new URLSearchParams(location.search).get('topic');if(t&&f.topic.querySelector('option[value="'+t+'"]'))f.topic.value=t;
f.addEventListener('submit',e=>{e.preventDefault();let ok=true;[...f.querySelectorAll('[required]')].forEach(i=>{const bad=!i.value.trim()||(i.type==='email'&&!/^\S+@\S+\.\S+$/.test(i.value));i.classList.toggle('invalid',bad);if(bad)ok=false});
if(!ok){say('Please complete the highlighted fields');return}say('Message sent. We will reply within two working days.');f.reset();if(t)f.topic.value=t})}
})();
