(function(){
  'use strict'
  var exports = {}
  const COLLECTION = 'games';

  exports.add = function(db, game, cb) {   
    db.collection(COLLECTION).insert(game, function(err, res) {
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

  module.exports = exports;

})();