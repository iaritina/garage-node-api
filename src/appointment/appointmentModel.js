const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const appointmentSchema = new Schema({
  mechanic: {
    type: [Schema.Types.ObjectId],
    ref: "user",
    required: [true, "Mechanics are required"],
  },
  vehicle: {
    type: Schema.Types.ObjectId,
    ref: "vehicle",
    required: [true, "Mechanics are required"],
  },
  service: {
    type: [Schema.Types.ObjectId],
    ref: "Service",
    required: [true, "Service are required"],
  },
  description: {
    type: String,
  },
  date: {
    type: Date,
    required: [true, "Date and time are required"],
  },
});

module.exports = mongoose.model("Appointment", appointmentSchema);
