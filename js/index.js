const Player = (name, symbol) => {
    return { name, symbol };
}

const GameBoard = (() => {
    const BOARD_SIZE = 9;
    let board = Array(BOARD_SIZE).fill('');
    const getBoard = () => board;

    const markCell = (index, symbol) => {
        board[index] = symbol;
    }

    const clear = () => {
        board = board.map(value => value = '');
    }

    return { getBoard, markCell, clear };
})();

const Game = (() => {
    let player1 = Player('Player 1', 'X');
    let player2 = Player('Player 2', 'O');
    let currentPlayer = player1;

    const switchPlayer = () => {
        currentPlayer = player1 === currentPlayer ? player2 : player1;
    }

    const getCurrentPlayer = () => currentPlayer;

    const checkForWinner = () => {
        const board = GameBoard.getBoard();
        let winner = '';

        if (board[0] && board[0] === board[1] && board[1] === board[2] ||
            board[3] && board[3] === board[4] && board[4] === board[5] ||
            board[6] && board[6] === board[7] && board[7] === board[8] ||
            board[0] && board[0] === board[4] && board[4] === board[8] ||
            board[6] && board[6] === board[4] && board[4] === board[2] ||
            board[0] && board[0] === board[3] && board[3] === board[6] ||
            board[1] && board[1] === board[4] && board[4] === board[7] ||
            board[2] && board[2] === board[5] && board[5] === board[8]) {
            winner = Game.getCurrentPlayer();
        }

        return winner;
    }

    const reset = () => {
        GameBoard.clear();
    }

    const checkForTie = () => {
        const board = GameBoard.getBoard();
        return board.every(value => value !== '');
    }

    return { switchPlayer, getCurrentPlayer, checkForWinner, reset, checkForTie }
})();

const DisplayController = (() => {
    const board = document.querySelector('#board');
    const message = document.querySelector('#message')

    const markCell = (cell, symbol) => {
        GameBoard.markCell(cell.target.dataset.indexNumber, symbol);
        cell.target.textContent = symbol;
    }

    const lockBoard = () => {
        const cells = document.querySelectorAll('.cell');
        cells.forEach(cell => {
            cell.removeEventListener('click', playRound);
        });
    }

    const playRound = (cell) => {
        markCell(cell, Game.getCurrentPlayer().symbol);
    
        if (Game.checkForWinner()) {
            message.textContent = `${Game.getCurrentPlayer().name} won the game`;
            lockBoard();
        } else if (Game.checkForTie()) {
            message.textContent = `It's a tie`;
        } else {
            Game.switchPlayer();
            message.textContent = `${Game.getCurrentPlayer().name}'s turn`
        }
    }

    const showBoard = () => {
        GameBoard.getBoard().forEach((value, index) => {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.indexNumber = index;
            cell.addEventListener('click', playRound, { once: true })
            cell.textContent = value;
            board.appendChild(cell);
        })
    }

    const clearBoard = () => {
        while (board.firstChild) {
            board.removeChild(board.firstChild);
        }
    }

    const startGame = () => {
        Game.reset();
        clearBoard();
        showBoard();
    }

    const addBehaviorToControls = () => {
        const start = document.querySelector('#start');
        start.addEventListener('click', startGame);
    }

    showBoard();
    addBehaviorToControls();
})();
