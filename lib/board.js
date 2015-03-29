(function () {
  if (typeof Tetris === 'undefined') {
    Tetris = {};
  }
  var Board = Tetris.Board = function (options) {
    this.board = [];
    this.score = 0;
    for(var i = 0; i < Board.SIZE[0]; i++) {
      this.board.push(Array.apply(null, Array(Board.SIZE[1])).map(
        function() {
          return Board.COLOR;
        }));
    }
  };

  Board.SIZE = [25, 10];
  Board.OFFSET = 5;
  Board.DIMS = [Tetris.Piece.DIM*Board.SIZE[0] - Board.OFFSET*Tetris.Piece.DIM,
                Tetris.Piece.DIM*Board.SIZE[1]];
  Board.COLOR = 'gray';

  Board.prototype.save = function(piece) {
    for(var i = 0; i < piece.occupied.length; i++) {
      this.board[piece.occupied[i][0]][piece.occupied[i][1]] = piece.color;
    }
  };

  Board.prototype.collision = function(piece) {
    for(var i = 0; i < piece.occupied.length; i++) {
      if(piece.occupied[i][0] >= this.board.length || piece.occupied[i][1] >= this.board[0].length) {
        return true;
      }
      if(this.board[piece.occupied[i][0]][piece.occupied[i][1]] !== Board.COLOR) {
        return true;
      }
    }
    return false;
  };

  Board.prototype.draw = function(ctx, piece, drop) {
    ctx.clearRect(0, 0, Board.DIMS[0], Board.DIMS[1]);
    var x;
    var y;
    for(var i = Board.OFFSET; i < this.board.length; i++) {
      for(var j = 0; j < this.board[i].length; j++) {
        x = j * Tetris.Piece.DIM;
        y = (i-Board.OFFSET) * Tetris.Piece.DIM;
        Tetris.Util.drawRect(ctx, x, y, this.board[i][j]);
      }
    }
    for(var k = 0; k < piece.occupied.length; k++) {
      x = piece.occupied[k][1] * Tetris.Piece.DIM;
      y = (piece.occupied[k][0]-Board.OFFSET) * Tetris.Piece.DIM;
      Tetris.Util.drawRect(ctx, x, y, piece.color);
    }

    for(var l = 0; l < drop.occupied.length; l++) {
      x = drop.occupied[l][1] * Tetris.Piece.DIM;
      y = (drop.occupied[l][0]-Board.OFFSET) * Tetris.Piece.DIM;
      Tetris.Util.drawRect(ctx, x, y, "rgba(0, 0, 0, 0.15)");
    }
  };

  Board.prototype.update = function() {
    var rows = [];
    var flag;
    for(var i = 0; i < this.board.length; i++) {
      flag = true;
      for(var j = 0; j < this.board[i].length; j++) {
        if (this.board[i][j] === Board.COLOR) {
          flag = false;
        }
      }
      if (flag) {
        rows.push(i);
      }
    }
    if(rows.length > 0) {
      rows.sort();
      this.updateScore(rows.length);
    }
    for(var k = 0; k < rows.length; k++) {
      this.shiftRows(rows[k]);
    }
  };


  Board.prototype.shiftRows = function(bottomRow) {
    for(var i = bottomRow; i > 0; i--) {
      for(var j = 0; j < this.board[i].length; j++) {
        this.board[i][j] = this.board[i-1][j];
      }
    }
  };

  Board.prototype.updateScore = function(numRowsRemoved) {
    this.score += numRowsRemoved * Math.pow(2, numRowsRemoved - 1);
  };

}());
