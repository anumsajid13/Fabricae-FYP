// controllers/designController.js

const PromptDesign = require("../Data/Models/PromptDesign");
const ThreeDDesign = require("../Data/Models/3DDesign");

// Create a new prompt design
const createPromptDesign = async (req, res) => {
  try {
    const { title, imageUrl, username, patternType, prompt } = req.body;
    console.log("req.body: ",req.body)
    const newPromptDesign = new PromptDesign({
      title,
      imageUrl,
      username,
      patternType,
      prompt,
    });
    console.log("newPromptDesign: ",newPromptDesign)
    const savedPromptDesign = await newPromptDesign.save();
    console.log("savedPromptDesign: ",savedPromptDesign)
    res.status(201).json(savedPromptDesign);
  } catch (error) {
    console.error("MongoDB Save Error:", error); 
    res.status(500).json({ error: "Failed to save prompt design" });
  }
};

const Save3DDesigns = async (req, res) => {
  try {
    const { title, imageUrl, createdAt, username } = req.body;
    console.log(" req.body: ", req.body)
    const newDesign = new ThreeDDesign({ title, imageUrl, createdAt, username });
    await newDesign.save();
    console.log(" newDesign: ", newDesign)

    res.status(201).json({ message: "3D Design saved successfully", design: newDesign });
  } catch (error) {
    console.error("Error saving 3D design:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getThreeDDesignsByUsername = async (req, res) => {
  try {
    const { username } = req.params;
    if (!username) {
      return res.status(400).json({ message: "Username is required" });
    }

    const designs = await ThreeDDesign.find({ username });
    res.status(200).json(designs);
  } catch (error) {
    console.error("Error fetching 3D Designs:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


// Delete a 3D Design by ID
const deleteThreeDDesign = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "ID is required" });
    }

    const deletedDesign = await ThreeDDesign.findByIdAndDelete(id);

    if (!deletedDesign) {
      return res.status(404).json({ message: "Design not found" });
    }

    res.status(200).json({ message: "Design deleted successfully" });
  } catch (error) {
    console.error("Error deleting 3D Design:", error);
    res.status(500).json({ message: "Internal Server Error" });
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

// Fetch designs by patternType
const getDesignsByPatternType = async (req, res) => {
  const { patternType } = req.params;
   console.log("patternType",patternType)
  try {
    // Find all designs with the given patternType
    const designs = await PromptDesign.find({ patternType }).sort({ createdAt: -1 }); // Sorting by most recent first

    // If no designs are found, return a 404 response
    if (designs.length === 0) {
      return res.status(404).json({ message: `No designs found for patternType: ${patternType}.` });
    }

    // Return the designs
    res.status(200).json(designs);
  } catch (error) {
    console.error("Error fetching designs by patternType:", error);
    res.status(500).json({ error: "Failed to fetch designs by patternType." });
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
  getDesignsByPatternType,
  Save3DDesigns,
  getThreeDDesignsByUsername,
  deleteThreeDDesign
};