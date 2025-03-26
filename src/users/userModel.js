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
  role: {
    type: String,
    enum: ["manager", "mecanicien", "client"],
    default: "client",
  },
  workingHours: {
    type: Map,
    of: Number,
    default: {
      Monday: 480, // 8 hours
      Tuesday: 480,
      Wednesday: 480,
      Thursday: 480,
      Friday: 480,
      Saturday: 480,
      Sunday: 0, // No working hours on Sunday
    },
  },
  isDeleted: { type: Boolean, default: false },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
