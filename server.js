const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const unless = require('express-unless');
const auth = require('./libs/auth');
const router = require('./routes');

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
app.set('port', process.env.PORT || 8080);

/*
 * Auth Middelware to protect sensitive routes with jwt and/or id user
 * Some routes are not protected via the unless middelware
 */
app.use('/api', auth.unless({
    path: [{
        url: '/api/authenticate',
        methods: ['POST']
    }, {
        url: '/api/users',
        methods: ['POST']
    }]
}));

/*
 * Register all routes of the config/routes/index.js router to /api
 */
app.use('/api', router);

/*
 * Send 404 error if the route doesn't match a route of the router
 */
app.all('*', (req, res) => {
    res.status(404).json({
        message: 'Route not found. Error with the request.'
    });
});

/*
 * Start the server
 */
app.listen(app.get('port'), () => {
    console.log('App listening on port ' + app.get('port'));
});
