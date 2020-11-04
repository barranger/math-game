const express = require('express');
const path = require('path');
const app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var bodyParser = require('body-parser');

const userList = {};

app.use(express.static(path.join(__dirname, 'build')));
app.use(bodyParser.json());

app.get('/ping', (req, res) => {
 return res.send('pong');
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.post('/register', (req, res) => {
  console.log('body', req.body);
  const { user } = req.body;
  userList[user] = { user, score: 0};
  console.log(`${user} registered, now we have`, userList);
  res.send(sortUserList());
})

const sortUserList = () => {
  let toSend = Object.keys(userList).map(key => userList[key]);
  toSend = toSend.sort((a,b)=> a.score < b.score ? 1 : -1);
  return toSend;
}

io.on('connection', (socket) => {
  console.log('we are connected')

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });

  socket.on('correct answer', (msg) => {
    userList[msg.user] = msg;
    io.emit('user list', sortUserList());
    console.log('got back answer', msg);
    io.emit('correct answer', msg);
  });
});


const port = process.env.PORT || 8080;

http.listen(port, () => {
  console.log('listening on *:' + port);
});
