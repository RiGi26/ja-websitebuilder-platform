// ============================================================
// THEME ENGINE — bundel primitive interaksi vanilla, PANEN dari flagship
// toko-atelier (atelier-script.ts). Di-inject ComposableRenderer sebagai
// <script dangerouslySetInnerHTML> HANYA bila manifest memakai varian
// interaktif (countUp/carousel/quicklook/duotone) → tema lain nol regresi.
//
// Dua jalur eksekusi (alasan pola inline, bukan useEffect):
//   1. Static sample HTML (renderToStaticMarkup → file://, tanpa hydration)
//   2. Produksi SSR (eksekusi saat parse, independen dari React)
// CeReveal (useEffect) mati di jalur 1 — script ini MENGGANTIKANNYA pada tema
// yang menyuntik (reveal di sini menambah .ce-js + .ce-in yang sama), sehingga
// scroll-reveal lux akhirnya hidup juga di sample statis.
//
// Kontrak no-JS: state tersembunyi digate `.ce-js` (ditambah script ini).
// prefers-reduced-motion: reveal langsung tampil, countUp tetap nilai final,
// scroll carousel tanpa smooth, magnetic mati (double gate dengan CSS).
// ============================================================

export const CE_JS = `(function(){
if(window.__ceInit)return;window.__ceInit=1;
function init(){
  var root=document.querySelector('.ce-root');if(!root)return;
  root.classList.add('ce-js');
  var reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasIO=typeof IntersectionObserver!=='undefined';

  /* reveal — kontrak sama dgn CeReveal (.ce-reveal → .ce-in), satu observer */
  var els=[].slice.call(root.querySelectorAll('.ce-reveal'));
  if(reduce||!hasIO){for(var i=0;i<els.length;i++)els[i].classList.add('ce-in');}
  else{
    var io=new IntersectionObserver(function(es){
      for(var j=0;j<es.length;j++){if(es[j].isIntersecting){es[j].target.classList.add('ce-in');io.unobserve(es[j].target);}}
    },{rootMargin:'0px 0px -8% 0px',threshold:0.08});
    for(var k=0;k<els.length;k++)io.observe(els[k]);
  }

  /* countUp — SSR menulis nilai FINAL; dengan JS angka di-reset ke 0 saat init
     lalu naik ke final ketika terlihat. Format (ribuan/desimal/prefix/suffix)
     direkonstruksi dari teks asli. reduce/tanpa-IO → biarkan final. */
  function cuFmt(v,dec,sepD,sepT){
    var s=v.toFixed(dec),ip=s.split('.')[0],dp=dec?s.split('.')[1]:'';
    if(sepT)ip=ip.replace(/\\B(?=(\\d{3})+(?!\\d))/g,sepT);
    return ip+(dec?sepD+dp:'');
  }
  var cus=[].slice.call(root.querySelectorAll('[data-cu]'));
  if(cus.length&&hasIO&&!reduce){
    var cuItems=[];
    cus.forEach(function(el){
      var m=(el.textContent||'').match(/^([^0-9]*)([0-9][0-9.,]*)(.*)$/);
      if(!m)return;
      var num=m[2],parts=num.split(/[.,]/),dec=0,sepD='',sepT='';
      if(parts.length>1){
        var last=parts[parts.length-1];
        if(last.length<3){dec=last.length;sepD=num.charAt(num.length-last.length-1);if(parts.length>2)sepT=num.charAt(parts[0].length);}
        else sepT=num.charAt(parts[0].length);
      }
      var val=parseFloat(dec>0?parts.slice(0,-1).join('')+'.'+parts[parts.length-1]:parts.join(''));
      if(!isFinite(val))return;
      el.setAttribute('data-cu-i',String(cuItems.length));
      cuItems.push({el:el,pre:m[1],suf:m[3],val:val,dec:dec,sepD:sepD,sepT:sepT});
      el.textContent=m[1]+cuFmt(0,dec,sepD,sepT)+m[3];
    });
    var cuIO=new IntersectionObserver(function(es){
      es.forEach(function(en){
        if(!en.isIntersecting)return;
        cuIO.unobserve(en.target);
        var it=cuItems[parseInt(en.target.getAttribute('data-cu-i'),10)];
        if(!it)return;
        var t0=0,D=1400;
        function step(now){
          if(!t0)t0=now;
          var p=Math.min(1,(now-t0)/D),e=1-Math.pow(1-p,3);
          it.el.textContent=it.pre+cuFmt(it.val*e,it.dec,it.sepD,it.sepT)+it.suf;
          if(p<1)requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
      });
    },{threshold:.5});
    cuItems.forEach(function(it){cuIO.observe(it.el);});
  }

  /* carousel — testimoni scroll-snap; JS hanya tombol/dot/sinkronisasi */
  var car=root.querySelector('.ce-tcar');
  if(car){
    var track=car.querySelector('.ce-tcar-track');
    var slides=track?[].slice.call(track.children):[];
    var dots=[].slice.call(car.querySelectorAll('.ce-dot'));
    var tPrev=car.querySelector('.ce-tprev'),tNext=car.querySelector('.ce-tnext');
    if(track&&slides.length){
      var curIdx=function(){
        if(track.scrollWidth>track.clientWidth+4&&track.scrollLeft>=track.scrollWidth-track.clientWidth-2)return slides.length-1;
        var x=track.scrollLeft,b=0,d=1e9;
        for(var j=0;j<slides.length;j++){var dd=Math.abs(slides[j].offsetLeft-track.offsetLeft-x);if(dd<d){d=dd;b=j;}}
        return b;
      };
      var go=function(i){
        i=Math.max(0,Math.min(slides.length-1,i));
        track.scrollTo({left:slides[i].offsetLeft-track.offsetLeft,behavior:reduce?'auto':'smooth'});
      };
      var sync=function(){
        var i=curIdx();
        dots.forEach(function(dt,j){dt.setAttribute('aria-current',j===i?'true':'false');});
        if(tPrev)tPrev.disabled=i===0;
        if(tNext)tNext.disabled=i===slides.length-1;
      };
      var raf=0;
      track.addEventListener('scroll',function(){
        if(raf)return;
        raf=requestAnimationFrame(function(){raf=0;sync();});
      });
      dots.forEach(function(dt,j){dt.addEventListener('click',function(){go(j);});});
      if(tPrev)tPrev.addEventListener('click',function(){go(curIdx()-1);});
      if(tNext)tNext.addEventListener('click',function(){go(curIdx()+1);});
      sync();
    }
  }

  /* lightbox — quick-look galeri. Dialog SSR tunggal diisi dari data-* trigger;
     fokus terkunci, Esc/backdrop menutup, panah = navigasi antar trigger. */
  var lb=root.querySelector('.ce-lb');
  if(lb){
    var trig=[].slice.call(root.querySelectorAll('.ce-lb-open'));
    var img=lb.querySelector('.ce-lb-media img');
    var cur=-1,lastFocus=null;
    function put(sel,txt){var el=lb.querySelector(sel);if(!el)return;el.textContent=txt||'';el.style.display=txt?'':'none';}
    function fill(i){
      if(!trig.length)return;
      cur=((i%trig.length)+trig.length)%trig.length;
      var d=trig[cur].dataset;
      if(img){img.src=d.src||'';img.alt=d.title||'';}
      put('.ce-lb-title',d.title);
    }
    function open(i,t){
      lastFocus=t||document.activeElement;
      fill(i);
      lb.removeAttribute('hidden');
      requestAnimationFrame(function(){lb.classList.add('ce-lb-in');});
      document.body.style.overflow='hidden';
      var x=lb.querySelector('.ce-lb-x');if(x)x.focus();
    }
    function close(){
      lb.classList.remove('ce-lb-in');
      lb.setAttribute('hidden','');
      document.body.style.overflow='';
      if(lastFocus&&lastFocus.focus)lastFocus.focus();
    }
    trig.forEach(function(t,i){t.addEventListener('click',function(){open(i,t);});});
    lb.addEventListener('click',function(e){
      var el=e.target;
      while(el&&el!==lb){if(el.getAttribute&&el.hasAttribute('data-lb-close')){close();return;}el=el.parentNode;}
      if(e.target===lb)close();
    });
    var pv=lb.querySelector('.ce-lb-prev'),nx=lb.querySelector('.ce-lb-next');
    if(pv)pv.addEventListener('click',function(){fill(cur-1);});
    if(nx)nx.addEventListener('click',function(){fill(cur+1);});
    document.addEventListener('keydown',function(e){
      if(lb.hasAttribute('hidden'))return;
      if(e.key==='Escape'){close();return;}
      if(e.key==='ArrowLeft'){fill(cur-1);return;}
      if(e.key==='ArrowRight'){fill(cur+1);return;}
      if(e.key==='Tab'){
        var f=lb.querySelectorAll('button,a[href]');
        if(!f.length)return;
        var first=f[0],last=f[f.length-1];
        if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}
        else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}
      }
    });
  }

  /* magnetic — tombol CTA menarik halus ke kursor; hanya pointer presisi,
     mati total saat reduced-motion. Kembali memantul via transition CSS. */
  if(!reduce&&window.matchMedia&&window.matchMedia('(pointer:fine)').matches){
    [].slice.call(root.querySelectorAll('.ce-mag')).forEach(function(btn){
      btn.addEventListener('pointermove',function(e){
        var r=btn.getBoundingClientRect();
        var dx=e.clientX-(r.left+r.width/2),dy=e.clientY-(r.top+r.height/2);
        btn.style.transform='translate('+(dx*.22).toFixed(1)+'px,'+(dy*.3).toFixed(1)+'px)';
      });
      btn.addEventListener('pointerleave',function(){btn.style.transform='';});
    });
  }
}
if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',init);}else{init();}
})();`
