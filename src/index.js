const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require('cookie-parser')
const { connectDB } = require("./config/database");


// Config
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

const bot = require('./bot/telegramBot');

// Middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("FinBot Server is Running!");
});

// Routes import
const authRouter = require('./routes/auth');
const profileRouter = require('./routes/profile');
const expenseRouter = require('./routes/expenses');

// Routes use
app.use("/api/auth", authRouter);
app.use('/api/profile',profileRouter);
app.use("/api/expense", expenseRouter);


// Starts Server
connectDB()
  .then(() => {
    console.log("Database connection established...");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      //for starting bot
      bot.launch();
      console.log("Telegram Bot is Live! ");
    });
  })
  .catch((err) => {
    console.log("Database connection failed!", err);
  });
