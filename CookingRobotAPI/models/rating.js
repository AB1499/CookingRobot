var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var ratingSchema = new Schema({  
   comment: {
      type: Number,
      required: true
   },  
   userid:{
      type: Schema.Types.ObjectId,
      ref: 'User'
   }
});

module.exports = mongoose.model('Rating', ratingSchema)