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

  const checkWinner = () => {
    const grid = gameBoard.getGrid();

    // TODO: Define winning logic.
    // if 0, 1, 2
    // if 0, 3, 6
    // if 0, 4, 8
    // if 1, 4, 7
    // if 2, 4, 6
    // if 2, 5, 8
    // if 3, 4, 5
    // if 6, 7, 8
    // It ain't pretty, but it's honest work.
    let index = 0;
    grid.forEach((cell) => {
      if (index === 0) {
        if (grid[0] && grid[1] && grid[2]) {
          if (grid[0] === grid[1] && grid[1] === grid[2]) {
            console.log(`Player ${currentPlayer.getName()} won!`);
          }
        }
      }
      index += 1;
    });

    return false;
  };

  const markCell = (position) => {
    gameBoard.add(position, currentPlayer.getSymbol());
  };

  // TODO: Remove test call
  setPlayer1('Joe', 'X');
  setPlayer2('Amy', 'O');

  return { setPlayer1, setPlayer2, switchPlayer, markCell, checkWinner };
})();

const displayController = (() => {
  const board = document.querySelectorAll('.cell');

  const init = () => {
    Object.keys(board).forEach((cell) => {
      board[cell].addEventListener('click', (e) => {
        game.markCell(e.target.dataset.indexNumber);
        displayController.render();
        game.checkWinner();
        game.switchPlayer();
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
