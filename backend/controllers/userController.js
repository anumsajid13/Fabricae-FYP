const Chat = require('../Data/Models/Chat');
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

  const getUserPortfolios = async (req, res) => {
  try {
    const { email } = req.params;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      message: 'Portfolio PDFs fetched successfully',
      portfolioPdfUrls: user.portfolioPdfUrls,
    });
  } catch (error) {
    console.error('Error fetching portfolio PDFs:', error);
    res.status(500).json({ message: 'Server error' });
  }
  };


  const getContacts = async (req, res) => {
    const { userEmail } = req.params;

    try {
      // Find the user by email
      const user = await User.findOne({ email: userEmail });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Find all chats where the user is a participant
      const chats = await Chat.find({
        'participants.userId': user._id
      }).populate('participants.userId', 'firstname lastname email username');


      // Prepare the contacts list
      const contacts = chats.map((chat) => {
        // Find the other participant (the one who is not the logged-in user)
        console.log("ser._id:" ,user._id.toString())

        const otherParticipant = chat.participants.find((participant) => {
          console.log("participant.userId.toString(): ", participant.userId.toString());
          return participant.userId._id.toString() !== user._id.toString();
        });

        // If the other participant is not found, it means only one user is in the chat (the logged-in user)
        if (!otherParticipant) {
          return null; // Skip if the logged-in user is the only participant
        }

        // Get the last message from the chat
        const lastMessage = chat.messages[chat.messages.length - 1];

        return {
          id:otherParticipant.userId._id,
          Chatid: chat._id,
          name: `${otherParticipant.userId.firstname} ${otherParticipant.userId.lastname}`,
          email: otherParticipant.userId.email, // Include the email of the other participant
          lastMessage: lastMessage.messageText,
          lastMessageTime: lastMessage.timestamp,
          newMessages: chat.messages.filter(
            (msg) => msg.senderId.toString() !== user._id.toString()
          ).length, // Count unread messages
        };
      }).filter(contact => contact !== null); // Remove any null values

      res.status(200).json({ contacts });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error fetching contacts' });
    }
  };


module.exports = { getUserProfile, updateUserProfile, getContacts, uploadPdfToPortfolio, getUserPortfolios };
