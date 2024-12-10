const express = require("express");
const { registerUser, loginUser , requestPasswordReset,
    resetPassword,getOrCreateUser} = require("../controllers/authController.js");

const router = express.Router();

// Routes
router.post("/register", registerUser);
router.post("/login", loginUser);

//jugaar route hehehe
router.post("/get-or-create-user", getOrCreateUser);

// Forgot password routes
router.post("/request-password-reset", requestPasswordReset);
router.post("/reset-password", resetPassword);

module.exports = router;
