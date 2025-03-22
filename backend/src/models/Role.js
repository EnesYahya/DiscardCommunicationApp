class Role {
    constructor() {
        this.id = String();
        this.name = String();
        this.permissions = new Set();
    }

    addPermission(permission) {
        this.permissions.add(permission);
    }

    removePermission(permission) {
        this.permissions.delete(permission);
    }
}

module.exports = Role; 