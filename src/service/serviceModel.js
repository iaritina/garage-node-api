const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const serviceSchema = new Schema({
  name: {
    type: String,
    required: [true, "The name of the service is required"],
  },
  current_price: {
    type: Number,
    required: [true, "The price of the service is required"],
  },
  next_service_km: {
    type: Number,
    required: [true, "The next service Km is requires"],
  },
  duration: {
    type: String,
    required: [true, "The duration of the service is required"],
  },
  commission: { type: Number, required: [true, "The commission is requires"] },
  isDeleted: { type: Boolean, default: false },
});

const Service = mongoose.model("Service", serviceSchema);

module.exports = Service;
