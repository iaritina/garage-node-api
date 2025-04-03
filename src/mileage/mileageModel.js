const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const mileageSchema = new Schema({
    appointment: {type: Schema.Types.ObjectId, ref: "Appointment", required: true},
    vehicle: {type: Schema.Types.ObjectId, ref: "Vehicle", required: true},
    service: [{type: Schema.Types.ObjectId, ref: "Service", required: true}],
    kilometer: { type: Number, required: true }
});

const Mileage = mongoose.model("Mileage", mileageSchema);

module.exports = Mileage;