const express = require('express');
const User = require('../models/User');
const authRouter = express.Router();
const bcrypt = require('bcrypt')
const {validateSignUpData} = require('../utils/validation')
// Common cookie config
const cookieOptions = {
  httpOnly: true,
  secure: false,
  sameSite: "None",
  path: "/",
  maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
};

//Signup

authRouter.post("/signup",async(req , res)=>{
    try{
        validateSignUpData(req);
        const {name , email , password}=req.body;
        const passwordHash = await bcrypt.hash(password,10);
        const user = new User({
            name,
            email,
            password:passwordHash,
        });
        const savedUser = await user.save();
        const token = await savedUser.getJWT();

        res.cookie("token",token,cookieOptions);
        res.json({message:"User added Successfully!",data:savedUser})
    }catch(err){
        res.status(400).send(err.message);
    }
})

// LOGIN
authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) throw new Error("Invalid credentials");

    const isPasswordValid = await user.validatePassword(password);
    if (!isPasswordValid) throw new Error("Invalid credentials");

    const token = await user.getJWT();
    res.cookie("token", token, cookieOptions);
    res.json({ message: "Logged in successfully!", user });
  } catch (error) {
    res.status(400).send("Login failed: " + error.message);
  }
});

// LOGOUT
authRouter.post("/logout", async (req, res) => {
  try {
    res.clearCookie("token", cookieOptions);
    res.status(200).send("Logged out successfully..");
  } catch (error) {
    res.status(400).send("Logout failed: " + error.message);
  }
});

module.exports = authRouter;