const jwt = require('jsonwebtoken');
const config = require('../config');
const User = require('../models/user');

/*
 * Bind all the routes for /users in the router of the app
 */
function users(router) {
    router.route('/users')
        .post((req, res) => {
            User.findById(req.body.mail, ['mail'], (error, result) => {
                if (error)
                    return res.status(500).json({
                        error: 'Save failed. Error with the database.'
                    });

                if (result)
                    return res.status(409).json({
                        error: 'Save failed. User already exists.'
                    });

                var user = new User({
                    mail: req.body.mail,
                    password: req.body.password,
                    firstname: req.body.firstname,
                    surname: req.body.surname,
                    photo: req.body.photo
                });

                user.save((error) => {
                    if (error && error.message === 'ValidationError')
                        return res.status(400).json({
                            error: error.validationErrors
                        });

                    if (error)
                        return res.status(500).json({
                            message: 'Save failed. Error with the database.'
                        });

                    return res.redirect(307, '/api/authenticate');
                });
            });
        });

    router.route('/users/:id_user')
        .get((req, res) => {
            User.findById(req.params.id_user, [
                'mail',
                'firstname',
                'surname',
                'location',
                'last_connection'
            ], (error, user) => {
                if (error)
                    return res.status(500).json({
                        error: 'Find failed. Error with the database.'
                    });

                if (!user)
                    return res.status(404).json({
                        error: 'Find failed. User not found.'
                    });

                return res.status(200).json(user);
            });
        })

        .put((req, res) => {
            User.findById(req.params.id_user, [], (error, user) => {
                if (error)
                    return res.status(500).json({
                        error: 'Update failed. Error with the database.'
                    });

                if (!user)
                    return res.status(404).json({
                        error: 'Update failed. User not found.'
                    });


                user.update(req.body, (error) => {
                    if (error && error.message === 'ValidationError')
                        return res.status(400).json({
                            error: error.validationErrors
                        });

                    if (error)
                        return res.status(500).json({
                            error: 'Update failed. Error with the database.'
                        });

                    return res.status(204).end();
                });
            });
        })

        .delete((req, res) => {
            User.findById(req.params.id_user, ['mail'], (error, user) => {
                if (error)
                    return res.status(500).json({
                        error: 'Delete failed. Error with the database.'
                    });

                if (!user)
                    return res.status(404).json({
                        error: 'Delete failed. User not found.'
                    });

                user.delete((error) => {
                    if (error)
                        return res.status(500).json({
                            error: 'Delete failed. Error with the database.'
                        });

                    return res.status(204).end();
                });
            });
        });

    // Route for authenticate the user
    router.route('/authenticate')
        .post((req, res) => {
            User.findById(req.body.mail, [
                'mail',
                'password'
            ], (error, user) => {
                if (error)
                    return res.status(500).json({
                        error: 'Authentication failed. Error with the database.'
                    });

                if (!user)
                    return res.status(404).json({
                        error: 'Authentication failed. User not found.'
                    });

                if (!user.validPassword(req.body.password))
                    return res.status(400).json({
                        error: 'Authentication failed. Wrong password.'
                    });

                // Create the JWT token and send it
                jwt.sign(user, config.app.secret, {}, (token) => {
                    return res.status(200).json({
                        token: token
                    });
                });
            });
        });
}

module.exports = users;
