<script>
  import { onMount, createEventDispatcher } from "svelte";
  
  const dispatch = createEventDispatcher();
  import Cell from "./Cell.svelte";

  export let gameboardMapped;
  export let settings = {};
  export let state = {};
  export let players = [];

  // $: players.forEach(player => { console.log(`GameBoard watching for player.markers update: `, player.marker)})
  $: gameboardMapped = [];
  // $: console.log(`GameBoard state currentPlayer: `, state.currentPlayer);
  $: console.log(`GameBoard state reset: `, state.reset);
  // $: console.log(`GameBoard state gameInProgress: `, state.gameInProgress);
  $: console.log(
    `GameBoard state updateGameSettings: `,
    state.updateGameSettings
  );
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
  $: player = {};
  $: ticked = false;

  function moveNotification(e) {
    console.log(`GameBoard moveNOtification: `, e);
    playMove(getCellById(e.detail));
    dispatch("move", e.detail);
  }

  onMount(() => {
    console.log(`GameBoard component mounted`);
    console.log(`props: gameboardMapped[], settings{}, state{}, players[]`);
    console.log(gameboardMapped, settings, state, players);
    buildGameBoard(
      settings.rows,
      settings.columns,
      settings.size,
      settings.gutter
    );
    let gameInProgress = localStorage.getItem("gameInProgress");
    // console.log(
    //   `gameInProgress as boolean: `,
    //   gameInProgress,
    //   gameInProgress == "true"
    // );
    if (gameInProgress == "true") {
      state.gameHistory = JSON.parse(localStorage.getItem("gameHistory"));
      console.log("GameBoard onMount says that game is in progress");
      let redrawInterval = (1000 / (settings.rows * settings.columns)).toFixed(2);
      console.log(`onMount, redrawInterval ${redrawInterval}`);
      setTimeout(() => {
        renderGameBoardReload(redrawInterval);
      }, 50);
    } else {
      console.log(
        "GameBoard onMount says that game is ***:::NOT:::*** in progress"
      );
      createDirectionArrays();
      initializePlayers();
      console.log("createDirectionArrays completed, lines, ", lines);
      localStorage.setItem("lines", JSON.stringify(lines));
    }
  });
  function updateGameSettings() {
    let settings = JSON.parse(localStorage.getItem("settings"));
    console.log(
      `GameBoard => updateGameSettings() about to resetGameBoard(), settings `,
      settings
    );
    resetGameBoard();
  }

  function initializePlayers() {
    players = [];
    for (let i = 0; i < settings.numberOfPlayers; i++) {
      players = [
        ...players,
        {
          id: i,
          name: `Player ${i + 1}`,
          totalScore: 0,
          marker: 'x',
          bgColor: `hsla(${(i + 1) * (360 / settings.numberOfPlayers) +
            100}, 50%, 50%, .75)`,
          moves: 0,
          scores: [],
          dirScoresByIndex: [0, 0, 0, 0]
        }
      ];

      scoreDirections.forEach((direction, index) => {
        players[i]["scores"].push(direction);
        players[i]["scores"][index]["lines"] = lines[direction.name];
      });
    }
    players = players;
    localStorage.setItem("players", JSON.stringify(players));
    let playerIndicator = document.querySelector(".player-indicator");
    // let id = state.currentPlayer.id;
    state.currentPlayer = players[0];
    playerIndicator.style = `--custom-bg: ${players[0].bgColor}`;
  }

  function renderGameBoardReload(delayMS) {
    console.log(
      `renderGameBoardReload => state.gameHistory::: `,
      state.gameHistory
    );
    let settings = JSON.parse(localStorage.getItem("settings"));
    let players = JSON.parse(localStorage.getItem("players"));
    let history = JSON.parse(localStorage.getItem("gameHistory"));
    console.log(`renderGameBoardReload => LS gameHistory, players::: `, history, players);

    console.log(
      `renderGameBoardReload => state.gameHistory::: `,
      state.gameHistory
    );
    // localStorage.setItem("gameHistory", JSON.stringify(state.gameHistory));
    let gameboard = document.getElementById("gameboard-board");
    let amount, number;
    let len = history.length;

    while (gameboard.firstChild) {
      // console.log(`renderGameBoardReload::: removing a DOM child el`);
      gameboard.removeChild(gameboard.firstChild);
    }
    buildGameBoard(
      settings.rows,
      settings.columns,
      settings.size,
      settings.gutter
    );
    // settings.rows, settings.columns, settings.size, settings.gutter;

    const delay = (amount = number) => {
      return new Promise(resolve => {
        setTimeout(resolve, amount);
      });
    };
    async function loop(history, delayMS) {
      for (let i = 0; i < len; i++) {
        let turn = history[i];
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
          console.log(`renderGameBoardReload::: players[p].marker ::: ${players[p].marker}`);
          cell.setAttribute("data-ticked", true);
          cell.classList.add("locked", "ticked");
          cell.setAttribute("locked", true);
          cell.style.border = "1px solid rgba(0,0,0,0.5)";
          await delay(delayMS);
        }
      }
    }
    loop(history, delayMS);
    players = players;
    console.log(
      `renderGameBoardReload after cells are reloaded   :::   history length: ${len}, players`,
      players
    );
  }

  function createDirectionArrays() {
    console.log("createDirectionArrays called");
    for (let i = 1; i <= 4; i++) {
      console.log(`makeLinesFrom ${i}`);
      makeLinesFrom(i);
    }
  }

  function makeLinesFrom(dir) {
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

      for (let i = 0; i < columns; i++) {
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
    clearGameBoard();
    setTimeout(() => {
      buildGameBoard(
        settings.rows,
        settings.columns,
        settings.size,
        settings.gutter
      );
      initializePlayers();
      // console.log(
      //   `GameBoard just ran a reset, now state, players INSIDE TIMEOUT `,
      //   state,
      //   players
      // );
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
    // console.log(
    //   `GameBoard just ran a reset, now state, players `,
    //   state,
    //   players
    // );
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
    // let customBg = `--custom-bg: hsla(${id[3] * 20 + 120}, 50%, 50%, 1)`;
    // cell.style = customBg;
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
    // console.log("tickThis(cell)", cell, state.currentPlayer);
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
    if (gameboardMapped.length > 0) {
      gameboardMapped.forEach(move => {
        if (move.id == cellId) {
          console.log(`if(move.id == cellId) ${cellId}`);
          move.player = {
            id: state.currentPlayer.id,
            name: state.currentPlayer.name
          };
          move.move = state.moveNumber;
        }
      });
    }

    localStorage.setItem("gameboardMapped", JSON.stringify(gameboardMapped));
  }

  function removePlayerMove(cellId) {
    gameboardMapped.forEach(move => {
      if (move.id == cellId) {
        console.log(`if(move.id == cellId) ${cellId}`);
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
    localStorage.setItem("state", JSON.stringify(state));
    localStorage.setItem("currentPlayer", JSON.stringify(state.currentPlayer));
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
      gameboardMapped = [...gameboardMapped, move];
      localStorage.setItem("gameboardMapped", JSON.stringify(gameboardMapped));
    }
    // console.log(state.turnHistory);
  }

  function setGameHistory() {
    console.log(`GameBoard => setGameHistory running`)
    if (localStorage.getItem("gameHistory")) {
      state.gameHistory = JSON.parse(localStorage.getItem("gameHistory"));
    }
    state.gameHistory = [...state.gameHistory, state.turnHistory];
    state.turnHistory.forEach((turn, index) => {
      let pid = turn.player.id
      let move = document.getElementById(`${turn.id}`);
      let thisMoveNum = state.moveNumber - settings.movesPerTurn + index + 1;
      move.setAttribute("locked", true);
      console.log(`GameBoard => setGameHistory, turn => turn.player `, turn.player)
      move.setAttribute("data-marker", players[pid].marker);
      turn.move = thisMoveNum;
      move.classList.add("locked");
      move.style.border = "1px solid rgba(0,0,0,0.5)";
    });
    state.turnHistory = [];
    localStorage.setItem("gameHistory", JSON.stringify(state.gameHistory));
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
