/* StyleFusion — main.js */

(function () {
  /* ---- Nav toggle ---- */
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks  = document.querySelector('.nav-links');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      const open = navLinks.classList.toggle('open');
      navToggle.classList.toggle('open', open);
      navToggle.setAttribute('aria-expanded', String(open));
    });
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        navToggle.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---- Active nav link ---- */
  const currentFile = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    const href = (link.getAttribute('href') || '').split('/').pop();
    if (href === currentFile || (currentFile === '' && href === 'index.html')) {
      link.setAttribute('aria-current', 'page');
      link.classList.add('active');
    }
  });

  /* ---- Scroll reveal ---- */
  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length && 'IntersectionObserver' in window) {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
      });
    }, { threshold: 0.13, rootMargin: '0px 0px -32px 0px' });
    revealEls.forEach(el => obs.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('visible'));
  }

  /* ---- Marquee duplicate ---- */
  const strip = document.querySelector('.strip-inner');
  if (strip) strip.innerHTML += strip.innerHTML;

  /* ---- Contact form → API submit ---- */
  const form = document.getElementById('contact-form');
  if (form) {
    const submitButton = form.querySelector('button[type="submit"]');
    const statusEl = document.getElementById('contact-status');

    form.addEventListener('submit', async e => {
      e.preventDefault();

      const d = new FormData(form);
      const name    = String(d.get('name')    || '').trim();
      const email   = String(d.get('email')   || '').trim();
      const inquiry = String(d.get('inquiry') || 'General Inquiry');
      const city    = String(d.get('city')    || '').trim();
      const msg     = String(d.get('message') || '').trim();

      if (!name || !email || !msg) {
        if (statusEl) {
          statusEl.textContent = 'Please fill in name, email, and message.';
          statusEl.style.color = '#803030';
        }
        return;
      }

      if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = 'Sending...';
      }
      if (statusEl) {
        statusEl.textContent = 'Sending your message...';
        statusEl.style.color = 'rgba(26,42,64,.62)';
      }

      try {
        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, inquiry, city, message: msg }),
        });

        const result = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(result.error || 'Failed to send your message.');
        }

        form.reset();
        if (statusEl) {
          statusEl.textContent = 'Message sent successfully. We will get back to you soon.';
          statusEl.style.color = '#1a2a40';
        }
      } catch (error) {
        if (statusEl) {
          statusEl.textContent = error.message || 'Unable to send. Please try again.';
          statusEl.style.color = '#803030';
        }
      } finally {
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.textContent = 'Send Message';
        }
      }
    });
  }
})();
