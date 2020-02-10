const gameController = (() => {
  // gameboard module
  const gameboard = (() => {
    const resetBoard = () => {
      return [[null, null, null], [null, null, null], [null, null, null]];
    }

    const board = resetBoard();

    const render = (node, mark) => {
      node.textContent = mark;
    }

    const move = (row, column, player, node) => {
      if (!board[row][column]) {
        board[row][column] = player.mark;
        render(node, player.mark)
        // console.log(board); // TEMP
      }
    }

    return { move };
  })();

  // code for players
  const Player = (name, mark, playerTurn) => {
    return { name, mark, playerTurn };
  }

  const players = [];

  const setPlayers = (name, mark) => {
    players.push(Player(name, mark, true));
    players.push(Player("computer", players[0].mark == "X" ? "O" : "X"), false);
  }

  const computerMove = () => {
    //
  }

  // code for turns
  const togglePlayer = (players) => {
    players[0].playerTurn = !players[0].playerTurn
    players[1].playerTurn = !players[1].playerTurn
  }

  const turn = (row, column, node) => {
    gameboard.move(row, column, players[0], node);
    togglePlayer(players);
    // update this so that computer chooses its own move after player
    gameboard.move(0, 1, players[1], grid.children[0].children[1]);
    togglePlayer(players);
  }

  return { setPlayers, turn };
})();


window.onload = () => {
  const grid = document.getElementById('grid');

  // draw the grid
  for (let i = 0; i < 3; i++) {
    let row = document.createElement('div');
    row.classList.add('row');

    for (let j = 0; j < 3; j++) {
      let square = document.createElement('div');
      square.classList.add('square');
      square.dataset.row = i;
      square.dataset.col = j;

      square.addEventListener("click", (e) => {
        console.log({ row: e.target.dataset.row, col: e.target.dataset.col });
        gameController.turn(
          e.target.dataset.row,
          e.target.dataset.col,
          e.target
        );
      });

      row.append(square);
    }
    grid.append(row);
  }

  gameController.setPlayers("playerOne", "X");
}
