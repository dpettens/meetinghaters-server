const express    = require('express');
const bodyParser = require('body-parser');
const morgan     = require('morgan');
const mysql      = require('mysql');
const config     = require('./config');
const routes     = require('./routes');

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
 * Database setup and connection
 */
var connection = mysql.createConnection({
    host     : config.database.host,
    user     : config.database.user,
    password : config.database.password,
    database : config.database.database
});

connection.connect((error) => {
  if (err) {
    console.error('Error on the database connection : ' + error.stack);
    process.exit(1);
  }

  console.log('Connected as id ' + connection.threadId);
});

/*
 * Register routes form app/config/routes to /api
 */
app.use('/api', routes);

/*
 * Start the server
 */
app.listen(port, () => {
  console.log('App listening on port 3000');
});
