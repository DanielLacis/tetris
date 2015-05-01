# Tetris

Canonical implementation of Tetris.  Created from scratch using JavaScript and HTML5 Canvas to display.

[Try it out live here.][live-link]
[live-link]: http://daniellacis.github.io/tetris

<b>Audio</b>
- Audio for piece movement, rotation, locking in, row completion, four row completion, level increase, game loss, and looped tetris music.

<b>Logic</b>
- Most pieces rotate with a -&pi;/2 radian rotation about the appropriate pivot block.
- Pieces are duplicated and manipulated to see if moves and rotations are valid and if the piece will lock in place.
- Pieces are generated in a psuedo-random manner such that:
- - At most two of the same piece are created in a row.
- - At most thirteen other pieces are created before a piece is created again.
- - System guarantees an average of 1/7 of each piece, with counts differing by at most one.
- Intervals are cleared and reset upon moving a piece.


<b>Library</b>
- JQuery used to insert some html and handle events.
