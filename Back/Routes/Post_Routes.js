const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const {upload} = require("../middleware/upload");
const {verifyToken} = require("../middleware/Authentication");

/* =========================
   UPLOAD POST (USER BASED)
========================= */
router.post("/upload",verifyToken, upload.single("file"), async (req, res) => {
  try {
    const { userId } = req.body;
    const file = req.file;

    if (!userId) {
      return res.status(400).json({ message: "userId required" });
    }

    const newPost = await Post.create({
      userId,
      mediaUrl: `http://localhost:5000/uploads/${file.filename}`,
      type: file.mimetype.startsWith("video") ? "video" : "image",
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
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
 
module.exports = router;