// Hero background — animated node graph
  (function() {
    const svg = document.getElementById('heroBg');
    const W = window.innerWidth, H = window.innerHeight;
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`);

    const nodes = [];
    const count = 18;
    for (let i = 0; i < count; i++) {
      nodes.push({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
      });
    }

    const edgesEl = [];
    const dotsEl = [];

    // Create edges between nearby nodes
    for (let i = 0; i < count; i++) {
      for (let j = i + 1; j < count; j++) {
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('stroke', 'white');
        line.setAttribute('stroke-width', '1');
        svg.appendChild(line);
        edgesEl.push({ el: line, a: i, b: j });
      }
    }

    // Create dots
    for (let i = 0; i < count; i++) {
      const c = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      c.setAttribute('r', '2.5');
      c.setAttribute('fill', 'white');
      svg.appendChild(c);
      dotsEl.push(c);
    }

    function tick() {
      for (let i = 0; i < count; i++) {
        nodes[i].x += nodes[i].vx;
        nodes[i].y += nodes[i].vy;
        if (nodes[i].x < 0 || nodes[i].x > W) nodes[i].vx *= -1;
        if (nodes[i].y < 0 || nodes[i].y > H) nodes[i].vy *= -1;
        dotsEl[i].setAttribute('cx', nodes[i].x);
        dotsEl[i].setAttribute('cy', nodes[i].y);
      }
      for (const e of edgesEl) {
        const a = nodes[e.a], b = nodes[e.b];
        const dist = Math.hypot(a.x - b.x, a.y - b.y);
        const maxDist = 220;
        if (dist < maxDist) {
          const op = (1 - dist / maxDist) * 0.6;
          e.el.setAttribute('stroke-opacity', op);
          e.el.setAttribute('x1', a.x); e.el.setAttribute('y1', a.y);
          e.el.setAttribute('x2', b.x); e.el.setAttribute('y2', b.y);
        } else {
          e.el.setAttribute('stroke-opacity', '0');
        }
      }
      requestAnimationFrame(tick);
    }
    tick();
  })();

  // Scroll reveal — adds a stagger class to children-based reveals
  document.querySelectorAll('.problem-grid, .founders-grid, .steps-container').forEach(el => {
    el.classList.add('reveal', 'stagger');
  });

  const reveals = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });
  reveals.forEach(el => observer.observe(el));

  // Elegant scroll-driven effects — hero fade + subtle section lift
  const hero = document.querySelector('.hero');
  const heroBg = document.getElementById('heroBg');
  const heroHeadline = document.querySelector('.hero-headline');
  const heroTagline = document.querySelector('.hero-tagline');
  const heroActions = document.querySelector('.hero-actions');
  const heroLabel = document.querySelector('.hero-label');

  let lastY = -1;
  let ticking = false;
  function onScroll() {
    const y = window.scrollY;
    if (y === lastY) { ticking = false; return; }
    lastY = y;

    // Skip at the very top so the hero's initial fade-up animation plays cleanly
    if (y < 2) {
      ticking = false;
      return;
    }

    // Hero: gentle parallax + fade as user scrolls past
    const vh = window.innerHeight;
    const progress = Math.min(1, y / vh);
    if (heroHeadline) {
      heroHeadline.style.transform = `translate3d(0, ${y * 0.18}px, 0)`;
      heroHeadline.style.opacity = String(1 - progress * 0.9);
    }
    if (heroTagline) {
      heroTagline.style.transform = `translate3d(0, ${y * 0.10}px, 0)`;
      heroTagline.style.opacity = String(1 - progress * 1.1);
    }
    if (heroActions) {
      heroActions.style.transform = `translate3d(0, ${y * 0.06}px, 0)`;
      heroActions.style.opacity = String(1 - progress * 1.2);
    }
    if (heroLabel) {
      heroLabel.style.opacity = String(1 - progress * 1.3);
    }
    if (heroBg) {
      heroBg.style.transform = `translate3d(0, ${y * 0.25}px, 0)`;
    }

    ticking = false;
  }
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(onScroll);
      ticking = true;
    }
  }, { passive: true });

  // Waitlist
  function handleWaitlist() {
    const email = document.getElementById('emailInput').value;
    if (!email || !email.includes('@')) {
      document.getElementById('emailInput').style.borderColor = 'rgba(255,255,255,0.5)';
      return;
    }

    // Submit to Google Form
    const formUrl = 'https://docs.google.com/forms/d/e/1FAIpQLSfYJ1iKPr6LkQeTp2i01ylj6dgMyKqVIvcwsUGp9uY6XTD3oA/formResponse';
    const formData = new FormData();
    formData.append('entry.1973834708', email);

    // Send to Google Forms (using no-cors mode since Google Forms doesn't allow CORS)
    fetch(formUrl, {
      method: 'POST',
      body: formData,
      mode: 'no-cors'
    }).then(() => {
      // Show confirmation
      document.getElementById('emailInput').style.display = 'none';
      document.querySelector('.waitlist-submit').style.display = 'none';
      const confirm = document.getElementById('waitlist-confirm');
      confirm.style.opacity = '1';
    }).catch(() => {
      // Even if fetch fails, show confirmation (no-cors doesn't return response)
      document.getElementById('emailInput').style.display = 'none';
      document.querySelector('.waitlist-submit').style.display = 'none';
      const confirm = document.getElementById('waitlist-confirm');
      confirm.style.opacity = '1';
    });
  }

  // Tweaks
  window.addEventListener('message', (e) => {
    if (e.data?.type === '__activate_edit_mode') document.getElementById('tweaks-panel').classList.add('visible');
    if (e.data?.type === '__deactivate_edit_mode') document.getElementById('tweaks-panel').classList.remove('visible');
  });
  window.parent.postMessage({ type: '__edit_mode_available' }, '*');

  function applyBgTweak(val) {
    document.querySelector('.hero').style.background = val;
    document.querySelector('.problem-section').style.background = val;
    document.querySelector('.comparison-section').style.background = val;
    document.querySelector('.cta-section').style.background = val;
  }