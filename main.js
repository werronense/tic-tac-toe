const gameController = (() => {
  // gameboard module
  const gameboard = (() => {
    const resetBoard = () => {
      return [[null, null, null], [null, null, null], [null, null, null]];
    }

    const resetGame = () => {
      console.log("reset game");
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

    const updateGameboard = (row, column, player) => {
      board[row][column] = player.mark;
    }

    const checkThreeSquares = (array) => {
      return array.reduce((a, b) => a == b && a);
    }

    const checkRows = () => {
      return (
        checkThreeSquares(board[0]) ||
        checkThreeSquares(board[1]) ||
        checkThreeSquares(board[2])
      )
    }

    const checkColumns = () => {
      return (
        checkThreeSquares([board[0][0], board[1][0], board[2][0]]) ||
        checkThreeSquares([board[0][1], board[1][1], board[2][1]]) ||
        checkThreeSquares([board[0][2], board[1][2], board[2][2]])
      )
    }

    const checkDiagonals = () => {
      return (
        checkThreeSquares([board[0][0], board[1][1], board[2][2]]) ||
        checkThreeSquares([board[2][0], board[1][1], board[0][2]])
      )
    }

    const checkGameOver = () => {
      if (checkAvailable().length < 7) {
        return (
          checkRows() ||
          checkColumns() ||
          checkDiagonals()
        );
      } else if (checkAvailable().length == 0) {
        return "draw";
      }
    }

    const move = (row, column, player) => {
      if (!board[row][column]) {
        updateGameboard(row, column, player);
        render(grid.children[row].children[column], player.mark);
        if (checkGameOver()) {
          console.log(checkGameOver());
        }
        return true;
      }
      return false;
    }

    const computerMove = (emptySquares) => {
      if (emptySquares[0]) {
        index = Math.floor(Math.random() * emptySquares.length);
        console.log(emptySquares.length, index);
        row = emptySquares[index].row;
        col = emptySquares[index].col;

        move(row, col, players[1]);
      }
    }

    return { checkAvailable, move, computerMove };
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
  const togglePlayer = (players) => {
    players[0].playerTurn = !players[0].playerTurn
    players[1].playerTurn = !players[1].playerTurn
  }

  const turn = (row, column) => {
    if (gameboard.move(row, column, players[0])) {
      togglePlayer(players);

      gameboard.computerMove(gameboard.checkAvailable());
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

  document.getElementById("x-button").addEventListener("click", (e) => {
    e.target.parentNode.classList.add("hidden");
    gameController.setPlayers("player", e.target.dataset.mark);
  });

  document.getElementById("o-button").addEventListener("click", (e) => {
    e.target.parentNode.classList.add("hidden");
    gameController.setPlayers("player", e.target.dataset.mark);
  });

}
