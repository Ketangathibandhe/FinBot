const validator = require("validator");
const validateSignUpData = (req) => {
  const { name, email, password } = req.body;
  if (!name) {
    throw new Error("Enter valid user Name!");
  } else if (!validator.isEmail(email)) {
    throw new Error("Plz Enter A Valid emali Id!");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Enter a strong password");
  }
};

module.exports = {validateSignUpData};