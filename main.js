var s = require('./lib/scrape.js');
var c = require('./lib/crunchGame.js');

var game = '020930';

s.scrapeOneGame(game, function(err) {
  if(err) console.error('bad scrape: ' + game, err);
});

c.getOneGame(game, function(err, data) {
  if(err) {console.error('couldnt getOneGame: ' + game, err);}
  else {
    console.log(data);
  }
});