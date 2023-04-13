const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const Spot = require('../models/spot');
const {spotSchema} = require('../schemas.js');

const validateSpot = (req, res, next) => {
  const {error} = spotSchema.validate(req.body);
  if(error){
    const msg = error.details.map(el => el.message);
    throw new ExpressError(msg, 400);
  } else{
    next();
  }
} 


router.get('/', catchAsync(async (req, res) => {
  const spots = await Spot.find({});
  res.render('spots/index', { spots })
}));
//--------------------new -------------------
router.get('/new', (req, res) => {
  res.render('spots/new');
});
router.post('/', validateSpot, catchAsync(async (req, res, next) => {
  const spot = new Spot(req.body.spot);
  await spot.save();
  req.flash('success', 'Successfully created a new spot !'); 
  res.redirect(`/spots/${spot._id}`)
  
}));
// -------------show----------------------------
router.get('/:id', catchAsync(async (req, res,) => {
  const spot = await Spot.findById(req.params.id).populate('reviews');
  if(!spot){
    req.flash('error', 'Cannot find any spot !');
    return res.redirect('/spots');
  }
  res.render('spots/show', { spot, msg: req.flash("success")  });
}));

// -------------------------edit ------------------
router.get('/:id/edit', catchAsync(async (req, res) => {
  const spot = await Spot.findById(req.params.id)
  if(!spot){
    req.flash('error', 'Cannot find any spot !');
    return res.redirect('/spots');
  }
  res.render('spots/edit', { spot });
}));
router.put('/:id', validateSpot, catchAsync(async (req, res) => {
  const { id } = req.params; 
  const spot = await Spot.findByIdAndUpdate(id, { ...req.body.spot });
  req.flash('success', 'Successfully updated spot !');
  res.redirect(`/spots/${spot._id}`)
}));
//----------------------delete-----------------------
router.delete('/:id', catchAsync(async (req, res) => {
  const { id } = req.params;
  await Spot.findByIdAndDelete(id);
  req.flash('success', 'Successfully deleted spot !');
  res.redirect('/spots');
}));


module.exports = router;