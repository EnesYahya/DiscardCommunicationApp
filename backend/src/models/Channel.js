const { ChannelType } = require('./enums');
const Message = require('./Message');

class Channel {
    constructor() {
        this.id = String();
        this.name = String();
        this.type = ChannelType.TEXT;
        this.server = null; // Server reference
        this.messages = [];
    }

    sendMessage(user, content) {
        const message = new Message();
        message.sender = user;
        message.content = content;
        message.channel = this;
        this.messages.push(message);
        return message;
    }

    deleteMessage(message) {
        const index = this.messages.indexOf(message);
        if (index > -1) {
            this.messages.splice(index, 1);
        }
    }
}

module.exports = Channel; 