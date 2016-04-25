const jwt = require('jsonwebtoken');
const unless = require('express-unless');
const config = require('../config');
const User = require('../models/user');
/*
 * Auth Middelware to protect sensitive routes with jwt and/or id user
 */
function auth(req, res, next) {
    var token = (req.body && req.body.access_token) || (req.query && req.query.access_token) || req.headers['x-access-token'];
    var key = (req.body && req.body.x_key) || (req.query && req.query.x_key) || req.headers['x-key'];

    if (!(token && key))
        return res.status(401).json({
            error: 'Authorization failed. Invalid token or key.'
        });

    jwt.verify(token, config.app.secret, function(error, decoded) {
        if (error)
            return res.status(400).json({
                error: 'Authorization failed. Error with the token.'
            });

        if (key !== decoded.mail)
            return res.status(400).json({
                error: 'Authorization failed. Error with the key.'
            });

        User.findById(key, ['mail'], (error, user) => {
            if (error)
                return res.status(500).json({
                    error: 'Authorization failed. Error with the database.'
                });

            if (!user)
                return res.status(404).json({
                    error: 'Authorization failed. User with the key not found.'
                });

            // save decoded for use in other routes if ever
            req.decoded = decoded;
            next();
        });
    });
}

auth.unless = unless;

module.exports = auth;
