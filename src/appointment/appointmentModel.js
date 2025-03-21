const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const RepairsSchema = new Schema({
  service: {
    type: Schema.Types.ObjectId,
    ref: "Service",
    default: "67d138072134e3ada4439d35",
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    default: "67d91ddbc85f4f815c4c4f31",
    required: true,
  },
});

const appointmentSchema = new Schema({
  vehicle: {
    type: Schema.Types.ObjectId,
    ref: "Vehicle",
    required: [true, "Vehicle is required"],
  },
  repairs: [RepairsSchema],
  date: {
    type: Date,
    required: [true, "Date is required"],
    default: () => {
      const now = new Date();
      const offset = 3 * 60 * 60 * 1000; // Décalage pour Africa/Nairobi (UTC+3)
      return new Date(now.getTime() + offset);
    },
  },
});

const Appointment = mongoose.model("Appointment", appointmentSchema);

module.exports = Appointment;
