'use strict'
var exports = module.exports = {};

const express = require('express');
const router = express.Router();
const await = require('await');
const _  = require('lodash');
const scraper = require('../lib/scrape.js');
const rawGames = require('../models/rawGames.js');

router.get('/games/:game_id', function(req, res) {

  const game_id = sanitize(req.params.game_id);
  
  //check if the game has been scraped
  rawGames.getOne(req.db, {game: game_id}, function(err, result) {
    if(result.length === 0) {
      scraper.scrapeOneGame(game_id, function(err, result) {
        if(err) {
          res.status('500').end();
        } else {
          res.json(result);
          rawGames.add(req.db, result, function(err){
            if(err) {
              console.error('cant insert', game_id, err);
            }
          });
        }
      });
    } else {
      res.json(result);
    }
  });
  
  // cruncher.getOneGame(game_id, function(err, result) {
    // if(err) {
      // console.error(err);
      // res.json({error: 'game id does not exist on nhl.com'});
    // } else {
      // res.json(result);
    // }
  // });
});

function sanitize(id) {
  //not yet implemented
  console.log(id);
  return id;
}

function tellUserToWait(res, id) {
  
  res.json({tryAgain: id});
}

module.exports = router;