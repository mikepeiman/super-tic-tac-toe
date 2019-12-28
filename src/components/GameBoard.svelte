<script>
  import { onMount, createEventDispatcher } from "svelte";
  import Cell from "./Cell.svelte";

  export let gameboardMapped;
  export let settings = {};
  export let state = {};
  export let players = [];

  $: gameboardMapped = [];
  // $: players = [];

  // $: settings = {
  //   numberOfPlayers: 3,
  //   movesPerTurn: 5,
  //   cellsToScore: 3,
  //   bonusForCompleteRow: 5,
  //   rows: 5,
  //   columns: 10,
  //   size: 24,
  //   gutter: 0
  // };

  $: cellStyles = [];
  $: cellClasses = [];
  $: grid = [];
  $: player = {};
  $: ticked = false;

  const dispatch = createEventDispatcher();
  function moveNotification(e) {
    console.log(`GameBoard moveNOtification: `, e);
    playMove(getCellById(e.detail));
    // let cell = document.getElementById(e.detail)
    // console.log(cell)
    dispatch("move", e.detail);
  }

  onMount(() => {
    console.log(`GameBoard component mounted`);
    console.log(`props: gameboardMapped[], settings{}, state{}, players[]`);
    console.log(gameboardMapped, settings, state, players);
    // drawGameBoard(
    //   settings.rows,
    //   settings.columns,
    //   settings.size,
    //   settings.gutter
    // );
    buildGrid();
  });

  function getMoveFromHistory(id) {
    let payload = { id: "zzz", name: "zzz" };
    if (localStorage.getItem("gameboardMapped")) {
      let game = JSON.parse(localStorage.getItem("gameboardMapped"));
      game.forEach(move => {
        if (move.id == id) {
          payload = move.player;
        }
      });
    }
    return payload;
  }

  function getCellById(id) {
    let cell = document.getElementById(id);
    return cell;
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

  function playMove(cell) {
    state.clickCount++;
    console.log(`playMove clickCount: ${state.clickCount}`);
    let id = cell.id;
    // cell["id"] = `R${rowNum}C${colNum}`;
    cell.setAttribute("row", id[1]);
    cell.setAttribute("col", id[3]);
    cell.setAttribute("playername", "empty");
    cell.setAttribute("playerid", "empty");
    let ticked = cell.dataset.ticked == "true";
    cell.classList.add("ticked");
    cell.setAttribute("data-marker", "O");
    let customBg = `--custom-bg: hsla(${id[3] * 20 + 120}, 50%, 50%, 1)`;
    cell.style = customBg;
    // console.log(`click from ${cell.id}`, cell, customBg);

    if (ticked) {
      if (!cell.hasAttribute("locked")) {
        setTurnHistory(cell);
        untickThis(cell);
        removePlayerMove(cell.id);
        state.moveNumber--;
      } else {
        console.log(`It seems you tried to untick a locked move!`);
      }
    } else {
      if (state.movesRemaining == 1) {
        state.moveNumber++;
        setTurnHistory(cell);
        setGameHistory();
        tickThis(cell);
        setPlayerMove(cell.id);
        playerChange();
        return;
      }
      state.moveNumber++;
      setTurnHistory(cell);
      tickThis(cell);
      setPlayerMove(cell.id);
      state.movesRemaining--;
    }
  }

  function tickThis(cell) {
    console.log("tickThis(cell)", cell, state.currentPlayer);
    let id = cell.id;
    let row = id[1];
    let column = id[3];
    state.lastTicked = {
      row: row,
      column: column,
      playerId: state.currentPlayer.id,
      playerName: state.currentPlayer.name
    };
    cell.classList.add("ticked");
    cell.dataset.ticked = true;
    cell.setAttribute("player-id", state.currentPlayer.id);
    cell.setAttribute("player-name", state.currentPlayer.name);
    cell.style = `--custom-bg: ${state.currentPlayer.bgColor}`;
    cell.setAttribute("data-marker", "O");
  }

  function untickThis(cell) {
    let id = cell.id
    console.log(`------------untickThis(cell)`);
    cell.classList.remove("ticked");
    cell.style = `--custom-bg: hsla(${id[3]*20+120}, 50%, 50%, ${id[1]/10})`;
    cell.dataset.ticked = false;
    cell.removeAttribute("player-id");
    cell.removeAttribute("player-name");
    // removeFromScoringArray(cell)
    state.movesRemaining++;
  }

  function setPlayerMove(squareId) {
    // console.log(
    //   `setPlayerMove(${squareId}) - currentPlayer.id ${state.currentPlayer.id}`
    // );
    gameboardMapped.forEach(move => {
      if (move.id == squareId) {
        console.log(`if(move.id == squareId) ${squareId}`);
        move.player = {
          id: state.currentPlayer.id,
          name: state.currentPlayer.name
        };
        move.move = state.moveNumber;
      }
    });
    // players
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

  function playerChange() {
    let gameboard = document.getElementById("gameboard-board");
    gameboard.classList.add("player-change");
    setTimeout(() => {
      gameboard.classList.remove("player-change");
    }, 250);
    let playerIndicator = document.querySelector(".player-indicator");
    playerIndicator.classList.remove(`player-${state.currentPlayer.id}`);
    let id = state.currentPlayer.id;
    if (id >= settings.numberOfPlayers - 1) {
      state.currentPlayer = players[0];
      // playerIndicator.style = `--custom-bg: ${players[0].bgColor}`;
      playerIndicator.style = `--custom-bg: ${state.currentPlayer.bgColor}`;
    } else {
      state.currentPlayer = players[id + 1];
      // playerIndicator.style = `--custom-bg: ${players[id + 1].bgColor}`;
      playerIndicator.style = `--custom-bg: ${state.currentPlayer.bgColor}`;
    }

    state.movesRemaining = settings.movesPerTurn;
    console.log(
      `playerChanges, state.currentPlayer.id AFTER change:`,
      state.currentPlayer.id
    );
    console.log(`playerIndicator`, playerIndicator);
    playerIndicator.classList.add(`player-${state.currentPlayer.id}`);
  }

  function setTurnHistory(cell) {
    let move = {};
    move["move"] = state.moveNumber;
    move["id"] = cell.id;
    move["clickCount"] = state.clickCount;
    move["player"] = {
      id: state.currentPlayer.id,
      name: state.currentPlayer.name
    };
    console.log(`setTurnHistory(cell) ${cell.id}`, cell, state);
    // let history = state.turnHistory;
    if (state.turnHistory.filter(turn => turn.id == cell.id).length > 0) {
      // console.log(
      //   `turnHistory already contains this move - that means we should remove it!`
      // );
      state.turnHistory = state.turnHistory.filter(turn => turn.id !== cell.id);
    } else {
      // console.log(
      //   `apparently we have not made this move yet, let's add it to state.turnHistory`
      // );
      state.turnHistory = [...state.turnHistory, move];
    }
    // console.log(state.turnHistory);
  }

  function setGameHistory(cell) {
    state.gameHistory = [...state.gameHistory, state.turnHistory];
    state.turnHistory.forEach((turn, index) => {
      let move = document.getElementById(`${turn.id}`);
      let thisMoveNum = state.moveNumber - settings.movesPerTurn + index + 1;
      move.setAttribute("locked", true);
      move.setAttribute("data-marker", "O");
      turn.move = thisMoveNum;
      move.classList.add("locked");
      move.style.border = "1px solid rgba(0,0,0,0.5)";
    });
    state.turnHistory = [];
    localStorage.setItem(
      "gameHistory",
      JSON.stringify(state.gameHistory)
    );
  }
</script>

<style lang="scss">
  .row {
    display: flex;
  }
  .component-wrapper {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
  }
</style>

<div class="component-wrapper">
  <h1>GameBoard component</h1>
  <div id="gameboard-board" class="gameboard-board" />
  {#each grid as row}
    <div class="row">
      {#each row as cell}
        <Cell id={cell} on:move={moveNotification} {cellStyles} />
      {/each}
    </div>
  {/each}

</div>
