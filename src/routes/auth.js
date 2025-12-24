const express = require("express");
const User = require("../models/User");
const authRouter = express.Router();
const bcrypt = require("bcrypt");
const { validateSignUpData } = require("../utils/validation");
const axios = require('axios');

const cookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "none",
  path: "/",
  maxAge: 30 * 24 * 60 * 60 * 1000,
};

authRouter.post("/signup", async (req, res) => {
  try {
    validateSignUpData(req);
    const { name, email, password } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);

    const user = new User({ name, email, password: passwordHash });
    const savedUser = await user.save();
    const token = await savedUser.getJWT();

    res.cookie("token", token, cookieOptions);

    // force token in response
    res.json({ message: "User added!", data: savedUser, token: token });
  } catch (err) {
    res.status(400).send(err.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) throw new Error("Invalid credentials");

    const isPasswordValid = await user.validatePassword(password);
    if (!isPasswordValid) throw new Error("Invalid credentials");

    const token = await user.getJWT();

    res.cookie("token", token, cookieOptions);

    // same force token in response
    res.json({ message: "Logged in!", user: user, token: token });
  } catch (error) {
    res.status(400).send("Login failed: " + error.message);
  }
});

authRouter.post("/logout", async (req, res) => {
  try {
    res.clearCookie("token", cookieOptions);
    res.status(200).send("Logged out successfully..");
  } catch (error) {
    res.status(400).send("Logout failed: " + error.message);
  }
});

// FORGOT PASSWORD ROUTE
authRouter.post("/forgot-password", async (req, res) => {
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

    res.status(200).json({ message: "OTP sent to your Telegram Bot!" });
  } catch (error) {
    console.error("Forgot Password Error:", error);
    res.status(400).send(error.message || "Server Error");
  }
});

// RESET PASSWORD ROUTE
authRouter.post("/reset-password", async (req, res) => {
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
      .json({ message: "Password Changed Successfully! Please Login." });
  } catch (error) {
    console.error("Reset Password Error:", error);
    res.status(400).send(error.message);
  }
});

module.exports = authRouter;
