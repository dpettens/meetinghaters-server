"use strict";
var db = require('../libs/db');

class User {
    constructor(user) {
        this.mail = user.mail;
        this.password = user.password;
        this.firstname = user.firstname;
        this.surname = user.surname;
        this.location = user.location;
        this.last_connection = user.last_connection;
    }

    save(next) {
        this.validate((error, next) => {
            if (error)
                return next(error);

            db.getConnection((error, connection) => {
                if (error)
                    return next(error);

                connection.query('INSERT INTO users SET ?', this, (error) => {
                    if (error)
                        return next(error);

                    connection.release();
                    next(null);
                });
            });
        });
    }

    update(data, next) {
        // update the user object with the new value
        Object.keys(data).forEach((key) => {
            this[key] = data[key];
        });

        db.getConnection((error, connection) => {
            if (error)
                return next(error);

            connection.query('UPDATE users SET password = ?,firstname = ?, \
            surname = ?, location = ?, last_connection = ? WHERE mail = ?', [
                this.password,
                this.firstname,
                this.surname,
                this.location,
                this.last_connection,
                this.mail
            ], (error) => {
                if (error)
                    return next(error);

                connection.release();
                next(null);
            });
        });
    }

    delete(next) {
        db.getConnection((error, connection) => {
            if (error)
                return next(error);

            connection.query('DELETE FROM users WHERE mail = ?', this.mail, (error) => {
                if (error)
                    return next(error);

                connection.release();
                next(null);
            });
        });
    }

    static findById(id, fields, next) {
        db.getConnection((error, connection) => {
            if (error)
                return next(error);

            if (fields.length === 0)
                fields = ['mail', 'password', 'firstname', 'surname', 'location', 'last_connection'];

            connection.query('SELECT ?? FROM users WHERE mail = ?', [fields, id], (error, result) => {
                if (error)
                    return next(error);

                if (result.length === 0)
                    return next(null, false);

                connection.release();
                next(null, new User(result[0]));
            });
        });
    }

    //check if the user exists already and all information are correct
    validate(next) {
        next(false);
    }
}

module.exports = User;
