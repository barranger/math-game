const express = require('express');
// const bodyParser = require('body-parser')
const path = require('path');
const app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

const userList = {};

app.use(express.static(path.join(__dirname, 'build')));

app.get('/ping', function (req, res) {
 return res.send('pong');
});

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const sortUserList = () => {
  let toSend = Object.keys(userList).map(key => userList[key]);
  toSend = toSend.sort((a,b)=> a.score < b.score ? 1 : -1);
  return toSend;
}

io.on('connection', function(socket){
  console.log('we are connected')
  socket.emit('user list', sortUserList());

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });

  socket.on('correct answer', function(msg) {
    userList[msg.user] = msg;
    io.emit('user list', sortUserList());
    console.log('got back answer', msg);
    io.emit('correct answer', msg);
  });
});


const port = process.env.PORT || 8080;

http.listen(port, function(){
  console.log('listening on *:' + port);
});

//app.listen(process.env.PORT || 8080);