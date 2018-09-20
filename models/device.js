const Joi = require('joi');
const mongoose = require('mongoose');

const deviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50
  },
  manufacturer: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50
  },
  codename: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50
  },
  maintainer: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50
  }
});

const Device = mongoose.model('Device', deviceSchema);

function validateCreateDevice(device) {
  const schema = {
    name: Joi.string().min(3).max(50).required(),
    manufacturer: Joi.string().min(3).max(50).required(),
    codename: Joi.string().min(3).max(50).required(),
    maintainer: Joi.string().min(3).max(50).required()
  };
  return Joi.validate(device, schema);
}

function validateUpdateDevice(device) {
  const schema = {
    name: Joi.string().min(3).max(50),
    manufacturer: Joi.string().min(3).max(50),
    codename: Joi.string().min(3).max(50),
    maintainer: Joi.string().min(3).max(50)
  };
  return Joi.validate(device, schema);
}

exports.Device = Device; 
exports.validateCreate = validateCreateDevice;
exports.validateUpdate = validateUpdateDevice;