const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const { connectDB } = require("./config/database");
const http = require('http')
const {Server} = require('socket.io')

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

//http server
const server = http.createServer(app);

// const bot = require("./bot/telegramBot");

//Initialize Socket.io with CORS
const io = new Server(server,{
  cors:{
    origin: [
      "http://localhost:5173",
      "https://fin-bot.dev",
      "https://www.fin-bot.dev",
      "https://finbot-f9cb.onrender.com",
    ],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  },
});

app.get("/health", (req, res) => {
  res.status(200).send("OK");
});


app.use(
  cors({
    origin:[
      "http://localhost:5173",
      "https://fin-bot.dev",
      "https://www.fin-bot.dev",
      "https://finbot-f9cb.onrender.com",
    ],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
)

app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("FinBot Server is Running!");
});

//Socket.io connection logic(rooms)
io.on("connection",(socket)=>{
  console.log("New Client Connected:",socket.id);

  //user joins a room based on the user id
  socket.on("join-room",(userId)=>{
    socket.join(userId);
    console.log(`User ${userId} joined room`);
  });

  socket.on("disconnect", ()=>{
    console.log("Client Disconnected");
  })
})


// Routes
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const expenseRouter = require("./routes/expenses");
const reportRouter = require("./routes/reports");


app.use("/api/auth", authRouter);
app.use("/api/profile", profileRouter);
app.use("/api/expense", expenseRouter);
app.use("/api/reports", reportRouter.router);

//Passing 'io' to the Bot so it can emit events
const setupBot = require('./bot/telegramBot');
const bot = setupBot(io);

connectDB()
  .then(() => {
    console.log("Database connection established...");
    //server.listen instead of app.listen
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      bot.launch();
      console.log("Telegram Bot is Live!");
    });
  })
  .catch((err) => {
    console.log("Database connection failed!", err);
  });
