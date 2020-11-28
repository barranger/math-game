const defaults = {
  questionCount: 10,
  questionTime: 5000,
  intermissionLength: 3000,
  gameResetTime: 10000,
};
let overrides = {};
if(process.env.NODE_ENV) {
  overrides = require(`./config-${process.env.NODE_ENV}`);
}

module.exports = { ...defaults, ...overrides };
