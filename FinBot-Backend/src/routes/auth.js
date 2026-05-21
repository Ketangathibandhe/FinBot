const express = require("express");
const User = require("../models/User");
const authRouter = express.Router();
const bcrypt = require("bcrypt");
const { validateSignUpData } = require("../utils/validation");
const { authLimiter, forgotPasswordLimiter } = require("../middleware/rateLimiter");
const axios = require('axios');

const cookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "none",
  path: "/",
  maxAge: 30 * 24 * 60 * 60 * 1000,
};

//  SIGNUP 
authRouter.post("/signup", authLimiter, async (req, res) => {
  try {
    validateSignUpData(req);
    const { name, email, password } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);

    const user = new User({ name, email, password: passwordHash });
    const savedUser = await user.save();
    const token = await savedUser.getJWT();

    res.cookie("token", token, cookieOptions);

    res.json({ success: true, message: "Account created successfully!", data: savedUser, token: token });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

//  LOGIN 
authRouter.post("/login", authLimiter, async (req, res) => {
  try {
    const { email, password } = req.body;

    const cleanEmail = email ? email.toLowerCase().trim() : "";

    // Search with Clean Email
    const user = await User.findOne({ email: cleanEmail });

    if (!user) throw new Error("Invalid credentials");

    const isPasswordValid = await user.validatePassword(password);
    if (!isPasswordValid) throw new Error("Invalid credentials");

    const token = await user.getJWT();

    res.cookie("token", token, cookieOptions);

    res.json({ success: true, message: "Logged in!", user: user, token: token });
  } catch (error) {
    res.status(400).json({ success: false, message: "Login failed: " + error.message });
  }
});

//  LOGOUT 
authRouter.post("/logout", async (req, res) => {
  try {
    res.clearCookie("token", cookieOptions);
    res.status(200).json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    res.status(400).json({ success: false, message: "Logout failed: " + error.message });
  }
});

//  FORGOT PASSWORD 
authRouter.post("/forgot-password", forgotPasswordLimiter, async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      throw new Error("User not found with this email.");
    }

    // Check if Telegram is linked
    if (!user.telegramChatId) {
      throw new Error(
        "Telegram Bot is not linked! Please contact admin or use a linked account."
      );
    }

    // 4 Digit OTP
    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    // Saves OTP to DB (Valid for 5 Minutes)
    user.resetPasswordOtp = otp;
    user.resetPasswordExpires = Date.now() + 5 * 60 * 1000;
    await user.save();

    // Sending OTP via Telegram API
    const message = `*Password Reset Request*\n\nYour OTP is: *${otp}*\n\nValid for 5 minutes. Do not share this with anyone.`;

    await axios.post(
      `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        chat_id: user.telegramChatId,
        text: message,
        parse_mode: "Markdown",
      }
    );

    res.status(200).json({ success: true, message: "OTP sent to your Telegram Bot!" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message || "Server Error" });
  }
});

//  RESET PASSWORD 
authRouter.post("/reset-password", authLimiter, async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      throw new Error("All fields are required!");
    }
    const user = await User.findOne({
      email,
      resetPasswordOtp: otp,
      resetPasswordExpires: { $gt: Date.now() }, 
    });

    if (!user) {
      throw new Error("Invalid or Expired OTP");
    }

    // Hash New Password
    const passwordHash = await bcrypt.hash(newPassword, 10);
    user.password = passwordHash;

    // Clear OTP fields
    user.resetPasswordOtp = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res
      .status(200)
      .json({ success: true, message: "Password Changed Successfully! Please Login." });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

module.exports = authRouter;
