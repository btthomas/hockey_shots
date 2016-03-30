'use strict'
var exports = module.exports = {};
const pg = require('pg');
const dbUrl = process.env.DATABASE_URL

exports.insertGame = function(game, cb) {
  
  //valid game?
  buildQueryFromGame(game, function(err, query) {
    if(err) {
      return cb(err);
    } else {
      pg.connect(dbUrl, function(err, client, done) {
        if(err) {
          done();
          return cb(err);
        } else {
          client.query(query, function(err, result) {
            done();
            if (err) { 
              return cb(err);
            } else { 
              cb(result);
            }
          });
        }
      });
    }
  });
}

function buildQueryFromGame(game, cb) {
  
  const testQuery = {
      text: "INSERT INTO games values ($1, $2, $3, $4)",
      values: [game.id, game.home, game.away, game.date]
  }
  
  cb(null, testQuery);
}