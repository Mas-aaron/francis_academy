/**
 * Real-time Notifications and Discussion System
 * Francis Academy - Modern Learning Platform
 */

class NotificationSystem {
    constructor() {
        this.notificationCount = 0;
        this.notifications = [];
        this.pollInterval = 30000; // 30 seconds
        this.discussionPollInterval = 5000; // 5 seconds for discussions
        this.currentDiscussionId = null;
        this.lastDiscussionCheck = null;
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.startNotificationPolling();
        this.setupDiscussionPolling();
        this.loadInitialNotifications();
    }

    setupEventListeners() {
        // Notification bell click
        const notificationBtn = document.getElementById('notificationBtn');
        if (notificationBtn) {
            notificationBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleNotificationDropdown();
            });
        }

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            const dropdown = document.getElementById('notificationDropdown');
            const btn = document.getElementById('notificationBtn');
            
            if (dropdown && !dropdown.contains(e.target) && !btn.contains(e.target)) {
                dropdown.classList.remove('show');
            }
        });

        // Mark all as read button
        document.addEventListener('click', (e) => {
            if (e.target.matches('.mark-all-read-btn')) {
                e.preventDefault();
                this.markAllAsRead();
            }
        });

        // Individual notification click
        document.addEventListener('click', (e) => {
            if (e.target.closest('.notification-item')) {
                const item = e.target.closest('.notification-item');
                const notificationId = item.dataset.notificationId;
                const actionUrl = item.dataset.actionUrl;
                
                this.markAsRead(notificationId);
                
                if (actionUrl) {
                    window.location.href = actionUrl;
                }
            }
        });
    }

    async loadInitialNotifications() {
        try {
            const response = await fetch('/courses/notifications/');
            const data = await response.json();
            
            this.notifications = data.notifications;
            this.notificationCount = data.unread_count;
            
            this.updateNotificationBadge();
            this.renderNotifications();
        } catch (error) {
            console.error('Error loading notifications:', error);
        }
    }

    startNotificationPolling() {
        setInterval(() => {
            this.checkForNewNotifications();
        }, this.pollInterval);
    }

    async checkForNewNotifications() {
        try {
            const response = await fetch('/courses/notifications/');
            const data = await response.json();
            
            const newUnreadCount = data.unread_count;
            
            // Check if there are new notifications
            if (newUnreadCount > this.notificationCount) {
                this.showNewNotificationToast();
                this.playNotificationSound();
            }
            
            this.notifications = data.notifications;
            this.notificationCount = newUnreadCount;
            
            this.updateNotificationBadge();
            this.renderNotifications();
        } catch (error) {
            console.error('Error checking notifications:', error);
        }
    }

    setupDiscussionPolling() {
        // Only poll for discussions if we're on a course learning page
        const discussionContainer = document.getElementById('discussionContainer');
        if (discussionContainer) {
            this.startDiscussionPolling();
        }
    }

    startDiscussionPolling() {
        setInterval(() => {
            this.checkForNewDiscussionMessages();
        }, this.discussionPollInterval);
    }

    async checkForNewDiscussionMessages() {
        const currentLessonId = this.getCurrentLessonId();
        const courseSlug = this.getCurrentCourseSlug();
        
        if (!currentLessonId || !courseSlug) return;

        try {
            const response = await fetch(`/courses/course/${courseSlug}/lesson/${currentLessonId}/discussions/`);
            const data = await response.json();
            
            this.updateDiscussionsInRealTime(data.discussions);
        } catch (error) {
            console.error('Error checking discussion updates:', error);
        }
    }

    updateDiscussionsInRealTime(discussions) {
        const discussionContainer = document.getElementById('discussionContainer');
        if (!discussionContainer) return;

        discussions.forEach(discussion => {
            const existingDiscussion = document.querySelector(`[data-discussion-id="${discussion.id}"]`);
            
            if (!existingDiscussion) {
                // New discussion - add it
                this.addNewDiscussionToDOM(discussion);
            } else {
                // Check for new replies
                const currentReplyCount = existingDiscussion.querySelectorAll('.reply-item').length;
                if (discussion.replies.length > currentReplyCount) {
                    this.addNewRepliesToDOM(discussion, existingDiscussion);
                }
            }
        });
    }

    addNewDiscussionToDOM(discussion) {
        const discussionContainer = document.getElementById('discussionContainer');
        const discussionHTML = this.createDiscussionHTML(discussion);
        
        // Add with animation
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = discussionHTML;
        const discussionElement = tempDiv.firstElementChild;
        
        discussionElement.style.opacity = '0';
        discussionElement.style.transform = 'translateY(-20px)';
        
        discussionContainer.insertBefore(discussionElement, discussionContainer.firstChild);
        
        // Animate in
        setTimeout(() => {
            discussionElement.style.transition = 'all 0.3s ease';
            discussionElement.style.opacity = '1';
            discussionElement.style.transform = 'translateY(0)';
        }, 100);
        
        // Show toast notification
        this.showToast('New discussion posted!', 'info');
    }

    addNewRepliesToDOM(discussion, discussionElement) {
        const repliesContainer = discussionElement.querySelector('.replies-container');
        const currentReplies = discussionElement.querySelectorAll('.reply-item');
        
        // Add new replies
        discussion.replies.slice(currentReplies.length).forEach(reply => {
            const replyHTML = this.createReplyHTML(reply);
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = replyHTML;
            const replyElement = tempDiv.firstElementChild;
            
            // Add with animation
            replyElement.style.opacity = '0';
            replyElement.style.transform = 'translateX(-20px)';
            
            repliesContainer.appendChild(replyElement);
            
            setTimeout(() => {
                replyElement.style.transition = 'all 0.3s ease';
                replyElement.style.opacity = '1';
                replyElement.style.transform = 'translateX(0)';
            }, 100);
        });
        
        // Update reply count
        const replyCountElement = discussionElement.querySelector('.reply-count');
        if (replyCountElement) {
            replyCountElement.textContent = `${discussion.replies.length} replies`;
        }
        
        // Show toast notification
        this.showToast('New reply posted!', 'info');
    }

    createDiscussionHTML(discussion) {
        return `
            <div class="discussion-item" data-discussion-id="${discussion.id}">
                <div class="discussion-header">
                    <div class="discussion-user">
                        <div class="user-avatar">${discussion.user.charAt(0).toUpperCase()}</div>
                        <div class="user-info">
                            <div class="user-name">${discussion.user}</div>
                            <div class="discussion-time">${discussion.created_at}</div>
                        </div>
                    </div>
                    ${discussion.is_question ? '<span class="question-badge">Question</span>' : ''}
                </div>
                <div class="discussion-content">
                    <h4 class="discussion-title">${discussion.title}</h4>
                    <p class="discussion-text">${discussion.content}</p>
                </div>
                <div class="discussion-actions">
                    <button class="btn-reply" data-discussion-id="${discussion.id}">
                        <i class="fas fa-reply"></i> Reply
                    </button>
                    <span class="reply-count">${discussion.replies.length} replies</span>
                </div>
                <div class="replies-container">
                    ${discussion.replies.map(reply => this.createReplyHTML(reply)).join('')}
                </div>
            </div>
        `;
    }

    createReplyHTML(reply) {
        return `
            <div class="reply-item">
                <div class="reply-user">
                    <div class="user-avatar small">${reply.user.charAt(0).toUpperCase()}</div>
                    <div class="user-info">
                        <div class="user-name">${reply.user}</div>
                        <div class="reply-time">${reply.created_at}</div>
                    </div>
                </div>
                <div class="reply-content">
                    <p>${reply.content}</p>
                </div>
            </div>
        `;
    }

    getCurrentLessonId() {
        const lessonElement = document.querySelector('[data-lesson-id]');
        return lessonElement ? lessonElement.dataset.lessonId : null;
    }

    getCurrentCourseSlug() {
        const courseElement = document.querySelector('[data-course-slug]');
        return courseElement ? courseElement.dataset.courseSlug : null;
    }

    toggleNotificationDropdown() {
        let dropdown = document.getElementById('notificationDropdown');
        
        if (!dropdown) {
            dropdown = this.createNotificationDropdown();
            document.body.appendChild(dropdown);
        }
        
        dropdown.classList.toggle('show');
        
        if (dropdown.classList.contains('show')) {
            this.positionDropdown(dropdown);
        }
    }

    createNotificationDropdown() {
        const dropdown = document.createElement('div');
        dropdown.id = 'notificationDropdown';
        dropdown.className = 'notification-dropdown';
        dropdown.innerHTML = `
            <div class="notification-header">
                <h3>Notifications</h3>
                <button class="mark-all-read-btn">Mark all as read</button>
            </div>
            <div class="notification-list" id="notificationList">
                <!-- Notifications will be rendered here -->
            </div>
        `;
        return dropdown;
    }

    positionDropdown(dropdown) {
        const btn = document.getElementById('notificationBtn');
        const rect = btn.getBoundingClientRect();
        
        dropdown.style.position = 'fixed';
        dropdown.style.top = (rect.bottom + 10) + 'px';
        dropdown.style.right = (window.innerWidth - rect.right) + 'px';
        dropdown.style.zIndex = '9999';
    }

    renderNotifications() {
        const notificationList = document.getElementById('notificationList');
        if (!notificationList) return;

        if (this.notifications.length === 0) {
            notificationList.innerHTML = '<div class="no-notifications">No notifications yet</div>';
            return;
        }

        notificationList.innerHTML = this.notifications.map(notification => `
            <div class="notification-item ${notification.is_read ? 'read' : 'unread'}" 
                 data-notification-id="${notification.id}" 
                 data-action-url="${notification.action_url || ''}">
                <div class="notification-icon">
                    <i class="fas ${this.getNotificationIcon(notification.type)}"></i>
                </div>
                <div class="notification-content">
                    <div class="notification-title">${notification.title}</div>
                    <div class="notification-message">${notification.message}</div>
                    <div class="notification-time">${notification.time_ago}</div>
                </div>
                ${!notification.is_read ? '<div class="unread-indicator"></div>' : ''}
            </div>
        `).join('');
    }

    getNotificationIcon(type) {
        const icons = {
            'discussion_reply': 'fa-reply',
            'discussion_new': 'fa-comments',
            'course_announcement': 'fa-bullhorn',
            'course_update': 'fa-book',
            'assignment_due': 'fa-clock',
            'certificate_earned': 'fa-certificate'
        };
        return icons[type] || 'fa-bell';
    }

    updateNotificationBadge() {
        const badge = document.querySelector('#notificationBtn .badge');
        if (badge) {
            if (this.notificationCount > 0) {
                badge.textContent = this.notificationCount > 99 ? '99+' : this.notificationCount;
                badge.style.display = 'block';
            } else {
                badge.style.display = 'none';
            }
        }
    }

    async markAsRead(notificationId) {
        try {
            const response = await fetch(`/courses/notifications/${notificationId}/read/`, {
                method: 'POST',
                headers: {
                    'X-CSRFToken': this.getCSRFToken(),
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                // Update local state
                const notification = this.notifications.find(n => n.id == notificationId);
                if (notification && !notification.is_read) {
                    notification.is_read = true;
                    this.notificationCount--;
                    this.updateNotificationBadge();
                    this.renderNotifications();
                }
            }
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    }

    async markAllAsRead() {
        try {
            const response = await fetch('/courses/notifications/mark-all-read/', {
                method: 'POST',
                headers: {
                    'X-CSRFToken': this.getCSRFToken(),
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                // Update local state
                this.notifications.forEach(n => n.is_read = true);
                this.notificationCount = 0;
                this.updateNotificationBadge();
                this.renderNotifications();
                
                this.showToast('All notifications marked as read', 'success');
            }
        } catch (error) {
            console.error('Error marking all notifications as read:', error);
        }
    }

    showNewNotificationToast() {
        this.showToast('You have new notifications!', 'info');
    }

    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <div class="toast-content">
                <i class="fas ${type === 'success' ? 'fa-check' : type === 'error' ? 'fa-times' : 'fa-info'}"></i>
                <span>${message}</span>
            </div>
        `;

        document.body.appendChild(toast);

        // Animate in
        setTimeout(() => toast.classList.add('show'), 100);

        // Remove after 3 seconds
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => document.body.removeChild(toast), 300);
        }, 3000);
    }

    playNotificationSound() {
        // Create a subtle notification sound
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);

        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.2);
    }

    getCSRFToken() {
        return document.querySelector('[name=csrfmiddlewaretoken]')?.value || 
               document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';
    }
}

// Initialize notification system when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Remove any existing notification event listeners to prevent conflicts
    const notificationBtn = document.getElementById('notificationBtn');
    if (notificationBtn) {
        // Clone the button to remove all existing event listeners
        const newBtn = notificationBtn.cloneNode(true);
        notificationBtn.parentNode.replaceChild(newBtn, notificationBtn);
    }
    
    if (document.body.dataset.userAuthenticated === 'true') {
        window.notificationSystem = new NotificationSystem();
    }
});
