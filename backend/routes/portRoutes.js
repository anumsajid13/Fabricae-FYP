const express = require("express");
const { savePortfolio, loadPortfolio ,getUniquePortfolioIds} = require("../controllers/portfolioController");

const router = express.Router();

router.post("/save-portfolio", savePortfolio);
router.get("/load-portfolio", loadPortfolio);
// New route for getting unique portfolio IDs
router.get("/unique-portfolio-ids", getUniquePortfolioIds);

module.exports = router;
