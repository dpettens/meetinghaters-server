var db = require('../libs/db');

module.exports = {
    findById: (id, next) => {
        db.getConnection((error, connection) => {
            if (error)
                return next(error);

            connection.query('SELECT * FROM users WHERE mail = ?', [id], function(error, result) {
                if (error)
                    return next(error);

                if(result.length === 0)
                    return next(null, false);

                connection.release();
                next(null, result[0]);
            });
        });
    }
}
