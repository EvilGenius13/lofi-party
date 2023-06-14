const onlineUsers = {}; // Object to store online users in each room

module.exports = (io, socket) => {
  console.log(`User connected, ${socket.id}`);

  socket.on('disconnect', () => {
    console.log(`User disconnected, ${socket.id}`);
    removeUserFromRoom(socket.id); // Remove user from the room
    sendOnlineUsersUpdate(socket.roomCode);
  });

  socket.on('join room', (roomCode) => {
    socket.join(roomCode);
    console.log(`User ${socket.id} joined room ${roomCode}`);
    socket.roomCode = roomCode; // Assign the room code to the socket
    addUserToRoom(socket.id, socket.username, roomCode); // Add user to the room
    sendOnlineUsersUpdate(roomCode);
  });

  socket.on('new user', (data) => {
    console.log(`New user: ${data.username}`);
    socket.username = data.username; // Assign username to the socket
    socket.usernameColor = data.color; // Assign color to the socket
    addUserToRoom(socket.id, data.username, socket.roomCode); // Add user to the room
    sendOnlineUsersUpdate(socket.roomCode);
  });

  socket.on('new message', (data) => {
    console.log(`${data.sender}: ${data.message}`);
    console.log(`Room code: ${data.roomCode}`);
    io.to(data.roomCode).emit('new message', data);
  });

  function addUserToRoom(userId, username, roomCode, color) {
    if (!onlineUsers[roomCode]) {
      onlineUsers[roomCode] = {};
    }
    onlineUsers[roomCode][userId] = {
      username,
      color: socket.usernameColor
    };
  }

  function removeUserFromRoom(userId) {
    if (socket.roomCode && onlineUsers[socket.roomCode]) {
      delete onlineUsers[socket.roomCode][userId];
    }
  }

  function sendOnlineUsersUpdate(roomCode) {
    if (roomCode && onlineUsers[roomCode]) {
      io.to(roomCode).emit('online users update', onlineUsers[roomCode]);
    }
  }
};
