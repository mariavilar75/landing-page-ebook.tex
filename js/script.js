/* ============================================================
   ebook.tex — Script
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ----------------------------------------------------------
  // 1. HEADER SCROLL
  // ----------------------------------------------------------
  const header = document.getElementById('header');

  const onScroll = () => {
    header.classList.toggle('header--scrolled', window.scrollY > 40);
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
  // 3. SCROLL REVEAL
  // ----------------------------------------------------------
  const revealElements = document.querySelectorAll(
    '.card, .deliverable, .timeline__item, .portfolio__item, .testimonial, .section__header'
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
      threshold: 0.08,
      rootMargin: '0px 0px -40px 0px'
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
  // 5. (removed — CTA form was replaced by WhatsApp CTA)
  // ----------------------------------------------------------

  // ----------------------------------------------------------
  // 6. HERO IMAGE TILT
  // ----------------------------------------------------------
  const heroImage = document.getElementById('heroImage');

  if (heroImage) {
    heroImage.addEventListener('mousemove', (e) => {
      const rect = heroImage.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -3;
      const rotateY = ((x - centerX) / centerX) * 3;
      heroImage.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.18)`;
    });

    heroImage.addEventListener('mouseleave', () => {
      heroImage.style.transform = `rotateX(0deg) rotateY(0deg) scale(1.18)`;
    });
  }
});
