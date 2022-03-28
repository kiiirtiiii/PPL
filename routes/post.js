const express = require("express");
const multer = require("multer");
const { authenticate } = require("../middlewares/authenticate");
const { multerConfig } = require("../services/upload-image");
const router = express.Router();

const {
  createPost,
  showPost,
  addLikes,
  removeLikes,
  addComments,
  flagPost,
  unflagPost,
} = require("../controllers/post-controller");

router.post(
  "/",
  authenticate,
  multer(multerConfig).single("photo"),
  createPost
);
router.get("/:postid", authenticate, showPost);
router.post("/like/:postid", authenticate, addLikes);
router.post("/unlike/:postid", authenticate, removeLikes);
router.post("/comment/:postid", authenticate, addComments);
router.post("/flag/:postid", authenticate, flagPost);
router.post("/unflag/:postid", authenticate, unflagPost);

module.exports = router;
