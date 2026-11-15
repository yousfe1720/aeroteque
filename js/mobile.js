/* AEROTEQUE · mobile layer (<= 860px): tab bar, "more" sheet, service tabs, accordions */
(function(){
  var MQ=matchMedia('(max-width:860px)');
  if(!MQ.matches){ if(MQ.addEventListener)MQ.addEventListener('change',function(m){if(m.matches)location.reload()}); return; }
  if(MQ.addEventListener)MQ.addEventListener('change',function(m){if(!m.matches)location.reload()});
  var d=document,root=d.documentElement,file=(location.pathname.split('/').pop()||'index.html');
  root.classList.remove('booting');
  var MAIL='mailto:corporate@aeroteque.com?subject=Engineering%20Inquiry%20%E2%80%94%20Aeroteque';
  var back=d.querySelector('.uh-back'),bh=back?back.getAttribute('href'):'';
  var cur=file==='index.html'?'home':file==='company.html'?'company':file==='media.html'?'media':file==='careers.html'?'careers':file==='brand.html'?'brand':file==='privacy.html'?'privacy':bh.indexOf('#services')>-1?'services':bh.indexOf('#auto')>-1?'solutions':'';
  var ic={
   home:'<path d="M3 11l9-8 9 8M5 10v10h14V10"/>',
   services:'<path d="M12 3l9 5-9 5-9-5 9-5zM3 13l9 5 9-5"/>',
   solutions:'<rect x="4" y="4" width="6.5" height="6.5"/><rect x="13.5" y="4" width="6.5" height="6.5"/><rect x="4" y="13.5" width="6.5" height="6.5"/><rect x="13.5" y="13.5" width="6.5" height="6.5"/>',
   company:'<path d="M4 21V8l8-5 8 5v13M9 21v-6h6v6"/>',
   contact:'<path d="M3 6h18v12H3zM3 7l9 7 9-7"/>'};
  /* "more" sheet in the top bar */
  var nav=d.getElementById('nav'),more=d.createElement('button');
  more.className='mt-more';more.type='button';more.setAttribute('aria-label','More pages');more.setAttribute('aria-expanded','false');
  more.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 8h16M4 16h16"/></svg>';
  if(nav)nav.appendChild(more);
  var sh=d.createElement('div');sh.className='mt-sheet';
  function it(h,t,k,sub){return '<a href="'+h+'"'+(cur===k?' class="on" aria-current="page"':'')+'>'+t+(sub?'<span>'+sub+'</span>':'')+'</a>'}
  sh.innerHTML='<nav aria-label="Menu">'+it('index.html','Home','home')+it('index.html#services','Services','services','4 disciplines')+it('index.html#auto','Solutions','solutions','UAV, launcher, UGV')+it('company.html','Company','company')+it('media.html','Media','media','Videos')+it('careers.html','Careers','careers')+it('brand.html','Brand','brand')+it('privacy.html','Privacy Policy','privacy')+'<a class="cta" href="'+MAIL+'">Contact Engineering</a></nav>';
  d.body.appendChild(sh);
  function sheet(o){sh.classList.toggle('open',o);more.setAttribute('aria-expanded',o);root.classList.toggle('m-lock',o)}
  more.addEventListener('click',function(){sheet(!sh.classList.contains('open'))});
  sh.addEventListener('click',function(e){if(e.target===sh||e.target.closest('a'))sheet(false)});
  addEventListener('keydown',function(e){if(e.key==='Escape')sheet(false)});

  /* home: service tabs (+ swipe) */
  var tabs=[].slice.call(d.querySelectorAll('.mh-tabs button')),ps=[].slice.call(d.querySelectorAll('.mh-p'));
  function show(i){i=Math.max(0,Math.min(tabs.length-1,i));
    tabs.forEach(function(t,k){t.setAttribute('aria-selected',k===i)});
    ps.forEach(function(p,k){p.classList.toggle('on',k===i)});
    tabs[i].scrollIntoView({inline:'center',block:'nearest',behavior:'smooth'});return i}
  var cs=0;
  tabs.forEach(function(t,i){t.addEventListener('click',function(){cs=show(i)})});
  var x0=null,y0=null,box=d.querySelector('.mh-panels');
  if(box){box.addEventListener('touchstart',function(e){x0=e.touches[0].clientX;y0=e.touches[0].clientY},{passive:true});
   box.addEventListener('touchend',function(e){if(x0===null)return;var dx=e.changedTouches[0].clientX-x0,dy=e.changedTouches[0].clientY-y0;x0=null;
    if(Math.abs(dx)>50&&Math.abs(dx)>Math.abs(dy)*1.5)cs=show(cs+(dx<0?1:-1))},{passive:true})}
  if(cur==='home'&&(location.hash==='#auto'||location.hash==='#services')){var t=d.querySelector(location.hash);if(t)setTimeout(function(){t.scrollIntoView()},50)}
  d.querySelectorAll('.rv,.tl').forEach(function(e){e.classList.add('in')});
  /* service pages: accordion, first one open */
  var bl=[].slice.call(d.querySelectorAll('.svb'));
  bl.forEach(function(b,i){var h=b.querySelector('.svb-h');if(!h)return;h.setAttribute('role','button');h.tabIndex=0;
    if(i===0)b.classList.add('m-open');h.setAttribute('aria-expanded',i===0);
    function tg(){var o=!b.classList.contains('m-open');b.classList.toggle('m-open',o);h.setAttribute('aria-expanded',o)}
    h.addEventListener('click',tg);h.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();tg()}})});
})();
