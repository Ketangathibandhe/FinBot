const mongoose = require('mongoose');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

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
    required: true,
     validate(value) {
        var validator = require("validator");
        if (!validator.isStrongPassword(value)) {
          throw new Error("Enter Strong password" + value);
        }
      },
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
},{
  timestamps:true,
});

//schema methods

// userSchema.method.getJwt = async ()=>{ }  
// cant't use arrow fun in schema methods

userSchema.methods.getJWT = async function() {
  const user = this;
  const token = await jwt.sign({_id:user._id},process.env.JWT_SECRET,{expiresIn:"15d"})
  return token;
}

userSchema.methods.validatePassword= async function (password) {
  const user = this;
  const passwordHash = user.password;
  const isPasswordValid = await bcrypt.compare(password,passwordHash)
  return isPasswordValid;
}


module.exports = mongoose.model('User', userSchema);