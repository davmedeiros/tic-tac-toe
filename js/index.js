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
    let result = '';
    let index = 0;
    let filledCellsCount = 0;
    grid.forEach(() => {
      switch (Number(index)) {
        case 0:
          if (grid[0] && grid[1] && grid[2]) {
            if (grid[0] === grid[1] && grid[1] === grid[2]) {
              result = 'win';
              return;
            }
          }

          if (grid[0] && grid[3] && grid[6]) {
            if (grid[0] === grid[3] && grid[3] === grid[6]) {
              result = 'win';
              return;
            }
          }

          if (grid[0] && grid[4] && grid[8]) {
            if (grid[0] === grid[4] && grid[4] === grid[8]) {
              result = 'win';
              return;
            }
          }

          break;
        case 1:
          if (grid[1] && grid[4] && grid[7]) {
            if (grid[1] === grid[4] && grid[4] === grid[7]) {
              result = 'win';
              return;
            }
          }

          break;
        case 2:
          if (grid[2] && grid[4] && grid[6]) {
            if (grid[2] === grid[4] && grid[4] === grid[6]) {
              result = 'win';
              return;
            }
          }

          if (grid[2] && grid[5] && grid[8]) {
            if (grid[2] === grid[5] && grid[5] === grid[8]) {
              result = 'win';
              return;
            }
          }

          break;
        case 3:
          if (grid[3] && grid[4] && grid[5]) {
            if (grid[3] === grid[4] && grid[4] === grid[5]) {
              result = 'win';
              return;
            }
          }

          break;
        case 6:
          if (grid[6] && grid[7] && grid[8]) {
            if (grid[6] === grid[7] && grid[7] === grid[8]) {
              result = 'win';
              return;
            }
          }

          break;
        default:
          break;
      }

      if (grid[index]) {
        filledCellsCount += 1;
      }
      index += 1;
    });

    if (filledCellsCount === 9 && result !== 'win') {
      return 'tie';
    }

    return result;
  };

  const markCell = (position) => {
    gameBoard.add(position, currentPlayer.getSymbol());
  };

  const getCurrentPlayer = () => currentPlayer;

  const reset = () => {
    gameBoard.clear();
  };

  const playRound = (index) => {
    game.markCell(index);
    const result = game.checkWinner();
    if (result === 'win') {
      return [`${currentPlayer.getName()} won`, true];
    }

    if (result === 'tie') {
      return [`It's a tie`, true];
    }

    game.switchPlayer();
    return [`${currentPlayer.getName()}'s turn`, false];
  };

  setPlayer1('Player 1', 'X');
  setPlayer2('Player 2', 'O');

  return {
    setPlayer1,
    setPlayer2,
    switchPlayer,
    markCell,
    checkWinner,
    getCurrentPlayer,
    playRound,
    reset,
  };
})();

const displayController = (() => {
  const board = document.querySelectorAll('.cell');
  const message = document.querySelector('.message');
  const newGameButton = document.querySelector('#new-game');
  const addPlayersButtons = document.querySelector('#add-players');
  const playersForm = document.querySelector('#players-form');

  const setMessage = (text) => {
    message.textContent = text;
  };

  const togglePlayersForm = () => {
    playersForm.classList.toggle('hidden');
  };

  const toggleLockBoard = () => {
    Object.keys(board).forEach((cell) => {
      board[cell].classList.toggle('locked');
    });
  };

  const startNewGame = () => {
    game.reset();
    setMessage('Playing');
    displayController.render();
    toggleLockBoard();
  };

  const markCell = (e) => {
    const cellClicked = e.target.dataset.indexNumber;
    const [result, hasEnded] = game.playRound(cellClicked);
    setMessage(result);
    displayController.render();
    if (hasEnded) {
      toggleLockBoard();
    }
  };

  const setBoardEvents = () => {
    Object.keys(board).forEach((cell) => {
      board[cell].addEventListener('click', markCell);
    });
  };

  const setNewGameEvent = () => {
    newGameButton.addEventListener('click', startNewGame);
  };

  const setAddPlayersEvent = () => {
    addPlayersButtons.addEventListener('click', togglePlayersForm);
  };

  const render = () => {
    const grid = gameBoard.getGrid();
    let index = 0;

    Object.keys(board).forEach((cell) => {
      board[cell].textContent = grid[index];
      index += 1;
    });
  };

  setBoardEvents();
  setNewGameEvent();
  setAddPlayersEvent();

  return { render };
})();
