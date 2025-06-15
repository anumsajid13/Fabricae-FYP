
const User = require("../Data/Models/User.js");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");


// Memory-based storage for reset tokens (replace with DB in production)
const resetTokens = {};

// Configure nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Utility function to generate JWT
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "1h" });
};

// Register a new user
exports.registerUser = async (req, res) => {
  const { firstname, lastname, email, password } = req.body;

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use. Try a different email." });
    }

    const username=email;
    const role="Designer";

    // Create a new user
    const newUser = new User({ firstname, lastname, email,username, password, role });
    await newUser.save();

    // Generate token
    const token = generateToken(newUser._id);

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser._id,
        firstname: newUser.firstname,
        lastname: newUser.lastname,
        email: newUser.email,
        role: newUser.role,
      },
      token,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Login a user
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User does not exist! try logging in with different email" });
    }

    // Check if the password is correct
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Your password is not correct. Try again." });
    }

    // Generate token
    const token = generateToken(user._id);

    res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// Forgot Password: Request Password Reset
exports.requestPasswordReset = async (req, res) => {
  const { email } = req.body;

  try {
    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User with this email does not exist." });
    }


    const token = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");


    resetTokens[hashedToken] = { userId: user._id, expires: Date.now() + 3600 * 1000 }; // 1 hour

    console.log("Reset in req", resetTokens)

    // Create reset link
    const resetLink = `${process.env.FRONTEND_URL}/Login?token=${token}&reset=true`;

    await transporter.sendMail({
      from: process.env.EMAIL,
      to: email,
      subject: "Password Reset Request",
      text: `Hi there,

          We’ve received a request to reset the password for your account. If this was you, simply click the link below to create a new password:

          ${resetLink}

          If you didn’t request this change, no worries! Your account is still safe. You can ignore this message, and nothing will be changed.

          If you have any questions or need assistance, feel free to reach out to us.

          Best wishes,
          The Fabricae Team`

    });

    res.status(200).json({ message: "Password reset email sent." });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Reset Password
exports.resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  console.log("token", token, "newPassword", newPassword);

  try {
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    console.log('Hashed token:', hashedToken);
    const resetData = resetTokens[hashedToken];

    if (!resetData || Date.now() > resetData.expires) {
      return res.status(400).json({ message: "Invalid or expired token." });
    }

    const user = await User.findById(resetData.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }


    user.password = newPassword;


    await user.save();


    delete resetTokens[hashedToken];

    res.status(200).json({ message: "Password reset successful." });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// Controller for getting or creating a user based on email ONLYYY
exports.getOrCreateUser = async (req, res) => {
  const { email } = req.body;
  console.log("email",email)
  try {
    // Check if the user already exists
    let user = await User.findOne({ email });
    console.log("user",user)
    if (!user) {
      // If user doesn't exist, create a new user with the provided email
      const username = email;
      const role = "Designer";

      user = new User({
        email,
        username,
        role,
      });
      console.log("user",user)
      await user.save();
    }

    const token = generateToken(user._id);

    res.status(200).json({
      message: user ? "User found" : "User created successfully",
      user: {
        id: user._id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        username: user.username,
        role: user.role,
        profilePictureUrl: user.profilePictureUrl,
        country: user.country,
      },
      token,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
