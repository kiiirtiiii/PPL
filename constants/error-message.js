const passwordNotSame = {
  err: new Error("Both passwords does not match"),
  status: 406,
};

const userNotVerified = {
  err: new Error("User not verified"),
  status: 401,
};

const userNotFound = {
  err: new Error("User not found"),
  status: 406,
};

const wrongPassword = {
  err: new Error("Wrong password"),
  status: 406,
};

const invalidEmail = {
  err: new Error("Invalid email"),
  status: 406,
};

const unmatchedToken = {
  err: new Error("Token does not match"),
  status: 401,
};

const fileNotSelect = {
  err: new Error("File not selected"),
  status: 406,
};

const postNotFound = {
  err: new Error("Post not found"),
  status: 404,
};

module.exports = {
  passwordNotSame,
  userNotVerified,
  userNotFound,
  wrongPassword,
  invalidEmail,
  unmatchedToken,
  fileNotSelect,
  postNotFound,
};
