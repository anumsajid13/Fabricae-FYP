const Portfolio = require("../data/models/Portfolio");

// Save or Update Portfolio based on Username, PortfolioId, and PageId
exports.savePortfolio = async (req, res) => {
  try {
    const username = req.headers.username; // Get username from request headers
    console.log("SAVE MEE", username)
    const {
      portfolioId,
      pageId,
      title,
      quote,
      backgroundImage,
      modelImage,
      label,
      label1,
      label2,
      label3,
      label4,
      label5,
      label6,
      styledContent,
      elementPositions,
      smallImages,
      smallImageTexts,
      heading,
      description,
      description1,
      description2,
      description3,
      description4,
      description5,
      description6,
      innerContainerImage,
      bgColor,
      modelImage1,
      modelImage2,
      modelImage3,
      modelImage4,
      modelImage5,
      illustrationImage,
      name,
      year,
      image1,
      image2,
      image3,
      image4,
      image5,
      image6,
    } = req.body;

    if (!username) {
      return res.status(400).json({ message: "Username is required" });
    }

    if (!portfolioId || !pageId) {
      return res.status(400).json({ message: "portfolioId and pageId are required" });
    }

    console.log(portfolioId,pageId)

    // OMGGGGG KILKL MEE
    let existingPortfolio = await Portfolio.findOne({ username, portfolioId, pageId });

    console.log(existingPortfolio)

    if (existingPortfolio) {
      // Update the existing portfolio

      existingPortfolio.title = title || existingPortfolio.title;
      existingPortfolio.quote = quote || existingPortfolio.quote;
      existingPortfolio.backgroundImage = backgroundImage || existingPortfolio.backgroundImage;
      existingPortfolio.modelImage = modelImage || existingPortfolio.modelImage;
      existingPortfolio.label = label || existingPortfolio.label;
      existingPortfolio.label1 = label1 || existingPortfolio.label1;
      existingPortfolio.label2 = label2 || existingPortfolio.label2;
      existingPortfolio.label3 = label3 || existingPortfolio.label3;
      existingPortfolio.label4 = label4 || existingPortfolio.label4;
      existingPortfolio.label5 = label5 || existingPortfolio.label5;
      existingPortfolio.label6 = label6 || existingPortfolio.label6;
      existingPortfolio.styledContent = styledContent || existingPortfolio.styledContent;
      existingPortfolio.elementPositions = elementPositions || existingPortfolio.elementPositions;
      existingPortfolio.smallImages = smallImages || existingPortfolio.smallImages;
      existingPortfolio.smallImageTexts = smallImageTexts || existingPortfolio.smallImageTexts;
      existingPortfolio.heading = heading || existingPortfolio.heading;
      existingPortfolio.description = description || existingPortfolio.description;
      existingPortfolio.description1 = description1 || existingPortfolio.description1;
      existingPortfolio.description2 = description2 || existingPortfolio.description2;
      existingPortfolio.description3 = description3 || existingPortfolio.description3;
      existingPortfolio.description4 = description4 || existingPortfolio.description4;
      existingPortfolio.description5 = description5 || existingPortfolio.description5;
      existingPortfolio.description6 = description6 || existingPortfolio.description6;
      existingPortfolio.innerContainerImage = innerContainerImage || existingPortfolio.innerContainerImage;
      existingPortfolio.bgColor = bgColor || existingPortfolio.bgColor;
      existingPortfolio.modelImage1 = modelImage1 || existingPortfolio.modelImage1;
      existingPortfolio.modelImage2 = modelImage2 || existingPortfolio.modelImage2;
      existingPortfolio.modelImage3 = modelImage3 || existingPortfolio.modelImage3;
      existingPortfolio.modelImage4 = modelImage4 || existingPortfolio.modelImage4;
      existingPortfolio.modelImage5 = modelImage5 || existingPortfolio.modelImage5;
      existingPortfolio.illustrationImage = illustrationImage || existingPortfolio.illustrationImage;
      existingPortfolio.name = name || existingPortfolio.name;
      existingPortfolio.year = year || existingPortfolio.year;
      existingPortfolio.image1 = image1 || existingPortfolio.image1;
      existingPortfolio.image2 = image2 || existingPortfolio.image2;
      existingPortfolio.image3 = image3 || existingPortfolio.image3;
      existingPortfolio.image4 = image4 || existingPortfolio.image4;
      existingPortfolio.image5 = image5 || existingPortfolio.image5;
      existingPortfolio.image6 = image6 || existingPortfolio.image6;
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
        label1,
        label2,
        label3,
        label4,
        label5,
        label6,
        styledContent,
        elementPositions,
        smallImages,
        smallImageTexts,
        heading,
        description,
        description1,
        description2,
        description3,
        description4,
        description5,
        description6,
        innerContainerImage,
        bgColor,
        modelImage1,
        modelImage2,
        modelImage3,
        modelImage4,
        modelImage5,
        illustrationImage,
        name,
        year,
        image1,
        image2,
        image3,
        image4,
        image5,
        image6,
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
      return res.status(200).json({ portfolios: [] }); // Return empty array instead of 404
    }

    // Extract unique portfolios with their last updated time
    const uniquePortfolioMap = new Map();

    // For each portfolio, keep track of the most recent update
    portfolios.forEach(portfolio => {
      const id = portfolio.portfolioId;
      const lastUpdated = portfolio.lastUpdated;

      if (!uniquePortfolioMap.has(id) || new Date(lastUpdated) > new Date(uniquePortfolioMap.get(id).lastUpdated)) {
        uniquePortfolioMap.set(id, { id, lastUpdated });
      }
    });

    // Convert Map to array
    const uniquePortfolios = Array.from(uniquePortfolioMap.values());

    // Return the unique portfolios with their last updated time
    res.status(200).json({ portfolios: uniquePortfolios });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving unique portfolios", error });
  }
};