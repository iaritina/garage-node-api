const User = require("./userModel");


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
