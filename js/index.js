// Game board module
const gameBoard = (() => {
  const grid = [];
  const size = 9;

  const init = () => {
    grid.fill(undefined, 0, size);
  };

  const add = (position, symbol) => {
    if (!Number.isInteger(Number(position))) return 1;

    if (position < 0 || position > size - 1) return 2;

    if (grid[position] !== undefined) return 3;

    grid[position] = symbol;
    return 0;
  };

  const clear = () => grid.splice(0, grid.length);

  const getGrid = () => grid;

  const getSize = () => size;

  init();

  return { add, clear, getGrid, getSize };
})();

// Player factory
const player = (name, symbol) => {
  let isAI = false;

  const getName = () => name;

  const getSymbol = () => symbol;

  const isAutomated = () => isAI;

  const toggleAI = () => {
    isAI = !isAI;
  };

  return { getName, getSymbol, isAutomated, toggleAI };
};

// Game logic module
const game = (() => {
  let player1 = {};
  let player2 = {};
  let currentPlayer = {};

  const init = (p1 = player('Player 1', 'X'), p2 = player('Player 2', 'O')) => {
    player1 = p1;
    player2 = p2;
    currentPlayer = player1;
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
    // TODO: Design proper AI algorithm to make it challenging
    const grid = gameBoard.getGrid();
    let index = 0;
    const gameBoardSize = gameBoard.getSize();

    while (grid[index] && !grid.includes('')) {
      index = Math.floor(Math.random() * gameBoardSize);
    }

    return index;
  };

  const checkWinner = () => {
    const grid = gameBoard.getGrid();
    let isWinner = false;
    let isTie = false;
    const winningCombos = [
      [0, 1, 2],
      [0, 3, 6],
      [0, 4, 8],
      [1, 4, 7],
      [2, 4, 6],
      [2, 5, 8],
      [3, 4, 5],
      [6, 7, 8],
    ];

    winningCombos.forEach((c) => {
      if (
        grid[c[0]] &&
        grid[c[0]] === grid[c[1]] &&
        grid[c[1]] === grid[c[2]]
      ) {
        isWinner = true;
      }
    });

    if (
      !grid.includes(undefined) &&
      grid.length === gameBoard.getSize() &&
      !isWinner
    ) {
      isTie = true;
    }

    return [isWinner, isTie];
  };

  const markCell = (position) => {
    const status = gameBoard.add(position, currentPlayer.getSymbol());
    return status;
  };

  const getCurrentPlayer = () => currentPlayer;

  const reset = () => {
    gameBoard.clear();
    currentPlayer = player1;
  };

  const playRound = (index) => {
    const status = markCell(index);

    if (status) return ['Cell already checked', false];

    const [isWinner, isTie] = checkWinner();

    if (isWinner) {
      return [`${currentPlayer.getName()} won`, true];
    }

    if (isTie) {
      return [`It's a tie`, true];
    }

    switchPlayer();

    if (currentPlayer.isAutomated()) {
      return playRound(runAI());
    }

    return [`${currentPlayer.getName()}'s turn`, false];
  };

  init();

  return {
    init,
    getCurrentPlayer,
    playRound,
    reset,
    toggleAI,
  };
})();

// Display controller module
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
    const p1 = player(player1Field.value, 'X');
    const p2 = player(player2Field.value, 'O');
    game.init(p1, p2);
    togglePlayersForm();
  };

  const lockBoard = () => {
    Object.keys(board).forEach((cell) => {
      board[cell].classList.add('locked');
      board[cell].classList.remove('keep-color');
    });
  };

  const unlockBoard = () => {
    Object.keys(board).forEach((cell) => {
      board[cell].classList.remove('locked');
    });
  };

  const lockCell = (cell) => {
    cell.classList.add('locked', 'keep-color');
  };

  const startNewGame = () => {
    game.reset();
    setMessage('Playing');
    displayController.render();
    unlockBoard();
  };

  const markCell = (e) => {
    const cellClicked = e.target;
    const [result, hasEnded] = game.playRound(cellClicked.dataset.indexNumber);
    lockCell(cellClicked);
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
