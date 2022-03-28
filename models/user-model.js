const { default: mongoose } = require("mongoose");
const { encrypt } = require("../utils/encrypt");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    require: true,
    unique: true,
  },

  fName: {
    type: String,
    required: true,
  },

  lName: {
    type: String,
  },

  password: {
    type: String,
    required: true,
  },

  verification_code: {
    type: String,
    required: true,
  },

  verified: {
    type: Boolean,
  },

  reset_password_token: {
    type: String,
  },

  role: {
    type: String,
  },
});

userSchema.pre("save", async function (next) {
  this.password = await encrypt(this.password);
  next();
});

const User = new mongoose.model("user", userSchema);

module.exports = { User };
