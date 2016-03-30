'use strict'
var exports = module.exports = {};

const express = require('express');
const router = express.Router();
const await = require('await');
const _  = require('lodash');
const cruncher = require('../lib/crunchGame.js');

router.get('/games/:game_id', function(req, res) {

  const game_id = sanitize(req.params.game_id);
  cruncher.getOneGame(game_id, function(err, result) {
    if(err) {
      console.error(err);
      res.json({error: 'game id does not exist on nhl.com'});
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