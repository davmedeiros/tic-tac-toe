const gameBoard = (() => {
  const grid = [];
  const size = 9;

  const add = (position, symbol) => {
    if (position < 0 || position > size) {
      return `Enter a position between 0 and ${size}.`;
    }

    if (symbol !== 'X' && symbol !== 'O') {
      return 'Enter a valid symbol [X, O].';
    }

    if (grid[position] !== undefined) {
      return `The position ${position} is already filled.`;
    }

    grid[position] = symbol;
    return 0;
  };

  const clear = () => grid.splice(0, grid.length);

  const get = () => grid;

  return { add, clear, get };
})();
