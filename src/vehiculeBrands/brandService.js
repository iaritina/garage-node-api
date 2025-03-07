const Brand = require("./brandModel");

const createBrand = async (brand) => {
  try {
    return await Brand.create(brand);
  } catch (error) {
    throw new Error("Error: " + error.message);
  }
};

const getBrands = async () => {
  try {
    return await Brand.find();
  } catch (error) {
    throw new Error("Error: " + error.message);
  }
};

const getBrandById = async (id) => {
  try {
    return await Brand.findById(id);
  } catch (error) {
    throw new Error("Error: " + error.message);
  }
};

const updateBrand = async (id, brand) => {
  try {
    return await Brand.findByIdAndUpdate(id, brand, { new: true });
  } catch (error) {
    throw new Error("Error: " + error.message);
  }
};

const deleteBrand = async (id) => {
  try {
    return await Brand.findByIdAndDelete(id);
  } catch (error) {
    throw new Error("Error: " + error.message);
  }
};

module.exports = {
  createBrand,
  getBrands,
  getBrandById,
  updateBrand,
  deleteBrand,
};
