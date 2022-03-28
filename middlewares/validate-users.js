const { User } = require("../models/user-model");
const { checkRegister } = require("../utils/validation");

const validateUsers = async (req, res, next) => {
  try {
    const existingUser = await User.findOne({ email: req.body.email });

    if (existingUser) {
      const err = new Error("email-id already exists");
      err.status = 400;
      throw err;
    }

    const result = checkRegister({
      email: req.body.email,
      fName: req.body.fName,
      lName: req.body.lName,
      password: req.body.password,
      confirmPassword: req.body.confirmPassword,
    });

    if (result !== true) {
      const err = new Error(result[0].message);
      err.status = 400;
      throw err;
    }
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = { validateUsers };
