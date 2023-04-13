const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Appointment = require("./appointment.js");

const DoctorSchema = new Schema({
  name: String,
  degree: String,
  department: String,
  image: String,
  appointments: [
    {
      type: Schema.Types.ObjectId,
      ref: "Appointment",
    },
  ],
});

DoctorSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await Appointment.deleteMany({
      _id: {
        $in: doc.appointments,
      },
    });
  }
});

module.exports = mongoose.model("Doctor", DoctorSchema);
