const mysql  = require('mysql');
const config = require('../config');

/*
 * Create pool for the connection at database
 */
var pool  = mysql.createPool({
  connectionLimit : 10,
  host            : config.database.host,
  user            : config.database.user,
  password        : config.database.password,
  database        : config.database.database
});

/*
 * Get a connection to the database
 */
function getConnection(next) {
    pool.getConnection(function(error, connection) {
        if (error)
            return next(error);

        next(null, connection);
    });
};

module.exports = getConnection;
