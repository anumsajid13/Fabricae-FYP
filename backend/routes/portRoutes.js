const express = require("express");
const { savePortfolio, loadPortfolio } = require("../controllers/portfolioController");

const router = express.Router();

router.post("/save-portfolio", savePortfolio);
router.get("/load-portfolio", loadPortfolio);

module.exports = router;
