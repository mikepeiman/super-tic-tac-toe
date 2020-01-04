<script>
  import { onMount, createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();
  import Cell from "./Cell.svelte";
  import {
    storeSettings,
    storeState,
    storePlayers,
    storeCurrentPlayer,
    storeDirectionArrays,
    storeGameInProgress,
    storeMovesPlayedHistory,
    storePreservePlayerDetails,
    storeGameBoardMoveHistoryFlatArray
  } from "../stores.js";

  $: console.log(`GameBoard state currentPlayer: `, currentPlayer);
  $: console.log(`GameBoard state reset: `, state.reset);
  $: console.log(`GameBoard state gameInProgress: `, state.gameInProgress);
  $: console.log(
    `GameBoard state updateGameSettings: `,
    state.updateGameSettings
  );

  $: settings = {};
  $: state = {};
  $: players = [];
  $: state.reset ? resetGameBoard() : (state.reset = false);
  $: state.updateGameSettings
    ? updateGameSettings()
    : (state.updateGameSettings = false);
  $: lines = {
    leftToRight: [],
    topToBottom: [],
    diagonalDownLeft: [],
    diagonalDownRight: []
  };
  $: scoreDirections = [
    {
      id: 1,
      name: "leftToRight",
      lines: lines.leftToRight,
      scoringLines: [],
      dirScore: 0,
      iconSrc: "tictactoe-horizontal.png"
    },
    {
      id: 2,
      name: "topToBottom",
      lines: lines.topToBottom,
      scoringLines: [],
      dirScore: 0,
      iconSrc: "tictactoe-vertical.png"
    },
    {
      id: 3,
      name: "diagonalDownLeft",
      lines: lines.diagonalDownLeft,
      scoringLines: [],
      dirScore: 0,
      iconSrc: "tictactoe-diagonal-down-left.png"
    },
    {
      id: 4,
      name: "diagonalDownRight",
      lines: lines.diagonalDownRight,
      scoringLines: [],
      dirScore: 0,
      iconSrc: "tictactoe-diagonal-down-right.png"
    }
  ];
  $: cellStyles = [];
  $: cellClasses = [];
  $: grid = [];
  $: currentPlayer = {};
  $: ticked = false;
  $: gameHistory = [];
  $: turnHistory = [];
  $: gameBoardMoveHistoryFlatArray = [];

  function moveNotification(e) {
    console.log(`GameBoard moveNOtification: `, e);
    playMove(getCellById(e.detail));
    dispatch("move", e.detail);
  }

  onMount(() => {
    console.log(`GameBoard component mounted`);
    settings = $storeSettings;
    currentPlayer = $storeCurrentPlayer;
    gameHistory = $storeMovesPlayedHistory;
    state = $storeState;
    buildGameBoard(
      settings.rows,
      settings.columns,
      settings.size,
      settings.gutter
    );
  });

  function renderGameBoardReload(delayMS) {
    console.log(`renderGameBoardReload => gameHistory::: `, gameHistory);
    let settings = JSON.parse(localStorage.getItem("settings"));
    let players = JSON.parse(localStorage.getItem("players"));
    let gameHistory = JSON.parse(localStorage.getItem("gameHistory"));
    console.log(
      `renderGameBoardReload => LS gameHistory, players::: `,
      gameHistory,
      players
    );

    console.log(`renderGameBoardReload => gameHistory::: `, gameHistory);
    // localStorage.setItem("gameHistory", JSON.stringify(gameHistory));
    let gameboard = document.getElementById("gameboard-board");
    let amount, number;
    let len = gameHistory.length;

    while (gameboard.firstChild) {
      gameboard.removeChild(gameboard.firstChild);
    }
    buildGameBoard(
      settings.rows,
      settings.columns,
      settings.size,
      settings.gutter
    );

    const delay = (amount = number) => {
      return new Promise(resolve => {
        setTimeout(resolve, amount);
      });
    };
    async function loop(gameHistory, delayMS) {
      for (let i = 0; i < len; i++) {
        let turn = gameHistory[i];
        // console.log(`building reload function, this turn is: `, turn);
        for (let j = 0; j < settings.movesPerTurn; j++) {
          let move = turn[j];
          let p = move.player.id;
          // console.log(`building reload function, this move is: `, move);
          // console.log(`building reload function, this player is: `, p);
          let cell = document.getElementById(move.id);
          cell.style = `--custom-bg: ${players[p].bgColor}`;
          cell.style.margin = settings.gutter + "px";
          cell.style.width = settings.size + "px";
          cell.style.height = settings.size + "px";
          cell.setAttribute("data-marker", players[p].marker);
          cell.setAttribute("data-ticked", true);
          cell.classList.add("locked", "ticked");
          cell.setAttribute("locked", true);
          cell.style.border = "1px solid rgba(0,0,0,0.5)";
          await delay(delayMS);
        }
      }
    }
    loop(gameHistory, delayMS);
    players = players;
    console.log(
      `renderGameBoardReload after cells are reloaded   :::   gameHistory length: ${len}, players`,
      players
    );
  }

  function createDirectionArrays() {
    console.log("createDirectionArrays called");
    for (let i = 1; i <= 4; i++) {
      // console.log(`makeLinesFrom ${i}`);
      makeLinesFrom(i);
    }
  }

  function makeLinesFrom(dir) {
    // console.log(
    //   `GameBoard => makeLinesFrom(dir) - settings rows ${settings.rows} & columns ${settings.columns} to set player.lines for scoring: `,
    //   settings
    // );
    let rows = settings.rows;
    let columns = settings.columns;
    // console.log('makeLinesFrom called')
    let start,
      pattern = {};
    let theseLines = [],
      newLine = [];

    if (dir == 1) {
      // console.log('makeLinesFrom dir == 1')
      start = { row: 0, column: 0 };
      pattern = { row: 0, column: +1 };

      for (let i = 0; i < rows; i++) {
        newLine = makeLineFrom(start, pattern);
        start.row++;
        theseLines.push(newLine);
      }
      lines.leftToRight = theseLines;
    }

    if (dir == 2) {
      start = { row: 0, column: 0 };
      pattern = { row: +1, column: 0 };

      for (let i = 0; i < columns; i++) {
        newLine = makeLineFrom(start, pattern);
        start.column++;
        theseLines.push(newLine);
      }
      lines.topToBottom = theseLines;
    }

    if (dir == 3) {
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

    if (dir == 4) {
      start = { row: rows, column: columns - 1 };
      pattern = { row: +1, column: -1 };

      for (let i = 0; i < rows; i++) {
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
    localStorage.setItem("lines", JSON.stringify(lines));
  }

  function makeLineFrom(start, pattern) {
    let line = [];
    let nextLine = nextCellFrom(
      start.row,
      start.column,
      pattern.row,
      pattern.column,
      line
    );
    return nextLine;
  }

  function nextCellFrom(row, column, rowChange, columnChange, line) {
    let id = `R${row}C${column}`;
    line = [
      ...line,
      {
        id: id,
        row: row,
        column: column,
        player: { id: null, name: "none" }
      }
    ];
    let nextRow = row + rowChange;
    let nextColumn = column + columnChange;
    let nextCell = {
      row: nextRow,
      column: nextColumn,
      player: { id: null, name: "none" }
    };

    if (nextRow >= settings.rows) {
      return line;
    }
    if (nextColumn >= settings.columns || nextColumn < 0) {
      return line;
    }

    nextCell = nextCellFrom(nextRow, nextColumn, rowChange, columnChange, line);
    return nextCell;
  }

  function getMoveFromHistory(id) {
    let payload = { id: "zzz", name: "zzz" };
    if (localStorage.getItem("gameBoardMoveHistoryFlatArray")) {
      let game = JSON.parse(
        localStorage.getItem("gameBoardMoveHistoryFlatArray")
      );
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

  function buildGameBoard(rows, columns, size, gutter) {
    state.reset = false;
    grid = [];
    for (let r = 0; r < rows; r++) {
      grid.push([]);
      for (let c = 0; c < columns; c++) {
        let id = `R${r}C${c}`;
        let cellAttributes = {
          id: id,
          row: r,
          column: c
        };
        grid[r].push(cellAttributes);
        // grid[r].push()
      }
    }
    console.log(`GameBoard => buildGameBoard completed, grid: `, grid);
    createDirectionArrays();
    console.log(`GameBoard => buildGameBoard completed, lines: `, lines);
    grid = grid;
  }

  function resetGameBoard() {
    console.log(
      `GameBoard => resetGameBoard(), settings rows ${settings.rows} columns ${settings.columns} `,
      settings
    );
    clearGameBoard();
    setTimeout(() => {
      buildGameBoard(
        settings.rows,
        settings.columns,
        settings.size,
        settings.gutter
      );
      createDirectionArrays();
    }, 1);
    state = {
      lastTicked: "",
      currentPlayer: players[0],
      movesRemaining: 0,
      turn: 0,
      gameHistory: [],
      turnHistory: [],
      clickCount: 0,
      moveNumber: 0,
      reset: false
    };
    state.movesRemaining = settings.movesPerTurn;
    state = state;
    console.log(
      `GameBoard just ran a reset, now state, players `,
      state,
      players
    );
  }

  function clearGameBoard() {
    console.log(`clearGameBoard called from resetGameBoard`);
    let gameboard = document.getElementById("gameboard-board");

    while (gameboard.firstChild) {
      console.log(`renderGameBoardReload::: removing a DOM child el`);
      gameboard.removeChild(gameboard.firstChild);
    }
    grid = [];
  }

  function playMove(cell) {
    state.clickCount++;
    let id = cell.id;
    let ticked = cell.dataset.ticked == "true";
    cell.classList.add("ticked");
    cell.setAttribute("data-marker", currentPlayer.marker);

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
    localStorage.setItem("state", JSON.stringify(state));
  }

  function tickThis(cell) {
    // console.log("tickThis(cell)", cell, currentPlayer);
    let id = cell.id;
    let row = id[1];
    let column = id[3];
    state.lastTicked = {
      row: row,
      column: column,
      playerId: currentPlayer.id,
      playerName: currentPlayer.name
    };
    cell.classList.add("ticked");
    cell.dataset.ticked = true;
    cell.setAttribute("player-id", currentPlayer.id);
    cell.setAttribute("player-name", currentPlayer.name);
    cell.style = `--custom-bg: ${currentPlayer.bgColor}`;
    cell.setAttribute("data-marker", currentPlayer.marker);
  }

  function untickThis(cell) {
    let id = cell.id;
    let row = cell.getAttribute("row");
    let column = cell.getAttribute("column");
    // console.log(`------------untickThis(cell)`, cell);
    // console.log(`------------untickThis(cell) row ${row} column ${column} `);
    cell.classList.remove("ticked");
    let settings = JSON.parse(localStorage.getItem("settings"));
    let rowFactor = 60 / settings.rows;
    let colFactor = settings.columns / 100;
    let hue = rowFactor * row + 210;
    let alpha = ((parseInt(column) + 1) / 200 / colFactor).toFixed(2);
    // console.log(`------------untickThis(cell) ${id} row ${row} column ${column} rowFactor ${rowFactor} colFactor ${colFactor} color vars: hue ${hue} alpha ${alpha}`);
    // console.log(`------------untickThis(cell) ((column + 1) ${(parseInt(column) + 1)} (200 / colFactor) ${(200 / colFactor)} column ${column} rowFactor ${rowFactor} colFactor ${colFactor} color vars: hue ${hue} alpha ${alpha}`);
    // customBg = `--custom-bg: hsla(${row * 20 + 120}, 50%, 50%, ${id[1] / 10})`;
    let customBg = `--custom-bg: hsla(${hue}, 50%, 50%, ${alpha});`;
    cell.style = customBg;
    cell.dataset.ticked = false;
    cell.removeAttribute("player-id");
    cell.removeAttribute("player-name");
    state.movesRemaining++;
  }

  function setPlayerMove(cellId) {
    if (gameBoardMoveHistoryFlatArray.length > 0) {
      gameBoardMoveHistoryFlatArray.forEach(move => {
        if (move.id == cellId) {
          console.log(`if(move.id == cellId) ${cellId}`);
          move.player = {
            id: currentPlayer.id,
            name: currentPlayer.name
          };
          move.move = state.moveNumber;
        }
      });
    }

    localStorage.setItem(
      "gameBoardMoveHistoryFlatArray",
      JSON.stringify(gameBoardMoveHistoryFlatArray)
    );
  }

  function removePlayerMove(cellId) {
    gameBoardMoveHistoryFlatArray.forEach(move => {
      if (move.id == cellId) {
        console.log(`if(move.id == cellId) ${cellId}`);
        move.player = {
          id: null,
          name: null
        };
        move.move = null;
      }
      localStorage.setItem(
        "gameBoardMoveHistoryFlatArray",
        JSON.stringify(gameBoardMoveHistoryFlatArray)
      );
    });
  }

  function playerChange() {
    let gameboard = document.getElementById("gameboard-board");
    gameboard.classList.add("player-change");
    setTimeout(() => {
      gameboard.classList.remove("player-change");
    }, 250);
    let playerIndicator = document.querySelector(".player-indicator");
    playerIndicator.classList.remove(`player-${currentPlayer.id}`);
    let id = currentPlayer.id;
    if (id >= settings.numberOfPlayers - 1) {
      currentPlayer = players[0];
      // playerIndicator.style = `--custom-bg: ${players[0].bgColor}`;
      playerIndicator.style = `--custom-bg: ${currentPlayer.bgColor}`;
    } else {
      currentPlayer = players[id + 1];
      // playerIndicator.style = `--custom-bg: ${players[id + 1].bgColor}`;
      playerIndicator.style = `--custom-bg: ${currentPlayer.bgColor}`;
    }

    state.movesRemaining = settings.movesPerTurn;
    localStorage.setItem("state", JSON.stringify(state));
    localStorage.setItem("currentPlayer", JSON.stringify(currentPlayer));
    console.log(
      `playerChanges, currentPlayer.id AFTER change:`,
      currentPlayer.id
    );
    console.log(`playerIndicator`, playerIndicator);
    playerIndicator.classList.add(`player-${currentPlayer.id}`);
  }

  function setTurnHistory(cell) {
    let move = {};
    move["move"] = state.moveNumber;
    move["id"] = cell.id;
    move["clickCount"] = state.clickCount;
    move["player"] = {
      id: currentPlayer.id,
      name: currentPlayer.name
    };
    console.log(`setTurnHistory(cell) ${cell.id}`, cell, state);
    // let history = turnHistory;
    if (turnHistory.filter(turn => turn.id == cell.id).length > 0) {
      // console.log(
      //   `turnHistory already contains this move - that means we should remove it!`
      // );
      turnHistory = turnHistory.filter(turn => turn.id !== cell.id);
    } else {
      // console.log(
      //   `apparently we have not made this move yet, let's add it to turnHistory`
      // );
      turnHistory = [...turnHistory, move];
      gameBoardMoveHistoryFlatArray = [...gameBoardMoveHistoryFlatArray, move];
      localStorage.setItem(
        "gameBoardMoveHistoryFlatArray",
        JSON.stringify(gameBoardMoveHistoryFlatArray)
      );
      storeGameBoardMoveHistoryFlatArray.set(gameBoardMoveHistoryFlatArray);
    }
    // console.log(turnHistory);
  }

  function setGameHistory() {
    console.log(`GameBoard => setGameHistory running`);
    if (localStorage.getItem("gameHistory")) {
      gameHistory = JSON.parse(localStorage.getItem("gameHistory"));
    }
    gameHistory = [...gameHistory, turnHistory];
    turnHistory.forEach((turn, index) => {
      let pid = turn.player.id;
      let move = document.getElementById(`${turn.id}`);
      let thisMoveNum = state.moveNumber - settings.movesPerTurn + index + 1;
      move.setAttribute("locked", true);
      console.log(
        `GameBoard => setGameHistory, turn => turn.player `,
        turn.player
      );
      move.setAttribute("data-marker", players[pid].marker);
      turn.move = thisMoveNum;
      move.classList.add("locked");
      move.style.border = "1px solid rgba(0,0,0,0.5)";
    });
    turnHistory = [];
    localStorage.setItem("gameHistory", JSON.stringify(gameHistory));
    localStorage.setItem("gameInProgress", true);
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

  .debug {
    display: flex;
  }

  .debug-section {
    margin: 1rem;
    padding: 0.5rem;
    background: rgba(0, 0, 0, 1);
    border: 3px solid rgba(255, 155, 200, 0.5);
  }
</style>

<div class="component-wrapper">
  <div id="gameboard-board" class="gameboard-board" />
  {#each grid as row}
    <div class="row">
      {#each row as cell}
        <Cell
          id={cell.id}
          row={cell.row}
          column={cell.column}
          on:move={moveNotification} />
      {/each}
    </div>
  {/each}

</div>

<div class="debug">
  <div class="debug-section">
    <h2>storeState</h2>
    <div>.movesRemaining: {$storeState.movesRemaining}</div>
    <div>.clickCount: {$storeState.clickCount}</div>
    <div>.currentPlayer.name: {$storeState.currentPlayer.name}</div>
    <div>.reset: {$storeState.reset}</div>
    <div>.reset: {$storeState.reset}</div>
    <div>.reset: {$storeState.reset}</div>
  </div>
  <div class="debug-section">
    <h2>storeSettings</h2>
    <div>.rows: {$storeSettings.rows}</div>
    <div>.columns: {$storeSettings.columns}</div>
    <div>.numberOfPlayers: {$storeSettings.numberOfPlayers}</div>
    <div>.cellsToScore: {$storeSettings.cellsToScore}</div>
  </div>
  <div class="debug-section">
    <h2>storePlayers</h2>
    {#each $storePlayers as player}
      <div>.id: {player.id}</div>
      <div>.name: {player.name}</div>
      <div>.bgColor: {player.bgColor}</div>
      <div>.totalScore: {player.totalScore}</div>
    {/each}
  </div>
  <div class="debug-section">
    <h2>Flags</h2>
    <div>storePreservePlayerDetails: {$storePreservePlayerDetails}</div>
    <div>storeGameInProgress: {$storeGameInProgress}</div>
  </div>
  <div class="debug-section">
    <h2>storeMovesPlayedHistory</h2>
    {#each $storeMovesPlayedHistory as turn}
      {#each turn as move}
        <div>{move.id}-{move.player.name}</div>
      {/each}
    {/each}
  </div>
</div>
