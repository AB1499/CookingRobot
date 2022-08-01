const express = require('express')
const router = express.Router()
const History = require('../models/history')

// Getting all
router.get('/', async (req, res) => {
  try {
    const histories = await History.find()
    res.json(histories)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Getting One
router.get('/:userid', getHistory, (req, res) => {
  res.json(res.history)
})

// Creating one
router.post('/', async (req, res) => {
  const history = new History({
    recipeid: req.body.recipeid,
    userid: req.body.userid
  })
  try {
    const newHistory = await history.save()
    res.status(201).json(newHistory)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

async function getHistory(req, res, next) {
  let history
  try {
    history = await History.find({ 'userid': req.params.userid})
    if (history == null) {
      return res.status(404).json({ message: 'Cannot find history' })
    }
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }

  res.history = history
  next()
}

module.exports = router