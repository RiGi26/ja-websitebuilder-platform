// ============================================================
// TOKO-BESPOKE — bundel primitive interaksi vanilla bersama (tanpa library).
// Generalisasi atelier-script.ts: SATU mesin interaksi dipakai SEMUA renderer
// bespoke toko (kuliner/kerajinan/…). Prefix kelas-perilaku bisa diparametrik
// (default 'lx') supaya hook behavior NETRAL, terpisah dari kelas VISUAL tiap
// tema (mis. '.kl-' kuliner). Satu tema per halaman → tak ada bentrok antar-prefix.
//
// Di-inject sebagai <script dangerouslySetInnerHTML> oleh tiap renderer (pola
// BatikTokoRenderer.ScrollRevealScript) → hidup di DUA jalur: static sample HTML
// (renderToStaticMarkup → file://, tanpa hydration) DAN produksi SSR.
//
// Kontrak no-JS: state tersembunyi digate kelas `.<p>-js` (ditambah script ini).
// Tanpa JS → konten tampil penuh. prefers-reduced-motion → tampilkan semua.
//
// Primitive: reveal · navState (sentinel) · filter (chips) · lightbox
// (quick-look aksesibel) · countUp (stats, SSR=final) · carousel (scroll-snap,
// JS hanya tombol+dot) · magnetic (CTA, pointer:fine).
// ============================================================

export function makeLuxScript(p = 'lx'): string {
  return `(function(){
if(window.__${p}Init)return;window.__${p}Init=1;
function init(){
  var root=document.querySelector('.${p}-root');if(!root)return;
  root.classList.add('${p}-js');
  var reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasIO=typeof IntersectionObserver!=='undefined';

  /* reveal — satu observer untuk semua .${p}-reveal */
  var els=[].slice.call(root.querySelectorAll('.${p}-reveal'));
  if(reduce||!hasIO){for(var i=0;i<els.length;i++)els[i].classList.add('${p}-in');}
  else{
    var io=new IntersectionObserver(function(es){
      for(var j=0;j<es.length;j++){if(es[j].isIntersecting){es[j].target.classList.add('${p}-in');io.unobserve(es[j].target);}}
    },{rootMargin:'0px 0px -8% 0px',threshold:0.08});
    for(var k=0;k<els.length;k++)io.observe(els[k]);
  }

  /* navState — sentinel di puncak hero; lewat → nav kompak */
  var s=root.querySelector('.${p}-sentinel');
  if(s&&hasIO){
    new IntersectionObserver(function(es){
      root.classList.toggle('${p}-scrolled',!es[0].isIntersecting);
    }).observe(s);
  }else{root.classList.add('${p}-scrolled');}

  /* filter — chips kategori; CSS yang menyembunyikan (.${p}-hide) */
  var chips=[].slice.call(root.querySelectorAll('.${p}-chip'));
  if(chips.length){
    var cards=[].slice.call(root.querySelectorAll('.${p}-look [data-cat]'));
    chips.forEach(function(ch){
      ch.addEventListener('click',function(){
        chips.forEach(function(c){c.setAttribute('aria-pressed',c===ch?'true':'false');});
        var f=ch.getAttribute('data-f');
        cards.forEach(function(card){
          var hide=f!=='*'&&card.getAttribute('data-cat')!==f;
          card.classList.toggle('${p}-hide',hide);
        });
      });
    });
  }

  /* lightbox — quick-look produk/galeri. Dialog SSR tunggal, diisi dari data-*
     trigger. Fokus terkunci, Esc/backdrop menutup, panah = navigasi. */
  var lb=root.querySelector('.${p}-lb');
  if(lb){
    var trig=[].slice.call(root.querySelectorAll('.${p}-lb-open'));
    var img=lb.querySelector('.${p}-lb-media img');
    var cta=lb.querySelector('.${p}-lb-cta');
    var cur=-1,lastFocus=null;
    function put(sel,txt){var el=lb.querySelector(sel);if(!el)return;el.textContent=txt||'';el.style.display=txt?'':'none';}
    function fill(i){
      if(!trig.length)return;
      cur=((i%trig.length)+trig.length)%trig.length;
      var d=trig[cur].dataset;
      if(img){img.src=d.src||'';img.alt=d.title||'';}
      put('.${p}-lb-cat',d.cat);put('.${p}-lb-title',d.title);put('.${p}-lb-price',d.price);put('.${p}-lb-desc',d.desc);
      if(cta){if(d.href){cta.setAttribute('href',d.href);cta.style.display='';}else{cta.style.display='none';}}
    }
    function open(i,t){
      lastFocus=t||document.activeElement;
      fill(i);
      lb.removeAttribute('hidden');
      requestAnimationFrame(function(){lb.classList.add('${p}-lb-in');});
      document.body.style.overflow='hidden';
      var x=lb.querySelector('.${p}-lb-x');if(x)x.focus();
    }
    function close(){
      lb.classList.remove('${p}-lb-in');
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
    var pv=lb.querySelector('.${p}-lb-prev'),nx=lb.querySelector('.${p}-lb-next');
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

  /* countUp — SSR menulis nilai FINAL (kontrak no-JS); dengan JS angka di-reset
     ke 0 lalu naik ke final saat band terlihat. Format direkonstruksi dari teks. */
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
          var pr=Math.min(1,(now-t0)/D),e=1-Math.pow(1-pr,3);
          it.el.textContent=it.pre+cuFmt(it.val*e,it.dec,it.sepD,it.sepT)+it.suf;
          if(pr<1)requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
      });
    },{threshold:.5});
    cuItems.forEach(function(it){cuIO.observe(it.el);});
  }

  /* carousel — testimoni scroll-snap; JS hanya tombol/dot/sinkronisasi. */
  var car=root.querySelector('.${p}-tcar');
  if(car){
    var track=car.querySelector('.${p}-tcar-track');
    var slides=track?[].slice.call(track.children):[];
    var dots=[].slice.call(root.querySelectorAll('.${p}-dot'));
    var tPrev=root.querySelector('.${p}-tprev'),tNext=root.querySelector('.${p}-tnext');
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

  /* magnetic — tombol CTA menarik halus ke kursor; pointer presisi saja. */
  if(!reduce&&window.matchMedia&&window.matchMedia('(pointer:fine)').matches){
    [].slice.call(root.querySelectorAll('.${p}-mag')).forEach(function(btn){
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
}

// Default behavior-prefix 'lx' — dipakai semua renderer bespoke toko.
export const LUX_JS = makeLuxScript('lx')
