const HanoiGame = require("./game.js");
const HanoiView = require("./view.js");

$( () => {
  const rootEl = $('.hanoi');
  const game = new HanoiGame();
  new HanoiView(game, rootEl);

});
