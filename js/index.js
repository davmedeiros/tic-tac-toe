const GameBoard = (() => {
    const BOARD_SIZE = 9;
    const board = Array(BOARD_SIZE).fill('');
    const getBoard = () => board;
    return { getBoard };
})();


