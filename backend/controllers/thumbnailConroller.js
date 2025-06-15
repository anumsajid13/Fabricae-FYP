const fs = require('fs');
const path = require('path');
const pdf = require('pdf-poppler');
const axios = require('axios');
const UserPortfolio = require("../Data/Models/UserPortfolio");

// Firebase Admin SDK (assuming you're using Firebase for file storage)
const admin = require('firebase-admin');
const bucket = admin.storage().bucket();

// Define the thumbnails directory
const thumbnailsDir = path.join(__dirname, '..', 'uploads', 'thumbnails');

// Ensure directories exist
const ensureDirectoryExists = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

// Generate and store PDF thumbnail
exports.generateAndStorePdfThumbnail = async (portfolioId) => {
  try {
    // Ensure portfolioId is a string
    const portfolioIdString = portfolioId.toString();

    const portfolio = await UserPortfolio.findById(portfolioId);
    if (!portfolio) {
      throw new Error("Portfolio not found");
    }

    console.log(`🔄 Starting thumbnail generation for portfolio: ${portfolioIdString}`);

    // Update status to generating
    await UserPortfolio.findByIdAndUpdate(portfolioId, {
      thumbnailStatus: 'pending'
    });

    // Ensure temp and thumbnails directories exist
    const tempDir = path.join(__dirname, '..', 'temp');
    ensureDirectoryExists(tempDir);
    ensureDirectoryExists(thumbnailsDir);

    // Download PDF from Firebase URL
    console.log(`📥 Downloading PDF from: ${portfolio.pdfUrl}`);
    const pdfResponse = await axios({
      method: 'GET',
      url: portfolio.pdfUrl,
      responseType: 'arraybuffer',
      timeout: 30000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    // Create temporary PDF file
    const tempPdfPath = path.join(tempDir, `${portfolioIdString}.pdf`);

    console.log(`💾 Writing temporary PDF to: ${tempPdfPath}`);
    fs.writeFileSync(tempPdfPath, pdfResponse.data);

    // Verify PDF file was created and has content
    if (!fs.existsSync(tempPdfPath)) {
      throw new Error("Failed to create temporary PDF file");
    }

    const stats = fs.statSync(tempPdfPath);
    if (stats.size === 0) {
      throw new Error("Downloaded PDF file is empty");
    }

    console.log(`✅ PDF file created successfully (${stats.size} bytes)`);

    // Convert first page to image using pdf-poppler
    console.log(`🖼️  Converting PDF to thumbnail...`);

    const options = {
      format: 'jpeg',
      out_dir: thumbnailsDir,
      out_prefix: portfolioIdString,
      page: 1,
      single_file: true,
      scale: 1024 // Scale to 1024px width
    };

    // Use absolute paths to avoid any path resolution issues
    const absoluteTempPdfPath = path.resolve(tempPdfPath);
    const absoluteThumbnailsDir = path.resolve(thumbnailsDir);

    console.log(`📂 Input PDF: ${absoluteTempPdfPath}`);
    console.log(`📂 Output Dir: ${absoluteThumbnailsDir}`);

    await pdf.convert(absoluteTempPdfPath, {
      ...options,
      out_dir: absoluteThumbnailsDir
    });

    // Clean up temp PDF file
    try {
      fs.unlinkSync(tempPdfPath);
      console.log(`🗑️  Cleaned up temporary PDF file`);
    } catch (cleanupError) {
      console.warn(`⚠️  Failed to cleanup temp file: ${cleanupError.message}`);
    }

    // Find the generated thumbnail file
    const possibleThumbnailNames = [
      `${portfolioIdString}-01.jpg`,
      `${portfolioIdString}-1.jpg`,
      `${portfolioIdString}.jpg`
    ];

    let generatedThumbnailPath = null;
    for (const name of possibleThumbnailNames) {
      const possiblePath = path.join(thumbnailsDir, name);
      if (fs.existsSync(possiblePath)) {
        generatedThumbnailPath = possiblePath;
        console.log(`📸 Found generated thumbnail: ${name}`);
        break;
      }
    }

    if (!generatedThumbnailPath) {
      // List files in thumbnail directory for debugging
      const files = fs.readdirSync(thumbnailsDir);
      console.error(`❌ No thumbnail file found. Files in directory:`, files);
      throw new Error("Generated thumbnail file not found");
    }

    // Rename to standardized name if needed
    const finalThumbnailPath = path.join(thumbnailsDir, `${portfolioIdString}.jpg`);
    if (generatedThumbnailPath !== finalThumbnailPath) {
      fs.renameSync(generatedThumbnailPath, finalThumbnailPath);
      console.log(`📝 Renamed thumbnail to: ${portfolioIdString}.jpg`);
    }

    let thumbnailUrl;

    // Option 1: Store locally and serve from your server
    // thumbnailUrl = `/thumbnails/${portfolioIdString}.jpg`;

    // Option 2: Upload to Firebase Storage
    if (fs.existsSync(finalThumbnailPath)) {
      console.log(`☁️  Uploading thumbnail to Firebase Storage...`);
      const destination = `thumbnails/${portfolioIdString}.jpg`;

      await bucket.upload(finalThumbnailPath, {
        destination: destination,
        metadata: {
          contentType: 'image/jpeg',
          cacheControl: 'public, max-age=86400'
        }
      });

      // Get public URL
      const file = bucket.file(destination);
      await file.makePublic();
      thumbnailUrl = `https://storage.googleapis.com/${bucket.name}/${destination}`;

      console.log(`✅ Thumbnail uploaded to: ${thumbnailUrl}`);

      // Clean up local file
      try {
        fs.unlinkSync(finalThumbnailPath);
        console.log(`🗑️  Cleaned up local thumbnail file`);
      } catch (cleanupError) {
        console.warn(`⚠️  Failed to cleanup local thumbnail: ${cleanupError.message}`);
      }
    } else {
      throw new Error("Final thumbnail file does not exist");
    }

    // Update portfolio with thumbnail URL
    await UserPortfolio.findByIdAndUpdate(portfolioId, {
      thumbnailUrl: thumbnailUrl,
      thumbnailGeneratedAt: new Date(),
      thumbnailStatus: 'generated'
    });

    console.log(`🎉 Thumbnail generation completed for portfolio: ${portfolioIdString}`);
    return thumbnailUrl;

  } catch (error) {
    console.error(`❌ Error generating thumbnail for portfolio ${portfolioId}:`, error);

    // Clean up any temporary files
    try {
      const portfolioIdString = portfolioId.toString();
      const tempPdfPath = path.join(__dirname, '..', 'temp', `${portfolioIdString}.pdf`);
      if (fs.existsSync(tempPdfPath)) {
        fs.unlinkSync(tempPdfPath);
      }
    } catch (cleanupError) {
      console.warn(`⚠️  Cleanup error:`, cleanupError.message);
    }

    // Update status to failed
    try {
      await UserPortfolio.findByIdAndUpdate(portfolioId, {
        thumbnailStatus: 'failed',
        thumbnailError: error.message,
        thumbnailFailedAt: new Date()
      });
    } catch (updateError) {
      console.error(`❌ Failed to update portfolio status:`, updateError);
    }

    throw error;
  }
};

// Get PDF thumbnail (now from database)
exports.getPdfThumbnail = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Portfolio ID is required" });
    }

    const portfolio = await UserPortfolio.findById(id);
    if (!portfolio) {
      return res.status(404).json({ message: "Portfolio not found" });
    }

    // If thumbnail exists, return it
    if (portfolio.thumbnailUrl && portfolio.thumbnailStatus === 'generated') {
      // For local storage
      if (portfolio.thumbnailUrl.startsWith('/thumbnails/')) {
        const thumbnailPath = path.join(__dirname, '../public', portfolio.thumbnailUrl);
        if (fs.existsSync(thumbnailPath)) {
          res.setHeader('Cache-Control', 'public, max-age=86400');
          res.setHeader('Content-Type', 'image/jpeg');
          return res.sendFile(path.resolve(thumbnailPath));
        }
      } else {
        // For remote storage (Firebase, S3, etc.)
        return res.redirect(portfolio.thumbnailUrl);
      }
    }

    // If thumbnail is being generated
    if (portfolio.thumbnailStatus === 'pending') {
      return res.status(202).json({
        message: "Thumbnail is being generated",
        status: "pending"
      });
    }

    // Generate thumbnail if it doesn't exist or failed
    try {
      console.log(`🔄 Generating thumbnail for portfolio: ${id}`);
      const thumbnailUrl = await exports.generateAndStorePdfThumbnail(id);

      // Return the newly generated thumbnail
      if (thumbnailUrl.startsWith('/thumbnails/')) {
        const thumbnailPath = path.join(__dirname, '../public', thumbnailUrl);
        if (fs.existsSync(thumbnailPath)) {
          res.setHeader('Cache-Control', 'public, max-age=86400');
          res.setHeader('Content-Type', 'image/jpeg');
          return res.sendFile(path.resolve(thumbnailPath));
        }
      } else {
        return res.redirect(thumbnailUrl);
      }
    } catch (error) {
      console.error(`❌ Failed to generate thumbnail for portfolio ${id}:`, error.message);

      // Return placeholder if generation fails
      const placeholderPath = path.join(__dirname, '../public/images/pdf-placeholder.jpg');
      if (fs.existsSync(placeholderPath)) {
        res.setHeader('Content-Type', 'image/jpeg');
        return res.sendFile(path.resolve(placeholderPath));
      } else {
        return res.status(404).json({
          message: "Thumbnail not available",
          error: error.message
        });
      }
    }

  } catch (error) {
    console.error("❌ Error getting PDF thumbnail:", error);
    res.status(500).json({
      message: "Error getting PDF thumbnail",
      error: error.message
    });
  }
};

