const express = require("express");
const router = express.Router();

const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const User = require("../Models/User");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const { verifyToken } = require("../middleware/Authentication");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Check user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    if (!user.password) {
      return res.status(400).json({ message: "User password missing in DB" });
    }

    // 2. Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // 3. Create JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    res.json({
      success: true,
      token: token,
      user,
    });
  } catch (err) {
    console.log("Login Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/google", async (req, res) => {
  try {
    const { token } = req.body;

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { sub, name, email } = payload;

    let user = await User.findOne({ email });

    if (!user) {
      const baseUsername = name.replace(/\s+/g, "").toLowerCase();

      // ================= UNIQUE USERNAME GENERATOR =================
      async function generateUniqueUsername(base) {
        let username;
        let exists = true;

        while (exists) {
          const randomNumber = Math.floor(1000 + Math.random() * 9000);
          username = `${base}${randomNumber}`;

          const existingUser = await User.findOne({ username });
          if (!existingUser) {
            exists = false;
          }
        }

        return username;
      }

      const username = await generateUniqueUsername(baseUsername);

      user = await User.create({
        googleId: sub,
        email,

        displayName: name,
        username,

        avatar:
          "https://tse4.mm.bing.net/th/id/OIP.JmMebcJLToYCUIf4zPUjiQHaGc?pid=Api&h=220&P=0",

        bio: "",

        postsCount: 0,
        followersCount: 0,
        followingCount: 0,

        isPrivate: false,
        isVerified: false,

        highlights: [],
      });
    }

    const jwtToken = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      success: true,
      token: jwtToken,
      user,
    });
  } catch (error) {
    console.log("Google Auth Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

router.post("/register", async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    // validation
    if (!name || !email || !password || !confirmPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Registration Error:", error); // This shows the actual error in your terminal
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
});

router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // generate token
    const token = crypto.randomBytes(32).toString("hex");

    user.resetToken = token;
    user.resetTokenExpire = Date.now() + 1000 * 60 * 10; // 10 min

    await user.save();

    // send email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "ajaykhanal2019@gmail.com",
        pass: "vzhf wrrj rjfm lqki",
      },
    });

    const resetLink = `http://localhost:5173/reset-password/${token}`;

    await transporter.sendMail({
      to: user.email,
      subject: "Password Reset Request",
      html: `
        <h3>Password Reset</h3>
        <p>Click below link to reset password:</p>
        <a href="${resetLink}">${resetLink}</a>
      `,
    });

    res.json({ message: "Reset link sent to email" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/reset-password/:token", async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({
      resetToken: token,
      resetTokenExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;
    user.resetToken = undefined;
    user.resetTokenExpire = undefined;

    await user.save();

    res.json({ message: "Password reset successful" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
