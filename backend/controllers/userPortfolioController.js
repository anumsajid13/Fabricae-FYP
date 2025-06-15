const UserPortfolio = require("../Data/Models/UserPortfolio");
const thumbnailController = require("./thumbnailConroller");

// Upload/Create new portfolio
exports.uploadPortfolio = async (req, res) => {
  try {
    const { email, name, category, description, pdfUrl, fileName } = req.body;

    console.log("ndnddn", req.body);

    // Validate required fields
    if (!email || !name || !category || !pdfUrl || !fileName) {
      return res.status(400).json({
        message: "Email, name, category, pdfUrl, and fileName are required",
      });
    }

    // Validate PDF URL format (Firebase Storage URL)
    const isValidPdfUrl =
      (pdfUrl.includes("firebasestorage.googleapis.com") ||
        pdfUrl.includes("storage.googleapis.com")) &&
      pdfUrl.includes(".pdf");

    if (!isValidPdfUrl) {
      return res.status(400).json({
        message:
          "Invalid PDF URL. Must be a Firebase Storage PDF link ending with .pdf",
      });
    }

    // Create new portfolio with thumbnail fields
    const newPortfolio = new UserPortfolio({
      email,
      name,
      category,
      description: description || null,
      pdfUrl,
      fileName,
      uploadDate: new Date(),
      isPublic: true,
      views: 0,
      likes: 0,
      // Initialize thumbnail fields
      thumbnailUrl: null,
      thumbnailStatus: "pending",
      thumbnailGeneratedAt: null,
    });

    await newPortfolio.save();

    // Generate thumbnail asynchronously (don't wait for it)
    thumbnailController
      .generateAndStorePdfThumbnail(newPortfolio._id)
      .then(() => {
        console.log(
          `✅ Thumbnail generated for portfolio: ${newPortfolio.name} (${newPortfolio._id})`
        );
      })
      .catch((error) => {
        console.error(
          `❌ Failed to generate thumbnail for portfolio ${newPortfolio._id}:`,
          error.message
        );
      });

    res.status(201).json({
      message: "Portfolio uploaded successfully",
      portfolio: newPortfolio,
      thumbnailStatus: "generating",
    });
  } catch (error) {
    console.error("Error uploading portfolio:", error);
    res.status(500).json({
      message: "Error uploading portfolio",
      error: error.message,
    });
  }
};

// Get portfolio by ID
exports.getPortfolioById = async (req, res) => {
  try {
    const { id } = req.params;

    const portfolio = await UserPortfolio.findById(id);

    if (!portfolio) {
      return res.status(404).json({ message: "Portfolio not found" });
    }

    // Increment view count
    portfolio.views += 1;
    await portfolio.save();

    res.status(200).json(portfolio);
  } catch (error) {
    console.error("Error fetching portfolio:", error);
    res.status(500).json({
      message: "Error fetching portfolio",
      error: error.message,
    });
  }
};

// Get all portfolios by user email
exports.getPortfoliosByEmail = async (req, res) => {
  try {
    const { email } = req.params;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const portfolios = await UserPortfolio.find({ email })
      .sort({ uploadDate: -1 }) // Most recent first
      .select(
        "_id email name category description fileName pdfUrl uploadDate views likes thumbnailUrl thumbnailStatus thumbnailGeneratedAt isPublic"
      );

    res.status(200).json({
      portfolios,
      count: portfolios.length,
    });
  } catch (error) {
    console.error("Error fetching user portfolios:", error);
    res.status(500).json({
      message: "Error fetching user portfolios",
      error: error.message,
    });
  }
};

// Get all public portfolios for explore page
exports.getAllPublicPortfolios = async (req, res) => {
  try {
    const { page = 1, limit = 12, category, sortBy = "uploadDate" } = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Build query
    const query = { isPublic: true };
    if (category && category !== "all") {
      query.category = category;
    }

    // Build sort options
    let sortOptions = {};
    switch (sortBy) {
      case "views":
        sortOptions = { views: -1, uploadDate: -1 };
        break;
      case "likes":
        sortOptions = { likes: -1, uploadDate: -1 };
        break;
      case "uploadDate":
      default:
        sortOptions = { uploadDate: -1 };
        break;
    }

    // Get portfolios with pagination, including thumbnail data
    const portfolios = await UserPortfolio.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum)
      .select(
        "_id email name category description fileName pdfUrl uploadDate views likes thumbnailUrl thumbnailStatus"
      );

    // Get total count for pagination
    const totalCount = await UserPortfolio.countDocuments(query);
    const totalPages = Math.ceil(totalCount / limitNum);

    res.status(200).json({
      portfolios,
      pagination: {
        currentPage: pageNum,
        totalPages,
        totalCount,
        hasNextPage: pageNum < totalPages,
        hasPrevPage: pageNum > 1,
      },
    });
  } catch (error) {
    console.error("Error fetching public portfolios:", error);
    res.status(500).json({
      message: "Error fetching public portfolios",
      error: error.message,
    });
  }
};

