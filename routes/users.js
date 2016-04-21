const User = require('../models/user');

/*
 * Bind all the routes for /users in the router of the app
 */
function users(router) {
    router.route('/users')
        .get((req, res) => {
            res.status(200).json({
                message: 'Connected on Users!'
            });
        });

    router.route('/users/:id_user')
        .get((req, res) => {
            User.findById(req.params.id_user, (error, result) => {
                if (error)
                    res.status(500).json('Error with the database');

                if (result.length === 0)
                    res.status(404).json('Not Found');

                res.status(200).json(result[0]);
            });
        });
}

module.exports = users;
