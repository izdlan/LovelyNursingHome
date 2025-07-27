// Custom Notification System
class NotificationSystem {
    constructor() {
        this.notifications = [];
        this.notificationId = 0;
    }

    show(message, type = 'success', duration = 3000) {
        const id = ++this.notificationId;
        const notification = this.createNotification(message, type, id);
        
        // Add to page
        document.body.appendChild(notification);
        this.notifications.push({ id, element: notification });

        // Animate in
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateY(0)';
        }, 10);

        // Auto remove after duration
        setTimeout(() => {
            this.remove(id);
        }, duration);

        return id;
    }

    createNotification(message, type, id) {
        const notification = document.createElement('div');
        notification.id = `notification-${id}`;
        
        // Base styles
        const baseStyles = `
            position: fixed;
            top: 80px;
            left: 50%;
            transform: translateX(-50%) translateY(-20px);
            background: linear-gradient(90deg, #3578c7 0%, #004080 100%);
            color: #fff;
            padding: 16px 32px;
            border-radius: 8px;
            font-weight: 600;
            font-size: 1.1rem;
            box-shadow: 0 2px 8px rgba(53,120,199,0.13);
            z-index: 2000;
            opacity: 0;
            transition: all 0.3s ease;
            max-width: 90vw;
            text-align: center;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        `;

        // Type-specific styles
        let typeStyles = '';
        switch (type) {
            case 'error':
                typeStyles = `
                    background: linear-gradient(90deg, #e53935 0%, #c62828 100%);
                    box-shadow: 0 2px 8px rgba(229,57,53,0.13);
                `;
                break;
            case 'warning':
                typeStyles = `
                    background: linear-gradient(90deg, #ff9800 0%, #f57c00 100%);
                    box-shadow: 0 2px 8px rgba(255,152,0,0.13);
                `;
                break;
            case 'info':
                typeStyles = `
                    background: linear-gradient(90deg, #2196f3 0%, #1976d2 100%);
                    box-shadow: 0 2px 8px rgba(33,150,243,0.13);
                `;
                break;
            default: // success
                typeStyles = `
                    background: linear-gradient(90deg, #3578c7 0%, #004080 100%);
                    box-shadow: 0 2px 8px rgba(53,120,199,0.13);
                `;
        }

        notification.style.cssText = baseStyles + typeStyles;
        notification.textContent = message;

        // Add close button
        const closeBtn = document.createElement('span');
        closeBtn.innerHTML = '×';
        closeBtn.style.cssText = `
            position: absolute;
            top: 8px;
            right: 12px;
            cursor: pointer;
            font-size: 18px;
            font-weight: bold;
            opacity: 0.8;
            transition: opacity 0.2s;
        `;
        closeBtn.onmouseover = () => closeBtn.style.opacity = '1';
        closeBtn.onmouseout = () => closeBtn.style.opacity = '0.8';
        closeBtn.onclick = () => this.remove(id);
        
        notification.appendChild(closeBtn);

        return notification;
    }

    remove(id) {
        const notificationIndex = this.notifications.findIndex(n => n.id === id);
        if (notificationIndex === -1) return;

        const notification = this.notifications[notificationIndex].element;
        
        // Animate out
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(-50%) translateY(-20px)';
        
        // Remove from DOM after animation
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
            this.notifications.splice(notificationIndex, 1);
        }, 300);
    }

    removeAll() {
        this.notifications.forEach(n => this.remove(n.id));
    }
}

// Global notification instance
window.notifications = new NotificationSystem();

// Replace browser alert with custom notification
window.alert = function(message) {
    window.notifications.show(message, 'info', 4000);
};

// Helper functions for different notification types
window.showSuccess = function(message, duration = 3000) {
    return window.notifications.show(message, 'success', duration);
};

window.showError = function(message, duration = 4000) {
    return window.notifications.show(message, 'error', duration);
};

window.showWarning = function(message, duration = 4000) {
    return window.notifications.show(message, 'warning', duration);
};

window.showInfo = function(message, duration = 3000) {
    return window.notifications.show(message, 'info', duration);
};

// Custom confirm dialog
window.confirm = function(message) {
    return new Promise((resolve) => {
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: rgba(0,0,0,0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 3000;
        `;

        const modal = document.createElement('div');
        modal.style.cssText = `
            background: white;
            padding: 30px;
            border-radius: 12px;
            box-shadow: 0 4px 24px rgba(0,0,0,0.15);
            max-width: 400px;
            width: 90vw;
            text-align: center;
        `;

        modal.innerHTML = `
            <h3 style="margin: 0 0 20px 0; color: #333; font-size: 1.2rem;">Confirm Action</h3>
            <p style="margin: 0 0 25px 0; color: #666; line-height: 1.5;">${message}</p>
            <div style="display: flex; gap: 12px; justify-content: center;">
                <button id="confirm-yes" style="
                    background: linear-gradient(90deg, #3578c7 0%, #004080 100%);
                    color: white;
                    border: none;
                    padding: 12px 24px;
                    border-radius: 6px;
                    cursor: pointer;
                    font-weight: 600;
                    font-size: 1rem;
                ">Yes</button>
                <button id="confirm-no" style="
                    background: #e0e7ef;
                    color: #3578c7;
                    border: none;
                    padding: 12px 24px;
                    border-radius: 6px;
                    cursor: pointer;
                    font-weight: 600;
                    font-size: 1rem;
                ">No</button>
            </div>
        `;

        overlay.appendChild(modal);
        document.body.appendChild(overlay);

        const handleYes = () => {
            document.body.removeChild(overlay);
            resolve(true);
        };

        const handleNo = () => {
            document.body.removeChild(overlay);
            resolve(false);
        };

        modal.querySelector('#confirm-yes').onclick = handleYes;
        modal.querySelector('#confirm-no').onclick = handleNo;
        overlay.onclick = (e) => {
            if (e.target === overlay) {
                handleNo();
            }
        };

        // Handle Enter and Escape keys
        const handleKey = (e) => {
            if (e.key === 'Enter') {
                handleYes();
            } else if (e.key === 'Escape') {
                handleNo();
            }
        };
        document.addEventListener('keydown', handleKey);
        
        // Clean up event listener when modal is closed
        const cleanup = () => {
            document.removeEventListener('keydown', handleKey);
        };
        overlay.addEventListener('remove', cleanup);
    });
}; 