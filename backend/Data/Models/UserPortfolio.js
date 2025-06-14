const mongoose = require("mongoose");

const UserPortfolioSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    index: true
  },
  name: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: null
  },
  pdfUrl: {
    type: String,
    required: true
  },
  fileName: {
    type: String,
    required: true
  },
  // Add thumbnail fields
  thumbnailUrl: {
    type: String,
    default: null
  },
  thumbnailGeneratedAt: {
    type: Date,
    default: null
  },
  thumbnailStatus: {
    type: String,
    enum: ['pending', 'generated', 'failed'],
    default: 'pending'
  },
  uploadDate: {
    type: Date,
    default: Date.now
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  views: {
    type: Number,
    default: 0
  },
  likes: {
    type: Number,
    default: 0
  }
});

// Index for efficient queries
UserPortfolioSchema.index({ email: 1, uploadDate: -1 });
UserPortfolioSchema.index({ isPublic: 1, uploadDate: -1 });
UserPortfolioSchema.index({ thumbnailStatus: 1 }); // For batch processing

module.exports = mongoose.model("UserPortfolio", UserPortfolioSchema);