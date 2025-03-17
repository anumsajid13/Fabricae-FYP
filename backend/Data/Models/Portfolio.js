const mongoose = require("mongoose");

const PortfolioSchema = new mongoose.Schema({
  portfolioId: { type: String, required: true, unique: true }, // Unique identifier for the portfolio
  pageId: { type: String, required: true, unique: true }, // Unique identifier for the page
  username: { type: String, required: true },
  title: { type: String, default: null },
  quote: { type: String, default: null },
  backgroundImage: { type: String, default: null },
  modelImage: { type: String, default: null },
  label: { type: String, default: null },
  styledContent: { type: Object, default: null },
  elementPositions: { type: Object, default: null },
  smallImages: { type: [String], default: null },
  heading: { type: String, default: null },
  description: { type: [String], default: null },
  innerContainerImage: { type: String, default: null },
  bgColor: { type: String, default: null },
});

// Indexes for efficient querying
PortfolioSchema.index({ portfolioId: 1 }, { unique: true });
PortfolioSchema.index({ pageId: 1 }, { unique: true });
PortfolioSchema.index({ username: 1, title: 1 }, { unique: true });

module.exports = mongoose.model("Portfolio", PortfolioSchema);