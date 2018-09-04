const validateObjectId = require('../middleware/validateObjectId');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const {Build, validate} = require('../models/build'); 
const {Device} = require('../models/device');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  const builds = await Build.find().sort('name');
  res.send(builds);
});

router.post('/', [auth, admin], async (req, res) => {
  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  const device = await Device.findById(req.body.deviceId);
  if (!device) return res.status(400).send('Invalid device.');

  const build = new Build({ 
    name: req.body.title,
    device: {
      _id: device._id,
      name: device.name
    },
    size: req.body.size,
    date: req.body.date
  });
  await build.save();
  
  res.send(build);
});

router.put('/:id', [auth, admin, validateObjectId], async (req, res) => {
  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  const device = await Device.findById(req.body.deviceId);
  if (!device) return res.status(400).send('Invalid device.');

  const build = await Build.findByIdAndUpdate(req.params.id,
    { 
      name: req.body.title,
      device: {
        _id: device._id,
        name: device.name
      },
      size: req.body.size,
      date: req.body.date
    }, { new: true });

  if (!build) return res.status(404).send('The build with the given ID was not found.');
  
  res.send(build);
});

router.delete('/:id', [auth, admin, validateObjectId], async (req, res) => {
  const build = await Build.findByIdAndRemove(req.params.id);

  if (!build) return res.status(404).send('The build with the given ID was not found.');

  res.send(build);
});

router.get('/:id', validateObjectId, async (req, res) => {
  const build = await Build.findById(req.params.id);

  if (!build) return res.status(404).send('The build with the given ID was not found.');

  res.send(build);
});

module.exports = router; 