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
            User.findById(req.params.id_user, (error, user) => {
                if (error)
                    res.status(500).json({message : 'Error with the database'});

                if (!user)
                    res.status(404).json({message : 'Not Found'});

                res.status(200).json(user);
            });
        });

    // Route for authenticate the user
    router.route('/authenticate')
        .post((req, res) => {

        ));
}

module.exports = users;
