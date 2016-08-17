/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	const HanoiGame = __webpack_require__(1);
	const HanoiView = __webpack_require__(2);

	$( () => {
	  const rootEl = $('.hanoi');
	  const game = new HanoiGame();
	  new HanoiView(game, rootEl);

	});


/***/ },
/* 1 */
/***/ function(module, exports) {

	class Game {
	  constructor() {
	    this.towers = [[3, 2, 1], [], []];
	  }

	  isValidMove(startTowerIdx, endTowerIdx) {
	      const startTower = this.towers[startTowerIdx];
	      const endTower = this.towers[endTowerIdx];

	      if (startTower.length === 0) {
	        return false;
	      } else if (endTower.length == 0) {
	        return true;
	      } else {
	        const topStartDisc = startTower[startTower.length - 1];
	        const topEndDisc = endTower[endTower.length - 1];
	        return topStartDisc < topEndDisc;
	      }
	  }

	  isWon() {
	      // move all the discs to the last or second tower
	      return (this.towers[2].length == 3) || (this.towers[1].length == 3);
	  }

	  move(startTowerIdx, endTowerIdx) {
	      if (this.isValidMove(startTowerIdx, endTowerIdx)) {
	        this.towers[endTowerIdx].push(this.towers[startTowerIdx].pop());
	        return true;
	      } else {
	        return false;
	      }
	  }

	  print() {
	      console.log(JSON.stringify(this.towers));
	  }

	  promptMove(reader, callback) {
	      this.print();
	      reader.question("Enter a starting tower: ", start => {
	        const startTowerIdx = parseInt(start);
	        reader.question("Enter an ending tower: ", end => {
	          const endTowerIdx = parseInt(end);
	          callback(startTowerIdx, endTowerIdx)
	        });
	      });
	  }

	  run(reader, gameCompletionCallback) {
	      this.promptMove(reader, (startTowerIdx, endTowerIdx) => {
	        if (!this.move(startTowerIdx, endTowerIdx)) {
	          console.log("Invalid move!");
	        }

	        if (!this.isWon()) {
	          // Continue to play!
	          this.run(reader, gameCompletionCallback);
	        } else {
	          this.print();
	          console.log("You win!");
	          gameCompletionCallback();
	        }
	      });
	  }
	}

	module.exports = Game;


/***/ },
/* 2 */
/***/ function(module, exports) {

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


/***/ }
/******/ ]);