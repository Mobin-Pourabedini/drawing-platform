# Draw Like Louie !!
This React app provides a drawing board which supports some painting features such as vanilla pen, and some shapes such as triangle, circle and square.

## SVG Board
the drawing board is designed using svg which stores the drawings using vectorized data, this allows for a high-quality representation and efficient data storage.

## Import & Export
you can export the drawing with all the details and title and later import that file to this app and restore the exact Board!

### number of each shape
since this project has been started as a `web programming assignment` it currently has a footer for counting number of each shape.

### structure
the main components of this app are `Board`, `ToolBox`, `BoardHeader` and others.
data storage in the same session is handled using react states, and they'll be wiped out on refresh.
since svg has been used the pen drawings are stored as a list of points in the Board.
shapes are stores as the starting and ending point of the gesture used for creating them, based on the shape `kind` a different shape is created.
unfortunately coloring and pen size are not currently supported.
