(function () {
  if (typeof Tetris === 'undefined') {
    Tetris = {};
  }
  var Board = Tetris.Board = function (options) {
    this.board = [];
    for(var i = 0; i < Board.SIZE[0]; i++) {
      this.board.push(Array.apply(null, Array(Board.SIZE[1])).map(
        function() {
          return Board.COLOR;
        }));
    }
  };

  Board.SIZE = [24, 10]; // top 4 lines will not be displayed
  Board.DIMS = [Tetris.Piece.DIMS[0]*Board.SIZE[0] - 4, // don't draw top 4 rows
                Tetris.Piece.DIMS[1]*Board.SIZE[1]];
  Board.COLOR = 'white';

  Board.prototype.save = function(piece) {
    for(var i = 0; i < piece.occupied.length; i++) {
      this.board[piece.occupied[i][0]][piece.occupied[i][1]] = piece.color;
    }
  };

  Board.prototype.collision = function(piece) {
    for(var i = 0; i < piece.occupied.length; i++) {
      if(this.board[piece.occupied[i][0]][piece.occupied[i][1]] !== Board.COLOR) {
        return true;
      }
    }
    return false;
  };

  Board.prototype.draw = function(ctx, piece) {
    ctx.clearRect(0, 0, Board.DIMS[0], Board.DIMS[1]);
    var x;
    var y;
    for(var i = 4; i < this.board.length; i++) { // don't draw top 4 rows
      for(var j = 0; j < this.board[i].length; j++) {
        x = j * Tetris.Piece.DIM;
        y = i * Tetris.Piece.DIM;
        Tetris.Util.drawRect(ctx, x, y, this.board[i][j]);
      }
    }
    if (piece) { //is this necessary?
      for(var k = 0; k < piece.occupied; k++) {
        x = piece.occupied[1] * Tetris.Piece.DIM;
        y = piece.occupied[0] * Tetris.Piece.DIM;
        Tetris.Util.drawRect(ctx, x, y, piece.color);
      }
    }
  };


}());
