const config = require('config.json');
const mongoose = require('mongoose');
const connectionOptions = { useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false };
mongoose.connect(process.env.MONGODB_URI || config.connectionString, connectionOptions);
mongoose.Promise = global.Promise;

module.exports = {
    User: require('../models/user'),
    History: require('../models/history'),
    Rating: require('../models/rating'),
    Recipe: require('../models/recipe'),
    Ingredient: require('../models/recipe'),
    Step: require('../models/recipe')
};