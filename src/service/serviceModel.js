const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const serviceSchema = new Schema({
    name: {type: String, required: [true, "The name of the service is required"]},
    price: {type: Number, required: [true, "The price of the service is required"]},
    duration: {type: String, required: [true, "The duration of the service is required"]}
});

const Service = mongoose.model("Service", serviceSchema);

module.exports = Service;