(function () {
  if (typeof Tetris === 'undefined') {
    Tetris = {};
  }
  var Game = Tetris.Game = function (options) {
    this.board = new Tetris.Board();
    this.piece = new Tetris.Piece();
  };

  Game.INTERVAL =500;

  Game.prototype.step = function() {
    var dupedPiece = this.piece.dup();
    dupedPiece.move([1, 0]);
    if (this.board.collision(dupedPiece)) {
      this.board.save(this.piece);
      this.board.update();
      this.piece = new Tetris.Piece();
    } else {
      this.piece.move([1, 0]);
    }
  };

  Game.prototype.rotate = function(ctx) {
    var dupedPiece = this.piece.dup();
    dupedPiece.rotate();
    if (!this.board.collision(dupedPiece)) {
      if(this.piece.rotate()) {
        this.board.draw(ctx, this.piece);
      }
    }
  };

  Game.prototype.move = function(dir, ctx) {
    var dupedPiece = this.piece.dup();
    dupedPiece.move(dir);
    if (!this.board.collision(dupedPiece)) {
      this.piece.move(dir);
      this.board.draw(ctx, this.piece);
    }
  };

  Game.prototype.down = function(ctx) {
    var dupedPiece = this.piece.dup();
    var count = 0;
    dupedPiece.move([1, 0]);
    while (!this.board.collision(dupedPiece)) {
      count += 1;
      dupedPiece.move([1, 0]);
    }
    for(var i = 0; i < count; i++) {
      this.piece.move([1, 0]);
    }
      this.board.draw(ctx, this.piece);
  };

  Game.prototype.over = function() {
    for(var i = 0; i < Tetris.Board.OFFSET; i++) {
      for(var j = 0; j < this.board.board[i].length; j++) {
        if(this.board.board[i][j] !== Tetris.Board.COLOR) {
          return true;
        }
      }
    }
    return false;
  };


}());
