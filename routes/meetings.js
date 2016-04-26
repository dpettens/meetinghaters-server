const Meeting = require('../models/meeting');
/*
 * Bind all the routes for /meetings in the router of the app
 */
function meetings(router) {
    router.route('/meetings')
        .get((req, res) => {
            Meeting.findAllByUser(req.key, ['_id', 'name', 'owner', 'time_pre', 'time_start', 'time_end', 'time_post'], (error, meetings) => {
                if (error)
                    return res.status(500).json({
                        error: 'Find failed. Error with the database.'
                    });

                return res.status(200).json(meetings);
            });
        })

        .post((req, res) => {
            Meeting.findByIdAndOwner(req.body._id, req.key, ['_id'], (error, meeting) => {
                if (error)
                    return res.status(500).json({
                        error: 'Save failed. Error with the database.'
                    });

                if (meeting)
                    return res.status(409).json({
                        error: 'Save failed. Meeting with this ID already exists.'
                    });

                var meeting = new Meeting({
                    _id: req.body._id,
                    name: req.body.name,
                    owner: req.key,
                    description: req.body.description,
                    location: req.body.location,
                    time_pre: req.body.time_pre,
                    time_start: req.body.time_start,
                    time_end: req.body.time_end,
                    time_post: req.body.time_post
                });

                meeting.save((error) => {
                    if (error && error.message === 'ValidationError')
                        return res.status(400).json({
                            error: error.validationErrors
                        });

                    if (error)
                        return res.status(500).json({
                            message: 'Save failed. Error with the database.'
                        });

                    return res.status(201).end();
                });
            });
        });

    router.route('/meetings/:owner/:meeting_id')
        .get((req, res) => {
            Meeting.findByIdAndOwner(req.params.meeting_id, req.params.owner, [], (error, meeting) => {
                if (error)
                    return res.status(500).json({
                        error: 'Find failed. Error with the database.'
                    });

                if (!meeting)
                    return res.status(404).json({
                        error: 'Find failed. Meeting not found.'
                    });

                return res.status(200).json(meeting);
            });
        })

        .put((req, res) => {
            if (req.params.owner !== req.key)
                return res.status(401).json({
                    error: 'Update failed. You are not authorizate to update this meeting.'
                });

            Meeting.findByIdAndOwner(req.params.meeting_id, req.params.owner, [], (error, meeting) => {
                if (error)
                    return res.status(500).json({
                        error: 'Update failed. Error with the database.'
                    });

                if (!meeting)
                    return res.status(404).json({
                        error: 'Update failed. Meeting not found.'
                    });


                meeting.update(req.body, (error) => {
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
            if (req.params.owner !== req.key)
                return res.status(401).json({
                    error: 'Update failed. You are not authorizate to update this meeting.'
                });

            Meeting.findByIdAndOwner(req.params.meeting_id, req.params.owner, ['_id'], (error, meeting) => {
                if (error)
                    return res.status(500).json({
                        error: 'Delete failed. Error with the database.'
                    });

                if (!meeting)
                    return res.status(404).json({
                        error: 'Delete failed. Meeting not found.'
                    });

                meeting.delete((error) => {
                    if (error)
                        return res.status(500).json({
                            error: 'Delete failed. Error with the database.'
                        });

                    return res.status(204).end();
                });
            });
        });
}

module.exports = meetings;
