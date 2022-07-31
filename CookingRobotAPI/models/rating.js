const mongoose = require('mongoose')

const ratingSchema = new mongoose.Schema({
  recipeid: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true
  },
  userid: {
    type: String,
    required: true,
  }
})

module.exports = mongoose.model('Rating', ratingSchema)