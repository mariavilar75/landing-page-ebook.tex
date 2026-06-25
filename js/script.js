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
    '.grid--3, .grid--2, .deliverables, .stack-portfolio, .testimonials, .timeline'
  );

  staggerGroups.forEach(group => {
    Array.from(group.children).forEach((child, i) => {
      child.style.setProperty('--stagger-delay', `${i * 75}ms`);
    });
  });

  const revealElements = document.querySelectorAll(
    '.card, .deliverable, .timeline__item, .testimonial, .section__header, .faq__item'
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
  // 6. HERO — parallax 3D dos tablets
  // ----------------------------------------------------------
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const heroTablets = document.getElementById('heroTablets');
  const hero = document.getElementById('hero');

  if (heroTablets && hero && !prefersReducedMotion && finePointer) {
    let raf = null;

    const onMove = (e) => {
      const rect = hero.getBoundingClientRect();
      const tx = (e.clientX - rect.left) / rect.width  - 0.5;
      const ty = (e.clientY - rect.top)  / rect.height - 0.5;

      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        heroTablets.style.transition = 'transform 0.25s var(--e-out)';
        /* rotação sutil do conjunto, mantendo o preserve-3d */
        heroTablets.style.transform =
          `rotateX(${ty * -6}deg) rotateY(${tx * 10}deg)`;
      });
    };

    const onLeave = () => {
      if (raf) cancelAnimationFrame(raf);
      heroTablets.style.transition = 'transform 0.6s var(--e-out)';
      heroTablets.style.transform = '';
    };

    hero.addEventListener('mousemove', onMove);
    hero.addEventListener('mouseleave', onLeave);
  }

  // Reveal escalonado das features
  const heroFeatures = document.querySelectorAll('.hero__features .feature');
  if (heroFeatures.length) {
    heroFeatures.forEach((f, i) => {
      f.style.opacity = '0';
      f.style.transform = 'translateY(20px)';
      f.style.transition =
        `opacity 0.7s var(--e-out) ${0.7 + i * 0.1}s, transform 0.7s var(--e-out) ${0.7 + i * 0.1}s`;
    });
    requestAnimationFrame(() => {
      heroFeatures.forEach(f => { f.style.opacity = '1'; f.style.transform = 'none'; });
    });
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

  // ----------------------------------------------------------
  // 8. PORTFOLIO STACK — pilha horizontal com hover reveal
  // ----------------------------------------------------------
  const portfolioStack = document.getElementById('portfolioStack');

  if (portfolioStack) {
    const COVER_W = 260;  /* largura de cada card (px) */
    const PEEK    = 78;   /* faixa visível de cada card empilhado (≈30%) */
    const SHIFT   = 182;  /* deslocamento extra ao revelar um card */

    const cards = Array.from(portfolioStack.querySelectorAll('.stack-card'));
    const N     = cards.length;

    /* posiciona a pilha centrada: totalWidth = PEEK*(N-1) + COVER_W */
    const totalW = PEEK * (N - 1) + COVER_W;
    portfolioStack.style.width = totalW + 'px';

    /* aplica as variáveis de transformação em cada card */
    function setVars(card, tx, ty, sc, zi) {
      card.style.setProperty('--tx', tx + 'px');
      card.style.setProperty('--ty', ty + 'px');
      card.style.setProperty('--sc', sc);
      card.style.setProperty('--zi', zi);
    }

    /* estado de repouso: pilha fechada, do fundo para a frente */
    function resetStack() {
      cards.forEach((card, j) => {
        card.classList.remove('is-active');
        setVars(card, PEEK * j, 0, 1, j + 1);
      });
    }

    /* expande o card i, empurra os posteriores para a direita */
    function activateCard(i) {
      cards.forEach((card, j) => {
        card.classList.toggle('is-active', j === i);

        const tx = j <= i
          ? PEEK * j                    /* esquerda: mantém posição */
          : PEEK * j + SHIFT;           /* direita: afasta para revelar */

        const sc = j === i ? 1.04 : 1;
        const zi = j === i ? N + 1 : j + 1;

        setVars(card, tx, 0, sc, zi);
      });
    }

    /* microinteração de respiração ao entrar na seção */
    function breathe() {
      if (prefersReducedMotion) return;
      cards.forEach((card, j) => {
        card.style.transition =
          `transform ${320 + j * 40}ms cubic-bezier(0.16, 1, 0.3, 1)`;
        card.style.setProperty('--ty', '-8px');
      });
      setTimeout(() => {
        cards.forEach(card => {
          card.style.setProperty('--ty', '0px');
        });
        /* restaura transição padrão depois da respiração */
        setTimeout(() => {
          cards.forEach(card => { card.style.transition = ''; });
        }, 600);
      }, 220);
    }

    /* inicializa a pilha */
    resetStack();

    /* interação por hover em cada card */
    cards.forEach((card, i) => {
      card.addEventListener('mouseenter', () => activateCard(i));
    });

    /* reset ao sair da pilha inteira */
    portfolioStack.addEventListener('mouseleave', resetStack);

    /* respiração na primeira vez que a seção entra no viewport */
    let breathed = false;
    const breatheObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !breathed) {
          breathed = true;
          setTimeout(breathe, 300);
          breatheObserver.disconnect();
        }
      });
    }, { threshold: 0.3 });

    breatheObserver.observe(portfolioStack);

    /* suporte a teclado: Tab entre cards, Enter/Space para ativar */
    cards.forEach((card, i) => {
      card.setAttribute('tabindex', '0');
      card.addEventListener('focus',   () => activateCard(i));
      card.addEventListener('blur',    () => resetStack());
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          activateCard(i);
        }
      });
    });
  }

  // ----------------------------------------------------------
  // 9. MODAL PDF — abre ao clicar em qualquer stack-card
  // ----------------------------------------------------------
  const pdfModal    = document.getElementById('pdfModal');
  const pdfFrame    = document.getElementById('pdfFrame');
  const pdfClose    = document.getElementById('pdfModalClose');
  const PDF_SRC     = 'docs/lorem_ipsum_ebook.pdf';

  function openPdfModal() {
    pdfFrame.src = PDF_SRC;
    pdfModal.removeAttribute('hidden');
    document.body.style.overflow = 'hidden';
    pdfClose.focus();
  }

  function closePdfModal() {
    pdfModal.setAttribute('hidden', '');
    document.body.style.overflow = '';
    /* limpa o src para parar o carregamento ao fechar */
    setTimeout(() => { pdfFrame.src = ''; }, 300);
  }

  if (pdfModal) {
    /* clique em qualquer card abre o modal */
    document.querySelectorAll('.stack-card').forEach(card => {
      card.addEventListener('click', openPdfModal);
    });

    /* botão fechar */
    pdfClose.addEventListener('click', closePdfModal);

    /* clique no backdrop fecha */
    pdfModal.querySelector('.pdf-modal__backdrop')
      .addEventListener('click', closePdfModal);

    /* Escape fecha */
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !pdfModal.hasAttribute('hidden')) {
        closePdfModal();
      }
    });
  }

});
