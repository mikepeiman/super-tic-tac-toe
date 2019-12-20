<script>
  import { onMount } from "svelte";

  $: testValue = "test value";
  $: lastTicked = {};
  $: rows = 3;
  $: columns = 3;
  $: size = 24;
  $: gutter = 0;
  $: currentPlayer = players[0];
  $: movesPerTurn = 2;
  $: cellsToScore = 3;
  $: movesRemaining = 0;
  $: turn = 0;
  $: gameHistory = [];
  $: turnHistory = [];
  $: clickCount = 0;
  $: moveNumber = 0;
  $: gameboardMapped = [];
  $: tickedArray = [];
  $: lines = {
    leftToRight: {},
    topToBottom: {},
    diagonalDownLeft: {},
    diagonalDownRight: {}
  };
  $: numberOfPlayers = 2;
  $: players = [
    {
      id: 0,
      name: "Kaya",
      moves: 0
    },
    {
      id: 1,
      name: "Mike",
      moves: 0
    }
  ];

  onMount(() => {
    renderGameBoard(rows, columns, size, gutter);
    movesRemaining = movesPerTurn;
  });

  function reset() {
    localStorage.setItem("gameboard", "");
    localStorage.setItem("gameHistory", "");
    localStorage.setItem("gameboardMapped", "");
    columns = document.getElementById("columns").value;
    rows = document.getElementById("rows").value;
    size = document.getElementById("size").value;
    gutter = document.getElementById("gutter").value;
    renderGameBoard(rows, columns, size, gutter);
  }

  function triggerGameBoardUpdate(e) {
    reset();
    e.target.style.width = `${e.target.value.toString().length + 0.5}ch`;
    localStorage.setItem("gameHistory", []);
  }

  function updateGameSettings() {
    movesRemaining = movesPerTurn;
  }

  // I think my method for scoring will be this:
  //  1. when generating gameboard, create an set of arrays indexed with the same IDs
  //     these arrays cover the horizontal, vertical, and the two diagonal directions: 4 sets of lines
  //  2. As moves are made, mark which player occupied each cell in the arrays
  //  3. whenever scoring function is called, it loops through each array of arrays and counts up the points based on
  //     a user-set minimum scoring length
  function countPoints() {
          console.log(`******* COUNT POINTS ******** ******* ************ *********** ******* ************`);
    gameboardMapped.forEach(move => {
        move.player ? console.log(`square ${move.id} owned by player: ${move.player.name}`) : console.log(`no move here ${move.id}`)
        console.log(`move: `, move)

    });
            // let id = `R${row}C${column}`;
    // let move = getPlayerFromCell(id)
    // console.log(`move property id`, move.id)
    // console.log(`nextSquareFrom, move `, move)

    
    localStorage.setItem("gameboard", JSON.stringify(gameboardMapped));
  }

  function test() {
    console.log(
      "TEST --------------------------------------------------------------------------------%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%"
    );

    gameboardMapped.forEach(obj => {
      console.log(`gameboardMapped.forEach: R${obj.row}C${obj.col}`);
      console.log(obj);
    });
    // console.log(`typeof gameboardMapped`,typeof gameboardMapped)
    // console.log(`Object.prototype.toString.call(gameboardMapped) == '[object Array]';`, Object.prototype.toString.call(gameboardMapped) == '[object Array]')
    let filtered = gameboardMapped;
    gameHistory.forEach(turnSet => {
      turnSet.forEach(cell => {
        console.log(`cell.squareId: `, cell.squareId);
        filtered = filtered.filter(square => {
          console.log(`square.id: `, square.id);
          return !(cell.squareId == square.id);
        });
      });
    });

    console.log(`filtered `, gameHistory, filtered);
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
      console.log(`post-if loop REMOVE removePlayerMove mapped move`, move);
      localStorage.setItem("gameboardMapped", JSON.stringify(gameboardMapped));
    });
  }

  function getPlayerFromCell(id) {
    console.log(`getPlayerFromCell called for ${id}`)
    gameboardMapped.forEach(move => {
      // console.log(`getPlayerFromCell move, move.id ${move.id}`, move)
      if (move.id == id) {
        console.log(`getPlayerFromCell move, move.id ${move.id} MATCH MATCH MATCH MATCH MATCH MATCH MATCH`)
        return move
      }
    });
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
    localStorage.setItem('diagonalDownLeft', JSON.stringify(lines.diagonalDownLeft))
    localStorage.setItem('diagonalDownRight', JSON.stringify(lines.diagonalDownRight))
    localStorage.setItem('topToBottom', JSON.stringify(lines.topToBottom))
    localStorage.setItem('leftToRight', JSON.stringify(lines.leftToRight))
  }

  function makeLinesFrom(direction) {
    let start,
      pattern = {};
    let theseLines = [],
      newLine = [];

    if (direction.id == 1) {
      console.log(" ************ LeftToRight ********************");

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
      console.log(" ************ TopToBottom ********************");

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
      console.log(" ************ diagonalDownRight ********************");

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
      console.log(`typeof theseLines structure 1`, typeof theseLines);
      console.log(
        `typeof diagonalDownRight structure 1`,
        typeof lines.diagonalDownRight
      );
      lines.diagonalDownRight.array = theseLines;
      console.log(
        `typeof diagonalDownRight structure 2`,
        typeof lines.diagonalDownRight.array
      );
    }

    if (direction.id == 4) {
      console.log(" ************ diagonalDownLeft ********************");
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

  async function makeLineFrom(start, pattern) {
    let line = [];
    let nextLine = await nextSquareFrom(
      start.row,
      start.column,
      pattern.row,
      pattern.column,
      line
    );
    return nextLine;
  }

  async function nextSquareFrom(row, column, rowChange, columnChange, line) {
    // the following line is crucial to refactoring to use the gameboardMapped and gameHistory arrays to build our scoring arrays
    // I'll need to replace that de novo object with a copy of the object from gameboardMapped

    // also, need to add a function to complete turn (and execute associated functions) with fewer than assigned moves per turn,
    // if it is the last move of the game. Can check length of gameHistory against gameboardMapped.

    // console.log(`nextSquareFrom R${row}C${column} ${id}`);

    line = [...line, { row: row, column: column }];
    let nextRow = row + rowChange;
    let nextColumn = column + columnChange;
    let nextSquare = { row: nextRow, column: nextColumn };

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
    let gameboard = document.getElementById("game-board");
    while (gameboard.firstChild) {
      gameboard.removeChild(gameboard.firstChild);
    }
    console.log(`rows: ${rows} columns: ${columns}`);
    for (let rowNum = 0; rowNum < rows; rowNum++) {
      console.log(`row: ${rowNum}`);
      let row = document.createElement("div");
      row.classList = "game-row";
      gameboard.appendChild(row);
      // gameboardMapped.push([]);

      for (let colNum = 0; colNum < columns; colNum++) {
        console.log(`row: ${rowNum} column: ${colNum}`);
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
        cell["player"] = null;
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
      console.log(
        `turnHistory already contains this move - that means we should remove it!`
      );
      turnHistory = turnHistory.filter(turn => turn.squareId !== id);
    } else {
      console.log(
        `apparently we have not made this move yet, let's add it to turnHistory`
      );
      turnHistory = [...turnHistory, move];
    }
    console.log(turnHistory);
  }

  function setGameHistory(square) {
    gameHistory = [...gameHistory, turnHistory];
    turnHistory.forEach((turn, index) => {
      let move = document.getElementById(`${turn.squareId}`);
      let thisMoveNum = moveNumber - movesPerTurn + index + 1;
      console.log(
        `############### setGameHistory, locking moves ${turn.squareId}`
      );
      move.setAttribute("locked", true);
      turn.move = thisMoveNum;
      move.classList.add("locked");
      move.style.border = "1px solid rgba(0,0,0,0.5)";
    });
    turnHistory = [];
    localStorage.setItem("gameHistory", JSON.stringify(gameHistory));
  }

  function playMove(e) {
    clickCount++;
    let square = e.target;
    let ticked = square.dataset.ticked == "true";
    console.log(
      `ticked status ::: ${ticked} ::: movesRemaining ||| ${movesRemaining} |||`
    );

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

    if (currentPlayer.id == 0) {
      console.log(`currentPlayer.id == 0`);
      square.setAttribute("data-marker", "X");
      square.setAttribute("player-id", currentPlayer.id);
      square.setAttribute("player-name", currentPlayer.name);
      square.style = "--custom-bg: #abf";
      // square.setAttribute("data-background-color", "rgba(255, 150, 150, 0.75)");
    } else {
      square.setAttribute("data-marker", "O");
      square.setAttribute("player-id", currentPlayer.id);
      square.setAttribute("player-name", currentPlayer.name);
      square.style = "--custom-bg: #fab";
      // square.setAttribute("data-background-color", "rgba(150, 255, 150, 0.75)");
    }
    // square.style.border = "1px solid rgba(255,100,155,1)"
    //  square.style.background = "rgba(150, 150, 255, 0.75)"
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
    let gameboard = document.getElementById("game-board");
    gameboard.classList.add("player-change");
    setTimeout(() => {
      gameboard.classList.remove("player-change");
    }, 250);
    let playerIndicator = document.querySelector(".player-indicator");
    playerIndicator.classList.remove(`player-${currentPlayer.id}`);

    currentPlayer.id == 0
      ? (currentPlayer = players[1])
      : (currentPlayer = players[0]);
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
  .main {
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

  .game-board {
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
  }

  #next-turn-button {
    background: rgba(55, 255, 155, 0.5);
    &:hover {
      background: rgba(55, 255, 155, 0.75);
    }
  }
  #restart-game-button {
    background: rgba(255, 55, 155, 0.5);
    &:hover {
      background: rgba(255, 55, 155, 0.75);
    }
  }
  #save-game-button {
    background: rgba(155, 55, 255, 0.5);
    &:hover {
      background: rgba(155, 55, 255, 0.75);
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
  .buttons-wrapper button {
    // display: none;
    // visibility: hidden;
  }
</style>

<h1>Tic Tac Toe</h1>
<!-- {#each lines.diagonalDownRight as line, index}
Line: {index + 1} | Squares: 
{#each line as square}
  {square.row},{square.column} --- <span></span>
{/each}
<br>
{/each}
{lines.leftToRight} {lines.topToBottom}
{lines.diagonalDownLeft} {lines.diagonalDownRight} -->
<div class="main">
  <div class="player-indicator player-0">
    <h2 class="player-indicator-heading">Player {currentPlayer.name}</h2>
    <h2 class="player-indicator-heading">Turn Moves: {movesRemaining}</h2>
    <h2 class="player-indicator-heading">Total Moves: {moveNumber}</h2>

    <div class="buttons-wrapper">
      <button id="next-turn-button">End turn</button>
      <button id="tally-game-button" on:click={countPoints}>
        Tally points
      </button>
      <button id="test-scoring-button" on:click={test}>TEST</button>
      <button id="reset-game-button" on:click={reset}>Reset game</button>
      <button id="save-game-button">Save game</button>
    </div>
  </div>

  <h2>Layout and Game Options</h2>
  <div class="form-wrap">

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

  <div id="game-board" class="game-board" />
</div>
