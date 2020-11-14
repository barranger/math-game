const express = require('express');
const path = require('path');
const app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var bodyParser = require('body-parser');

const QUESTION_COUNT = 10;
const QUESTION_TIME = 5000;
const INTERMISSION_LENGTH = 3000;
const GAME_RESET_TIME = 10000;

const userList = {};

app.use(express.static(path.join(__dirname, '..', 'build')));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'build', 'index.html'));
});

app.post('/register', (req, res) => {
  const { user } = req.body;

  console.log('we are registering', user);

  if(!user) {
    res.status(400).send("[user] is required");
    return;
  }

  if(Object.keys(userList).findIndex( key => key.toLowerCase() === user.toLowerCase() ) !== -1 ) {
    res.status(409).send(`${user} already exists.`);
    return;
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
    } 
    
    const duration = new Date() - currentQ.dt;
    console.log(`User ${msg.user} took ${duration} ms to answer.`);
    if(`${msg.answer}` === `${currentQ.answer}`) {
      socket.emit('answer result', 'correct');
      userList[msg.user].score++;
      io.emit('user answer', { user: msg.user, duration, result: true})
      io.emit('user list', sortUserList());
    } else {
      io.emit('user answer', { user: msg.user, duration, result: false})
      socket.emit('answer result', 'wrong');
    }
  }); 

  const mainQuestionThread = () => {
      console.log('in the main thread')
      if(currentQuestions.length < QUESTION_COUNT) {
        const q = loadQuestion(currentQuestions.length);
        currentQuestions.push(q);
        console.log('sending question')
        io.emit( 'question', {...q, answer: null });
        setTimeout(() => {
          console.log('sending scene change')
          io.emit('scene change', {scene: 'intermission'})
        }, QUESTION_TIME)
      }
      else {
        currentQuestions = [];
        console.log('quiz over');
        io.emit( 'quiz over', sortUserList());
        clearInterval(questionTimer);
        setTimeout(() => {
          if(userList) {
            for (const user in userList) {
              userList[user].score = 0;
            }
            io.emit('user list', sortUserList());
            questionTimer = setInterval(mainQuestionThread, QUESTION_TIME + INTERMISSION_LENGTH);
          }
        }, GAME_RESET_TIME);
      }
    };

  if(!questionTimer) {
    console.log('starting the quiz')
    questionTimer = setInterval( mainQuestionThread, QUESTION_TIME + INTERMISSION_LENGTH );
  }

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
    q.dt = new Date();
  };
  return q;
}


const port = process.env.PORT || 8080;

http.listen(port, () => {
  console.log('listening on *:' + port);
});
