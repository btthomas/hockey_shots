(function(){
  'use strict'
  var exports = {}
  const COLLECTION = 'gameStats';
  const generateQueryID = require('./generateQueryID.js');
  const opt = {upsert: true};

  exports.add = function(db, game, cb) {   
    db.collection(COLLECTION).update(generateQueryID(game), game, opt, function(err, res) {
      if(err) return cb(err) 
      else return cb(null, res);
    });
  }
  
  exports.count = function(db, query, cb) {
    db.collection(COLLECTION).count(query, function(err, num) {
      if(err) return cb(err) 
      else return cb(null, num);
    });      
  }
  
  exports.get = function(db, query, cb) {
    db.collection(COLLECTION).find(query).toArray(function(err, res) {
      if(err) return cb(err) 
      else return cb(null, res);
    });    
  }

  exports.getOne = function(db, query, cb) {
    db.collection(COLLECTION).findOne(query, function(err, res) {
      if(err) return cb(err) 
      else return cb(null, res);
    });    
  }

  module.exports = exports;

})();