const express = require('express');
const path = require('path');
const app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var bodyParser = require('body-parser');

const questionCount = 10;
const questionTime = 5000;
const gameResetTime = 10000;

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
  const { user } = req.body;
  if(userList[user]) {
    res.status(409).send(`${user} already exists.`);
  }
  userList[user] = { user, score: 0};
  res.send( { scores: sortUserList(), currentQuestion: currentQuestions[currentQuestions.length - 1] });
})

const sortUserList = () => {
  let toSend = Object.keys(userList).map(key => userList[key]);
  toSend = toSend.sort((a,b)=> a.score < b.score ? 1 : -1);
  return toSend;
}

let questionTimer = null;
let currentQuestions = [];

io.on('connection', (socket) => {

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });

  socket.on('correct answer', (msg) => {
    userList[msg.user] = msg;
    io.emit('user list', sortUserList());
    io.emit('correct answer', msg);
  });

  socket.on('answer', (msg) => {
    const currentQ = currentQuestions[currentQuestions.length - 1];
    if(!currentQ) {
      console.warn('got an answer to an unknown question', msg);
    } else if (!userList[msg.user]) {
      console.warn('got an answer from an unknown user', msg);
    } else if(`${msg.answer}` === `${currentQ.answer}`) {
      socket.emit('answer result', 'correct');
      userList[msg.user].score++;
      io.emit('user list', sortUserList());
    } else {
      socket.emit('answer result', 'wrong');
    }
  });

  const mainQuestionThread = () => {
      if(currentQuestions.length < questionCount) {
        const q = loadQuestion(currentQuestions.length);
        currentQuestions.push(q);
        io.emit( 'question', {...q, answer: null });
      }
      else {
        console.log('quiz over')
        currentQuestions = [];
        io.emit( 'quiz over', sortUserList());
        clearInterval(questionTimer);
        setTimeout(() => {
          console.log('I should be resetting things');
          if(userList) {
            for (const user in userList) {
              userList[user].score = 0;
            }
            io.emit('user list', sortUserList());
            questionTimer = setInterval(mainQuestionThread, questionTime);
          }
        }, gameResetTime);
      }
    };

  if(!questionTimer) {
    questionTimer = setInterval( mainQuestionThread, questionTime );
  }

  console.log('about to send current')
  socket.emit(currentQuestions[currentQuestions.length - 1]);

});

const operations = [ '+', '-', '/', '*'];

const loadQuestion = (qNumber) => {   
  const q = {};
  while(!Number.isInteger(q.answer)) {
    q.title = `Question Number #${qNumber + 1}`;
    q.left = Math.round(Math.random() * 9);
    q.right = Math.round(Math.random() * 9);
    q.operation = operations[Math.round(Math.random() * 3)];
    // eslint-disable-next-line no-eval
    q.answer = eval(`${q.left}${q.operation}${q.right}`);
  };
  return q;
}


const port = process.env.PORT || 8080;

http.listen(port, () => {
  console.log('listening on *:' + port);
});
