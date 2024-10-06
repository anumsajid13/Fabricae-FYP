const express = require("express");
const router = express.Router();

const PromptDesign = require("../../Data/Models/PromptDesign");

// POST request to save a new prompt design
router.post("/", async (req, res) => {
  try {
    const { title, imageUrl, username, patternType } = req.body;

    const newPromptDesign = new PromptDesign({
      title,
      imageUrl,
      username,
      patternType,
    });

    const savedPromptDesign = await newPromptDesign.save();
    res.status(201).json(savedPromptDesign);
  } catch (error) {
    res.status(500).json({ error: "Failed to save prompt design" });
  }
});

module.exports = router;
