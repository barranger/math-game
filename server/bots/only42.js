const userName = "Only 42 Bot";
let userDB = null;

const ask = (q, cb) => {
  //get random time to answer
  //set timeout 
  // answer with 42

  const result = q.answer === 42;

  setTimeout(() => {
    if(result) {
      userDB.incrementScore(userName);
    }
    cb({user: userName, result, duration: 2500});
  }, 2000)
} 

const startQuiz = (udb) => {
  userDB = udb;

  userDB.addUser(userName);
};

module.exports = {
  ask,
  startQuiz,
}
