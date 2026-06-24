const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const Comment  = require("../models/Comments");
const { upload } = require("../middleware/upload");
const { verifyToken } = require("../middleware/Authentication");

/* =========================
   UPLOAD POST (USER BASED)
========================= */
router.post("/upload", verifyToken, upload.single("file"), async (req, res) => {
  try {
    const { userId, title  } = req.body;
    const file = req.file;

    if (!userId) {
      return res.status(400).json({ message: "userId required" });
    }

    const newPost = await Post.create({
      userId,
      mediaUrl: `http://localhost:5000/uploads/${file.filename}`,
      type: file.mimetype.startsWith("video") ? "video" : "image",
      title,
    });

    res.status(201).json(newPost);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* =========================
   GET POSTS BY USER
========================= */
router.get("/posts/:userId", verifyToken, async (req, res) => {
  try {
    const posts = await Post.find({ userId: req.params.userId }).sort({
      createdAt: -1,
    });

    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* =========================
   GET ALL POSTS 
========================= */
router.get("/feed", async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate("userId", "username displayName avatar");

    const postsWithCounts = await Promise.all(
      posts.map(async (post) => {
        const commentCount = await Comment.countDocuments({
          postId: post._id,
        });

        return {
          ...post.toObject(),
          commentCount,
        };
      })
    );
    const shuffled = postsWithCounts.sort(() => Math.random() - 0.5);

    res.json(shuffled);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// BookMark
router.get("/bookmarks/:userId", async (req, res) => {
  const posts = await Post.find({
    savedBy: req.params.userId,
  });

  res.json(posts);
});

module.exports = router;
