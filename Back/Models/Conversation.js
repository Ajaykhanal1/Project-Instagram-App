const mongoose = require('mongoose');

const ConversationSchema = new mongoose.Schema({
  conversationId: {
    type: String,
    unique: true,
    required: true
  },
  participants: [
    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
  ],
  lastMessage: { type: String, required: true },
  unreadCount: { type: Map, of: Number, default: {} },
  updatedAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

module.exports =
  mongoose.models.Conversation ||
  mongoose.model('Conversation', ConversationSchema);