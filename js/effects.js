// GSAP-powered particles, parallax, cursor glow, and micro-interactions
(function(){
  // Guard for reduced motion
  var reduceMotion = false;
  try { reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch(e) {}

  function initCursorGlow(){
    var glow = document.createElement('div');
    glow.className = 'cursor-glow';
    document.body.appendChild(glow);
    document.addEventListener('pointermove', function(e){
      glow.style.left = e.clientX + 'px';
      glow.style.top = e.clientY + 'px';
    });
  }

  function initParallax(){
    var container = document.querySelector('.hero-stage');
    if (!container) return;
    var mid = container.querySelector('.hero-mid');
    var fg = container.querySelector('.hero-fg');
    var tilt = container.querySelector('.holo-tilt');
    document.addEventListener('scroll', function(){
      var y = window.scrollY || window.pageYOffset;
      if (mid) mid.style.transform = 'translateY(' + (y * 0.08) + 'px)';
      if (fg) fg.style.transform = 'translateY(' + (y * 0.15) + 'px)';
    });
    container.addEventListener('pointermove', function(e){
      if (!tilt) return;
      var rect = tilt.getBoundingClientRect();
      var cx = rect.left + rect.width/2;
      var cy = rect.top + rect.height/2;
      var dx = (e.clientX - cx) / rect.width;
      var dy = (e.clientY - cy) / rect.height;
      var rx = dy * -10; // rotateX
      var ry = dx * 12;  // rotateY
      tilt.style.transform = 'perspective(800px) rotateX(' + rx + 'deg) rotateY(' + ry + 'deg)';
    });
    container.addEventListener('pointerleave', function(){
      if (tilt) tilt.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg)';
    });
  }

  function initParticles(){
    var canvas = document.getElementById('fx-particles');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    var dpr = window.devicePixelRatio || 1;
    var width = 0, height = 0;
    var particles = [];

    function resize(){
      var rect = canvas.parentElement.getBoundingClientRect();
      width = rect.width; height = rect.height;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr,0,0,dpr,0,0);
    }
    window.addEventListener('resize', resize);
    resize();

    var count = Math.max(30, Math.min(90, Math.floor(width / 20)));
    for (var i=0; i<count; i++){
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 2 + 0.5,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        c: Math.random() < 0.5 ? 'rgba(0,255,245,0.7)' : 'rgba(160,32,240,0.6)'
      });
    }

    function step(){
      ctx.clearRect(0,0,width,height);
      for (var i=0; i<particles.length; i++){
        var p = particles[i];
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
        ctx.fillStyle = p.c;
        ctx.fill();
      }
      requestAnimationFrame(step);
    }
    if (!reduceMotion) requestAnimationFrame(step);
  }

  // Lightweight starfield with twinkling
  function initStarfield(){
    var canvas = document.getElementById('fx-stars');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    var dpr = window.devicePixelRatio || 1;
    var width = 0, height = 0;
    var stars = [];
    function resize(){
      var rect = canvas.parentElement.getBoundingClientRect();
      width = rect.width; height = rect.height;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr,0,0,dpr,0,0);
    }
    window.addEventListener('resize', resize);
    resize();

    var count = Math.max(120, Math.min(280, Math.floor(width / 5)));
    for (var i=0; i<count; i++){
      stars.push({ x: Math.random()*width, y: Math.random()*height, r: Math.random()*1.2 + 0.2, a: Math.random()*Math.PI*2, s: Math.random()*0.02 + 0.005 });
    }

    function step(){
      ctx.clearRect(0,0,width,height);
      for (var i=0; i<stars.length; i++){
        var st = stars[i];
        st.a += st.s;
        var tw = (Math.sin(st.a) * 0.5 + 0.5) * 0.8 + 0.2; // 0.2 - 1.0
        ctx.beginPath();
        ctx.arc(st.x, st.y, st.r, 0, Math.PI*2);
        ctx.fillStyle = 'rgba(255,255,255,' + tw.toFixed(3) + ')';
        ctx.fill();
      }
      requestAnimationFrame(step);
    }
    if (!reduceMotion) requestAnimationFrame(step);
  }

  // Rotating "globe" lines using parametric lat/long projected to 2D
  function initGlobe(){
    var canvas = document.getElementById('fx-globe');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    var dpr = window.devicePixelRatio || 1;
    var width = 0, height = 0, cx = 0, cy = 0, radius = 0;
    var t = 0;
    function resize(){
      var rect = canvas.parentElement.getBoundingClientRect();
      width = rect.width; height = rect.height;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr,0,0,dpr,0,0);
      cx = width * 0.62; // keep right side near the portrait
      cy = height * 0.48;
      radius = Math.min(width, height) * 0.32;
    }
    window.addEventListener('resize', resize);
    resize();

    function draw(){
      ctx.clearRect(0,0,width,height);
      ctx.lineWidth = 1;
      // meridians
      for (var i=-6; i<=6; i++){
        var phi = i * Math.PI/12 + t*0.6;
        ctx.strokeStyle = 'rgba(0,255,245,0.18)';
        ctx.beginPath();
        for (var a=-Math.PI/2; a<=Math.PI/2; a+=Math.PI/60){
          var x = cx + radius * Math.cos(a) * Math.cos(phi);
          var y = cy + radius * Math.sin(a);
          if (a === -Math.PI/2) ctx.moveTo(x,y); else ctx.lineTo(x,y);
        }
        ctx.stroke();
      }
      // parallels
      for (var j=-6; j<=6; j++){
        var th = j * Math.PI/18;
        var r = radius * Math.cos(th);
        ctx.strokeStyle = 'rgba(160,32,240,0.14)';
        ctx.beginPath();
        ctx.ellipse(cx, cy + radius*Math.sin(th), r, r*0.35, 0, 0, Math.PI*2);
        ctx.stroke();
      }
      t += 0.0035;
      requestAnimationFrame(draw);
    }
    if (!reduceMotion) requestAnimationFrame(draw);
  }

  // Contact page: full-screen rotating wireframe background
  function initContactWireframe(){
    var canvas = document.getElementById('contact-wireframe');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    var dpr = window.devicePixelRatio || 1;
    var width = 0, height = 0, cx = 0, cy = 0, radius = 0, t = 0;
    function skin(){
      var root = getComputedStyle(document.documentElement);
      return root.getPropertyValue('--skin-color').trim() || '#8a2be2';
    }
    function hexToRgba(hex, a){
      var h = hex.replace('#','');
      if (h.length === 3) h = h.split('').map(function(c){ return c + c; }).join('');
      var r = parseInt(h.substr(0,2),16);
      var g = parseInt(h.substr(2,2),16);
      var b = parseInt(h.substr(4,2),16);
      return 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';
    }
    function resize(){
      width = window.innerWidth; height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr,0,0,dpr,0,0);
      cx = width * 0.5; cy = height * 0.5;
      radius = Math.min(width, height) * 0.38;
    }
    window.addEventListener('resize', resize);
    resize();
    function draw(){
      ctx.clearRect(0,0,width,height);
      var color = skin();
      // gentle vignette to give depth
      var vg = ctx.createRadialGradient(cx, cy, radius*0.2, cx, cy, radius*1.6);
      vg.addColorStop(0, 'rgba(0,0,0,0)');
      vg.addColorStop(1, 'rgba(0,0,0,0.35)');
      ctx.fillStyle = vg; ctx.fillRect(0,0,width,height);

      // meridians
      ctx.lineWidth = 1.2;
      for (var i=-8; i<=8; i++){
        var phi = i * Math.PI/16 + t*0.6;
        ctx.strokeStyle = hexToRgba(color, 0.35);
        ctx.beginPath();
        for (var a=-Math.PI/2; a<=Math.PI/2; a+=Math.PI/64){
          var x = cx + radius * Math.cos(a) * Math.cos(phi);
          var y = cy + radius * Math.sin(a);
          if (a === -Math.PI/2) ctx.moveTo(x,y); else ctx.lineTo(x,y);
        }
        ctx.stroke();
      }
      // parallels
      for (var j=-8; j<=8; j++){
        var th = j * Math.PI/24;
        var r = radius * Math.cos(th);
        ctx.strokeStyle = hexToRgba(color, 0.22);
        ctx.beginPath();
        ctx.ellipse(cx, cy + radius*Math.sin(th), r, r*0.36, 0, 0, Math.PI*2);
        ctx.stroke();
      }
      t += 0.0032;
      requestAnimationFrame(draw);
    }
    if (!reduceMotion) requestAnimationFrame(draw);

    // react to color switcher changes
    document.addEventListener('themeColorChanged', function(){
      // redraw next frame uses updated getComputedStyle color automatically
    });
  }

  function initReveal(){
    var items = document.querySelectorAll('.reveal-on-scroll');
    if (!items.length) return;
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if (entry.isIntersecting) {
          entry.target.style.transition = 'transform 800ms ease, opacity 800ms ease';
          entry.target.style.transform = 'translateY(0px)';
          entry.target.style.opacity = '1';
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    items.forEach(function(el){
      el.style.transform = 'translateY(24px)';
      el.style.opacity = '0';
      io.observe(el);
    });
  }

  // Submit burst effect for contact success
  window.triggerFXBurst = function(x, y){
    var canvas = document.getElementById('fx-comet') || document.getElementById('fx-particles');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    var dpr = window.devicePixelRatio || 1;
    var width = canvas.width / dpr;
    var height = canvas.height / dpr;
    var particles = [];
    for (var i=0; i<40; i++){
      particles.push({ x:x, y:y, vx:(Math.random()-0.5)*4, vy:(Math.random()-0.5)*4, life: 60, color: Math.random()<0.5 ? 'rgba(0,255,245,0.9)' : 'rgba(160,32,240,0.9)' });
    }
    function step(){
      ctx.clearRect(0,0,width,height);
      for (var i=0; i<particles.length; i++){
        var p = particles[i];
        p.x += p.vx; p.y += p.vy; p.vy += 0.02; p.life -= 1;
        ctx.beginPath(); ctx.arc(p.x, p.y, 2, 0, Math.PI*2);
        ctx.fillStyle = p.color; ctx.fill();
      }
      particles = particles.filter(function(p){ return p.life>0; });
      if (particles.length>0) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  };

  document.addEventListener('partialsLoaded', function(){
    initCursorGlow();
    initParallax();
    initParticles();
    initStarfield();
    initGlobe();
    initContactWireframe();
    initReveal();
  });
  if (document.readyState !== 'loading') {
    initCursorGlow();
    initParallax();
    initParticles();
    initStarfield();
    initGlobe();
    initContactWireframe();
    initReveal();
  } else {
    document.addEventListener('DOMContentLoaded', function(){
      initCursorGlow();
      initParallax();
      initParticles();
      initStarfield();
      initGlobe();
      initContactWireframe();
      initReveal();
    });
  }
})();


