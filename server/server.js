const express = require('express');
const path = require('path');
const app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var bodyParser = require('body-parser');

const userDB = require('./ds/userDB');
const quizDB = require('./ds/quizDB')
const only42 = require('./bots/only42');
const fiftyfifty = require('./bots/fiftyfifty');

const config = require('./config');
let questionTimer = null;

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

  if( userDB.getUser(user)) {
    res.status(409).send(`${user} already exists.`);
    return;
  }
  userDB.addUser(user);
  res.send( { scores: userDB.sortUserList(), currentQuestion: quizDB.current() });
})




io.on('connection', (socket) => {

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });

  socket.on('answer', (msg) => {
    const currentQ = quizDB.current();;
    if(!currentQ) {
      console.warn('got an answer to an unknown question', msg); 
    } else if (!userDB.getUser(msg.user)) {
      console.warn('got an answer from an unknown user', msg);
    } 
    
    const duration = new Date() - currentQ.dt;
    console.log(`User ${msg.user} took ${duration} ms to answer.`);
    if(`${msg.answer}` === `${currentQ.answer}`) {
      socket.emit('answer result', 'correct');
      userDB.incrementScore(msg.user);
      io.emit('user answer', { user: msg.user, duration, result: true})
      io.emit('user list', userDB.sortUserList());
    } else {
      io.emit('user answer', { user: msg.user, duration, result: false})
      io.emit('user list', userDB.sortUserList());
      socket.emit('answer result', 'wrong');
    }
  }); 

  const handleBotAnswer = (userAnswer) => {
    console.log('I should be sending user answer: ', userAnswer);
    io.emit('user answer', userAnswer);
    io.emit('user list', userDB.sortUserList());
  }

  const mainQuestionThread = () => {
      console.log('in the main thread', config)
      if(quizDB.isComplete()) {
        const q = quizDB.loadQuestion();
        console.log('sending question', process.env.NODE_ENV)
        io.emit( 'question', {...q, answer: null });
        only42.ask(q, handleBotAnswer);
        fiftyfifty.ask(q, handleBotAnswer);
        setTimeout(() => {
          console.log('sending scene change')
          io.emit('scene change', {scene: 'intermission'})
        }, config.questionTime)
      }
      else {
        quizDB.reset();
        console.log('quiz over');
        io.emit( 'quiz over', userDB.sortUserList());
        clearInterval(questionTimer);
        setTimeout(() => {
            userDB.resetScores();
            io.emit('user list', userDB.sortUserList());
            questionTimer = setInterval(mainQuestionThread, config.questionTime + config.intermissionLength);
        }, config.gameResetTime);
      }
    };

  if(!questionTimer) {
    console.log('starting the quiz')
    questionTimer = setInterval( mainQuestionThread, config.questionTime + config.intermissionLength);
    only42.startQuiz(userDB, quizDB);
    fiftyfifty.startQuiz(userDB, quizDB);
  }

  socket.emit(quizDB.current());

});



const port = process.env.PORT || 8080;

http.listen(port, () => {
  console.log('listening on *:' + port);
});
