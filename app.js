'use strict';

const express = require('express');
const app = express();
const await = require('await');
const fs = require('fs');

const port = process.env.PORT || process.argv[2] || 80;

app.set('views', __dirname + '/views');
app.set('view engine', "jade");
app.engine('jade', require('jade').__express);

app.use(express.static(__dirname + '/public'));
app.use(require('./routes'));

app.listen(port, function() {
  console.log("Listening on port " + port);     
}); 
