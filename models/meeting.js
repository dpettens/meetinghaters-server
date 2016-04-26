"use strict";
const db = require('../libs/db');

let default_fields = [
    '_id',
    'name',
    'location',
    'id_owner',
    'description',
    'time_pre',
    'time_start',
    'time_end',
    'time_post'
];

class Meeting {
    constructor(meeting) {
        this._id = meeting._id;
        this.name = meeting.name;
        this.location = meeting.location;
        this.id_owner = meeting.id_owner;
        this.description = meeting.description;
        this.time_pre = meeting.time_pre;
        this.time_start = meeting.time_start;
        this.time_end = meeting.time_end;
        this.time_post = meeting.time_post;
    }

    save(next) {
        this.validate((error) => {
            if (error)
                return next(error);

            db.getConnection((error, connection) => {
                if (error)
                    return next(error);

                connection.query('INSERT INTO meetings SET ?', this, (error) => {
                    if (error)
                        return next(error);

                    connection.query('INSERT INTO m2m_meetings_users SET id_user = ?, \
                    id_meeting = ?, id_owner = ?', [
                        this.id_owner,
                        this._id, this.id_owner
                    ], (error) => {
                        if (error)
                            return next(error);

                            connection.release();
                            next(null);
                    });
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

                connection.query('UPDATE meetings SET name = ?, location = ?, \
                    description = ?, time_pre = ?, time_start = ?, time_end = ?, \
                    time_post = ? WHERE _id = ?', [
                    this.name,
                    this.location,
                    this.description,
                    this.time_pre,
                    this.time_start,
                    this.time_end,
                    this.time_post,
                    this._id
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

            connection.query('DELETE FROM meetings WHERE _id = ?', this._id, (error) => {
                if (error)
                    return next(error);

                connection.release();
                next(null);
            });
        });
    }

    static findByIdAndOwner(id, id_owner, fields, next) {
        db.getConnection((error, connection) => {
            if (error)
                return next(error);

            if (fields.length === 0)
                fields = default_fields;

            connection.query('SELECT ?? FROM meetings WHERE _id = ? AND id_owner = ?', [
                fields,
                id,
                id_owner
            ], (error, result) => {
                if (error)
                    return next(error);

                if (result.length === 0)
                    return next(null, false);

                connection.release();
                next(null, new Meeting(result[0]));
            });
        });
    }

    static findAllByUser(user, fields, next) {
        db.getConnection((error, connection) => {
            if (error)
                return next(error);

            if (fields.length === 0)
                fields = default_fields;

            fields.forEach((element, index) => {
                fields[index] = 'meetings.' + element;
            });

            connection.query('SELECT ?? FROM meetings JOIN m2m_meetings_users as \
            m2m ON m2m.id_user = ? AND meetings._id = m2m.id_meeting', [
                fields,
                user
            ], (error, result) => {
                console.log(error);
                if (error)
                    return next(error);

                connection.release();
                let meetings = [];
                result.forEach((element) => {
                    meetings.push(new Meeting(element));
                });
                next(null, meetings);
            });
        });
    }

    validate(next) {
        next(false);
    }
}

module.exports = Meeting;
