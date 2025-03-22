const { RequestStatus } = require('./enums');

class FriendRequest {
    constructor() {
        this.id = String();
        this.sender = null; // User reference
        this.receiver = null; // User reference
        this.status = RequestStatus.PENDING;
    }

    acceptRequest() {
        this.status = RequestStatus.ACCEPTED;
        if (this.sender && this.receiver) {
            this.sender.friends.add(this.receiver);
            this.receiver.friends.add(this.sender);
        }
    }

    rejectRequest() {
        this.status = RequestStatus.REJECTED;
    }
}

module.exports = FriendRequest; 