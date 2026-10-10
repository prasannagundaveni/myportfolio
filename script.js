/**
 * ============================================================================
 * GUNDAVENI PRASANNA - PROFESSIONAL PORTFOLIO JAVASCRIPT
 * Features:
 *  - Theme switching (Light Alice Green / Dark Mode) with localStorage persistence
 *  - Responsive mobile navigation drawer with ARIA attributes
 *  - Scroll-triggered reveal animations via Intersection Observer
 *  - Active section indicator in sticky navigation
 *  - Accessible modal dialog for project details
 *  - Client-side contact form validation with WhatsApp / Mailto dispatch flows
 *  - Dynamic copyright year
 * ============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // --------------------------------------------------------------------------
  // 1. Theme Switcher (Alice Green Light Theme vs. Deep Forest Dark Theme)
  // --------------------------------------------------------------------------
  const themeToggleBtn = document.getElementById('theme-toggle');
  const rootElement = document.documentElement;

  // Retrieve stored theme preference or default to 'light' (Alice Green)
  const savedTheme = localStorage.getItem('gp_portfolio_theme');
  const initialTheme = savedTheme ? savedTheme : 'light';

  // Apply initial theme
  applyTheme(initialTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = rootElement.getAttribute('data-theme') || 'light';
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';
      applyTheme(newTheme);
      localStorage.setItem('gp_portfolio_theme', newTheme);
    });
  }

  function applyTheme(theme) {
    rootElement.setAttribute('data-theme', theme);
    if (themeToggleBtn) {
      const isDark = theme === 'dark';
      themeToggleBtn.setAttribute(
        'aria-label',
        isDark ? 'Switch to light mode (Alice Green)' : 'Switch to dark mode'
      );
      themeToggleBtn.setAttribute(
        'title',
        isDark ? 'Switch to light mode' : 'Switch to dark mode'
      );
    }
  }

  // --------------------------------------------------------------------------
  // 2. Sticky Header Shadow on Scroll
  // --------------------------------------------------------------------------
  const siteHeader = document.getElementById('header');
  
  const handleHeaderScroll = () => {
    if (!siteHeader) return;
    if (window.scrollY > 20) {
      siteHeader.classList.add('scrolled');
    } else {
      siteHeader.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleHeaderScroll, { passive: true });
  handleHeaderScroll();

  // --------------------------------------------------------------------------
  // 3. Mobile Navigation Menu
  // --------------------------------------------------------------------------
  const hamburgerBtn = document.getElementById('hamburger');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (hamburgerBtn && navMenu) {
    hamburgerBtn.addEventListener('click', () => {
      const isExpanded = hamburgerBtn.getAttribute('aria-expanded') === 'true';
      toggleMobileMenu(!isExpanded);
    });

    // Close menu when clicking any nav link
    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        toggleMobileMenu(false);
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (event) => {
      const isClickInsideMenu = navMenu.contains(event.target);
      const isClickOnHamburger = hamburgerBtn.contains(event.target);
      if (!isClickInsideMenu && !isClickOnHamburger && navMenu.classList.contains('is-active')) {
        toggleMobileMenu(false);
      }
    });

    // Close menu on Escape key press
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && navMenu.classList.contains('is-active')) {
        toggleMobileMenu(false);
        hamburgerBtn.focus();
      }
    });
  }

  function toggleMobileMenu(open) {
    if (!hamburgerBtn || !navMenu) return;
    if (open) {
      hamburgerBtn.classList.add('is-active');
      hamburgerBtn.setAttribute('aria-expanded', 'true');
      navMenu.classList.add('is-active');
    } else {
      hamburgerBtn.classList.remove('is-active');
      hamburgerBtn.setAttribute('aria-expanded', 'false');
      navMenu.classList.remove('is-active');
    }
  }

  // --------------------------------------------------------------------------
  // 4. Scroll Reveal Animations (Intersection Observer)
  // --------------------------------------------------------------------------
  const revealElements = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        root: null,
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    revealElements.forEach((el) => revealObserver.observe(el));
  } else {
    // Fallback: Make all elements visible immediately if IntersectionObserver is unsupported
    revealElements.forEach((el) => el.classList.add('is-revealed'));
  }

  // --------------------------------------------------------------------------
  // 5. Active Navigation Link Highlighting on Scroll
  // --------------------------------------------------------------------------
  const sections = document.querySelectorAll('section[id]');

  if ('IntersectionObserver' in window && sections.length > 0) {
    const navObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const currentId = entry.target.getAttribute('id');
            updateActiveNavLink(currentId);
          }
        });
      },
      {
        root: null,
        threshold: 0.35,
      }
    );

    sections.forEach((section) => navObserver.observe(section));
  }

  function updateActiveNavLink(sectionId) {
    navLinks.forEach((link) => {
      const href = link.getAttribute('href');
      if (href === `#${sectionId}`) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  // --------------------------------------------------------------------------
  // 6. Project Overview Modal Dialog
  // --------------------------------------------------------------------------
  const projectDetailsBtn = document.getElementById('project-details-btn');
  const projectModal = document.getElementById('project-modal');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalDismissBtn = document.getElementById('modal-dismiss-btn');
  const modalContactLink = document.getElementById('modal-contact-link');

  function openModal() {
    if (!projectModal) return;
    projectModal.classList.add('is-active');
    projectModal.setAttribute('aria-hidden', 'false');
    if (projectDetailsBtn) projectDetailsBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
    if (modalCloseBtn) modalCloseBtn.focus();
  }

  function closeModal() {
    if (!projectModal) return;
    projectModal.classList.remove('is-active');
    projectModal.setAttribute('aria-hidden', 'true');
    if (projectDetailsBtn) {
      projectDetailsBtn.setAttribute('aria-expanded', 'false');
      projectDetailsBtn.focus();
    }
    document.body.style.overflow = '';
  }

  if (projectDetailsBtn && projectModal) {
    projectDetailsBtn.addEventListener('click', openModal);
  }

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeModal);
  }

  if (modalDismissBtn) {
    modalDismissBtn.addEventListener('click', closeModal);
  }

  if (modalContactLink) {
    modalContactLink.addEventListener('click', closeModal);
  }

  // Close modal when clicking on the darkened backdrop
  if (projectModal) {
    projectModal.addEventListener('click', (e) => {
      if (e.target === projectModal) {
        closeModal();
      }
    });
  }

  // Close modal when pressing Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && projectModal && projectModal.classList.contains('is-active')) {
      closeModal();
    }
  });

  // --------------------------------------------------------------------------
  // 7. Dynamic Copyright Year
  // --------------------------------------------------------------------------
  const currentYearSpan = document.getElementById('current-year');
  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
  }

  // --------------------------------------------------------------------------
  // 8. Contact Form Validation & Transmission
  // --------------------------------------------------------------------------
  const contactForm = document.getElementById('contact-form');
  const nameInput = document.getElementById('contact-name');
  const emailInput = document.getElementById('contact-email');
  const subjectInput = document.getElementById('contact-subject');
  const messageInput = document.getElementById('contact-message');
  const formStatus = document.getElementById('form-status');
  const sendEmailAltBtn = document.getElementById('send-email-alt-btn');

  // Input Error Feedback Elements
  const nameError = document.getElementById('name-error');
  const emailError = document.getElementById('email-error');
  const subjectError = document.getElementById('subject-error');
  const messageError = document.getElementById('message-error');

  // Email format verification regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Real-time validation listeners on input blur
  if (nameInput) {
    nameInput.addEventListener('blur', () => validateField(nameInput, nameError, nameInput.value.trim().length > 0));
    nameInput.addEventListener('input', () => clearFieldStatus(nameInput, nameError));
  }

  if (emailInput) {
    emailInput.addEventListener('blur', () => validateField(emailInput, emailError, emailRegex.test(emailInput.value.trim())));
    emailInput.addEventListener('input', () => clearFieldStatus(emailInput, emailError));
  }

  if (subjectInput) {
    subjectInput.addEventListener('blur', () => validateField(subjectInput, subjectError, subjectInput.value.trim().length > 0));
    subjectInput.addEventListener('input', () => clearFieldStatus(subjectInput, subjectError));
  }

  if (messageInput) {
    messageInput.addEventListener('blur', () => validateField(messageInput, messageError, messageInput.value.trim().length > 0));
    messageInput.addEventListener('input', () => clearFieldStatus(messageInput, messageError));
  }

  function validateField(inputElement, errorElement, isValid) {
    if (!inputElement || !errorElement) return isValid;
    if (!isValid) {
      inputElement.classList.add('is-invalid');
      inputElement.setAttribute('aria-invalid', 'true');
      errorElement.classList.add('is-visible');
    } else {
      inputElement.classList.remove('is-invalid');
      inputElement.removeAttribute('aria-invalid');
      errorElement.classList.remove('is-visible');
    }
    return isValid;
  }

  function clearFieldStatus(inputElement, errorElement) {
    if (!inputElement || !errorElement) return;
    if (inputElement.classList.contains('is-invalid')) {
      inputElement.classList.remove('is-invalid');
      inputElement.removeAttribute('aria-invalid');
      errorElement.classList.remove('is-visible');
    }
  }

  function validateAllFormFields() {
    const isNameValid = validateField(nameInput, nameError, nameInput.value.trim().length > 0);
    const isEmailValid = validateField(emailInput, emailError, emailRegex.test(emailInput.value.trim()));
    const isSubjectValid = validateField(subjectInput, subjectError, subjectInput.value.trim().length > 0);
    const isMessageValid = validateField(messageInput, messageError, messageInput.value.trim().length > 0);

    return isNameValid && isEmailValid && isSubjectValid && isMessageValid;
  }

  function showStatusMessage(message, type) {
    if (!formStatus) return;
    formStatus.textContent = message;
    formStatus.className = 'form-status-banner';
    if (type === 'success') {
      formStatus.classList.add('is-success');
    } else if (type === 'error') {
      formStatus.classList.add('is-error');
    }
  }

  // Primary Submission: Send via WhatsApp Click-to-Chat Flow
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      if (!validateAllFormFields()) {
        showStatusMessage('Please correct the highlighted fields before sending.', 'error');
        return;
      }

      const name = nameInput.value.trim();
      const email = emailInput.value.trim();
      const subject = subjectInput.value.trim();
      const message = messageInput.value.trim();

      // Target WhatsApp phone number: +91 7981169573
      const phoneNumber = '917981169573';

      // Compose clean, formatted message for WhatsApp
      const whatsappText = 
        `*New Inquiry from Portfolio Website*\n\n` +
        `*Name:* ${name}\n` +
        `*Email:* ${email}\n` +
        `*Subject:* ${subject}\n\n` +
        `*Message:*\n${message}`;

      const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(whatsappText)}`;

      // Open WhatsApp in a new tab for user review & delivery
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');

      // Display confirmed feedback
      showStatusMessage(
        'WhatsApp conversation initiated! Please confirm and send the prepared message in your WhatsApp window.',
        'success'
      );

      // Reset form fields
      contactForm.reset();
    });
  }

  // Secondary Option: Compose in Native Email Client (mailto:)
  if (sendEmailAltBtn) {
    sendEmailAltBtn.addEventListener('click', () => {
      if (!validateAllFormFields()) {
        showStatusMessage('Please fill in all fields before composing your email.', 'error');
        return;
      }

      const name = nameInput.value.trim();
      const email = emailInput.value.trim();
      const subject = subjectInput.value.trim();
      const message = messageInput.value.trim();

      const targetEmail = 'prasanna@gmail.com';
      const emailSubject = `[Portfolio Inquiry] ${subject}`;
      const emailBody = `Sender Name: ${name}\nSender Email: ${email}\n\nMessage:\n${message}`;

      const mailtoUrl = `mailto:${targetEmail}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;

      window.location.href = mailtoUrl;

      showStatusMessage(
        'Default email client opened with your prepared inquiry for prasanna@gmail.com.',
        'success'
      );
    });
  }

});
