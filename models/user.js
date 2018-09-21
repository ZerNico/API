const config = require('config');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50
  },
  username: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
    unique: true
  },
  email: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
    unique: true
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 1024
  },
  isAdmin: {
    type: Boolean,
    required: true,
    default: false
  }
});

userSchema.methods.generateAuthToken = function() { 
  const token = jwt.sign({ _id: this._id, username: this.username, isAdmin: this.isAdmin }, config.get('jwtPrivateKey'), {expiresIn: '7d'});
  return token;
};

const User = mongoose.model('User', userSchema);

function validateCreateUser(user) {
  const schema = {
    name: Joi.string().min(5).max(50).required(),
    username: Joi.string().min(5).max(50).required(),
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required()
  };
  return Joi.validate(user, schema);
}

function validateUpdateUser(user) {
  const schema = {
    name: Joi.string().min(5).max(50),
    username: Joi.string().min(5).max(50),
    email: Joi.string().min(5).max(255).email(),
    password: Joi.string().min(5).max(255)
  };
  return Joi.validate(user, schema);
}

function validateLoginUser(user) {
  const schema = {
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required()
  };

  return Joi.validate(user, schema);
}

exports.User = User; 
exports.validateCreate = validateCreateUser;
exports.validateUpdate = validateUpdateUser;
exports.validateLogin = validateLoginUser;