const mongoose = require('mongoose');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const validator = require("validator"); 

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Email is not valid: " + value)
      }
    },
  },
  password: {
    type: String,
    required: true,
    validate(value) {
      if (!validator.isStrongPassword(value)) {
        throw new Error("Password must contain at least 8 characters, 1 uppercase, 1 lowercase, 1 number, and 1 symbol");
      }
    },
  },
  
  mobileNumber: {
    type: String,
    default: null,
    validate(value) {
      if (!value) return; 
      if (!validator.isMobilePhone(value)) {
        throw new Error("Mobile number is not valid: " + value)
      }
    }
  },
  //for Telegram Bot Linking
  telegramChatId: {
    type: String,
    default: null
  },
  // Verification Code 
  verificationCode: {
    type: String,
    default: null
  },
  verificationCodeExpires: {
    type: Date,
    default: null
  },
  resetPasswordOtp: { 
    type: String,
    default: null
  },
  resetPasswordExpires:{ 
    type: Date,
    default: null
  }
}, {
  timestamps: true, 
});

//  Indexes for Performance 
userSchema.index({ telegramChatId: 1 }); // Bot lookups by chatId
userSchema.index({ verificationCode: 1 }); // Code verification lookups

//  Strip Sensitive Fields from JSON 
userSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password;
  delete user.resetPasswordOtp;
  delete user.resetPasswordExpires;
  delete user.verificationCode;
  delete user.verificationCodeExpires;
  delete user.__v;
  return user;
};

//  Schema Methods 

userSchema.methods.getJWT = async function() {
  const user = this;
  const token = await jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: "30d" });
  return token;
}

userSchema.methods.validatePassword = async function(password) {
  const user = this;
  const passwordHash = user.password;
  const isPasswordValid = await bcrypt.compare(password, passwordHash);
  return isPasswordValid;
}

module.exports = mongoose.model('User', userSchema);