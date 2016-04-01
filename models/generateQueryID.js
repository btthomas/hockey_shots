;(function() {
'use strict'

module.exports = function generateQueryID(game) {
  return {
    season: game.season,
    game: game.game
  };
}

})();