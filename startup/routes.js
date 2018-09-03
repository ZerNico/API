const express = require('express');
const recipes = require('../routes/recipes');
const builds = require('../routes/builds');
const devices = require('../routes/devices');
const users = require('../routes/users');
const auth = require('../routes/auth');
const error = require('../middleware/error');

module.exports = function(app) {
  app.use(express.json());
  app.use('/api/recipes', recipes);
  app.use('/api/builds', builds);
  app.use('/api/devices', devices);
  app.use('/api/users', users);
  app.use('/api/auth', auth);
  app.use(error);
}