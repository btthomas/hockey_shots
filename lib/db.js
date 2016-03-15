const pg = require('pg');

'use strict';
(function(){
  
  const connectionString = process.env.DATABASE_URL;

  module.exports = {
     query: function(text, values, cb) {
        pg.connect(connectionString, function(err, client, done) {
          client.query(text, values, function(err, result) {
            done();
            cb(err, result);
          })
        });
     }
  }
})();