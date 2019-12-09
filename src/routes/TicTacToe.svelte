<script>
  import { onMount } from "svelte";

  $: rows = 5
  $: columns = 5
  $: size = 24
  $: gutter = 1

  onMount(() => {

    // let columns = document.getElementById("columns").value;
    // let rows = document.getElementById("rows").value;
    // let size = document.getElementById("size").value;
    // let gutter = document.getElementById("gutter").value;

    renderGameBoard(rows, columns, size, gutter);
  });

  function renderGameBoard(rows, columns, size, gutter) {
        let gameboard = document.getElementById("game-board");
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
        row.appendChild(square);
      }
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
    background: rgba(150, 150, 255, 0.75);
    border: 1px solid black;
    &:hover {
      background: rgba(150, 150, 255, 1);
    }
  }
</style>

<h1>Tic Tac Toe</h1>
<div class="main">

  <div class="form-wrap">
    <label for="rows">
      Rows:
      <input
        id="rows"
        name="rows"
        type="number"
        placeholder={rows}
        value={rows}
        on:input={setWidthByChars}
        style="width: 1.5ch;" />
    </label>
    <label for="columns">
      Columns:
      <input
        id="columns"
        name="columns"
        type="number"
        placeholder={columns}
        value={columns}
        on:input={setWidthByChars}
        style="width: 1.5ch;" />
    </label>
    <label for="size">
      Square size (px):
      <input
        id="size"
        name="size"
        type="number"
        placeholder="24"
        value={size}
        step={size}
        on:input={setWidthByChars}
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
        on:input={setWidthByChars}
        style="width: 1.5ch;" />
    </label>

  </div>

  <div id="game-board" class="game-board" />
</div>
