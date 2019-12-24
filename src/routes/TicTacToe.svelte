<script>
  import { onMount } from "svelte";

  $: numberOfPlayers = 3;
  $: hueDeg = 360 / numberOfPlayers;
  $: rows = 4;
  $: columns = 4;
  $: size = 24;
  $: gutter = 0;
  $: currentPlayer = {};
  $: currentPlayerId = 0;
  $: movesPerTurn = 3;
  $: cellsToScore = 3;
  $: bonusForCompleteRow = 5;
  $: movesRemaining = 0;
  $: turn = 0;
  $: lastTicked = {};
  $: gameHistory = [];
  $: turnHistory = [];
  $: clickCount = 0;
  $: moveNumber = 0;
  $: gameboardMapped = [];
  $: tickedArray = [];
  $: scoredPlayers = [
    {
      id: 0,
      name: "Player 0",
      totalScore: 0,
      bgColor: `hsla(60, 50%, 50%, .75)`,
      moves: 0,
      scores: [
        {
          id: 1,
          name: "Horizontal",
          src: "tictactoe-horizontal.png",
          lines: lines.leftToRight,
          scoringLines: [],
          dirScore: 0,
          iconSrc: "tictactoe-horizontal.png"
        },
        {
          id: 2,
          name: "Vertical",
          src: "tictactoe-horizontal.png",
          lines: lines.topToBottom,
          scoringLines: [],
          dirScore: 0,
          iconSrc: "tictactoe-vertical.png"
        },
        {
          id: 3,
          name: "Diagonal (down left)",
          src: "tictactoe-horizontal.png",
          lines: lines.diagonalDownLeft,
          scoringLines: [],
          dirScore: 0,
          iconSrc: "tictactoe-diagonal-down-left.png"
        },
        {
          id: 4,
          name: "Diagonal (down right)",
          src: "tictactoe-horizontal.png",
          lines: lines.diagonalDownRight,
          scoringLines: [],
          dirScore: 0,
          iconSrc: "tictactoe-diagonal-down-right.png"
        }
      ]
    },
    {
      id: 1,
      name: "Player 1",
      totalScore: 0,
      bgColor: `hsla(120, 50%, 50%, .75)`,
      moves: 0,
      scores: [
        {
          id: 1,
          name: "Horizontal",
          src: "tictactoe-horizontal.png",
          lines: lines.leftToRight,
          scoringLines: [],
          dirScore: 0,
          iconSrc: "tictactoe-horizontal.png"
        },
        {
          id: 2,
          name: "Vertical",
          src: "tictactoe-horizontal.png",
          lines: lines.topToBottom,
          scoringLines: [],
          dirScore: 0,
          iconSrc: "tictactoe-vertical.png"
        },
        {
          id: 3,
          name: "Diagonal (down left)",
          src: "tictactoe-horizontal.png",
          lines: lines.diagonalDownLeft,
          scoringLines: [],
          dirScore: 0,
          iconSrc: "tictactoe-diagonal-down-left.png"
        },
        {
          id: 4,
          name: "Diagonal (down right)",
          src: "tictactoe-horizontal.png",
          lines: lines.diagonalDownRight,
          scoringLines: [],
          dirScore: 0,
          iconSrc: "tictactoe-diagonal-down-right.png"
        }
      ]
    }
  ];
  $: players = [
    {
      id: 0,
      name: "Kaya",
      totalScore: 0,
      bgColor: `hsla(60, 50%, 50%, .75)`,
      moves: 0,
      scores: [
        {
          id: 1,
          name: "Horizontal",
          src: "tictactoe-horizontal.png",
          lines: lines.leftToRight,
          scoringLines: [],
          dirScore: 0,
          iconSrc: "tictactoe-horizontal.png"
        },
        {
          id: 2,
          name: "Vertical",
          src: "tictactoe-horizontal.png",
          lines: lines.topToBottom,
          scoringLines: [],
          dirScore: 0,
          iconSrc: "tictactoe-vertical.png"
        },
        {
          id: 3,
          name: "Diagonal (down left)",
          src: "tictactoe-horizontal.png",
          lines: lines.diagonalDownLeft,
          scoringLines: [],
          dirScore: 0,
          iconSrc: "tictactoe-diagonal-down-left.png"
        },
        {
          id: 4,
          name: "Diagonal (down right)",
          src: "tictactoe-horizontal.png",
          lines: lines.diagonalDownRight,
          scoringLines: [],
          dirScore: 0,
          iconSrc: "tictactoe-diagonal-down-right.png"
        }
      ]
    },
    {
      id: 1,
      name: "Mike",
      totalScore: 0,
      bgColor: `hsla(120, 50%, 50%, .75)`,
      moves: 0,
      scores: [
        {
          id: 1,
          name: "Horizontal",
          src: "tictactoe-horizontal.png",
          lines: lines.leftToRight,
          scoringLines: [],
          dirScore: 0,
          iconSrc: "tictactoe-horizontal.png"
        },
        {
          id: 2,
          name: "Vertical",
          src: "tictactoe-horizontal.png",
          lines: lines.topToBottom,
          scoringLines: [],
          dirScore: 0,
          iconSrc: "tictactoe-vertical.png"
        },
        {
          id: 3,
          name: "Diagonal (down left)",
          src: "tictactoe-horizontal.png",
          lines: lines.diagonalDownLeft,
          scoringLines: [],
          dirScore: 0,
          iconSrc: "tictactoe-diagonal-down-left.png"
        },
        {
          id: 4,
          name: "Diagonal (down right)",
          src: "tictactoe-horizontal.png",
          lines: lines.diagonalDownRight,
          scoringLines: [],
          dirScore: 0,
          iconSrc: "tictactoe-diagonal-down-right.png"
        }
      ]
    }
  ];
  $: lines = {
    leftToRight: [],
    topToBottom: [],
    diagonalDownLeft: [],
    diagonalDownRight: []
  };
  $: scores = [];

  onMount(() => {
    initializePlayers();
    renderGameBoard(rows, columns, size, gutter);
    movesRemaining = movesPerTurn;
    scoredPlayers = players;
    currentPlayer = scoredPlayers[0];
    localStorage.setItem(`currentPlayer`, JSON.stringify(currentPlayer));
  });

  function reset() {
    localStorage.setItem("gameboard", "");
    localStorage.setItem("gameHistory", "");
    localStorage.setItem("gameboardMapped", "");
    localStorage.setItem("diagonalDownLeft", "");
    localStorage.setItem("diagonalDownRight", "");
    localStorage.setItem("topToBottom", "");
    localStorage.setItem("leftToRight", "");
    columns = document.getElementById("columns").value;
    rows = document.getElementById("rows").value;
    size = document.getElementById("size").value;
    gutter = document.getElementById("gutter").value;
    renderGameBoard(rows, columns, size, gutter);
  }

  function initializePlayers() {
    players = [];
    // let hueDeg = 360 / numberOfPlayers;
    for (let i = 0; i < numberOfPlayers; i++) {
      console.log(
        `initializePlayers: bgColor hue ${(i + 1) * (360 / numberOfPlayers)}`
      );
      players = [
        ...players,
        {
          id: 0,
          name: `Player ${i + 1}`,
          totalScore: 0,
          bgColor: `hsla(${(i + 1) * (360 / numberOfPlayers)}, 50%, 50%, .75)`,
          moves: 0,
          scores: [
            {
              id: 1,
              name: "Horizontal",
              src: "tictactoe-horizontal.png",
              lines: lines.leftToRight,
              scoringLines: [],
              dirScore: 0,
              iconSrc: "tictactoe-horizontal.png"
            },
            {
              id: 2,
              name: "Vertical",
              src: "tictactoe-horizontal.png",
              lines: lines.topToBottom,
              scoringLines: [],
              dirScore: 0,
              iconSrc: "tictactoe-vertical.png"
            },
            {
              id: 3,
              name: "Diagonal (down left)",
              src: "tictactoe-horizontal.png",
              lines: lines.diagonalDownLeft,
              scoringLines: [],
              dirScore: 0,
              iconSrc: "tictactoe-diagonal-down-left.png"
            },
            {
              id: 4,
              name: "Diagonal (down right)",
              src: "tictactoe-horizontal.png",
              lines: lines.diagonalDownRight,
              scoringLines: [],
              dirScore: 0,
              iconSrc: "tictactoe-diagonal-down-right.png"
            }
          ]
        }
      ];
    }
    scoredPlayers = players;
    localStorage.setItem("generatedPlayers", JSON.stringify(scoredPlayers));
  }

  function modifyNumberOfPlayers() {
    initializePlayers();
    console.log(`number of player ${numberOfPlayers}`);
  }

  function triggerGameBoardUpdate(e) {
    reset();
    e.target.style.width = `${e.target.value.toString().length + 0.5}ch`;
    localStorage.setItem("gameHistory", []);
  }

  function updateGameSettings() {
    movesRemaining = movesPerTurn;
  }

  function countPoints() {
    localStorage.setItem("gameboard", JSON.stringify(gameboardMapped));

    players.forEach(player => {
      player.scores.forEach(direction => {
        direction["dirScore"] = score(direction, player);
        player["totalScore"] += direction["dirScore"];
        localStorage.setItem(
          `${direction.name}`,
          JSON.stringify(`lines.${direction.name}`)
        );
      });
    });

    scoredPlayers = players;
    lines = lines;

    localStorage.setItem(`players`, "");
    localStorage.setItem(`players`, JSON.stringify(players));
  }

  function score(direction, player) {
    // $: cellsToScore
    // console.log(`score called with direction `, direction);

    let dirLines = [];
    let dirScore = 0;
    let name = direction.name;

    direction.lines.forEach((line, index) => {
      let countInLine = 0;
      let countInLoop = 0;
      let points = 0;
      line.forEach(cell => {
        let p = getPlayerFromCell(cell.id);
        cell.player = {
          name: p.name,
          id: p.id
        };
        if (p.name !== "none" && p.id === player.id) {
          countInLoop++;
        }
        if (p.id !== player.id) {
          if (countInLoop >= cellsToScore) {
            points += countInLoop - (cellsToScore - 1);
          }
          countInLine += countInLoop;
          countInLoop = 0;
        }
      });
      if (countInLoop >= cellsToScore) {
        points += countInLoop - (cellsToScore - 1);
      }
      dirLines.push({ countInLine: countInLine, points: points });
      dirScore += points;
    });
    player["score"] += dirScore;
    // setIcon(direction);
    return dirScore;
  }

  function setPlayerMove(squareId) {
    gameboardMapped.forEach(move => {
      if (move.id == squareId) {
        console.log(`if(move.id == squareId) ${squareId}`);
        move.player = {
          id: currentPlayer.id,
          name: currentPlayer.name
        };
        move.move = moveNumber;
      }
    });
    localStorage.setItem("gameboardMapped", JSON.stringify(gameboardMapped));
  }

  function removePlayerMove(squareId) {
    gameboardMapped.forEach(move => {
      if (move.id == squareId) {
        console.log(`if(move.id == squareId) ${squareId}`);
        move.player = {
          id: null,
          name: null
        };
        move.move = null;
      }
      localStorage.setItem("gameboardMapped", JSON.stringify(gameboardMapped));
    });
  }

  function getPlayerFromCell(id) {
    let payload;
    gameboardMapped.forEach(move => {
      if (move.id == id) {
        payload = move.player;
      }
    });
    return payload;
  }

  function createDirectionArrays() {
    let leftToRight = {
      id: 1
    };
    let topToBottom = {
      id: 2
    };
    let diagonalDownRight = {
      id: 3
    };
    let diagonalDownLeft = {
      id: 4
    };
    makeLinesFrom(leftToRight);
    makeLinesFrom(topToBottom);
    makeLinesFrom(diagonalDownRight);
    makeLinesFrom(diagonalDownLeft);
    localStorage.setItem(
      "diagonalDownLeft",
      JSON.stringify(lines.diagonalDownLeft)
    );
    localStorage.setItem(
      "diagonalDownRight",
      JSON.stringify(lines.diagonalDownRight)
    );
    localStorage.setItem("topToBottom", JSON.stringify(lines.topToBottom));
    localStorage.setItem("leftToRight", JSON.stringify(lines.leftToRight));
  }

  function makeLinesFrom(direction) {
    let start,
      pattern = {};
    let theseLines = [],
      newLine = [];

    if (direction.id == 1) {
      start = { row: 0, column: 0 };
      pattern = { row: 0, column: +1 };

      for (let i = 0; i < columns; i++) {
        newLine = makeLineFrom(start, pattern);
        start.row++;
        theseLines.push(newLine);
      }
      lines.leftToRight = theseLines;
    }

    if (direction.id == 2) {
      start = { row: 0, column: 0 };
      pattern = { row: +1, column: 0 };

      for (let i = 0; i < columns; i++) {
        newLine = makeLineFrom(start, pattern);
        start.column++;
        theseLines.push(newLine);
      }
      lines.topToBottom = theseLines;
    }

    if (direction.id == 3) {
      start = { row: rows, column: 0 };
      pattern = { row: +1, column: +1 };

      for (let i = 0; i < rows; i++) {
        start.row--;
        newLine = makeLineFrom(start, pattern);
        theseLines.push(newLine);
      }

      start = { row: 0, column: 1 };
      pattern = { row: +1, column: +1 };

      for (let i = 1; i < columns; i++) {
        newLine = makeLineFrom(start, pattern);
        start.column++;
        theseLines.push(newLine);
      }
      lines.diagonalDownRight = theseLines;
    }

    if (direction.id == 4) {
      start = { row: rows, column: columns - 1 };
      pattern = { row: +1, column: -1 };

      for (let i = 0; i < columns; i++) {
        start.row--;
        newLine = makeLineFrom(start, pattern);
        theseLines.push(newLine);
      }

      start = { row: 0, column: columns - 1 };
      pattern = { row: +1, column: -1 };

      for (let i = 1; i < columns; i++) {
        start.column--;
        newLine = makeLineFrom(start, pattern);
        theseLines.push(newLine);
      }
      lines.diagonalDownLeft = theseLines;
    }
  }

  function makeLineFrom(start, pattern) {
    let line = [];
    let nextLine = nextSquareFrom(
      start.row,
      start.column,
      pattern.row,
      pattern.column,
      line
    );
    return nextLine;
  }

  function nextSquareFrom(row, column, rowChange, columnChange, line) {
    line = [
      ...line,
      {
        id: `R${row}C${column}`,
        row: row,
        column: column,
        player: { id: null, name: "none" }
      }
    ];
    let nextRow = row + rowChange;
    let nextColumn = column + columnChange;
    let nextSquare = {
      row: nextRow,
      column: nextColumn,
      player: { id: null, name: "none" }
    };

    if (nextRow >= rows) {
      return line;
    }
    if (nextColumn >= columns || nextColumn < 0) {
      return line;
    }

    nextSquare = nextSquareFrom(
      nextRow,
      nextColumn,
      rowChange,
      columnChange,
      line
    );
    return nextSquare;
  }

  function renderGameBoard(rows, columns, size, gutter) {
    gameboardMapped = [];
    let gameboard = document.getElementById("gameboard-board");
    while (gameboard.firstChild) {
      gameboard.removeChild(gameboard.firstChild);
    }
    console.log(`rows: ${rows} columns: ${columns}`);
    for (let rowNum = 0; rowNum < rows; rowNum++) {
      console.log(`row: ${rowNum}`);
      let row = document.createElement("div");
      row.classList = "game-row";
      gameboard.appendChild(row);

      for (let colNum = 0; colNum < columns; colNum++) {
        // console.log(`row: ${rowNum} column: ${colNum}`);
        let square = document.createElement("div");
        square.classList = "game-square";
        square.style = "--custom-bg: rgba(150, 150, 255, 0.75)";
        square.style.margin = gutter + "px";
        square.style.width = size + "px";
        square.style.height = size + "px";
        square.id = `R${rowNum}C${colNum}`;
        let cell = {};
        cell["id"] = `R${rowNum}C${colNum}`;
        cell["row"] = rowNum;
        cell["col"] = colNum;
        cell["player"] = {
          id: "none",
          name: "none"
        };
        gameboardMapped = [...gameboardMapped, cell];
        square.setAttribute("data-ticked", false);
        square.setAttribute("data-marker", "X");

        row.appendChild(square);
        square.addEventListener("click", () => playMove(event));
      }
    }
    createDirectionArrays();
  }

  function setTurnHistory(square) {
    let move = {};
    let id = square.id;
    move["move"] = moveNumber;
    move["squareId"] = square.id;
    move["clickCount"] = clickCount;
    move["player"] = {
      id: currentPlayer.id,
      name: currentPlayer.name
    };
    if (turnHistory.filter(turn => turn.squareId == id).length > 0) {
      // console.log(
      //   `turnHistory already contains this move - that means we should remove it!`
      // );
      turnHistory = turnHistory.filter(turn => turn.squareId !== id);
    } else {
      // console.log(
      //   `apparently we have not made this move yet, let's add it to turnHistory`
      // );
      turnHistory = [...turnHistory, move];
    }
    console.log(turnHistory);
  }

  function setGameHistory(square) {
    gameHistory = [...gameHistory, turnHistory];
    turnHistory.forEach((turn, index) => {
      let move = document.getElementById(`${turn.squareId}`);
      let thisMoveNum = moveNumber - movesPerTurn + index + 1;
      // console.log(
      //   `############### setGameHistory, locking moves ${turn.squareId}`
      // );
      move.setAttribute("locked", true);
      turn.move = thisMoveNum;
      move.classList.add("locked");
      move.style.border = "1px solid rgba(0,0,0,0.5)";
    });
    turnHistory = [];
    localStorage.setItem("gameHistory", JSON.stringify(gameHistory));
  }

  function playMove(e) {
    // localStorage.setItem(`currentPlayer`, JSON.stringify(currentPlayer));
    clickCount++;
    let square = e.target;
    let ticked = square.dataset.ticked == "true";
    // console.log(
    //   `ticked status ::: ${ticked} ::: movesRemaining ||| ${movesRemaining} |||`
    // );

    if (ticked) {
      if (!square.hasAttribute("locked")) {
        setTurnHistory(square);
        untickThis(square);
        removePlayerMove(square.id);
        moveNumber--;
      } else {
        console.log(`It seems you tried to untick a locked move!`);
      }
    } else {
      if (movesRemaining == 1) {
        moveNumber++;
        setTurnHistory(square);
        setGameHistory();
        tickThis(square);
        setPlayerMove(square.id);
        playerChange();
        return;
      }
      moveNumber++;
      setTurnHistory(square);
      tickThis(square);
      setPlayerMove(square.id);
      movesRemaining--;
    }
    // console.log("playMove call from square click");
    // console.log(square);
  }

  function tickThis(square) {
    console.log("tickThis(square)");
    let id = square.id;
    let row = id[1];
    let column = id[3];
    lastTicked = {
      row: row,
      column: column,
      playerId: currentPlayer.id,
      playerName: currentPlayer.name
    };
    square.classList.add("ticked");
    // addToScoringArray(square);
    square.dataset.ticked = true;
    square.setAttribute("data-marker", "X");
    square.setAttribute("player-id", currentPlayer.id);
    square.setAttribute("player-name", currentPlayer.name);
    square.style = `--custom-bg: ${currentPlayer.bgColor}`;
  }

  function untickThis(square) {
    console.log(`------------untickThis(square)`);
    square.classList.remove("ticked");
    square.style = "--custom-bg: rgba(150, 150, 255, 0.75)";
    square.dataset.ticked = false;
    square.removeAttribute("player-id");
    square.removeAttribute("player-name");
    // removeFromScoringArray(square)
    movesRemaining++;
  }

  function playerChange() {
    let gameboard = document.getElementById("gameboard-board");
    gameboard.classList.add("player-change");
    setTimeout(() => {
      gameboard.classList.remove("player-change");
    }, 250);
    let playerIndicator = document.querySelector(".player-indicator");
    playerIndicator.classList.remove(`player-${currentPlayer.id}`);
    players = players
    scoredPlayers = scoredPlayers
    // !currentPlayer ? currentPlayer = players[0] : currentPlayer
    let id = currentPlayer.id;
    let nextId = id++;
    console.log(
      `playerChange function, scoredPlayers.length ${scoredPlayers.length} currentPlayer.id ${id}, nextId ${nextId}`
    );
    console.log(`numberOfPlayers global var: ${numberOfPlayers}`)
    console.log(scoredPlayers);
    console.log(players);
    console.log(currentPlayer);

    currentPlayerId === numberOfPlayers - 1 ? currentPlayerId = 0 : currentPlayerId++
    currentPlayer = scoredPlayers[currentPlayerId]
    // if (id < scoredPlayers.length - 1) {
    //   console.log(
    //     `currentPlayer.id ${id} < scoredPlayers.length - 1 ${scoredPlayers.length -
    //       1}`
    //   );
    //   currentPlayer = scoredPlayers[nextId];
    //   console.dir(currentPlayer);
    // } else {
    //   console.log(
    //     `currentPlayer.id not less than numberOfPlayers, will be reset to scoredPlayers[0]`
    //   );
    //   currentPlayer = scoredPlayers[0];
      console.dir(currentPlayer);
    // }

    // currentPlayer.id == 0
    //   ? (currentPlayer = players[1])
    //   : (currentPlayer = players[0]);
    movesRemaining = movesPerTurn;

    console.log(`playerIndicator`, playerIndicator);
    playerIndicator.classList.add(`player-${currentPlayer.id}`);
  }

  function setWidthByChars(e) {
    console.log(`setWidthByChars called`, e.target.style.width);
    // let len = e.target.value.toString().length
    e.target.style.width = `${e.target.value.toString().length + 0.5}ch`;
    console.log(e.target.style.width);
  }
