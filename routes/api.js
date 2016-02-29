'use strict'
var exports = module.exports = {};

const express = require('express');
const router = express.Router();
const await = require('await');
const fs = require('fs');
const _  = require('lodash');
const d3 = require('d3');
const cruncher = require('../lib/crunchGame.js');

router.use(logRequest);

function logRequest(req, res, next) {
	console.error('ip: %s, time: %s', req.ip, new Date().toTimeString().substr(0,9));
  next();
}

router.get('/games/:game_id', function(req, res) {

  const game_id = sanitize(req.params.game_id);
  cruncher.getOneGame(game_id, function(err, result) {
    if(err) {
      console.error(err);
      res.json({error: 'error'});
    } else {
      res.json(result);
    }
  });
});

function sanitize(id) {
  //not yet implemented
  return id;
}

module.exports = router;