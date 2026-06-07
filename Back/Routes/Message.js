const express = require("express");
const router = express.Router();
const User = require("../Models/User");
const Message = require("../Models/Message");
const Conversation = require("../Models/Conversation");
const { verifyToken } = require("../middleware/Authentication");
const mongoose = require("mongoose");

const getConversationId = (a, b) => [a, b].sort().join("-");

router.get("/messages", async (req, res) => {
  const { sender, receiver } = req.query;
  const conversationId = getConversationId(sender, receiver);
  const messages = await Message.find({
    $or: [
      { sender: sender, receiver: receiver },
      { sender: receiver, receiver: sender },
    ],
  }).sort({ timestamp: 1 });

  res.json(messages);
});

router.get("/conversations/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const conversations = await Conversation.find({
      participants: userId,
    })
      .sort({ updatedAt: -1 })
      .populate("participants", "username displayName avatar");

    const result = conversations.map((conv) => {
      const otherUser = conv.participants.find(
        (p) => p._id.toString() !== userId
      );

      return {
        conversationId: conv._id,
        userId: otherUser?._id,
        avatar:otherUser?.avatar,
        username: otherUser?.username,
        displayName: otherUser?.displayName,
        lastMessage: conv.lastMessage || "",
        updatedAt: conv.updatedAt,
      };
    });

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
