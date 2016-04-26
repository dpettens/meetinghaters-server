"use strict";
const db = require('../libs/db');

let default_fields = ['_id', 'name', 'location', 'owner', 'description', 'time_pre', 'time_start', 'time_end', 'time_post'];

class Meeting {
    constructor(meeting) {
        this._id = meeting._id;
        this.name = meeting.name;
        this.location = meeting.location;
        this.owner = meeting.owner;
        this.description = meeting.description;
        this.time_pre = meeting.time_pre;
        this.time_start = meeting.time_start;
        this.time_end = meeting.time_end;
        this.time_post = meeting.time_post;
    }

    static findById(id, fields, next) {
        db.getConnection((error, connection) => {
            if (error)
                return next(error);

            if (fields.length === 0)
                fields = default_fields;

            connection.query('SELECT ?? FROM meetings WHERE _id = ?', [fields, id], (error, result) => {
                if (error)
                    return next(error);

                if (result.length === 0)
                    return next(null, false);

                connection.release();
                next(null, new Meeting(result[0]));
            });
        });
    }

    static findByIdAndOwner(id, owner, fields, next) {
        db.getConnection((error, connection) => {
            if (error)
                return next(error);

            if (fields.length === 0)
                fields = default_fields;

            connection.query('SELECT ?? FROM meetings WHERE _id = ? AND owner = ?', [fields, id, owner], (error, result) => {
                if (error)
                    return next(error);

                if (result.length === 0)
                    return next(null, false);

                connection.release();
                next(null, new Meeting(result[0]));
            });
        });
    }

    static findAllById(id, fields, next) {
        db.getConnection((error, connection) => {
            if (error)
                return next(error);

            if (fields.length === 0)
                fields = default_fields;

            connection.query('SELECT ?? FROM meetings WHERE mail = ?', [fields, id], (error, result) => {
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
}

module.exports = Meeting;
