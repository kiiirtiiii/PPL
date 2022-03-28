const bcrypt = require("bcrypt");

const decrypt = (givenPass, hashedPass) => {
  try {
    return bcrypt.compare(givenPass, hashedPass);
  } catch (err) {
    throw new Error(err);
  }
};

module.exports = { decrypt };
