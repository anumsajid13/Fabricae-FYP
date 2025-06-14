const express = require('express');
const { getUserProfile ,updateUserProfile,getContacts} = require('../controllers/userController');
const router = express.Router();


// Endpoint to fetch user profile details
router.get('/profile/:email', getUserProfile);

router.put('/profile/:email', updateUserProfile);

router.get('/:userEmail/contacts', getContacts);


module.exports = router;