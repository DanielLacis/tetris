(function () {
  if (typeof Tetris === 'undefined') {
    Tetris = {};
  }
  var Game = Tetris.Game = function (options) {
    this.board = new Tetris.Board();
    this.piece = new Tetris.Piece();
  };

  Game.INTERVAL =1000;

  Game.prototype.step = function() {
    var dupedPiece = this.piece.dup();
    dupedPiece.move([1, 0]);
    if (this.board.collision(dupedPiece)) {
      this.board.save(this.piece);
      this.piece = new Tetris.Piece();
    } else {
      this.piece.move([1, 0]);
    }
    // display board
  };

  Game.prototype.rotate = function(ctx) {
    var dupedPiece = this.piece.dup();
    dupedPiece.rotate();
    if (!this.board.collision(dupedPiece)) {
      this.piece.rotate();
      this.board.draw(ctx, this.piece);
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


}());
