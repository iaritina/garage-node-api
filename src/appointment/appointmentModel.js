const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const RepairsSchema = new Schema({
  service: {
    type: Schema.Types.ObjectId,
    ref: "Service",
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
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
      const offset = 3 * 60 * 60 * 1000;
      return new Date(now.getTime() + offset);
    },
  },
});

const Appointment = mongoose.model("Appointment", appointmentSchema);

module.exports = Appointment;
