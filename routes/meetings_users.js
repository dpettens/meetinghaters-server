const MeetingUser = require('../models/meeting_user');
/*
 * Bind all the routes for /meetings/:id_owner/:id_meeting/users in the router of the app
 */
function meetings_users(router) {
    router.route('/meetings/:id_owner/:id_meeting/users')
        .get((req, res) => {
            MeetingUser.findByIdAndOwner(
                req.params.id_meeting,
                req.key,
                req.params.id_owner, [
                    'users.mail',
                ], (error, result) => {
                    if (error)
                        return res.status(500).json({
                            error: 'Find failed. Error with the database.'
                        });

                    if (!result)
                        return res.status(401).json({
                            error: 'Find failed. You are not authorizate to view the users of this meeting.'
                        });

                    MeetingUser.findAllById(req.params.id_meeting, req.params.id_owner, [
                        'users.mail',
                        'users.firstname',
                        'users.surname',
                        'users.location',
                        'users.last_connection',
                        'm2m.status',
                        'm2m.expected_status',
                        'm2m.reason'
                    ], (error, meetings_users) => {
                        if (error)
                            return res.status(500).json({
                                error: 'Find failed. Error with the database.'
                            });

                        return res.status(200).json(meetings_users);
                    });
                });
            })

        .post((req, res) => {

        });

    router.route('/meetings/:id_owner/:id_meeting/users/:id_user')
        .get((req, res) => {
            MeetingUser.findByIdAndOwner(
                req.params.id_meeting,
                req.key,
                req.params.id_owner, [
                    'users.mail',
                ], (error, result) => {
                    if (error)
                        return res.status(500).json({
                            error: 'Find failed. Error with the database.'
                        });

                    if (!result)
                        return res.status(401).json({
                            error: 'Find failed. You are not authorizate to view the user of this meeting.'
                        });

                    MeetingUser.findByIdAndOwner(req.params.id_meeting, req.params.id_user, req.params.id_owner, [
                        'users.mail',
                        'users.firstname',
                        'users.surname',
                        'users.location',
                        'users.last_connection',
                        'm2m.status',
                        'm2m.expected_status',
                        'm2m.reason'
                    ], (error, meeting_user) => {
                        if (error)
                            return res.status(500).json({
                                error: 'Find failed. Error with the database.'
                            });

                        if (!meeting_user)
                            return res.status(404).json({
                                error: 'Find failed. Meeting\'s user not found.'
                            });

                        return res.status(200).json(meeting_user);
                    });
                });
        })

        .put((req, res) => {
            
        })

        .delete((req, res) => {

        });
}

module.exports = meetings_users;
