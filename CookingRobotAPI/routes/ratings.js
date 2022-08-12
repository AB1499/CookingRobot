const express = require('express')
const router = express.Router()
const db = require('../_helpers/db');
const Rating = db.Rating;

// Getting all
router.get('/', async (req, res) => {
  try {
    const ratings = await Rating.find()
    res.json(ratings)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Getting One
router.get('/:ratingid', getRating, (req, res) => {
  res.json(res.rating)
})

// Creating one
router.post('/', async (req, res) => {
  const rating = new Rating({
    recipeid: req.body.recipeid,
    rating: req.body.rating,
    userid: req.body.userid
  })
  try {
    const newRating = await rating.save()
    res.status(201).json(newRating)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

async function getRating(req, res, next) {
  let rating
  try {
    rating = await Rating.find({ 'ratingid': req.params.ratingid})
    if (rating == null) {
      return res.status(404).json({ message: 'Cannot find rating' })
    }
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }

  res.rating = rating
  next()
}

module.exports = router