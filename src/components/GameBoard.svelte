<script>
  import { onMount } from "svelte";
  import Cell from "./Cell.svelte";

  export let gameboardMapped;
  export let settings = {};
  export let state = {};
  export let players = [];

  $: settings = {
    numberOfPlayers: 3,
    movesPerTurn: 5,
    cellsToScore: 3,
    bonusForCompleteRow: 5,
    rows: 5,
    columns: 10,
    size: 24,
    gutter: 0
  };

  $: state = {
    lastTicked: "",
    currentPlayer: "",
    movesRemaining: "",
    turn: "",
    gameHistory: "",
    turnHistory: "",
    clickCount: "",
    moveNumber: ""
  };

  // $: id = 0;
  $: cellStyles = [];
  // $: customBg = '';
  $: cellClasses = [];
  $: grid = [];
  $: player = {};
  $: ticked = false;

  onMount(() => {
    console.log(`GameBoard component mounted`);
    console.log(`props: gameboardMapped[], settings{}, state{}`);
    console.log(gameboardMapped, settings, state);
    // drawGameBoard(
    //   settings.rows,
    //   settings.columns,
    //   settings.size,
    //   settings.gutter
    // );
    buildGrid();
  });

  function buildGrid() {
    grid = [];
    for (let r = 0; r < settings.rows; r++) {
      // console.log(`buildGrid loops cols: ${r}`);
      grid.push([]);
      for (let c = 0; c < settings.columns; c++) {
        // console.log(`grid[r]: ${grid[r]}`);
        // console.log(`buildGrid loops cols: ${c}`);
        let id = `R${r}C${c}`;
        grid[r].push(id);
      }
    }
    console.log(grid);
    grid = grid;
  }

  function playMove(e) {
    let customBg = `--custom-bg: hsla(${e.target.id[1] * 50},50%,50%,1);`;
    e.target.style = customBg;
    console.log(`click from ${e.target.id}`, e.target, customBg);
  }

  function drawGameBoard(rows, columns, size, gutter) {
    console.log(`GameBoard => drawGameBoard()`, rows, columns, size, gutter);
    gameboardMapped = [];
    let gameboard = document.getElementById("gameboard-board");
    console.log(gameboard);
    while (gameboard.firstChild) {
      gameboard.removeChild(gameboard.firstChild);
    }
    // console.log(`rows: ${rows} columns: ${columns}`);
    for (let rowNum = 0; rowNum < rows; rowNum++) {
      // console.log(`row: ${rowNum}`);
      let row = document.createElement("div");
      row.classList = "game-row";
      gameboard.appendChild(row);

      for (let colNum = 0; colNum < columns; colNum++) {
        // console.log(`row: ${rowNum} column: ${colNum}`);
        let square = document.createElement("div");
        square.classList = "game-square";
        square.style = "--custom-bg: rgba(0, 30, 255, 0.25)";
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
  }
</script>

<style lang="scss">
  .row {
    display: flex;
  }
</style>

<div class="component-wrapper">
  <h1>GameBoard component</h1>
  <div id="gameboard-board" class="gameboard-board" />
  {#each grid as row}
    <div class="row">
      {#each row as cell}
        <Cell id={cell} on:click={playMove} {cellStyles}  />
      {/each}
    </div>
  {/each}

</div>
