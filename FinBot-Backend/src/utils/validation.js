const validator = require("validator");
const validateSignUpData = (req) => {
  const { name, email, password } = req.body;
  if (!name) {
    throw new Error("Please enter a valid name");
  } else if (!validator.isEmail(email)) {
    throw new Error("Please enter a valid email address");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Password must contain at least 8 characters, 1 uppercase, 1 lowercase, 1 number, and 1 symbol");
  }
};

module.exports = {validateSignUpData};