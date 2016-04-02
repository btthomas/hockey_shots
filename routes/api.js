'use strict'
var exports = module.exports = {};

const express = require('express');
const router = express.Router();
const await = require('await');
const _  = require('lodash');
const scraper = require('../lib/scrape.js');
const cruncher = require('../lib/crunchGame.js');
const rawGames = require('../models/rawGames.js');
const stats = require('../models/gameStats.js');

const season = '20152016';

router.get('/rawGames/:game_id', function(req, res) {

  const game_id = sanitize(req.params.game_id);
  
  //check if the game has been scraped
  rawGames.getOne(req.db, {game: game_id, season: season}, function(err, result) {
    if(err) return sendError(res);
    
    if( _.isNull(result) ) {
      scraper.scrapeOneGame(game_id, function(err, result) {
        if(err) {
          return sendError(res);
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
});

router.get('/stats/:game_id', function(req, res) {
  
  const game_id = sanitize(req.params.game_id);
  var thisResult;
  
  //check if game has been scraped
  rawGames.getOne(req.db, {game: game_id, season: season}, function(err, result) {
    
    console.log('getting...', game_id);

    if(err) return sendError(res);
    thisResult = result;
    
    // console.log('thisResults', _.isNull(thisResult), thisResult);

    if( _.isNull(result) ) {
      scraper.scrapeOneGame(game_id, function(err, scraped) {
        if(err) {
          return sendError(res);
        } else {
          // console.log('scraped', _.keys(scraped));
          thisResult = scraped;
          rawGames.add(req.db, scraped, function(err){
            if(err) {
              console.error('cant insert', game_id, err);
            }
          });
          
          //now crunch it!
          const crunched = cruncher.crunch(thisResult.data);
          res.json(crunched);
        }
      });
    } else {
      //now crunch it!
      const crunched = cruncher.crunch(thisResult.data);
      res.json(crunched);      
    }
  });
});
    
  
  // cruncher.getOneGame(game_id, function(err, result) {
    // if(err) {
      // console.error(err);
      // res.json({error: 'game id does not exist on nhl.com'});
    // } else {
      // res.json(result);
    // }
  // });

function sanitize(id) {
  //not yet implemented
  return id;
}

function sendError(res) {
  res.status('500').end();
}

function tellUserToWait(res, id) {
  
  res.json({tryAgain: id});
}

module.exports = router;