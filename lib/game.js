(function () {
  if (typeof Tetris === 'undefined') {
    Tetris = {};
  }

  var Piece = Tetris.Piece;
  var Board = Tetris.Board;
  var Util = Tetris.Util;

  var Game = Tetris.Game = function (options) {
    this.board = new Board();
    this.nextPieces = Util.arrayShuffle(Piece.PIECES.slice());
    this.piece = new Piece({kind: this.nextPieces.shift()});
    this.dropPiece = null;
    this.interval = 500;
    this.nextPiecesArray = [];
    this.buildNextPiecesArray();
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
      this.updateNextPiecesArray();
      this.drawNextPieces(nextPieceCtx);
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

  Game.prototype.drawNextPieces = function(nextPieceCtx) {
    nextPieceCtx.clearRect(0, 0, Tetris.Piece.DIM * 20, Tetris.Piece.DIM * 6);
    for(var k = 0; k < 3; k++) {
      Util.drawBlankRect(nextPieceCtx, k * Tetris.Piece.DIM * 6, 0);
    }
    var x;
    var y;
    for(var i = 0; i < this.nextPiecesArray.length; i++) {
      for(var j = 0; j < this.nextPiecesArray[i].occupied.length; j++) {
        x = this.nextPiecesArray[i].occupied[j][1] * Piece.DIM;
        y = this.nextPiecesArray[i].occupied[j][0] * Piece.DIM;
        Util.drawRect(nextPieceCtx, x, y, this.nextPiecesArray[i].color);
      }
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
    this.piece.color = "rgba(128, 128, 128, .5)";
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

  Game.prototype.buildNextPiecesArray = function() {
    for(var i = 0; i < 3; i++) {
      var nextPivot = [3, (i * 6) + 2];
      var nextKind = this.nextPieces[i];
      if (nextKind === 'z' || nextKind === 'z2' || nextKind === 'square') {
        nextPivot = Util.add(nextPivot, [-1, 0]);
      }
      this.nextPiecesArray.push(new Piece({ kind: nextKind, pivot: nextPivot }));
    }
  };

  Game.prototype.updateNextPiecesArray = function() {
    this.nextPiecesArray.shift();
    for (var i = 0; i < this.nextPiecesArray.length; i++) {
      this.nextPiecesArray[i].pivot = Util.subtract(this.nextPiecesArray[i].pivot, [0, 6]);
      for (var j = 0; j < this.nextPiecesArray[i].occupied.length; j++) {
        this.nextPiecesArray[i].occupied[j] = Util.subtract(this.nextPiecesArray[i].occupied[j], [0, 6]);
      }
    }
    var nextPivot = [3, 14];
    var nextKind = this.nextPieces[2];
    if (nextKind === 'z' || nextKind === 'z2' || nextKind === 'square') {
      nextPivot = Util.add(nextPivot, [-1, 0]);
    }
    this.nextPiecesArray.push(new Piece({kind: nextKind, pivot: nextPivot}));
  };


}());
