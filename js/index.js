const GameBoard = (() => {
    const BOARD_SIZE = 9;
    const board = Array(BOARD_SIZE).fill('');
    const getBoard = () => board;
    return { getBoard };
})();

const DisplayController = (() => {
    const board = document.querySelector('#board');

    const showBoard = () => {
        GameBoard.getBoard().forEach(value => {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.textContent = value;
            board.appendChild(cell);
        })
    }

    return { showBoard };
})();
