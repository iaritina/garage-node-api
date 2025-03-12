const { Schema } = require("mongoose");
const mongoose = require("mongoose");

const userSchema = new Schema({
  firstname: {
    type: String,
    required: [true, "Firstname is required"],
  },
  lastname: {
    type: String,
    required: [true, "Lastname is required"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    validate: {
      validator: function (v) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: "Email validation failed",
    },
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  phone: {
    type: [String],
    required: [true, "Phone number is required"],
  },
  specialities: {
    type: [Schema.Types.ObjectId],
    ref: "Service",
  },
  role: {
    type: String,
    enum: ["manager", "mecanicien", "client"],
    default: "client",
  },

  isDeleted: { type: Boolean, default: false },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
