const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");

const morgan = require("morgan");
const { connectDB } = require("./config/database");
const { validateEnv } = require("./config/validateEnv");
const { apiLimiter } = require("./middleware/rateLimiter");
const errorHandler = require("./middleware/errorHandler");
const http = require("http");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const path = require("path");

dotenv.config({ path: path.join(__dirname, ".env") });

// Validate required environment variables before starting
validateEnv();

const app = express();
const PORT = process.env.PORT || 5000;

// HTTP server
const server = http.createServer(app);

// Allowed origins from env or defaults
const allowedOrigins = [
  "http://localhost:5173",
  process.env.FRONTEND_URL,
  ...(process.env.FRONTEND_URL_EXTRA ? [process.env.FRONTEND_URL_EXTRA] : []),
].filter(Boolean);

// Initialize Socket.io with CORS
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  },
});

//Security Middleware 
app.use(helmet()); // Sets security HTTP headers

//Request Logging
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
} else {
  app.use(morgan("combined"));
}

// CORS
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);

app.use(express.json());
app.use(cookieParser());

// Health Check
app.get("/health", (req, res) => {
  res.status(200).json({ success: true, message: "OK" });
});

app.get("/", (req, res) => {
  res.json({ success: true, message: "FinBot Server is Running!" });
});

// Socket.IO Connection Logic (Rooms) 
io.on("connection", (socket) => {
  if (process.env.NODE_ENV !== "production") {
    console.log("New Client Connected:", socket.id);
  }

  // User joins a room based on the user id
  socket.on("join-room", (userId) => {
    socket.join(userId);
    if (process.env.NODE_ENV !== "production") {
      console.log(`User ${userId} joined room`);
    }
  });

  socket.on("disconnect", () => {
    if (process.env.NODE_ENV !== "production") {
      console.log("Client Disconnected:", socket.id);
    }
  });
});

// API Routes
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const expenseRouter = require("./routes/expenses");
const reportRouter = require("./routes/reports");

// Apply rate limiting to API routes
app.use("/api", apiLimiter);

app.use("/api/auth", authRouter);
app.use("/api/profile", profileRouter);
app.use("/api/expense", expenseRouter);
app.use("/api/reports", reportRouter.router);

// Telegram Bot
// Passing 'io' to the Bot so it can emit events
const setupBot = require("./bot/telegramBot");
const bot = setupBot(io);

// Global Error Handler (must be last middleware) 
app.use(errorHandler);


connectDB()
  .then(() => {
    console.log(" Database connection established");
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      bot.launch();
      console.log(" Telegram Bot is Live!");
    });
  })
  .catch((err) => {
    console.error(" Database connection failed!", err.message);
    process.exit(1);
  });

//Graceful Shutdown 
const gracefulShutdown = (signal) => {
  console.log(`\n${signal} received. Shutting down gracefully...`);
  bot.stop(signal);
  server.close(() => {
    mongoose.connection.close().then(() => {
      console.log("Database connection closed.");
      process.exit(0);
    });
  });
};

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));
