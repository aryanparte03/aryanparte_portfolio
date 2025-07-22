document.addEventListener('DOMContentLoaded', function () {
  // === 1. MOBILE NAVIGATION TOGGLE ===
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navMenu.classList.toggle('active');
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
      });
    });
  }

  // === 2. SMOOTH SCROLLING ===
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const hrefTarget = this.getAttribute('href');
      if (hrefTarget.length > 1 && !this.hasAttribute('data-no-scroll')) {
        e.preventDefault();
        const target = document.querySelector(hrefTarget);
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }
    });
  });

  // === 3. RIPPLE BUTTON EFFECT ===
  document.querySelectorAll('.ripple-btn').forEach(rippleBtn => {
    rippleBtn.addEventListener('click', function (e) {
      e.preventDefault();

      const oldRipple = rippleBtn.querySelector('.ripple-effect');
      if (oldRipple) oldRipple.remove();

      const rect = rippleBtn.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height) * 2;
      const ripple = document.createElement('span');
      ripple.classList.add('ripple-effect');
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
      ripple.style.top = `${e.clientY - rect.top - size / 2}px`;

      rippleBtn.appendChild(ripple);

      requestAnimationFrame(() => ripple.classList.add('active'));

      ripple.addEventListener('transitionend', () => ripple.remove());

      setTimeout(() => {
        window.location = rippleBtn.href;
      }, 650);
    });
  });

  // === 4. CONTACT FORM SUBMIT HANDLING ===
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const formData = new FormData(contactForm);
      const name = formData.get('name');
      const email = formData.get('email');
      const message = formData.get('message');

      if (!name || !email || !message) {
        showNotification('Please fill in all fields', 'error');
        return;
      }

      if (!isValidEmail(email)) {
        showNotification('Please enter a valid email address', 'error');
        return;
      }

      // send it using fetch() to an API endpoint
      fetch('/contact', {
        method: 'POST',
        body: formData
      }).then(res => {
        if (res.ok) {
          showNotification("Thank you for your message!", 'success');
          contactForm.reset(); // ✅ reset only *after* message is submitted
        } else {
          showNotification("Something went wrong.", 'error');
        }
      });
    });
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function showNotification(message, type = 'info') {
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;

    notification.style.cssText = `
      position: fixed;
      top: 100px;
      right: 20px;
      background: ${type === 'success' ? '#4ecdc4' : type === 'error' ? '#ff6b6b' : '#667eea'};
      color: white;
      padding: 1rem 2rem;
      border-radius: 12px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
      z-index: 1001;
      transform: translateX(400px);
      transition: transform 0.3s ease;
      max-width: 300px;
      font-weight: 500;
    `;

    document.body.appendChild(notification);

    setTimeout(() => { notification.style.transform = 'translateX(0)'; }, 100);
    setTimeout(() => {
      notification.style.transform = 'translateX(400px)';
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }

  // === 5. INTERSECTION OBSERVER ANIMATIONS ===
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);

  const animatedElements = document.querySelectorAll('.card, .skill-item, .hero-content');
  animatedElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });

  // === 6. HEADER HIDE/SHOW ON SCROLL ===
  let lastScrollTop = 0;
  const header = document.querySelector('.header');

  window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    if (scrollTop > lastScrollTop && scrollTop > 100) {
      header.style.transform = 'translateY(-100%)';
    } else {
      header.style.transform = 'translateY(0)';
    }
    lastScrollTop = scrollTop;
  });

  // === 7. LOADER FADE ON LOAD ===
  window.addEventListener('load', () => {
    const loader = document.getElementById('loader-overlay');
    if (loader) {
      loader.style.opacity = '0';
      loader.style.transition = 'opacity 0.5s ease';
      setTimeout(() => { loader.style.display = 'none'; }, 600);
    }
  });

  // === 8. RED CLICK + NAVIGATE EFFECT ===
  function redClickNavigate(selector) {
    document.querySelectorAll(selector).forEach(btn => {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        btn.classList.add('clicked');
        setTimeout(() => {
          window.location = btn.href;
        }, 160);
      });
    });
  }

  redClickNavigate('.get-in-touch-btn');
  redClickNavigate('.learn-more-btn');
  redClickNavigate('.start-convo-btn');
  redClickNavigate('.lets-chat-btn');
  redClickNavigate('.say-hi-btn');

  // === 9. FLOATING ICON INTERACTION (INDEX PAGE ONLY) ===
  const floatIcons = document.querySelectorAll('.float-icon');
  if (floatIcons.length) {
    // 📌 Desktop: magnetic hover effect
    if (window.innerWidth > 700) {
      window.addEventListener('mousemove', e => {
        floatIcons.forEach(icon => {
          const rect = icon.getBoundingClientRect();
          const cx = rect.left + rect.width / 2;
          const cy = rect.top + rect.height / 2;
          const dx = e.clientX - cx;
          const dy = e.clientY - cy;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 120) {
            icon.style.transform = `translate(${dx * 0.14}px, ${dy * 0.14}px) scale(1.15)`;
            icon.classList.add('active');
          } else {
            icon.style.transform = '';
            icon.classList.remove('active');
          }
        });
      });

      window.addEventListener('mouseout', () => {
        floatIcons.forEach(icon => {
          icon.style.transform = '';
          icon.classList.remove('active');
        });
      });
    }

    // 📱 Mobile: tap pop effect
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
      floatIcons.forEach(icon => {
        icon.addEventListener('pointerdown', () => {
          icon.classList.add('active');
          setTimeout(() => {
            icon.classList.remove('active');
          }, 350);
        });
      });
    }
  }
});
