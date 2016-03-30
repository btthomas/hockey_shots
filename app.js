'use strict';

require('dotenv').config();

const express = require('express');
const app = express();
const expressMongoDb = require('express-mongo-db');

const port = process.env.PORT || process.argv[2] || 3000;

app.set('views', __dirname + '/views');
app.set('view engine', "jade");
app.engine('jade', require('jade').__express);

app.use(expressMongoDb(process.env.MONGOLAB_URI));

app.use(express.static(__dirname + '/public'));
app.use(require('./routes'));

app.listen(port, function() {
  console.log("Listening on port " + port);     
}); 
