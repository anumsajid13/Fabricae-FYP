const mongoose = require("mongoose");

const ThreeDDesignSchema = new mongoose.Schema({
  title: { type: String, required: true },
  imageUrl: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  username: { type: String, required: true },
});

module.exports = mongoose.model("ThreeDDesign", ThreeDDesignSchema);
