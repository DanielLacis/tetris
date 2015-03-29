// a piece will need to know its position and the relative positions of its pieces

(function () {
  if (typeof Tetris === 'undefined') {
    Tetris = {};
  }
  var Piece = Tetris.Piece = function (options) {
    options = options || {};
    this.pivot = options.pivot || [3, 4];
    this.occupied = [this.pivot];
    this.kind = options.kind || Piece.randomKind();
    this.color = options.color || Piece.randomColor();
    var toFill = Piece[this.kind];
    for(var i = 0; i < toFill.length; i++) {
      this.occupied.push(Tetris.Util.add(this.pivot, toFill[i]));
    }
  };

  Piece.square = [[0, 1], [-1, 0], [-1, 1]];
  Piece.rod = [[-2, 0], [-1, 0], [1, 0]];
  Piece.t = [[0, -1], [-1, 0], [0, 1]];
  Piece.z = [[-1, -1], [-1, 0], [0, 1]];
  Piece.z2 = [[0, -1], [-1, 0], [-1, 1]];
  Piece.l2 = [[-1, 0], [1 ,0], [1, -1]];
  Piece.l = [[-1, 0], [1, 0], [1, 1]];
  Piece.PIECES = ['square', 'rod', 't', 'z', 'z2', 'l2', 'l'];
  Piece.COLORS = ['aqua', 'black', 'blue', 'fuchsia', 'gray', 'green',
                  'lime', 'maroon', 'navy', 'olive', 'orange', 'purple', 'red',
                  'silver', 'teal', 'yellow'];
  Piece.DIMS = [50, 50];

  Piece.prototype.rotate = function() {
    for(var i = 0; i < this.occupied.length; i++) {
      this.occupied[i] = Tetris.Util.rotate(this.pivot, this.occupied[i]);
    }
  };

  Piece.prototype.move = function(dir) {
    for(var i = 0; i < this.occupied.length; i++) {
      this.occupied[i] = Tetris.Util.add(this.occupied[i], dir);
    }
    this.pivot = Tetris.Util.add(this.pivot, dir);
  };

  Piece.prototype.dup = function() {
    return new Piece({pivot: this.pivot[0], color: this.color, kind: this.kind});
  };

  Piece.randomKind = function() {
    return Piece.PIECES[Math.floor(Math.random() * Piece.PIECES.length)];
  };

  Piece.randomColor = function() {
    return Piece.COLORS[Math.floor(Math.random() * Piece.COLORS.length)];
  };
}());
