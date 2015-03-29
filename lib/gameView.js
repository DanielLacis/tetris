(function () {
  if (typeof Tetris === 'undefined') {
    Tetris = {};
  }
  var GameView = Tetris.GameView = function (game, ctx) {
    this.game = game;
    this.ctx = ctx;
    this.bindEvents();
  };

  GameView.KEYS = {
    //left
    37: "left",
    //right
    39: "right",
    //spacebar
    32: "space"
    //down
    // 40:
  };

  GameView.prototype.start = function() {
    this.beginInterval();
  };

  GameView.prototype.beginInterval = function() {
    this.interval = setInterval(
      function () {
        this.game.step();
        this.game.board.draw(this.ctx, this.game.piece);
      }.bind(this), Tetris.Game.INTERVAL
    );
  };

  GameView.prototype.bindEvents = function() {
    $(window).on('keydown', this.handleKeyDown.bind(this));
  };

  GameView.prototype.handleKeyDown = function(event) {
    if (GameView.KEYS[event.keyCode]) {
      if (GameView.KEYS[event.keyCode] === 'left') {
        this.game.move([0, -1], this.ctx);
      } else if (GameView.KEYS[event.keyCode] === 'right') {
        this.game.move([0, 1], this.ctx);
      } else if (GameView.KEYS[event.keyCode] === 'space') {
        this.game.rotate(this.ctx);
      }
    }
  };

  GameView.prototype.stop = function() {
    clearInterval(this.interval);
  };
}());
