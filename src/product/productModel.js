const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const productSchema = new Schema({
    name: {type: String, required: [true, "Name is requried"]},
    current_price: {type: Number, required: [true, "The price is required"]},
    service: {type: Schema.Types.ObjectId, ref: "Service"},
    isDeleted: {type: Boolean, default: false}
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;