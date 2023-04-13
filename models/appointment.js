const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Doctor = require("./doctor.js");

const appointmentSchema = new Schema({
  name: String,
  email: String,
  phone: String,
  doctor_name: String,
  date: String,
  time: String,
  doctor: {
    type: Schema.Types.ObjectId,
    ref: "Doctor",
  },
});

module.exports = mongoose.model("Appointment", appointmentSchema);
