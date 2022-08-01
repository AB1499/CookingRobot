const mongoose = require('mongoose')

const historySchema = new mongoose.Schema({
  recipeid: {
    type: String,
    required: true
  },
  userid: {
    type: String,
    required: true,
  }
})

module.exports = mongoose.model('History', historySchema)