const Joi = require('joi');
const mongoose = require('mongoose');

const versionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50
  },
  potatoVersion: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 50
  },
  androidVersion: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 50
  }
});

const Version = mongoose.model('Version', versionSchema);

function validateCreateVersion(version) {
  const schema = {
    name: Joi.string().min(3).max(50).required(),
    potatoVersion: Joi.string().min(1).max(50).required(),
    androidVersion: Joi.string().min(1).max(50).required()
  };
  return Joi.validate(version, schema);
}

function validateUpdateVersion(version) {
  const schema = {
    name: Joi.string().min(3).max(50),
    potatoVersion: Joi.string().min(1).max(50),
    androidVersion: Joi.string().min(1).max(50)
  };
  return Joi.validate(version, schema);
}

exports.Version = Version; 
exports.validateCreate = validateCreateVersion;
exports.validateUpdate = validateUpdateVersion;