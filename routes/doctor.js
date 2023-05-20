const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");
const Doctor = require("../models/doctor");
const { doctorSchema } = require("../schemas.js");

const validatedoctor = (req, res, next) => {
  const { error } = doctorSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message);
    throw new ExpressError(msg, 400);
  } else {
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

// filtered doctor search--------------------------

router.post('/filtered',catchAsync(async(req , res)=> {
  const doctors = await Doctor.find({});
  const {docs} = req.body;
  console.log(docs);
  let new_doctors = new Array;

  for( let i in doctors)
  {
    console.log(doctors[i].department.toLowerCase());
    if(doctors[i].department.toLowerCase() === docs.toLowerCase())
    {
      new_doctors.push(doctors[i]);
    }
  }
  console.log(new_doctors);
  if(new_doctors)
  res.render('doctors/filtered' , { new_doctors });
  else
  res.send("No doctor available currently");
}));


router.get(
  "/",
  catchAsync(async (req, res) => {
    const doctors = await Doctor.find({});
    res.render("doctors/index", { doctors });
  })
);
//--------------------new -------------------
router.get("/new", (req, res) => {
  res.render("doctors/new");
});
router.post(
  "/",
  catchAsync(async (req, res, next) => {
    const doctor = new Doctor(req.body.doctor);
    console.log(req.body);
    await doctor.save();
    req.flash("success", "Successfully created a new doctor !");
    res.redirect(`/doctors`);
  })
);
// -------------show----------------------------
router.get(
  "/:id",
  isLoggedIn,
  catchAsync(async (req, res) => {
    const doctor = await Doctor.findById(req.params.id).populate(
      "appointments"
    );
    if (!doctor) {
      req.flash("error", "Cannot find any doctor !");
      return res.redirect("/doctors");
    }
    const appointmentSlots = doctor.appointments.map(
      (appointment) => appointment.time
    );
    const allSlots = [
      "8:00 AM - 9:00 AM",
      "9:00 AM - 10:00 AM",
      "10:00 AM - 11:00 AM",
      "11:00 AM - 12:00 PM",
      "2:00 PM - 3:00 PM",
      "3:00 PM - 4:00 PM",
      "4:00 PM - 5:00 PM",
      "5:00 PM - 6:00 PM",
    ];
    res.render("doctors/show", {
      doctor,
      appointmentSlots,
      allSlots,
      msg: req.flash("success"),
    });
  })
);

// ---------------delete doctor --------------------
router.delete(
  "/:id",
  isLoggedIn,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const doctor = await Doctor.findByIdAndDelete(id);
    req.flash(
      "success",
      `Successfully deleted the doctor named ${doctor.name}!`
    );
    res.redirect("/doctors");
  })
);

module.exports = router;
