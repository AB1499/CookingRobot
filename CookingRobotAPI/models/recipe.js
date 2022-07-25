const mongoose = require('mongoose')
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId

const ingredientSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  amountPerServing: {
    type: String,
    required: true
  },
  quantityUnit: {
    type: String,
    required: true
  }
})

const stepSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: false
  },
  isRobotStep: {
    type: Boolean,
    required: true
  },
  ingredients: {
    type: [ingredientSchema],
    required: false
  },
  utensils: {
    type: [String],
    required: false
  },
  stepTimeTaken: {
    type: String,
    required: true
  }
})

const recipeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: false
  },
  cookingTime: {
    type: String,
    required: true
  },
  userid:{
    type: String,
    required: true
  },
  isVeg: {
    type: Boolean,
    required: true
  }, 
  steps: {
    type: [stepSchema],
    required: true
  }
})



module.exports = mongoose.model('Ingredient', ingredientSchema)
module.exports = mongoose.model('Step', stepSchema)
module.exports = mongoose.model('Recipe', recipeSchema)