const express = require("express");
const router = express.Router({ mergeParams: true });
const catchAsync = require("../utils/catchAsync");
const Doctor = require("../models/doctor");
const Appointment = require("../models/appointment");
const { appointmentSchema } = require("../schemas.js");

const validateappointment = (req, res, next) => {
  console.log(req.body);
  const { error } = appointmentSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message);
    throw new ExpressError(msg, 400);
  } else {
    console.log(req.body);
    next();
  }
};

const isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl;
    req.flash("error", "You must be signed in first !");
    return res.redirect("/login");
  }
  next();
};

const isAuthor = async (req, res, next) => {
  const { id, appointmentId } = req.params;
  const appointment = await Appointment.findById(appointmentId);
  if (!appointment.author.equals(req.user._id)) {
    req.flash("error", "You do not have permission to do that !");
    return res.redirect(`/doctors/${id}`);
  }
  next();
};

// ----------------------appointment route-----------------
router.post(
  "/",
  isLoggedIn,
  catchAsync(async (req, res) => {
    const doctor = await Doctor.findById(req.params.id);
    const appointment = new Appointment(req.body.appointment);
    appointment.author = req.user._id;
    doctor.appointments.push(appointment);
    await appointment.save();
    await doctor.save();
    req.flash("success", "Successfully created a new appointment !");
    res.redirect(`/doctors/${doctor._id}`);
  })
);
//-----------------------delete-appointment----------------
router.delete(
  "/:appointmentId",
  isLoggedIn,
  isAuthor,
  catchAsync(async (req, res) => {
    await Appointment.findByIdAndDelete(req.params.appointmentId);
    await Doctor.findByIdAndUpdate(req.params.id, {
      $pull: { appointments: req.params.appointmentId },
    });
    req.flash("success", "Successfully deleted an appointment !");
    res.redirect(`/doctors/${req.params.id}`);
  })
);

module.exports = router;
