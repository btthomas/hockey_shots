'use strict'
var exports = module.exports = {};

const fs = require('fs');
const _  = require('lodash');
const d3 = require('d3');
const await = require('await');
const scraper = require('./scrape.js');

exports.getOneGame = function(game, cb) {
  
  //first check if game has already been crunched
  fs.readFile('games/crunched/20152016_' + game + '.json', function(err, dataString) {
    if(err) {
      //crunch it 
      crunchOne(game, cb);
    } else {
      //already exists
      cb(null, JSON.parse(dataString));
    }
  });
}

function crunchOne(game, cb) {
 
  const fn = 'games/20152016_' + game + '.json';
  fs.readFile(fn, function(err, filedat) {
    if(err) {
      //need to scrape it
      scraper.scrapeOneGame(game, function(err) {
        if(err) {
          return cb(err);
        } else {
          crunchOne(game, cb);
        }
      });
    } else {
      const stats = crunch(JSON.parse(filedat));
      writeData(stats, 'games/crunched/20152016_' + game + '.json');
      cb(null, stats);
    }
  });
}

function crunch(data) {
  const allShots = _.filter(data, function(d) {
    return (d.type === 'SHOT') || (d.type === 'MISS') || (d.type === 'BLOCK');
  });
  const unblockedShots = _.filter(data, function(d) {
    return (d.type === 'SHOT') || (d.type === 'MISS');
  });
  const onGoalShots = _.filter(data, function(d) {
    return (d.type === 'SHOT');
  });
  
  //console.log('events:', data.length, ', shot attempts:', allShots.length, ', unblocked shots:', unblockedShots.length, ', shots on goal:', onGoalShots.length);

  const playerTable = {};
  
  calcPlusMinusStat(allShots, playerTable, 'corsi');
  calcPlusMinusStat(unblockedShots, playerTable, 'fenwick');
  calcPlusMinusStat(onGoalShots, playerTable, 'shots');
    
  return playerTable;
}

exports.crunch = crunch;

exports.crunchAll = function() {
  loadAll(function(err, data) {
      
    const allData = concatTheData(data);
    
    doShots(allData);
    //writeData(allData, 'test');
  });
}

function loadAll(cb) {
    
  const proms = [];
    
  _.forEach(games, function(game) {
    const prom = await('data');
    proms.push(prom);
    
    fs.readFile('games/' + game + '.json', function(err, filedat) {
      if(err) prom.fail(err);
      else {
        prom.keep('data', JSON.parse(filedat));
      }
    });
  });
  
  await.all(proms)
    .onkeep(function(data) {
      cb(null, data);
    }).onfail(function(err) {
      cb(err);
    });
}

function concatTheData(data) {
  const out = []
  _.forEach(data, function(d) {
    out.push(d.data);
  });
  return _.flatten(out);
}

function doShots(data) {
  
  const allShots = _.filter(data, function(d) {
    return (d.type === 'SHOT') || (d.type === 'MISS') || (d.type === 'BLOCK');
  });
  const unblockedShots = _.filter(data, function(d) {
    return (d.type === 'SHOT') || (d.type === 'MISS');
  });
  const onGoalShots = _.filter(data, function(d) {
    return (d.type === 'SHOT');
  });
  
  console.log('events:', data.length, ', shot attempts:', allShots.length,
    ', unblocked shots:', unblockedShots.length, ', shots on goal:', onGoalShots.length);

  const statsTable = {};
  
  calcPlusMinusStat(allShots, statsTable, 'corsi');
  calcPlusMinusStat(unblockedShots, statsTable, 'fenwick');
  calcPlusMinusStat(onGoalShots, statsTable, 'shots');
    
  //do something with playerTable or allShots
}

function calcPlusMinusStat(shots, table, stat) {
  
  _.forEach(shots, function(event) {
    if(event.situation !== 'EV') return;
    const shootingTeam = event.description.slice(0,3);
    
    _.forEach(event.away.concat(event.home), function(player) {
      if(player.team === shootingTeam) {
        increment(table, player, stat);
      } else {
        decrement(table, player, stat);
      }
    });
    
  })
}

function increment(table, player, stat) {
  
  const id = player.team + player.number;
  
  if(_.has(table, id)) {
    
    if(_.has(table[id], stat)) {
      table[id][stat] += 1;
    } else {
      table[id][stat] = 1;
    }
    
    if(_.has(table[id], stat + '_for')) {
      table[id][stat + '_for'] += 1;
    } else {
      table[id][stat + '_for'] = 1;
    }

    if(_.has(table[id], stat + '_total')) {
      table[id][stat + '_total'] += 1;
    } else {
      table[id][stat + '_total'] = 1;
    } 
    
  } else {
    table[id] = {
      [stat]: 1,
      [stat + '_for']: 1,
      [stat + '_against']: 0,
      [stat + '_total']: 1
    };
  }
}

function decrement(table, player, stat) {
  
  const id = player.team + player.number;
  
  if(_.has(table, id)) {
    
    if(_.has(table[id], stat)) {
      table[id][stat] -= 1;
    } else {
      table[id][stat] = -1;
    }
    
    if(_.has(table[id], stat + '_against')) {
      table[id][stat + '_against'] += 1;
    } else {
      table[id][stat + '_against'] = 1;
    }

    if(_.has(table[id], stat + '_total')) {
      table[id][stat + '_total'] += 1;
    } else {
      table[id][stat + '_total'] = 1;
    } 

  } else {
    table[id] = {
      [stat]: -1,
      [stat + '_for']: 0,
      [stat + '_against']: 1,
      [stat + '_total']: 1
    };
  }
}

function writeData(data, fn) {
  
  const string = JSON.stringify(data, null, 2);
  fs.writeFile(fn, string, function(err) {
    if(err) console.error(err);
  });
}  
