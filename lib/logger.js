(function(){
  'use strict'

  module.exports = function(req, res, next) {
    console.error('route: /, ip: %s, time: %s', req.ip, new Date().toTimeString().substr(0,9));
    next();
  }
})();