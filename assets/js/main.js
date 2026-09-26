/* =========================================================
   Harsh Solanki — portfolio core
   Loader sequence, navigation, scroll reveals, hero video.
   ========================================================= */
(function () {
  'use strict';

  var RM = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ---------------------------------------------------------
     1. Loader — robotic pick-and-place cell
     --------------------------------------------------------- */
  var loader = $('#loader');
  var fill = $('#lfill'), pct = $('#lpct'), line = $('#lline');
  var lname = $('#lname'), lrole = $('#lrole'), peek = $('#peek');
  var vid = $('#heroVid');

  var LINES = [
    '&gt; initializing mechatronics core',
    '&gt; homing x-axis ................. ok',
    '&gt; gripper pressure .............. ok',
    '&gt; vision module ................. ok',
    '&gt; all systems nominal'
  ];
  var CARET = '<span class="caret"></span>';

  function typeLine(html, done) {
    if (RM) { line.innerHTML = html + CARET; if (done) done(); return; }
    var i = 0, plain = html;
    var timer = setInterval(function () {
      i += 2;
      line.innerHTML = plain.slice(0, i) + CARET;
      if (i >= plain.length) { clearInterval(timer); if (done) done(); }
    }, 16);
  }

  function reveal() {
    if (lname) { lname.classList.add('on'); }
    if (lrole) { lrole.classList.add('on'); }
  }

  var finished = false;
  function openDoors() {
    if (finished) return;
    finished = true;
    if (peek) peek.classList.add('hide');
    setTimeout(function () {
      loader.classList.add('out');
      document.body.classList.remove('lock');
      document.body.classList.add('go');
      startVideo();
      setTimeout(function () { if (loader && loader.parentNode) loader.remove(); }, 1300);
    }, RM ? 40 : 380);
  }

  function runLoader() {
    if (RM) {
      fill.style.width = '100%'; pct.textContent = '100%';
      line.innerHTML = LINES[4] + CARET; reveal();
      setTimeout(openDoors, 260);
      return;
    }
    var DUR = 4300, t0 = Date.now();
    var idx = -1;
    function nextLine() {
      idx++;
      if (idx >= LINES.length) return;
      typeLine(LINES[idx]);
    }
    nextLine();
    [850, 1650, 2450, 3250].forEach(function (ms) { setTimeout(nextLine, ms); });
    setTimeout(function () { if (peek) peek.classList.add('show'); }, 1500);
    setTimeout(function () { if (peek) peek.classList.add('wave'); }, 2500);
    setTimeout(reveal, 2950);

    (function step() {
      var e = Math.min(1, (Date.now() - t0) / DUR);
      var p = Math.round((1 - Math.pow(1 - e, 2.2)) * 100);
      fill.style.width = p + '%';
      pct.textContent = p + '%';
      if (e < 1) requestAnimationFrame(step); else setTimeout(openDoors, 520);
    })();
  }

  /* failsafe: never trap a visitor behind the loader */
  setTimeout(openDoors, 9000);

  /* ---------------------------------------------------------
     2. Hero video — seamless-ish loop with edge fades
     --------------------------------------------------------- */
  function startVideo() {
    if (!vid) return;
    if (RM) { vid.style.opacity = 1; return; }
    var p = vid.play();
    if (p && p.catch) p.catch(function () { vid.style.opacity = 1; });
    setTimeout(function () {
      vid.style.transition = 'opacity .18s linear';
      vid.addEventListener('timeupdate', function () {
        var d = vid.duration;
        if (!d || isNaN(d)) return;
        var t = vid.currentTime, o = 1, F = 0.55;
        if (t < F) o = t / F;
        else if (t > d - F) o = Math.max(0, (d - t) / F);
        vid.style.opacity = (0.25 + 0.75 * o).toFixed(3);
      });
    }, 1400);
  }

  /* ---------------------------------------------------------
     3. Marquee
     --------------------------------------------------------- */
  var WORDS = ['Pneumatics', 'Sensor integration', 'Fusion 360', 'AutoCAD', 'SolidWorks',
    'Python', 'ROS 2', 'Arduino', 'PLC basics', 'Axial flux motors', 'Electric drives',
    'IC engines', 'Camera calibration', 'Image processing'];
  var mq = $('#marquee');
  if (mq) {
    var h = '';
    for (var r = 0; r < 2; r++) for (var i = 0; i < WORDS.length; i++) h += '<li>' + WORDS[i] + '</li>';
    mq.innerHTML = h;
  }

  /* ---------------------------------------------------------
     4. Navigation
     --------------------------------------------------------- */
  var nav = $('#nav'), rail = $('#rail'), burger = $('#burger'), navLinks = $('#navLinks');

  function onScroll() {
    var y = window.scrollY || 0;
    nav.classList.toggle('stuck', y > 24);
    var max = document.documentElement.scrollHeight - window.innerHeight;
    rail.style.width = (max > 0 ? (y / max) * 100 : 0) + '%';
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  burger.addEventListener('click', function () {
    var open = navLinks.classList.toggle('open');
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    document.body.classList.toggle('lock', open);
  });
  $$('#navLinks a').forEach(function (a) {
    a.addEventListener('click', function () {
      navLinks.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('lock');
    });
  });

  var navObs = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (!e.isIntersecting) return;
      $$('#navLinks a').forEach(function (a) {
        a.classList.toggle('on', a.getAttribute('href') === '#' + e.target.id);
      });
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  $$('main section[id]').forEach(function (s) { navObs.observe(s); });

  /* ---------------------------------------------------------
     5. Scroll reveals + capability bars
     --------------------------------------------------------- */
  var rvObs = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (!e.isIntersecting) return;
      e.target.classList.add('in');
      $$('.bar', e.target).forEach(function (b, i) {
        var f = $('.f', b);
        setTimeout(function () { f.style.width = b.getAttribute('data-v') + '%'; }, RM ? 0 : 140 + i * 95);
      });
      rvObs.unobserve(e.target);
    });
  }, { threshold: 0.14 });
  $$('.rv').forEach(function (el) { rvObs.observe(el); });

  var yr = $('#yr');
  if (yr) yr.textContent = new Date().getFullYear();

  /* ---------------------------------------------------------
     6. Résumé download
        Works as a plain link when the site is hosted normally.
        Inside a published claude.ai artifact, plain downloads are
        inert, so route through the downloads capability instead.
     --------------------------------------------------------- */
  (function wireResume() {
    var btns = [$('#resumeBtn'), $('#resumeBtn2')].filter(Boolean);
    if (!btns.length) return;
    if (!(window.claude && typeof window.claude.use === 'function')) return;

    window.claude.use('downloads').then(function (dl) {
      if (!dl) return;
      btns.forEach(function (b) {
        b.addEventListener('click', function (ev) {
          var src = b.getAttribute('href');
          if (!src || src.indexOf('data:') !== 0) return;
          ev.preventDefault();
          fetch(src)
            .then(function (r) { return r.blob(); })
            .then(function (blob) {
              return dl.save({ filename: 'Harsh_Solanki_Resume.pdf', data: blob });
            })
            .catch(function () { window.open(src, '_blank'); });
        });
      });
    }).catch(function () { /* capability unavailable: plain link stays */ });
  })();

  /* ---------------------------------------------------------
     7. Cursor Glitter Effect
     --------------------------------------------------------- */
  (function initCursorGlow() {
    var glow = document.createElement('div');
    glow.className = 'cursor-glow';
    document.body.appendChild(glow);

    var mouseX = 0, mouseY = 0;
    var glowX = 0, glowY = 0;
    var isMoving = false;
    var moveTimeout;

    document.addEventListener('mousemove', function(e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
      
      if (!isMoving) {
        isMoving = true;
        glow.classList.add('active');
      }
      
      clearTimeout(moveTimeout);
      moveTimeout = setTimeout(function() {
        isMoving = false;
        glow.classList.remove('active');
      }, 150);
    });

    function animate() {
      glowX += (mouseX - glowX) * 0.15;
      glowY += (mouseY - glowY) * 0.15;
      
      glow.style.left = glowX + 'px';
      glow.style.top = glowY + 'px';
      
      requestAnimationFrame(animate);
    }
    
    animate();
  })();

  /* ---------------------------------------------------------
     8. Media Lightbox (Click to Fullscreen)
     --------------------------------------------------------- */
  (function initMediaLightbox() {
    var mediaElements = $$('.viz img, .viz video');
    
    mediaElements.forEach(function(media) {
      media.addEventListener('click', function() {
        var lightbox = document.createElement('div');
        lightbox.style.cssText = 'position:fixed;inset:0;z-index:10000;background:rgba(4,7,12,0.95);display:flex;align-items:center;justify-content:center;padding:40px;cursor:zoom-out;animation:fadeIn 0.3s ease;';
        
        var clone = media.cloneNode(true);
        clone.style.cssText = 'max-width:90vw;max-height:90vh;width:auto;height:auto;object-fit:contain;border-radius:8px;box-shadow:0 20px 80px rgba(0,0,0,0.8);animation:zoomIn 0.3s ease;';
        
        if (clone.tagName === 'VIDEO') {
          clone.muted = true;
          clone.loop = true;
          clone.play();
        }
        
        lightbox.appendChild(clone);
        document.body.appendChild(lightbox);
        
        lightbox.addEventListener('click', function() {
          lightbox.style.animation = 'fadeOut 0.25s ease';
          clone.style.animation = 'zoomOut 0.25s ease';
          setTimeout(function() {
            document.body.removeChild(lightbox);
          }, 250);
        });
        
        var escHandler = function(e) {
          if (e.key === 'Escape') {
            lightbox.click();
            document.removeEventListener('keydown', escHandler);
          }
        };
        document.addEventListener('keydown', escHandler);
      });
    });
    
    if (!document.getElementById('lightbox-animations')) {
      var style = document.createElement('style');
      style.id = 'lightbox-animations';
      style.textContent = '@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } } @keyframes fadeOut { from { opacity: 1; } to { opacity: 0; } } @keyframes zoomIn { from { transform: scale(0.8); opacity: 0; } to { transform: scale(1); opacity: 1; } } @keyframes zoomOut { from { transform: scale(1); opacity: 1; } to { transform: scale(0.8); opacity: 0; } }';
      document.head.appendChild(style);
    }
  })();

  /* boot */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runLoader);
  } else {
    runLoader();
  }
})();
