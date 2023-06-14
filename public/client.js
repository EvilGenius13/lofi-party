$(document).ready(() => {
  const socket = io();
  let currentUser;
  let currentUserColor = '#000000';
  let roomCode;

  $('#username-button').click((e) => {
    e.preventDefault();
    const username = $('#username-input').val().trim();
    roomCode = $('#room-code').data('room-code');
    if (username.length > 0 && roomCode.length > 0) {
      currentUser = username;
      currentUserColor = $('#color-input').val();
      socket.emit('join room', roomCode);
      socket.emit('new user', { 
        username, 
        color: currentUserColor,
        roomCode
       });
      $('.username-form').remove();
    }
  });

  $('#chat-input').keydown((e) => {
    if (e.keyCode === 13) {
      e.preventDefault();
      sendMessage();
    }
  });

  $('#chat-button').click((e) => {
    e.preventDefault();
    sendMessage();
  });

  function sendMessage() {
    const message = $('#chat-input').val().trim();
    if (message.length > 0) {
      socket.emit('new message', {
        sender: currentUser,
        message: message,
        color: currentUserColor,
        roomCode: roomCode
      });
      $('#chat-input').val('');
    }
  };

  socket.on('new user', (user) => {
    console.log(`${user.username} has joined the chat!`);
    if (user.roomCode === roomCode) {
      $('#online-users').append(`<li style="color:${user.color}">🟢 ${user.username}</li>`);
    }
  });

  socket.on('new message', (data) => {
    console.log(`${data.sender}: ${data.message}`);
    $('#messages').append(`<li style="color:${data.color}"><strong>${data.sender}</strong>: ${data.message}</li>`);
    scrollToBottom();
  });

  socket.on('online users update', (onlineUsers) => {
    updateOnlineUsers(onlineUsers);
  });

  function updateOnlineUsers(onlineUsers) {
    $('#online-users').empty();
    $('#online-users').append('<h1>Online Users</h1>');
    $('#online-users').append(`<h3>Room Code: ${roomCode}</h3>`);
    for (const userId in onlineUsers) {
      const user = onlineUsers[userId];
      const username = user.username;
      const color = user.color;
      $('#online-users').append(`<li style="color:${color}">🟢 ${username}</li>`);
    }
  }

  function scrollToBottom() {
    $('#messages').scrollTop($('#messages')[0].scrollHeight);
  }
});
