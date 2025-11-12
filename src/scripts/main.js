class BikeLanding {
  constructor() {
    this.init();
  }

  init() {
    this.setupMobileMenu();
    this.setupContactForm();
    this.setupSmoothScroll();
    this.setupAnimations();
    this.setupHeaderScroll();
  }

  // Мобільне меню з Figma
  setupMobileMenu() {
    const menuToggler = document.querySelector('.mobile-menu__toggler');
    const menuClose = document.querySelector('.mobile-menu__close');
    const menuPanel = document.querySelector('.mobile-menu__panel');
    const body = document.body;

    if (menuToggler && menuPanel) {
      menuToggler.addEventListener('click', () => {
        menuPanel.classList.add('active');
        body.classList.add('no-scroll');
      });

      if (menuClose) {
        menuClose.addEventListener('click', () => {
          menuPanel.classList.remove('active');
          body.classList.remove('no-scroll');
        });
      }

      // Закрити меню при кліку на посилання
      const menuLinks = menuPanel.querySelectorAll('.mobile-menu__link');
      menuLinks.forEach(link => {
        link.addEventListener('click', () => {
          menuPanel.classList.remove('active');
          body.classList.remove('no-scroll');
        });
      });

      // Закрити меню на ESC
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && menuPanel.classList.contains('active')) {
          menuPanel.classList.remove('active');
          body.classList.remove('no-scroll');
        }
      });
    }
  }

  // Контакт форма з Figma
  setupContactForm() {
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
      contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleFormSubmit(contactForm);
      });

      // Валідація в реальному часі
      this.setupRealTimeValidation(contactForm);
    }
  }

  handleFormSubmit(form) {
    if (this.validateForm(form)) {
      this.showLoadingState(form, true);

      // Симуляція відправки
      setTimeout(() => {
        this.showLoadingState(form, false);
        this.showNotification('Thank you! Your message has been sent successfully.', 'success');
        form.reset();
        this.clearValidationErrors(form);
      }, 2000);
    }
  }

  validateForm(form) {
    let isValid = true;
    const requiredFields = form.querySelectorAll('[required]');

    requiredFields.forEach(field => {
      if (!this.validateField(field)) {
        isValid = false;
      }
    });

    return isValid;
  }

  validateField(field) {
    const value = field.value.trim();
    let isValid = true;

    this.clearFieldError(field);

    if (field.hasAttribute('required') && !value) {
      this.showFieldError(field, 'This field is required');
      isValid = false;
    }

    if (field.type === 'email' && value && !this.isValidEmail(value)) {
      this.showFieldError(field, 'Please enter a valid email address');
      isValid = false;
    }

    if (field.hasAttribute('minlength') && value) {
      const minLength = parseInt(field.getAttribute('minlength'));
      if (value.length < minLength) {
        this.showFieldError(field, `Minimum ${minLength} characters required`);
        isValid = false;
      }
    }

    // Оновлення стану поля
    field.classList.toggle('error', !isValid);

    return isValid;
  }

  setupRealTimeValidation(form) {
    const fields = form.querySelectorAll('input, textarea');

    fields.forEach(field => {
      field.addEventListener('blur', () => {
        this.validateField(field);
      });

      field.addEventListener('input', () => {
        if (field.classList.contains('error')) {
          this.clearFieldError(field);
          field.classList.remove('error');
        }
      });
    });
  }

  showFieldError(field, message) {
    this.clearFieldError(field);

    const errorElement = document.createElement('div');
    errorElement.className = 'contact-form__error show';
    errorElement.textContent = message;

    field.parentNode.appendChild(errorElement);
  }

  clearFieldError(field) {
    const existingError = field.parentNode.querySelector('.contact-form__error');
    if (existingError) {
      existingError.remove();
    }
  }

  clearValidationErrors(form) {
    const fields = form.querySelectorAll('input, textarea');
    fields.forEach(field => {
      field.classList.remove('error');
      this.clearFieldError(field);
    });
  }

  showLoadingState(form, show) {
    const submitButton = form.querySelector('button[type="submit"]');

    if (show) {
      submitButton.disabled = true;
      submitButton.textContent = 'Sending...';
      submitButton.classList.add('loading');
    } else {
      submitButton.disabled = false;
      submitButton.textContent = 'Send Message';
      submitButton.classList.remove('loading');
    }
  }

  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Плавна прокрутка
  setupSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');

        if (href !== '#') {
          e.preventDefault();
          const target = document.querySelector(href);

          if (target) {
            const headerHeight = document.querySelector('.header').offsetHeight;
            const targetPosition = target.offsetTop - headerHeight;

            window.scrollTo({
              top: targetPosition,
              behavior: 'smooth'
            });
          }
        }
      });
    });
  }

  // Анімації при скролі
  setupAnimations() {
    const animatedElements = document.querySelectorAll('.fade-in, .bike-card');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        }
      });
    }, { threshold: 0.1 });

    animatedElements.forEach(el => observer.observe(el));
  }

  // Фіксований хедер при скролі
  setupHeaderScroll() {
    const header = document.querySelector('.header');
    let lastScrollY = window.scrollY;

    window.addEventListener('scroll', () => {
      if (window.scrollY > 100) {
        header.classList.add('header--scrolled');
      } else {
        header.classList.remove('header--scrolled');
      }

      lastScrollY = window.scrollY;
    });
  }

  // Сповіщення
  showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => notification.classList.add('show'), 100);

    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => notification.remove(), 300);
    }, 4000);

    notification.addEventListener('click', () => {
      notification.classList.remove('show');
      setTimeout(() => notification.remove(), 300);
    });
  }
}

// Ініціалізація
document.addEventListener('DOMContentLoaded', () => {
  new BikeLanding();
});
