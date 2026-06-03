const mongoose = require("mongoose");
const postSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  mediaUrl: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ["image", "video"],
    required: true,
  },
  likesCount: {
    type: Number,
    default: 0,
  },

  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],




  // Comments 
  comment: {
    type: Number,
    default: 0,
  },
  text: {
    type: String,
    trim: true,
  },






  

  reposted: {
    type: Number,
    default: 0,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Post", postSchema);
