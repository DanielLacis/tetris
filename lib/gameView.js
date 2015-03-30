(function () {
  if (typeof Tetris === 'undefined') {
    Tetris = {};
  }
  var Piece = Tetris.Piece;
  var Game = Tetris.Game;

  var GameView = Tetris.GameView = function (game, ctx) {
    this.game = game;
    this.ctx = ctx;
    this.bindEvents();
    this.paused = false;
    this.stopped = false;
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
        var rows = this.game.step();
        if (this.game.over()) {
          this.game.displayOver(this.ctx);
          this.stop();
        }
        if (rows.length === 0){
          this.game.createDropPiece();
        } else {
          this.game.dropPiece = null;
        }
        this.game.draw(this.ctx);
        if (rows.length > 0) {
          this.pauseForRowRemoval(rows);
        }
        $('strong.score').html(this.game.board.score);
      }.bind(this), Game.INTERVAL
    );
  };

  GameView.prototype.pauseForRowRemoval = function(rows) {
    this.stop();
    this.stopped = true;
    setTimeout( function(){
      this.executeRowRemoval(rows);
    }.bind(this), Game.PAUSEINTERVAL);
  };

  GameView.prototype.bindEvents = function() {
    $(window).on('keydown', this.handleKeyDown.bind(this));
  };

  GameView.prototype.handleKeyDown = function(event) {
    var keyCode = GameView.KEYS[event.keyCode];
    if (keyCode) {
      if (this.stopped) {
        return false;
      } else if (this.paused && (keyCode !== 'esc')) {
        return false;
      }
      var result = this.processKeyDown(keyCode);
      if (result) {
        this.game.createDropPiece();
        this.game.draw(this.ctx);
      }
    }
  };

  GameView.prototype.processKeyDown = function(keyCode) {
    var result;
    switch (keyCode) {
      case 'left':
        result = this.game.move(Piece.DIRS.left);
        break;
      case 'right':
        result = this.game.move(Piece.DIRS.right);
        break;
      case 'up':
        result = this.game.rotate();
        break;
      case 'space':
        result = this.game.down();
        if(result) {
          this.stop();
          this.start();
        }
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
    return result;
  };

  GameView.prototype.executeRowRemoval = function(rows) {
    this.stopped = false;
    this.game.board.shiftRowsDown(rows);
    this.game.draw(this.ctx);
    this.game.updateSpeed();
    this.start();
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
