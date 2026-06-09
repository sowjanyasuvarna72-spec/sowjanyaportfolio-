/* ============================================================
   PORTFOLIO – script.js
   Author: Alex Morgan
   ============================================================ */

/* =========================================================
   1. LOADER
   ========================================================= */
window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = document.getElementById('loader');
    if (loader) {
      loader.classList.add('hide');
      setTimeout(() => loader.remove(), 600);
    }
  }, 1900);
});

/* =========================================================
   2. AOS INIT
   ========================================================= */
AOS.init({
  duration: 800,
  easing: 'ease-out-cubic',
  once: true,
  offset: 60
});

/* =========================================================
   3. DARK / LIGHT THEME TOGGLE
   ========================================================= */
const themeToggle = document.getElementById('themeToggle');
const themeIcon   = document.getElementById('themeIcon');
const htmlEl      = document.documentElement;

// Load saved preference
const savedTheme = localStorage.getItem('portfolioTheme') || 'dark';
htmlEl.setAttribute('data-theme', savedTheme);
updateThemeIcon(savedTheme);

themeToggle.addEventListener('click', () => {
  const current = htmlEl.getAttribute('data-theme');
  const next    = current === 'dark' ? 'light' : 'dark';
  htmlEl.setAttribute('data-theme', next);
  localStorage.setItem('portfolioTheme', next);
  updateThemeIcon(next);
});

function updateThemeIcon(theme) {
  if (!themeIcon) return;
  themeIcon.className = theme === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
}

/* =========================================================
   4. NAVBAR SCROLL BEHAVIOUR
   ========================================================= */
const navbar  = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
  // Shrink nav
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }

  // Active link highlight
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 120) {
      current = sec.id;
    }
  });
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
});

// Smooth close mobile nav on link click
navLinks.forEach(link => {
  link.addEventListener('click', () => {
    const bsCollapse = document.getElementById('navMenu');
    if (bsCollapse.classList.contains('show')) {
      const bsInst = bootstrap.Collapse.getOrCreateInstance(bsCollapse);
      bsInst.hide();
    }
  });
});

/* =========================================================
   5. TYPED TEXT ANIMATION
   ========================================================= */
const typedEl   = document.getElementById('typed-text');
const phrases   = [
  'MCA Student'
];
let phraseIdx   = 0;
let charIdx     = 0;
let isDeleting  = false;
let typingPause = false;

function typeLoop() {
  if (typingPause) return;
  const phrase = phrases[phraseIdx];

  if (!isDeleting) {
    typedEl.textContent = phrase.substring(0, charIdx + 1);
    charIdx++;
    if (charIdx === phrase.length) {
      typingPause = true;
      setTimeout(() => { typingPause = false; isDeleting = true; typeLoop(); }, 1800);
      return;
    }
    setTimeout(typeLoop, 75);
  } else {
    typedEl.textContent = phrase.substring(0, charIdx - 1);
    charIdx--;
    if (charIdx === 0) {
      isDeleting = false;
      phraseIdx  = (phraseIdx + 1) % phrases.length;
    }
    setTimeout(typeLoop, 40);
  }
}
typeLoop();

/* =========================================================
   6. PARTICLE CANVAS BACKGROUND
   ========================================================= */
