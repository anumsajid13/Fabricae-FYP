// routes/pptxRoutes.js
const express = require('express');
const router = express.Router();
const { extractSlideContent, saveChanges } = require('../middleware/portfolioMiddleware');

// GET /presentation - Fetch slide content
router.get('/presentation', async (req, res) => {
    try {
        const slides = await extractSlideContent();
        res.status(200).json({ slides });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST /save - Save changes to the PPTX file
router.post('/save', express.json(), async (req, res) => {
    try {
        const { slides } = req.body;
        await saveChanges(slides);
        res.status(200).json({ message: 'Presentation updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;