/* Consent manager · blocks analytics until the visitor chooses.
   Stored under aeroteque_cookie_consent_v1: "granted" | "denied". Nothing loads before "granted". */
(function(){
  var ID='G-7SS8WJG23J',KEY='aeroteque_cookie_consent_v1',loaded=false,banner,veil,onPrivacy=/privacy\.html$/.test(location.pathname);
  window.dataLayer=window.dataLayer||[];
  function gtag(){dataLayer.push(arguments)}
  window.gtag=window.gtag||gtag;
  gtag('consent','default',{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:'denied'});
  function get(){try{return localStorage.getItem(KEY)}catch(e){return null}}
  function set(v){try{localStorage.setItem(KEY,v)}catch(e){}}
  function load(){
    if(loaded)return;loaded=true;
    gtag('consent','update',{analytics_storage:'granted'});
    var s=document.createElement('script');s.async=true;s.src='https://www.googletagmanager.com/gtag/js?id='+ID;
    document.head.appendChild(s);gtag('js',new Date());gtag('config',ID,{anonymize_ip:true});
  }
  function build(){
    if(banner)return;
    veil=document.createElement('div');veil.className='ck-veil';
    banner=document.createElement('div');banner.className='ck-banner';banner.setAttribute('role','dialog');banner.setAttribute('aria-modal',onPrivacy?'false':'true');banner.setAttribute('aria-labelledby','ckT');
    banner.innerHTML='<div class="ck-in"><div class="ck-main"><div class="ck-top"><img src="assets/logo.png" alt="" width="22" height="22"><span>Privacy</span></div><h2 id="ckT">Your privacy, your choice</h2><p class="ck-lead">We only use optional cookies with your consent, in line with UK and EU data protection law. They help us understand which pages are useful so we can improve the site. We never sell your data, and you can change your mind at any time from Cookie Settings in the footer.</p>'
    +'<div class="ck-links"><a href="privacy.html">Privacy Policy</a><button type="button" class="ck-what" aria-expanded="false" aria-controls="ckP">What we collect</button></div>'
    +'<div class="ck-prefs" id="ckP"><div class="ck-pref"><div><b>Strictly necessary</b><small>Keeps the site working and remembers this choice. Always on.</small></div><span class="ck-sw"><input type="checkbox" checked disabled aria-label="Strictly necessary, always on"><i></i></span></div><div class="ck-pref"><div><b>Analytics</b><small>Anonymous visit statistics (anonymised IP) to measure and improve the site. Optional.</small></div><span class="ck-sw"><input type="checkbox" id="ckA" aria-label="Analytics cookies"><i></i></span></div></div></div>'
    +'<div class="ck-btns"><button type="button" class="ck-all">Accept all</button><button type="button" class="ck-cus" aria-expanded="false" aria-controls="ckP">Customise</button><button type="button" class="ck-rej">Reject all</button></div></div>';
    +'<div class="ck-prefs" id="ckP"><div class="ck-pref"><div><b>Strictly necessary</b><small>Keeps the site working and remembers this choice. Always on.</small></div><span class="ck-sw"><input type="checkbox" checked disabled aria-label="Strictly necessary, always on"><i></i></span></div><div class="ck-pref"><div><b>Analytics</b><small>Anonymous visit statistics to improve the site.</small></div><span class="ck-sw"><input type="checkbox" id="ckA" aria-label="Analytics cookies"><i></i></span></div></div></div>'
    +'<div class="ck-btns"><button type="button" class="ck-all">Accept all</button><button type="button" class="ck-cus" aria-expanded="false" aria-controls="ckP">Customise</button><button type="button" class="ck-rej">Reject all</button></div></div>';
    document.body.appendChild(veil);document.body.appendChild(banner);
    var cus=banner.querySelector('.ck-cus'),prefs=banner.querySelector('#ckP'),a=banner.querySelector('#ckA');
    banner.querySelector('.ck-all').addEventListener('click',function(){choose('granted')});
    banner.querySelector('.ck-rej').addEventListener('click',function(){choose('denied')});
    var what=banner.querySelector('.ck-what');
    function openPrefs(){prefs.classList.add('open');cus.textContent='Save my choices';cus.setAttribute('aria-expanded','true');what.setAttribute('aria-expanded','true');prefs.scrollIntoView({block:'nearest'})}
    what.addEventListener('click',function(){
      if(prefs.classList.contains('open')){prefs.classList.remove('open');cus.textContent='Customise';cus.setAttribute('aria-expanded','false');what.setAttribute('aria-expanded','false')}
      else openPrefs();
    });
    cus.addEventListener('click',function(){if(!prefs.classList.contains('open'))openPrefs();else choose(a.checked?'granted':'denied')});
    banner.addEventListener('keydown',function(e){
      if(e.key!=='Tab'||onPrivacy)return;
      var f=[].slice.call(banner.querySelectorAll('a,button,input:not([disabled])')),i=f.indexOf(document.activeElement);
      if(e.shiftKey&&i<=0){e.preventDefault();f[f.length-1].focus()}else if(!e.shiftKey&&i===f.length-1){e.preventDefault();f[0].focus()}
    });
  }
  function choose(v){set(v);close();if(v==='granted')load()}
  function close(){banner.classList.remove('show');veil.classList.remove('show');document.documentElement.classList.remove('ck-lock')}
  function open(){
    build();
    var a=banner.querySelector('#ckA');if(a)a.checked=get()==='granted';
    if(!onPrivacy){veil.classList.add('show');document.documentElement.classList.add('ck-lock')}
    requestAnimationFrame(function(){banner.classList.add('show');setTimeout(function(){var b=banner.querySelector('.ck-all');if(b&&!onPrivacy)b.focus({preventScroll:true})},300)});
  }
  window.resetCookieConsent=function(){try{localStorage.removeItem(KEY)}catch(e){}open()};
  function init(){
    var c=get();
    if(c==='granted'){load();return}
    if(c==='denied')return;
    if(navigator.globalPrivacyControl===true){set('denied');return}
    open();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
