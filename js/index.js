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
  const players = [];

  const addPlayer = (name, symbol) => {
    if (players.length >= 2) return 1;

    players.push(player(name, symbol));
    return 0;
  };

  const clearPlayers = () => {
    players.splice(0, players.length);
  };

  const reset = () => {
    gameBoard.clear();
    clearPlayers();
  };

  return { addPlayer, reset };
})();
