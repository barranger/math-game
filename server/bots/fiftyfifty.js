const userName = "50 - 50 Bot";
let userDB = null;

const ask = (q, cb) => {
  //get random time to answer
  //set timeout 
  // answer with 42

  const result = Math.floor(Math.random() * Math.floor(2)) === 0;

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
