const express    = require('express');
const bodyParser = require('body-parser');
const morgan     = require('morgan');
const router     = require('./routes');

/*
 * Initial setup
 */
// Create an application express
var app = express();

// Use bodyParser middelware to get the data from a POST/PUT
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

// Use morgan logger to log on the console
app.use(morgan('dev'))

// Set the port
var port = process.env.PORT || 8080;

/*
 * Load the database
 */
var db = require('./handlers/db');

/*
 * Register all routes of the config/routes/index.js router to /api
 */
app.use('/api', router);

/*
 * Start the server
 */
app.listen(port, () => {
  console.log('App listening on port 3000');
});
