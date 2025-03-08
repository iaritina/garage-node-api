const vehicleModel = require("./vehicleModel");

const createModel = async (model) => {
  try {
    return await vehicleModel.create(model);
  } catch (error) {
    throw new Error("Error: " + error.message);
  }
};

const getModels = async () => {
  try {
    return await vehicleModel.find({}).populate("brand");
  } catch (error) {
    throw new Error("Error: " + error.message);
  }
};

const getModelById = async (id) => {
  try {
    return await vehicleModel.findById(id).populate("brand");
  } catch (error) {
    throw new Error("Error: " + error.message);
  }
};

const updateModel = async (id, model) => {
  try {
    return await vehicleModel.findByIdAndUpdate(id, model, { new: true });
  } catch (error) {
    throw new Error("Error: " + error.message);
  }
};

const deleteModel = async (id) => {
  try {
    return await vehicleModel.findByIdAndDelete(id);
  } catch (error) {
    throw new Error("Error: " + error.message);
  }
};

module.exports = {
  createModel,
  getModels,
  getModelById,
  updateModel,
  deleteModel,
};
