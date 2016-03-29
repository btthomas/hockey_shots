'use strict';

require('dotenv').config();

const express = require('express');
const app = express();
const await = require('await');
const fs = require('fs');
const pg = require('pg');
const db = require('./lib/db.js');

const port = process.env.PORT || process.argv[2] || 80;

app.set('views', __dirname + '/views');
app.set('view engine', "jade");
app.engine('jade', require('jade').__express);

app.use(function(req, res, next) {
  req.db = db;
  next();
});

app.use(express.static(__dirname + '/public'));
app.use(require('./routes'));

app.listen(port, function() {
  console.log("Listening on port " + port);     
}); 
