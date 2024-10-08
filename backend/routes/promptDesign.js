const express = require("express");
const router = express.Router();

const PromptDesign = require("../../Data/Models/PromptDesign");


router.post("/", async (req, res) => {
  try {
    const { title, imageUrl, username, patternType, prompt} = req.body;

    const newPromptDesign = new PromptDesign({
      title,
      imageUrl,
      username,
      patternType,
      prompt
    });

    const savedPromptDesign = await newPromptDesign.save();
    res.status(201).json(savedPromptDesign);
  } catch (error) {
    res.status(500).json({ error: "Failed to save prompt design" });
  }
});



router.get("/retrieve", async (req, res) => {
  try {
    // Fetch all prompt designs from the database
    const designs = await PromptDesign.find({});
    res.status(200).json(designs); 
  } catch (error) {
    console.error("Error fetching designs:", error);
    res.status(500).json({ error: "Failed to fetch designs" });
  }

  });

module.exports = router;
