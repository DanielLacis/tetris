# Tetris

Canonical implementation of Tetris.  Created from scratch using JavaScript and HTML5 Canvas to display.

[Try it out live here.][live-link]
[live-link]: http://daniellacis.github.io/tetris

<b>Audio</b>
- Audio for piece movement, rotation, locking in, row completion, four row completion, level increase, game loss, and looped tetris music.

<b>Visual & Physics</b>
- Most pieces rotate with a -&pi;/2 radian rotation about the appropriate pivot block.
-
- These new smaller 'bowbbles are proportional both in size and color to the amount of their color in the popped 'bowbble
- When 'bowbbles collide (ones center crosses another's edge) they merge into a new 'bowbble with merged size, and weighted average color concentration & velocity vector
- This system thereby preserves both its spectrum and its energy

<b>Philosophy</b>
- Rainbowbbles spontaneously materialize with random color, position, and velocity, within a circle inscribed in the square window
- The bounds of these randomnesses are precisely set so that the spatially unbound system (no edge-wrapping) nonetheless trends toward the formation of a single central giant off-white 'bowbble
- Thus, one can choose either to pop 'bowbbles obsessively, or sit back and let them take their natural course (or alternate between approaches, or explore possibilities between them)
