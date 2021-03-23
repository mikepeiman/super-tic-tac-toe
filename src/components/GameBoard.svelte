<script>
  import { onMount, afterUpdate, createEventDispatcher } from "svelte";
  import Loading from "./../components/Loading.svelte";

  const dispatch = createEventDispatcher();
  import Cell from "./Cell.svelte";
  import {
    storeSettings,
    storeCellSize,
    storeGameboardWidth,
    storeState,
    storeMoveNumber,
    storeMovesRemaining,
    storePlayers,
    storeCurrentPlayer,
    storeDirectionArrays,
    storeGameInProgress,
    storeTurnHistory,
    storeGameHistoryTurns,
    storeFinalTurnCompleted,
    storePreservePlayerDetails,    
    storeGameHistoryFlat
  } from "../stores.js";

  let customMarkerSize, currentPlayerMark, gameboardWidth;
  let settings = {};
  $: state = {};
  $: moveNumber = 0;
  $: movesRemaining = 0;
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
  $: gameboardContainerWidth = 0;
  $: gameboardContainerHeight = 0;
  $: cellWidth = 0;
  $: cellHeight = 0;
  $: cellSize = 0;

  let rows, columns, size, numberOfPlayers, sizeFactor;
  ({ rows, columns, size, numberOfPlayers, sizeFactor } = settings);
  $: rows && resetGameBoard(`reactive resetGameBoard() from rows  ${rows}`);
  $: columns &&
    resetGameBoard(`reactive resetGameBoard() from columns ${columns}`);
  $: size && resetGameBoard(`reactive resetGameBoard() from size ${size}`);
  $: numberOfPlayers &&
    resetGameBoard(
      `reactive resetGameBoard() from numberOfPlayers ${numberOfPlayers}`
    );
  $: sizeFactor &&
    resetGameBoard(`reactive resetGameBoard() from sizeFactor ${sizeFactor}`);

  onMount(async () => {
    storeSettings.subscribe(value => {
      settings = value;
      ({ rows, columns, size, numberOfPlayers, sizeFactor } = settings);
    });

    storePlayers.subscribe(value => {
      players = value;
      // console.log(`GameBoard => storePlayers.subscribe ||| YES assigned! length: ${players.length}`)
    });
    storeCurrentPlayer.subscribe(async value => {
      console.log(`GameBoard => storeCurrentPlayer subscribed`, value);
      currentPlayer = value;
      // await grid.length;
      resetGameBoard();
    });
    storeGameHistoryFlat.subscribe(value => {});
    storeGameHistoryTurns.subscribe(value => {
      // console.log(`GameBoard => storeGameHistoryTurns subscribed `, value);
      let ghls = localStorage.getItem("gameHistoryTurns");
      let parsedGhls = JSON.parse(ghls);
      // console.log(`GameBoard => LS GameHistoryTurns subscribed `, parsedGhls);
    });
    // await grid.length;
    setCellSize();
    window.addEventListener(
      "resize",
      async function() {
        // console.log("GameBoard resize!");
        // await setCellSize();
        setCellSize();
        // console.log("GameBoard resize awaited cellSize!");
        resetGameBoard();
        // console.log("GameBoard resize reset gameboard!");
      },
      true
    );
    storeCellSize.subscribe(value => {
      // console.log(`GameBoard => storeCellSize subscribed`, value);
      // cellSize = value;
    });

    players = $storePlayers;
    currentPlayer = $storeCurrentPlayer;
    gameHistoryTurns = $storeGameHistoryTurns;
    state = $storeState;
    // ({ moveNumber, movesRemaining } = state);
    let delayMS = 1000 / (settings.rows * settings.columns);
    let gameInProgress = localStorage.getItem("gameInProgress");
    let playerDetails = localStorage.getItem("preservePlayerDetails");

    if (gameInProgress) {
      // console.log(
      //   `GameBoard => if (gameInProgress) we should be redrawing the moves...`
      // );
      buildGameGrid(settings.rows, settings.columns, cellSize, settings.gutter);
      renderGameBoardReload(delayMS);
      moveNumber = JSON.parse(localStorage.getItem("moveNumber"));
      gameHistoryTurns = JSON.parse(localStorage.getItem("gameHistoryTurns"));
      // console.log(
      //   `Checking bool existence of LS gameHistoryTurns: ${Boolean(
      //     gameHistoryTurns
      //   )}`
      // );
      if (!gameHistoryTurns) {
        gameHistoryTurns = [];
      }
      gameHistoryFlat = JSON.parse(localStorage.getItem("gameHistoryFlat"));
      if (gameHistoryFlat.length > 0) {
        storeGameInProgress.set(true);
      } else {
        storeGameInProgress.set(false);
        localStorage.removeItem("gameInProgress");
      }
      if (currentPlayer === false) {
        let currentPlayerLS = JSON.parse(localStorage.getItem("currentPlayer"));
        // console.log(
        //   `GameBoard if (currentPlayer === false) `,
        //   currentPlayer,
        //   currentPlayerLS
        // );
        storeCurrentPlayer.set(currentPlayerLS);
      }
    } else {
      state.movesRemaining = settings.movesPerTurn;
      buildGameGrid(settings.rows, settings.columns, cellSize, settings.gutter);
      storeState.set(state);
    }
    if (playerDetails) {
      players = JSON.parse(localStorage.getItem("players"));
      // storePlayers.set(players);
    }
  });

  async function setCellSize() {
    // console.log(`|--|---|--|--|--|--|    setCellSize() called`);
    let gameboardContainer = document.querySelector(".gameboard-container");

    // await grid.length
    gameboardContainerWidth = gameboardContainer.offsetWidth;
    gameboardContainerHeight = gameboardContainer.offsetHeight;
    cellWidth = parseInt(
      (((gameboardContainerWidth / settings.columns) * settings.sizeFactor) /
        100) *
        0.9
    );
    cellHeight = parseInt(
      (((gameboardContainerHeight / settings.rows) * settings.sizeFactor) /
        100) *
        0.9
    );
    // console.log(
    //   `gameboardContainerWidth:${gameboardContainerWidth} | gameboardContainerHeight:${gameboardContainerHeight} cellSize: ${cellSize}`
    // );
    // console.log(`W:${cellWidth} | H:${cellHeight} cellSize: ${cellSize}`);
    if (gameboardContainerWidth > gameboardContainerHeight) {
      // console.log(
      //   `gameboardContainerWidth:${gameboardContainerWidth} >>>> gameboardContainerHeight:${gameboardContainerHeight} sizeFactor: ${sizeFactor}`
      // );
    } else {
      // console.log(
      //   `gameboardContainerWidth:${gameboardContainerWidth} <<<< gameboardContainerHeight:${gameboardContainerHeight} sizeFactor: ${sizeFactor}`
      // );
    }

    // cellSize = cellWidth > cellHeight ? cellHeight : cellWidth
    if (cellWidth >= cellHeight) {
      // console.log(`W:${cellWidth} > H:${cellHeight}`);
      cellSize = cellHeight;
    } else {
      // console.log(`W:${cellWidth} < H:${cellHeight}`);
      cellSize = cellWidth;
    }
    storeCellSize.set(cellSize);
    // let gameboardContainerWidth = settings.columns * cellSize
  }

  function moveNotification(e) {
    console.log(`GameBoard moveNOtification: `, e);
    playMove(getCellById(e.detail));
    dispatch("move", e.detail);
  }

  const delay = (amount = number) => {
    return new Promise(resolve => {
      setTimeout(resolve, amount);
    });
  };

  async function renderGameBoardReload(delayMS) {
    // console.log(
    //   `\n\nGameBoard => renderGameBoardReload called! We should see our ${settings.movesPerTurn} moves....`,
    //   gameHistoryTurns,
    //   `\n\n`
    // );
    let gameboard = document.getElementById("gameboard");
    let amount, number, len;
    gameHistoryTurns = JSON.parse(localStorage.getItem("gameHistoryTurns"));
    turnHistory = JSON.parse(localStorage.getItem("turnHistory"));

    await buildGameGrid(
      settings.rows,
      settings.columns,
      cellSize,
      settings.gutter
    );

    if (gameHistoryTurns) {
      if (gameHistoryTurns.length) {
        len = gameHistoryTurns.length;
      }
    }
    // console.log(
    //   `renderGameBoardReload() => turnHistory and len: ${turnHistory.len}; `,
    //   turnHistory
    // );
    // console.log(
    //   `renderGameBoardReload() => gameHistoryTurns and len: ${len}; `,
    //   gameHistoryTurns
    // );
    // console.log(
    //   `renderGameBoardReload() => settings num players and players.length: ${settings.numberOfPlayers} players ${players.length} `
    // );
    async function loopAndLockTurns(gameHistoryTurns, delayMS) {
      for (let i = 0; i < len; i++) {
        let turn = gameHistoryTurns[i];
        for (let j = 0; j < turn.length; j++) {
          // console.log(
          //   `\n\nGameBoard => renderGameBoardReload called! We should see our turn....`,
          //   turn,
          //   `\n\n`
          // );
          let move = turn[j];
          // console.log(
          //   `\n\nGameBoard => renderGameBoardReload called! We should see our move....`,
          //   move,
          //   `\n\n`,
          //   `move.player`,
          //   move.player
          // );
          let p = move.player.id;
          let cell = document.getElementById(move.id);
          let customColor = `--player-color: ${players[p].colorMain}`;
          customMarkerSize = `--cell-mark-size: ${Math.floor(cellSize / 2)}px`;
          cell.style = `${customColor}; ${customMarkerSize}`;
          cell.style.margin = settings.gutter + "px";
          cell.style.width = cellSize + "px";
          cell.style.height = cellSize + "px";
          cell.setAttribute("data-mark", players[p].mark);
          cell.setAttribute("data-ticked", true);
          // cell.setAttribute("data-locked", true);
          cell.classList.add("locked", "ticked");
          cell.classList.remove("unticked");
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
        cell.style = `--player-color: ${players[p].colorMain}`;
        cell.style.margin = settings.gutter + "px";
        cell.style.width = cellSize + "px";
        cell.style.height = cellSize + "px";
        cell.setAttribute("data-mark", players[p].mark);
        cell.setAttribute("data-ticked", true);
        cell.classList.add("ticked");
        cell.classList.remove("unticked");
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
        setCustomStyles(cell);
        cell.style.margin = settings.gutter + "px";
        cell.style.width = cellSize + "px";
        cell.style.height = cellSize + "px";
      }
    }
  }

  async function tickFinalTurnMoves() {
    // loop through gameboard cells to build an array of those whose data-attribute data-ticked is false (!data-ticked)
    // run the renderGameBoardReload with argument so it does not redraw, but only draws the final moves with the
    // small animation delay (add transitions for smoother effect?)
    console.log(`tickFinalTurnMoves rows ${rows} and columns ${columns}`);
    let unticked = [];
    let p = currentPlayer.id;
    let customColor = `--player-color: ${players[p].colorMain}`;
    let customMarkerSize = `--cell-mark-size: ${Math.floor(cellSize / 2)}px`;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < columns; c++) {
        let id = `R${r}C${c}`;
        let cell = document.getElementById(id);
        // console.log(`tickFinalTurnMoves cell id ${id}`, cell);
        let ticked = cell.getAttribute("data-ticked");
        // console.log(`data-ticked: ${ticked}`);
        if (ticked === "false") {
          let delayMS = 67;
          if (delayMS > 0) {
            await delay(delayMS);
          }
          moveNumber++;
          state.movesRemaining--;
          storeState.set(state);
          storeMoveNumber.set(moveNumber);
          setTurnHistory(cell);
          // tickThis(cell);
          cell.style = `${customColor}; ${customMarkerSize}`;
          cell.style.margin = settings.gutter + "px";
          cell.style.width = cellSize + "px";
          cell.style.height = cellSize + "px";
          cell.setAttribute("data-mark", players[p].mark);
          cell.setAttribute("data-ticked", true);
          cell.classList.add("locked", "ticked");
          cell.classList.remove("unticked");
          cell.setAttribute("locked", true);
          cell.style.border = "1px solid rgba(0,0,0,0.5)";
        }
      }
    }
    console.log(`tickFinalTurnMoves just completed, turnHistory from store = `, $storeGameHistoryTurns)
    console.log(`tickFinalTurnMoves just completed, turnHistory from store = `, $storeGameHistoryTurns)
    setGameHistoryTurns();
    storeTurnHistory.set([])
  }

  async function createDirectionArrays() {
    for (let i = 1; i <= 4; i++) {
      await makeLinesFrom(i);
    }
  }

  function addDirectionArraysToPlayers() {
    // console.log(`\n\n addDirectionArraysToPlayers `, players, settings.numberOfPlayers, `\n\n`)
    for (let i = 0; i < settings.numberOfPlayers; i++) {
      // next loop is to set the four direction array to each player object .scores property
      for (let x = 0; x <= 3; x++) {
        players[i]["scores"][x].id = x + 1;
        players[i].scores[x].name = scoreDirections[x].name;

        players[i].scores[x]["lines"] = lines[scoreDirections[x].name];
      }
    }
    storePlayers.set(players);
  }

  async function makeLinesFrom(dir) {
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
    // localStorage.setItem("directionArrays", JSON.stringify(lines));
    await players;
    addDirectionArraysToPlayers();
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
    // console.log(
    //   `buildGameGrid called with rows ${rows}, columns ${columns}, size ${size}, gutter ${gutter}`
    // );
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
    await players;

    // grid = grid;
    await createDirectionArrays();
    await addDirectionArraysToPlayers();
    return grid;
  }

  async function resetGameBoard(message) {
    // console.log(`\n resetGameBoard() called with message `, message, `\n \n`);

    // grid = []
    await buildGameGrid(
      settings.rows,
      settings.columns,
      cellSize,
      settings.gutter
    );
    // waitedGrid.then(() => {
    //   resizeCells()
    // })
    // console.log(`resizeCells() function about to be called `);
    resizeCells();
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
    cell.classList.remove("unticked");

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
        storeMoveNumber.set(moveNumber);
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
    // localStorage.setItem("state", JSON.stringify(state));
    // localStorage.setItem("moveNumber", JSON.stringify(moveNumber));
    storeMoveNumber.set(moveNumber);
    storeState.set(state);
    // console.log(`GameBoard => playMove, state `, state);
  }

  function tickThis(cell) {
    console.log(`tickThis(cell) BEFORE, cellSize ${cellSize} `, settings, cell);
    dispatch("moveNotification", cell);
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
    cell.classList.remove("unticked");
    cell.dataset.ticked = true;
    cell.setAttribute("player-id", currentPlayer.id);
    cell.setAttribute("player-name", currentPlayer.name);
    let customMarkerSize = `--cell-mark-size: ${Math.floor(cellSize / 3)}px`;
    let playerColor = `--player-color: ${currentPlayer.colorMain}`;
    cell.style = `${playerColor};${customMarkerSize};`;
    cell.style.margin = settings.gutter + "px";
    cell.style.width = cellSize + "px";
    cell.style.height = cellSize + "px";
    cell.setAttribute("data-mark", currentPlayer.mark);
    // console.log(
    //   `tickThis(cell) AFTER, cellSize ${cellSize} `,
    //   settings,
    //   cell
    // );
  }

  function setCustomStyles(cell) {
    let row = cell.getAttribute("row");
    let column = cell.getAttribute("column");
    let rowFactor = 60 / settings.rows;
    let colFactor = settings.columns / 100;
    let hue = rowFactor * row + 210;
    let alpha = ((parseInt(column) + 1) / 200 / colFactor).toFixed(2);
    let ggBg = `--gg-bg: hsla(${hue}, 50%, 50%, ${alpha});`;
    currentPlayerMark = `--player-mark: '${currentPlayer.mark}'`;
    // console.log(
    //   `setCustomStyles: currentPlayerMark ${currentPlayerMark}, customMarkerSize ${customMarkerSize}`
    // );
    cell.style = `${ggBg}; ${customMarkerSize}; ${currentPlayerMark}`;
  }

  function untickThis(cell) {
    cell.classList.remove("ticked");
    cell.classList.add("unticked");
    setCustomStyles(cell);
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
    storeTurnHistory.set(turnHistory);
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
      storeTurnHistory.set(turnHistory);
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
      move.setAttribute("data-mark", players[pid].mark);
      turn.move = thisMoveNum;
      move.classList.add("locked");
      move.style.border = "1px solid rgba(0,0,0,0.5)";
    });
    // console.log(
    //   `\n\n about to set gameHistoryTurns, is it good or null? `,
    //   gameHistoryTurns,
    //   `\n\n`
    // );
    // if(!gameHistoryTurns) {}
    // console.log(
    //   `Bool of gameHistoryTurns: ${Boolean(
    //     gameHistoryTurns
    //   )} and type of: ${typeof gameHistoryTurns}`
    // );
    // gameHistoryTurns ? (gameHistoryTurns = []) : gameHistoryTurns;
    if (!gameHistoryTurns) {
      gameHistoryTurns = [];
    }
    // console.log(
    //   `Bool of gameHistoryTurns: ${Boolean(
    //     gameHistoryTurns
    //   )} and type of: ${typeof gameHistoryTurns}`
    // );
    gameHistoryTurns = [...gameHistoryTurns, turnHistory];
    storeGameHistoryTurns.set(gameHistoryTurns);
    // localStorage.setItem("gameHistoryTurns", JSON.stringify(gameHistoryTurns));
    storeGameInProgress.set(true);
    // storePreservePlayerDetails.set(true);
    turnHistory = [];
  }

  function playerChange() {
    // storePreservePlayerDetails.set(true);
    turnHistory = [];
    let gameboard = document.getElementById("gameboard");
    gameboard.classList.add("player-change");
    setTimeout(() => {
      gameboard.classList.remove("player-change");
    }, 500);
    let statusBar = document.querySelector(".statusbar-slim-wrapper");
    statusBar.classList.remove(`player-${currentPlayer.id}`);
    let id = currentPlayer.id;
    if (id >= settings.numberOfPlayers - 1) {
      // console.log(`#######################$$$$$$$$$$$$$$$$$$$$$$$$  inside playerChange,     if (id >= settings.numberOfPlayers - 1) {
      // currentPlayer = players[0];`);
      currentPlayer = players[0];
      statusBar.style = `--player-color: ${currentPlayer.colorMain}`;
    } else {
      currentPlayer = players[id + 1];
      statusBar.style = `--player-color: ${currentPlayer.colorMain}`;
    }

    state.movesRemaining = settings.movesPerTurn;
    state.currentPlayer = currentPlayer;
    // console.log(`GameBoard => playerChange, state `, state);
    storeState.set(state);
    storeCurrentPlayer.set(currentPlayer);
    localStorage.setItem("currentPlayer", JSON.stringify(currentPlayer));
    localStorage.setItem("state", JSON.stringify(state));
    storeTurnHistory.set(turnHistory);
    statusBar.classList.add(`player-${currentPlayer.id}`);

    // check if this is the last move
    let movesPerGame =
      (settings.rows * settings.columns) / settings.movesPerTurn;
    let movesPlayed = moveNumber / settings.movesPerTurn;
    let checkForLastTurn = movesPerGame - movesPlayed;

    console.log(
      `checkForLastTurn value (turns remaining): ${checkForLastTurn}`
    );

    if (checkForLastTurn === 1) {
      console.log(`checkForLastTurn says FINAL TURN!!!!`);
      tickFinalTurnMoves();
      dispatch("finalturn", true);
      storeFinalTurnCompleted.set(true)
    }
  }
</script>

<style lang="scss">
  .row {
    display: flex;
  }
  .gameboard-board {
    // outline: 12px solid rgba(0, 0, 0, 0.5);
    // outline-offset: -7px;
    padding: 6px;
    border: 6px solid var(--player-color); //rgba(255, 255, 255, 0.25);
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    transition: all 0.45s;
    // box-shadow: 0 0 24px 6px rgba(26, 26, 26, 1);
  }
</style>

<!-- {@debug grid} -->
{#if grid.length}
  <div id="gameboard" class="gameboard-board">
    {#each grid as row}
      <div class="row">
        {#each row as cell}
          <Cell
            customSize
            customMarkSize
            customMark
            ticked={false}
            ggBg
            id={cell.id}
            row={cell.row}
            column={cell.column}
            on:move={moveNotification} />
        {/each}
      </div>
    {/each}
  </div>
{:else}
  <Loading
    loadingMsg="GameBoard awaiting generate grid..."
    thisId="gameboard" />
{/if}
