const mongoose = require('mongoose');

const ChatSchema = new mongoose.Schema({
  chatId: { type: String, required: true, unique: true },
  participants: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      role: { type: String, enum: ['sender', 'receiver'], required: true },
    },
  ],
  messages: [
    {
      senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      messageText: { type: String, required: true },
      fileName: { type: String },
      fileUrl: { type: String },
      timestamp: { type: Date, default: Date.now },
    },
  ],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.models.Chat || mongoose.model('Chat', ChatSchema);
