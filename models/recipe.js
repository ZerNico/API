const Joi = require('joi');
const mongoose = require('mongoose');

const Recipe = mongoose.model('Recipes', new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true, 
    minlength: 5,
    maxlength: 255
  },
  body: { 
    type: Number, 
    required: true,
    min: 0,
    max: 25500
  }
}));

function validateCreateRecipe(recipe) {
  const schema = {
    title: Joi.string().min(5).max(255).required(),
    body: Joi.number().min(0).max(25500).required(),
  };
  return Joi.validate(recipe, schema);
}

function validateUpdateRecipe(recipe) {
  const schema = {
    title: Joi.string().min(5).max(255),
    body: Joi.number().min(0).max(25500)
  };
  return Joi.validate(recipe, schema);
}

exports.Recipe = Recipe; 
exports.validateCreate = validateCreateRecipe;
exports.validateUpdate = validateUpdateRecipe;