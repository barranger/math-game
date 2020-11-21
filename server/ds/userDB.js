const userList = {};

const sortUserList = () => {
  let toSend = Object.keys(userList).map(key => userList[key]);
  toSend = toSend.sort((a,b)=> a.score < b.score ? 1 : -1);
  return toSend;
}

const getUser = (user) => {
  return Object.keys(userList).findIndex( key => key.toLowerCase() === user.toLowerCase() ) !== -1;
}

const addUser = (user) => {
  userList[user] = {user, score: 0};
  console.log('user list is now', userList);
}

const incrementScore = (user, amt = 1) => {
  userList[user].score += amt;
}

const resetScores = () => {
  for (const user in userList) {
    userList[user].score = 0;
  }
}

module.exports = {
  addUser,
  getUser,
  incrementScore,
  resetScores,
  sortUserList,
};
