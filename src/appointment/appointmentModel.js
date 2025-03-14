const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const repairSchema = new Schema({
  service: {
    type: Schema.Types.ObjectId,
    ref: "Service",
    required: [true, "Service is required"],
  },
  mechanic: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Mechanic is required"],
  },
});

const appointmentSchema = new Schema({
  vehicle: {
    type: Schema.Types.ObjectId,
    ref: "vehicle",
    required: [true, "Mechanics are required"],
  },
  repairs: [repairSchema],
  date: {
    type: Date,
    required: [true, "Date and time are required"],
  },
});

module.exports = mongoose.model("Appointment", appointmentSchema);
