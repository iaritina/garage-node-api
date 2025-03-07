const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const brandSchema = new Schema({
  name: {
    type: String,
    required: [true, "Brand name is required"],
  },
});

const Brand = mongoose.model("Brand", brandSchema);

module.exports = Brand;
