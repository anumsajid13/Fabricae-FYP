const User = require("../data/models/User.js");

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

module.exports = { getUserProfile, updateUserProfile };
