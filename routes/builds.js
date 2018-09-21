const admin = require('../middleware/admin');
const auth = require('../middleware/auth');
const validateObjectId = require('../middleware/validateObjectId');
const {Build, validateCreate, validateUpdate} = require('../models/build'); 
const {Device} = require('../models/device');
const {Version} = require('../models/version');

const config = require('config');
const express = require('express');
const fs = require('fs');
const mkdirp = require('mkdirp');
const multer = require('multer');
const path = require('path');

const router = express.Router();
const buildPath = path.resolve(config.get('buildPath'));

const storage = multer.diskStorage({
  destination: async function (req, file, cb) {
    let device = await Device.findById(req.body.device);
    const uploadPath = path.join(buildPath, device.codename);
    if (!fs.existsSync(uploadPath)) {
      await mkdirp(uploadPath, function (err) {
        if (err) cb(new Error(err));
      });
    }
    cb(null, path.join(uploadPath));
  },
  filename: function(req, file, cb) {
    cb(null, file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/zip' || 'application/x-zip-compressed') {
    cb(null, true);
  } else {
    cb(new Error('Only zip files are allowed'), false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 1024
  },
  fileFilter: fileFilter
});

router.get('/', async (req, res) => {
  const builds = await Build.find().sort('name');
  res.send(builds);
});

router.post('/', [auth, admin], upload.single('buildFile'), async (req, res) => {
  const { error } = validateCreate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  const device = await Device.findById(req.body.device);
  if (!device) return res.status(400).send('Invalid device.');
  const version = await Version.findById(req.body.version);
  if (!version) return res.status(400).send('Invalid version.');
  const name = await Build.findOne({ name: req.file.originalname });
  if (name) return res.status(400).send('File exists already.');
 
  const build = new Build({ 
    name: req.file.originalname,
    device: req.body.device,
    version: req.body.version,
    size: req.file.size,
    date: req.body.date
  });
  await build.save();
  
  res.send(build);
});

router.patch('/:id', [auth, admin, validateObjectId], async (req, res) => {
  const { error } = validateUpdate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  const build = await Build.findByIdAndUpdate(req.params.id, req.body, { new: true });

  if (!build) return res.status(404).send('The build with the given ID was not found.');
  
  res.send(build);
});

router.delete('/:id', [auth, admin, validateObjectId], async (req, res) => {
  const build = await Build.findByIdAndRemove(req.params.id);

  if (!build) return res.status(404).send('The build with the given ID was not found.');
  else {
    let device = await Device.findById(build.device);
    await fs.unlink(path.join(buildPath, device.codename, build.name), function (err) {
      if (err) res.status(500).send(err);
    });
  }

  res.send(build);
});

router.get('/:id', validateObjectId, async (req, res) => {
  const build = await Build.findById(req.params.id);

  if (!build) return res.status(404).send('The build with the given ID was not found.');

  res.send(build);
});

module.exports = router; 