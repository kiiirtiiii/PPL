const jwt = require("jsonwebtoken");

const createToken = (payload) => {
  const token = jwt.sign(payload, process.env.secretKey, { expiresIn: "1d" });

  return token;
};

module.exports = { createToken };
