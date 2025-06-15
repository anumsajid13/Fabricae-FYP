
const express = require('express');
const router = express.Router();
const thumbnailController = require('../controllers/thumbnailConroller');
const UserPortfolio = require('../Data/Models/UserPortfolio');
const multer = require('multer');
const upload = multer(); // Configure as needed

// Get thumbnail image file
router.get('/thumbnail/:id', thumbnailController.getPdfThumbnail);

// Get thumbnail URL (API endpoint)
router.get('/thumbnail-url/:id', thumbnailController.getThumbnailUrl);

// Generate thumbnail for specific portfolio
router.post('/generate-thumbnail/:id', thumbnailController.generateThumbnailOnUpload);

// Batch generate missing thumbnails
router.post('/generate-missing-thumbnails', thumbnailController.generateMissingThumbnails);

router.get('/:portfolioId/thumbnail-status', thumbnailController.getThumbnailStatus);

module.exports = router;