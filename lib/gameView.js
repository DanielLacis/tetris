(function () {
  if (typeof Tetris === 'undefined') {
    Tetris = {};
  }
  var Piece = Tetris.Piece;
  var Game = Tetris.Game;
  var Util = Tetris.Util;

  var GameView = Tetris.GameView = function (game, ctx, nextPieceCtx) {
    this.game = game;
    this.ctx = ctx;
    this.nextPieceCtx = nextPieceCtx;
    this.bindEvents();
    this.paused = false;
    this.stopped = false;
    this.displayScore();
    this.initialize();
  };

  GameView.KEYS = {
    37: 'left',
    39: 'right',
    32: 'space',
    40: 'down',
    38: 'up',
    27: 'esc'
  };

  GameView.prototype.initialize = function() {
    this.game.draw(this.ctx);
    this.game.drawNextPieces(this.nextPieceCtx);
  };

  GameView.prototype.start = function() {
    $('.music').trigger('play');
    this.beginInterval();
  };

  GameView.prototype.beginInterval = function() {
    this.interval = setInterval(function () {
      var result = this.game.step(this.nextPieceCtx);
      if (!result || this.game.over()) {
        Util.playGameover();
        this.game.displayOver(this.ctx);
        this.stopped = true;
        this.stop();
      }
      if (result.length === 0){
        this.game.createDropPiece();
      } else {
        this.game.dropPiece = null;
      }
      this.game.draw(this.ctx);
      if (result.length > 0) {
        this.pauseForRowRemoval(result);
      }
    }.bind(this), this.game.interval);
  };

  GameView.prototype.pauseForRowRemoval = function(rows) {
    this.stop();
    this.stopped = true;
    // setTimeout(this.executeRowRemoval.bind(this, rows), Game.PAUSE)
    setTimeout( function(){
      this.executeRowRemoval(rows);
    }.bind(this), Game.PAUSEINTERVAL);
  };

  GameView.prototype.bindEvents = function() {
    $(window).on('keydown', this.handleKeyDown.bind(this));
    $('button.restart').on('click', this.restart.bind(this));
  };

  GameView.prototype.handleKeyDown = function(event) {
    var keyCode = GameView.KEYS[event.keyCode];
    if (keyCode) {
      event.preventDefault();
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
        result = this.game.moveSide(Piece.DIRS.left);
        break;
      case 'right':
        result = this.game.moveSide(Piece.DIRS.right);
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
    if (rows.length === 4) {
      Util.playFourLines();
    } else {
      Util.playLineClear();
    }
    this.game.updateSpeed();
    this.displayScore();
    this.start();
  };

  GameView.prototype.stop = function() {
    clearInterval(this.interval);
  };

  GameView.prototype.pause = function() {
    if (this.paused) {
      this.start();
      this.paused = false;
      $('h3.paused').html("");
    } else {
      this.stop();
      this.paused = true;
      $('h3.paused').html("Paused");
    }
  };

  GameView.prototype.restart = function() {
    if (this.stopped) {
      return false;
    }
    this.stop();
    setTimeout(this.resetGameView.bind(this), 0);
  };

  GameView.prototype.resetGameView = function() {
    this.paused = false;
    this.stopped = false;
    this.game = new Game();
    this.initialize();
    this.start();
    setTimeout(this.pauseOnRestart.bind(this), 0);
  };

  GameView.prototype.pauseOnRestart = function() {
    this.displayScore();
    this.game.draw(this.ctx);
    this.pause();
  };


  GameView.prototype.displayScore = function() {
    $('.score').html('Score: ' + this.game.board.score);
  };
}());
