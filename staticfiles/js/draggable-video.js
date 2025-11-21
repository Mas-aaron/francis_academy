/**
 * Draggable Video Player
 * Makes video player draggable in course learning interface
 */

class DraggableVideo {
    constructor() {
        this.videoContainer = null;
        this.isDragging = false;
        this.startX = 0;
        this.startY = 0;
        this.startLeft = 0;
        this.startTop = 0;
        this.init();
    }

    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupDraggable());
        } else {
            this.setupDraggable();
        }
    }

    setupDraggable() {
        // Find the video section - we only want to make it draggable when it's in mini mode
        this.videoContainer = document.querySelector('#videoSection') || 
                             document.querySelector('.video-section-coursera');

        if (!this.videoContainer) {
            console.log('No video section found for draggable functionality');
            return;
        }

        console.log('Found video container:', this.videoContainer.className);
        
        // Don't wrap or modify the container initially
        // Just add the drag functionality that activates only in mini mode
        this.setupMiniPlayerDragging();
    }

    setupMiniPlayerDragging() {
        // Add drag handle that only appears in mini mode
        this.addMiniDragHandle();
        
        // Add event listeners for mini player dragging
        this.addMiniEventListeners();
        
        // Add CSS styles for mini player dragging
        this.addMiniStyles();
        
        // Monitor for mini player state changes
        this.monitorMiniPlayerState();
    }

    wrapVideoContainer() {
        // Don't wrap if already in a fixed position or if it's the main video section
        if (this.videoContainer.classList.contains('video-section-coursera')) {
            // For the main video section, make it draggable in place
            this.videoContainer.style.cssText += `
                position: relative;
                z-index: 999;
            `;
            this.videoContainer.classList.add('draggable-video');
            return;
        }

        const wrapper = document.createElement('div');
        wrapper.className = 'draggable-video-wrapper';
        wrapper.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            width: 400px;
            max-width: 90vw;
            z-index: 1000;
            background: #000;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            transition: transform 0.2s ease;
        `;

        // Wrap the video container
        this.videoContainer.parentNode.insertBefore(wrapper, this.videoContainer);
        wrapper.appendChild(this.videoContainer);
        
        this.videoContainer = wrapper;
        this.videoContainer.classList.add('draggable-video');
    }

    addMiniDragHandle() {
        const dragHandle = document.createElement('div');
        dragHandle.className = 'mini-video-drag-handle';
        dragHandle.innerHTML = `
            <div class="mini-drag-dots">
                <span></span><span></span><span></span>
            </div>
            <span class="mini-drag-text">Drag</span>
        `;
        
        dragHandle.style.cssText = `
            position: absolute;
            top: 5px;
            left: 5px;
            width: 60px;
            height: 20px;
            background: rgba(0, 0, 0, 0.7);
            cursor: move;
            display: none;
            align-items: center;
            justify-content: center;
            gap: 4px;
            border-radius: 4px;
            font-size: 10px;
            color: white;
            z-index: 1002;
            transition: opacity 0.3s ease;
        `;

        this.videoContainer.appendChild(dragHandle);
        this.dragHandle = dragHandle;
    }

    monitorMiniPlayerState() {
        // Watch for mini player class changes
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    const isMiniPlayer = this.videoContainer.classList.contains('mini-player');
                    this.updateDragHandleVisibility(isMiniPlayer);
                }
            });
        });

        observer.observe(this.videoContainer, {
            attributes: true,
            attributeFilter: ['class']
        });

        // Initial check
        const isMiniPlayer = this.videoContainer.classList.contains('mini-player');
        this.updateDragHandleVisibility(isMiniPlayer);
    }

    updateDragHandleVisibility(isMiniPlayer) {
        if (this.dragHandle) {
            this.dragHandle.style.display = isMiniPlayer ? 'flex' : 'none';
            
            if (isMiniPlayer) {
                // Make the video container draggable when in mini mode
                this.videoContainer.style.position = 'fixed';
                this.videoContainer.style.zIndex = '1001';
                // Ensure no constraints on movement
                this.videoContainer.style.transform = 'none';
                this.videoContainer.style.right = 'auto';
                this.videoContainer.style.bottom = 'auto';
            } else {
                // Reset position when not in mini mode
                this.videoContainer.style.position = '';
                this.videoContainer.style.zIndex = '';
                this.videoContainer.style.left = '';
                this.videoContainer.style.top = '';
                this.videoContainer.style.transform = '';
                this.videoContainer.style.right = '';
                this.videoContainer.style.bottom = '';
            }
        }
    }

    addMiniEventListeners() {
        // Only add event listeners after drag handle is created
        setTimeout(() => {
            if (this.dragHandle) {
                this.dragHandle.addEventListener('mousedown', (e) => this.startMiniDrag(e));
                document.addEventListener('mousemove', (e) => this.dragMini(e));
                document.addEventListener('mouseup', () => this.stopMiniDrag());

                // Touch events for mobile
                this.dragHandle.addEventListener('touchstart', (e) => this.startMiniDrag(e.touches[0]));
                document.addEventListener('touchmove', (e) => this.dragMini(e.touches[0]));
                document.addEventListener('touchend', () => this.stopMiniDrag());

                // Prevent video controls from interfering
                this.dragHandle.addEventListener('mousedown', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                });
            }
        }, 100);
    }

    startMiniDrag(e) {
        // Only allow dragging if in mini player mode
        if (!this.videoContainer.classList.contains('mini-player')) return;
        
        this.isDragging = true;
        this.startX = e.clientX;
        this.startY = e.clientY;
        
        const rect = this.videoContainer.getBoundingClientRect();
        this.startLeft = rect.left;
        this.startTop = rect.top;
        
        this.videoContainer.style.transition = 'none';
        this.videoContainer.classList.add('dragging');
        document.body.style.userSelect = 'none';
        
        e.preventDefault();
    }

    dragMini(e) {
        if (!this.isDragging || !this.videoContainer.classList.contains('mini-player')) return;
        
        // Calculate movement in both X and Y directions
        const deltaX = e.clientX - this.startX;
        const deltaY = e.clientY - this.startY;
        
        let newLeft = this.startLeft + deltaX;
        let newTop = this.startTop + deltaY;
        
        // Get current container dimensions
        const rect = this.videoContainer.getBoundingClientRect();
        const containerWidth = rect.width;
        const containerHeight = rect.height;
        
        // Constrain to viewport boundaries
        const maxLeft = window.innerWidth - containerWidth;
        const maxTop = window.innerHeight - containerHeight;
        
        // Ensure minimum boundaries (keep at least partially visible)
        newLeft = Math.max(-containerWidth + 50, Math.min(newLeft, maxLeft));
        newTop = Math.max(0, Math.min(newTop, maxTop));
        
        // Apply new position for both horizontal and vertical movement
        this.videoContainer.style.left = newLeft + 'px';
        this.videoContainer.style.top = newTop + 'px';
        this.videoContainer.style.right = 'auto';
        this.videoContainer.style.bottom = 'auto';
        this.videoContainer.style.transform = 'none';
        
        console.log(`Dragging to: left=${newLeft}px, top=${newTop}px`);
    }

    stopMiniDrag() {
        if (!this.isDragging) return;
        
        this.isDragging = false;
        this.videoContainer.style.transition = '';
        this.videoContainer.classList.remove('dragging');
        document.body.style.userSelect = '';
        
        // Snap to edges if close
        this.snapToEdges();
    }

    snapToEdges() {
        if (!this.videoContainer.classList.contains('mini-player')) return;
        
        const rect = this.videoContainer.getBoundingClientRect();
        const snapDistance = 50;
        const margin = 20;
        
        let newLeft = rect.left;
        let newTop = rect.top;
        let snapped = false;
        
        // Snap to left edge
        if (rect.left < snapDistance) {
            newLeft = margin;
            snapped = true;
        }
        
        // Snap to right edge
        if (rect.right > window.innerWidth - snapDistance) {
            newLeft = window.innerWidth - rect.width - margin;
            snapped = true;
        }
        
        // Snap to top edge
        if (rect.top < snapDistance) {
            newTop = margin;
            snapped = true;
        }
        
        // Snap to bottom edge
        if (rect.bottom > window.innerHeight - snapDistance) {
            newTop = window.innerHeight - rect.height - margin;
            snapped = true;
        }
        
        // Apply snapping with smooth transition
        if (snapped) {
            this.videoContainer.style.transition = 'left 0.3s ease, top 0.3s ease';
            this.videoContainer.style.left = newLeft + 'px';
            this.videoContainer.style.top = newTop + 'px';
            
            // Reset transition after animation
            setTimeout(() => {
                this.videoContainer.style.transition = '';
            }, 300);
        }
        
        console.log(`Snapped to: left=${newLeft}px, top=${newTop}px`);
    }

    toggleMinimize() {
        const video = this.videoContainer.querySelector('video, iframe');
        if (!video) return;

        if (this.videoContainer.classList.contains('minimized')) {
            // Restore
            this.videoContainer.classList.remove('minimized');
            video.style.display = 'block';
            this.videoContainer.style.height = 'auto';
        } else {
            // Minimize
            this.videoContainer.classList.add('minimized');
            video.style.display = 'none';
            this.videoContainer.style.height = '30px';
        }
    }

    addMiniStyles() {
        if (document.getElementById('mini-draggable-video-styles')) return;

        const styles = document.createElement('style');
        styles.id = 'mini-draggable-video-styles';
        styles.textContent = `
            .mini-video-drag-handle {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                user-select: none;
            }
            
            .mini-drag-dots {
                display: flex;
                gap: 1px;
            }
            
            .mini-drag-dots span {
                width: 2px;
                height: 2px;
                background: rgba(255, 255, 255, 0.8);
                border-radius: 50%;
            }
            
            .mini-drag-text {
                font-size: 9px;
                opacity: 0.9;
                font-weight: 500;
            }
            
            .video-section-coursera.mini-player {
                user-select: none;
                cursor: move;
                position: fixed !important;
                transform: none !important;
                transition: none !important;
            }
            
            .video-section-coursera.mini-player:hover .mini-video-drag-handle {
                background: rgba(0, 0, 0, 0.9);
            }
            
            .video-section-coursera.mini-player.dragging {
                box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
                transform: scale(1.02) !important;
                z-index: 1002 !important;
            }
            
            @media (max-width: 768px) {
                .mini-video-drag-handle {
                    width: 50px;
                    height: 18px;
                    font-size: 8px;
                }
                
                .mini-drag-dots span {
                    width: 1.5px;
                    height: 1.5px;
                }
            }
        `;
        
        document.head.appendChild(styles);
    }
}

// Initialize draggable video when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Only initialize on course learning pages
    if (window.location.pathname.includes('/learn/') || 
        document.querySelector('.course-content') ||
        document.querySelector('video, iframe[src*="youtube"], iframe[src*="vimeo"]')) {
        new DraggableVideo();
    }
});

// Export for manual initialization
window.DraggableVideo = DraggableVideo;
