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
}

module.exports = users;
