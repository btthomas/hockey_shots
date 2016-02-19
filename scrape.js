'use strict'

const fs = require('fs');
const _ = require('lodash');
const request = require('request');
const cheerio = require('cheerio');
let $;

const siteUrl1 = 'http://www.nhl.com/scores/htmlreports/';
const siteUrl2 = '/PL';
const siteUrl3 = '.HTM';
const season = '20152016';
const game = '020749';

const url = siteUrl1 + season + siteUrl2 + game + siteUrl3;
const gameData = [];

console.log(url);

let home, away;

request(url, function(error, response, html) {
  if(error) {
    console.error('bad request', error);
  } else {
    console.log('success');
    
    $ = cheerio.load(html);
    const data = $('tr.evenColor') 
    const headers = $(data).prev();
    home = getHome(headers);
    away = getAway(headers);
    
    data.each(parseRow);
    
    writeData();
  }
})

function getHome(headers) {
  return $($(headers).children()[7]).text().slice(0,3);
}
function getAway(headers) {
  return $($(headers).children()[6]).text().slice(0,3);
}

function parseRow(ind, elem) {
  //  if(ind > 0) return;
    
  const cells = $(this).children('td');
 
  const dat = {};
  dat.period = $(cells[1]).text();
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

function writeData() {
  
  const fn = 'games/' + season + '_' + game + '.json';
  const data = JSON.stringify(gameData, null, 2);
  fs.writeFile(fn, data, function(err) {
    if(err) console.error(err);
  });
}  
