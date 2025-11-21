/**
 * Enhanced Courses Page Functionality
 * Handles improved course cards, filtering, and interactions
 */

class CoursesPageEnhanced {
    constructor() {
        this.init();
    }

    init() {
        this.setupViewToggle();
        this.setupWishlistButtons();
        this.setupFilterHandlers();
        this.setupSearchEnhancements();
        this.setupLoadingStates();
        this.setupAccessibility();
    }

    setupViewToggle() {
        const viewButtons = document.querySelectorAll('.view-btn');
        const coursesGrid = document.getElementById('coursesGrid');
        
        if (!coursesGrid) return;

        viewButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const view = button.dataset.view;
                
                // Update active button
                viewButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                // Update grid class with animation
                coursesGrid.style.opacity = '0.7';
                
                setTimeout(() => {
                    if (view === 'list') {
                        coursesGrid.classList.add('list-view');
                    } else {
                        coursesGrid.classList.remove('list-view');
                    }
                    coursesGrid.style.opacity = '1';
                }, 150);
                
                // Store preference
                localStorage.setItem('courseViewPreference', view);
                
                // Analytics
                this.trackEvent('view_toggle', { view });
            });
        });
        
        // Load saved preference
        const savedView = localStorage.getItem('courseViewPreference');
        if (savedView && document.querySelector(`[data-view="${savedView}"]`)) {
            document.querySelector(`[data-view="${savedView}"]`).click();
        }
    }

    setupWishlistButtons() {
        const wishlistButtons = document.querySelectorAll('.wishlist-btn-improved');
        
        wishlistButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                this.toggleWishlist(button);
            });
        });
    }

    async toggleWishlist(button) {
        const courseSlug = button.dataset.courseSlug;
        const icon = button.querySelector('i');
        const isActive = button.classList.contains('active');
        
        // Optimistic UI update
        button.classList.toggle('active');
        icon.className = button.classList.contains('active') ? 'fas fa-heart' : 'far fa-heart';
        
        // Add loading state
        button.classList.add('loading');
        
        try {
            const response = await fetch(`/courses/course/${courseSlug}/wishlist/`, {
                method: 'POST',
                headers: {
                    'X-CSRFToken': this.getCSRFToken(),
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            });
            
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            
            const data = await response.json();
            
            // Update UI based on actual response
            if (data.added) {
                button.classList.add('active');
                icon.className = 'fas fa-heart';
                this.showToast('Added to wishlist', 'success');
            } else {
                button.classList.remove('active');
                icon.className = 'far fa-heart';
                this.showToast('Removed from wishlist', 'info');
            }
            
            // Analytics
            this.trackEvent('wishlist_toggle', { 
                course_slug: courseSlug, 
                action: data.added ? 'add' : 'remove' 
            });
            
        } catch (error) {
            console.error('Wishlist error:', error);
            
            // Revert optimistic update
            if (isActive) {
                button.classList.add('active');
                icon.className = 'fas fa-heart';
            } else {
                button.classList.remove('active');
                icon.className = 'far fa-heart';
            }
            
            this.showToast('Failed to update wishlist', 'error');
        } finally {
            button.classList.remove('loading');
        }
    }

    setupFilterHandlers() {
        const filterInputs = document.querySelectorAll('.filter-option input');
        const sortSelect = document.getElementById('sortSelect');
        
        filterInputs.forEach(input => {
            input.addEventListener('change', () => {
                this.debounce(() => this.applyFilters(), 300)();
            });
        });
        
        if (sortSelect) {
            sortSelect.addEventListener('change', () => {
                this.applyFilters();
            });
        }
    }

    setupSearchEnhancements() {
        const searchInput = document.getElementById('heroSearchInput');
        const quickFilterBtns = document.querySelectorAll('.quick-filter-btn');
        
        if (searchInput) {
            searchInput.addEventListener('input', 
                this.debounce(() => this.handleSearch(), 500)
            );
            
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    this.performSearch();
                }
            });
        }
        
        quickFilterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const category = btn.dataset.category;
                this.applyQuickFilter(category);
            });
        });
    }

    setupLoadingStates() {
        // Add loading skeletons while content loads
        const coursesGrid = document.getElementById('coursesGrid');
        if (coursesGrid && coursesGrid.children.length === 0) {
            this.showLoadingSkeletons(coursesGrid);
        }
    }

    setupAccessibility() {
        // Add keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-navigation');
            }
        });
        
        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-navigation');
        });
        
        // Add ARIA labels
        const wishlistBtns = document.querySelectorAll('.wishlist-btn-improved');
        wishlistBtns.forEach(btn => {
            const courseTitle = btn.closest('.course-card-improved')
                ?.querySelector('.course-title-improved a')?.textContent;
            if (courseTitle) {
                btn.setAttribute('aria-label', `Add ${courseTitle} to wishlist`);
            }
        });
    }

    applyFilters() {
        const formData = new FormData();
        const filterInputs = document.querySelectorAll('.filter-option input:checked');
        const sortSelect = document.getElementById('sortSelect');
        
        filterInputs.forEach(input => {
            if (input.value) {
                formData.append(input.name, input.value);
            }
        });
        
        if (sortSelect && sortSelect.value) {
            formData.append('sort', sortSelect.value);
        }
        
        // Update URL and reload
        const params = new URLSearchParams(formData);
        const newUrl = `${window.location.pathname}?${params.toString()}`;
        window.location.href = newUrl;
    }

    applyQuickFilter(category) {
        const categoryInput = document.querySelector(`input[name="category"][value="${category}"]`);
        if (categoryInput) {
            categoryInput.checked = true;
            this.applyFilters();
        }
    }

    handleSearch() {
        const searchInput = document.getElementById('heroSearchInput');
        if (searchInput && searchInput.value.length > 2) {
            this.performSearch();
        }
    }

    performSearch() {
        const searchInput = document.getElementById('heroSearchInput');
        if (searchInput) {
            const query = searchInput.value.trim();
            if (query) {
                const params = new URLSearchParams(window.location.search);
                params.set('q', query);
                window.location.href = `${window.location.pathname}?${params.toString()}`;
            }
        }
    }

    showLoadingSkeletons(container) {
        const skeletonHTML = `
            <div class="course-card-skeleton"></div>
            <div class="course-card-skeleton"></div>
            <div class="course-card-skeleton"></div>
            <div class="course-card-skeleton"></div>
        `;
        container.innerHTML = skeletonHTML;
    }

    showToast(message, type = 'info') {
        // Remove existing toasts
        const existingToasts = document.querySelectorAll('.toast-notification');
        existingToasts.forEach(toast => toast.remove());
        
        const toast = document.createElement('div');
        toast.className = `toast-notification toast-${type}`;
        toast.innerHTML = `
            <div class="toast-content">
                <i class="fas fa-${this.getToastIcon(type)}"></i>
                <span>${message}</span>
            </div>
            <button class="toast-close" onclick="this.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        // Add styles
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${this.getToastColor(type)};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            z-index: 9999;
            display: flex;
            align-items: center;
            gap: 1rem;
            animation: slideInRight 0.3s ease-out;
            max-width: 400px;
        `;
        
        document.body.appendChild(toast);
        
        // Auto remove after 4 seconds
        setTimeout(() => {
            if (toast.parentElement) {
                toast.style.animation = 'slideOutRight 0.3s ease-out';
                setTimeout(() => toast.remove(), 300);
            }
        }, 4000);
    }

    getToastIcon(type) {
        const icons = {
            success: 'check-circle',
            error: 'exclamation-circle',
            warning: 'exclamation-triangle',
            info: 'info-circle'
        };
        return icons[type] || 'info-circle';
    }

    getToastColor(type) {
        const colors = {
            success: '#10b981',
            error: '#ef4444',
            warning: '#f59e0b',
            info: '#3b82f6'
        };
        return colors[type] || '#3b82f6';
    }

    getCSRFToken() {
        // Try multiple methods to get CSRF token
        let token = '';
        
        // Method 1: From form input
        const tokenInput = document.querySelector('[name=csrfmiddlewaretoken]');
        if (tokenInput) {
            token = tokenInput.value;
        }
        
        // Method 2: From cookie
        if (!token) {
            const cookies = document.cookie.split(';');
            for (let cookie of cookies) {
                const [name, value] = cookie.trim().split('=');
                if (name === 'csrftoken') {
                    token = value;
                    break;
                }
            }
        }
        
        // Method 3: From meta tag
        if (!token) {
            const metaTag = document.querySelector('meta[name="csrf-token"]');
            if (metaTag) {
                token = metaTag.getAttribute('content');
            }
        }
        
        return token;
    }

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

    trackEvent(eventName, properties = {}) {
        // Analytics tracking (implement based on your analytics service)
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, properties);
        }
        
        console.log('Event tracked:', eventName, properties);
    }
}

// Add toast animations
const toastStyles = document.createElement('style');
toastStyles.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
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
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .toast-content {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        flex: 1;
    }
    
    .toast-close {
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        padding: 0.25rem;
        border-radius: 4px;
        transition: background-color 0.2s ease;
    }
    
    .toast-close:hover {
        background: rgba(255, 255, 255, 0.2);
    }
    
    .keyboard-navigation *:focus {
        outline: 2px solid #667eea !important;
        outline-offset: 2px !important;
    }
`;
document.head.appendChild(toastStyles);

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new CoursesPageEnhanced();
});

// Global functions for backward compatibility
window.performHeroSearch = function() {
    const coursePage = new CoursesPageEnhanced();
    coursePage.performSearch();
};

window.clearAllFilters = function() {
    const url = new URL(window.location);
    url.search = '';
    window.location.href = url.toString();
};

window.removeFilter = function(filterName) {
    const url = new URL(window.location);
    url.searchParams.delete(filterName);
    window.location.href = url.toString();
};
