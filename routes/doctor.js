const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const Doctor = require('../models/doctor');
const {doctorSchema} = require('../schemas.js');

const validatedoctor = (req, res, next) => {
  const {error} = doctorSchema.validate(req.body);
  if(error){
    const msg = error.details.map(el => el.message);
    throw new ExpressError(msg, 400);
  } else{
    next();
  }
} 


router.get('/', catchAsync(async (req, res) => {
  const doctors = await Doctor.find({});
  res.render('doctors/index', { doctors })  
}));
//--------------------new -------------------
router.get('/new', (req, res) => {
  res.render('doctors/new');
});
router.post('/', catchAsync(async (req, res, next) => {
  const doctor = new Doctor(req.body.doctor);
  console.log(req.body);
  await doctor.save();
  req.flash('success', 'Successfully created a new doctor !'); 
  res.redirect(`/doctors`)
  
}));
// -------------show----------------------------
router.get('/:id', catchAsync(async (req, res,) => {
  const doctor = await Doctor.findById(req.params.id).populate('appointments');
  if(!doctor){
    req.flash('error', 'Cannot find any doctor !');
    return res.redirect('/doctors');
  }
  res.render('doctors/show', { doctor, msg: req.flash("success")  });
}));

// -------------------------edit ------------------
router.get('/:id/edit', catchAsync(async (req, res) => {
  const doctor = await Doctor.findById(req.params.id)
  if(!doctor){
    req.flash('error', 'Cannot find any doctor !');
    return res.redirect('/doctors');
  }
  res.render('doctors/edit', { doctor });
}));
router.put('/:id', validatedoctor, catchAsync(async (req, res) => {
  const { id } = req.params; 
  const doctor = await Doctor.findByIdAndUpdate(id, { ...req.body.doctor });
  req.flash('success', 'Successfully updated doctor !');
  res.redirect(`/doctors/${doctor._id}`)
}));
//----------------------delete-----------------------
router.delete('/:id', catchAsync(async (req, res) => {
  const { id } = req.params;
  await Doctor.findByIdAndDelete(id);
  req.flash('success', 'Successfully deleted the doctor !');
  res.redirect('/doctors');
}));


module.exports = router;