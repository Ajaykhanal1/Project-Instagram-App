const express = require("express");
const router = express.Router();

const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const User = require("../Models/User");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const { verifyToken } = require("../middleware/Authentication");
const { upload}  = require("../middleware/upload");


const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

router.get("/profile/me", verifyToken, async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  res.json(user);
});

router.put(
  "/profile/:id",
  verifyToken,
  upload.single("avatar"),
  async (req, res) => {
    try {
      const userId = req.params.id;

      // security check
      if (req.user.id !== userId) {
        return res.status(403).json({ message: "Unauthorized" });
      }

      const { displayName, bio } = req.body;

      // build update object
      const updateData = {};

      if (displayName) updateData.displayName = displayName;
      if (bio) updateData.bio = bio;

      // 👇 handle uploaded image
      if (req.file) {
        updateData.avatar = `http://localhost:5000/uploads/${req.file.filename}`;
      }

      if (Object.keys(updateData).length === 0) {
        return res.status(400).json({ message: "Nothing to update" });
      }

      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { $set: updateData },
        { new: true }
      ).select("-password");

      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json({
        success: true,
        user: updatedUser,
      });
    } catch (err) {
      console.log("Profile Update Error:", err);
      res.status(500).json({ message: "Server error" });
    }
  }
);




module.exports = router;
