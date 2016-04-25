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
exports.getConnection = (next) => {
    pool.getConnection((error, connection) => {
        if (error)
            return next(error);

        next(null, connection);
    });
};
