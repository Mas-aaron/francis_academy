/**
 * ELEGANT COURSES PAGE INTERACTIONS
 * Filtering, sorting, view switching, and enhanced UX features
 */

document.addEventListener('DOMContentLoaded', function() {
  
  // ===== Hero Search =====
  const heroSearchInput = document.getElementById('heroSearchInput');
  
  if (heroSearchInput) {
    heroSearchInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        performHeroSearch();
      }
    });
  }
  
  window.performHeroSearch = function() {
    const query = heroSearchInput.value.trim();
    if (query) {
      const params = new URLSearchParams(window.location.search);
      params.set('q', query);
      window.location.href = window.location.pathname + '?' + params.toString();
    }
  };
  
  // ===== Quick Filter Buttons =====
  document.querySelectorAll('.quick-filter-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const category = this.getAttribute('data-category');
      const params = new URLSearchParams(window.location.search);
      params.set('category', category);
      window.location.href = window.location.pathname + '?' + params.toString();
    });
  });
  
  // ===== Mobile Sidebar =====
  const mobileFilterBtn = document.getElementById('mobileFilterBtn');
  const sidebar = document.getElementById('coursesSidebar');
  const sidebarClose = document.getElementById('sidebarClose');
  
  function openSidebar() {
    sidebar.classList.add('active');
    // Create overlay
    const overlay = document.createElement('div');
    overlay.className = 'sidebar-overlay';
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      z-index: 999;
    `;
    overlay.onclick = closeSidebar;
    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';
  }
  
  function closeSidebar() {
    sidebar.classList.remove('active');
    const overlay = document.querySelector('.sidebar-overlay');
    if (overlay) overlay.remove();
    document.body.style.overflow = '';
  }
  
  if (mobileFilterBtn) {
    mobileFilterBtn.addEventListener('click', openSidebar);
  }
  
  if (sidebarClose) {
    sidebarClose.addEventListener('click', closeSidebar);
  }
  
  // ===== Filter Functionality =====
  // Category filters (radio buttons)
  document.querySelectorAll('input[name="category"]').forEach(radio => {
    radio.addEventListener('change', updateFilters);
  });
  
  // Level filters (checkboxes)
  document.querySelectorAll('input[name="level"]').forEach(checkbox => {
    checkbox.addEventListener('change', updateFilters);
  });
  
  // Price filters (radio buttons)
  document.querySelectorAll('input[name="price"]').forEach(radio => {
    radio.addEventListener('change', updateFilters);
  });
  
  // Rating filters (radio buttons)
  document.querySelectorAll('input[name="rating"]').forEach(radio => {
    radio.addEventListener('change', updateFilters);
  });
  
  function updateFilters() {
    const params = new URLSearchParams(window.location.search);
    
    // Category
    const selectedCategory = document.querySelector('input[name="category"]:checked');
    if (selectedCategory && selectedCategory.value) {
      params.set('category', selectedCategory.value);
    } else {
      params.delete('category');
    }
    
    // Level (checkboxes - can be multiple)
    const selectedLevels = Array.from(document.querySelectorAll('input[name="level"]:checked'))
      .map(cb => cb.value);
    if (selectedLevels.length > 0) {
      params.set('level', selectedLevels.join(','));
    } else {
      params.delete('level');
    }
    
    // Price
    const selectedPrice = document.querySelector('input[name="price"]:checked');
    if (selectedPrice && selectedPrice.value) {
      params.set('price', selectedPrice.value);
    } else {
      params.delete('price');
    }
    
    // Rating
    const selectedRating = document.querySelector('input[name="rating"]:checked');
    if (selectedRating && selectedRating.value) {
      params.set('rating', selectedRating.value);
    } else {
      params.delete('rating');
    }
    
    // Navigate with new filters
    const newUrl = window.location.pathname + (params.toString() ? '?' + params.toString() : '');
    window.location.href = newUrl;
  }
  
  // ===== Remove Filter =====
  window.removeFilter = function(filterName) {
    const params = new URLSearchParams(window.location.search);
    params.delete(filterName);
    const newUrl = window.location.pathname + (params.toString() ? '?' + params.toString() : '');
    window.location.href = newUrl;
  };
  
  // ===== Clear All Filters =====
  window.clearAllFilters = function() {
    window.location.href = window.location.pathname;
  };
  
  // ===== Sort Functionality =====
  const sortSelect = document.getElementById('sortSelect');
  if (sortSelect) {
    sortSelect.addEventListener('change', function() {
      const params = new URLSearchParams(window.location.search);
      if (this.value) {
        params.set('sort', this.value);
      } else {
        params.delete('sort');
      }
      window.location.href = window.location.pathname + '?' + params.toString();
    });
  }
  
  // ===== View Toggle (Grid/List) =====
  const viewBtns = document.querySelectorAll('.view-btn');
  const coursesGrid = document.getElementById('coursesGrid');
  
  viewBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      const view = this.getAttribute('data-view');
      
      // Update active state
      viewBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      
      // Update grid view
      if (view === 'list') {
        coursesGrid.classList.add('list-view');
        localStorage.setItem('coursesView', 'list');
      } else {
        coursesGrid.classList.remove('list-view');
        localStorage.setItem('coursesView', 'grid');
      }
    });
  });
  
  // Restore saved view preference
  const savedView = localStorage.getItem('coursesView');
  if (savedView === 'list') {
    coursesGrid?.classList.add('list-view');
    document.querySelector('.view-btn[data-view="list"]')?.classList.add('active');
    document.querySelector('.view-btn[data-view="grid"]')?.classList.remove('active');
  }
  
  // ===== Wishlist Functionality =====
  document.addEventListener('click', function(e) {
    const wishlistBtn = e.target.closest('.wishlist-btn-card');
    if (wishlistBtn) {
      e.preventDefault();
      toggleWishlist(wishlistBtn);
    }
  });
  
  function toggleWishlist(btn) {
    const courseSlug = btn.getAttribute('data-course-slug');
    const icon = btn.querySelector('i');
    
    // Toggle visual state
    if (icon.classList.contains('far')) {
      icon.classList.remove('far');
      icon.classList.add('fas');
      btn.classList.add('active');
      btn.title = 'Remove from wishlist';
      showToast('success', 'Added to Wishlist', 'Course saved to your wishlist');
      
      // TODO: Make AJAX call to backend
      // addToWishlist(courseSlug);
    } else {
      icon.classList.remove('fas');
      icon.classList.add('far');
      btn.classList.remove('active');
      btn.title = 'Add to wishlist';
      showToast('info', 'Removed from Wishlist', 'Course removed from your wishlist');
      
      // TODO: Make AJAX call to backend
      // removeFromWishlist(courseSlug);
    }
  }
  
  // ===== Toast Notification =====
  function showToast(type, title, message) {
    const toast = document.createElement('div');
    toast.className = `toast-notification toast-${type}`;
    toast.innerHTML = `
      <div class="toast-icon">
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
      </div>
      <div class="toast-content">
        <div class="toast-title">${title}</div>
        <div class="toast-message">${message}</div>
      </div>
      <button class="toast-close" onclick="this.parentElement.remove()">
        <i class="fas fa-times"></i>
      </button>
    `;
    
    // Add styles if not already present
    if (!document.getElementById('toast-styles')) {
      const styles = document.createElement('style');
      styles.id = 'toast-styles';
      styles.textContent = `
        .toast-notification {
          position: fixed;
          top: 100px;
          right: 20px;
          min-width: 350px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
          padding: 1.25rem;
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          z-index: 10000;
          animation: slideInRight 0.3s ease;
          border-left: 4px solid #667eea;
        }
        
        .toast-success {
          border-left-color: #10b981;
        }
        
        .toast-error {
          border-left-color: #ef4444;
        }
        
        .toast-icon {
          font-size: 1.5rem;
        }
        
        .toast-success .toast-icon {
          color: #10b981;
        }
        
        .toast-error .toast-icon {
          color: #ef4444;
        }
        
        .toast-info .toast-icon {
          color: #3b82f6;
        }
        
        .toast-content {
          flex: 1;
        }
        
        .toast-title {
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 0.25rem;
        }
        
        .toast-message {
          font-size: 0.875rem;
          color: #6b7280;
        }
        
        .toast-close {
          background: none;
          border: none;
          color: #9ca3af;
          cursor: pointer;
          padding: 0;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          transition: all 0.2s ease;
        }
        
        .toast-close:hover {
          background: #f3f4f6;
          color: #4b5563;
        }
        
        @keyframes slideInRight {
          from {
            transform: translateX(400px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        @keyframes slideOutRight {
          from {
            transform: translateX(0);
            opacity: 1;
          }
          to {
            transform: translateX(400px);
            opacity: 0;
          }
        }
        
        @media (max-width: 480px) {
          .toast-notification {
            right: 10px;
            left: 10px;
            min-width: auto;
          }
        }
      `;
      document.head.appendChild(styles);
    }
    
    document.body.appendChild(toast);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      toast.style.animation = 'slideOutRight 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 5000);
  }
  
  // Make showToast globally available
  window.showToast = showToast;
  
  // ===== Smooth Scroll for Anchor Links =====
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      
      e.preventDefault();
      const target = document.querySelector(href);
      
      if (target) {
        const headerOffset = 100;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
  
  // ===== Course Card Animations =====
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const courseObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        courseObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  // Observe all course cards
  document.querySelectorAll('.course-card-elegant').forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = `all 0.6s ease ${index * 0.1}s`;
    courseObserver.observe(card);
  });
  
  // ===== Search Input Enhancement =====
  if (heroSearchInput) {
    heroSearchInput.addEventListener('focus', function() {
      this.parentElement.style.boxShadow = '0 15px 50px rgba(0, 0, 0, 0.3)';
    });
    
    heroSearchInput.addEventListener('blur', function() {
      this.parentElement.style.boxShadow = '0 10px 40px rgba(0, 0, 0, 0.2)';
    });
  }
  
  // ===== Counter Animation for Stats =====
  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        statsObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  
  document.querySelectorAll('.stat-number').forEach(stat => {
    statsObserver.observe(stat);
  });
  
  function animateCounter(element) {
    const target = element.textContent;
    const isNumber = !isNaN(parseInt(target));
    
    if (isNumber) {
      const targetNum = parseInt(target.replace(/,/g, ''));
      const duration = 2000;
      const increment = targetNum / (duration / 16);
      let current = 0;
      
      const timer = setInterval(() => {
        current += increment;
        if (current >= targetNum) {
          element.textContent = targetNum.toLocaleString();
          clearInterval(timer);
        } else {
          element.textContent = Math.ceil(current).toLocaleString();
        }
      }, 16);
    }
  }
  
  // ===== Keyboard Shortcuts =====
  document.addEventListener('keydown', function(e) {
    // ESC to close sidebar
    if (e.key === 'Escape' && sidebar?.classList.contains('active')) {
      closeSidebar();
    }
    
    // Ctrl/Cmd + K to focus search
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      heroSearchInput?.focus();
    }
  });
  
  // ===== Loading State for Filter Changes =====
  function showLoadingOverlay() {
    const overlay = document.createElement('div');
    overlay.className = 'loading-overlay';
    overlay.innerHTML = `
      <div class="loading-spinner">
        <i class="fas fa-spinner fa-spin"></i>
        <p>Updating results...</p>
      </div>
    `;
    
    const styles = document.createElement('style');
    styles.textContent = `
      .loading-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(255, 255, 255, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
      }
      
      .loading-spinner {
        text-align: center;
        padding: 2rem;
        background: white;
        border-radius: 16px;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
      }
      
      .loading-spinner i {
        font-size: 3rem;
        color: #667eea;
        margin-bottom: 1rem;
      }
      
      .loading-spinner p {
        color: #6b7280;
        font-weight: 600;
      }
    `;
    
    document.head.appendChild(styles);
    document.body.appendChild(overlay);
  }
  
  // Show loading on filter update
  document.querySelectorAll('input[type="radio"], input[type="checkbox"]').forEach(input => {
    input.addEventListener('change', function() {
      if (this.name !== 'view') {
        showLoadingOverlay();
      }
    });
  });
  
  // ===== Performance: Debounce Function =====
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
  
  // ===== Responsive Checks =====
  function handleResize() {
    if (window.innerWidth > 1024 && sidebar?.classList.contains('active')) {
      closeSidebar();
    }
  }
  
  window.addEventListener('resize', debounce(handleResize, 250));
  
  // ===== Console Message =====
  console.log('%c Courses Page Enhanced! ', 'background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; font-size: 16px; padding: 8px 16px; border-radius: 4px;');
});
