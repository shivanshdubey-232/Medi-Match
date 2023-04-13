const express = require('express');
const router = express.Router({mergeParams: true});
const catchAsync = require('../utils/catchAsync');
const Doctor = require('../models/doctor');
const Appointment = require('../models/appointment');
const {appointmentSchema} = require('../schemas.js');


const validateappointment = (req, res, next) => {
  const {error} = appointmentSchema.validate(req.body);
  if(error){
    const msg = error.details.map(el => el.message);
    throw new ExpressError(msg, 400);
  }else{
    console.log(req.body);
    next();
  }
}

// ----------------------appointment route-----------------
router.post('/', validateappointment, catchAsync(async(req, res) => {
  const doctor = await Doctor.findById(req.params.id);
  const appointment = new Appointment(req.body.appointment);
  console.log(appointment);
  doctor.appointments.push(appointment);
  await appointment.save();
  await doctor.save();
  req.flash('success', 'Successfully created a new appointment !');
  res.redirect(`/doctors/${doctor._id}`);
}))
//-----------------------delete-appointment----------------
router.delete('/:appointmentId', catchAsync(async (req, res) => {
  await Appointment.findByIdAndDelete(req.params.appointmentId);
  await Doctor.findByIdAndUpdate(req.params.id, {$pull: {appointments: req.params.appointmentId}});
  req.flash('success', 'Successfully deleted an appointment !');
  res.redirect(`/doctors/${req.params.id}`);
}));


module.exports = router;