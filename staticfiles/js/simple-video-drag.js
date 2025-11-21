/**
 * Simple Video Drag Functionality
 * Adds a toggle button to make video draggable
 */

class SimpleVideoDrag {
    constructor() {
        this.videoSection = null;
        this.isDragging = false;
        this.isFloating = false;
        this.startX = 0;
        this.startY = 0;
        this.startLeft = 0;
        this.startTop = 0;
        this.init();
    }

    init() {
        // Find the video section
        this.videoSection = document.querySelector('.video-section-coursera') || 
                           document.querySelector('#videoSection');
        
        if (!this.videoSection) {
            console.log('No video section found');
            return;
        }

        console.log('Video section found, adding drag functionality');
        this.addDragButton();
        this.addEventListeners();
    }

    addDragButton() {
        // Create drag handle
        const dragHandle = document.createElement('div');
        dragHandle.className = 'video-drag-handle';
        dragHandle.innerHTML = `
            <div class="drag-icon">
                <span></span><span></span><span></span>
                <span></span><span></span><span></span>
            </div>
            <span>Drag</span>
        `;
        
        // Create float toggle button
        const floatButton = document.createElement('button');
        floatButton.className = 'float-toggle-btn';
        floatButton.innerHTML = '<i class="fas fa-external-link-alt"></i>';
        floatButton.title = 'Float video';
        floatButton.onclick = () => this.toggleFloat();
        
        // Add to video section
        this.videoSection.appendChild(dragHandle);
        this.videoSection.appendChild(floatButton);
        
        this.dragHandle = dragHandle;
        this.floatButton = floatButton;
    }

    addEventListeners() {
        // Mouse events
        this.dragHandle.addEventListener('mousedown', (e) => this.startDrag(e));
        document.addEventListener('mousemove', (e) => this.drag(e));
        document.addEventListener('mouseup', () => this.stopDrag());

        // Touch events
        this.dragHandle.addEventListener('touchstart', (e) => this.startDrag(e.touches[0]));
        document.addEventListener('touchmove', (e) => this.drag(e.touches[0]));
        document.addEventListener('touchend', () => this.stopDrag());

        // Click to restore when minimized
        this.videoSection.addEventListener('click', (e) => {
            if (this.videoSection.classList.contains('minimized')) {
                e.preventDefault();
                this.restore();
            }
        });
    }

    toggleFloat() {
        if (this.isFloating) {
            this.unfloat();
        } else {
            this.float();
        }
    }

    float() {
        this.videoSection.classList.add('floating');
        this.videoSection.style.position = 'fixed';
        this.videoSection.style.top = '20px';
        this.videoSection.style.right = '20px';
        this.videoSection.style.width = '400px';
        this.videoSection.style.zIndex = '1000';
        
        this.floatButton.innerHTML = '<i class="fas fa-compress"></i>';
        this.floatButton.title = 'Dock video';
        this.isFloating = true;
        
        console.log('Video floated');
    }

    unfloat() {
        this.videoSection.classList.remove('floating');
        this.videoSection.style.position = '';
        this.videoSection.style.top = '';
        this.videoSection.style.right = '';
        this.videoSection.style.width = '';
        this.videoSection.style.zIndex = '';
        
        this.floatButton.innerHTML = '<i class="fas fa-external-link-alt"></i>';
        this.floatButton.title = 'Float video';
        this.isFloating = false;
        
        console.log('Video unfloated');
    }

    startDrag(e) {
        if (!this.isFloating) return;
        
        this.isDragging = true;
        this.startX = e.clientX;
        this.startY = e.clientY;
        
        const rect = this.videoSection.getBoundingClientRect();
        this.startLeft = rect.left;
        this.startTop = rect.top;
        
        this.videoSection.classList.add('dragging');
        document.body.style.userSelect = 'none';
        
        e.preventDefault();
        console.log('Started dragging');
    }

