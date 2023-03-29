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

    // TODO: Refractor
    let isWinner = false;
    let index = 0;
    grid.forEach(() => {
      switch (Number(index)) {
        case 0:
          if (grid[0] && grid[1] && grid[2]) {
            if (grid[0] === grid[1] && grid[1] === grid[2]) {
              isWinner = true;
              return;
            }
          }

          if (grid[0] && grid[3] && grid[6]) {
            if (grid[0] === grid[3] && grid[3] === grid[6]) {
              isWinner = true;
              return;
            }
          }

          if (grid[0] && grid[4] && grid[8]) {
            if (grid[0] === grid[4] && grid[4] === grid[8]) {
              isWinner = true;
              return;
            }
          }

          break;
        case 1:
          if (grid[1] && grid[4] && grid[7]) {
            if (grid[1] === grid[4] && grid[4] === grid[7]) {
              isWinner = true;
              return;
            }
          }

          break;
        case 2:
          if (grid[2] && grid[4] && grid[6]) {
            if (grid[2] === grid[4] && grid[4] === grid[6]) {
              isWinner = true;
              return;
            }
          }

          if (grid[2] && grid[5] && grid[8]) {
            if (grid[2] === grid[5] && grid[5] === grid[8]) {
              isWinner = true;
              return;
            }
          }

          break;
        case 3:
          if (grid[3] && grid[4] && grid[5]) {
            if (grid[3] === grid[4] && grid[4] === grid[5]) {
              isWinner = true;
              return;
            }
          }

          break;
        case 6:
          if (grid[6] && grid[7] && grid[8]) {
            if (grid[6] === grid[7] && grid[7] === grid[8]) {
              isWinner = true;
              return;
            }
          }

          break;
        default:
          return;
      }
      index += 1;
    });
    return isWinner;
  };

  const markCell = (position) => {
    gameBoard.add(position, currentPlayer.getSymbol());
  };

  const getCurrentPlayer = () => currentPlayer;

  // TODO: Remove test call
  setPlayer1('Joe', 'X');
  setPlayer2('Amy', 'O');

  return { setPlayer1, setPlayer2, switchPlayer, markCell, checkWinner, getCurrentPlayer };
})();

const displayController = (() => {
  const board = document.querySelectorAll('.cell');
  const message = document.querySelector('.message');

  const setMessage = (text) => {
    message.textContent = text;
  }

  const setEvents = () => {
    Object.keys(board).forEach((cell) => {
      board[cell].addEventListener('click', (e) => {
        const index = e.target.dataset.indexNumber;
        game.markCell(index);
        displayController.render();
        if (game.checkWinner()) {
          setMessage(`Player ${game.getCurrentPlayer().getName()} won`);
        }
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

  setEvents();
  return { render };
})();
