const jwt = require("jsonwebtoken");

const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.secretKey);
  } catch (err) {
    console.log(err);
  }
};

module.exports = { verifyToken };
