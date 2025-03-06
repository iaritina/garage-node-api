const User = require("./userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const createUser = async (user) => {
  try {
    return await User.create(user);
  } catch (error) {
    throw new Error("Error: " + error.message);
  }
};

const login = async(email,password) => {
  const user = await User.findOne({email});
  if(!user) throw new Error("User not found");

  const isMatch = await bcrypt.compare(password, user.password);
  if(!isMatch) throw new Error("invalid password");

  const token = jwt.sign({_id: user._id, lastname: user.lastname, role: user.role}, process.env.JWT_SECRET, {expiresIn: '1h'});
  return token;
}

module.exports = {
  createUser,
  login,
};
