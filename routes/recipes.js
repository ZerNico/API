const validateObjectId = require('../middleware/validateObjectId');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const {Recipe, validateCreate, validateUpdate} = require('../models/recipe'); 
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  const recipes = await Recipe.find().sort('title');
  res.send(recipes);
});

router.post('/', [auth, admin], async (req, res) => {
  const { error } = validateCreate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  const recipe = new Recipe({ 
    title: req.body.title,
    body: req.body.body
  });
  await recipe.save();
  
  res.send(recipe);
});

router.patch('/:id', [auth, admin, validateObjectId], async (req, res) => {
  const { error } = validateUpdate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  const recipe = await Recipe.findByIdAndUpdate(req.params.id, req.body, { new: true });

  if (!recipe) return res.status(404).send('The recipe with the given ID was not found.');
  
  res.send(recipe);
});

router.delete('/:id', [auth, admin, validateObjectId], async (req, res) => {
  const recipe = await Recipe.findByIdAndRemove(req.params.id);

  if (!recipe) return res.status(404).send('The recipe with the given ID was not found.');

  res.send(recipe);
});

router.get('/:id', validateObjectId, async (req, res) => {
  const recipe = await Recipe.findById(req.params.id);

  if (!recipe) return res.status(404).send('The recipe with the given ID was not found.');

  res.send(recipe);
});

module.exports = router; 