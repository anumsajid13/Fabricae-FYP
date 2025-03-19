const Portfolio = require("../data/models/Portfolio");

// Save or Update Portfolio based on Username, PortfolioId, and PageId
exports.savePortfolio = async (req, res) => {
  try {
    const username = req.headers.username; // Get username from request headers
    const {
      portfolioId,
      pageId,
      title,
      quote,
      backgroundImage,
      modelImage,
      label,
      styledContent,
      elementPositions,
      smallImages,
      smallImageTexts,
      heading,
      description,
      innerContainerImage,
      bgColor,
      modelImage1,
      modelImage2,
      modelImage3,
      modelImage4,
      modelImage5,
      illustrationImage,
    } = req.body;

    if (!username) {
      return res.status(400).json({ message: "Username is required" });
    }

    if (!portfolioId || !pageId) {
      return res.status(400).json({ message: "portfolioId and pageId are required" });
    }

    console.log(portfolioId,pageId)

    // Check if a portfolio with the same portfolioId AND pageId exists
    let existingPortfolio = await Portfolio.findOne({ portfolioId, pageId });

    console.log(existingPortfolio)

    if (existingPortfolio) {
      // Update the existing portfolio
      existingPortfolio.title = title || existingPortfolio.title;
      existingPortfolio.quote = quote || existingPortfolio.quote;
      existingPortfolio.backgroundImage = backgroundImage || existingPortfolio.backgroundImage;
      existingPortfolio.modelImage = modelImage || existingPortfolio.modelImage;
      existingPortfolio.label = label || existingPortfolio.label;
      existingPortfolio.styledContent = styledContent || existingPortfolio.styledContent;
      existingPortfolio.elementPositions = elementPositions || existingPortfolio.elementPositions;
      existingPortfolio.smallImages = smallImages || existingPortfolio.smallImages;
      existingPortfolio.smallImageTexts = smallImageTexts || existingPortfolio.smallImageTexts;
      existingPortfolio.heading = heading || existingPortfolio.heading;
      existingPortfolio.description = description || existingPortfolio.description;
      existingPortfolio.innerContainerImage = innerContainerImage || existingPortfolio.innerContainerImage;
      existingPortfolio.bgColor = bgColor || existingPortfolio.bgColor;
      existingPortfolio.modelImage1 = modelImage1 || existingPortfolio.modelImage1;
      existingPortfolio.modelImage2 = modelImage2 || existingPortfolio.modelImage2;
      existingPortfolio.modelImage3 = modelImage3 || existingPortfolio.modelImage3;
      existingPortfolio.modelImage4 = modelImage4 || existingPortfolio.modelImage4;
      existingPortfolio.modelImage5 = modelImage5 || existingPortfolio.modelImage5;
      existingPortfolio.illustrationImage = illustrationImage || existingPortfolio.illustrationImage;
      existingPortfolio.lastUpdated = Date.now(); // Update lastUpdated field


      await existingPortfolio.save();
      return res.status(200).json({ message: "Portfolio updated successfully", portfolio: existingPortfolio });
    } else {

      console.log('rrr')
      // Create a new portfolio if no matching portfolioId and pageId exists
      const newPortfolio = new Portfolio({
        portfolioId, // Unique identifier for the portfolio
        pageId, // Unique identifier for the page
        username, // Associate with user
        title,
        quote,
        backgroundImage,
        modelImage,
        label,
        styledContent,
        elementPositions,
        smallImages,
        smallImageTexts,
        heading,
        description,
        innerContainerImage,
        bgColor,
        modelImage1,
        modelImage2,
        modelImage3,
        modelImage4,
        modelImage5,
        illustrationImage,
        lastUpdated: Date.now(), // Set lastUpdated for new portfolio

      });

      await newPortfolio.save();
      return res.status(201).json({ message: "Portfolio saved successfully", portfolio: newPortfolio });
    }
  } catch (error) {
   
    res.status(500).json({ message: "Error saving portfolio", error });
  }
};
exports.loadPortfolio = async (req, res) => {
  try {
    const username = req.headers.username; // Get username from request headers
    const { portfolioId, pageId } = req.query; // Get portfolioId and pageId from query parameters

    if (!username) {
      return res.status(400).json({ message: "Username is required" });
    }

    // Build the query object
    const query = { username };

    // Add portfolioId to the query if provided
    if (portfolioId) {
      query.portfolioId = portfolioId;
    }

    // Add pageId to the query if provided
    if (pageId) {
      query.pageId = pageId;
    }

    // Fetch portfolios based on the query
    const portfolios = await Portfolio.find(query);

    if (!portfolios.length) {
      return res.status(404).json({ message: "No portfolios found for this user" });
    }

    // Return the filtered portfolios
    res.status(200).json(portfolios);
  } catch (error) {
    res.status(500).json({ message: "Error loading portfolio", error });
  }
};

// Function to get all unique portfolio IDs for a specific username
exports.getUniquePortfolioIds = async (req, res) => {
  try {
    const username = req.headers.username; // Get username from request headers

    if (!username) {
      return res.status(400).json({ message: "Username is required" });
    }

    // Fetch all portfolios for the given username
    const portfolios = await Portfolio.find({ username });

    if (!portfolios.length) {
      return res.status(404).json({ message: "No portfolios found for this user" });
    }

    // Extract portfolioIds and remove duplicates
    const portfolioIds = portfolios.map(portfolio => portfolio.portfolioId);
    const uniquePortfolioIds = [...new Set(portfolioIds)];

    // Return the unique portfolioIds
    res.status(200).json({ uniquePortfolioIds });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving unique portfolio IDs", error });
  }
};