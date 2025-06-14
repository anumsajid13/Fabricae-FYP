const User = require("../Data/Models/User.js");
const { getStorage } = require('firebase-admin/storage');
const path = require('path');
const uuid = require('uuid').v4;

// Controller to fetch user profile details
const getUserProfile = async (req, res) => {
  try {
    const { email } = req.params;

    // Fetch the required fields from the database
    const user = await User.findOne({ email }).select(
      'firstname lastname username email country profilePictureUrl'
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      country: user.country || '',
      profilePictureUrl: user.profilePictureUrl || '',
      username: user.username
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Controller to update user profile details
const updateUserProfile = async (req, res) => {
    try {
      const { email } = req.params;
      const { firstname, lastname, username, country, profilePictureUrl } = req.body;

      // Find the user by email and update the fields
      const updatedUser = await User.findOneAndUpdate(
        { email },
        { firstname, lastname, username, country, profilePictureUrl },
        { new: true } // Return the updated document
      );

      if (!updatedUser) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.status(200).json({
        message: "Profile updated successfully",
        user: {
          firstname: updatedUser.firstname,
          lastname: updatedUser.lastname,
          email: updatedUser.email,
          country: updatedUser.country || '',
          profilePictureUrl: updatedUser.profilePictureUrl || '',
          username: updatedUser.username,
        },
      });
    } catch (error) {
      console.error("Error updating user profile:", error);
      res.status(500).json({ message: "Server error" });
    }
  };


  const uploadPdfToPortfolio = async (req, res) => {
  try {
    const { email } = req.params;

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const bucket = getStorage().bucket();
    const fileName = `portfolios/${email}/${Date.now()}_${req.file.originalname}`;
    const file = bucket.file(fileName);

    const stream = file.createWriteStream({
      metadata: {
        contentType: req.file.mimetype,
        metadata: {
          firebaseStorageDownloadTokens: uuid(),
        },
      },
    });

    stream.on('error', (err) => {
      console.error('Upload error:', err);
      res.status(500).json({ message: 'Upload error' });
    });

    stream.on('finish', async () => {
      const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(fileName)}?alt=media&token=${file.metadata.metadata.firebaseStorageDownloadTokens}`;

      const updatedUser = await User.findOneAndUpdate(
        { email },
        { $push: { portfolioPdfUrls: publicUrl } },
        { new: true }
      );

      if (!updatedUser) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.status(200).json({
        message: 'Portfolio PDF uploaded successfully',
        portfolioPdfUrls: updatedUser.portfolioPdfUrls,
      });
    });

    stream.end(req.file.buffer);
  } catch (error) {
    console.error('Error uploading portfolio PDF:', error);
    res.status(500).json({ message: 'Server error' });
  }
  };

module.exports = { getUserProfile, updateUserProfile, uploadPdfToPortfolio };
