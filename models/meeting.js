"use strict";
var db = require('../libs/db');

class Meeting {
    constructor(meeting) {
        this._id = meeting._id;
        this.name = meeting.name;
        this.location = meeting.location;
        this.time_pre = meeting.time_pre;
        this.time_start = meeting.time_start;
        this.time_post = meeting.time_post;
        this.description = meeting.description;
    }
}

module.exports = Meeting;