(function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;
  const ctx    = canvas.getContext('2d');
  let W, H, particles;

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  function getAccentColor() {
    return document.documentElement.getAttribute('data-theme') === 'light'
      ? '108,92,231' : '124,111,255';
  }

  function createParticles(n) {
    return Array.from({ length: n }, () => ({
      x:    Math.random() * W,
      y:    Math.random() * H,
      r:    Math.random() * 1.8 + 0.4,
      vx:   (Math.random() - 0.5) * 0.4,
      vy:   (Math.random() - 0.5) * 0.4,
      alpha: Math.random() * 0.5 + 0.15
    }));
  }

  particles = createParticles(90);

  function draw() {
    ctx.clearRect(0, 0, W, H);
    const col = getAccentColor();

    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${col},${p.alpha})`;
      ctx.fill();

      // Move
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;
    });

    // Draw connecting lines
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx   = particles[i].x - particles[j].x;
        const dy   = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < 110) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(${col},${0.12 * (1 - dist/110)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  }
  draw();
})();

/* =========================================================
   7. ANIMATED COUNTER (STATS)
   ========================================================= */
function animateCounters() {
  document.querySelectorAll('.stat-num').forEach(el => {
    const target  = parseInt(el.getAttribute('data-target'), 10);
    const dur     = 1600;
    const step    = dur / target;
    let current   = 0;
    const timer   = setInterval(() => {
      current++;
      el.textContent = current;
      if (current >= target) clearInterval(timer);
    }, step);
  });
}

// Trigger counters once visible
const aboutSection = document.getElementById('about');
if (aboutSection) {
  const counterObs = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      animateCounters();
      counterObs.disconnect();
    }
  }, { threshold: 0.3 });
  counterObs.observe(aboutSection);
}

/* =========================================================
   8. ANIMATED SKILL BARS
   ========================================================= */
const skillSection = document.getElementById('skills');
if (skillSection) {
  const skillObs = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      document.querySelectorAll('.skill-fill').forEach(bar => {
        const width = bar.getAttribute('data-width');
        bar.style.width = width + '%';
      });
      skillObs.disconnect();
    }
  }, { threshold: 0.2 });
  skillObs.observe(skillSection);
}

/* =========================================================
   9. PROJECT FILTER
   ========================================================= */
const filterBtns   = document.querySelectorAll('.filter-btn');
const projectItems = document.querySelectorAll('.project-item');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.getAttribute('data-filter');

    projectItems.forEach(item => {
      const cats = item.getAttribute('data-category') || '';
      const show = filter === 'all' || cats.includes(filter);

      if (show) {
        item.classList.remove('hidden');
        item.style.display = '';
        // Slight re-animate
        item.style.opacity  = '0';
        item.style.transform = 'scale(0.95)';
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            item.style.opacity  = '1';
            item.style.transform = 'scale(1)';
          });
        });
      } else {
        item.classList.add('hidden');
        setTimeout(() => { if (item.classList.contains('hidden')) item.style.display = 'none'; }, 400);
      }
    });
  });
});

/* =========================================================
   10. CONTACT FORM VALIDATION
   ========================================================= */
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', e => {
    e.preventDefault();
    let valid = true;

    const fields = [
      { id: 'cName',    errSelector: '#cName ~ .err-msg',    validate: v => v.trim().length >= 2 },
      { id: 'cEmail',   errSelector: '#cEmail ~ .err-msg',   validate: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) },
      { id: 'cSubject', errSelector: '#cSubject ~ .err-msg', validate: v => v.trim().length >= 3 },
      { id: 'cMessage', errSelector: '#cMessage ~ .err-msg', validate: v => v.trim().length >= 10 }
    ];

    fields.forEach(f => {
      const el      = document.getElementById(f.id);
      const errEl   = contactForm.querySelector(f.errSelector);
      const isValid = f.validate(el.value);

      el.classList.toggle('error', !isValid);
      if (errEl) errEl.classList.toggle('show', !isValid);
      if (!isValid) valid = false;
    });

    if (valid) {
      const successEl = document.getElementById('formSuccess');
      successEl.classList.remove('d-none');
      contactForm.reset();
      // Remove any leftover error states
      contactForm.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
      contactForm.querySelectorAll('.err-msg.show').forEach(el => el.classList.remove('show'));
      setTimeout(() => successEl.classList.add('d-none'), 5000);
    }
  });

  // Clear error on input
  contactForm.querySelectorAll('input, textarea').forEach(input => {
    input.addEventListener('input', () => {
      input.classList.remove('error');
      const err = input.parentElement.querySelector('.err-msg');
      if (err) err.classList.remove('show');
    });
  });
}

/* =========================================================
   11. BACK TO TOP
   ========================================================= */
const backToTop = document.getElementById('backToTop');
if (backToTop) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  });
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* =========================================================
   12. SMOOTH SCROLL FOR ANCHOR LINKS
   ========================================================= */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = navbar ? navbar.offsetHeight + 8 : 70;
      const top    = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* =========================================================
   13. ACTIVE NAV LINK ON PAGE LOAD
   ========================================================= */
window.dispatchEvent(new Event('scroll'));