// controllers/designController.js

const PromptDesign = require("../Data/Models/PromptDesign");

// Create a new prompt design
const createPromptDesign = async (req, res) => {
  try {
    const { title, imageUrl, username, patternType, prompt } = req.body;

    const newPromptDesign = new PromptDesign({
      title,
      imageUrl,
      username,
      patternType,
      prompt,
    });

    const savedPromptDesign = await newPromptDesign.save();
    res.status(201).json(savedPromptDesign);
  } catch (error) {
    res.status(500).json({ error: "Failed to save prompt design" });
  }
};

// Fetch all designs
const getAllDesigns = async (req, res) => {
  try {
    // Fetch all designs from the database
    const designs = await PromptDesign.find().sort({ createdAt: 1 });
    res.status(200).json(designs);
  } catch (error) {
    console.error("Error fetching designs:", error);
    res.status(500).json({ error: "Failed to fetch designs" });
  }
};

// Fetch designs by username and patternType
const getDesignsByUsernameAndPatternType = async (req, res) => {
  const { username, patternType } = req.params;

  try {
    // Find designs where both username and patternType match
    const designs = await PromptDesign.find({ username, patternType }).sort({
      createdAt: -1,
    }); // Sorting by most recent first

    // If no designs are found, return a 404 response
    if (designs.length === 0) {
      return res.status(404).json({
        message: `No designs found for username: ${username} and patternType: ${patternType}.`,
      });
    }

    // Return the designs as a JSON response
    res.status(200).json(designs);
  } catch (error) {
    console.error("Error fetching designs by username and patternType:", error);
    res.status(500).json({ error: "Failed to fetch designs by username and patternType." });
  }
};

// Fetch designs by username
const getDesignsByUsername = async (req, res) => {
  const { username } = req.params;

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
};

// Delete a design by title
const deleteDesignByTitle = async (req, res) => {
  const { title } = req.body;

  try {
    const deletedDesign = await PromptDesign.findOneAndDelete({ title });

    if (!deletedDesign) {
      return res.status(404).json({ message: "Design not found." });
    }

    return res.status(200).json({ message: "Design successfully deleted." });
  } catch (error) {
    console.error("Error deleting design:", error);
    return res.status(500).json({ message: "Error deleting the design." });
  }
};

module.exports = {
  createPromptDesign,
  getAllDesigns,
  getDesignsByUsernameAndPatternType,
  getDesignsByUsername,
  deleteDesignByTitle,
};