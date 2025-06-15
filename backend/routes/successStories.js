// routes/successStories.js
const express = require('express');
const successStoryController = require('../controllers/successStoryController');

const router = express.Router();


// Routes
router.post('/',  successStoryController.createStory);
router.get('/top', successStoryController.getTopStories);
router.get('/', successStoryController.getAllStories);

module.exports = router;
