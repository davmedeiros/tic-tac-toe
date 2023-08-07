const GameBoard = (() => {
    const BOARD_SIZE = 9;
    const board = Array(BOARD_SIZE).fill('');
    const getBoard = () => board;

    const markCell = (index, symbol) => {
        board[index] = symbol;
    }

    return { getBoard, markCell };
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
                markCell(cell, 'X');
            })

            cell.textContent = value;
            board.appendChild(cell);
        })
    }

    return { showBoard };
})();

DisplayController.showBoard();
