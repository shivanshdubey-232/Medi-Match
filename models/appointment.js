const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Doctor = require("./doctor.js");

const appointmentSchema = new Schema({
  name: String,
  email: String,
  phone: String,
  date: Date,
  time: String,
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  doctor: {
    type: Schema.Types.ObjectId,
    ref: "Doctor",
  },
});

module.exports = mongoose.model("Appointment", appointmentSchema);
