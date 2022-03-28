const Validator = require("fastest-validator");
const v = new Validator();

const registerSchema = {
  email: { type: "email", require: true },
  fName: { type: "string", max: 20, require: true },
  lName: { type: "string", max: 20 },
  password: { type: "string", min: 5, max: 15, require: true },
  confirmPassword: { type: "string", min: 5, max: 15, require: true },
};

const checkRegister = v.compile(registerSchema);

module.exports = { checkRegister };
