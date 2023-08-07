const GameBoard = (() => {
    const BOARD_SIZE = 9;
    const board = Array(BOARD_SIZE).fill('');
    const getBoard = () => board;

    const markCell = (cell, symbol) => {
        board[cell] = symbol;
    }

    return { getBoard, markCell };
})();

const DisplayController = (() => {
    const board = document.querySelector('#board');

    const markCell = (cell, symbol) => {
        GameBoard.markCell(cell, symbol);
        cell.target.textContent = symbol;
    }

    const showBoard = () => {
        GameBoard.getBoard().forEach(value => {
            const cell = document.createElement('div');
            cell.classList.add('cell');

            cell.addEventListener('click', (cell) => {
                markCell(cell, 'X');
            })

            cell.textContent = value;
            board.appendChild(cell);
        })
    }

    return { showBoard };
})();

DisplayController.showBoard();
