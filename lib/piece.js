// a piece will need to know its position and the relative positions of its pieces

(function () {
  if (typeof Tetris === 'undefined') {
    Tetris = {};
  }
  var Piece = Tetris.Piece = function (options) {
    options = options || {};
    this.pivot = options.pivot || [Tetris.Board.OFFSET-2,
                                   Math.floor((Tetris.Board.SIZE[1] - 1) / 2)];
    this.kind = options.kind || Piece.randomKind();
    this.color = options.color || Piece.getColor(this.kind);
    if (options.occupied) {
      this.occupied = options.occupied;
    } else {
      this.occupied = [this.pivot];
      var toFill = Piece[this.kind];
      for(var i = 0; i < toFill.length; i++) {
        this.occupied.push(Tetris.Util.add(this.pivot, toFill[i]));
      }
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
  Piece.COLORS = {square: '#FFA945', rod: '#0CE8BD', t: '#FF735A',
                  z: '#45CBFF', z2: '#6813E8', l2: '#D29DFF', l: '#92E86F'};

  Piece.DIM = 35;

  Piece.prototype.rotate = function() {
    if(this.kind === 'square') {
      return false;
    }
    for(var i = 0; i < this.occupied.length; i++) {
      this.occupied[i] = Tetris.Util.rotate(this.pivot, this.occupied[i]);
    }
    return true;
  };

  Piece.prototype.move = function(dir) {
    for(var i = 0; i < this.occupied.length; i++) {
      this.occupied[i] = Tetris.Util.add(this.occupied[i], dir);
    }
    this.pivot = Tetris.Util.add(this.pivot, dir);
  };

  Piece.prototype.dup = function() {
    var currOccupied = [];
    for(var i = 0; i < this.occupied.length; i++) {
      currOccupied.push([this.occupied[i][0], this.occupied[i][1]]);
    }
    var newPiece = new Piece({pivot: [this.pivot[0], this.pivot[1]],
                              occupied: currOccupied, color: this.color,
                              kind: this.kind});
    return newPiece;
  };

  Piece.randomKind = function() {
    return Piece.PIECES[Math.floor(Math.random() * Piece.PIECES.length)];
  };

  Piece.getColor = function(kind) {
    return Piece.COLORS[kind];
  };
}());
