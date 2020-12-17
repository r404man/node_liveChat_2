const users = [];

function joinUsers(id, username, room) {
    let user = {
        id,
        username,
        room,
    };
    users.push(user);
}

function getCurrentUser(id) {
    return users.find(user => user.id == id);
}

function getRoomUsers(room) {
    return users.filter(user => user.room == room);
}

function disconnectUsers(id) {
    let userId = users.findIndex(user => user.id == id);
    users.splice(userId, 1)[0];
}

module.exports = {
    joinUsers,
    disconnectUsers,
    getCurrentUser,
    getRoomUsers,
}