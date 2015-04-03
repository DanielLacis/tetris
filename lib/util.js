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

  var drawBlankRect = Util.drawBlankRect = function(ctx, x, y) {
    ctx.beginPath();
    ctx.strokeStyle = "black";
    ctx.rect(x, y, Tetris.Piece.DIM * 6, Tetris.Piece.DIM * 6);
    ctx.stroke();
  };

  var playGameover = Util.playGameover = function() {
    $('audio.gameover').trigger('pause');
    $('audio.gameover').prop("currentTime",0);
    $('audio.gameover').trigger('play');
  };

  var playLineClear = Util.playLineClear = function() {
    $('audio.lineclear').trigger('pause');
    $('audio.lineclear').prop("currentTime",0);
    $('audio.lineclear').trigger('play');
  };

  var playMove = Util.playMove = function() {
    $('audio.move').trigger('pause');
    $('audio.move').prop("currentTime",0);
    $('audio.move').trigger('play');
  };

  var playLand = Util.playLand = function() {
    $('audio.land').trigger('pause');
    $('audio.land').prop("currentTime",0);
    $('audio.land').trigger('play');
  };

  var playRotate = Util.playRotate = function() {
    $("audio.rotate").trigger('pause');
    $("audio.rotate").prop("currentTime",0);
    $('audio.rotate').trigger('play');
  };

  var playLevelUp = Util.playLevelUp = function() {
    $('audio.levelup').trigger('pause');
    $('audio.levelup').prop("currentTime",0);
    $('audio.levelup').trigger('play');
  };

  var playFourLines = Util.playFourLines = function() {
    $('audio.fourlines').trigger('pause');
    $('audio.fourlines').prop("currentTime",0);
    $('audio.fourlines').trigger('play');
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
}());
