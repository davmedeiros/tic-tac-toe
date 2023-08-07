const Player = (name, symbol) => {
    return { name, symbol };
}

const GameBoard = (() => {
    const BOARD_SIZE = 9;
    const board = Array(BOARD_SIZE).fill('');
    const getBoard = () => board;

    const markCell = (index, symbol) => {
        board[index] = symbol;
    }

    return { getBoard, markCell };
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

        if (board[0] && board[0] === board[1] && board[1] === board[2] ||
            board[3] && board[3] === board[4] && board[4] === board[5] ||
            board[6] && board[6] === board[7] && board[7] === board[8]) {
            console.log('Winner');
        }
    }

    return { switchPlayer, getCurrentPlayer, checkForWinner }
})();

const DisplayController = (() => {
    const board = document.querySelector('#board');

    const markCell = (cell, symbol) => {
        GameBoard.markCell(cell.target.dataset.indexNumber, symbol);
        cell.target.textContent = symbol;
    }

    const showBoard = () => {
        GameBoard.getBoard().forEach((value, index) => {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.indexNumber = index;

            cell.addEventListener('click', (cell) => {
                markCell(cell, Game.getCurrentPlayer().symbol);
                Game.checkForWinner();
                Game.switchPlayer();
            })

            cell.textContent = value;
            board.appendChild(cell);
        })
    }

    return { showBoard };
})();

DisplayController.showBoard();