    drag(e) {
        if (!this.isDragging || !this.isFloating) return;
        
        const deltaX = e.clientX - this.startX;
        const deltaY = e.clientY - this.startY;
        
        let newLeft = this.startLeft + deltaX;
        let newTop = this.startTop + deltaY;
        
        // Constrain to viewport
        const rect = this.videoSection.getBoundingClientRect();
        const maxLeft = window.innerWidth - rect.width;
        const maxTop = window.innerHeight - rect.height;
        
        newLeft = Math.max(0, Math.min(newLeft, maxLeft));
        newTop = Math.max(0, Math.min(newTop, maxTop));
        
        this.videoSection.style.left = newLeft + 'px';
        this.videoSection.style.top = newTop + 'px';
        this.videoSection.style.right = 'auto';
    }

    stopDrag() {
        if (!this.isDragging) return;
        
        this.isDragging = false;
        this.videoSection.classList.remove('dragging');
        document.body.style.userSelect = '';
        
        console.log('Stopped dragging');
    }

    minimize() {
        this.videoSection.classList.add('minimized');
    }

    restore() {
        this.videoSection.classList.remove('minimized');
    }
}

// Add CSS styles
function addVideoStyles() {
    if (document.getElementById('simple-video-drag-styles')) return;

    const styles = document.createElement('style');
    styles.id = 'simple-video-drag-styles';
    styles.textContent = `
        .float-toggle-btn {
            position: absolute;
            top: 10px;
            left: 10px;
            background: rgba(0, 0, 0, 0.7);
            color: white;
            border: none;
            padding: 8px;
            border-radius: 50%;
            cursor: pointer;
            opacity: 0;
            transition: all 0.3s ease;
            z-index: 15;
            font-size: 12px;
        }
        
        .video-section-coursera:hover .float-toggle-btn {
            opacity: 1;
        }
        
        .float-toggle-btn:hover {
            background: rgba(0, 0, 0, 0.9);
            transform: scale(1.1);
        }
        
        .video-drag-handle {
            position: absolute;
            top: 10px;
            right: 10px;
            background: rgba(0, 0, 0, 0.7);
            color: white;
            padding: 6px 10px;
            border-radius: 15px;
            font-size: 11px;
            cursor: move;
            opacity: 0;
            transition: opacity 0.3s ease;
            z-index: 15;
            display: flex;
            align-items: center;
            gap: 6px;
        }
        
        .video-section-coursera.floating:hover .video-drag-handle {
            opacity: 1;
        }
        
        .drag-icon {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 1px;
            width: 9px;
            height: 6px;
        }
        
        .drag-icon span {
            width: 2px;
            height: 2px;
            background: white;
            border-radius: 50%;
        }
        
        .video-section-coursera.floating {
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
            border-radius: 8px;
            overflow: hidden;
        }
        
        .video-section-coursera.dragging {
            transform: rotate(1deg) scale(1.02);
            transition: none;
        }
        
        .video-section-coursera.minimized {
            height: 40px;
            cursor: pointer;
        }
        
        .video-section-coursera.minimized .video-player-coursera {
            display: none;
        }
        
        .video-section-coursera.minimized::after {
            content: "📹 Click to restore video";
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            color: white;
            font-size: 12px;
            pointer-events: none;
        }
        
        @media (max-width: 768px) {
            .video-section-coursera.floating {
                width: 300px !important;
                max-width: 90vw;
            }
        }
        
        @media (max-width: 480px) {
            .video-section-coursera.floating {
                width: 250px !important;
            }
        }
    `;
    
    document.head.appendChild(styles);
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.video-section-coursera') || 
        document.querySelector('.learning-page-container')) {
        
        addVideoStyles();
        
        // Small delay to ensure video is loaded
        setTimeout(() => {
            new SimpleVideoDrag();
        }, 500);
    }
});

// Export for manual initialization
window.SimpleVideoDrag = SimpleVideoDrag;
