/**
 * Dev Verma Portfolio - Main JavaScript
 * Interactions, Theme Toggling, Smooth Navigation, & Lightbox
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initNavigation();
  initExperienceAccordion();
  initCopyEmail();
  initContactForm();
  initProjectLightbox();
  initScrollAnimations();
});

/* ==========================================================================
   1. Theme Management (Light / Dark Mode)
   ========================================================================== */
function initTheme() {
  const toggleBtn = document.getElementById('theme-toggle');
  if (!toggleBtn) return;

  const currentTheme = localStorage.getItem('theme') || 
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

  setTheme(currentTheme);

  toggleBtn.addEventListener('click', () => {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const nextTheme = isDark ? 'light' : 'dark';
    setTheme(nextTheme);
  });
}

function setTheme(theme) {
  const toggleBtn = document.getElementById('theme-toggle');
  if (theme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    localStorage.setItem('theme', 'dark');
    if (toggleBtn) {
      toggleBtn.innerHTML = `
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="12" r="5"></circle>
          <line x1="12" y1="1" x2="12" y2="3"></line>
          <line x1="12" y1="21" x2="12" y2="23"></line>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
          <line x1="1" y1="12" x2="3" y2="12"></line>
          <line x1="21" y1="12" x2="23" y2="12"></line>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
        </svg>
      `;
      toggleBtn.setAttribute('title', 'Switch to light mode');
    }
  } else {
    document.documentElement.removeAttribute('data-theme');
    localStorage.setItem('theme', 'light');
    if (toggleBtn) {
      toggleBtn.innerHTML = `
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
        </svg>
      `;
      toggleBtn.setAttribute('title', 'Switch to dark mode');
    }
  }
}

/* ==========================================================================
   2. Smooth Navigation & Active Link Tracking
   ========================================================================== */
function initNavigation() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
  const mobileBtn = document.getElementById('mobile-menu-btn');
  const mobileDrawer = document.getElementById('mobile-drawer');

  // Mobile Drawer Toggle
  if (mobileBtn && mobileDrawer) {
    const toggleMobileMenu = (forceClose = false) => {
      const isOpen = forceClose ? false : !mobileDrawer.classList.contains('open');
      mobileDrawer.classList.toggle('open', isOpen);
      mobileBtn.classList.toggle('open', isOpen);
      mobileBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      mobileDrawer.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
      document.body.style.overflow = isOpen ? 'hidden' : '';
    };

    mobileBtn.addEventListener('click', () => toggleMobileMenu());

    // Close when clicking any nav link
    document.querySelectorAll('.mobile-nav-link, .mobile-drawer-cta').forEach(link => {
      link.addEventListener('click', () => toggleMobileMenu(true));
    });

    // Close on outside click
    mobileDrawer.addEventListener('click', (e) => {
      if (e.target === mobileDrawer) {
        toggleMobileMenu(true);
      }
    });

    // Close on ESC
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileDrawer.classList.contains('open')) {
        toggleMobileMenu(true);
      }
    });
  }

  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -70% 0px',
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => observer.observe(section));
}

/* ==========================================================================
   3. Experience Accordion
   ========================================================================== */
function initExperienceAccordion() {
  const expCards = document.querySelectorAll('.experience-card');
  expCards.forEach(card => {
    card.addEventListener('click', () => {
      const isActive = card.classList.contains('active');
      // Optional: close other cards if single open accordion desired
      card.classList.toggle('active', !isActive);
    });
  });
}

/* ==========================================================================
   4. Copy Email & Toast Notifications
   ========================================================================== */
function initCopyEmail() {
  const emailTriggers = document.querySelectorAll('[data-copy-email]');
  emailTriggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const email = trigger.getAttribute('data-copy-email') || 'saurabhkm321@gmail.com';
      navigator.clipboard.writeText(email).then(() => {
        showToast(`Copied ${email} to clipboard!`);
      }).catch(() => {
        showToast('Email: saurabhkm321@gmail.com');
      });
    });
  });
}

function showToast(message) {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3200);
}

/* ==========================================================================
   5. Interactive Contact Form
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('.form-submit-btn');
    const nameInput = document.getElementById('form-name');
    const emailInput = document.getElementById('form-email');
    const messageInput = document.getElementById('form-message');

    if (!nameInput.value.trim() || !emailInput.value.trim() || !messageInput.value.trim()) {
      showToast('Please fill in all fields.');
      return;
    }

    const originalText = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" fill="none" class="spin">
        <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
        <path d="M12 2a10 10 0 0 1 10 10" stroke-linecap="round"></path>
      </svg>
      Sending...
    `;

    setTimeout(() => {
      btn.disabled = false;
      btn.innerHTML = originalText;
      form.reset();
      showToast('Message sent! I will get back to you soon.');
    }, 1200);
  });
}

/* ==========================================================================
   6. Project Lightbox Modal
   ========================================================================== */
function initProjectLightbox() {
  const modal = document.getElementById('project-modal');
  const modalImg = document.getElementById('modal-img');
  const modalTitle = document.getElementById('modal-title');
  const closeBtn = document.getElementById('modal-close');

  if (!modal || !modalImg) return;

  const projectTriggers = document.querySelectorAll('[data-lightbox-src]');
  projectTriggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const src = trigger.getAttribute('data-lightbox-src');
      const title = trigger.getAttribute('data-lightbox-title') || 'Project Preview';
      modalImg.src = src;
      if (modalTitle) modalTitle.textContent = title;
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  const closeModal = () => {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  };

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
}

/* ==========================================================================
   7. Scroll Animations (Subtle Fade Up)
   ========================================================================== */
function initScrollAnimations() {
  const elements = document.querySelectorAll('.project-card, .achievement-card, .experience-card, .skills-table');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  elements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(16px)';
    el.style.transition = 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
    observer.observe(el);
  });
}
