const admin = require('../middleware/admin');
const auth = require('../middleware/auth');
const validateObjectId = require('../middleware/validateObjectId');
const {Device, validateCreate,  validateUpdate} = require('../models/device');

const express = require('express');

const router = express.Router();

router.get('/', async (req, res) => {
  const devices = await Device.find().sort('manufacturer');
  res.send(devices);
});

router.post('/', [auth, admin], async (req, res) => {
  const { error } = validateCreate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  const device = new Device({ 
    name: req.body.name,
    manufacturer: req.body.manufacturer,
    codename: req.body.codename,
    maintainer: req.body.maintainer
  });
  await device.save();
  
  res.send(device);
});

router.patch('/:id', [auth, validateObjectId], async (req, res) => {
  const { error } = validateUpdate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  const device = await Device.findByIdAndUpdate(req.params.id, req.body, { new: true });

  if (!device) return res.status(404).send('The device with the given ID was not found.');
  
  res.send(device);
});

router.delete('/:id', [auth, admin, validateObjectId], async (req, res) => {
  const device = await Device.findByIdAndRemove(req.params.id);

  if (!device) return res.status(404).send('The device with the given ID was not found.');

  res.send(device);
});

router.get('/:id', validateObjectId, async (req, res) => {
  const device = await Device.findById(req.params.id);

  if (!device) return res.status(404).send('The device with the given ID was not found.');

  res.send(device);
});

module.exports = router; 