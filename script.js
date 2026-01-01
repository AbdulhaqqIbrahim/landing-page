(function() {
  'use strict';

  function scrollToSection() {
    const select = document.getElementById('audience');
    const value = select.value;
    if (value) {
      const element = document.getElementById(value);
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  // keep the original inline handler working
  window.scrollToSection = scrollToSection;

  const LS_KEYS = { NAME: 'cv_name', THEME: 'cv_theme' };

  function safeGetLocalStorage(key) {
    try { return localStorage.getItem(key); } catch (e) { console.warn('localStorage unavailable', e); return null; }
  }
  function safeSetLocalStorage(key, value) {
    try { localStorage.setItem(key, value); } catch (e) { console.warn('localStorage unavailable', e); }
  }

  function showGreeting(name) {
    const greetingEl = document.getElementById('greeting');
    if (!greetingEl) return;
    if (name) {
      greetingEl.textContent = `Welcome${name ? ', ' + name : ''}!`;
    } else {
      greetingEl.textContent = '';
    }
  }

  function applyTheme(theme) {
    const body = document.body;
    if (theme === 'dark') {
      body.classList.add('dark-theme');
      const toggle = document.getElementById('themeToggle'); if (toggle) toggle.checked = true;
    } else {
      body.classList.remove('dark-theme');
      const toggle = document.getElementById('themeToggle'); if (toggle) toggle.checked = false;
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    const nameInput = document.getElementById('nameInput');
    const saveBtn = document.getElementById('saveNameBtn');
    const themeToggle = document.getElementById('themeToggle');

    // Load stored values
    const savedName = safeGetLocalStorage(LS_KEYS.NAME);
    if (savedName) {
      if (nameInput) nameInput.value = savedName;
      showGreeting(savedName);
    }

    const savedTheme = safeGetLocalStorage(LS_KEYS.THEME);
    applyTheme(savedTheme);

    // event handlers
    saveBtn && saveBtn.addEventListener('click', () => {
      const val = nameInput ? nameInput.value.trim() : '';
      if (val.length > 0) {
        safeSetLocalStorage(LS_KEYS.NAME, val);
        showGreeting(val);
      } else {
        safeSetLocalStorage(LS_KEYS.NAME, '');
        showGreeting('');
      }
    });

    themeToggle && themeToggle.addEventListener('change', (e) => {
      const theme = e.target.checked ? 'dark' : 'light';
      applyTheme(theme);
      safeSetLocalStorage(LS_KEYS.THEME, theme);
    });

    // Make pressing Enter in name input save the name
    nameInput && nameInput.addEventListener('keyup', (e) => {
      if (e.key === 'Enter') {
        saveBtn && saveBtn.click();
      }
    });

    // Make .cta-gold buttons focus/scroll to the main CTA and add a brief highlight
    const goldCTAs = document.querySelectorAll('.cta-gold');
    const mainCTA = document.getElementById('ctaMain');
    goldCTAs.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        if (mainCTA) {
          mainCTA.scrollIntoView({ behavior: 'smooth', block: 'center' });
          // focus for keyboard users
          try { mainCTA.focus({ preventScroll: true }); } catch (err) { mainCTA.focus(); }
          mainCTA.classList.add('pulse');
          setTimeout(() => mainCTA.classList.remove('pulse'), 1000);
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      });
    });

    // Main CTA should scroll to contact form and focus it
    const contactSection = document.getElementById('contact');
    const contactName = document.getElementById('contactName');
    const contactForm = document.getElementById('contactForm');
    const contactThanks = document.getElementById('contactThanks');

    if (mainCTA) {
      mainCTA.addEventListener('click', (e) => {
        e.preventDefault();
        // Prefer scrolling to Calendly widget if present, otherwise fallback to contact section
        const calendly = document.getElementById('calendly-inline');
        if (calendly) {
          calendly.scrollIntoView({ behavior: 'smooth', block: 'center' });
          try { calendly.setAttribute('tabindex', '-1'); calendly.focus({ preventScroll: true }); } catch (err) { calendly.focus(); }
          mainCTA.classList.add('pulse');
          setTimeout(() => mainCTA.classList.remove('pulse'), 1000);
        } else if (contactSection) {
          contactSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
          try { contactName && contactName.focus({ preventScroll: true }); } catch (err) { contactName && contactName.focus(); }
          mainCTA.classList.add('pulse');
          setTimeout(() => mainCTA.classList.remove('pulse'), 1000);
        } else {
          // fallback to mailto if no contact section
          window.location.href = 'mailto:hello@clearview.com?subject=Strategy%20Call';
        }
      });
    }

    // Handle contact form submission (simulated)
    contactForm && contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = (document.getElementById('contactName') || {}).value || '';
      const email = (document.getElementById('contactEmail') || {}).value || '';
      if (!email.trim()) {
        contactThanks.textContent = 'Please provide an email address so we can reach you.';
        return;
      }

      // by default, just show a simulated thanks message and save name
      contactThanks.textContent = `Thanks ${name ? name + ', ' : ''}we received your request and will reach out soon!`;
      safeSetLocalStorage(LS_KEYS.NAME, name.trim());
      contactForm.reset();
    });

    // Send via user's email client (mailto)
    const mailtoBtn = document.getElementById('mailtoBtn');
    mailtoBtn && mailtoBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const name = (document.getElementById('contactName') || {}).value || '';
      const email = (document.getElementById('contactEmail') || {}).value || '';
      const message = (document.getElementById('contactMessage') || {}).value || '';
      if (!email.trim()) { contactThanks.textContent = 'Please include an email to prefill your message.'; return; }
      const subject = encodeURIComponent('Strategy Call Request');
      let body = '';
      if (name) body += `Name: ${name}\n`;
      body += `Email: ${email}\n\n`;
      if (message) body += `Message:\n${message}\n`;
      const mailto = `mailto:hello@clearview.com?subject=${subject}&body=${encodeURIComponent(body)}`;
      // open mail client
      window.location.href = mailto;
    });



  });
})();