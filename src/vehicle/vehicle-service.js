const vehicleModel = require("./vehicle-model");

const getAllVehicle = async () => {
  try {
    return await vehicleModel
      .find({})
      .populate("user")
      .populate({
        path: "model",
        populate: {
          path: "brand",
        },
      });
  } catch (error) {
    throw new Error("Error: " + error.message);
  }
};

const getVehicleByUser = async (id) => {
  try {
    return await vehicleModel
      .find({ user: id, isDeleted: false })
      .populate("user", "firstname lastname")
      .populate({
        path: "model",
        populate: {
          path: "brand",
        },
      });
  } catch (error) {
    throw new Error(`Error: ${error.message}`);
  }
};

const getVehicleById = async (id) => {
  try {
    return await vehicleModel
      .findById(id)
      .populate("user")
      .populate({
        path: "model",
        populate: {
          path: "brand",
        },
      });
  } catch (error) {
    throw new Error("Error: " + error.message);
  }
};

const createVehicle = async (vehicle) => {
  try {
    return await vehicleModel.create(vehicle);
  } catch (error) {
    throw new Error("Error: " + error.message);
  }
};

const updateVehicle = async (id, vehicle) => {
  try {
    return await vehicleModel.findByIdAndUpdate(id, vehicle, { new: true });
  } catch (error) {
    throw new Error("Error: " + error.message);
  }
};

const deleteVehicle = async (id) => {
  try {
    return await vehicleModel.findByIdAndUpdate(
      id,
      { $set: { isDeleted: true } },
      { new: true }
    );
  } catch (error) {
    throw new Error("Error: " + error.message);
  }
};

const getVehicleCountByBrand = async () => {
  try {
    const result = await vehicleModel.aggregate([
      {
        $lookup: {
          from: "models", // Nom de la collection des modèles
          localField: "model",
          foreignField: "_id",
          as: "modelDetails",
        },
      },
      {
        $lookup: {
          from: "brands", // Nom de la collection des marques
          localField: "modelDetails.brand",
          foreignField: "_id",
          as: "brandDetails",
        },
      },
      {
        $unwind: "$brandDetails",
      },
      {
        $group: {
          _id: "$brandDetails.name", // Grouper par le nom de la marque
          count: { $sum: 1 }, // Compter le nombre de véhicules
        },
      },
      {
        $sort: { count: -1 }, // Trier par ordre décroissant du nombre de véhicules
      },
    ]);

    return result; // Retourne un tableau avec le nom de la marque et le nombre de véhicules
  } catch (error) {
    throw new Error(`Error: ${error.message}`);
  }
};

module.exports = {
  getAllVehicle,
  getVehicleByUser,
  getVehicleById,
  createVehicle,
  updateVehicle,
  deleteVehicle,
  getVehicleCountByBrand,
};
