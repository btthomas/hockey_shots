var s = require('./lib/scrape.js');

var game = '20930';

s.scrapeOneGame(game, function(err) {
  if(err) console.error('bad scrape: ' + game, err);
});