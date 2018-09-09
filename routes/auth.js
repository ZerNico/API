const Joi = require('joi');
const auth = require('../middleware/auth');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const {User, validateCreate, validateUpdate, validateLogin} = require('../models/user');
const express = require('express');
const router = express.Router();

router.post('/login', async (req, res) => {
  const { error } = validateLogin(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send('Invalid email or password.');

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send('Invalid email or password.');

  const token = user.generateAuthToken();
  res.send(token);
});

router.get('/me', auth, async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  res.send(user);
});

router.patch('/me', auth, async (req, res) => {
  const { error } = validateUpdate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  let email = await User.findOne({ email: req.body.email });
  if (email) return res.status(400).send('Email already registered');
  let username = await User.findOne({ email: req.body.username });
  if (username) return res.status(400).send('Username already registered.');

  if (req.body.password) {
    const salt = await bcrypt.genSalt(10);
    req.body.password  = await bcrypt.hash(req.body.password, salt);
  }

  const user = await User.findByIdAndUpdate(req.user._id, req.body, { new: true });

  const token = user.generateAuthToken();
  res.header('x-auth-token', token).send(_.pick(user, ['_id', 'name', 'username', 'email']));
});

router.post('/register', async (req, res) => {
  const { error } = validateCreate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send('User already registered.');

  user = new User(_.pick(req.body, ['name', 'username', 'email', 'password']));
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  await user.save();

  const token = user.generateAuthToken();
  res.header('x-auth-token', token).send(_.pick(user, ['_id', 'name', 'username', 'email']));
});

module.exports = router; 
