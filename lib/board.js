(function () {
  if (typeof Tetris === 'undefined') {
    Tetris = {};
  }

  var Util = Tetris.Util;
  var Piece = Tetris.Piece;

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
  Board.DIMS = [Piece.DIM*Board.SIZE[0] - Board.OFFSET*Piece.DIM,
                Piece.DIM*Board.SIZE[1]];
  Board.COLOR = '#FFFFF0';

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
        x = j * Piece.DIM;
        y = (i-Board.OFFSET) * Piece.DIM;
        Util.drawRect(ctx, x, y, this.board[i][j]);
      }
    }
    for(var k = 0; k < piece.occupied.length; k++) {
      x = piece.occupied[k][1] * Piece.DIM;
      y = (piece.occupied[k][0]-Board.OFFSET) * Piece.DIM;
      Util.drawRect(ctx, x, y, piece.color);
    }
    if (!!drop) {
      for(var l = 0; l < drop.occupied.length; l++) {
        x = drop.occupied[l][1] * Piece.DIM;
        y = (drop.occupied[l][0]-Board.OFFSET) * Piece.DIM;
        Util.drawRect(ctx, x, y, "rgba(0, 0, 0, 0.1)");
      }
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
      this.colorRowsToDelete(rows);
    }
    return rows;
  };

  Board.prototype.colorRowsToDelete = function(rows) {
    for(var i = 0; i < rows.length; i++) {
      for(var j = 0; j < this.board[i].length; j++) {
        this.board[rows[i]][j] = '#FF1493';
      }
    }
  };


  Board.prototype.shiftRowsDown = function(rows) {
    this.updateScore(rows.length);
    for(var i = 0; i < rows.length; i++) {
      for(var j = rows[i]; j > 0; j--) {
        for(var k = 0; k < this.board[j].length; k++) {
          this.board[j][k] = this.board[j-1][k];
        }
      }
    }
  };

  Board.prototype.updateScore = function(numRowsRemoved) {
    this.score += numRowsRemoved * Math.pow(2, numRowsRemoved - 1);
  };

}());
