(function () {
  if (typeof Tetris === 'undefined') {
    Tetris = {};
  }
  var Util = Tetris.Util = function (options) {

  };
  var add = Util.add = function(pos1, delta) {
    return [pos1[0] + delta[0], pos1[1] + delta[1]];
  };

  var subtract = Util.subtract = function(pos1, pos2) {
    return([pos1[0] - pos2[0], pos1[1] - pos2[1]]);
  };

  var rotate = Util.rotate = function(origin, pos) {
    var rel = Util.subtract(pos, origin); //pos[1] - origin[1] = 0, -1
    var newRel = [rel[1], rel[0]*-1]; // -1, 0
    var newPos = Util.add(newRel, origin); //-1, 0
    return newPos;
  };

  var drawRect = Util.drawRect = function(ctx, x, y, color) {
    ctx.fillStyle = color; // will this work?
    ctx.strokeStyle = "black";
    ctx.rect(x, y, x + Tetris.Piece.DIM, y + Tetris.Piece.DIM);
    ctx.stroke();
    ctx.fill();
  };

}());
