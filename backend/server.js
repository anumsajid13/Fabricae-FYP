const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("../Data/mongoConnection");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

connectDB();

const promptDesignRoutes = require("./routes/promptDesign");
app.use("/api/prompt-designs", promptDesignRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
