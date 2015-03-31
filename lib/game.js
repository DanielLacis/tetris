(function () {
  if (typeof Tetris === 'undefined') {
    Tetris = {};
  }

  var Piece = Tetris.Piece;
  var Board = Tetris.Board;
  var Game = Tetris.Game = function (options) {
    this.board = new Board();
    this.piece = new Piece();
    this.dropPiece = null;
    this.interval = Game.INTERVALARRAY[0]; // set to Game.INTERVALARRAY[0]
  };

  Game.PAUSEINTERVAL = 500;
  Game.INTERVALARRAY = [500, 375]; // 10 levels, 500 to 250, 25 ms each or similar

  Game.prototype.step = function() {
    var dupedPiece = this.piece.dup();
    dupedPiece.move(Piece.DIRS.down);
    if (this.board.collision(dupedPiece)) {
      this.board.save(this.piece);
      var rows = this.board.update();
      this.piece = new Piece();
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
    if(this.board.score > 31) {
      this.interval = Game.INTERVALARRAY[1];
    }
  };


}());
