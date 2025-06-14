const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const WebSocket = require('ws');
const http = require('http');
const connectDB = require("./Data/mongoConnection");
const promptDesignRoutes = require("./routes/promptDesign");
const authRoutes = require("./routes/authRoutes.js");
const userRoutes = require("./routes/userRoutes.js");
const path = require("path");
const Portfolio = require("./data/models/Portfolio.js");
const portfolioRoutes = require("./routes/portRoutes");
const chatRoutes = require("./routes/chatRoutes.js");
const modelRoutes =require("./routes/modelRoutes.js")
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

connectDB();

// Create a single HTTP server to handle both HTTP requests and WebSocket connections
const server = http.createServer(app);

// Create WebSocket server
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
  console.log('Client connected');
  ws.on('message', (message) => {
    const parsedMessage = JSON.parse(message);
    // Send received message to all connected clients
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

// Routes
app.use('/api/chat', chatRoutes);
app.use("/api/prompt-designs", promptDesignRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/model-routes", modelRoutes);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api", portfolioRoutes); 

// Start the server on port 5000 (can be the same port as WebSocket)
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
