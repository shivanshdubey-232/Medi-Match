const Joi = require("joi");

module.exports.doctorSchema = Joi.object({
  doctor: Joi.object({
    name: Joi.string().required(),
    degree: Joi.string().required(),
    department: Joi.string().required(),
    image: Joi.string().required(),
  }).required(),
});

module.exports.appointmentSchemaSchema = Joi.object({
  appointmentSchema: Joi.object({
    name: Joi.string().required(),
    email: Joi.string().required(),
    phone: Joi.string().required(),
    date: Joi.date().required(),
    time: Joi.string().required(),
  }).required(),
});
