class Message {
    constructor() {
        this.id = String();
        this.sender = null; // User reference
        this.channel = null; // Channel reference
        this.content = String();
        this.timestamp = new Date();
    }

    editMessage(newContent) {
        this.content = newContent;
    }

    deleteMessage() {
        if (this.channel) {
            this.channel.deleteMessage(this);
        }
    }
}

module.exports = Message; 