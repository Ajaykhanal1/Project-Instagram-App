const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  toUserId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  fromUserId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

  type: {
    type: String,
    enum: ["follow", "like", "comment"],
  },

  message: String,
  isRead: { type: Boolean, default: false },
  
  fromAvatar: {
      type: String,
      default: "https://i.pravatar.cc/150",
    },

  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Notification", notificationSchema);