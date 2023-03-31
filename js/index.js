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
  let isAI = false;

  const getName = () => name;

  const getSymbol = () => symbol;

  const isAutomated = () => isAI;

  const toggleAI = () => {
    isAI = !isAI;
  };

  return { getName, getSymbol, isAutomated, toggleAI };
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
    gameBoard.add(position, currentPlayer.getSymbol());
  };

  const getCurrentPlayer = () => currentPlayer;

  const reset = () => {
    gameBoard.clear();
    currentPlayer = player1;
  };

  const playRound = (index) => {
    markCell(index);
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

  setPlayer1('Player 1', 'X');
  setPlayer2('Player 2', 'O');

  return {
    setPlayer1,
    setPlayer2,
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
