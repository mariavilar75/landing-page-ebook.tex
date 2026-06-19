/* ============================================================
   ebook.tex — Script
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ----------------------------------------------------------
  // 1. HEADER SCROLL
  // ----------------------------------------------------------
  const header = document.getElementById('header');

  const onScroll = () => {
    header.classList.toggle('header--scrolled', window.scrollY > 60);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ----------------------------------------------------------
  // 2. NAVEGAÇÃO MOBILE
  // ----------------------------------------------------------
  const navToggle = document.getElementById('navToggle');
  const navList   = document.getElementById('navList');
  const navLinks  = navList.querySelectorAll('.nav__link');

  const toggleNav = (force) => {
    const isOpen = force !== undefined
      ? force
      : !navList.classList.contains('nav__list--open');

    navList.classList.toggle('nav__list--open', isOpen);
    navToggle.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  };

  navToggle.addEventListener('click', () => toggleNav());

  navLinks.forEach(link => {
    link.addEventListener('click', () => toggleNav(false));
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navList.classList.contains('nav__list--open')) {
      toggleNav(false);
    }
  });

  // ----------------------------------------------------------
  // 3. SCROLL REVEAL — com stagger por grupo
  // ----------------------------------------------------------
  const staggerGroups = document.querySelectorAll(
    '.grid--3, .grid--2, .deliverables, .portfolio, .testimonials, .timeline'
  );

  staggerGroups.forEach(group => {
    Array.from(group.children).forEach((child, i) => {
      child.style.setProperty('--stagger-delay', `${i * 75}ms`);
    });
  });

  const revealElements = document.querySelectorAll(
    '.card, .deliverable, .timeline__item, .portfolio__item, .testimonial, .section__header, .faq__item'
  );

  if (revealElements.length) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal--visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.06,
      rootMargin: '0px 0px -36px 0px'
    });

    revealElements.forEach(el => {
      el.classList.add('reveal');
      revealObserver.observe(el);
    });
  }

  // ----------------------------------------------------------
  // 4. FAQ ACCORDION
  // ----------------------------------------------------------
  const faqQuestions = document.querySelectorAll('.faq__question');

  faqQuestions.forEach(btn => {
    btn.addEventListener('click', () => {
      const isOpen = btn.getAttribute('aria-expanded') === 'true';
      faqQuestions.forEach(q => q.setAttribute('aria-expanded', 'false'));
      btn.setAttribute('aria-expanded', !isOpen);
    });
  });

  // ----------------------------------------------------------
  // 5. ACTIVE NAV LINK on scroll
  // ----------------------------------------------------------
  const sections = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav__link[href^="#"]');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navAnchors.forEach(a => {
          a.classList.toggle(
            'nav__link--active',
            a.getAttribute('href') === `#${id}` && !a.classList.contains('nav__link--cta')
          );
        });
      }
    });
  }, {
    rootMargin: '-40% 0px -55% 0px',
    threshold: 0,
  });

  sections.forEach(s => sectionObserver.observe(s));

  // ----------------------------------------------------------
  // 6. HERO — parallax 3D do palco + camadas de profundidade
  // ----------------------------------------------------------
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const heroStage = document.getElementById('heroStage');
  const hero = document.getElementById('hero');

  if (heroStage && hero && !prefersReducedMotion && finePointer) {
    const layers = hero.querySelectorAll('[data-parallax]');
    let raf = null, tx = 0, ty = 0;

    const onMove = (e) => {
      const rect = hero.getBoundingClientRect();
      tx = (e.clientX - rect.left) / rect.width  - 0.5;
      ty = (e.clientY - rect.top)  / rect.height - 0.5;

      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        heroStage.style.transition = 'transform 0.2s var(--e-out)';
        heroStage.style.transform =
          `rotateX(${ty * -4}deg) rotateY(${tx * 6}deg) translate3d(${tx * 10}px, ${ty * 8}px, 0)`;
        layers.forEach(layer => {
          const depth = parseFloat(layer.dataset.parallax) || 0;
          layer.style.transform = `translate3d(${tx * depth * 100}px, ${ty * depth * 100}px, 0)`;
        });
      });
    };

    const onLeave = () => {
      if (raf) cancelAnimationFrame(raf);
      heroStage.style.transition = 'transform 0.6s var(--e-out)';
      heroStage.style.transform = '';
      layers.forEach(layer => {
        layer.style.transition = 'transform 0.6s var(--e-out)';
        layer.style.transform = '';
      });
    };

    hero.addEventListener('mousemove', onMove);
    hero.addEventListener('mouseleave', onLeave);
  }

  // ----------------------------------------------------------
  // 7. BOTÕES MAGNÉTICOS — atração sutil ao cursor
  // ----------------------------------------------------------
  if (finePointer && !prefersReducedMotion) {
    document.querySelectorAll('.btn').forEach(btn => {
      const strength = 0.28;
      btn.addEventListener('mousemove', (e) => {
        const r = btn.getBoundingClientRect();
        const mx = e.clientX - r.left - r.width / 2;
        const my = e.clientY - r.top - r.height / 2;
        btn.style.transform = `translate(${mx * strength}px, ${my * strength}px)`;
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
      });
    });
  }

});
