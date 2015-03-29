(function () {
  if (typeof Tetris === 'undefined') {
    Tetris = {};
  }
  var GameView = Tetris.GameView = function (game, ctx) {
    this.game = game;
    this.ctx = ctx;
    this.bindEvents();
    this.paused = false;
  };

  GameView.KEYS = {
    37: 'left',
    39: 'right',
    32: 'space',
    40: 'down',
    38: 'up',
    27: 'esc'
  };

  GameView.prototype.start = function() {
    this.beginInterval();
  };

  GameView.prototype.beginInterval = function() {
    this.interval = setInterval(
      function () {
        var result = this.game.step();
        if (this.game.over()) {
          this.stop();
        }
        this.game.createDropPiece();
        this.game.draw(this.ctx);
        $('strong.score').html(this.game.board.score);
      }.bind(this), Tetris.Game.INTERVAL
    );
  };

  GameView.prototype.bindEvents = function() {
    $(window).on('keydown', this.handleKeyDown.bind(this));
  };

  GameView.prototype.handleKeyDown = function(event) {
    if (GameView.KEYS[event.keyCode]) {
      if (this.paused && (GameView.KEYS[event.keyCode] !== 'esc')) {
        return false;
      }
      var result;
      switch (GameView.KEYS[event.keyCode]) {
        case 'left':
          result = this.game.move([0, -1]);
          break;
        case 'right':
          result = this.game.move([0, 1]);
          break;
        case 'up':
          result = this.game.rotate();
          break;
        case 'space':
          result = this.game.down();
          break;
        case 'down':
          result = this.game.downOne();
          if(result) {
            this.stop();
            this.start();
          }
          break;
        case 'esc':
          result = false;
          this.pause();
          break;
        }
      if (result) {
        this.game.createDropPiece();
        this.game.draw(this.ctx);
      }
    }
  };

  GameView.prototype.stop = function() {
    clearInterval(this.interval);
  };

  GameView.prototype.pause = function() {
    if (this.paused) {
      this.start();
      this.paused = false;
    } else {
      this.stop();
      this.paused = true;
    }
  };
}());
