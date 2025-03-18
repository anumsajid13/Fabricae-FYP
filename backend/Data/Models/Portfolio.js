const mongoose = require("mongoose");

const PortfolioSchema = new mongoose.Schema({
  portfolioId: { type: String}, 
  pageId: { type: String }, 
  username: { type: String, required: true },
  title: { type: String, default: null },
  quote: { type: String, default: null },
  backgroundImage: { type: String, default: null },
  modelImage: { type: String, default: null },
  label: { type: String, default: null },
  styledContent: { type: Object, default: null }, // Stores styled text content
  elementPositions: { type: Object, default: null }, // Stores positions and dimensions of elements
  smallImages: { type: [String], default: null }, // Array of small image URLs
  smallImageTexts: { type: [String], default: null }, // Array of texts for small images
  heading: { type: String, default: null },
  description: { type: [String], default: null },
  innerContainerImage: { type: String, default: null },
  bgColor: { type: String, default: null },
  modelImage1: { type: String, default: null }, // Model image 1 URL
  modelImage2: { type: String, default: null }, // Model image 2 URL
  modelImage3: { type: String, default: null }, // Model image 3 URL
  modelImage4: { type: String, default: null }, // Model image 4 URL
  modelImage5: { type: String, default: null }, // Model image 5 URL
  illustrationImage: { type: String, default: null }, // Illustration image URL

});


module.exports = mongoose.model("Portfolio", PortfolioSchema);