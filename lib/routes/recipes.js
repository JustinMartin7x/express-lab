const { router } = require('express');
const Recipe = require('../models/recipe')

module.exports = router()
app.post('/', (req, res) => {
    Recipe
      .insert(req.body)
      .then(recipe => res.send(recipe));
  });
  
  app.get('/', (req, res) => {
    Recipe
      .find()
      .then(recipes => res.send(recipes));
  });
  
  app.get('/:id', (req, res) => {
    Recipe
      .findById(req.params.id)
      .then(recipe => res.send(recipe));
  });
  
  app.put('/:id', (req, res) => {
    Recipe
      .update(req.params.id, req.body)
      .then(recipe => res.send(recipe));
  });
  
  app.delete('/:id', (req, res) => {
    Recipe
      .delete(req.params.id)
      .then(recipe => res.send(recipe));
  });