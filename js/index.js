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

const game = (() => {
  let player1 = {};
  let player2 = {};
  let currentPlayer = {};

  const setPlayer1 = (name, symbol) => {
    player1 = player(name, symbol);
    currentPlayer = player1;
  };

  const setPlayer2 = (name, symbol) => {
    player2 = player(name, symbol);
  };

  const switchPlayer = () => {
    if (player1 === currentPlayer) {
      currentPlayer = player2;
    } else {
      currentPlayer = player1;
    }
  };

  const markCell = (position) => {
    gameBoard.add(position, currentPlayer.getSymbol());
  };

  // TODO: Remove test call
  setPlayer1('Joe', 'X');
  setPlayer2('Amy', 'O');

  return { setPlayer1, setPlayer2, switchPlayer, markCell };
})();

const displayController = (() => {
  const board = document.querySelectorAll('.cell');

  const init = () => {
    Object.keys(board).forEach((cell) => {
      board[cell].addEventListener('click', (e) => {
        game.markCell(e.target.dataset.indexNumber);
        game.switchPlayer();
        displayController.render();
      });
    });
  };

  const render = () => {
    const grid = gameBoard.getGrid();
    let index = 0;

    Object.keys(board).forEach((cell) => {
      board[cell].textContent = grid[index];
      index += 1;
    });
  };

  init();
  return { render };
})();
