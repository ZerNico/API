const validateObjectId = require('../middleware/validateObjectId');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const {Version, validateCreate,  validateUpdate} = require('../models/version');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  const versions = await Version.find().sort('manufacturer');
  res.send(versions);
});

router.post('/', [auth, admin], async (req, res) => {
  const { error } = validateCreate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  const version = new Version({ 
    name: req.body.name,
    potatoVersion: req.body.potatoVersion,
    androidVersion: req.body.androidVersion
  });
  await version.save();
  
  res.send(version);
});

router.patch('/:id', [auth, validateObjectId], async (req, res) => {
  const { error } = validateUpdate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  const version = await Version.findByIdAndUpdate(req.params.id, req.body, { new: true });

  if (!version) return res.status(404).send('The version with the given ID was not found.');
  
  res.send(version);
});

router.delete('/:id', [auth, admin, validateObjectId], async (req, res) => {
  const version = await Version.findByIdAndRemove(req.params.id);

  if (!version) return res.status(404).send('The version with the given ID was not found.');

  res.send(version);
});

router.get('/:id', validateObjectId, async (req, res) => {
  const version = await Version.findById(req.params.id);

  if (!version) return res.status(404).send('The version with the given ID was not found.');

  res.send(version);
});

module.exports = router; 