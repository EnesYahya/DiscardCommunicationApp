const { NotificationType } = require('./enums');

class Notification {
    constructor() {
        this.id = String();
        this.recipient = null; // User reference
        this.type = NotificationType.MESSAGE;
        this.message = String();
        this.timestamp = new Date();
    }

    sendNotification(user, message) {
        this.recipient = user;
        this.message = message;
    }

    markAsRead() {
        // Implementation needed
    }
}

module.exports = Notification; 