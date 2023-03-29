const gameBoard = (() => {
  const grid = [];
  const size = 9;

  const add = (position, symbol) => {
    if (position < 0 || position > size) return 1;

    if (grid[position] !== undefined) return 2;

    grid[position] = symbol;
    return 0;
  };

  const clear = () => grid.splice(0, grid.length);

  const getGrid = () => grid;

  return { add, clear, getGrid };
})();

const player = (name, symbol) => {
  let score = 0;

  const getName = () => name;

  const getSymbol = () => symbol;

  const getScore = () => score;

  const addPoint = () => {
    score += 1;
  };

  return { getName, getSymbol, getScore, addPoint };
};

const displayController = (() => {
  const board = document.querySelectorAll('.cell');

  const addInteraction = (event) => {
    console.log(`clicked ${event.target.textContent}`);
  }

  const render = () => {
    const grid = gameBoard.getGrid();
    let index = 0;

    Object.keys(board).forEach((cell) => {
      board[cell].textContent = grid[index];
      board[cell].addEventListener('click', addInteraction);
      index += 1;
    });
  };

  return { render };
})();

const game = (() => {
  
  /**
   * TODO: Remove tests
   *
   * The game should be fully playable from the terminal.
   */
  const player1 = player('Joe', 'X');
  const player2 = player('Amy', 'O');
  gameBoard.add(4, player1.getSymbol());
  displayController.render();
  gameBoard.add(2, player2.getSymbol());
  displayController.render();
})();
