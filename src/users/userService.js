const User = require("./userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const getAllUser = async () => {
  try {
    return await User.find({});
  } catch (error) {
    throw new Error("Error: " + error.message);
  }
};

const getUserById = async (id) => {
  try {
    return await User.findById(id);
  } catch (error) {
    throw new Error("Error: ", error.message);
  }
};

const createUser = async (user) => {
  try {
    // le salt est un nombre aléatoire généré pour chaque mot de passe
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    return await User.create(user);
  } catch (error) {
    throw new Error("Error: " + error.message);
  }
};

const registrationMechanic = async (user) => {
  try {
    user.password = user.firstname;
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    user.role = "mecanicien";
    return await User.create(user);
  } catch (error) {
    throw new Error("Error: ", error.message);
  }
};

const deleteUser = async (id) => {
  try {
    return await User.findByIdAndUpdate(
      id,
      { $set: { isDeleted: true } },
      { new: true }
    );
  } catch (error) {
    throw new Error("Error: ", error.message);
  }
};

const updateUser = async (id, user) => {
  try {
    return await User.findByIdAndUpdate(id, user, { new: true });
  } catch (error) {
    throw new Error("Error", error.message);
  }
};

const login = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("User not found");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("invalid password");

  const token = jwt.sign(
    { id: user._id, lastname: user.lastname, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
  return { token, role: user.role, email: user.email };
};

const getUserByEmail = async (email) => {
  try {
    const user = await User.findOne({ email });
    if (!user) throw new Error("User not found");
    return user;
  } catch (error) {
    throw new Error("Error", error.message);
  }
};

const getCustomerCount = async () => {
    try {
      const customerCount = (await User.find({role: "client"})).length;
      return customerCount;
    } catch (error) {
      throw new Error("Error", error.message);
    }
}

module.exports = {
  getAllUser,
  getUserById,
  createUser,
  registrationMechanic,
  deleteUser,
  updateUser,
  login,
  getUserByEmail,
  getCustomerCount
};
