const gameBoard = (() => {
  const grid = [];
  const size = 9;

  const add = (position, symbol) => {
    if (position < 0 || position > size - 1) return 1;

    if (grid[position] !== undefined) return 2;

    grid[position] = symbol;
    return 0;
  };

  const clear = () => grid.splice(0, grid.length);

  const getGrid = () => grid;

  const getSize = () => size;

  return { add, clear, getGrid, getSize };
})();

const player = (name, symbol) => {
  let score = 0;
  let isAI = false;

  const getName = () => name;

  const getSymbol = () => symbol;

  const getScore = () => score;

  const addPoint = () => {
    score += 1;
  };

  const isAutomated = () => isAI;

  const toggleAI = () => {
    isAI = !isAI;
  };

  return { getName, getSymbol, getScore, addPoint, isAutomated, toggleAI };
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

  const toggleAI = () => {
    player2.toggleAI();
  };

  const switchPlayer = () => {
    if (player1 === currentPlayer) {
      currentPlayer = player2;
    } else {
      currentPlayer = player1;
    }
  };

  const runAI = () => {
    const grid = gameBoard.getGrid();
    let index = 0;
    const gameBoardSize = gameBoard.getSize();

    while (grid[index] && grid.length !== gameBoardSize) {
      index = Math.floor(Math.random() * gameBoardSize);
    }

    return index;
  };

  const checkWinner = () => {
    const grid = gameBoard.getGrid();

    // TODO: Refractor
    let result = '';
    let filledCellsCount = 0;
    const gridSize = gameBoard.getSize();
    for (let index = 0; index < gridSize; index += 1) {
      switch (Number(index)) {
        case 0:
          if (grid[0] && grid[1] && grid[2]) {
            if (grid[0] === grid[1] && grid[1] === grid[2]) {
              result = 'win';
              break;
            }
          }

          if (grid[0] && grid[3] && grid[6]) {
            if (grid[0] === grid[3] && grid[3] === grid[6]) {
              result = 'win';
              break;
            }
          }

          if (grid[0] && grid[4] && grid[8]) {
            if (grid[0] === grid[4] && grid[4] === grid[8]) {
              result = 'win';
              break;
            }
          }

          break;
        case 1:
          if (grid[1] && grid[4] && grid[7]) {
            if (grid[1] === grid[4] && grid[4] === grid[7]) {
              result = 'win';
              break;
            }
          }

          break;
        case 2:
          if (grid[2] && grid[4] && grid[6]) {
            if (grid[2] === grid[4] && grid[4] === grid[6]) {
              result = 'win';
              break;
            }
          }

          if (grid[2] && grid[5] && grid[8]) {
            if (grid[2] === grid[5] && grid[5] === grid[8]) {
              result = 'win';
              break;
            }
          }

          break;
        case 3:
          if (grid[3] && grid[4] && grid[5]) {
            if (grid[3] === grid[4] && grid[4] === grid[5]) {
              result = 'win';
              break;
            }
          }

          break;
        case 6:
          if (grid[6] && grid[7] && grid[8]) {
            if (grid[6] === grid[7] && grid[7] === grid[8]) {
              result = 'win';
              break;
            }
          }

          break;
        default:
          break;
      }

      if (grid[index]) {
        filledCellsCount += 1;
      }
    }

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
    currentPlayer = player1;
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

    if (currentPlayer.isAutomated()) {
      return playRound(runAI());
    }

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
    toggleAI,
  };
})();

const displayController = (() => {
  const board = document.querySelectorAll('.cell');
  const message = document.querySelector('.message');
  const newGameButton = document.querySelector('#new-game');
  const addPlayersButtons = document.querySelector('#add-players');
  const playersForm = document.querySelector('#players-form');
  const confirmPlayersButton = document.querySelector('#confirm-players');
  const player1Field = document.querySelector('#player1-name');
  const player2Field = document.querySelector('#player2-name');
  const toggleAIButton = document.querySelector('#toggle-ai');

  const setMessage = (text) => {
    message.textContent = text;
  };

  const toggleAI = () => {
    game.toggleAI();
    const text = toggleAIButton.textContent;
    toggleAIButton.textContent =
      text === 'Enable AI' ? 'Disable AI' : 'Enable AI';
  };

  const togglePlayersForm = () => {
    playersForm.classList.toggle('hidden');
  };

  const confirmPlayers = (e) => {
    e.preventDefault();
    game.setPlayer1(player1Field.value, 'X');
    game.setPlayer2(player2Field.value, 'O');
    togglePlayersForm();
  };

  const lockBoard = () => {
    Object.keys(board).forEach((cell) => {
      board[cell].classList.add('locked');
    });
  };

  const unlockBoard = () => {
    Object.keys(board).forEach((cell) => {
      board[cell].classList.remove('locked');
    });
  };

  const startNewGame = () => {
    game.reset();
    setMessage('Playing');
    displayController.render();
    unlockBoard();
  };

  const markCell = (e) => {
    const cellClicked = e.target.dataset.indexNumber;
    const [result, hasEnded] = game.playRound(cellClicked);
    setMessage(result);
    displayController.render();
    if (hasEnded) {
      lockBoard();
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

  const setConfirmPlayersEvent = () => {
    confirmPlayersButton.addEventListener('click', confirmPlayers);
  };

  const setToggleAIEvent = () => {
    toggleAIButton.addEventListener('click', toggleAI);
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
  setConfirmPlayersEvent();
  setToggleAIEvent();

  return { render };
})();