// Update portfolio
exports.updatePortfolio = async (req, res) => {
  try {
    const { id } = req.params;
    const { email } = req.headers; // Get email from headers for authorization
    const updateData = req.body;

    const portfolio = await UserPortfolio.findById(id);

    if (!portfolio) {
      return res.status(404).json({ message: "Portfolio not found" });
    }

    // Check if user owns this portfolio
    if (portfolio.email !== email) {
      return res
        .status(403)
        .json({ message: "Unauthorized to update this portfolio" });
    }

    // Update only allowed fields
    const allowedUpdates = ["name", "category", "description", "isPublic"];
    const updates = {};

    allowedUpdates.forEach((field) => {
      if (updateData[field] !== undefined) {
        updates[field] = updateData[field];
      }
    });

    const updatedPortfolio = await UserPortfolio.findByIdAndUpdate(
      id,
      updates,
      { new: true }
    );

    res.status(200).json({
      message: "Portfolio updated successfully",
      portfolio: updatedPortfolio,
    });
  } catch (error) {
    console.error("Error updating portfolio:", error);
    res.status(500).json({
      message: "Error updating portfolio",
      error: error.message,
    });
  }
};

// Delete portfolio
exports.deletePortfolio = async (req, res) => {
  try {
    const { id } = req.params;
    const { email } = req.headers; // Get email from headers for authorization

    const portfolio = await UserPortfolio.findById(id);

    if (!portfolio) {
      return res.status(404).json({ message: "Portfolio not found" });
    }

    // Check if user owns this portfolio
    if (portfolio.email !== email) {
      return res
        .status(403)
        .json({ message: "Unauthorized to delete this portfolio" });
    }

    // Delete the portfolio
    await UserPortfolio.findByIdAndDelete(id);

    // Optional: Clean up thumbnail file (you can implement this based on your storage solution)
    try {
      if (portfolio.thumbnailUrl) {
        // If storing locally
        const fs = require("fs");
        const path = require("path");

        if (portfolio.thumbnailUrl.startsWith("/thumbnails/")) {
          const thumbnailPath = path.join(
            __dirname,
            "../public",
            portfolio.thumbnailUrl
          );
          if (fs.existsSync(thumbnailPath)) {
            fs.unlinkSync(thumbnailPath);
            console.log(`🗑️ Deleted thumbnail file for portfolio ${id}`);
          }
        }

        // If using cloud storage (Firebase, S3, etc.), add cleanup logic here
        // Example for Firebase:
        // const admin = require('firebase-admin');
        // const bucket = admin.storage().bucket();
        // await bucket.file(`thumbnails/${id}.jpg`).delete();
      }
    } catch (cleanupError) {
      console.error("Error cleaning up thumbnail:", cleanupError.message);
      // Don't fail the deletion if thumbnail cleanup fails
    }

    res.status(200).json({ message: "Portfolio deleted successfully" });
  } catch (error) {
    console.error("Error deleting portfolio:", error);
    res.status(500).json({
      message: "Error deleting portfolio",
      error: error.message,
    });
  }
};

// Like/Unlike portfolio
exports.toggleLike = async (req, res) => {
  try {
    const { id } = req.params;
    const { action } = req.body; // 'like' or 'unlike'

    const portfolio = await UserPortfolio.findById(id);

    if (!portfolio) {
      return res.status(404).json({ message: "Portfolio not found" });
    }

    if (action === "like") {
      portfolio.likes += 1;
    } else if (action === "unlike" && portfolio.likes > 0) {
      portfolio.likes -= 1;
    }

    await portfolio.save();

    res.status(200).json({
      message: `Portfolio ${action}d successfully`,
      likes: portfolio.likes,
    });
  } catch (error) {
    console.error("Error toggling like:", error);
    res.status(500).json({
      message: "Error toggling like",
      error: error.message,
    });
  }
};