// Generate thumbnail immediately after PDF upload
exports.generateThumbnailOnUpload = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Portfolio ID is required" });
    }

    console.log(`🚀 Generating thumbnail on upload for portfolio: ${id}`);
    const thumbnailUrl = await exports.generateAndStorePdfThumbnail(id);

    res.status(200).json({
      message: "Thumbnail generated successfully",
      portfolioId: id,
      thumbnailUrl: thumbnailUrl
    });

  } catch (error) {
    console.error("❌ Error generating PDF thumbnail:", error);
    res.status(500).json({
      message: "Error generating PDF thumbnail",
      error: error.message
    });
  }
};

// Batch generate thumbnails for existing portfolios without thumbnails
exports.generateMissingThumbnails = async (req, res) => {
  try {
    const portfolios = await UserPortfolio.find({
      $or: [
        { thumbnailUrl: null },
        { thumbnailUrl: { $exists: false } },
        { thumbnailStatus: 'failed' },
        { thumbnailStatus: { $exists: false } }
      ]
    }, '_id pdfUrl');

    console.log(`📋 Found ${portfolios.length} portfolios needing thumbnails`);

    const results = [];
    let processed = 0;
    let successful = 0;
    let failed = 0;

    for (const portfolio of portfolios) {
      try {
        console.log(`🔄 Processing ${processed + 1}/${portfolios.length}: ${portfolio._id}`);
        const thumbnailUrl = await exports.generateAndStorePdfThumbnail(portfolio._id);
        results.push({
          portfolioId: portfolio._id,
          success: true,
          thumbnailUrl
        });
        successful++;
      } catch (error) {
        console.error(`❌ Failed for portfolio ${portfolio._id}:`, error.message);
        results.push({
          portfolioId: portfolio._id,
          success: false,
          error: error.message
        });
        failed++;
      }

      processed++;

      // Add small delay to prevent overwhelming the system
      if (processed % 5 === 0) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    console.log(`✅ Batch processing completed: ${successful} successful, ${failed} failed`);

    res.status(200).json({
      message: "Thumbnail generation completed",
      total: portfolios.length,
      successful,
      failed,
      results
    });

  } catch (error) {
    console.error("❌ Error in batch thumbnail generation:", error);
    res.status(500).json({
      message: "Error generating thumbnails",
      error: error.message
    });
  }
};

// Get thumbnail URL from database (for API responses)
exports.getThumbnailUrl = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Portfolio ID is required" });
    }

    const portfolio = await UserPortfolio.findById(id, 'thumbnailUrl thumbnailStatus thumbnailError thumbnailGeneratedAt');
    if (!portfolio) {
      return res.status(404).json({ message: "Portfolio not found" });
    }

    res.status(200).json({
      portfolioId: id,
      thumbnailUrl: portfolio.thumbnailUrl,
      status: portfolio.thumbnailStatus,
      generatedAt: portfolio.thumbnailGeneratedAt,
      error: portfolio.thumbnailError
    });

  } catch (error) {
    console.error("❌ Error getting thumbnail URL:", error);
    res.status(500).json({
      message: "Error getting thumbnail URL",
      error: error.message
    });
  }
};


 // Add this to your user-portfolio controller
