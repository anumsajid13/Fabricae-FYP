const express = require("express");
const router = express.Router();
const { StreamChat } = require("stream-chat");
const dotenv = require("dotenv");

dotenv.config();

const apiKey = process.env.STREAM_API_KEY;
const apiSecret = process.env.STREAM_API_SECRET;
const serverClient = new StreamChat(apiKey, apiSecret);

// Endpoint to generate a token for the user
router.post("/generate-token", (req, res) => {
  const { userId } = req.body; // Get user ID from frontend (post request)
  
  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  // Generate token for the user
  const token = serverClient.createToken(userId);
  res.json({ token });
});

module.exports = router;
