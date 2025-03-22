const { StatusType } = require('./enums');

class Status {
    constructor() {
        this.user = null; // User reference
        this.statusType = StatusType.OFFLINE;
        this.customMessage = String();
    }

    setStatus(newStatus, message) {
        this.statusType = newStatus;
        this.customMessage = message;
    }
}

module.exports = Status; 