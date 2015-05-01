(function () {
  if (typeof Tetris === 'undefined') {
    Tetris = {};
  }
  var Piece = Tetris.Piece;

  var Util = Tetris.Util = function (options) {

  };
  var add = Util.add = function(pos1, delta) {
    return [pos1[0] + delta[0], pos1[1] + delta[1]];
  };

  var subtract = Util.subtract = function(pos1, pos2) {
    return([pos1[0] - pos2[0], pos1[1] - pos2[1]]);
  };

  var rotate = Util.rotate = function(origin, pos) { //could do with matrix multiplication
    var rel = Util.subtract(pos, origin);
    var newRel = [rel[1], rel[0]*-1];
    var newPos = Util.add(newRel, origin);
    return newPos;
  };

  var drawRect = Util.drawRect = function(ctx, x, y, color) {
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.strokeStyle = "black";
    ctx.rect(x, y, Tetris.Piece.DIM, Tetris.Piece.DIM);
    ctx.stroke();
    ctx.fill();
  };

  var drawPieceRect = Util.drawPieceRect = function(ctx, x, y, color) {
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.strokeStyle = "black";
    ctx.rect(x, y, Tetris.Piece.DIM - 1, Tetris.Piece.DIM - 1);
    ctx.stroke();
    ctx.fill();
  };

  var drawBlankRect = Util.drawBlankRect = function(ctx, x, y) {
    ctx.beginPath();
    ctx.strokeStyle = "black";
    ctx.rect(x, y, Tetris.Piece.DIM * 6, Tetris.Piece.DIM * 6);
    ctx.stroke();
  };

  var playGameover = Util.playGameover = function() {
    Util.playAudio('gameover');
  };

  var playLineClear = Util.playLineClear = function() {
    Util.playAudio('lineclear');
  };

  var playMove = Util.playMove = function() {
    Util.playAudio('move');
  };

  var playLand = Util.playLand = function() {
    Util.playAudio('land');
  };

  var playRotate = Util.playRotate = function() {
    Util.playAudio('rotate');
  };

  var playLevelUp = Util.playLevelUp = function() {
    Util.playAudio('levelup');
  };

  var playFourLines = Util.playFourLines = function() {
    Util.playAudio('fourlines');
  };

  var playAudio = Util.playAudio = function(sound) {
    if (Util.audio) {
      $("audio." + sound).trigger('pause');
      $("audio." + sound).prop('currentTime', 0);
      $("audio." + sound).trigger('play');
    }
  };

  var arrayShuffle = Util.arrayShuffle = function(array) {
    var shuffledArray = [];
    var idx;
    while(array.length > 0) {
      idx = Math.floor(Math.random() * array.length);
      shuffledArray.push(array.splice(idx, 1)[0]);
    }
    return shuffledArray;
  };

  var centerText = Util.centerText = function(ctx, text, y) {
    var measurement = ctx.measureText(text);
    var x = (ctx.canvas.width - measurement.width) / 2;
    ctx.fillText(text, x, y);
  };
}());
