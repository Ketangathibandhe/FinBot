const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { userAuth } = require('../middleware/auth'); 


// GET /view - to see user data
router.get("/view", userAuth, async (req, res) => {
  try {
    // req.user coming from middleware 
    const user = req.user; 
    res.json({ success: true, message: "User Profile Loaded", data: user });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});


// POST /generate-code - generating code to Link telegramBot
router.post("/generate-code", userAuth, async (req, res) => {
  try {
    const user = req.user;
    //Random 6-digit code (e.g. 849201)
    const randomCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Save to DB with 10-minute expiry so that BOT can verify later
    user.verificationCode = randomCode;
    user.verificationCodeExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save();

    // Send code to user in response
    res.json({ 
        success: true,
        message: "Code Generated Successfully!", 
        code: randomCode,
        instruction: `Send this command to the Telegram Bot: /start ${randomCode}`
    });

  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

module.exports = router;