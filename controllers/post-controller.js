// Error response
const { fileNotSelect, postNotFound } = require("../constants/error-message");

// Success response
const {
  successfulPostUplaod,
  success,
} = require("../constants/success-message");

const { Post } = require("../models/post-model");

// create post API
const createPost = async (req, res, next) => {
  try {
    // if user does not select any file
    if (!req.file) {
      const err = fileNotSelect.err;
      err.status = fileNotSelect.status;
      throw err;
    }

    // save information into database
    const newPost = new Post(req.body);

    newPost.postedBy = req.userDetails.id;
    newPost.title = req.body.title;
    newPost.postedImage = req.file.filename;
    newPost.creatorName = req.userDetails.fName;
    newPost.createdOn = Date.now();
    newPost.commentCount = 0;
    newPost.likeCount = 0;
    newPost.flagCount = 0;

    await newPost.save();

    res.status(success.status).json({
      success: true,
      result: successfulPostUplaod.msg,
    });
  } catch (err) {
    next(err);
  }
};

// show one post API
const showPost = async (req, res, next) => {
  try {
    const findPost = await Post.findOne({ _id: req.params.postid });

    if (!findPost) {
      const err = postNotFound.err;
      err.status = postNotFound.status;
      throw err;
    }

    res.status(success.status).json({
      success: true,
      result: findPost,
    });
  } catch (err) {
    next(err);
  }
};

// likes API
const addLikes = async (req, res, next) => {
  try {
    const findPost = await Post.findOneAndUpdate(
      { _id: req.params.postid },
      {
        $addToSet: { likeBy: req.userDetails.id },
      }
    );

    if (!findPost) {
      const err = postNotFound.err;
      err.status = postNotFound.status;
      throw err;
    }

    const totalLikes = await Post.aggregate([
      {
        $project: {
          item: 1,
          numberOfLikes: {
            $size: "$likeBy",
          },
        },
      },
    ]);

    await findPost.updateOne({ likeCount: totalLikes[0].numberOfLikes });

    const findUpdatedPost = await Post.findOne({ _id: req.params.postid });

    res.status(success.status).json({
      success: true,
      result: {
        likes: findUpdatedPost.likeCount,
      },
    });
  } catch (err) {
    next(err);
  }
};

// Unlike API
const removeLikes = async (req, res, next) => {
  try {
    const findPost = await Post.findOneAndUpdate(
      { _id: req.params.postid },
      { $pull: { likeBy: req.userDetails.id } }
    );

    if (!findPost) {
      const err = postNotFound.err;
      err.status = postNotFound.status;
      throw err;
    }

    const totalLikes = await Post.aggregate([
      {
        $project: {
          item: 1,
          numberOfLikes: {
            $size: "$likeBy",
          },
        },
      },
    ]);

    await findPost.updateOne({ likeCount: totalLikes[0].numberOfLikes });
    const findUpdatedPost = await Post.findOne({ _id: req.params.postid });

    res.status(success.status).json({
      success: true,
      result: {
        likes: findUpdatedPost.likeCount,
      },
    });
  } catch (err) {
    next(err);
  }
};

// comments API
const addComments = async (req, res, next) => {
  try {
    const findPost = await Post.findOneAndUpdate(
      { _id: req.params.postid },
      {
        $addToSet: {
          comments: {
            creatorId: req.userDetails.id,
            creatorName: req.userDetails.fName,
            comment: req.body.comment,
            commentedOn: Date.now(),
          },
        },
      }
    );

    if (!findPost) {
      const err = postNotFound.err;
      err.status = postNotFound.status;
      throw err;
    }

    const totalComments = await Post.aggregate([
      {
        $project: {
          item: 1,
          numberOfComments: {
            $size: "$comments",
          },
        },
      },
    ]);

    await findPost.updateOne({
      commentCount: totalComments[0].numberOfComments,
    });

    const findUpdatedPost = await Post.findOne({ _id: req.params.postid });

    res.status(success.status).json({
      success: true,
      result: {
        comments: findUpdatedPost.commentCount,
      },
    });
  } catch (err) {
    next(err);
  }
};

// flag post API
const flagPost = async (req, res, next) => {
  try {
    const findPost = await Post.findOneAndUpdate(
      { _id: req.params.postid },
      {
        $addToSet: { flagBy: req.userDetails.id },
      }
    );

    if (!findPost) {
      const err = postNotFound.err;
      err.status = postNotFound.status;
      throw err;
    }

    const totalFlags = await Post.aggregate([
      {
        $project: {
          item: 1,
          numberOfFlags: {
            $size: "$flagBy",
          },
        },
      },
    ]);

    await findPost.updateOne({ flagCount: totalFlags[0].numberOfFlags });
    const findUpdatedPost = await Post.findOne({ _id: req.params.postid });

    res.status(success.status).json({
      success: true,
      result: {
        flags: findUpdatedPost.flagCount,
      },
    });
  } catch (err) {
    next(err);
  }
};

// unflag post API
const unflagPost = async (req, res, next) => {
  try {
    const findPost = await Post.findOneAndUpdate(
      { _id: req.params.postid },
      { $pull: { flagBy: req.userDetails.id } }
    );

    if (!findPost) {
      const err = postNotFound.err;
      err.status = postNotFound.status;
      throw err;
    }

    const totalFlags = await Post.aggregate([
      {
        $project: {
          item: 1,
          numberOfFlags: {
            $size: "$flagBy",
          },
        },
      },
    ]);

    await findPost.updateOne({ flagCount: totalFlags[0].numberOfFlags });
    const findUpdatedPost = await Post.findOne({ _id: req.params.postid });

    res.status(success.status).json({
      success: true,
      result: {
        flags: findUpdatedPost.flagCount,
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createPost,
  showPost,
  addLikes,
  removeLikes,
  addComments,
  flagPost,
  unflagPost,
};
