const Joi = require('joi');
const mongoose = require('mongoose');
const {deviceSchema} = require('./device');

const Build = mongoose.model('Builds', new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true, 
    minlength: 5,
    maxlength: 255
  },
  device: { 
    type: deviceSchema,  
    required: true
  },
  size: { 
    type: Number, 
    required: true,
    min: 0
  },
  date: { 
    type: Date, 
    required: true,
    default: Date.now
  }
}));

function validateBuild(build) {
  const schema = {
    namme: Joi.string().min(5).max(255).required(),
    deviceId: Joi.objectId().required(),
    size: Joi.number().min(0).required(),
    date: Joi.date().min(0).required()
  };

  return Joi.validate(build, schema);
}

exports.Buid = Build; 
exports.validate = validateBuild;