
const mongoose = require("mongoose");

const promptDesignSchema = new mongoose.Schema({
  title: { type: String, required: true },
  imageUrl: { type: String, required: true },
  creationDate: { type: Date, default: Date.now },
  username: { type: String, required: true },
  patternType: { type: String, required: true },
});

module.exports = mongoose.model("PromptDesign", promptDesignSchema);
