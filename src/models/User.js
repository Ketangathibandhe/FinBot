const mongoose = require('mongoose');
const { isLowercase } = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase:true,
    trim:true,
    validate(value){
      const validator = require("validator")
      if(!validator.isEmail(value)){
        throw new Error("Email is not valid:"+value)
      }
    },
  },
  password: {
    type: String,
    required: true
  },
  // this will use when user connect whatsapp
  mobileNumber: {
    type: String,
    default: null,
    validate(value){
      const validator = require("validator")
      if(!validator.isMobilePhone(value)){
        throw new Error("Mobile number is not valid:"+value)
      }
    }
  },
  // this will be 6-digit code (Temporary)
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