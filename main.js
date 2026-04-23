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

  /* ---- Contact form → mailto submit ---- */
  const form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();

      const d = new FormData(form);
      const name = String(d.get('name') || '').trim();
      const email = String(d.get('email') || '').trim();
      const inquiry = String(d.get('inquiry') || 'General Inquiry');
      const city = String(d.get('city') || '').trim();
      const msg = String(d.get('message') || '').trim();

      if (!name || !email || !msg) {
        alert('Please fill in name, email, and message.');
        return;
      }

      const subject = `StyleFusion Inquiry - ${name}`;
      const body = `Name: ${name}\nEmail: ${email}\nCity: ${city}\nInquiry: ${inquiry}\n\nMessage:\n${msg}`;
      const mailto = `mailto:nirmalyash721@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

      window.location.href = mailto;
    });
  }
})();
