
const User = require("../data/models/User.js");
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

    // Generate a unique token
    const token = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    // Save the token and expiration in memory (or DB)
    resetTokens[hashedToken] = { userId: user._id, expires: Date.now() + 3600 * 1000 }; // 1 hour

    // Create reset link
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

    // Send the reset link via email
    await transporter.sendMail({
      from: process.env.EMAIL,
      to: email,
      subject: "Password Reset Request",
      text: `Reset your password using this link: ${resetLink}`,
    });

    res.status(200).json({ message: "Password reset email sent." });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Reset Password
exports.resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    // Hash the token and find the corresponding record
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const resetData = resetTokens[hashedToken];

    if (!resetData || Date.now() > resetData.expires) {
      return res.status(400).json({ message: "Invalid or expired token." });
    }

    // Find the user and update their password
    const user = await User.findById(resetData.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    // Remove the used token
    delete resetTokens[hashedToken];

    res.status(200).json({ message: "Password reset successful." });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};