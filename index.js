const http = require('http');
const express = require('express');
const cors = require('cors');
const socketIo = require('socket.io');

const app = express();
const port = process.env.PORT;
const users = [{}];

app.use(cors());
app.get('/', (req, res) => {
  res.send('Its working');
});

const server = http.createServer(app);

const io = socketIo(server);

io.on('connection', (socket) => {
  // console.log('new connection');

  socket.on('joined', ({ user }) => {
    users[socket.id] = user;
    socket.broadcast.emit('userJoined', {
      user: 'Admin',
      message: `${users[socket.id]} has joined`,
    });

    socket.emit('welcome', {
      user: 'Admin',
      message: `Welcome ${users[socket.id]} to the chat.`,
    });
  });

  socket.on('message',({message,id})=>{
    io.emit('sendmessage',{user:users[id],message,id})
    // console.log(message,users[id])
  })

  socket.on('disconnected',()=>{
    socket.broadcast.emit('leave',{user:"Admin",message:`${users[socket.id]} has left`})
    // console.log(`${users[socket.id]} left`)
  })
});

server.listen(port, () => {
  console.log(`server is working fine http://localhost:${port}`);
});
