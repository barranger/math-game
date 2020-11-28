const config = require('../config');
let currentQuestions = [];
const operations = [ '+', '-', '/', '*'];

const loadQuestion = () => {   
  const q = {};
  while(!Number.isInteger(q.answer)) {
    q.title = `Question Number #${currentQuestions.length + 1}`;
    q.left = Math.round(Math.random() * 9);
    q.right = Math.round(Math.random() * 9);
    q.operation = operations[Math.round(Math.random() * 3)];
    // eslint-disable-next-line no-eval
    q.answer = eval(`${q.left}${q.operation}${q.right}`);
    q.dt = new Date();
  };

  currentQuestions.push(q);
  return q;
}

const reset = () => { currentQuestions = []; };

const current = () =>  currentQuestions[currentQuestions.length - 1];

const isComplete = () => currentQuestions.length < config.questionCount;

module.exports = {
  current,
  isComplete,
  loadQuestion,
  reset,
};