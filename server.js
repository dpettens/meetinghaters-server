const express    = require('express');
const app        = express();
const bodyParser = require('body-parser');
const routes     = require('./app/config/routes');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;

app.use('/api', routes);

app.listen(port);
console.log('Server listening on port ' + port);
