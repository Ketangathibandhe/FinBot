const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  // this will use when user connect whatsapp
  mobileNumber: {
    type: String,
    default: null
  },
  // this is 6-digit code (Temporary)
  verificationCode: {
    type: String,
    default: null
  },
  // when User is created
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', userSchema);