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
  // 6. HERO CARD TILT (mouse parallax)
  // ----------------------------------------------------------
  const heroCard = document.querySelector('.hero__card');

  if (heroCard) {
    const heroVisual = heroCard.closest('.hero__visual');

    heroVisual.addEventListener('mousemove', (e) => {
      const rect = heroVisual.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width  - 0.5;
      const y = (e.clientY - rect.top)  / rect.height - 0.5;
      heroCard.style.transform = `perspective(900px) rotateX(${y * -6}deg) rotateY(${x * 6}deg) translateY(-4px)`;
    });

    heroVisual.addEventListener('mouseleave', () => {
      heroCard.style.transform = '';
    });
  }

});
