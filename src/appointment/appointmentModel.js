const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const prestationsSchema = new Schema({
  service: {
    type: Schema.Types.ObjectId,
    ref: "Service",
    required: true,
  },
  price: {
    type: Schema.Types.Decimal128,
    required: true,
  },
});

const appointmentSchema = new Schema({
  client: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Client is required"],
  },
  vehicle: {
    type: Schema.Types.ObjectId,
    ref: "Vehicle",
    required: [true, "Vehicle is required"],
  },
  prestations: [prestationsSchema],
  mechanic: { type: Schema.Types.ObjectId, ref: "User" },
  date: {
    type: Date,
    required: [true, "Date is required"],
  },
  status: {
    type: Boolean,
    default: false,
  },
  isCanceled: {
    type: Boolean,
    default: false,
  },
});

const Appointment = mongoose.model("Appointment", appointmentSchema);

module.exports = Appointment;
