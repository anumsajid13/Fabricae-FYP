const express = require("express");
const { registerUser, loginUser , requestPasswordReset,
    resetPassword} = require("../controllers/authController.js");

const router = express.Router();

// Routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Forgot password routes
router.post("/request-password-reset", requestPasswordReset);
router.post("/reset-password", resetPassword);

module.exports = router;