</script>

<style lang="scss" global>
  .page-container {
    display: grid;
    grid-template-columns: 1fr 4fr;
  }

  .gameboard-container {
    background: #1a1a1a;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    color: #eee;
    justify-content: start;
    align-items: start;
    height: 90vh;
    overflow: hidden;
  }

  .player-status-bar {
    width: 100%;
    display: flex;
    justify-content: space-between;
    background: rgba(155, 55, 255, 0.75);
  }

  $title-margin: 1rem;
  $title-padding-horizontal: 1rem;
  $title-padding-vertical: 0.5rem;
  $calc-padding: 2 * $title-padding-horizontal;

  .player-indicator {
    width: calc(100% - (2 * #{$title-padding-horizontal}));
    transition: all 0.5s;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
    padding: $title-padding-vertical $title-padding-horizontal;
    border-radius: 5px;
    border-bottom: 5px solid rgba(0, 255, 155, 0.85);

    &.player-0 {
      background: rgba(0, 255, 155, 0.5);
    }
    &.player-1 {
      background: rgba(255, 0, 155, 0.5);
    }
    & h2 {
      margin: 0;
    }
  }

  // .player-indicator-heading {
  //   background: #1a1a1a;
  //   transition: all .5s;
  // }

  .form-wrap {
    display: flex;
    // align-items: flex-start;

    justify-content: space-between;
    // flex-direction: column;
    width: 100%;
    & label {
      display: flex;
      align-items: center;
      // justify-self: flex-end;
      margin: 0.5rem;
      padding: 0.5rem;
      background: rgba(255, 255, 255, 0.25);
      & input {
        // margin-left: 1rem;
      }
    }
  }

  input {
    background: none;
    border: none;
    color: rgba(50, 200, 255, 1);
    font-family: "Muli";
    font-size: 1.1rem;
    padding-left: 0.25rem;
    width: 5ch;
    border-bottom: 1px solid rgba(50, 200, 255, 1);
    margin: 0.5rem;
    justify-self: flex-end;
  }

  input[type="number"]::-webkit-inner-spin-button,
  input[type="number"]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  input[type="number"] {
    -moz-appearance: textfield;
  }

  .gameboard-board {
    margin: 2rem;
    display: flex;
    flex-direction: column;
    align-self: center;
    border: 0px solid none;
  }

  .game-row {
    display: flex;
  }

  .game-square {
    width: 24px;
    height: 24px;
    background: var(--custom-bg); // rgba(150, 150, 255, 0.75);
    border: 1px solid black;
    display: flex;
    justify-content: center;
    align-items: center;
    &:hover {
      background: rgba(150, 150, 255, 0.5);
    }
  }
  .ticked {
    &.unlocked {
      border: 1px solid red;
    }
    &:hover {
      background: rgba(150, 150, 255, 0.5);
    }
    &::after {
      content: attr(data-marker);
      justify-self: center;
      align-self: center;
      background: attr(data-background-color);
    }
  }

  .player-change {
    transition: all 0.25s;
    // border: 50px solid red;
    background: rgba(155, 255, 155, 1);
  }

  button {
    padding: 1rem;
    border-radius: 3px;
    border: none;
    color: white;
    background: rgba(55, 255, 155, 0.5);
    &:hover {
      background: rgba(0, 25, 75, 1);
    }
  }

  .locked {
    opacity: 0.75;
    border: 1px solid rgba(0, 0, 0, 0.5);
    &::before {
      background: #000;
      display: block;
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: -2;
      opacity: 1;
    }
  }

  .control-button {
    background: rgba(0, 25, 75, 0.25);
    margin: 0.25rem;
    &:hover {
      background: rgba(0, 25, 75, 0.5);
    }
  }
  .dir-1 {
    display: flex;
    flex-direction: column;
  }
  .scores-wrap {
    display: flex;
    flex-direction: column;
    background: #1a1a1a;
  }
  .scores-block {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
  }
  .scores-section {
    display: flex;
    flex-direction: column;
  }

  .scoreboard-container {
    // position: absolute;
    // left: 0;
    background: rgba(0, 0, 155, 0.1);
  }
  .scoreboard-headings {
    background: rgba(0, 0, 155, 0.1);
  }
  .scoreboard-totals {
    background: rgba(0, 0, 155, 0.1);
  }
  .scoreboard-direction {
    background: rgba(0, 0, 155, 0.1);
    display: flex;
  }

  .direction-icon {
    margin-left: 0.5rem;
    // background: #1a1a1a;
  }
  .direction-score-section {
    display: flex;
    justify-content: space-between;
    width: 100%;
  }
  .direction-score {
    justify-self: flex-end;
    margin-right: 0.5rem;
  }
</style>

<h1>Tic Tac Toe</h1>
<div class="page-container">
  <div class="scoreboard-container">
    {#each scoredPlayers as player}
      <div class="scoreboard-totals">
        <h3 class="total-score">{player.name}: {player.totalScore}</h3>
        <div class="scoreboard-player">
          {#each player.scores as direction, i}
            <div class="scoreboard-direction">
              <div class="direction-score-section">
                <img
                  class="direction-icon"
                  src={direction.iconSrc}
                  width="25"
                  alt="icon for direction" />
                <div class="direction-name">{direction.name}:</div>
                <div class="direction-score">{direction.dirScore}</div>
              </div>
            </div>
          {/each}
        </div>
      </div>
    {/each}
  </div>

  <div class="gameboard-container">
    <div class="player-indicator player-0">
      <h2 class="player-indicator-heading">Player: {currentPlayer.name}</h2>
      <h2 class="player-indicator-heading">Turn Moves: {movesRemaining}</h2>
      <h2 class="player-indicator-heading">Total Moves: {moveNumber}</h2>

      <div class="buttons-wrapper">
        <button class="control-button" id="next-turn-button">End turn</button>
        <button
          class="control-button"
          id="tally-game-button"
          on:click={countPoints}>
          Tally points
        </button>
        <button class="control-button" id="reset-game-button" on:click={reset}>
          Reset game
        </button>
        <button class="control-button" id="save-game-button">Save game</button>
      </div>
    </div>

    <h2>Layout and Game Options</h2>
    <div class="form-wrap">
      <label for="players">
        # Of Players:
        <input
          id="players"
          name="players"
          type="number"
          placeholder={numberOfPlayers}
          bind:value={numberOfPlayers}
          on:input={initializePlayers}
          style="width: 2.5ch;" />
      </label>
      <label for="rows">
        Rows:
        <input
          id="rows"
          name="rows"
          type="number"
          placeholder={rows}
          value={rows}
          on:input={triggerGameBoardUpdate}
          style="width: 2.5ch;" />
      </label>
      <label for="columns">
        Columns:
        <input
          id="columns"
          name="columns"
          type="number"
          placeholder={columns}
          value={columns}
          on:input={triggerGameBoardUpdate}
          style="width: 2.5ch;" />
      </label>
      <label for="size">
        Square size (px):
        <input
          id="size"
          name="size"
          type="number"
          placeholder="24"
          value={size}
          step="4"
          on:input={triggerGameBoardUpdate}
          style="width: 2.5ch;" />
      </label>
      <label for="gutter">
        Gutter (px):
        <input
          id="gutter"
          name="gutter"
          type="number"
          placeholder={gutter}
          value={gutter}
          on:input={triggerGameBoardUpdate}
          style="width: 1.5ch;" />
      </label>
      <label for="movesPerTurn">
        Moves Per Turn:
        <input
          id="movesPerTurn"
          name="movesPerTurn"
          type="number"
          placeholder={movesPerTurn}
          bind:value={movesPerTurn}
          on:input={updateGameSettings}
          style="width: 1.5ch;" />
      </label>

    </div>
    <!-- 
    <div class="form-wrap">
      <h2>GAME OPTIONS</h2>
  
    </div> -->

    <div id="gameboard-board" class="gameboard-board" />
  </div>

</div>
