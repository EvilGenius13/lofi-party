const express = require('express');
const sockets = require('./sockets/sockets');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
  res.render('landing', { username: null });
});

app.post('/', (req, res) => {
  const username = req.body.username;
  res.render('index', { username });
});

app.get('/room/:code', (req, res) => {
  const roomCode = req.params.code;
  res.render('index', { username: null, roomCode });
});

io.on('connection', (socket) => {
  require('./sockets/sockets')(io, socket);
});

server.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});