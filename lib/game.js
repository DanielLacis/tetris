(function () {
  if (typeof Tetris === 'undefined') {
    Tetris = {};
  }

  var Piece = Tetris.Piece;
  var Board = Tetris.Board;
  var Util = Tetris.Util;

  var Game = Tetris.Game = function (options) {
    this.board = new Board();
    this.piece = new Piece();
    this.nextPieces = Util.arrayShuffle(Piece.PIECES.slice());
    this.dropPiece = null;
    this.interval = 500;
    this.nextPiece = new Piece({kind: this.nextPieces[0], pivot: [2, 2]});
    this.updateSpeed();
  };

  Game.PAUSEINTERVAL = 500;
  Game.INTERVAL = [500, 475, 450, 425, 400, 375, 350, 325, 300, 275];
  Game.LEVEL = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  Game.prototype.step = function(nextPieceCtx) {
    var dupedPiece = this.piece.dup();
    dupedPiece.move(Piece.DIRS.down);
    if (this.board.collision(dupedPiece)) {
      Util.playLand();
      this.board.save(this.piece);
      var rows = this.board.update();
      this.piece = new Piece({kind: this.nextPieces.shift()});
      this.updateNextPieces();
      this.nextPiece = new Piece({kind: this.nextPieces[0], pivot: [2, 2]});
      this.drawNextPiece(nextPieceCtx);
      if (this.board.collision(this.piece)) {
        return false;
      }
      return rows;
    } else {
      this.piece.move(Piece.DIRS.down);
      return [];
    }
  };

  Game.prototype.rotate = function() {
    var dupedPiece = this.piece.dup();
    dupedPiece.rotate();
    if (!this.board.collision(dupedPiece)) {
      if(this.piece.rotate()) {
        Util.playRotate();
        return true;
      }
    }
    return false;
  };

  Game.prototype.move = function(dir) {
    var dupedPiece = this.piece.dup();
    dupedPiece.move(dir);
    if (!this.board.collision(dupedPiece)) {
      this.piece.move(dir);
      return true;
    }
    return false;
  };

  Game.prototype.moveSide = function(dir) {
    var dupedPiece = this.piece.dup();
    dupedPiece.move(dir);
    if (!this.board.collision(dupedPiece)) {
      Util.playMove();
      this.piece.move(dir);
      return true;
    }
    return false;
  };

  Game.prototype.down = function() {
    var dupedPiece = this.piece.dup();
    var count = 0;
    dupedPiece.move(Piece.DIRS.down);
    while (!this.board.collision(dupedPiece)) {
      count += 1;
      dupedPiece.move(Piece.DIRS.down);
    }
    if (count > 0) {
      for(var i = 0; i < count; i++) {
        this.piece.move(Piece.DIRS.down);
      }
      return true;
    }
    return false;
  };

  Game.prototype.downOne = function() {
    var dupedPiece = this.piece.dup();
    dupedPiece.move(Piece.DIRS.down);
    if (!this.board.collision(dupedPiece)) {
      this.piece.move(Piece.DIRS.down);
      Util.playMove();
      return true;
    }
    return false;
  };

  Game.prototype.createDropPiece = function() {
    var dropPiece = this.piece.dup();
    while (!this.board.collision(dropPiece)) {
      dropPiece.move(Piece.DIRS.down);
    }
    dropPiece.move(Piece.DIRS.up);
    this.dropPiece = dropPiece;
  };

  Game.prototype.draw = function(ctx) {
    this.board.draw(ctx, this.piece, this.dropPiece);
  };

  // Board.prototype.draw = function(ctx, piece, drop) {
  //   ctx.clearRect(0, 0, Board.DIMS[0], Board.DIMS[1]);
  //   var x;
  //   var y;
  //   for(var i = Board.OFFSET; i < this.board.length; i++) {
  //     for(var j = 0; j < this.board[i].length; j++) {
  //       x = j * Piece.DIM;
  //       y = (i-Board.OFFSET) * Piece.DIM;
  //       Util.drawRect(ctx, x, y, this.board[i][j]);
  //     }
  //   }
    // for(var k = 0; k < piece.occupied.length; k++) {
    //   x = piece.occupied[k][1] * Piece.DIM;
    //   y = (piece.occupied[k][0]-Board.OFFSET) * Piece.DIM;
    //   Util.drawRect(ctx, x, y, piece.color);
    // }
  //   if (!!drop) {
  //     for(var l = 0; l < drop.occupied.length; l++) {
  //       x = drop.occupied[l][1] * Piece.DIM;
  //       y = (drop.occupied[l][0]-Board.OFFSET) * Piece.DIM;
  //       Util.drawRect(ctx, x, y, "rgba(0, 0, 0, 0.1)");
  //     }
  //   }
  // };

  Game.prototype.drawNextPiece = function(nextPieceCtx) {
    nextPieceCtx.clearRect(0, 0, Tetris.Piece.DIM * 5, Tetris.Piece.DIM * 5);
    var x;
    var y;
    for(var i = 0; i < this.nextPiece.occupied.length; i++) {
      x = this.nextPiece.occupied[i][1] * Piece.DIM;
      y = this.nextPiece.occupied[i][0] * Piece.DIM;
      Util.drawRect(nextPieceCtx, x, y, this.nextPiece.color);
    }
  };

  Game.prototype.over = function() {
    for(var i = 0; i < Board.OFFSET; i++) {
      for(var j = 0; j < this.board.board[i].length; j++) {
        if(this.board.board[i][j] !== Board.COLOR) {
          return true;
        }
      }
    }
    return false;
  };

  Game.prototype.displayOver = function(ctx) {
    for(var i = 0; i < this.board.board.length; i++) {
      for(var j = 0; j < this.board.board[i].length; j++) {
        if(this.board.board[i][j] !== Board.COLOR) {
          this.board.board[i][j] = 'red';
        }
      }
    }
    this.draw(ctx);
  };

  Game.prototype.updateSpeed = function() {
    var level = Math.floor(this.board.score / 10);
    if (level > 9) {
      level = 9;
    }
    if (this.interval !== Game.INTERVAL[level]) {
      Util.playLevelUp();
      this.interval = Game.INTERVAL[level];
    }
    $('h3.level').html("Level: " + Game.LEVEL[level]);
  };

  Game.prototype.updateNextPieces = function() {
    if (this.nextPieces.length < Piece.PIECES.length) {
      this.nextPieces = this.nextPieces.concat(Util.arrayShuffle(Piece.PIECES.slice()));
    }
  };


}());
