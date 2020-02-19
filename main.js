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
    const move = (row, column, player, gameOver) => {
      if (!board[row][column]) {
        updateGameboard(row, column, player);
        disableSquare(grid.children[row].children[column]);
        render(grid.children[row].children[column], player.mark);
        if (checkGameOver()) {
          gameOver(grid);
          return false;
        }
        return true;
      }
      return false;
    }

    const computerMove = (emptySquares, gameOver) => {
      if (emptySquares[0]) {
        index = Math.floor(Math.random() * emptySquares.length);
        row = emptySquares[index].row;
        col = emptySquares[index].col;

        move(row, col, players[1], gameOver);
      }
    }

    return { checkAvailable, move, computerMove };
  })();

  // display variables and functions
  let grid;
  let reset;

  const createBoardHtml = () => {
    grid = document.getElementById("grid");

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
  }

  const handleButtonClick = (e) => {
    e.target.parentNode.classList.add("hidden");
    gameController.startGame("player", e.target.dataset.mark, grid);
  }

  const initializeChoiceButton = (id) => {
    document.getElementById(id).addEventListener("click", handleButtonClick);
  }

  const handleResetClick = (e) => {
    reset.classList().toggle("hidden");
    document.getElementById("x-button").classList().toggle("hidden");
    document.getElementById("o-button").classList().toggle("hidden");
  }

  const initializeResetButton = () => {
    reset = document.getElementById("reset-button");
    reset.addEventListener("click", handleResetClick);
  }

  const initialize = () => {
    if (!grid && !reset) {
      createBoardHtml();
      initializeChoiceButton("x-button");
      initializeChoiceButton("o-button");
      initializeResetButton();
      console.log("initialized");
    } else {
      console.log("already initialized");
    }
  }

  const handleClick = (e) => {
    gameController.turn(e.target.dataset.row, e.target.dataset.col);
  }

  const makeAllPlayable = (boardElement) => {
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        boardElement.children[i].children[j].classList.add("playable");
        boardElement.children[i].children[j]
          .addEventListener("click", handleClick);
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
        boardElement.children[i].children[j]
          .removeEventListener("click", handleClick);
      }
    }
  }

  // code for players
  const Player = (name, mark, playerTurn) => {
    return { name, mark, playerTurn };
  }

  const players = [];

  let currentPlayer;

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

  // start game
  const startGame = (player, mark, boardElement) => {
    setPlayers(player, mark);
    currentPlayer = players[0];
    makeAllPlayable(boardElement);
  }

  // end game
  const endGame = (boardElement) => {
    disableBoard(boardElement);
    currentPlayer = null;
    console.log("game over");
  }

  const turn = (row, column) => {
    if (currentPlayer == players[0]) {
      if (gameboard.move(row, column, players[0], endGame)) {
        currentPlayer = players[1];
        // delay the computer move to make gameplay seem more natural
        window.setTimeout(
          () => { gameboard.computerMove(gameboard.checkAvailable(), endGame) },
          750
        );
        // temporary solution to timing issue
        window.setTimeout(() => {
          currentPlayer = players[0];
        }, 750);
      }
    }
  }

  return { initialize, startGame, endGame, turn }
})();

const handleClick = (e) => {
  gameController.turn(e.target.dataset.row, e.target.dataset.col);
}


window.onload = () => {
  gameController.initialize();
}
