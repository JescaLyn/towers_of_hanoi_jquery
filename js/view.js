function View (game, $el) {
  this.game = game;
  this.rootEl = $el;
  this.setupTowers($el);
  this.render(game);
  this.bindHandlers();
}

View.prototype.endGame = function() {
  $("li").addClass("end-game");
  $(".stack").off("click");
  $(".stack").addClass("game-over");
  const $winClause = $("<h2>You win!</h2>");
  this.rootEl.append($winClause);
  this.render();
};

View.prototype.bindHandlers = function () {
  $(".stack").on("click", event => {
    this.clickTower($(event.currentTarget));
  });
};

View.prototype.clickTower = function($tower) {
  if (this.tower === undefined) {
    this.tower = $tower.data("stack-id");
    $tower.addClass("clicked");
  }
  else {
    if (this.game.move(this.tower, $tower.data("stack-id"))) {
      this.render();
    }
    else {
      alert("Invalid move!");
    }
    $(".stack").removeClass("clicked");
    this.tower = undefined;
  }

  if (this.game.isWon()) {
    this.endGame();
  }
};

View.prototype.setupTowers = function(rootEl) {
  for (var i = 0; i < 3; i++) {
    const $ul = $("<ul></ul>");
    $ul.addClass("stack");
    $ul.data("stack-id", i);
    for (var j = 0; j < 3; j++) {
      const $li = $("<li></li>");
      $ul.append($li);
    }
    rootEl.append($ul);
  }
};

View.prototype.render = function () {
  $("li").each(function(index) {
    let $this = $(this);
    $this.removeClass('disc-1');
    $this.removeClass('disc-2');
    $this.removeClass('disc-3');
  });
  this.game.towers.forEach((tower, idx) => {
    let $stack = $(`.stack:nth-child(${idx+1})`);
    tower.forEach((discSize, jdx) => {
      let $disc = $stack.children(`:nth-child(${3 - jdx})`);
      $disc.addClass(`disc-${discSize}`);
      $disc.css("bottom", `${10 + (60 * jdx)}px`);
    });
  });
};


module.exports = View;
