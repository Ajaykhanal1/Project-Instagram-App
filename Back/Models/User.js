const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema(
  {
    // ================= AUTH (EMAIL/PASSWORD + GOOGLE OAUTH) =================
    username: {
      type: String,
      unique: true,
      sparse: false,
      trim: true,
      lowercase: true,
    },

    displayName: {
      type: String,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    password: {
      type: String,
    },

    googleId: {
      type: String,
      default: null,
    },

    // ================= PROFILE =================
    bio: {
      type: String,
      default: "",
      maxLength: 250,
    },

    avatar: {
      type: String,
      default: "https://i.pravatar.cc/150",
    },

    // ================= STATS (UI ONLY) =================
    postsCount: {
      type: Number,
      default: 0,
    },

    followersCount: {
      type: Number,
      default: 0,
    },

    followingCount: {
      type: Number,
      default: 0,
    },

    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    
    // ================= INSTAGRAM FEATURES =================
    highlights: [
      {
        title: {
          type: String,
          default: "New",
        },

        coverImage: {
          type: String,
          default: "",
        },

        stories: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Story",
          },
        ],

        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    // ================= SETTINGS =================
    isPrivate: {
      type: Boolean,
      default: false,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    // ================= SECURITY =================
    refreshToken: {
      type: String,
      default: null,
    },

    resetToken: {
      type: String,
      default: null,
    },

    resetTokenExpire: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.models.User || mongoose.model("User", UserSchema);
