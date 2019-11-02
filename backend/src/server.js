const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const routes = require('./routes');

const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

const connectedUsers = {};

io.on('connection', socket => {
  const { user } = socket.handshake.query;
  console.log("user",user)

  connectedUsers[user] = socket.id
})

mongoose.connect('mongodb+srv://marcosapj2:juniorjack@cluster0-cy3r6.mongodb.net/omnistack?retryWrites=true&w=majority', {
  useNewUrlParser: true
});

app.use((req, res, next) => {
  req.io = io;
console.log("connectedUsers",connectedUsers)

  req.connectedUsers = connectedUsers;

  return next()
})

app.use(cors());
app.use(express.json());
app.use(routes);

server.listen(3333);
