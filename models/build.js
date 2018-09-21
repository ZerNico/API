const Joi = require('joi');
const mongoose = require('mongoose');

const buildSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true, 
    minlength: 5,
    maxlength: 255,
    unique: true
  },
  device: { 
    type: String,  
    required: true,
    minlength: 5,
    maxlength: 50
  },
  version: { 
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50
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
});

const Build = mongoose.model('Build', buildSchema);

function validateCreateBuild(build) {
  const schema = {
    device: Joi.objectId().required(),
    version: Joi.objectId().required(),
    date: Joi.date()
  };
  return Joi.validate(build, schema);
}

function validateUpdateBuild(build) {
  const schema = {
    date: Joi.date()
  };
  return Joi.validate(build, schema);
}

exports.Build = Build; 
exports.validateCreate = validateCreateBuild;
exports.validateUpdate = validateUpdateBuild;