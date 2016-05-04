"use strict";
const db = require('../libs/db');

class MeetingUser {
    constructor(meeting_user) {
        this._id = meeting_user._id;
        this.id_user = meeting_user.id_user;
        this.id_meeting = meeting_user.id_meeting;
        this.id_owner = meeting_user.id_owner;
        this.status = meeting_user.status;
        this.reason = meeting_user.reason;
        this.expected_status = meeting_user.expected_status;
    }

    save(next) {
        this.validate((error) => {
            if (error)
                return next(error);

            db.getConnection((error, connection) => {
                if (error)
                    return next(error);

                connection.query('INSERT INTO m2m_meetings_users SET ?', this, (error) => {
                    if (error)
                        return next(error);

                        connection.release();
                        next(null);
                });
            });
        });
    }

    update(data, next) {
        // update the meeting object with the new value
        Object.keys(data).forEach((key) => {
            this[key] = data[key];
        });

        this.validate((error) => {
            if (error)
                return next(error);

            db.getConnection((error, connection) => {
                if (error)
                    return next(error);

                connection.query('UPDATE m2m_meetings_users SET id_owner = ?, status = ?, \
                    reason = ?, excepted_status = ? WHERE id_user = ? AND id_meeting = ?', [
                    this.id_owner,
                    this.status,
                    this.reason,
                    this.expected_status,
                    this.id_user,
                    this.id_meeting
                ], (error) => {
                    if (error)
                        return next(error);

                    connection.release();
                    next(null);
                });
            });
        });
    }

    delete(next) {
        db.getConnection((error, connection) => {
            if (error)
                return next(error);

            connection.query('DELETE FROM m2m_meetings_users WHERE _id = ?', this._id, (error) => {
                if (error)
                    return next(error);

                connection.release();
                next(null);
            });
        });
    }

    static findMeetingUserByIdAndOwner(id_meeting, id_user, id_owner, fields, next) {
        db.getConnection((error, connection) => {
            if (error)
                return next(error);

            connection.query('SELECT ?? FROM m2m_meetings_users WHERE id_meeting = ? \
            AND id_owner = ? AND id_user = ?', [
                fields,
                id_meeting,
                id_owner,
                id_user
            ], (error, result) => {
                console.log(error);
                if (error)
                    return next(error);

                if (result.length === 0)
                    return next(null, false);

                connection.release();
                next(null, result[0]);
            });
        });
    }

    static findUserByIdAndOwner(id_meeting, id_user, id_owner, fields, next) {
        db.getConnection((error, connection) => {
            if (error)
                return next(error);

            connection.query('SELECT ?? FROM users JOIN m2m_meetings_users as m2m \
            ON m2m.id_meeting = ? AND m2m.id_owner = ? AND users.mail = ?', [
                fields,
                id_meeting,
                id_owner,
                id_user
            ], (error, result) => {
                console.log(error);
                if (error)
                    return next(error);

                if (result.length === 0)
                    return next(null, false);

                connection.release();
                next(null, result[0]);
            });
        });
    }

    static findAllById(id_meeting, id_owner, fields, next) {
        db.getConnection((error, connection) => {
            if (error)
                return next(error);

            connection.query('SELECT ?? FROM users JOIN m2m_meetings_users as \
            m2m ON m2m.id_meeting = ? AND m2m.id_owner = ? AND users.mail = m2m.id_user', [
                fields,
                id_meeting,
                id_owner
            ], (error, result) => {
                console.log(error);
                if (error)
                    return next(error);

                connection.release();
                next(null, result);
            });
        });
    }

    validate(next) {
        next(false);
    }
}

module.exports = MeetingUser;
