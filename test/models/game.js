'use strict'

const expect = require('chai').expect;
const Game   = require('../../models/game.js');

const dummyData = [
  {
    id: 1,
    home: 'WSH',
    away: 'PIT',
    date: '2016-02-02'
  },
  {
    id: 2,
    home: 'NYR',
    away: 'TBL',
    date: '2016-02-03'
  }
];

const gameToAdd = {
  id: 3,
  home: 'NYI',
  away: 'BUF',
  date: '2016-02-04'
};

const query1 = {date: '2016-02-03'};
const query2 = {home: 'WSH'};

describe('Game', function() {
  
  before(function(done) {
    //connect to DB
    done();
  });
  
  beforeEach(function(done) {
    //drop table GAMES
    //then insert dummyData
    done();
  });
  
  after(function(done) {
    //disconnect from the DB
    done();
  });
  
  describe('#insertGame', function() {
    
    it('should insert the game', function(done) {
      Game.insertGame(gameToAdd, function(err, dat) {
        expect(err).to.be(null);
        done();
      });
    });
  });
});

