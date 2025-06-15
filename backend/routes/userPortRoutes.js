// routes/userPortfolio.js
const express = require('express');
const router = express.Router();
const userPortfolioController = require('../controllers/userPortfolioController');

// Upload new portfolio
router.post('/upload', userPortfolioController.uploadPortfolio);

// Get portfolio by ID
router.get('/:id', userPortfolioController.getPortfolioById);

// Get all portfolios by user email
router.get('/user/:email', userPortfolioController.getPortfoliosByEmail);

// Get all public portfolios (explore page)
router.get('/', userPortfolioController.getAllPublicPortfolios);

// Update portfolio
router.put('/:id', userPortfolioController.updatePortfolio);

// Delete portfolio
router.delete('/:id', userPortfolioController.deletePortfolio);

// Like/Unlike portfolio
router.post('/:id/like', userPortfolioController.toggleLike);

module.exports = router;