exports.getThumbnailStatus = async (req, res) => {
  try {
    const { portfolioId } = req.params;

    if (!portfolioId) {
      return res.status(400).json({
        success: false,
        message: "Portfolio ID is required"
      });
    }

    const portfolio = await UserPortfolio.findById(portfolioId,
      'thumbnailUrl thumbnailStatus thumbnailGeneratedAt thumbnailError'
    );

    if (!portfolio) {
      return res.status(404).json({
        success: false,
        message: "Portfolio not found"
      });
    }

    // Return the current thumbnail status
    return res.status(200).json({
      success: true,
      portfolioId: portfolio._id,
      thumbnailStatus: portfolio.thumbnailStatus || 'pending',
      thumbnailUrl: portfolio.thumbnailUrl,
      thumbnailGeneratedAt: portfolio.thumbnailGeneratedAt,
      thumbnailError: portfolio.thumbnailError
    });

  } catch (error) {
    console.error('Error checking thumbnail status:', error);
    return res.status(500).json({
      success: false,
      message: "Error checking thumbnail status",
      error: error.message
    });
  }
};

module.exports = {
  generateAndStorePdfThumbnail: exports.generateAndStorePdfThumbnail,
  getPdfThumbnail: exports.getPdfThumbnail,
  generateThumbnailOnUpload: exports.generateThumbnailOnUpload,
  generateMissingThumbnails: exports.generateMissingThumbnails,
  getThumbnailUrl: exports.getThumbnailUrl,
  getThumbnailStatus: exports.getThumbnailStatus
};