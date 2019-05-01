const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const Moniker = require('moniker');

const app = express();
const server = http.Server(app);
const port = process.env.PORT || 3000;
const io = socketIO(server);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/client/index.html');
});

app.use(express.static('./client'));

server.listen(port, () => {
  console.log('listening on *:' + port);
});
const getConnectedClients = room => {
  const clients =
    io.sockets.adapter.rooms[room] === undefined
      ? []
      : io.sockets.adapter.rooms[room].sockets;
  const { connected } = io.sockets.clients();
  const users = Object.keys(clients).map(id => {
    const { username } = connected[id];
    return { username };
  });
  return users;
};

io.on('connection', socket => {
  socket.username = Moniker.choose();
  socket.room = 'general';

  socket.emit('name assigned', socket.username);
  socket.join(socket.room);

  socket.to(socket.room).emit('user joined', socket.username);
  io.to(socket.room).emit('users list', getConnectedClients(socket.room));

  socket.on('disconnect', () => {
    io.to(socket.room).emit('user left', socket.username);
    //io.in(socket.room).emit('users list', getConnectedClients(socket.room));
  });

  socket.on('chat message', message => {
    io.to(socket.room).emit('chat message', {
      name: socket.username,
      message: `${message}  ${new Date().toLocaleTimeString()}`
    });
  });

  socket.on('change room', nextRoom => {
    socket.leave(socket.room);
    socket.join(nextRoom);

    socket.to(socket.room).emit('user left', socket.username);
    socket.to(nextRoom).emit('user joined', socket.username);
    io.to(nextRoom).emit('users list', getConnectedClients(nextRoom));
    socket.to(socket.room).emit('users list', getConnectedClients(socket.room));
    console.log(nextRoom);
    socket.room = nextRoom;
    socket.emit('room changed', nextRoom);
  });

  socket.on('user typing', () => {
    socket.to(socket.room).emit('user typing', socket.username);
  });
});
