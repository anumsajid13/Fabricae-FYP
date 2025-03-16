// routes/designRoutes.js
const express = require("express");
const router = express.Router();
const designController = require("../controllers/promptController");

// Create a new prompt design
router.post("/", designController.createPromptDesign);

// Create a new 3D mockup design
router.post("/save3D", designController.Save3DDesigns);

//Get 3D designs by username
router.get("/get3D/:username", designController.getThreeDDesignsByUsername);

// DELETE - Remove a 3D Design by ID
router.delete("/delete3D/:id", designController.deleteThreeDDesign);

// Fetch all designs
router.get("/retrieve", designController.getAllDesigns);

// Fetch designs by username and patternType
router.get(
  "/retrieve-by-username-and-patternType/:username/:patternType",
  designController.getDesignsByUsernameAndPatternType
);

// Fetch designs by username
router.get("/retrieve-by-username/:username", designController.getDesignsByUsername);

// Fetch designs by patternType
router.get("/retrieve-by-patternType/:patternType", designController.getDesignsByPatternType);

// Delete a design by title
router.delete("/delete", designController.deleteDesignByTitle);

module.exports = router;