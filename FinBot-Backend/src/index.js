const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const { connectDB } = require("./config/database");


dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

const bot = require("./bot/telegramBot");

app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://finbot-f9cb.onrender.com",
      "https://fin-bot.dev",
      "https://www.fin-bot.dev",
    ],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);

app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("FinBot Server is Running!");
});

// Routes
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const expenseRouter = require("./routes/expenses");
const reportRouter = require("./routes/reports");

app.use("/api/auth", authRouter);
app.use("/api/profile", profileRouter);
app.use("/api/expense", expenseRouter);
app.use("/api/reports", reportRouter.router);

connectDB()
  .then(() => {
    console.log("Database connection established...");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      bot.launch();
      console.log("Telegram Bot is Live!");
    });
  })
  .catch((err) => {
    console.log("Database connection failed!", err);
  });
