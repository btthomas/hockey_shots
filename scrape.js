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

request(url, function(error, response, html) {
  if(error) {
    console.error('bad request', error);
  } else {
    console.log('success');
    
    $ = cheerio.load(html);
    var data = $('tr.evenColor') 
    data.each(parseRow);
    
    writeData();
  }
})

function parseRow(ind, elem) {
    
  const cells = $(this).children('td');
 
  const dat = {};
  dat.period = $(cells[1]).text();
  dat.type = $(cells[4]).text();
  dat.description = $(cells[5]).text()
  dat.away = onIce($(cells[6]));
  dat.home = onIce($(cells[7]));
  
  gameData.push(dat);
}

function onIce(table) {
  const out = [];
  const players = table.children().children().children().children();
  
  players.each(function(i, d) {
    out.push(getNumber(d)); 
  });
    
  return out;
}

function getNumber(d) {
  return $(d).children().children().children().text();
}

function writeData() {
  console.log(gameData.length);
  
  const fn = 'game.json';
  const data = JSON.stringify(gameData, null, 2);
  fs.writeFile(fn, data, function(err) {
    if(err) console.error(err);
  });
}  
