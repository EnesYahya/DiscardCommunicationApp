const Channel = require('./Channel');

class Server {
    constructor() {
        this.id = String();
        this.name = String();
        this.owner = null; // User reference
        this.members = new Set();
        this.channels = new Set();
        this.roles = new Set();
    }

    addMember(user) {
        this.members.add(user);
    }

    removeMember(user) {
        this.members.delete(user);
    }

    createChannel(name, type) {
        const channel = new Channel();
        channel.name = name;
        channel.type = type;
        this.channels.add(channel);
        return channel;
    }

    assignRole(user, role) {
        // Implementation needed
    }
}

module.exports = Server; 