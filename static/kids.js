document.addEventListener('DOMContentLoaded', function() {
    // Tab functionality
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked button
            button.classList.add('active');
            
            // Show corresponding content
            const tabId = button.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });
    
    // Course Carousel Functionality
    const courseCarousel = document.querySelector('.courses-carousel');
    const courseCards = document.querySelectorAll('.course-card');
    const prevBtn = document.querySelector('.carousel-prev');
    const nextBtn = document.querySelector('.carousel-next');
    const dots = document.querySelectorAll('.dot');
    const cardWidth = 300; // Should match your CSS card width
    const gap = 25; // Should match your CSS gap
    let currentIndex = 0;
    let autoScrollInterval;
    
    // Initialize carousel
    function initCarousel() {
        updateCarousel();
        startAutoScroll();
        
        // Handle window resize
        window.addEventListener('resize', handleResize);
    }
    
    // Update carousel position
    function updateCarousel() {
        const offset = -currentIndex * (cardWidth + gap);
        courseCarousel.style.transform = `translateX(${offset}px)`;
        
        // Update dots
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
        
        // Disable/enable navigation buttons
        prevBtn.disabled = currentIndex === 0;
        nextBtn.disabled = currentIndex >= courseCards.length - getVisibleCards();
    }
    
    // Get number of visible cards based on viewport
    function getVisibleCards() {
        const containerWidth = courseCarousel.parentElement.offsetWidth;
        return Math.floor(containerWidth / (cardWidth + gap));
    }
    
    // Navigate to previous card
    function prevCard() {
        if (currentIndex > 0) {
            currentIndex--;
            updateCarousel();
            resetAutoScroll();
        }
    }
    
    // Navigate to next card
    function nextCard() {
        const maxIndex = courseCards.length - getVisibleCards();
        if (currentIndex < maxIndex) {
            currentIndex++;
            updateCarousel();
            resetAutoScroll();
        } else {
            // Loop back to start if at end
            currentIndex = 0;
            updateCarousel();
        }
    }
    
    // Handle window resize
    function handleResize() {
        updateCarousel();
    }
    
    // Auto-scroll functionality
    function startAutoScroll() {
        autoScrollInterval = setInterval(() => {
            nextCard();
        }, 5000); // Change slide every 5 seconds
    }
    
    function resetAutoScroll() {
        clearInterval(autoScrollInterval);
        startAutoScroll();
    }
    
    // Dot navigation
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentIndex = index;
            updateCarousel();
            resetAutoScroll();
        });
    });
    
    // Event listeners
    prevBtn.addEventListener('click', prevCard);
    nextBtn.addEventListener('click', nextCard);
    
    // Pause auto-scroll on hover
    courseCarousel.addEventListener('mouseenter', () => {
        clearInterval(autoScrollInterval);
    });
    
    courseCarousel.addEventListener('mouseleave', startAutoScroll);
    
    // Touch events for mobile swipe
    let touchStartX = 0;
    let touchEndX = 0;
    
    courseCarousel.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        clearInterval(autoScrollInterval);
    }, {passive: true});
    
    courseCarousel.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
        startAutoScroll();
    }, {passive: true});
    
    function handleSwipe() {
        const threshold = 50; // Minimum swipe distance
        if (touchStartX - touchEndX > threshold) {
            nextCard(); // Swipe left
        } else if (touchEndX - touchStartX > threshold) {
            prevCard(); // Swipe right
        }
    }
    
    // Category Filter Functionality
    const categoryFilter = document.querySelector('.category-select');
    if (categoryFilter) {
        categoryFilter.addEventListener('change', filterCourses);
    }
    
    function filterCourses() {
        const selectedCategory = categoryFilter.value.toLowerCase();
        
        courseCards.forEach(card => {
            const cardCategory = card.querySelector('.course-category').textContent.toLowerCase();
            
            if (selectedCategory === 'all categories' || cardCategory.includes(selectedCategory)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
        
        // Reset carousel position after filtering
        currentIndex = 0;
        updateCarousel();
    }
    
    // Initialize video preview functionality
    const playButtons = document.querySelectorAll('.preview-btn');
    playButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            // In a real implementation, this would open a video modal
            const courseTitle = button.closest('.course-card').querySelector('h3').textContent;
            console.log(`Play video preview for: ${courseTitle}`);
            // You would implement actual video playback here
        });
    });
    
    // Initialize enroll buttons
    const enrollButtons = document.querySelectorAll('.btn-enroll');
    enrollButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const courseTitle = button.closest('.course-card').querySelector('h3').textContent;
            console.log(`Enroll in: ${courseTitle}`);
            // You would implement actual enrollment logic here
        });
    });
    
    // Initialize the carousel
    initCarousel();
});