const Meeting = require('../models/meeting');
/*
 * Bind all the routes for /meetings in the router of the app
 */
function meetings(router) {
    router.route('/meetings')
        .get((req, res) => {
            Meeting.findAllByUser(req.key, [
                '_id',
                'name',
                'description',
                'location',
                'id_owner',
                'time_pre',
                'time_start',
                'time_end',
                'time_post'
            ], (error, meetings) => {
                if (error)
                    return res.status(500).json({
                        error: 'Find failed. Error with the database.'
                    });

                return res.status(200).json(meetings);
            });
        })

        .post((req, res) => {
            var meeting = new Meeting({
                name: req.body.name,
                id_owner: req.key,
                description: req.body.description,
                location: req.body.location,
                time_pre: req.body.time_pre,
                time_start: req.body.time_start,
                time_end: req.body.time_end,
                time_post: req.body.time_post
            });

            meeting.save((error, id) => {
                if (error && error.message === 'ValidationError')
                    return res.status(400).json({
                        error: error.validationErrors
                    });

                if (error)
                    return res.status(500).json({
                        message: 'Save failed. Error with the database.'
                    });

                return res.status(200).json({
                    id: id
                });
            });
        });

    router.route('/meetings/:id_owner/:id_meeting')
        .get((req, res) => {
            Meeting.findByIdAndOwner(req.params.id_meeting, req.params.id_owner, [], (error, meeting) => {
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
            if (req.params.id_owner !== req.key)
                return res.status(401).json({
                    error: 'Update failed. You are not authorizate to update this meeting.'
                });

            Meeting.findByIdAndOwner(req.params.id_meeting, req.params.id_owner, [], (error, meeting) => {
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
            if (req.params.id_owner !== req.key)
                return res.status(401).json({
                    error: 'Update failed. You are not authorizate to update this meeting.'
                });

            Meeting.findByIdAndOwner(req.params.id_meeting, req.params.id_owner, [
                '_id'
            ], (error, meeting) => {
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
