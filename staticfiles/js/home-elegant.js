/**
 * ELEGANT HOME PAGE INTERACTIONS
 * Enhanced animations, smooth scrolling, and interactive elements
 */

document.addEventListener('DOMContentLoaded', function() {
  
  // ===== Smooth Scroll for Anchor Links =====
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        const headerOffset = 80;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // ===== Counter Animation =====
  const animateCounter = (element, target, duration = 2000) => {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        element.textContent = target;
        clearInterval(timer);
      } else {
        element.textContent = Math.ceil(current);
      }
    }, 16);
  };

  // ===== Intersection Observer for Animations =====
  const observerOptions = {
    threshold: 0.2,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Add visible class for fade-in animations
        entry.target.classList.add('visible');
        
        // Animate counters
        const counter = entry.target.querySelector('[data-count]');
        if (counter && !counter.classList.contains('animated')) {
          const target = parseInt(counter.getAttribute('data-count'));
          animateCounter(counter, target);
          counter.classList.add('animated');
        }
        
        // Stop observing after animation
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe all animated elements
  document.querySelectorAll('.animate-fade-in-up, .hero-stats, .benefit-card, .category-card-modern, .course-card-modern').forEach(el => {
    observer.observe(el);
  });

  // ===== Navbar Scroll Effect =====
  let lastScroll = 0;
  const navbar = document.querySelector('.navbar');
  
  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    // Add shadow on scroll
    if (currentScroll > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    
    // Hide/show navbar on scroll
    if (currentScroll > lastScroll && currentScroll > 300) {
      navbar.style.transform = 'translateY(-100%)';
    } else {
      navbar.style.transform = 'translateY(0)';
    }
    
    lastScroll = currentScroll;
  });

  // ===== Parallax Effect for Hero Shapes =====
  const heroShapes = document.querySelectorAll('.hero-shape');
  
  window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    
    heroShapes.forEach((shape, index) => {
      const speed = 0.5 + (index * 0.2);
      const yPos = -(scrolled * speed);
      shape.style.transform = `translateY(${yPos}px)`;
    });
  });

  // ===== Course Card Hover Effects =====
  const courseCards = document.querySelectorAll('.course-card-modern');
  
  courseCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-8px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0) scale(1)';
    });
  });

  // ===== Category Card Hover Effects =====
  const categoryCards = document.querySelectorAll('.category-card-modern');
  
  categoryCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
      const icon = this.querySelector('.category-icon-wrapper');
      if (icon) {
        icon.style.transform = 'scale(1.1) rotate(5deg)';
      }
    });
    
    card.addEventListener('mouseleave', function() {
      const icon = this.querySelector('.category-icon-wrapper');
      if (icon) {
        icon.style.transform = 'scale(1) rotate(0deg)';
      }
    });
  });

  // ===== Lazy Loading Images =====
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src || img.src;
          img.classList.add('loaded');
          observer.unobserve(img);
        }
      });
    });

    document.querySelectorAll('img[loading="lazy"]').forEach(img => {
      imageObserver.observe(img);
    });
  }

  // ===== Add Entrance Animations to Elements =====
  const addEntranceAnimation = () => {
    const elements = document.querySelectorAll('.animate-fade-in-up');
    
    elements.forEach((element, index) => {
      setTimeout(() => {
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
      }, index * 100);
    });
  };

  // Initialize entrance animations after a short delay
  setTimeout(addEntranceAnimation, 100);

  // ===== Smooth Scroll Progress Indicator =====
  const createScrollProgress = () => {
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    progressBar.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      height: 3px;
      background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
      width: 0%;
      z-index: 9999;
      transition: width 0.1s ease;
    `;
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', () => {
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (winScroll / height) * 100;
      progressBar.style.width = scrolled + '%';
    });
  };

  createScrollProgress();

  // ===== Button Ripple Effect =====
  const createRipple = (event) => {
    const button = event.currentTarget;
    const ripple = document.createElement('span');
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;

    ripple.style.width = ripple.style.height = `${diameter}px`;
    ripple.style.left = `${event.clientX - button.offsetLeft - radius}px`;
    ripple.style.top = `${event.clientY - button.offsetTop - radius}px`;
    ripple.classList.add('ripple');

    const rippleStyle = document.createElement('style');
    rippleStyle.textContent = `
      .ripple {
        position: absolute;
        border-radius: 50%;
        background-color: rgba(255, 255, 255, 0.6);
        transform: scale(0);
        animation: ripple-animation 0.6s ease-out;
        pointer-events: none;
      }
      
      @keyframes ripple-animation {
        to {
          transform: scale(4);
          opacity: 0;
        }
      }
    `;
    
    if (!document.querySelector('#ripple-style')) {
      rippleStyle.id = 'ripple-style';
      document.head.appendChild(rippleStyle);
    }

    const existingRipple = button.querySelector('.ripple');
    if (existingRipple) {
      existingRipple.remove();
    }

    button.style.position = 'relative';
    button.style.overflow = 'hidden';
    button.appendChild(ripple);

    setTimeout(() => {
      ripple.remove();
    }, 600);
  };

  // Add ripple effect to all buttons
  document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', createRipple);
  });

  // ===== Course Card Quick Preview =====
  const courseCards2 = document.querySelectorAll('.course-card-modern');
  
  courseCards2.forEach(card => {
    const overlay = card.querySelector('.course-overlay');
    
    if (overlay) {
      card.addEventListener('mouseenter', () => {
        overlay.style.transition = 'opacity 0.3s ease';
      });
    }
  });

  // ===== Back to Top Button =====
  const createBackToTop = () => {
    const button = document.createElement('button');
    button.innerHTML = '<i class="fas fa-arrow-up"></i>';
    button.className = 'back-to-top';
    button.style.cssText = `
      position: fixed;
      bottom: 30px;
      right: 30px;
      width: 50px;
      height: 50px;
      border-radius: 50%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      cursor: pointer;
      display: none;
      align-items: center;
      justify-content: center;
      font-size: 1.2rem;
      box-shadow: 0 5px 15px rgba(102, 126, 234, 0.3);
      transition: all 0.3s ease;
      z-index: 1000;
    `;

    button.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });

    button.addEventListener('mouseenter', () => {
      button.style.transform = 'translateY(-5px)';
      button.style.boxShadow = '0 10px 25px rgba(102, 126, 234, 0.4)';
    });

    button.addEventListener('mouseleave', () => {
      button.style.transform = 'translateY(0)';
      button.style.boxShadow = '0 5px 15px rgba(102, 126, 234, 0.3)';
    });

    document.body.appendChild(button);

    window.addEventListener('scroll', () => {
      if (window.pageYOffset > 300) {
        button.style.display = 'flex';
        setTimeout(() => {
          button.style.opacity = '1';
        }, 10);
      } else {
        button.style.opacity = '0';
        setTimeout(() => {
          button.style.display = 'none';
        }, 300);
      }
    });

    button.style.opacity = '0';
    button.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
  };

  createBackToTop();

  // ===== Console Welcome Message =====
  console.log('%c Welcome to Francis Academy! ', 'background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; font-size: 20px; padding: 10px 20px; border-radius: 5px;');
  console.log('%c Built with ❤️ for learners worldwide ', 'color: #667eea; font-size: 14px; padding: 5px;');
});

// ===== Performance Optimization: Debounce Function =====
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Apply debounce to scroll events
const debouncedScroll = debounce(() => {
  // Add any heavy scroll operations here
}, 100);

window.addEventListener('scroll', debouncedScroll);
