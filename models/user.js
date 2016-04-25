var db = require('../libs/db');

module.exports = {
    findById: (id, next) => {
        db.getConnection((error, connection) => {
            if (error)
                return next(error);

            connection.query('SELECT * FROM users WHERE mail = ?', [id], function(error, result) {
                if (error)
                    return next(error);

                connection.release();
                next(null, result);
            });
        });
    }
}
