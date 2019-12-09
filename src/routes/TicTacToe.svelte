<script>
  import { onMount } from "svelte";

  $: rows = 10;
  $: columns = 10;
  $: size = 24;
  $: gutter = 0;
  $: player = "ONE";
  $: movesPerTurn = 3;
  $: movesRemaining = 0;
  $: turn = 0;

  onMount(() => {
    renderGameBoard(rows, columns, size, gutter);
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
        square.style.margin = gutter + "px";
        square.style.width = size + "px";
        square.style.height = size + "px";
        square.id = `R${i}C${x}`
        
        row.appendChild(square);
        square.addEventListener('click', () => doSomething(event))
      }
    }
  }

  function doSomething(e) {
    e.target.style.background = "#fff";
    console.log('doSomething call from square click')
    console.log(e.target)
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
    background: rgba(150, 150, 255, 0.75);
    border: 1px solid black;
    &:hover {
      background: rgba(150, 150, 255, 1);
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
  <span class="player-indicator">{player}</span>
</h1>
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
