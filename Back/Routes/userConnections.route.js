const express = require("express");
const router = express.Router();
const User = require("../models/User");

// ================= GET USER CONNECTIONS =================
router.get("/connections/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    const user = await User.findById(userId)
      .populate("followers", "username displayName avatar")
      .populate("following", "username displayName avatar");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json({
      followers: user.followers,
      following: user.following,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

module.exports = router;