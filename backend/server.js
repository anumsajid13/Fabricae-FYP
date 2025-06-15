const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./Data/mongoConnection");
const promptDesignRoutes = require("./routes/promptDesign");
const authRoutes = require("./routes/authRoutes.js");
const userRoutes = require("./routes/userRoutes.js");
const path = require("path");
const Portfolio = require("./data/models/Portfolio.js");

const portfolioRoutes = require("./routes/portRoutes"); 
const successStoriesRoutes = require('./routes/successStories');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

connectDB();

require("events").EventEmitter.defaultMaxListeners = 20;
const modelRoutes = require("./routes/modelRoutes");

// Use design routes
app.use("/api/prompt-designs", promptDesignRoutes);

app.use("/api/auth", authRoutes);

app.use("/api/users", userRoutes);

app.use("/api/model-routes", modelRoutes);

// Serve static files from the "uploads" directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api", portfolioRoutes); 

app.use('/api/success-stories', successStoriesRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
