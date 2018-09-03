const validateObjectId = require('../middleware/validateObjectId');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const {Recipe, validate} = require('../models/recipe'); 
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  const recipes = await Recipe.find().sort('title');
  res.send(recipes);
});

router.post('/', [auth, admin], async (req, res) => {
  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  const recipe = new Recipe({ 
    title: req.body.title,
    body: req.body.body
  });
  await recipe.save();
  
  res.send(recipe);
});

router.put('/:id', [auth, admin, validateObjectId], async (req, res) => {
  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  const recipe = await Recipe.findByIdAndUpdate(req.params.id,
    { 
      title: req.body.title,
      body: req.body.body
    }, { new: true });

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