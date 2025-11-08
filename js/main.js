document.addEventListener('DOMContentLoaded', () => {
  // Modern Nav toggle for hamburger menu
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const isActive = navToggle.classList.toggle('active');
      navMenu.classList.toggle('active');
      navToggle.setAttribute('aria-expanded', String(isActive));
      
      // Prevent body scroll when menu is open on mobile
      if (isActive) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    });
    
    // Close menu when clicking a link
    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });
  }

  // Smooth scroll for internal links
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if (href && href.length > 1) {
        e.preventDefault();
        const el = document.querySelector(href);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // Reveal on scroll
  const observer = new IntersectionObserver((items) => {
    items.forEach(item => {
      if (item.isIntersecting) {
        item.target.classList.add('visible');
        observer.unobserve(item.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.appear, .section').forEach(el => observer.observe(el));
  // also reveal hero title
  const heroReveal = document.querySelector('.hero-title .reveal');
  if (heroReveal) observer.observe(heroReveal);

  // Simple typing-like reveal for headline (staggered letter animation)
  const revealText = (el) => {
    const text = el.textContent.trim();
    el.textContent = '';
    const frag = document.createDocumentFragment();
    text.split('').forEach((ch, i) => {
      const span = document.createElement('span');
      span.textContent = ch;
      span.style.display = 'inline-block';
      span.style.opacity = '0';
      span.style.transform = 'translateY(6px)';
      span.style.transition = `opacity .36s ease ${(i * 25)}ms, transform .36s ease ${(i * 25)}ms`;
      frag.appendChild(span);
    });
    el.appendChild(frag);
    // trigger
    requestAnimationFrame(() => {
      el.querySelectorAll('span').forEach(s => {
        s.style.opacity = '1';
        s.style.transform = 'none';
      });
      el.classList.add('visible');
    });
  };
  if (heroReveal) revealText(heroReveal);

  // Contact form submission -> /send-email
  const form = document.getElementById('contactForm');
  const msg = document.getElementById('formMsg');
  const phoneEl = document.getElementById('phone');

  if (phoneEl) phoneEl.addEventListener('input', e => { e.target.value = e.target.value.replace(/\D/g,'').slice(0,10); });

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!msg) return;
      msg.textContent = '';
      const name = form.name.value.trim();
      const email = form.email.value.trim();
      const phone = form.phone.value.trim();
      const message = form.message.value.trim();

      if (!name || !email || !phone || phone.length !== 10 || !message) {
        msg.style.color = '#d9534f';
        msg.textContent = 'Please complete all fields and enter a 10-digit phone number.';
        return;
      }
      if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,6}$/.test(email)) {
        msg.style.color = '#d9534f';
        msg.textContent = 'Please enter a valid email address.';
        return;
      }

      const submitBtn = form.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.style.opacity = '0.6';

      try {
        const res = await fetch('/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, phone, message })
        });
        const data = await res.json().catch(() => ({}));
        if (res.ok && data.ok) {
          msg.style.color = '#0bb06b';
          msg.textContent = 'Thank you — we received your message.';
          form.reset();
        } else {
          msg.style.color = '#d9534f';
          msg.textContent = data?.error || 'Unable to send message. Try again later.';
        }
      } catch (err) {
        console.error('contact send error', err);
        msg.style.color = '#d9534f';
        msg.textContent = 'Unable to send message. Check your connection.';
      } finally {
        submitBtn.disabled = false;
        submitBtn.style.opacity = '';
      }
    });
  }

  // Hero reveal: intersection-triggered, left-to-right headline then subtitle (staggered)
  try {
    const hero = document.querySelector('.hero');
    if (hero) {
      const headline = hero.querySelector('.hero-headline.reveal-text');
      const subtitle = hero.querySelector('.hero-sub.reveal-text');

      const revealSequence = () => {
        if (headline) {
          // force reflow so the transition always runs
          void headline.offsetWidth;
          headline.classList.add('visible');
        }
        if (subtitle) {
          // subtle stagger for polish
          setTimeout(() => {
            void subtitle.offsetWidth;
            subtitle.classList.add('visible');
          }, 220);
        }
      };

      const heroObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            revealSequence();
            obs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.18 });

      heroObserver.observe(hero);
    }
  } catch (e) {
    console.error('Hero reveal init error', e);
  }

  // existing handlers below...

  // Pricing card selection
  const pricingCards = document.querySelectorAll('.pricing-card');
  pricingCards.forEach(card => {
    card.addEventListener('click', () => {
      // Remove selected class from all cards
      pricingCards.forEach(c => c.classList.remove('selected'));
      // Add selected class to clicked card
      card.classList.add('selected');
    });
  });
});