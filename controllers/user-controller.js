const { User } = require("../models/user-model");

const { createToken } = require("../auth/generate-tokens");
const { encrypt } = require("../utils/encrypt");
const { decrypt } = require("../utils/decrypt");

const randomstring = require("randomstring");
const { sendMail } = require("../utils/email-service");
const {
  registerEmailTemplate,
  forgetPassEmailTemplate,
} = require("../services/email-template");

const { verifyToken } = require("../auth/verify-tokens");
const { Post } = require("../models/post-model");

// User registration API
const registerUser = async (req, res, next) => {
  try {
    if (req.body.password !== req.body.confirmPassword) {
      const err = new Error("Both passwords does not match");
      err.status = 406;
      throw err;
    }

    const newUser = new User(req.body);

    // create a random verifation code for registered user
    newUser.verification_code = randomstring.generate();

    newUser.verified = false;
    await newUser.save();

    // create random token for registered user
    const token = await createToken({
      id: newUser._id,
      verification_code: newUser.verification_code,
    });

    // send successful registration mail using nodemailer
    const registrationEmail = registerEmailTemplate(
      req.body.email,
      req.body.fName,
      token
    );
    await sendMail(registrationEmail);

    res
      .status(200)
      .json({ success: true, result: "User registration successful" });
  } catch (err) {
    next(err);
  }
};

// User verification API
const verifyUser = async (req, res, next) => {
  try {
    const verifyUser = await verifyToken(req.params.token);

    const findVerifyUser = await User.findOne({ _id: verifyUser.id });

    if (findVerifyUser.verification_code !== verifyUser.verification_code) {
      const err = new Error("User is not verified. Try again");
      err.status = 401;
      throw err;
    }

    await User.updateOne(
      { _id: verifyUser.id },
      { verification_code: "", verified: true }
    );

    res.status(200).json({ success: true, result: "User verified" });
  } catch (err) {
    next(err);
  }
};

// User sign-in API
const signinUser = async (req, res, next) => {
  try {
    const foundUser = await User.findOne({ email: req.body.email });

    if (!foundUser) {
      const err = new Error("User does not exist");
      err.status = 406;
      throw err;
    }

    const result = await decrypt(req.body.password, foundUser.password);

    if (!result) {
      const err = new Error("Wrong Password");
      err.status = 406;
      throw err;
    }

    if (foundUser.verified !== true) {
      const err = new Error("User not verified");
      err.status = 401;
      throw err;
    }

    // generate new token for logged-in user
    const token = await createToken({
      id: foundUser._id,
      fName: foundUser.fName,
    });
    await res.status(200).json({
      success: true,
      token: token,
      result: "User sign-in successful",
    });
  } catch (err) {
    next(err);
  }
};

// Reverification mail API
const verifyEmail = async (req, res, next) => {
  try {
    const reverifiedUser = await User.findOne({ email: req.body.email });

    if (!reverifiedUser) {
      const err = new Error("Invalid Email");
      err.status = 406;
      throw err;
    }

    // create random token
    const token = await createToken({
      id: reverifiedUser._id,
      verification_code: reverifiedUser.verification_code,
    });

    // send verify user mail using nodemailer
    const registrationEmail = registerEmailTemplate(
      req.body.email,
      reverifiedUser.fName,
      token
    );
    await sendMail(registrationEmail);

    res.status(200).json({ success: true, result: "Verification email sent" });
  } catch (err) {
    next(err);
  }
};

// Forget Password API
const forgetPassword = async (req, res, next) => {
  try {
    // generate new token for forget-password user emailID
    const token = await createToken({
      email: req.body.email,
    });

    // send reset password mail using nodemailer
    const forgetPassEmail = forgetPassEmailTemplate(req.body.email, token);
    await sendMail(forgetPassEmail);

    res.status(200).json({
      success: true,
      token: token,
      result: "Reset password email sent to user",
    });
  } catch (err) {
    next(err);
  }
};

// Reset Password API
const resetPassword = async (req, res, next) => {
  try {
    // verify token
    const verifyUser = await verifyToken(req.params.token);

    if (!verifyUser) {
      const err = new Error("Token does not match");
      err.status = 401;
      throw err;
    }

    if (req.body.password !== req.body.confirmPassword) {
      const err = new Error("Both passwords does not match");
      err.status = 406;
      throw err;
    }

    const updatedPass = await encrypt(req.body.password);
    await User.findOneAndUpdate(
      { email: req.body.email },
      { password: updatedPass }
    );

    res
      .status(200)
      .json({ success: true, result: "Password reset sucessfully" });
  } catch (err) {
    next(err);
  }
};

// my-profile API
const showProfile = async (req, res, next) => {
  try {
    const checkUser = await User.findOne({ _id: req.userDetails.id });

    if (!checkUser) {
      const err = new Error("User not found");
      err.status = 404;
      throw err;
    }

    const showUserDetails = {
      fName: checkUser.fName,
      lName: checkUser.lName,
      postsCount: await Post.findOne({ postedBy: req.userDetails.id }).count(),
      posts: await Post.find({ postedBy: req.userDetails.id }),
    };

    res.status(200).json({
      success: true,
      result: showUserDetails,
    });
  } catch (err) {
    next(err);
  }
};

// edit profile API
const editProfile = async (req, res, next) => {
  try {
    const checkUser = await User.findOne({ _id: req.userDetails.id });

    if (!checkUser) {
      const err = new Error("User not found");
      err.status = 404;
      throw err;
    }

    await checkUser.updateOne({ fName: req.body.fName, lName: req.body.lName });

    res.status(200).json({
      success: true,
      result: "User details updated",
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  registerUser,
  verifyUser,
  signinUser,
  verifyEmail,
  forgetPassword,
  resetPassword,
  showProfile,
  editProfile,
};
