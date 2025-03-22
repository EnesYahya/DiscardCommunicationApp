const StatusType = {
    ONLINE: 'ONLINE',
    OFFLINE: 'OFFLINE',
    IDLE: 'IDLE',
    DO_NOT_DISTURB: 'DO_NOT_DISTURB'
};

const ChannelType = {
    TEXT: 'TEXT',
    VOICE: 'VOICE'
};

const NotificationType = {
    MESSAGE: 'MESSAGE',
    FRIEND_REQUEST: 'FRIEND_REQUEST',
    MENTION: 'MENTION'
};

const RequestStatus = {
    PENDING: 'PENDING',
    ACCEPTED: 'ACCEPTED',
    REJECTED: 'REJECTED'
};

module.exports = {
    StatusType,
    ChannelType,
    NotificationType,
    RequestStatus
}; 