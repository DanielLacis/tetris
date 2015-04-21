// refactor into piece classes?
(function () {
  if (typeof Tetris === 'undefined') {
    Tetris = {};
  }

  var Board = Tetris.Board;
  var Util = Tetris.Util;

  var Piece = Tetris.Piece = function (options) {
    options = options || {};
    this.kind = options.kind || Piece.randomKind();
    if (options.pivot) {
      this.pivot = options.pivot;
    } else {
      this.pivot =[Tetris.Board.OFFSET, Math.floor((Tetris.Board.SIZE[1] - 1) / 2)];
      if (this.kind === 'j' || this.kind === 'l' || this.kind === 't') {
        this.pivot = Util.add(this.pivot, [1, 0]);
      }
    }
    this.rotation = options.rotation || 0;
    this.color = options.color || Piece.getColor(this.kind);
    if (options.occupied) {
      this.occupied = options.occupied;
    } else {
      this.occupied = [this.pivot];
      var toFill = Piece[this.kind];
      for(var i = 0; i < toFill.length; i++) {
        this.occupied.push(Util.add(this.pivot, toFill[i]));
      }
    }
  };

  Piece.square = [[1, 1], [0, 1], [1, 0]];
  Piece.rod = [[0, -1], [0, 1], [0, 2]];
  Piece.t = [[0, -1], [-1, 0], [0, 1]];
  Piece.z = [[0, -1], [1, 0], [1, 1]];
  Piece.z2 = [[1, -1], [1, 0], [0, 1]];
  Piece.j = [[0, -1], [-1 ,-1], [0, 1]];
  Piece.l = [[0, -1], [0, 1], [-1, 1]];
  Piece.DIRS = { left: [0, -1], right: [0, 1], up: [-1, 0], down: [1, 0] };
  Piece.PIECES = ['square', 'rod', 't', 'z', 'z2', 'j', 'l'];
  Piece.COLORS = { square: '#FFA945', rod: '#0CE8BD', t: '#FF735A',
                   z: '#45CBFF', z2: '#6813E8', j: '#D29DFF', l: '#92E86F' };

  Piece.DIM = 30;

  Piece.prototype.rotate = function() {
    if(this.kind === 'square') {
      return false;
    } else if (this.kind === 'rod') {
      this.rotateRod();
    } else {
      for(var i = 0; i < this.occupied.length; i++) {
        this.occupied[i] = Util.rotate(this.pivot, this.occupied[i]);
      }
    }
    return true;
  };

  Piece.prototype.move = function(dir) {
    for(var i = 0; i < this.occupied.length; i++) {
      this.occupied[i] = Util.add(this.occupied[i], dir);
    }
    this.pivot = Util.add(this.pivot, dir);
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

// the rod does not rotate around one of its occupied squares.  Since it is
// only one piece I chose to write the method as direct entry, as it is simple
  Piece.prototype.rotateRod = function() {  //ewww
    switch (this.rotation) {
      case 0:
        this.rotation += 1;
        this.pivot = Util.add(this.pivot, [0, 1]);
        this.occupied = [this.pivot];
        this.occupied.push(Util.add(this.pivot, [-1, 0]));
        this.occupied.push(Util.add(this.pivot, [1, 0]));
        this.occupied.push(Util.add(this.pivot, [2, 0]));
        break;
      case 1:
        this.rotation += 1;
        this.pivot = Util.add(this.pivot, [1, 0]);
        this.occupied = [this.pivot];
        this.occupied.push(Util.add(this.pivot, [0, -2]));
        this.occupied.push(Util.add(this.pivot, [0, -1]));
        this.occupied.push(Util.add(this.pivot, [0, 1]));
        break;
      case 2:
        this.rotation += 1;
        this.pivot = Util.add(this.pivot, [0, -1]);
        this.occupied = [this.pivot];
        this.occupied.push(Util.add(this.pivot, [-2, 0]));
        this.occupied.push(Util.add(this.pivot, [-1, 0]));
        this.occupied.push(Util.add(this.pivot, [1, 0]));
        break;
      case 3:
        this.rotation = 0;
        this.pivot = Util.add(this.pivot, [-1, 0]);
        this.occupied = [this.pivot];
        this.occupied.push(Util.add(this.pivot, [0, -1]));
        this.occupied.push(Util.add(this.pivot, [0, 1]));
        this.occupied.push(Util.add(this.pivot, [0, 2]));
        break;
    }
  };
}());
