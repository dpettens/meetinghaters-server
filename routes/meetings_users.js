const MeetingUser = require('../models/meeting_user');
const User = require('../models/user');

/*
 * Bind all the routes for /meetings/:id_owner/:id_meeting/users in the router of the app
 */
function meetings_users(router) {
    router.route('/meetings/:id_owner/:id_meeting/users')
        .get((req, res) => {
            MeetingUser.findMeetingUserByIdAndOwner(
                req.params.id_meeting,
                req.body.id_user,
                req.params.id_owner,
                ['_id'] , (error, result) => {
                    if (error)
                        return res.status(500).json({
                            error: 'Find failed. Error with the database.'
                        });

                    if (!result)
                        return res.status(401).json({
                            error: 'Find failed. You are not authorizate to view the user of this meeting.'
                        });

                    MeetingUser.findAllById(
                        req.params.id_meeting,
                        req.params.id_owner, [
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
            if (req.params.id_owner != req.key)
                return res.status(401).json({
                    error: 'Save failed. You are not authorizate to add a user of this meeting.'
                });

            MeetingUser.findMeetingUserByIdAndOwner(
                req.params.id_meeting,
                req.body.id_user,
                req.params.id_owner,
                ['_id'], (error, meeting_user) => {
                    if (error)
                        return res.status(500).json({
                            error: 'Save failed. Error with the database.'
                        });

                    if (meeting_user)
                        return res.status(409).json({
                            error: 'Save failed. Meeting\'s user already exists.'
                        });

                    var meeting_user = new MeetingUser({
                        id_meeting: req.params.id_meeting,
                        id_user: req.body.id_user,
                        id_owner: req.params.id_owner
                    });

                    meeting_user.save((error) => {
                        if (error && error.message === 'ValidationError')
                            return res.status(400).json({
                                error: error.validationErrors
                            });

                        if (error)
                            return res.status(500).json({
                                message: 'Save failed. Error with the database.'
                            });

                        User.findById(req.body.id_user, ['mail'], (error, result) => {
                            if (error)
                                return res.status(500).json({
                                    error: 'Save failed. Error with the database.'
                                });

                            if (result)
                                return res.status(200).json({
                                    exists: true
                                });
                            else
                                return res.status(200).json({
                                    exists: false
                                });
                        });
                    });
                });
        });

    router.route('/meetings/:id_owner/:id_meeting/users/:id_user')
        .get((req, res) => {
            MeetingUser.findMeetingUserByIdAndOwner(
                req.params.id_meeting,
                req.body.id_user,
                req.params.id_owner,
                ['_id'] , (error, result) => {
                    if (error)
                        return res.status(500).json({
                            error: 'Find failed. Error with the database.'
                        });

                    if (!result)
                        return res.status(401).json({
                            error: 'Find failed. You are not authorizate to view the user of this meeting.'
                        });

                    MeetingUser.findUserByIdAndOwner(
                        req.params.id_meeting,
                        req.params.id_user,
                        req.params.id_owner, [
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
