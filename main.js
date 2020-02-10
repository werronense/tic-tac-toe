const Player = (name, mark) => {
  return { name, mark };
}


const gameController = (() => {
  // gameboard module
  const gameboard = (() => {
    const resetBoard = () => {
      return [[null, null, null], [null, null, null], [null, null, null]];
    }

    const board = resetBoard();

    const move = (row, column, player) => {
      if (!board[row][column]) {
        board[row][column] = player.mark;
        console.log(board); // TEMP
      }
    }

    return { move };
  })();

  const players = [];

  const setPlayers = (name, mark) => {
    players.push(Player(name, mark));
    players.push(Player("computer", players[0].mark == "x" ? "o" : "x"));
  }

  const turn = (row, column) => {
    gameboard.move(row, column, players[0]);
    // update this so that computer chooses its own move after player
    gameboard.move(0, 1, players[1]);
  }

  return { setPlayers, turn };
})();


function render() {
  //
}


// TEMP:
gameController.setPlayers("playerOne", "x");
gameController.turn(0, 2);
