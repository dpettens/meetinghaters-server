"use strict";
const db = require('../libs/db');
const bcrypt = require('bcrypt-nodejs');
const Schema = require('validate');
const identicon = require('identicon');

// Schema for validate a user object
let validator = Schema({
  mail: {
    type: 'string',
    required: true,
    match: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,
    message: 'The Mail must be valid.'
  },
  password: {
    type: 'string',
    required: true,
    match: /^.{4,20}$/,
    message: 'The Password must be valid. Between 4 and 20 characters.'
  },
  firstname: {
    type: 'string',
    required: true,
    match: /^.{2,}$/,
    message: 'The firstname must be valid. At least 2 characters'
  },
  surname: {
    type: 'string',
    required: true,
    match: /^.{2,}$/,
    message: 'The lastname must be valid. At least 2 characters'
  },
  photo: {
    type: 'string',
    required: false,
    message: 'The photo must be a string.'
  },
  location: {
    type: 'string',
    required: false,
    message: 'The location must be a string.'
  },
  last_connection: {
    type: 'data',
    required: false,
    message: 'The last connection must be a date.'
  }
});

class User {
    constructor(user) {
        this.mail = user.mail;
        this.password = user.password;
        this.firstname = user.firstname;
        this.surname = user.surname;
        this.photo = user.photo;
        this.location = user.location;
        this.last_connection = user.last_connection;
    }

    save(next) {
        this.validate((error) => {
            if (error)
                return next(error);

            db.getConnection((error, connection) => {
                if (error)
                    return next(error);

                this.password = this.hashPassword(this.password);

                // if photo exists convert to binary otherwise generate identicon based on mail
                if(this.photo != undefined || this.photo != null) {
                    this.photo = new Buffer(this.photo, 'base64');
                } else {
                    this.photo = identicon.generateSync({
                        id: this.mail,
                        size: 50
                    });
                }

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

        this.validate((error) => {
            if(error)
                return next(error);

                this.password = this.hashPassword(this.password);
                this.photo = new Buffer(this.photo, 'base64');

                db.getConnection((error, connection) => {
                    if (error)
                        return next(error);

                    connection.query('UPDATE users SET password = ?, firstname = ?, \
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
                fields = [
                    'mail',
                    'password',
                    'firstname',
                    'surname',
                    'photo',
                    'location',
                    'last_connection'
                ];

            connection.query('SELECT ?? FROM users WHERE mail = ?', [
                fields,
                id
            ], (error, result) => {
                if (error)
                    return next(error);

                if (result.length === 0)
                    return next(null, false);

                if(result[0].photo !== undefined)
                    result[0].photo = new Buffer(result[0].photo, 'binary').toString('base64');

                connection.release();
                next(null, new User(result[0]));
            });
        });
    }

    validate(next) {
        let errors = validator.validate(this);
        if(errors.length === 0)
            return next(false);

        // fix an bug in the package validate with the property message
        let error = new Error('ValidationError');
        error.validationErrors = [];
        errors.forEach((element) => {
            error.validationErrors.push({message: element.message, path: element.path});
        });

        next(error);
    }

    hashPassword(password) {
        return bcrypt.hashSync(password, bcrypt.genSaltSync(8));
    }

    validPassword(password) {
        return bcrypt.compareSync(password, this.password);
    }
}

module.exports = User;
