const express = require('express')
const router = express.Router()
const db = require('../_helpers/db');
const Recipe = db.Recipe;
const Ingredient = db.Ingredient;
const Step = db.Step;


// Getting all
router.get('/', async (req, res) => {
  try {
    const recipes = await Recipe.find()
    res.json(recipes)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Getting One
router.get('/:recipeid', getRecipe, (req, res) => {
  res.json(res.recipe)
})

// Deleting One
router.delete('/:recipeid', deleteRecipe, (req, res) => {
  res.json(res.recipe)
})

// Creating one
router.post('/', async (req, res) => {
  const input = req.body;

  const recipe = new Recipe({
    name: input.name,
    isVeg: input.isVeg,
    cookingTime: input.cookingTime,
    userid: input.userid,
    steps: input.steps,
    description: input.description
  })
  try {
    const newRecipe = await recipe.save()
    res.status(201).json(newRecipe)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

async function getRecipe(req, res, next) {
  let recipe
  try {
    recipe = await Recipe.find({ '_id': req.params.recipeid})
    if (recipe == null) {
      return res.status(404).json({ message: 'Cannot find recipe' })
    }
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }

  res.recipe = recipe
  next()
}

async function deleteRecipe(req, res, next) {
  let recipe
  try {
    recipe = await Recipe.findOneAndDelete({ '_id': req.params.recipeid})
    if (recipe == null) {
      return res.status(404).json({ message: 'Cannot find recipe' })
    }
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }

  res.recipe = recipe
  next()
}

module.exports = router