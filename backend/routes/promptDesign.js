// routes/designRoutes.js
const express = require("express");
const router = express.Router();
const designController = require("../controllers/promptController");

// Create a new prompt design
router.post("/", designController.createPromptDesign);

// Fetch all designs
router.get("/retrieve", designController.getAllDesigns);

// Fetch designs by username and patternType
router.get(
  "/retrieve-by-username-and-patternType/:username/:patternType",
  designController.getDesignsByUsernameAndPatternType
);

// Fetch designs by username
router.get("/retrieve-by-username/:username", designController.getDesignsByUsername);

// Delete a design by title
router.delete("/delete", designController.deleteDesignByTitle);

module.exports = router;