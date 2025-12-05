const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { userAuth } = require('../middleware/auth'); //middleware


// GET /view - to see user data
router.get("/view", userAuth, async (req, res) => {
  try {
    // req.user comming from middleware 
    const user = req.user; 
    res.json({ message: "User Profile Loaded", data: user });
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});


// POST /generate-code - generating code to Link whatsApp
router.post("/generate-code", userAuth, async (req, res) => {
  try {
    const user = req.user;
    //Random 6-digit code (e.g. 849201)
    const randomCode = Math.floor(100000 + Math.random() * 900000).toString();

    // save to DB so that BOT can verify later
    user.verificationCode = randomCode;
    await user.save();

    // send code to user in response
    res.json({ 
        message: "Code Generated Successfully!", 
        code: randomCode,
        instruction: `Send the code to WhatsApp : Connect ${randomCode}`
    });

  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

module.exports = router;