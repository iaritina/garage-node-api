const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const modelSchema = new Schema({
  name: {
    type: String,
    required: [true, "Model name is required"],
  },
  brand: {
    type: Schema.Types.ObjectId,
    ref: "Brand",
    required: [true, "Brand is required"],
  },
});

const Model = mongoose.model("Model", modelSchema);

module.exports = Model;
