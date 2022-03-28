const bcrypt = require("bcrypt");

const encrypt = (password) => {
  return bcrypt.hash(password, 10);
};

module.exports = { encrypt };
