const Portfolio = require("../data/models/Portfolio");

// Save or Update Portfolio based on Username & Title
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
      heading,
      description,
      innerContainerImage,
      bgColor,
    } = req.body;

    if (!username) {
      return res.status(400).json({ message: "Username is required" });
    }

    // Check if a portfolio with the same portfolioId exists
    let existingPortfolio = await Portfolio.findOne({ portfolioId });

    if (existingPortfolio) {
      // Update the existing portfolio
      existingPortfolio.pageId = pageId || existingPortfolio.pageId;
      existingPortfolio.title = title || existingPortfolio.title;
      existingPortfolio.quote = quote || existingPortfolio.quote;
      existingPortfolio.backgroundImage = backgroundImage || existingPortfolio.backgroundImage;
      existingPortfolio.modelImage = modelImage || existingPortfolio.modelImage;
      existingPortfolio.label = label || existingPortfolio.label;
      existingPortfolio.styledContent = styledContent || existingPortfolio.styledContent;
      existingPortfolio.elementPositions = elementPositions || existingPortfolio.elementPositions;
      existingPortfolio.smallImages = smallImages || existingPortfolio.smallImages;
      existingPortfolio.heading = heading || existingPortfolio.heading;
      existingPortfolio.description = description || existingPortfolio.description;
      existingPortfolio.innerContainerImage = innerContainerImage || existingPortfolio.innerContainerImage;
      existingPortfolio.bgColor = bgColor || existingPortfolio.bgColor;

      await existingPortfolio.save();
      return res.status(200).json({ message: "Portfolio updated successfully", portfolio: existingPortfolio });
    } else {
      // Create a new portfolio if no matching portfolioId exists
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
        heading,
        description,
        innerContainerImage,
        bgColor,
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

    if (!username) {
      return res.status(400).json({ message: "Username is required" });
    }

    const portfolios = await Portfolio.find({ username }); // Fetch all portfolios for the user

    if (!portfolios.length) {
      return res.status(404).json({ message: "No portfolios found for this user" });
    }

    res.status(200).json(portfolios);
  } catch (error) {
    res.status(500).json({ message: "Error loading portfolio", error });
  }
};