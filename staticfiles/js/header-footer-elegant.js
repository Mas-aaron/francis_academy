/**
 * ELEGANT HEADER & FOOTER INTERACTIONS
 * Enhanced navigation, dropdowns, mobile menu, and newsletter functionality
 */

document.addEventListener('DOMContentLoaded', function() {
  
  // ===== Navbar Scroll Behavior =====
  const navbar = document.getElementById('mainNavbar');
  let lastScroll = 0;
  const scrollThreshold = 100;
  
  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    // Add scrolled class for shadow
    if (currentScroll > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    
    // Hide/show navbar on scroll (only after threshold)
    if (currentScroll > scrollThreshold) {
      if (currentScroll > lastScroll) {
        // Scrolling down
        navbar.classList.add('hidden');
      } else {
        // Scrolling up
        navbar.classList.remove('hidden');
      }
    }
    
    lastScroll = currentScroll;
  });
  
  // ===== User Dropdown =====
  const userDropdownBtn = document.getElementById('userDropdownBtn');
  const userDropdown = document.getElementById('userDropdown');
  
  if (userDropdownBtn && userDropdown) {
    userDropdownBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      userDropdown.classList.toggle('active');
      
      // Close other dropdowns if any
      closeAllDropdowns(userDropdown);
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
      if (!userDropdownBtn.contains(e.target) && !userDropdown.contains(e.target)) {
        userDropdown.classList.remove('active');
      }
    });
  }
  
  // ===== Mobile Menu =====
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileMenuClose = document.getElementById('mobileMenuClose');
  const mobileOverlay = document.getElementById('mobileOverlay');
  
  function openMobileMenu() {
    mobileMenu.classList.add('active');
    mobileOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
  
  function closeMobileMenu() {
    mobileMenu.classList.remove('active');
    mobileOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }
  
  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', openMobileMenu);
  }
  
  if (mobileMenuClose) {
    mobileMenuClose.addEventListener('click', closeMobileMenu);
  }
  
  if (mobileOverlay) {
    mobileOverlay.addEventListener('click', closeMobileMenu);
  }
  
  // Close mobile menu on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
      closeMobileMenu();
    }
  });
  
  // Close mobile menu when clicking on a link
  const mobileMenuLinks = mobileMenu?.querySelectorAll('.mobile-menu-link');
  mobileMenuLinks?.forEach(link => {
    link.addEventListener('click', () => {
      // Delay to allow navigation to start
      setTimeout(closeMobileMenu, 300);
    });
  });
  
  // ===== Navbar Icon Buttons with data-href =====
  document.querySelectorAll('.navbar-icon-btn[data-href]').forEach(btn => {
    btn.addEventListener('click', function() {
      const href = this.getAttribute('data-href');
      if (href) {
        window.location.href = href;
      }
    });
  });
  
  // ===== Notification Button =====
  // Notification functionality is now handled by notifications.js
  
  // ===== Search Functionality =====
  const searchInput = document.getElementById('navbarSearchInput');
  
  if (searchInput) {
    let searchTimeout;
    
    searchInput.addEventListener('input', (e) => {
      clearTimeout(searchTimeout);
      const query = e.target.value.trim();
      
      if (query.length > 2) {
        searchTimeout = setTimeout(() => {
          performSearch(query);
        }, 500);
      }
    });
    
    searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        const query = searchInput.value.trim();
        if (query) {
          // Redirect to courses page with search query
          window.location.href = `/modern/courses/?search=${encodeURIComponent(query)}`;
        }
      }
    });
  }
  
  function performSearch(query) {
    console.log('Searching for:', query);
    // Implement actual search functionality here
    // Could show a dropdown with results
  }
  
  // ===== Newsletter Form =====
  const newsletterForm = document.getElementById('newsletterForm');
  
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const emailInput = newsletterForm.querySelector('input[type="email"]');
      const submitBtn = newsletterForm.querySelector('.newsletter-btn');
      const email = emailInput.value.trim();
      
      if (!email) return;
      
      // Disable button and show loading
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Subscribing...';
      
      try {
        // Simulate API call (replace with actual endpoint)
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Success
        submitBtn.innerHTML = '<i class="fas fa-check"></i> Subscribed!';
        submitBtn.style.background = '#10b981';
        emailInput.value = '';
        
        // Show success message
        showNotification('Successfully subscribed to newsletter!', 'success');
        
        // Reset button after delay
        setTimeout(() => {
          submitBtn.disabled = false;
          submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Subscribe';
          submitBtn.style.background = '';
        }, 3000);
        
      } catch (error) {
        // Error
        submitBtn.innerHTML = '<i class="fas fa-times"></i> Failed';
        submitBtn.style.background = '#ef4444';
        
        showNotification('Failed to subscribe. Please try again.', 'error');
        
        setTimeout(() => {
          submitBtn.disabled = false;
          submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Subscribe';
          submitBtn.style.background = '';
        }, 3000);
      }
    });
  }
  
  // ===== Notification Toast =====
  function showNotification(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `notification-toast notification-${type}`;
    toast.innerHTML = `
      <div class="notification-content">
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${message}</span>
      </div>
    `;
    
    // Add styles if not already present
    if (!document.getElementById('notification-styles')) {
      const styles = document.createElement('style');
      styles.id = 'notification-styles';
      styles.textContent = `
        .notification-toast {
          position: fixed;
          top: 100px;
          right: 20px;
          min-width: 300px;
          padding: 1rem 1.5rem;
          background: white;
          border-radius: 12px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
          z-index: 10000;
          animation: slideInRight 0.3s ease;
          border-left: 4px solid #667eea;
        }
        
        .notification-success {
          border-left-color: #10b981;
        }
        
        .notification-error {
          border-left-color: #ef4444;
        }
        
        .notification-content {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          color: #1f2937;
          font-weight: 500;
        }
        
        .notification-content i {
          font-size: 1.25rem;
        }
        
        .notification-success i {
          color: #10b981;
        }
        
        .notification-error i {
          color: #ef4444;
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
  
  // ===== Active Link Highlighting =====
  function setActiveLink() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.navbar-link-elegant, .mobile-menu-link');
    
    navLinks.forEach(link => {
      const linkPath = new URL(link.href).pathname;
      if (linkPath === currentPath || (currentPath.startsWith(linkPath) && linkPath !== '/')) {
        link.classList.add('active');
      }
    });
  }
  
  setActiveLink();
  
  // ===== Smooth Scroll for Footer Links =====
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      
      e.preventDefault();
      const target = document.querySelector(href);
      
      if (target) {
        const headerOffset = 80;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
        
        // Close mobile menu if open
        if (mobileMenu?.classList.contains('active')) {
          closeMobileMenu();
        }
      }
    });
  });
  
  // ===== Footer Link Animations =====
  const footerLinks = document.querySelectorAll('.footer-link');
  footerLinks.forEach(link => {
    link.addEventListener('mouseenter', function() {
      this.style.paddingLeft = '0.5rem';
    });
    
    link.addEventListener('mouseleave', function() {
      this.style.paddingLeft = '0';
    });
  });
  
  // ===== Social Share (if needed) =====
  function sharePage(platform) {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(document.title);
    
    let shareUrl;
    switch(platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
        break;
      default:
        return;
    }
    
    window.open(shareUrl, '_blank', 'width=600,height=400');
  }
  
  // Make share function globally available
  window.sharePage = sharePage;
  
  // ===== Helper Functions =====
  function closeAllDropdowns(except = null) {
    document.querySelectorAll('.dropdown-menu-elegant').forEach(dropdown => {
      if (dropdown !== except) {
        dropdown.classList.remove('active');
      }
    });
  }
  
  // ===== Accessibility Enhancements =====
  // Handle escape key for dropdowns
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeAllDropdowns();
    }
  });
  
  // Focus management for dropdowns
  const dropdownToggles = document.querySelectorAll('[id$="DropdownBtn"]');
  dropdownToggles.forEach(toggle => {
    toggle.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggle.click();
      }
    });
  });
  
  // ===== Performance: Debounce Resize Events =====
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      // Close mobile menu on desktop
      if (window.innerWidth > 768 && mobileMenu?.classList.contains('active')) {
        closeMobileMenu();
      }
    }, 250);
  });
  
  // ===== Console Message =====
  console.log('%c Header & Footer Enhanced! ', 'background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; font-size: 16px; padding: 8px 16px; border-radius: 4px;');
});

// ===== Export functions for use in other scripts =====
window.FrancisAcademy = {
  showNotification: function(message, type) {
    // This will be available after DOMContentLoaded
    const event = new CustomEvent('showNotification', { detail: { message, type } });
    document.dispatchEvent(event);
  }
};
