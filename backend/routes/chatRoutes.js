const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');

// Create a new chat
router.post('/create', chatController.createChat);

// Fetch chat history
router.get('/chats/:userEmail/:contactEmail', chatController.getChatHistory);

// Send a message in an existing chat
router.post('/send-message', chatController.sendMessage);

// Send an attachment in an existing chat
router.post('/send-attachment', chatController.sendAttachment);

// Delete a message in an existing chat
router.post('/delete-message', chatController.deleteChat);

module.exports = router;
