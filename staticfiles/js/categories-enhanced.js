/**
 * Enhanced Categories Section JavaScript
 * Francis Academy - Dynamic Category Interactions
 */

class EnhancedCategories {
    constructor() {
        this.cards = document.querySelectorAll('.category-card-enhanced');
        this.isLoaded = false;
        this.init();
    }

    init() {
        this.setupIntersectionObserver();
        this.setupHoverEffects();
        this.setupClickAnalytics();
        this.setupKeyboardNavigation();
        this.loadCategoryStats();
    }

    setupIntersectionObserver() {
        const options = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCard(entry.target);
                }
            });
        }, options);

        this.cards.forEach(card => {
            observer.observe(card);
        });
    }

    animateCard(card) {
        if (card.classList.contains('animated')) return;
        
        card.classList.add('animated');
        
        // Add staggered animation
        const delay = Array.from(this.cards).indexOf(card) * 100;
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, delay);

        // Animate counter
        this.animateCounter(card);
    }

    animateCounter(card) {
        const counter = card.querySelector('.course-count');
        if (!counter) return;

        const countText = counter.textContent;
        const countMatch = countText.match(/(\d+)/);
        if (!countMatch) return;

        const finalCount = parseInt(countMatch[1]);
        const duration = 1000;
        const increment = finalCount / (duration / 16);
        let currentCount = 0;

        const timer = setInterval(() => {
            currentCount += increment;
            if (currentCount >= finalCount) {
                currentCount = finalCount;
                clearInterval(timer);
            }
            
            const newText = countText.replace(/\d+/, Math.floor(currentCount));
            counter.innerHTML = counter.innerHTML.replace(countText, newText);
        }, 16);
    }

    setupHoverEffects() {
        this.cards.forEach(card => {
            card.addEventListener('mouseenter', (e) => {
                this.onCardHover(e.currentTarget);
            });

            card.addEventListener('mouseleave', (e) => {
                this.onCardLeave(e.currentTarget);
            });

            // Touch support for mobile
            card.addEventListener('touchstart', (e) => {
                this.onCardHover(e.currentTarget);
            });
        });
    }

    onCardHover(card) {
        // Add ripple effect
        this.createRipple(card);
        
        // Enhance neighboring cards
        this.enhanceNeighbors(card);
        
        // Update cursor
        document.body.style.cursor = 'pointer';
        
        // Preload category page (optional performance enhancement)
        this.preloadCategoryPage(card);
    }

    onCardLeave(card) {
        // Reset neighboring cards
        this.resetNeighbors();
        
        // Reset cursor
        document.body.style.cursor = 'default';
    }

    createRipple(card) {
        const ripple = document.createElement('div');
        ripple.className = 'category-ripple';
        
        const rect = card.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = (rect.width / 2 - size / 2) + 'px';
        ripple.style.top = (rect.height / 2 - size / 2) + 'px';
        
        card.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }

    enhanceNeighbors(hoveredCard) {
        this.cards.forEach(card => {
            if (card !== hoveredCard) {
                card.style.opacity = '0.7';
                card.style.transform = 'scale(0.95)';
            }
        });
    }

    resetNeighbors() {
        this.cards.forEach(card => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
        });
    }

    preloadCategoryPage(card) {
        const link = card.querySelector('.category-link-overlay');
        if (link && link.href) {
            const linkElement = document.createElement('link');
            linkElement.rel = 'prefetch';
            linkElement.href = link.href;
            document.head.appendChild(linkElement);
        }
    }

    setupClickAnalytics() {
        this.cards.forEach(card => {
            card.addEventListener('click', (e) => {
                const categoryName = card.querySelector('.category-name-enhanced').textContent;
                const categorySlug = card.dataset.category;
                
                // Track click event
                this.trackCategoryClick(categoryName, categorySlug);
                
                // Add click animation
                this.animateClick(card);
            });
        });
    }

    trackCategoryClick(categoryName, categorySlug) {
        // Analytics tracking (integrate with your analytics service)
        if (typeof gtag !== 'undefined') {
            gtag('event', 'category_click', {
                'category_name': categoryName,
                'category_slug': categorySlug
            });
        }
        
        // Custom analytics
        console.log(`Category clicked: ${categoryName} (${categorySlug})`);
    }

    animateClick(card) {
        card.style.transform = 'scale(0.95)';
        setTimeout(() => {
            card.style.transform = 'scale(1)';
        }, 150);
    }

    setupKeyboardNavigation() {
        this.cards.forEach((card, index) => {
            card.setAttribute('tabindex', '0');
            
            card.addEventListener('keydown', (e) => {
                switch(e.key) {
                    case 'Enter':
                    case ' ':
                        e.preventDefault();
                        card.querySelector('.category-link-overlay').click();
                        break;
                    case 'ArrowRight':
                        e.preventDefault();
                        this.focusNextCard(index);
                        break;
                    case 'ArrowLeft':
                        e.preventDefault();
                        this.focusPrevCard(index);
                        break;
                }
            });
        });
    }

    focusNextCard(currentIndex) {
        const nextIndex = (currentIndex + 1) % this.cards.length;
        this.cards[nextIndex].focus();
    }

    focusPrevCard(currentIndex) {
        const prevIndex = currentIndex === 0 ? this.cards.length - 1 : currentIndex - 1;
        this.cards[prevIndex].focus();
    }

    async loadCategoryStats() {
        // Simulate loading real-time stats
        try {
            // This would typically fetch from your API
            const stats = await this.fetchCategoryStats();
            this.updateCategoryStats(stats);
        } catch (error) {
            console.log('Could not load category stats:', error);
        }
    }

    async fetchCategoryStats() {
        // Mock API call - replace with actual endpoint
        return new Promise(resolve => {
            setTimeout(() => {
                resolve({
                    'programming': { courses: 45, students: 1200 },
                    'design': { courses: 32, students: 890 },
                    'business': { courses: 28, students: 1500 },
                    'marketing': { courses: 22, students: 750 },
                    'data-science': { courses: 18, students: 650 },
                    'kids': { courses: 15, students: 300 }
                });
            }, 1000);
        });
    }

    updateCategoryStats(stats) {
        this.cards.forEach(card => {
            const categorySlug = card.dataset.category;
            const stat = stats[categorySlug];
            
            if (stat) {
                const courseCount = card.querySelector('.course-count');
                if (courseCount) {
                    // Add student count tooltip
                    card.setAttribute('title', `${stat.courses} courses • ${stat.students} students`);
                    
                    // Update popularity indicator based on student count
                    this.updatePopularityIndicator(card, stat.students);
                }
            }
        });
    }

    updatePopularityIndicator(card, studentCount) {
        const indicator = card.querySelector('.popularity-indicator');
        if (!indicator) return;

        let newContent = '';
        if (studentCount > 1000) {
            newContent = '<i class="fas fa-fire"></i> Hot';
            indicator.style.background = 'rgba(239, 68, 68, 0.1)';
            indicator.style.color = '#dc2626';
        } else if (studentCount > 500) {
            newContent = '<i class="fas fa-star"></i> Popular';
            indicator.style.background = 'rgba(245, 158, 11, 0.1)';
            indicator.style.color = '#d97706';
        } else {
            newContent = '<i class="fas fa-seedling"></i> New';
            indicator.style.background = 'rgba(16, 185, 129, 0.1)';
            indicator.style.color = '#059669';
        }
        
        indicator.innerHTML = newContent;
    }

    // Public methods for external use
    refreshStats() {
        this.loadCategoryStats();
    }

    highlightCategory(categorySlug) {
        const card = document.querySelector(`[data-category="${categorySlug}"]`);
        if (card) {
            card.scrollIntoView({ behavior: 'smooth', block: 'center' });
            card.classList.add('highlighted');
            setTimeout(() => {
                card.classList.remove('highlighted');
            }, 2000);
        }
    }
}

// CSS for dynamic effects
const dynamicStyles = `
    .category-card-enhanced {
        opacity: 0;
        transform: translateY(30px);
        transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .category-ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        transform: scale(0);
        animation: ripple 0.6s linear;
        pointer-events: none;
        z-index: 1;
    }

    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }

    .category-card-enhanced.highlighted {
        animation: highlight 2s ease-in-out;
    }

    @keyframes highlight {
        0%, 100% { box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08); }
        50% { box-shadow: 0 8px 40px rgba(99, 102, 241, 0.3); }
    }

    .category-card-enhanced:focus {
        outline: 2px solid var(--primary);
        outline-offset: 2px;
    }
`;

// Inject dynamic styles
const styleSheet = document.createElement('style');
styleSheet.textContent = dynamicStyles;
document.head.appendChild(styleSheet);

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.category-card-enhanced')) {
        window.enhancedCategories = new EnhancedCategories();
    }
});

// Export for external use
window.EnhancedCategories = EnhancedCategories;
