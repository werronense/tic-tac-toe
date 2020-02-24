const gameController = (() => {
  // gameboard module
  const gameboard = (() => {
    const resetBoard = () => {
      return [[null, null, null], [null, null, null], [null, null, null]];
    }

    let gameState = resetBoard();

    const resetGame = () => {
      gameState = resetBoard();
    }

    const checkAvailable = (board) => {
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
      square.removeEventListener("click", handleSquareClick);
    }

    const updateGameboard = (row, column, player) => {
      gameState[row][column] = player.mark;
    }

    // check for winners or a draw
    const checkThreeSquares = (array) => {
      return array.reduce((a, b) => a == b && a);
    }

    const checkRows = (board) => {
      return (
        checkThreeSquares(board[0]) ||
        checkThreeSquares(board[1]) ||
        checkThreeSquares(board[2])
      )
    }

    const checkColumns = (board) => {
      return (
        checkThreeSquares([board[0][0], board[1][0], board[2][0]]) ||
        checkThreeSquares([board[0][1], board[1][1], board[2][1]]) ||
        checkThreeSquares([board[0][2], board[1][2], board[2][2]])
      )
    }

    const checkDiagonals = (board) => {
      return (
        checkThreeSquares([board[0][0], board[1][1], board[2][2]]) ||
        checkThreeSquares([board[2][0], board[1][1], board[0][2]])
      )
    }

    const checkGameOver = (board) => {
      if (checkAvailable(board).length == 0) {
        return (
          (checkRows(board) || checkColumns(board) || checkDiagonals(board)) ||
          "draw"
        );
      } else if (checkAvailable(board).length < 7) {
        return (
          checkRows(board) || checkColumns(board) || checkDiagonals(board)
        );
      }
    }

    // deal with moves
    const move = (row, column, player, gameOver) => {
      if (!gameState[row][column]) {
        updateGameboard(row, column, player);
        disableSquare(grid.children[row].children[column]);
        render(grid.children[row].children[column], player.mark);

        let gameResult = checkGameOver(gameState);

        if (gameResult) {
          if (gameResult == "draw") {
            updateScore(draws);
          } else {
            updateScore(
              (player.name == "player" ? playerScore : computerScore)
            );
          }
          gameOver(grid);
          return false;
        }
        return true;
      }
      return false;
    }

    const computerMove = (gameOver) => {
      let emptySquares = checkAvailable(gameState)
      if (emptySquares[0]) {
        index = Math.floor(Math.random() * emptySquares.length);
        row = emptySquares[index].row;
        col = emptySquares[index].col;

        move(row, col, players.computer, gameOver);
      }
    }

    return { move, computerMove, resetGame };
  })();

  // display variables, functions, and event handlers
  let grid;
  let playerScore;
  let draws;
  let computerScore;
  let reset;
  let chooseX;
  let chooseO;

  const initializeScoreboard = () => {
    playerScore = document.getElementById("player-score");
    playerScore.textContent = "Player: 0";

    draws = document.getElementById("draws");
    draws.textContent = "Draws: 0";

    computerScore = document.getElementById("computer-score");
    computerScore.textContent = "Computer: 0";
  }

  const updateScore = (score) => {
    score.textContent = score.textContent.split(" ")[0] + " " +
      (parseInt(score.textContent.split(" ")[1]) + 1);
  }

  const handleSquareClick = (e) => {
    turn(e.target.dataset.row, e.target.dataset.col);
  }

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

        square.addEventListener("click", handleSquareClick);

        row.append(square);
      }
      grid.append(row);
    }
  }

  const handleButtonClick = (e) => {
    chooseX.classList.toggle("hidden");
    chooseO.classList.toggle("hidden");
    startGame("player", e.target.dataset.mark, grid);
  }

  const initializeChoiceButton = (id) => {
    if (id[0] == "x") {
      chooseX = document.getElementById(id);
      chooseX.addEventListener("click", handleButtonClick);
    } else if (id[0] == "o") {
      chooseO = document.getElementById(id);
      chooseO.addEventListener("click", handleButtonClick);
    }
  }

  const handleResetClick = (e) => {
    e.target.classList.toggle("hidden");
    document.getElementById("x-button").classList.toggle("hidden");
    document.getElementById("o-button").classList.toggle("hidden");
    gameboard.resetGame();
    clearBoard(grid);
  }

  const initializeResetButton = () => {
    reset = document.getElementById("reset-button");
    reset.addEventListener("click", handleResetClick);
  }

  const initialize = () => {
    if (!grid && !reset) {
      initializeScoreboard();
      createBoardHtml();
      initializeChoiceButton("x-button");
      initializeChoiceButton("o-button");
      initializeResetButton();
      console.log("initialized");
    } else {
      console.log("already initialized");
    }
  }

  const makeAllPlayable = (boardElement) => {
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        boardElement.children[i].children[j].classList.add("playable");
        boardElement.children[i].children[j]
          .addEventListener("click", handleSquareClick);
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
          .removeEventListener("click", handleSquareClick);
      }
    }
  }

  // code for players
  const Player = (name, mark) => {
    return { name, mark };
  }

  const players = {};

  let currentPlayer;

  const setPlayers = (name, mark) => {
    if (Object.keys(players).length > 0) {
      players.human.mark = mark;
      players.computer.mark = (mark == "X" ? "O" : "X");
    } else {
      players.human = Player(name, mark);
      players.computer =
        Player("computer", (players.human.mark == "X" ? "O" : "X"));
    }
  }

  // start game
  const startGame = (player, mark, boardElement) => {
    setPlayers(player, mark);
    currentPlayer = players.human;
    makeAllPlayable(boardElement);
  }

  // end game
  const endGame = (boardElement) => {
    disableBoard(boardElement);
    currentPlayer = null;
    reset.classList.toggle("hidden");
  }

  const turn = (row, column) => {
    if (currentPlayer == players.human) {
      if (gameboard.move(row, column, players.human, endGame)) {
        currentPlayer = players.computer;
        // delay the computer move to make gameplay seem more natural
        window.setTimeout(
          () => { gameboard.computerMove(endGame) },
          750
        );
        // temporary solution to timing issue
        window.setTimeout(() => {
          currentPlayer = players.human;
        }, 750);
      }
    }
  }

  return { initialize };
})();


window.onload = () => {
  gameController.initialize();
}
