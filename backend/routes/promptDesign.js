const express = require("express");
const router = express.Router();

const PromptDesign = require("../Data/Models/PromptDesign");


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
    //Fetch all  designs from the database
    const designs = await PromptDesign.find().sort({ createdAt: 1 });
    res.status(200).json(designs); 
  } catch (error) {
    console.error("Error fetching designs:", error);
    res.status(500).json({ error: "Failed to fetch designs" });
  }

  });

  // Route to retrieve designs by username
router.get("/retrieve-by-username/:username", async (req, res) => {
  const { username } = req.params;
 // console.log("username",username)
  try {
    const designs = await PromptDesign.find({ username }).sort({ createdAt: -1 }); // Sorting by most recent first
    if (designs.length === 0) {
      return res.status(404).json({ message: "No designs found for the specified username." });
    }

    res.status(200).json(designs);
  } catch (error) {
    console.error("Error fetching designs by username:", error);
    res.status(500).json({ error: "Failed to fetch designs by username." });
  }
});


router.delete('/delete', async (req, res) => {
  const { title } = req.body; 

  try {
   
    const deletedDesign = await PromptDesign.findOneAndDelete({ title });

    if (!deletedDesign) {
      return res.status(404).json({ message: 'Design not found.' });
    }

    return res.status(200).json({ message: 'Design successfully deleted.' });
  } catch (error) {
    console.error('Error deleting design:', error);
    return res.status(500).json({ message: 'Error deleting the design.' });
  }
});

module.exports = router;
