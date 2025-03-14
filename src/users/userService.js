const User = require("./userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const appointmentModel = require("../appointment/appointmentModel");
const prestationService = require("../service/service");
require("dotenv").config();

const getAllUser = async () => {
  try {
    return await User.find().populate({
      path: "specialities",
      select: "_id name",
    });
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

const verifyAppointmentDate = async (mechanic, givenDate, serviceIds) => {
  // Récupérer les services à partir des IDs
  const services = await prestationService.getByIds(serviceIds);

  // Convertir la durée du service en minutes
  const getMaxServiceDuration = (services) => {
    return services.reduce((maxDuration, service) => {
      const durationParts = service.duration.split(":");
      console.log(durationParts);
      const durationInMinutes =
        parseInt(durationParts[0]) * 60 + parseInt(durationParts[1]);
      return Math.max(maxDuration, durationInMinutes);
    }, 0);
  };

  const maxServiceDuration = getMaxServiceDuration(services);
  const endDate = new Date(givenDate);
  endDate.setMinutes(endDate.getMinutes() + maxServiceDuration);

  const appointments = await appointmentModel.find({
    "repairs.mechanic": mechanic._id,
    date: {
      $gte: givenDate,
      $lt: endDate,
    },
  });

  // Si aucune appointment n'est trouvée pour cette période, le mécanicien est disponible
  return appointments.length === 0;
};

/**
 *
 * @param {Array} mechanics
 * @param {Number} mechanicsCount
 */
const checkMechanicsAvailability = async (
  mechanics,
  mechanicsCount,
  givenDate,
  service
) => {
  const result = [];
  const unaivalable = [];
  for (const data of mechanics) {
    const mechanic = await User.findOne({ _id: data });
    const isMechanicAvailable = await verifyAppointmentDate(
      mechanic,
      givenDate,
      service
    );
    if (isMechanicAvailable) result.push(mechanic);
    else unaivalable.push(mechanic.firstname);
  }
  return { allAvailable: result.length == mechanicsCount, unaivalable };
};

module.exports = {
  getAllUser,
  getUserById,
  createUser,
  registrationMechanic,
  deleteUser,
  updateUser,
  login,
  getUserByEmail,
  checkMechanicsAvailability,
};
