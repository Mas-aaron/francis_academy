// Immediate fix for notification alert issue
(function() {
    // Override alert function temporarily to prevent notification alerts
    const originalAlert = window.alert;
    window.alert = function(message) {
        if (message && message.includes('Notifications feature coming soon')) {
            console.log('Blocked old notification alert:', message);
            return;
        }
        return originalAlert.call(this, message);
    };
    
    // Restore alert after 5 seconds
    setTimeout(() => {
        window.alert = originalAlert;
    }, 5000);
    
    // Remove any existing click handlers on notification button
    document.addEventListener('DOMContentLoaded', function() {
        const notificationBtn = document.getElementById('notificationBtn');
        if (notificationBtn) {
            // Remove all event listeners by cloning the element
            const newBtn = notificationBtn.cloneNode(true);
            notificationBtn.parentNode.replaceChild(newBtn, notificationBtn);
            console.log('Notification button event listeners cleared');
        }
    });
})();
