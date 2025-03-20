const mongoose = require("mongoose");

const PortfolioSchema = new mongoose.Schema({
  portfolioId: { type: String },
  pageId: { type: String },
  username: { type: String, required: true },
  title: { type: String, default: null },
  quote: { type: String, default: null },
  backgroundImage: { type: String, default: null },
  modelImage: { type: String, default: null },
  label: { type: String, default: null },
  styledContent: { type: Object, default: null },
  elementPositions: { type: Object, default: null },
  smallImages: { type: [String], default: null },
  smallImageTexts: { type: [String], default: null },
  heading: { type: String, default: null },
  description: { type: [String], default: null },
  innerContainerImage: { type: String, default: null },
  bgColor: { type: String, default: null },
  modelImage1: { type: String, default: null },
  modelImage2: { type: String, default: null },
  modelImage3: { type: String, default: null },
  modelImage4: { type: String, default: null },
  modelImage5: { type: String, default: null },
  illustrationImage: { type: String, default: null },
  lastUpdated: { type: Date, default: Date.now }, // New field for tracking updates
});

// Middleware to update lastUpdated field before saving
PortfolioSchema.pre("save", function (next) {
  this.lastUpdated = Date.now();
  next();
});

module.exports = mongoose.model("Portfolio", PortfolioSchema);
