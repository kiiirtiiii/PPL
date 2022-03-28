const express = require("express");
const router = express.Router();
const { validateUsers } = require("../middlewares/validate-users");

const {
  registerUser,
  verifyUser,
  signinUser,
  verifyEmail,
  forgetPassword,
  resetPassword,
  showProfile,
  editProfile,
} = require("../controllers/user-controller");

const { authenticate } = require("../middlewares/authenticate");

router.post("/", validateUsers, registerUser);
router.post("/sign-in", signinUser);
router.post("/verify", verifyEmail);
router.post("/forget-password", forgetPassword);

router.get("/my-profile", authenticate, showProfile);
router.get("/:token", verifyUser);

router.put("/reset-password/:token", resetPassword);
router.put("/edit-profile", authenticate, editProfile);

module.exports = router;
