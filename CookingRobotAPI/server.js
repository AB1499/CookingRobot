﻿require('rootpath')();
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const errorHandler = require('./_helpers/error-handler');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
  
app.use(cors({
    origin: '*'
}));

app.use(express.json())

const usersRouter = require('./routes/users')
const recipesRouter = require('./routes/recipes')
const ratingsRouter = require('./routes/ratings')
const historiesRouter = require('./routes/histories')

app.use('/users', usersRouter)
app.use('/recipes', recipesRouter)
app.use('/ratings', ratingsRouter)
app.use('/histories', historiesRouter)

app.use(errorHandler);

const port = process.env.NODE_ENV === 'production' ? (process.env.PORT || 80) : 4000;
const server = app.listen(port, function () {
    console.log('Server listening on port ' + port);
});