const User = require("./userModel");
const bcrypt = require("bcrypt");

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

module.exports = {
  createUser,
};
