const gameboard = (() => {
  const board = [[null, null, null], [null, null, null], [null, null, null]];

  const resetBoard = () => {
    return [[null, null, null], [null, null, null], [null, null, null]];
  }

  const move = (row, column, player) => {
    if (!board[row][column]) {
      board[row][column] = player.mark;
      console.log(board); // TEMP
    }
  }

  return { move };
})();


const gameController = (() => {
  // resume here
})();


const Player = (name, mark) => {
  return { name, mark };
}


function render() {
  // 
}


// TEMP:
const playerOne = Player("playerOne", "x");
const playerTwo = Player("playerTwo", "o");

gameboard.move(0, 0, playerOne);
gameboard.move(0, 1, playerTwo);
