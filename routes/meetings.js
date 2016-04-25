/*
 * Bind all the routes for /meetings in the router of the app
 */
function meetings(router) {
    router.route('/meetings')
        .get((req, res) => {
            return res.status(200).json({
                message: 'Connected on Meetings!'
            });
        });
}

module.exports = meetings;
