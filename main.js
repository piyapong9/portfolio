/* =========================================================
   LENDEX – main.js
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ──────────────────────────────────
     1. Custom Cursor
  ────────────────────────────────── */
  const cursor   = document.getElementById('cursor');
  const follower = document.getElementById('cursorFollower');

  let mouseX = 0, mouseY = 0;
  let followerX = 0, followerY = 0;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top  = mouseY + 'px';
  });

  // Smooth follower
  function animateFollower() {
    followerX += (mouseX - followerX) * 0.12;
    followerY += (mouseY - followerY) * 0.12;
    follower.style.left = followerX + 'px';
    follower.style.top  = followerY + 'px';
    requestAnimationFrame(animateFollower);
  }
  animateFollower();

  // Enlarge on interactive elements
  const interactables = document.querySelectorAll('a, button, .work-card, .service-card, .testi-card');
  interactables.forEach(el => {
    el.addEventListener('mouseenter', () => {
      follower.style.width  = '60px';
      follower.style.height = '60px';
      follower.style.borderColor = 'rgba(200,255,0,0.8)';
    });
    el.addEventListener('mouseleave', () => {
      follower.style.width  = '36px';
      follower.style.height = '36px';
      follower.style.borderColor = 'rgba(200,255,0,0.5)';
    });
  });

  /* ──────────────────────────────────
     2. Scroll-triggered Animations
  ────────────────────────────────── */
  const animateEls = document.querySelectorAll('[data-animate]');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = entry.target.dataset.delay || 0;
        setTimeout(() => {
          entry.target.classList.add('is-visible');
        }, parseInt(delay));
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  animateEls.forEach(el => observer.observe(el));

  /* ──────────────────────────────────
     3. Counter Animation
  ────────────────────────────────── */
  const counters = document.querySelectorAll('.stat__number[data-count]');

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => counterObserver.observe(c));

  function animateCounter(el) {
    const target   = parseInt(el.dataset.count);
    const duration = 1800;
    const step     = 16;
    const increment = target / (duration / step);
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        el.textContent = target;
        clearInterval(timer);
      } else {
        el.textContent = Math.floor(current);
      }
    }, step);
  }

  /* ──────────────────────────────────
     4. Skill Bar Animation
  ────────────────────────────────── */
  const bars = document.querySelectorAll('.skill-bar__fill');

  const barObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const width = entry.target.dataset.width;
        entry.target.style.width = width + '%';
        barObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  bars.forEach(bar => barObserver.observe(bar));

  /* ──────────────────────────────────
     5. Blob Path Morphing
  ────────────────────────────────── */
  const blobPath = document.getElementById('blobPath');
  const blobShapes = [
    'M318,280Q264,360,180,354Q96,348,54,274Q12,200,60,128Q108,56,192,52Q276,48,326,124Q376,200,318,280Z',
    'M304,270Q252,340,180,346Q108,352,68,276Q28,200,72,130Q116,60,196,54Q276,48,318,124Q360,200,304,270Z',
    'M330,275Q270,350,185,355Q100,360,56,280Q12,200,58,122Q104,44,192,48Q280,52,334,126Q388,200,330,275Z',
    'M310,285Q258,370,178,360Q98,350,52,275Q6,200,56,130Q106,60,188,50Q270,40,320,120Q370,200,310,285Z',
  ];
  let blobIndex = 0;

  if (blobPath) {
    setInterval(() => {
      blobIndex = (blobIndex + 1) % blobShapes.length;
      blobPath.setAttribute('d', blobShapes[blobIndex]);

      // Also update clipPath path
      const clipPath = document.querySelector('#blobClip path');
      if (clipPath) clipPath.setAttribute('d', blobShapes[blobIndex]);

      // update gradient path
      const bgPath = document.querySelector('.hero__blob path');
      if (bgPath) bgPath.setAttribute('d', blobShapes[blobIndex]);
    }, 3000);
  }

  /* ──────────────────────────────────
     6. Parallax on hero bg text
  ────────────────────────────────── */
  const heroBgText = document.querySelector('.hero__bg-text');

  window.addEventListener('scroll', () => {
    if (!heroBgText) return;
    const scrollY = window.scrollY;
    heroBgText.style.transform = `translate(-50%, calc(-50% + ${scrollY * 0.2}px))`;
  }, { passive: true });

  /* ──────────────────────────────────
     7. Smooth active work card tilt
  ────────────────────────────────── */
  const workCards = document.querySelectorAll('.work-card');
  workCards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect   = card.getBoundingClientRect();
      const cx     = rect.left + rect.width  / 2;
      const cy     = rect.top  + rect.height / 2;
      const dx     = (e.clientX - cx) / (rect.width  / 2);
      const dy     = (e.clientY - cy) / (rect.height / 2);
      card.style.transform = `perspective(800px) rotateY(${dx * 4}deg) rotateX(${-dy * 4}deg) translateY(-8px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  /* ──────────────────────────────────
     8. Service card mouse glow
  ────────────────────────────────── */
  const serviceCards = document.querySelectorAll('.service-card');
  serviceCards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--gx', x + 'px');
      card.style.setProperty('--gy', y + 'px');
      card.style.backgroundImage = `
        radial-gradient(circle 200px at var(--gx) var(--gy), rgba(200,255,0,0.06), transparent 70%),
        none
      `;
    });
    card.addEventListener('mouseleave', () => {
      card.style.backgroundImage = '';
    });
  });

  /* ──────────────────────────────────
     9. Marquee pause on hover
  ────────────────────────────────── */
  const marqueeTrack = document.querySelector('.marquee-track');
  if (marqueeTrack) {
    marqueeTrack.addEventListener('mouseenter', () => {
      marqueeTrack.style.animationPlayState = 'paused';
    });
    marqueeTrack.addEventListener('mouseleave', () => {
      marqueeTrack.style.animationPlayState = 'running';
    });
  }

});
