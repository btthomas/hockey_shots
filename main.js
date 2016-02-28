var s = require('./scrape.js');

var game = '020799';

s.scrapeOneGame('020799', function(err) {
  if(err) console.error('bad scrape: ' + game, err);
});