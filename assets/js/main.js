document.addEventListener('DOMContentLoaded', () => {
  /* ---------------- Header shrink + progress bar ---------------- */
  const header = document.querySelector('.site-header');
  const progressBar = document.querySelector('.progress-bar');

  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 40);

    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = pct + '%';

    // Parallax hero image
    const heroImg = document.querySelector('.hero-bg img');
    if (heroImg) {
      const offset = Math.min(scrollTop * 0.35, 200);
      heroImg.style.transform = `scale(1.08) translateY(${offset}px)`;
    }
  };
  document.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------------- Mobile nav ---------------- */
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('mobile-open');
    navToggle.classList.toggle('open');
  });
  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => navLinks.classList.remove('mobile-open'));
  });

  /* ---------------- Scroll reveal ---------------- */
  const revealEls = document.querySelectorAll('[data-reveal], [data-reveal-children]');
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -80px 0px' }
  );
  revealEls.forEach((el) => observer.observe(el));

  /* ---------------- Marquee duplication for seamless loop ---------------- */
  const marqueeTrack = document.querySelector('.marquee-track');
  if (marqueeTrack) {
    marqueeTrack.innerHTML += marqueeTrack.innerHTML;
  }

  /* ---------------- FAQ accordion ---------------- */
  document.querySelectorAll('.faq-item').forEach((item) => {
    const question = item.querySelector('.faq-question');
    question.addEventListener('click', () => {
      const wasActive = item.classList.contains('active');
      document.querySelectorAll('.faq-item').forEach((i) => i.classList.remove('active'));
      if (!wasActive) item.classList.add('active');
    });
  });

  /* ---------------- Cursor glow ---------------- */
  const glow = document.querySelector('.cursor-glow');
  if (glow) {
    window.addEventListener('mousemove', (e) => {
      glow.style.left = e.clientX + 'px';
      glow.style.top = e.clientY + 'px';
    });
  }

  /* ---------------- Smooth anchor scroll offset ---------------- */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId.length > 1) {
        const target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          const top = target.getBoundingClientRect().top + window.scrollY - 80;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      }
    });
  });

  /* ---------------- Contact form ---------------- */
  const form = document.getElementById('contact-form');
  if (form) {
    const EMAIL = 'neffer.barragan@iglumarketingdigital.com';
    const WA_NUMBER = '573160171942';

    const buildMessage = () => {
      const v = (id) => (form.elements[id] ? form.elements[id].value.trim() : '');
      return [
        'Hola Iglú, quiero cotizar un proyecto.',
        `Nombre: ${v('nombre')}`,
        `Empresa: ${v('empresa')}`,
        `Cargo: ${v('cargo')}`,
        `Email: ${v('email')}`,
        `Tipo de proyecto: ${v('tipo')}`,
        `Objetivo: ${v('mensaje')}`,
      ].join('\n');
    };

    const waBtn = form.querySelector('.btn-whatsapp');
    if (waBtn) {
      waBtn.addEventListener('click', () => {
        waBtn.href = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(buildMessage())}`;
      });
    }

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = form.querySelector('button[type="submit"]');
      submitBtn.disabled = true;

      const data = new FormData(form);
      data.append('_subject', 'Nuevo lead - Landing Iglú M&T');
      data.append('_template', 'table');
      data.append('_captcha', 'false');

      let sent = false;
      try {
        const res = await fetch(`https://formsubmit.co/ajax/${EMAIL}`, {
          method: 'POST',
          headers: { Accept: 'application/json' },
          body: data,
        });
        sent = res.ok;
      } catch (err) {
        sent = false;
      }

      if (sent) {
        form.style.display = 'none';
        document.querySelector('.form-success').classList.add('show');
      } else {
        submitBtn.disabled = false;
        window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(buildMessage())}`, '_blank', 'noopener');
      }
    });
  }

  /* ---------------- Mini juego: Pong ---------------- */
  const canvas = document.getElementById('pong');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    const W = canvas.width;
    const H = canvas.height;
    const paddleW = 10;
    const paddleH = 60;

    const state = {
      playerY: H / 2 - paddleH / 2,
      aiY: H / 2 - paddleH / 2,
      ballX: W / 2,
      ballY: H / 2,
      ballVX: 3.2,
      ballVY: 2.1,
      playerScore: 0,
      aiScore: 0,
      running: false,
    };

    const scorePlayerEl = document.getElementById('pong-score-player');
    const scoreAiEl = document.getElementById('pong-score-ai');

    const resetBall = (direction) => {
      state.ballX = W / 2;
      state.ballY = H / 2;
      state.ballVX = 3.2 * direction;
      state.ballVY = (Math.random() * 4 - 2) || 2.1;
    };

    const movePlayerTo = (clientY) => {
      const rect = canvas.getBoundingClientRect();
      const scale = H / rect.height;
      const relY = (clientY - rect.top) * scale;
      state.playerY = Math.min(Math.max(relY - paddleH / 2, 0), H - paddleH);
    };

    canvas.addEventListener('mousemove', (e) => movePlayerTo(e.clientY));
    canvas.addEventListener(
      'touchmove',
      (e) => {
        if (e.touches[0]) movePlayerTo(e.touches[0].clientY);
        e.preventDefault();
      },
      { passive: false }
    );

    const draw = () => {
      ctx.fillStyle = '#04021c';
      ctx.fillRect(0, 0, W, H);

      // Middle dashed line
      ctx.strokeStyle = 'rgba(255,255,255,0.15)';
      ctx.setLineDash([6, 8]);
      ctx.beginPath();
      ctx.moveTo(W / 2, 0);
      ctx.lineTo(W / 2, H);
      ctx.stroke();
      ctx.setLineDash([]);

      // Paddles
      ctx.fillStyle = '#00aefc';
      ctx.fillRect(14, state.playerY, paddleW, paddleH);
      ctx.fillStyle = '#fd00bf';
      ctx.fillRect(W - 14 - paddleW, state.aiY, paddleW, paddleH);

      // Ball
      ctx.beginPath();
      ctx.arc(state.ballX, state.ballY, 6, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
    };

    const update = () => {
      state.ballX += state.ballVX;
      state.ballY += state.ballVY;

      if (state.ballY <= 6 || state.ballY >= H - 6) {
        state.ballVY *= -1;
      }

      // Player paddle collision
      if (
        state.ballX - 6 <= 14 + paddleW &&
        state.ballX - 6 > 14 &&
        state.ballY >= state.playerY &&
        state.ballY <= state.playerY + paddleH
      ) {
        state.ballVX = Math.abs(state.ballVX) * 1.04;
        state.ballVY += (state.ballY - (state.playerY + paddleH / 2)) * 0.06;
      }

      // AI paddle collision
      if (
        state.ballX + 6 >= W - 14 - paddleW &&
        state.ballX + 6 < W - 14 &&
        state.ballY >= state.aiY &&
        state.ballY <= state.aiY + paddleH
      ) {
        state.ballVX = -Math.abs(state.ballVX) * 1.04;
        state.ballVY += (state.ballY - (state.aiY + paddleH / 2)) * 0.06;
      }

      // Simple AI tracking with limited speed
      const aiCenter = state.aiY + paddleH / 2;
      const aiSpeed = 2.6;
      if (aiCenter < state.ballY - 10) state.aiY += aiSpeed;
      else if (aiCenter > state.ballY + 10) state.aiY -= aiSpeed;
      state.aiY = Math.min(Math.max(state.aiY, 0), H - paddleH);

      // Scoring
      if (state.ballX < 0) {
        state.aiScore += 1;
        scoreAiEl.textContent = state.aiScore;
        resetBall(1);
      } else if (state.ballX > W) {
        state.playerScore += 1;
        scorePlayerEl.textContent = state.playerScore;
        resetBall(-1);
      }
    };

    const loop = () => {
      if (!state.running) return;
      update();
      draw();
      requestAnimationFrame(loop);
    };

    const startLoop = () => {
      if (state.running) return;
      state.running = true;
      loop();
    };

    const stopLoop = () => {
      state.running = false;
    };

    draw();

    const gameObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) startLoop();
          else stopLoop();
        });
      },
      { threshold: 0.2 }
    );
    gameObserver.observe(canvas);
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('caseModal');
  const modalImg = document.getElementById('caseModalImg');
  if (!modal) return;

  const close = () => {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    modalImg.src = '';
    document.body.style.overflow = '';
  };

  document.querySelectorAll('.cases-grid .case-card img').forEach((img) => {
    img.closest('.case-card').addEventListener('click', () => {
      modalImg.src = img.currentSrc || img.src;
      modalImg.alt = img.alt;
      modal.classList.add('open');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    });
  });

  modal.addEventListener('click', (e) => {
    if (e.target !== modalImg) close();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') close();
  });
});
