const { Schema } = require("mongoose");
const mongoose = require("mongoose");

const vehicleSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  model: {
    type: Schema.Types.ObjectId,
    ref: "Model",
    required: [true, "Model is requires"],
  },
  immatriculation: {
    type: String,
    required: [true, "Immatriculation is requires"],
    unique: true,
  },
  year: {
    type: Number,
    required: [true, "The year of the vehicle is requiresd"],
  },
  isDeleted: {
    type: Boolean,
    required: true,
    default: false,
  },
});

const Vehicle = mongoose.model("Vehicle", vehicleSchema);

module.exports = Vehicle;
