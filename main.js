const gameController = (() => {
  // gameboard module
  const gameboard = (() => {
    const resetBoard = () => {
      return [[null, null, null], [null, null, null], [null, null, null]];
    }

    const board = resetBoard();

    const checkAvailable = () => {
      availableSquares = [];

      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          if (board[i][j] == null) {
            availableSquares.push({row: i, col: j});
          }
        }
      }

      return availableSquares;
    }

    const render = (node, mark) => {
      node.textContent = mark;
    }

    const move = (row, column, player) => {
      if (!board[row][column]) {
        board[row][column] = player.mark;
        render(grid.children[row].children[column], player.mark);
        return true;
      }
      return false;
    }

    return { move, checkAvailable };
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

  const checkPlayerTurn = () => {
    return players[0].playerTurn;
  }

  // code for turns
  const computerMove = (emptySquares) => {
    index = Math.floor(Math.random() * emptySquares.length);
    console.log(emptySquares.length, index);
    row = emptySquares[index].row;
    col = emptySquares[index].col;

    gameboard.move(
      row,
      col,
      players[1],
      grid.children[row].children[col]
    );
  }

  const togglePlayer = (players) => {
    players[0].playerTurn = !players[0].playerTurn
    players[1].playerTurn = !players[1].playerTurn
  }

  const turn = (row, column) => {
    if (gameboard.move(row, column, players[0])) {
      togglePlayer(players);

      computerMove(gameboard.checkAvailable());
      togglePlayer(players);
    }
  }

  return { setPlayers, checkPlayerTurn, turn };
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
        if (gameController.checkPlayerTurn()) {
          gameController.turn(e.target.dataset.row, e.target.dataset.col);
        }
      });

      row.append(square);
    }
    grid.append(row);
  }

  gameController.setPlayers("playerOne", "X");
}
