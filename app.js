'use strict';

const express = require('express');
const app = express();
const await = require('await');
const fs = require('fs');
const pg = require('pg');
const db = require('lib/db.js');

const port = process.env.PORT || process.argv[2] || 80;

app.set('views', __dirname + '/views');
app.set('view engine', "jade");
app.engine('jade', require('jade').__express);

app.use(express.static(__dirname + '/public'));
app.use(require('./routes'));

app.listen(port, function() {
  console.log("Listening on port " + port);     
}); 

app.get('/db', function (req, res) {
  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    if(err) {
      console.error(err);
      res.send('Error: ' + err);
    } else {
      client.query('SELECT * FROM test_table', function(err, result) {
        done();
        if (err)
         { console.error(err); res.send("Error " + err); }
        else
         { res.render('pages/db', {results: result.rows} ); }
      });
    }
  });
})

db.query('create table test_table (id integer, name text)', function(err, res) {
  if(err) console.error('error', err);
  else console.log(res);
});