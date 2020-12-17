const socket = io();

const chatForm = document.getElementById('chat-form');
const messageList = document.getElementById('message-list');
const roomName = document.getElementById('room');
const userCounter = document.getElementById('users');

// Initialize the users
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true });
socket.emit('joinRoom', ({ username, room }));
roomName.innerText = `_ ${room}`;

//Output users in room 
socket.on("userCounter", (users) => {
    outputUserList(users);
});

// Message initialize 
socket.on("message", (message) => {
    let msg = document.createElement('div');
    // Message user
    let msgSender = document.createElement('div');
    msgSender.classList.add('msgSender');
    msgSender.innerText = `${message.username}:`;

    // Message text
    let msgText = document.createElement('div');
    msgText.classList.add('msgText');
    msgText.innerText = message.text;

    msg.classList.add('message');

    if (message.username == "TrevorBot") {
        msgSender.style.color = 'red';
    }

    messageList.appendChild(msg);
    msg.append(msgSender);
    msg.appendChild(msgText);
});


chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let message = e.target.elements.message.value

    // Users message to the server
    socket.emit('chatMessage', message);
    
    let inputMsg = document.getElementById('message');
    inputMsg.value = " ";
    inputMsg.focus();

});

function outputUserList(users) {
    userCounter.innerHTML = `${users.map(user => `<li>${user.username}`).join("")}`;
}