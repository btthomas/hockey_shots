'use strict'

const expect = require('chai').expect;
const Game   = require('../../models/game.js');

const testGame = {
  id: 2,
  home: 'WSH',
  away: 'PIT',
  date: '2016-02-02'
};

Game.insertGame(testGame, function(err, dat) {
  console.log(err);
  console.log(dat);
});