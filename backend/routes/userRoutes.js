const express = require('express');
const multer = require('multer');
const { getUserProfile ,updateUserProfile, getContacts, uploadPdfToPortfolio, getUserPortfolios} = require('../controllers/userController');
const router = express.Router();

// Setup multer for handling PDF upload
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Endpoint to fetch user profile details
router.get('/profile/:email/getPort', getUserPortfolios)

router.get('/profile/:email', getUserProfile);

router.put('/profile/:email', updateUserProfile);

router.post('/profile/:email/portfolio', upload.single('pdf'), uploadPdfToPortfolio);

router.get('/:userEmail/contacts', getContacts);


module.exports = router;