// Get portfolio thumbnail status
exports.getThumbnailStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const portfolio = await UserPortfolio.findById(
      id,
      "thumbnailUrl thumbnailStatus thumbnailGeneratedAt"
    );

    if (!portfolio) {
      return res.status(404).json({ message: "Portfolio not found" });
    }

    res.status(200).json({
      portfolioId: id,
      thumbnailUrl: portfolio.thumbnailUrl,
      thumbnailStatus: portfolio.thumbnailStatus,
      thumbnailGeneratedAt: portfolio.thumbnailGeneratedAt,
    });
  } catch (error) {
    console.error("Error getting thumbnail status:", error);
    res.status(500).json({
      message: "Error getting thumbnail status",
      error: error.message,
    });
  }
};

// Regenerate thumbnail for a portfolio
exports.regenerateThumbnail = async (req, res) => {
  try {
    const { id } = req.params;
    const { email } = req.headers; // Get email from headers for authorization

    const portfolio = await UserPortfolio.findById(id);

    if (!portfolio) {
      return res.status(404).json({ message: "Portfolio not found" });
    }

    // Check if user owns this portfolio
    if (portfolio.email !== email) {
      return res
        .status(403)
        .json({ message: "Unauthorized to regenerate thumbnail" });
    }

    // Generate thumbnail
    try {
      const thumbnailUrl =
        await thumbnailController.generateAndStorePdfThumbnail(id);

      res.status(200).json({
        message: "Thumbnail regenerated successfully",
        thumbnailUrl: thumbnailUrl,
      });
    } catch (thumbnailError) {
      res.status(500).json({
        message: "Failed to regenerate thumbnail",
        error: thumbnailError.message,
      });
    }
  } catch (error) {
    console.error("Error regenerating thumbnail:", error);
    res.status(500).json({
      message: "Error regenerating thumbnail",
      error: error.message,
    });
  }
};

// Get portfolios with filtering and search
exports.searchPortfolios = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      category,
      search,
      sortBy = "uploadDate",
      email, // Optional: filter by specific user
    } = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Build query
    const query = { isPublic: true };

    if (category && category !== "all") {
      query.category = category;
    }

    if (email) {
      query.email = email;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
      ];
    }

    // Build sort options
    let sortOptions = {};
    switch (sortBy) {
      case "views":
        sortOptions = { views: -1, uploadDate: -1 };
        break;
      case "likes":
        sortOptions = { likes: -1, uploadDate: -1 };
        break;
      case "name":
        sortOptions = { name: 1 };
        break;
      case "uploadDate":
      default:
        sortOptions = { uploadDate: -1 };
        break;
    }

    // Get portfolios with pagination, including thumbnail data
    const portfolios = await UserPortfolio.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum)
      .select(
        "_id email name category description fileName pdfUrl uploadDate views likes thumbnailUrl thumbnailStatus"
      );

    // Get total count for pagination
    const totalCount = await UserPortfolio.countDocuments(query);
    const totalPages = Math.ceil(totalCount / limitNum);

    res.status(200).json({
      portfolios,
      pagination: {
        currentPage: pageNum,
        totalPages,
        totalCount,
        hasNextPage: pageNum < totalPages,
        hasPrevPage: pageNum > 1,
      },
      searchCriteria: {
        category,
        search,
        sortBy,
        email,
      },
    });
  } catch (error) {
    console.error("Error searching portfolios:", error);
    res.status(500).json({
      message: "Error searching portfolios",
      error: error.message,
    });
  }
};

// Get portfolio analytics (for dashboard)
exports.getPortfolioAnalytics = async (req, res) => {
  try {
    const { email } = req.params;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // Get user's portfolios with analytics
    const portfolios = await UserPortfolio.find({ email })
      .select("_id name category uploadDate views likes thumbnailStatus")
      .sort({ uploadDate: -1 });

    // Calculate analytics
    const analytics = {
      totalPortfolios: portfolios.length,
      totalViews: portfolios.reduce((sum, p) => sum + p.views, 0),
      totalLikes: portfolios.reduce((sum, p) => sum + p.likes, 0),
      thumbnailStats: {
        generated: portfolios.filter((p) => p.thumbnailStatus === "generated")
          .length,
        pending: portfolios.filter((p) => p.thumbnailStatus === "pending")
          .length,
        failed: portfolios.filter((p) => p.thumbnailStatus === "failed").length,
      },
      categoryBreakdown: portfolios.reduce((acc, p) => {
        acc[p.category] = (acc[p.category] || 0) + 1;
        return acc;
      }, {}),
      recentPortfolios: portfolios.slice(0, 5), // Last 5 portfolios
    };

    res.status(200).json({
      analytics,
      portfolios,
    });
  } catch (error) {
    console.error("Error getting portfolio analytics:", error);
    res.status(500).json({
      message: "Error getting portfolio analytics",
      error: error.message,
    });
  }
};
