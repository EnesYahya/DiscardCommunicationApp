const { StatusType } = require('./enums');

class User {
    constructor() {
        this.id = String();
        this.username = String();
        this.email = String();
        this.password = String();
        this.profileImage = String();
        this.status = StatusType.OFFLINE;
        this.friends = new Set();
        this.servers = [];
    }

    register(email, username, password) {
        this.email = email;
        this.username = username;
        this.password = password;
    }

    login(email, password) {
        return false; // Implementation needed
    }

    sendFriendRequest(user) {
        // Implementation needed
    }

    acceptFriendRequest(user) {
        // Implementation needed
    }

    removeFriend(user) {
        // Implementation needed
    }

    changeStatus(newStatus) {
        this.status = newStatus;
    }

    updateUsername(newUsername) {
        this.username = newUsername;
    }

    updateEmail(newEmail) {
        this.email = newEmail;
    }

    updatePassword(newPassword) {
        this.password = newPassword;
    }

    updateProfileImage(newImage) {
        this.profileImage = newImage;
    }
}

module.exports = User; 