const User = require("./userModel");

const createUser = async (user) => {
  try {
    return await User.create(user);
  } catch (error) {
    throw new Error("Error: " + error.message);
  }
};

module.exports = {
  createUser,
};
