'use strict'
var exports = module.exports = {};

const fs = require('fs');
const _ = require('lodash');
const request = require('request');
const cheerio = require('cheerio');
const game    = require('../models/game');
let $;

let gameData;
let home
let away;

const badGames = [];

const siteUrl1 = 'http://www.nhl.com/scores/htmlreports/';
const siteUrl2 = '/PL';
const siteUrl3 = '.HTM';

exports.scrapeOneGame = function(game, cb) {

  if(_.any(badGames, game)) {
    return cb('game does not exist on nhl.com: ' + game);
  }
  
  const season = '20152016';
  const url = siteUrl1 + season + siteUrl2 + game + siteUrl3;

  gameData = [];

  console.log(url);

  request(url, function(error, response, html) {
    if(error) {
      console.error('bad request', error);
      return cb(error);
    } else {
      if(response.statusCode === 404) {
        //doesn't exist
        addToBadURLs(game);
        return cb('404');
      } else {
        
        //reset game data
        gameData = [];
        
        $ = cheerio.load(html);
        const data = $('tr.evenColor') 
        const headers = $(data).prev();
        home = getHome(headers);
        away = getAway(headers);
        
        data.each(parseRow);
        
        writeData(gameData, {game, season}, cb);
      }
    }
  })
}

function addToBadURLs(game) {
  if(_.any(badGames, game)) {
    return;
  } else {
    badGames.push(game);
  }
}

function getHome(headers) {
  return $($(headers).children()[7]).text().slice(0,3);
}
function getAway(headers) {
  return $($(headers).children()[6]).text().slice(0,3);
}

function parseRow(ind, elem) {
  const cells = $(this).children('td');
  
  const dat = {};
  dat.period = $(cells[1]).text();
  const elapsedString = $(cells[3]).text();
  dat.elapsed = elapsedString.slice(0, elapsedString.indexOf(':')+3);
  dat.situation =  $(cells[2]).text();
  dat.type = $(cells[4]).text();
  dat.description = $(cells[5]).text()
  dat.away = onIce($(cells[6]), 'away');
  dat.home = onIce($(cells[7]), 'home');
  
  gameData.push(dat);
}

function onIce(table, team) {
  const out = [];
  const players = table.children().children().children().children();
  
  players.each(function(i, d) {
    out.push({
      number: getNumber(d),
      name: getName(d),
      team: team === 'home' ? home : away
    }); 
  });
    
  return out;
}

function getNumber(d) {
  return $(d).children().children().children().text();
}

function getName(d) {
  return $(d).children().children().children().attr('title');    
}

function writeData(gameData, info, cb) {
  
  const fn = 'games/' + info.season + '_' + info.game + '.json';
  const data = JSON.stringify(gameData, null, 2);
  fs.writeFile(fn, data, function(err) {
    if(err) return cb(err);
    else return cb(null);
  });
}  
