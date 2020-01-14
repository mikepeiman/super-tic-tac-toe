<script>
  import { onMount, afterUpdate, createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();
  import Cell from "./Cell.svelte";
  import {
    storeSettings,
    storeCellSize,
    storeState,
    storePlayers,
    storeCurrentPlayer,
    storeDirectionArrays,
    storeGameInProgress,
    storeGameHistoryTurns,
    storePreservePlayerDetails,
    storeGameHistoryFlat
  } from "../stores.js";

  let settings = {};
  $: state = {};
  $: moveNumber = 0;
  $: players = [];
  $: lines = {
    leftToRight: [],
    topToBottom: [],
    diagonalDownLeft: [],
    diagonalDownRight: []
  };
  $: gameInProgress = $storeGameInProgress;
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
  $: gameHistoryTurns = [];
  $: turnHistory = [];
  $: gameHistoryFlat = [];
  $: gameboardWidth = 0;
  $: gameboardHeight = 0;
  $: cellWidth = 0;
  $: cellHeight = 0;
  $: cellSize = 0;
  let shrinkFactor = 0.75;

  let rows, columns, size, numberOfPlayers;
  ({ rows, columns, size, numberOfPlayers } = settings);
  $: rows, columns, size, numberOfPlayers && resetGameBoard();

  onMount(() => {
    storeSettings.subscribe(value => {
      settings = value;
      ({ rows, columns, size, numberOfPlayers } = settings);
    });

    storePlayers.subscribe(value => {
      players = value;
    });
    storeCurrentPlayer.subscribe(value => {
      console.log(`GameBoard => storeCurrentPlayer subscribed`, value);
      currentPlayer = value;
    });
    storeGameHistoryFlat.subscribe(value => {});
    storeGameHistoryTurns.subscribe(value => {
      console.log(`GameBoard => storeGameHistoryTurns subscribed `, value);
      let ghls = localStorage.getItem("gameHistoryTurns");
      let parsedGhls = JSON.parse(ghls);
      console.log(`GameBoard => LS GameHistoryTurns subscribed `, parsedGhls);
    });

    setCellSize();
    storeCellSize.subscribe(value => {
      console.log(`GameBoard => storeCellSize subscribed`, value);
      // cellSize = value;
    });

    console.log(
      `GameBoard component mounted, gameboard el W:${gameboardWidth} H:${gameboardHeight}`
    );
    console.log(
      `GameBoard component mounted, for rows ${settings.rows} columns ${settings.columns} W:${cellWidth} H:${cellHeight}`
    );
    console.log(`GameBoard component mounted, and final size: ${cellSize}`);

    players = $storePlayers;
    currentPlayer = $storeCurrentPlayer;
    gameHistoryTurns = $storeGameHistoryTurns;
    state = $storeState;
    let delayMS = 1000 / (settings.rows * settings.columns);
    let gameInProgress = localStorage.getItem("gameInProgress");
    let playerDetails = localStorage.getItem("preservePlayerDetails");

    if (gameInProgress) {
      console.log(
        `GameBoard => if (gameInProgress) we should be redrawing the moves...`
      );
      buildGameGrid(settings.rows, settings.columns, cellSize, settings.gutter);
      renderGameBoardReload(delayMS);
      moveNumber = JSON.parse(localStorage.getItem("moveNumber"));
      gameHistoryTurns = JSON.parse(localStorage.getItem("gameHistoryTurns"));
      console.log(`Checking bool existence of LS gameHistoryTurns: ${Boolean(gameHistoryTurns)}`)
      if (!gameHistoryTurns) {
        gameHistoryTurns = [];
      }
      gameHistoryFlat = JSON.parse(localStorage.getItem("gameHistoryFlat"));
      if (gameHistoryFlat.length > 0) {
        storeGameInProgress.set(true);
        localStorage.setItem("gameInProgress", true);
      } else {
        storeGameInProgress.set(false);
        localStorage.removeItem("gameInProgress");
      }
      if (currentPlayer === false) {
        let currentPlayerLS = JSON.parse(localStorage.getItem("currentPlayer"));
        console.log(
          `GameBoard if (currentPlayer === false) `,
          currentPlayer,
          currentPlayerLS
        );
        storeCurrentPlayer.set(currentPlayerLS);
      }
    } else {
      state.movesRemaining = settings.movesPerTurn;
      buildGameGrid(settings.rows, settings.columns, cellSize, settings.gutter);
      storeState.set(state);
    }
    if (playerDetails) {
      players = JSON.parse(localStorage.getItem("players"));
      storePlayers.set(players);
    }
  });

  function setCellSize() {
    console.log(`|--|---|--|--|--|--|    setCellSize() called`);
    let gameboard = document.querySelector(".gameboard-container");
    gameboardWidth = gameboard.offsetWidth;
    gameboardHeight = gameboard.offsetHeight;
    cellWidth = parseInt((gameboardWidth / settings.columns) * shrinkFactor);
    cellHeight = parseInt((gameboardHeight / settings.rows) * shrinkFactor);
    console.log(
      `W:${typeof cellWidth} > H:${typeof cellHeight} ${typeof cellSize}`
    );
    // cellSize = cellWidth > cellHeight ? cellHeight : cellWidth
    if (cellWidth >= cellHeight) {
      console.log(`W:${cellWidth} > H:${cellHeight}`);
      cellSize = cellHeight;
    } else {
      console.log(`W:${cellWidth} < H:${cellHeight}`);
      cellSize = cellWidth;
    }
    storeCellSize.set(cellSize);
  }

  function moveNotification(e) {
    console.log(`GameBoard moveNOtification: `, e);
    playMove(getCellById(e.detail));
    dispatch("move", e.detail);
  }

  async function renderGameBoardReload(delayMS) {
    // console.log(
    //   `\n\nGameBoard => renderGameBoardReload called! We should see our ${settings.movesPerTurn} moves....`,
    //   gameHistoryTurns,
    //   `\n\n`
    // );
    let gameboard = document.getElementById("gameboard-board");
    let amount, number, len;
    gameHistoryTurns = JSON.parse(localStorage.getItem("gameHistoryTurns"));
    turnHistory = JSON.parse(localStorage.getItem("turnHistory"));

    await buildGameGrid(
      settings.rows,
      settings.columns,
      cellSize,
      settings.gutter
    );

    const delay = (amount = number) => {
      return new Promise(resolve => {
        setTimeout(resolve, amount);
      });
    };

    if (gameHistoryTurns) {
      if (gameHistoryTurns.length) {
        len = gameHistoryTurns.length;
      }
    }
    console.log(`turnHistory and len: ${turnHistory.len}; `, turnHistory);
    console.log(`gameHistoryTurns and len: ${len}; `, gameHistoryTurns);
    async function loopAndLockTurns(gameHistoryTurns, delayMS) {
      for (let i = 0; i < len; i++) {
        let turn = gameHistoryTurns[i];
        for (let j = 0; j < settings.movesPerTurn; j++) {
          // console.log(
          //   `\n\nGameBoard => renderGameBoardReload called! We should see our turn....`,
          //   turn,
          //   `\n\n`
          // );
          let move = turn[j];
          // console.log(
          //   `\n\nGameBoard => renderGameBoardReload called! We should see our move....`,
          //   move,
          //   `\n\n`
          // );
          let p = move.player.id;
          let cell = document.getElementById(move.id);
          cell.style = `--custom-bg: ${players[p].bgColor}`;
          cell.style.margin = settings.gutter + "px";
          cell.style.width = cellSize + "px";
          cell.style.height = cellSize + "px";
          cell.setAttribute("data-marker", players[p].marker);
          cell.setAttribute("data-ticked", true);
          cell.classList.add("locked", "ticked");
          cell.setAttribute("locked", true);
          cell.style.border = "1px solid rgba(0,0,0,0.5)";
          if (delayMS > 0) {
            await delay(delayMS);
          }
        }
      }
    }
    async function loopAndUnlockLastTurn(turnHistory, delayMS) {
      for (let i = 0; i < turnHistory.length; i++) {
        let move = turnHistory[i];
        let p = move.player.id;
        let cell = document.getElementById(move.id);
        cell.style = `--custom-bg: ${players[p].bgColor}`;
        cell.style.margin = settings.gutter + "px";
        cell.style.width = cellSize + "px";
        cell.style.height = cellSize + "px";
        cell.setAttribute("data-marker", players[p].marker);
        cell.setAttribute("data-ticked", true);
        cell.classList.add("ticked");
        cell.removeAttribute("locked");
        cell.style.border = "1px solid rgba(0,0,0,0.5)";
        if (delayMS > 0) {
          await delay(delayMS);
        }
      }
    }

    if (gameHistoryTurns) {
      await loopAndLockTurns(gameHistoryTurns, delayMS).then(next => {
        loopAndUnlockLastTurn(turnHistory, delayMS);
      });
    } else {
      console.log(`no gameHistoryTurns, just doing turnHistory:::::::::`);
      loopAndUnlockLastTurn(turnHistory, delayMS);
    }

    players = players;
  }
  async function resizeCells() {
    // debugger;
    setCellSize();
    for (let i = 0; i < grid.length; i++) {
      let line = grid[i];
      for (let j = 0; j < line.length; j++) {
        let gridCell = line[j];
        // console.log(`New resizeCells() function, checking cellSize ${cellSize}, gridCell: `, gridCell)
        let cell = document.getElementById(gridCell.id);
        setCustomBg(cell);
        cell.style.margin = settings.gutter + "px";
        cell.style.width = cellSize + "px";
        cell.style.height = cellSize + "px";
      }
    }
  }
  async function createDirectionArrays() {
    for (let i = 1; i <= 4; i++) {
      await makeLinesFrom(i);
    }
  }

  function addDirectionArraysToPlayerObjects() {
    // console.log(`\n\n addDirectionArraysToPlayerObjects `, players, `\n\n`)
    for (let i = 0; i < settings.numberOfPlayers; i++) {
      for (let x = 0; x <= 3; x++) {
        players[i]["scores"][x].id = x + 1;
        players[i].scores[x].name = scoreDirections[x].name;

        players[i].scores[x]["lines"] = lines[scoreDirections[x].name];
      }
    }
    localStorage.setItem("players", JSON.stringify(players));
    storePlayers.set(players);
  }

  function makeLinesFrom(dir) {
    let rows = settings.rows;
    let columns = settings.columns;
    let start,
      pattern = {};
    let theseLines = [],
      newLine = [];

    if (dir == 1) {
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
    lines = lines;
    storeDirectionArrays.set(lines);
    localStorage.setItem("directionArrays", JSON.stringify(lines));
    addDirectionArraysToPlayerObjects();
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
    let payload = { id: null, name: "none" };
    if (localStorage.getItem("gameHistoryFlat")) {
      let game = JSON.parse(localStorage.getItem("gameHistoryFlat"));
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

  async function buildGameGrid(rows, columns, size, gutter) {
    console.log(
      `buildGameGrid called with rows ${rows}, columns ${columns}, size ${size}, gutter ${gutter}`
    );
    state.reset = false;
    grid = [];
    for (let r = 0; r < rows; r++) {
      // console.log(`buildGameGrid creating a row ${r}`)
      grid.push([]);
      for (let c = 0; c < columns; c++) {
        // console.log(`buildGameGrid creating a col ${c}`)
        let id = `R${r}C${c}`;
        let cellAttributes = {
          id: id,
          row: r,
          column: c
        };
        grid[r].push(cellAttributes);
      }
    }
    await createDirectionArrays();
    await addDirectionArraysToPlayerObjects();
    grid = grid;
    return grid;
    console.log(`grid array from inside buildGameGrid: `, grid);
  }

  async function resetGameBoard() {
    // console.log(`\n resetGameBoard() called with settings `, settings, `\n \n`);

    // grid = []
    await buildGameGrid(
      settings.rows,
      settings.columns,
      cellSize,
      settings.gutter
    );
    // console.log(`New resizeCells() function about to be called `);
    await resizeCells();
    // console.log(`gameInProgress? `, gameInProgress);
    if (gameInProgress) {
      await renderGameBoardReload(0);
    }
  }

  function playMove(cell) {
    // console.log(
    //   `playMove ${cell.id}, gameHistoryFlat before operation: `,
    //   gameHistoryFlat
    // );
    if (localStorage.getItem("gameHistoryFlat")) {
      gameHistoryFlat = JSON.parse(localStorage.getItem("gameHistoryFlat"));
    }
    // console.log(
    //   `playMove ${cell.id}, gameHistoryFlat after LS before operation: `,
    //   gameHistoryFlat
    // );
    localStorage.setItem("gameInProgress", true);
    state.clickCount++;
    let id = cell.id;
    let ticked = cell.dataset.ticked == "true";
    cell.classList.add("ticked");

    if (ticked) {
      if (!cell.hasAttribute("locked")) {
        // setTurnHistory(cell);
        untickThis(cell);
        removePlayerMove(cell.id);
        moveNumber--;
      } else {
        // console.log(`It seems you tried to untick a locked move!`);
      }
    } else {
      if (state.movesRemaining <= 1) {
        moveNumber++;
        localStorage.setItem("moveNumber", JSON.stringify(moveNumber));
        setTurnHistory(cell);
        setGameHistoryTurns();
        tickThis(cell);
        playerChange();
        return;
      }
      moveNumber++;
      setTurnHistory(cell);
      tickThis(cell);
      state.movesRemaining--;
    }
    // console.log(`GameBoard => playMove, state `, state);
    localStorage.setItem("state", JSON.stringify(state));
    localStorage.setItem("moveNumber", JSON.stringify(moveNumber));
    storeState.set(state);
    // console.log(`GameBoard => playMove, state `, state);
  }

  function tickThis(cell) {
    // console.log(
    //   `tickThis(cell) BEFORE, cellSize ${cellSize} `,
    //   settings,
    //   cell
    // );
    console.log(
      "tickThis(cell) players, currentPlayer",
      players,
      currentPlayer
    );
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
    cell.style.margin = settings.gutter + "px";
    cell.style.width = cellSize + "px";
    cell.style.height = cellSize + "px";
    cell.setAttribute("data-marker", currentPlayer.marker);
    // console.log(
    //   `tickThis(cell) AFTER, cellSize ${cellSize} `,
    //   settings,
    //   cell
    // );
  }

  function setCustomBg(cell) {
    let row = cell.getAttribute("row");
    let column = cell.getAttribute("column");
    let rowFactor = 60 / settings.rows;
    let colFactor = settings.columns / 100;
    let hue = rowFactor * row + 210;
    let alpha = ((parseInt(column) + 1) / 200 / colFactor).toFixed(2);
    let customBg = `--custom-bg: hsla(${hue}, 50%, 50%, ${alpha});`;
    cell.style = customBg;
  }

  function untickThis(cell) {
    cell.classList.remove("ticked");
    setCustomBg(cell);
    cell.style.margin = settings.gutter + "px";
    cell.style.width = cellSize + "px";
    cell.style.height = cellSize + "px";
    cell.dataset.ticked = false;
    cell.removeAttribute("player-id");
    cell.removeAttribute("player-name");
    state.movesRemaining++;
  }

  function setPlayerMove(cellId) {
    // console.log(
    //   `setPlayerMove, gameHistoryFlat before operation: `,
    //   gameHistoryFlat
    // );
    if (gameHistoryFlat.length > 0) {
      gameHistoryFlat.forEach(move => {
        if (move.id == cellId) {
          // console.log(
          //   `setPlayerMove(cellId) => if (move.id ${move.id} == cellId ${cellId}) TRUE`
          // );
          move.player = {
            id: currentPlayer.id,
            name: currentPlayer.name
          };
          move.move = moveNumber;
        }
      });
    }
    // console.log(
    //   `setPlayerMove, gameHistoryFlat after operation: `,
    //   gameHistoryFlat
    // );
    // gameHistoryFlat = gameHistoryFlat
    storeGameHistoryFlat.set(gameHistoryFlat);
    localStorage.setItem("gameHistoryFlat", JSON.stringify(gameHistoryFlat));
  }

  function removePlayerMove(id) {
    // let thisIndex
    if (gameHistoryFlat.filter(move => move.id == id).length > 0) {
      // let filtered = gameHistoryFlat.filter(move => move.id === id);
      const thisIndex = gameHistoryFlat.map(e => e.id).indexOf(id);
      // console.log(
      //   `gameHistoryFlat already contains this move ${id} @index ${thisIndex} - that means we should remove it!`
      // );
      gameHistoryFlat.forEach((move, index) => {
        // console.log(
        //   `removePlayerMove => just filtered gameHistoryFlat, now need to reassign moveNumbers `
        // );
        // console.log(
        //   `removePlayerMove ${move.id} @index ${index} => moveNumber: ${move.move}, `
        // );
        if (index > thisIndex) {
          move.move--;
          // console.log(
          //   `removePlayerMove ${move.id} @index ${index} => moveNumber: ${move.move}`
          // );
        }
      });

      gameHistoryFlat = gameHistoryFlat.filter(move => move.id !== id);
    }

    storeGameHistoryFlat.set(gameHistoryFlat);
    localStorage.setItem("gameHistoryFlat", JSON.stringify(gameHistoryFlat));

    if (turnHistory.filter(move => move.id == id).length > 0) {
      //very elegant filter from https://stackoverflow.com/questions/7176908/how-to-get-index-of-object-by-its-property-in-javascript/54015295
      const thisIndex = turnHistory.map(e => e.id).indexOf(id);
      console.log(
        `turnHistory already contains this move ${id} @index ${thisIndex} - that means we should remove it!`
      );
      turnHistory.forEach((move, index) => {
        console.log(
          `removePlayerMove => just filtered turnHistory, now need to reassign moveNumbers `
        );
        console.log(
          `removePlayerMove ${move.id} @index ${index} => moveNumber: ${move.move}, `
        );
        if (index > thisIndex) {
          move.move--;
          console.log(
            `removePlayerMove ${move.id} @index ${index} => moveNumber: ${move.move}`
          );
        }
      });

      turnHistory = turnHistory.filter(move => move.id !== id);
    }

    storeGameHistoryTurns.set(turnHistory);
    localStorage.setItem("turnHistory", JSON.stringify(turnHistory));
  }

  function setTurnHistory(cell) {
    // console.log(`setTurnHistory => moveNumber ${moveNumber}`);
    let move = {};
    move["move"] = moveNumber;
    move["id"] = cell.id;
    move["clickCount"] = state.clickCount;
    move["player"] = {
      id: currentPlayer.id,
      name: currentPlayer.name
    };
    // console.log(`setTurnHistory(cell) ${cell.id}`, cell, state);
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
      gameHistoryFlat = [...gameHistoryFlat, move];
      storeGameHistoryFlat.set(gameHistoryFlat);
      localStorage.setItem("gameHistoryFlat", JSON.stringify(gameHistoryFlat));
      localStorage.setItem("turnHistory", JSON.stringify(turnHistory));
    }
  }

  function setGameHistoryTurns() {
    // console.log(`GameBoard => setGameHistoryTurns running`);
    let turnsPlayed = localStorage.getItem("gameHistoryTurns");
    if (turnsPlayed) {
      if (!turnsPlayed.length > 0) {
        gameHistoryTurns = [];
      }
    }

    turnHistory.forEach((turn, index) => {
      let pid = turn.player.id;
      let move = document.getElementById(`${turn.id}`);
      let thisMoveNum = moveNumber - settings.movesPerTurn + index + 1;
      // console.log(
      //   `thisMoveNum ${thisMoveNum} = moveNumber ${moveNumber} - settings.movesPerTurn ${settings.movesPerTurn} + index ${index} + 1;`
      // );
      move.setAttribute("locked", true);
      move.setAttribute("data-marker", players[pid].marker);
      turn.move = thisMoveNum;
      move.classList.add("locked");
      move.style.border = "1px solid rgba(0,0,0,0.5)";
    });
    console.log(
      `\n\n about to set gameHistoryTurns, is it good or null? `,
      gameHistoryTurns,
      `\n\n`
    );
    // if(!gameHistoryTurns) {}
    console.log(
      `Bool of gameHistoryTurns: ${Boolean(
        gameHistoryTurns
      )} and type of: ${typeof gameHistoryTurns}`
    );
    // gameHistoryTurns ? (gameHistoryTurns = []) : gameHistoryTurns;
    if (!gameHistoryTurns) {
      gameHistoryTurns = [];
    }
    console.log(
      `Bool of gameHistoryTurns: ${Boolean(
        gameHistoryTurns
      )} and type of: ${typeof gameHistoryTurns}`
    );
    gameHistoryTurns = [...gameHistoryTurns, turnHistory];
    storeGameHistoryTurns.set(gameHistoryTurns);
    localStorage.setItem("gameHistoryTurns", JSON.stringify(gameHistoryTurns));
    storeGameInProgress.set(true);
    storePreservePlayerDetails.set(true);
    turnHistory = [];
  }

  function playerChange() {
    storePreservePlayerDetails.set(true);
    turnHistory = [];
    let gameboard = document.getElementById("gameboard-board");
    gameboard.classList.add("player-change");
    setTimeout(() => {
      gameboard.classList.remove("player-change");
    }, 250);
    let playerIndicator = document.querySelector(".player-indicator");
    playerIndicator.classList.remove(`player-${currentPlayer.id}`);
    let id = currentPlayer.id;
    if (id >= settings.numberOfPlayers - 1) {
      // console.log(`#######################$$$$$$$$$$$$$$$$$$$$$$$$  inside playerChange,     if (id >= settings.numberOfPlayers - 1) {
      // currentPlayer = players[0];`);
      currentPlayer = players[0];
      playerIndicator.style = `--custom-bg: ${currentPlayer.bgColor}`;
    } else {
      currentPlayer = players[id + 1];
      playerIndicator.style = `--custom-bg: ${currentPlayer.bgColor}`;
    }

    state.movesRemaining = settings.movesPerTurn;
    state.currentPlayer = currentPlayer;
    // console.log(`GameBoard => playerChange, state `, state);
    storeState.set(state);
    storeCurrentPlayer.set(currentPlayer);
    localStorage.setItem("currentPlayer", JSON.stringify(currentPlayer));
    localStorage.setItem("state", JSON.stringify(state));
    localStorage.setItem("turnHistory", JSON.stringify(turnHistory));

    // console.log(
    //   `playerChanges, currentPlayer AFTER change:`,
    //   currentPlayer.name
    // );
    // console.log(`playerIndicator`, playerIndicator);
    playerIndicator.classList.add(`player-${currentPlayer.id}`);
  }
</script>

<style lang="scss">
  .row {
    display: flex;
  }
  .gameboard-board {
    border: 5px solid rgba(0,0,0,0);
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    transition: all .25s;
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

<div id="gameboard-board" class="gameboard-board">
  {#each grid as row}
    <div class="row">
      {#each row as cell}
        <Cell
          customSize
          ticked={false}
          customBg
          id={cell.id}
          row={cell.row}
          column={cell.column}
          on:move={moveNotification} />
      {/each}
    </div>
  {/each}
</div>
