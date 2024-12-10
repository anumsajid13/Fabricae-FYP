const express = require('express');
const { getUserProfile ,updateUserProfile} = require('../controllers/userController');
const router = express.Router();

// Endpoint to fetch user profile details
router.get('/profile/:email', getUserProfile);

router.put('/profile/:email', updateUserProfile);

module.exports = router;