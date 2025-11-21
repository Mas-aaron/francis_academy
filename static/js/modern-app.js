/**
 * FRANCIS ACADEMY - MODERN JAVASCRIPT APPLICATION
 * A complete, modern learning platform with advanced features
 */

class FrancisAcademy {
  constructor() {
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.initializeComponents();
    this.setupNavigation();
    this.setupSearch();
    this.setupEnrollment();
    this.setupAnimations();
  }

  // ===================================
  // EVENT LISTENERS
  // ===================================
  
  setupEventListeners() {
    document.addEventListener('DOMContentLoaded', () => {
      this.onDOMReady();
    });

    window.addEventListener('scroll', () => {
      this.handleScroll();
    });

    window.addEventListener('resize', () => {
      this.handleResize();
    });
  }

  onDOMReady() {
    console.log('🚀 Francis Academy initialized');
    this.showToast('success', 'Welcome!', 'Francis Academy is ready');
  }

  // ===================================
  // NAVIGATION
  // ===================================
  
  setupNavigation() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;
    
    // Mobile menu toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    if (mobileMenuToggle && mobileMenu) {
      mobileMenuToggle.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
        const icon = mobileMenuToggle.querySelector('i');
        if (icon) {
          icon.classList.toggle('fa-bars');
          icon.classList.toggle('fa-times');
        }
      });
      
      // Close mobile menu when clicking outside
      document.addEventListener('click', (e) => {
        if (!mobileMenuToggle.contains(e.target) && !mobileMenu.contains(e.target)) {
          mobileMenu.classList.remove('active');
          const icon = mobileMenuToggle.querySelector('i');
          if (icon) {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
          }
        }
      });
      
      // Close mobile menu when clicking a link
      mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
          mobileMenu.classList.remove('active');
          const icon = mobileMenuToggle.querySelector('i');
          if (icon) {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
          }
        });
      });
    }

    // Mobile menu toggle
    this.setupMobileMenu();
    
    // User dropdown
    this.setupUserDropdown();
    
    // Active link highlighting
    this.highlightActiveLink();
  }

  setupMobileMenu() {
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    if (mobileToggle && mobileMenu) {
      mobileToggle.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
        mobileToggle.classList.toggle('active');
      });
    }
  }

  setupUserDropdown() {
    const userDropdown = document.querySelector('.user-dropdown');
    if (!userDropdown) return;

    const trigger = userDropdown.querySelector('.dropdown-trigger');
    const menu = userDropdown.querySelector('.dropdown-menu');

    if (trigger && menu) {
      trigger.addEventListener('click', (e) => {
        e.stopPropagation();
        menu.classList.toggle('active');
      });

      document.addEventListener('click', () => {
        menu.classList.remove('active');
      });
    }
  }

  highlightActiveLink() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.navbar-link');
    
    navLinks.forEach(link => {
      if (link.getAttribute('href') === currentPath) {
        link.classList.add('active');
      }
    });
  }

  handleScroll() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Animate elements on scroll
    this.animateOnScroll();
  }

  handleResize() {
    // Handle responsive behavior
    this.updateLayout();
  }

  // ===================================
  // SEARCH FUNCTIONALITY
  // ===================================
  
  setupSearch() {
    const searchInput = document.querySelector('.search-input');
    const searchFilters = document.querySelectorAll('.filter-btn');
    
    if (searchInput) {
      let searchTimeout;
      
      searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
          this.performSearch(e.target.value);
        }, 300);
      });
    }

    searchFilters.forEach(filter => {
      filter.addEventListener('click', () => {
        this.toggleFilter(filter);
      });
    });
  }

  performSearch(query) {
    console.log('🔍 Searching for:', query);
    
    if (query.length < 2) {
      this.showAllCourses();
      return;
    }

    const courses = document.querySelectorAll('.course-card');
    let visibleCount = 0;

    courses.forEach(course => {
      const title = course.querySelector('.course-title')?.textContent.toLowerCase() || '';
      const instructor = course.querySelector('.course-instructor')?.textContent.toLowerCase() || '';
      const category = course.querySelector('.course-category')?.textContent.toLowerCase() || '';
      
      const searchText = `${title} ${instructor} ${category}`;
      
      if (searchText.includes(query.toLowerCase())) {
        course.style.display = 'block';
        course.classList.add('animate-fade-in');
        visibleCount++;
      } else {
        course.style.display = 'none';
      }
    });

    this.updateSearchResults(visibleCount, query);
  }

  toggleFilter(filterBtn) {
    const category = filterBtn.dataset.category;
    
    // Toggle active state
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.classList.remove('active');
    });
    filterBtn.classList.add('active');

    // Filter courses
    this.filterCourses(category);
  }

  filterCourses(category) {
    const courses = document.querySelectorAll('.course-card');
    let visibleCount = 0;

    courses.forEach(course => {
      const courseCategory = course.dataset.category;
      
      if (category === 'all' || courseCategory === category) {
        course.style.display = 'block';
        course.classList.add('animate-fade-in');
        visibleCount++;
      } else {
        course.style.display = 'none';
      }
    });

    this.updateSearchResults(visibleCount, `Category: ${category}`);
  }

  showAllCourses() {
    const courses = document.querySelectorAll('.course-card');
    courses.forEach(course => {
      course.style.display = 'block';
    });
  }

  updateSearchResults(count, query) {
    const resultsContainer = document.querySelector('.search-results');
    if (resultsContainer) {
      resultsContainer.innerHTML = `
        <p class="text-secondary">
          Found ${count} course${count !== 1 ? 's' : ''} for "${query}"
        </p>
      `;
    }
  }

  // ===================================
  // ENROLLMENT SYSTEM
  // ===================================
  
  setupEnrollment() {
    // Handle all enrollment buttons
    document.addEventListener('click', (e) => {
      const enrollBtn = e.target.closest('.btn-enroll, .enroll-btn, [data-action="enroll"]');
      if (enrollBtn) {
        e.preventDefault();
        this.handleEnrollment(enrollBtn);
      }

      const previewBtn = e.target.closest('.btn-preview, [data-action="preview"]');
      if (previewBtn) {
        e.preventDefault();
        this.handlePreview(previewBtn);
      }
    });
  }

  handleEnrollment(button) {
    const courseData = this.extractCourseData(button);
    
    console.log('📚 Enrollment clicked:', courseData);

    if (this.isUserAuthenticated()) {
      this.enrollUser(courseData);
    } else {
      this.showLoginModal(courseData);
    }
  }

  handlePreview(button) {
    const courseData = this.extractCourseData(button);
    console.log('👁️ Preview clicked:', courseData);
    
    // Always allow preview
    this.redirectToCourse(courseData.slug);
  }

  extractCourseData(button) {
    // Try multiple methods to get course data
    const card = button.closest('.course-card, .recommendation-card');
    
    let courseData = {
      id: button.dataset.courseId,
      slug: button.dataset.courseSlug,
      title: button.dataset.courseTitle,
      price: button.dataset.price
    };

    // If no direct data, extract from card
    if (!courseData.title && card) {
      const titleElement = card.querySelector('.course-title, h3, h4');
      courseData.title = titleElement?.textContent.trim();
      
      const categoryElement = card.querySelector('.course-category');
      courseData.category = categoryElement?.textContent.trim();
    }

    // Map titles to slugs (fallback)
    if (!courseData.slug && courseData.title) {
      courseData.slug = this.mapTitleToSlug(courseData.title);
    }

    return courseData;
  }

  mapTitleToSlug(title) {
    const slugMap = {
      'Python for Beginners': 'python-for-beginners',
      'Web Development with Django': 'web-development-with-django',
      'Digital Marketing Fundamentals': 'digital-marketing-fundamentals',
      'Graphic Design Masterclass': 'graphic-design-masterclass',
      'Data Science Fundamentals': 'data-science-fundamentals',
      'UI/UX Design Principles': 'ui-ux-design-principles'
    };

    return slugMap[title] || 'python-for-beginners';
  }

  isUserAuthenticated() {
    // Check for user menu or authentication indicators
    return document.querySelector('.user-dropdown, .user-menu') !== null;
  }

  enrollUser(courseData) {
    this.showToast('success', 'Enrollment Started!', `Enrolling in ${courseData.title}...`);
    
    // Simulate enrollment process
    setTimeout(() => {
      this.redirectToCourse(courseData.slug);
    }, 1500);
  }

  showLoginModal(courseData) {
    // Store intended course
    sessionStorage.setItem('intendedCourse', JSON.stringify(courseData));
    
    // Show modal or redirect to login
    if (document.querySelector('#loginModal')) {
      this.openModal('#loginModal');
    } else {
      this.showToast('info', 'Login Required', 'Please login to enroll in courses');
      setTimeout(() => {
        window.location.href = '/admin/login/';
      }, 2000);
    }
  }

  redirectToCourse(slug) {
    window.location.href = `/courses/course/${slug}/`;
  }

  // ===================================
  // MODAL SYSTEM
  // ===================================
  
  openModal(selector) {
    const modal = document.querySelector(selector);
    if (modal) {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  closeModal(selector) {
    const modal = document.querySelector(selector);
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  setupModals() {
    // Close modal on backdrop click
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('modal-backdrop')) {
        this.closeModal('.modal.active');
      }
    });

    // Close modal on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeModal('.modal.active');
      }
    });
  }

  // ===================================
  // TOAST NOTIFICATIONS
  // ===================================
  
  showToast(type, title, message, duration = 4000) {
    const toastContainer = this.getToastContainer();
    const toast = this.createToast(type, title, message);
    
    toastContainer.appendChild(toast);
    
    // Animate in
    setTimeout(() => toast.classList.add('show'), 100);
    
    // Auto remove
    setTimeout(() => {
      this.removeToast(toast);
    }, duration);
  }

  getToastContainer() {
    let container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      container.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 1000;
        display: flex;
        flex-direction: column;
        gap: 10px;
      `;
      document.body.appendChild(container);
    }
    return container;
  }

  createToast(type, title, message) {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    const icons = {
      success: '✅',
      error: '❌',
      warning: '⚠️',
      info: 'ℹ️'
    };

    toast.innerHTML = `
      <div class="toast-content">
        <div class="toast-icon">${icons[type] || icons.info}</div>
        <div class="toast-text">
          <div class="toast-title">${title}</div>
          <div class="toast-message">${message}</div>
        </div>
        <button class="toast-close" onclick="this.parentElement.parentElement.remove()">×</button>
      </div>
    `;

    // Add styles
    toast.style.cssText = `
      background: white;
      border-radius: 8px;
      padding: 16px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      border-left: 4px solid var(--${type === 'success' ? 'success' : type === 'error' ? 'error' : type === 'warning' ? 'warning' : 'info'});
      min-width: 300px;
      max-width: 400px;
      transform: translateX(100%);
      opacity: 0;
      transition: all 0.3s ease;
    `;

    return toast;
  }

  removeToast(toast) {
    toast.style.transform = 'translateX(100%)';
    toast.style.opacity = '0';
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 300);
  }

  // ===================================
  // ANIMATIONS
  // ===================================
  
  setupAnimations() {
    this.animateOnScroll();
    this.setupHoverEffects();
  }

  animateOnScroll() {
    const elements = document.querySelectorAll('.course-card, .card, .hero-content');
    
    elements.forEach(element => {
      const rect = element.getBoundingClientRect();
      const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
      
      if (isVisible && !element.classList.contains('animated')) {
        element.classList.add('animate-fade-in-up', 'animated');
      }
    });
  }

  setupHoverEffects() {
    // Add interactive hover effects
    const cards = document.querySelectorAll('.course-card');
    
    cards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-8px) scale(1.02)';
      });
      
      card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0) scale(1)';
      });
    });
  }

  // ===================================
  // COMPONENT INITIALIZATION
  // ===================================
  
  initializeComponents() {
    this.setupModals();
    this.initializeCarousels();
    this.setupProgressBars();
    this.setupCounters();
  }

  initializeCarousels() {
    // Initialize any carousels/sliders
    const carousels = document.querySelectorAll('.carousel');
    carousels.forEach(carousel => {
      // Carousel logic here
    });
  }

  setupProgressBars() {
    const progressBars = document.querySelectorAll('[data-progress]');
    
    progressBars.forEach(bar => {
      const progress = bar.dataset.progress;
      const fill = bar.querySelector('.progress-fill');
      
      if (fill) {
        setTimeout(() => {
          fill.style.width = `${progress}%`;
        }, 500);
      }
    });
  }

  setupCounters() {
    const counters = document.querySelectorAll('[data-count]');
    
    counters.forEach(counter => {
      const target = parseInt(counter.dataset.count);
      const duration = 2000;
      const increment = target / (duration / 16);
      let current = 0;
      
      const updateCounter = () => {
        current += increment;
        if (current < target) {
          counter.textContent = Math.floor(current).toLocaleString();
          requestAnimationFrame(updateCounter);
        } else {
          counter.textContent = target.toLocaleString();
        }
      };
      
      // Start counter when element is visible
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            updateCounter();
            observer.unobserve(entry.target);
          }
        });
      });
      
      observer.observe(counter);
    });
  }

  updateLayout() {
    // Handle responsive layout updates
    const isMobile = window.innerWidth < 768;
    
    if (isMobile) {
      document.body.classList.add('mobile');
    } else {
      document.body.classList.remove('mobile');
    }
  }

  // ===================================
  // UTILITY METHODS
  // ===================================
  
  debounce(func, wait) {
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

  throttle(func, limit) {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }
}

// ===================================
// GLOBAL FUNCTIONS
// ===================================

// Make functions available globally for HTML onclick handlers
window.showLoginModal = function(courseData) {
  app.showLoginModal(courseData);
};

window.closeModal = function(selector) {
  app.closeModal(selector);
};

window.continueAsGuest = function() {
  const courseData = JSON.parse(sessionStorage.getItem('intendedCourse') || '{}');
  app.closeModal('#loginModal');
  app.showToast('info', 'Continuing as Guest', 'You can start learning immediately!');
  
  setTimeout(() => {
    if (courseData.slug) {
      app.redirectToCourse(courseData.slug);
    }
  }, 1500);
};

// ===================================
// INITIALIZE APPLICATION
// ===================================

// Initialize the application
const app = new FrancisAcademy();

// Add some global styles for toast notifications
const toastStyles = document.createElement('style');
toastStyles.textContent = `
  .toast.show {
    transform: translateX(0) !important;
    opacity: 1 !important;
  }
  
  .toast-content {
    display: flex;
    align-items: flex-start;
    gap: 12px;
  }
  
  .toast-icon {
    font-size: 18px;
    flex-shrink: 0;
  }
  
  .toast-text {
    flex: 1;
  }
  
  .toast-title {
    font-weight: 600;
    margin-bottom: 4px;
    color: var(--gray-900);
  }
  
  .toast-message {
    font-size: 14px;
    color: var(--gray-600);
  }
  
  .toast-close {
    background: none;
    border: none;
    font-size: 18px;
    cursor: pointer;
    color: var(--gray-400);
    padding: 0;
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .toast-close:hover {
    color: var(--gray-600);
  }
`;

document.head.appendChild(toastStyles);

console.log('🎓 Francis Academy - Modern Learning Platform Loaded');
