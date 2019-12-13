<script>
  import { onMount } from "svelte";

  $: rows = 4;
  $: columns = 4;
  $: size = 24;
  $: gutter = 0;
  $: currentPlayer = 0;
  $: movesPerTurn = 4;
  $: movesRemaining = 0;
  $: turn = 0;
  $: gameHistory = [];
  $: turnHistory = [];
  $: clickCount = 0;
  $: moveNumber = 0;

  onMount(() => {
    renderGameBoard(rows, columns, size, gutter);
    movesRemaining = movesPerTurn;
  });

  function triggerGameBoardUpdate(e) {
    columns = document.getElementById("columns").value;
    rows = document.getElementById("rows").value;
    size = document.getElementById("size").value;
    gutter = document.getElementById("gutter").value;
    e.target.style.width = `${e.target.value.toString().length + 0.5}ch`;
    renderGameBoard(rows, columns, size, gutter);
    localStorage.setItem("gameHistory", []);
  }

  function updateGameSettings() {
    movesRemaining = movesPerTurn;
  }

function countPoints() {
  gameHistory.forEach((turn, index) => {
    console.log(`******* COUNT POINTS ******** turn: `, turn)
    turn.forEach(move => {
      console.log(`******* COUNT POINTS ******** move: `, move)
      let square = document.getElementById(`${move.squareId}`)
      console.log(`square element: `, square)
      let player = square.getAttribute('player')
      console.log(`square owned by player: ${player}`)
    })
    createGameArrays()
  })

  // createGameArrays()
  // countPoints()
}

function realtimeCountPoints() {

}

function createGameArrays() {
  console.log(`gameHistory length ${gameHistory.length}`)
}

  function renderGameBoard(rows, columns, size, gutter) {
    let gameboard = document.getElementById("game-board");
    while (gameboard.firstChild) {
      gameboard.removeChild(gameboard.firstChild);
    }
    console.log(`rows: ${rows} columns: ${columns}`);
    for (let i = 0; i < rows; i++) {
      let row = document.createElement("div");
      row.classList = "game-row";
      gameboard.appendChild(row);
      // console.log(`inner rows loop ${i + 1}`);
      for (let x = 0; x < columns; x++) {
        // console.log(`inner columns loop ${x + 1}, gutter ${gutter}`);
        let square = document.createElement("div");
        square.classList = "game-square";
        square.style = "--custom-bg: rgba(150, 150, 255, 0.75)"; // ("data-background-color", "#fff");
        square.style.margin = gutter + "px";
        square.style.width = size + "px";
        square.style.height = size + "px";
        square.id = `R${i + 1}C${x + 1}`;
        square.setAttribute("data-ticked", false);
        square.setAttribute("data-marker", "X");

        row.appendChild(square);
        square.addEventListener("click", () => playMove(event));
      }
    }
  }

  function setTurnHistory(square) {
    let move = {};
    let id = square.id;
    move["move"] = moveNumber;
    move["squareId"] = square.id;
    move["clickCount"] = clickCount;
    move["player"] = currentPlayer;

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
      let thisMoveNum = moveNumber - movesPerTurn + index + 1
      console.log(`############### setGameHistory, locking moves ${turn.squareId}`)
      move.setAttribute("locked", true);
      turn.move = thisMoveNum
      move.classList.add("locked");
      move.style.border = "1px solid rgba(0,0,0,0.5)"
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
        playerChange();
        return;
      }
      moveNumber++;
      setTurnHistory(square);
      tickThis(square);

      movesRemaining--;
    }
    // console.log("playMove call from square click");
    // console.log(square);
  }

  function tickThis(square) {
    console.log("tickThis(square)");
    square.classList.add("ticked");
    
    square.dataset.ticked = true;

    if (currentPlayer == 0) {
      console.log(`currentPlayer == 0`);
      square.setAttribute("data-marker", "X");
      square.setAttribute("player", 0);
      square.style = "--custom-bg: #abf";
      // square.setAttribute("data-background-color", "rgba(255, 150, 150, 0.75)");
    } else {
      square.setAttribute("data-marker", "O");
      square.setAttribute("player", 1);
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
    movesRemaining++;
  }

  function playerChange() {
    let gameboard = document.getElementById("game-board");
    gameboard.classList.add("player-change");
    setTimeout(() => {
      gameboard.classList.remove("player-change");
    }, 250);
    let playerIndicator = document.querySelector(".player-indicator");
    playerIndicator.classList.remove(`player-${currentPlayer}`);

    currentPlayer == 0 ? (currentPlayer = 1) : (currentPlayer = 0);
    movesRemaining = movesPerTurn;

    console.log(`playerIndicator`, playerIndicator);
    playerIndicator.classList.add(`player-${currentPlayer}`);
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
    background: rgba(155,255,155,1);
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
    border: 1px solid rgba(0,0,0,0.5);
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

<div class="main">
  <div class="player-indicator player-0">
    <h2 class="player-indicator-heading">Player {currentPlayer}</h2>
    <h2 class="player-indicator-heading">Turn Moves: {movesRemaining}</h2>
    <h2 class="player-indicator-heading">Total Moves: {moveNumber}</h2>

    <div class="buttons-wrapper">
      <button id="next-turn-button">End turn</button>
      <button id="restart-game-button" on:click={countPoints}>Tally points</button>
      <button id="restart-game-button">Restart game</button>
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
