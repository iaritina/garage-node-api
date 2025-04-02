const Service = require("./serviceModel");
require("dotenv").config();

const convertDurationToMinutes = (durationStr) => {
  const [hours, minutes] = durationStr.split(":").map(Number);
  return hours * 60 + minutes;
};

const createService = async (service) => {
  try {
    // Vérifier si `duration` est une chaîne et la convertir
    if (typeof service.duration === "string") {
      service.duration = convertDurationToMinutes(service.duration);
    }

    return await Service.create(service);
  } catch (error) {
    throw new Error("Error: " + error.message);
  }
};


const getAll = async () => {
  try {
    return await Service.find({ isDeleted: false });
  } catch (error) {
    throw new Error("Error: ", error.message);
  }
};

const getByIds = async (ids) => {
  try {
    return await Service.find({ _id: { $in: ids } });
  } catch (error) {
    throw new Error("Error: " + error.message);
  }
};

const getById = async (id) => {
  try {
    return await Service.findById(id);
  } catch (error) {
    throw new Error("Error: " + error.message);
  }
};

const update = async (id, data) => {
  try {
    return await Service.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
  } catch (error) {
    throw new Error("Error: ", error.message);
  }
};

const deleteService = async (id) => {
  try {
    return await Service.findByIdAndUpdate(
      id,
      { $set: { isDeleted: true } },
      { new: true }
    );
  } catch (error) {
    throw new Error("Error: ", error.message);
  }
};

const findServicesByPrestations = async (prestations) => {
  try {
    return await Service.find({ _id: { $in: prestations } });
  } catch (error) {
    throw new Error("Error: " + error.message);
  }
};

module.exports = {
  createService,
  getAll,
  getById,
  getByIds,
  update,
  deleteService,
  findServicesByPrestations,
};
