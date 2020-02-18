const gameController = (() => {
  // gameboard module
  const gameboard = (() => {
    const resetBoard = () => {
      return [[null, null, null], [null, null, null], [null, null, null]];
    }

    const board = resetBoard();

    const resetGame = () => {
      board = resetBoard();
    }

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

    const render = (square, mark) => {
      square.textContent = mark;
    }

    const disableSquare = (square) => {
      square.classList.remove("playable");
      square.removeEventListener("click", handleClick);
    }

    const updateGameboard = (row, column, player) => {
      board[row][column] = player.mark;
    }

    // check for winners or a draw
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
        return (checkRows() || checkColumns() || checkDiagonals());
      } else if (checkAvailable().length == 0) {
        return "draw";
      }
    }

    // deal with moves
    const move = (row, column, player) => {
      if (!board[row][column]) {
        updateGameboard(row, column, player);
        disableSquare(grid.children[row].children[column]);
        render(grid.children[row].children[column], player.mark);
        if (checkGameOver()) {
          // prevents any further moves
          // player.playerTurn = false;
          return false;
        }
        return true;
      }
      return false;
    }

    const computerMove = (emptySquares) => {
      if (emptySquares[0]) {
        index = Math.floor(Math.random() * emptySquares.length);
        row = emptySquares[index].row;
        col = emptySquares[index].col;

        move(row, col, players[1]);
      }
    }

    return { checkAvailable, move, computerMove };
  })();

  // display functions
  const makeAllPlayable = (boardElement) => {
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        boardElement.children[i].children[j].classList.add("playable");
      }
    }
  }

  const clearBoard = (boardElement) => {
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        boardElement.children[i].children[j].textContent = "";
      }
    }
  }

  const disableBoard = (boardElement) => {
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        boardElement.children[i].children[j].classList.remove("playable");
      }
    }
  }

  // code for players
  const Player = (name, mark, playerTurn) => {
    return { name, mark, playerTurn };
  }

  const players = [];

  const setPlayers = (name, mark) => {
    if (players.length > 0) {
      players[0].mark = mark;
      players[1].mark = (mark == "X" ? "O" : "X");
    } else {
      players.push(
        Player(name, mark, true)
      );
      players.push(
        Player("computer", (players[0].mark == "X" ? "O" : "X"), false)
      );
    }
  }

  // const checkPlayerTurn = () => {
  //   return players[0].playerTurn;
  // }

  // start game
  const startGame = (player, mark, boardElement) => {
    setPlayers(player, mark);
    makeAllPlayable(boardElement);
  }

  // end game
  const endGame = (boardElement) => {
    disableBoard(boardElement);
  }

  // code for turns
  // const togglePlayer = () => {
  //   console.log(players[0].playerTurn);
  //   players[0].playerTurn = (players[0].playerTurn ? false : true);
  //   players[1].playerTurn = (players[1].playerTurn ? false : true);
  //   console.log(players[0].playerTurn);
  // }

  const turn = (row, column) => {
    if (gameboard.move(row, column, players[0])) {
      // togglePlayer(players);
      // delay the computer move to make gameplay seem more natural
      window.setTimeout(
        () => { gameboard.computerMove(gameboard.checkAvailable()) },
        750
      );
      // togglePlayer(players);
    }
  }

  return { startGame, endGame, turn }
  // return { startGame, endGame, checkPlayerTurn, turn };
})();

const handleClick = (e) => {
  // if (gameController.checkPlayerTurn()) {
  //   gameController.turn(e.target.dataset.row, e.target.dataset.col);
  // }
  gameController.turn(e.target.dataset.row, e.target.dataset.col);
}


window.onload = () => {
  const grid = document.getElementById('grid');
  const reset = document.getElementById("reset-button");

  // draw the grid
  for (let i = 0; i < 3; i++) {
    let row = document.createElement('div');
    row.classList.add('row');

    for (let j = 0; j < 3; j++) {
      let square = document.createElement('div');
      square.classList.add('square');
      square.dataset.row = i;
      square.dataset.col = j;

      square.addEventListener("click", handleClick);

      row.append(square);
    }
    grid.append(row);
  }

  document.getElementById("x-button").addEventListener("click", (e) => {
    e.target.parentNode.classList.add("hidden");
    gameController.startGame("player", e.target.dataset.mark, grid);
  });

  document.getElementById("o-button").addEventListener("click", (e) => {
    e.target.parentNode.classList.add("hidden");
    gameController.startGame("player", e.target.dataset.mark, grid);
  });

  reset.addEventListener("click", () => {
    reset.classList().toggle("hidden");
    document.getElementById("x-button").classList().toggle("hidden");
    document.getElementById("o-button").classList().toggle("hidden");
  });

}
