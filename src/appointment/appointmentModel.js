const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const RepairsSchema = new Schema({
  service: { type: Schema.Types.ObjectId, ref: "Service", required: true },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

const appointmentSchema = new Schema({
  vehicle: {
    type: Schema.Types.ObjectId,
    ref: "Vehicle",
    required: [true, "Vehicle is required"],
  },
  repairs: { type: [RepairsSchema], required: [true, "Repairs are required"] },
  date: { type: Date, required: [true, "Date is required"] },
});

const Appointment = mongoose.model("Appointment", appointmentSchema);

module.exports = Appointment;
