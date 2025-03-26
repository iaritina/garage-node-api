const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const detailProduct = new Schema({
  product: { type: [Schema.Types.ObjectId], ref: "Product", required: false },
  price: { type: Number, required: false },
  quantity: { type: Number, required: false },
});

const interventionSchema = new Schema(
  {
    appointment: {
      type: Schema.Types.ObjectId,
      ref: "Appointment",
      required: true,
    },
    products: [detailProduct],
  },
  { timestamps: true }
);

const Intervention = mongoose.model("Intervention", interventionSchema);

module.exports = Intervention;
