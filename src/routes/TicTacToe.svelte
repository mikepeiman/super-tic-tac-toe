<script>
  import { onMount } from "svelte";

  $: rows = 10;
  $: columns = 10;
  $: size = 24;
  $: gutter = 0;
  $: currentPlayer = 0;
  $: movesPerTurn = 3;
  $: movesRemaining = 0;
  $: turn = 0;

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
      console.log(`inner rows loop ${i + 1}`);
      for (let x = 0; x < columns; x++) {
        console.log(`inner columns loop ${x + 1}, gutter ${gutter}`);
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

  function playMove(e) {
    let square = e.target;
    let ticked = square.dataset.ticked == "true";
    console.log(
      `ticked status ::: ${ticked} ::: movesRemaining ||| ${movesRemaining} |||`
    );

    if (ticked) {
      untickThis(square);
    } else {
      if (movesRemaining < 1) {
        currentPlayer == 0 ? (currentPlayer = 1) : (currentPlayer = 0);
        movesRemaining = movesPerTurn;
      }
      tickThis(square);
    }

    // ticked ? (square.dataset.ticked = false) : (square.dataset.ticked = true);
    // ticked = square.dataset.ticked == "true";

    // ticked
    //   ? (square.style.background = "#fff")
    //   : (square.style.background = "#0af");
    console.log("playMove call from square click");
    console.log(square);
  }

  function tickThis(square) {
    console.log("tickThis(square)");
    square.classList.add("ticked");
    square.dataset.ticked = true;
    movesRemaining--;
    if (currentPlayer == 0) {
      console.log(`currentPlayer == 0`);
      square.setAttribute("data-marker", "X");
      square.style = "--custom-bg: #abf";
      // square.setAttribute("data-background-color", "rgba(255, 150, 150, 0.75)");
    } else {
      square.setAttribute("data-marker", "O");
      square.style = "--custom-bg: #fab";
      // square.setAttribute("data-background-color", "rgba(150, 255, 150, 0.75)");
    }
    //  square.style.background = "rgba(150, 150, 255, 0.75)"
  }

  function untickThis(square) {
    console.log(`------------untickThis(square)`);
    square.classList.remove("ticked");
    square.style = "--custom-bg: rgba(150, 150, 255, 0.75)";
    square.dataset.ticked = false;
    movesRemaining++;
  }

  function checkWhichPlayer() {
    if (movesRemaining < 1) {
      currentPlayer == 0 ? (currentPlayer = 1) : (currentPlayer = 0);
      movesRemaining = movesPerTurn;
    } else {
      movesRemaining--;
    }
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
    display: flex;
    flex-direction: column;
    color: #eee;
    justify-content: start;
    align-items: start;
    height: 90vh;
    overflow: hidden;
  }

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
    // width: 240px;
    // height: 240px;
    // background: white;
    display: flex;
    flex-direction: column;
    align-self: center;
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
    border: 1px solid red;
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

  .player-indicator {
    padding: 0.25rem;
    background: rgba(0, 255, 155, 0.5);
    border-radius: 5px;
    border-bottom: 5px solid rgba(0, 255, 155, 0.85);
  }
</style>

<h1>
  Tic Tac Toe: Player
  <span class="player-indicator">{currentPlayer}</span>
</h1>
<h2>Moves remaining: {movesRemaining}</h2>
<div class="main">

  <div class="form-wrap">
    <h2>LAYOUT</h2>
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

  </div>

  <div class="form-wrap">
    <h2>GAME OPTIONS</h2>
    <label for="movesPerTurn">
      Moves Per Turn:
      <input
        id="movesPerTurn"
        name="movesPerTurn"
        type="number"
        placeholder={movesPerTurn}
        value={movesPerTurn}
        on:input={triggerGameBoardUpdate}
        style="width: 1.5ch;" />
    </label>
  </div>

  <div id="game-board" class="game-board" />
</div>
