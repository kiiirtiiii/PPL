const { default: mongoose } = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const commentSchema = new mongoose.Schema({
  creatorId: {
    type: ObjectId,
  },
  creatorName: {
    type: String,
  },
  comment: {
    type: String,
    required: true,
  },
  commentedOn: {
    type: Date,
  },
});

const postSchema = new mongoose.Schema({
  postedBy: {
    type: ObjectId,
  },

  title: {
    type: String,
  },

  postedImage: {
    type: String,
    required: true,
  },

  creatorName: {
    type: String,
  },

  createdOn: {
    type: Date,
  },

  comments: {
    type: [commentSchema],
  },

  commentCount: {
    type: Number,
  },

  likeBy: {
    type: [ObjectId],
  },

  likeCount: {
    type: Number,
  },

  flagCount: {
    type: Number,
  },

  flagBy: {
    type: [ObjectId],
  },
});

const Post = new mongoose.model("post", postSchema);

module.exports = { Post };
