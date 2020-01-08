<script>
  import { onMount, afterUpdate, createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();
  import Cell from "./Cell.svelte";
  import {
    storeSettings,
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
  // $: settings.rows, settings.columns, resetGameBoard()

  if (typeof window !== "undefined") {
    console.log("we are running on the client");
    storeGameHistoryFlat.subscribe(value => {
      console.log(`GameBoard => storeGameHistoryFlat subscribed`, value);
      console.log(
        `GameBoard => storeGameHistoryFlat subscribed length: `,
        value.length
      );
    });

    storeGameHistoryTurns.subscribe(value => {
      console.log(`GameBoard => storeGameHistoryTurns subscribed `, value);
      let ghls = localStorage.getItem("gameHistoryTurns");
      // console.log(`GameBoard => storeGameHistoryTurns subscribed => localStorage.getItem("gameHistoryTurns")`, ghls);
      let parsedGhls = JSON.parse(ghls);
      // console.log(`GameBoard => storeGameHistoryTurns subscribed => JSON.parse(localStorage.getItem("gameHistoryTurns"))`, ghls);
    });
    storeCurrentPlayer.subscribe(value => {
      console.log(`GameBoard => storeCurrentPlayer subscribed`, value);
      // localStorage.setItem("currentPlayer", JSON.stringify(value));
    });
  } else {
    console.log("we are running on the server");
  }

  // $: ({rows} = settings) && resetGameBoard();
  // $: ({columns} = settings) && resetGameBoard();
  // $: rows
  // $: columns
  // $: settings.rows, settings.columns, resetGameBoard();
  let rows, columns;
  ({ rows } = settings)
  // $: console.log(`DESTRUCTURED ROWS ******************* ${rows}`)
  $: rows, resetGameBoard()
  // $: ({ rows } = settings), resetGameBoard();
  // $: ({ columns } = settings) && resetGameBoard();

  function moveNotification(e) {
    console.log(`GameBoard moveNOtification: `, e);
    playMove(getCellById(e.detail));
    dispatch("move", e.detail);
  }

  onMount(() => {
    console.log(`GameBoard component mounted`);

    // is this subscription necessary to place here, below?
    storeSettings.subscribe(value => {
      // console.log(`GameBoard => storeSettings.subscribe value => `, value);
      // this one is important!!! below
      settings = value;
      ({ rows } = settings)
      //  resetGameBoard();
    });

    storePlayers.subscribe(value => {
      // console.log(`GameBoard => storePlayers.subscribe value => `, value);
      // this is a good place to look for redundant code execution; this logs at least 10 times on reload
    });

    let gameboard = document.querySelector("#gameboard-board");
    players = $storePlayers;
    currentPlayer = $storeCurrentPlayer;
    gameHistoryTurns = $storeGameHistoryTurns;
    state = $storeState;
    let delayMS = 25;
    let gameInProgress = localStorage.getItem("gameInProgress");
    let playerDetails = localStorage.getItem("storePreservePlayerDetails");
    let newBoard = buildGameBoard(
      settings.rows,
      settings.columns,
      settings.size,
      settings.gutter
    );

    if (gameInProgress) {
      newBoard.then(() => {
        renderGameBoardReload(delayMS);
      });
      moveNumber = JSON.parse(localStorage.getItem("moveNumber"));
      gameHistoryTurns = JSON.parse(localStorage.getItem("gameHistoryTurns"));
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
      // storeCurrentPlayer.set(
      //   JSON.parse(localStorage.getItem("currentPlayer")) || {}
      // );
      console.log(`GameBoard => storeCurrentPlayer: `, $storeCurrentPlayer);
      // currentPlayer = JSON.parse(localStorage.getItem("currentPlayer"));
      // storeGameHistoryTurns.set(gameHistoryTurns)

      console.log(
        `GameBoard => onMount(), gameInProgress TRUE, gameHistoryTurns, currentPlayer `,
        gameHistoryTurns,
        currentPlayer
      );
      if (currentPlayer === false) {
        console.log(
          `GameBoard => onMount(), gameInProgress TRUE, currentPlayer === FALSE`,
          currentPlayer
        );
        currentPlayer = JSON.parse(localStorage.getItem("currentPlayer"));
        storeCurrentPlayer.set(currentPlayer);
        console.log(
          `GameBoard => onMount(), gameInProgress TRUE, currentPlayer === FALSE, set to LS `,
          currentPlayer
        );
      }
    } else {
      console.log(
        `GameBoard => onMount(), gameInProgress FALSE, gameHistoryTurns `,
        gameHistoryTurns
      );
      // state.currentPlayer = players[0];
      state.movesRemaining = settings.movesPerTurn;
      // console.log(`GameBoard => onMount(), state `, state);
      buildGameBoard(
        settings.rows,
        settings.columns,
        settings.size,
        settings.gutter
      );
      storeState.set(state);
      // localStorage.setItem("state", JSON.stringify(state));
    }
    if (playerDetails) {
      players = JSON.parse(localStorage.getItem("players"));
      storePlayers.set(players);
      // state.currentPlayer = players[0];
    } else {
    }
    // console.log(`GameBoard => onMount() after buildGameBoard, el: `, gameboard);
  });

  afterUpdate(() => {
    // let gameboard = document.querySelector("#gameboard-board");
    // console.log(`GameBoard => onMount() after buildGameBoard, el: `, gameboard);
  });

  function renderGameBoardReload(delayMS) {
    let gameboard = document.getElementById("gameboard-board");
    let amount, number, len;
    if (gameHistoryTurns) {
      console.log("renderGameBoardReload() => if (gameHistoryTurns) exists");
      if (gameHistoryTurns.length) {
        console.log(
          "renderGameBoardReload() => if (gameHistoryTurns.length) exists"
        );
        len = gameHistoryTurns.length;
        console.log(
          `renderGameBoardReload() => if (gameHistoryTurns) TRUE ${len}  `,
          gameHistoryTurns,
          turnHistory
        );
      }
    }

    turnHistory = JSON.parse(localStorage.getItem("turnHistory"));
    console.log(
      `renderGameBoardReload => turnHistory from LS is `,
      turnHistory
    );

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
    async function loopAndLockTurns(gameHistoryTurns, delayMS) {
      for (let i = 0; i < len; i++) {
        let turn = gameHistoryTurns[i];
        // console.log(`building reload function, this turn is: `, turn);
        for (let j = 0; j < settings.movesPerTurn; j++) {
          let move = turn[j];
          let p = move.player.id;
          // console.log(`loopAndLockTurns => this move is: `, move.id);
          // console.log(`building reload function, this player is: `, p);
          let cell = document.getElementById(move.id);
          // console.log(`building reload function, this cell is: `, cell);
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
    async function loopAndUnlockLastTurn(turnHistory, delayMS) {
      for (let i = 0; i < turnHistory.length; i++) {
        let move = turnHistory[i];
        // console.log(`building reload function, this turn is: `, turn);

        let p = move.player.id;
        // console.log(`building reload function, this move is: `, move.id);
        // console.log(`building reload function, this player is: `, p);
        let cell = document.getElementById(move.id);
        // console.log(`building reload function, this cell is: `, cell);
        cell.style = `--custom-bg: ${players[p].bgColor}`;
        cell.style.margin = settings.gutter + "px";
        cell.style.width = settings.size + "px";
        cell.style.height = settings.size + "px";
        cell.setAttribute("data-marker", players[p].marker);
        cell.setAttribute("data-ticked", true);
        cell.classList.add("ticked");
        cell.removeAttribute("locked");
        cell.style.border = "1px solid rgba(0,0,0,0.5)";
        await delay(delayMS);
      }
    }
    if (gameHistoryTurns) {
      loopAndLockTurns(gameHistoryTurns, delayMS).then(next => {
        loopAndUnlockLastTurn(turnHistory, delayMS);
      });
    } else {
      loopAndUnlockLastTurn(turnHistory, delayMS);
    }

    players = players;
  }

  async function createDirectionArrays() {
    console.log(
      "createDirectionArrays called, players, lines ",
      players,
      lines
    );
    for (let i = 1; i <= 4; i++) {
      // console.log(`makeLinesFrom ${i}`);
      await makeLinesFrom(i);
    }
  }

  function addDirectionArraysToPlayerObjects() {
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
    lines = lines;
    storeDirectionArrays.set(lines);
    // console.log(`\nAt end of createDirectionArrays, here they are: `, lines, `\n`)
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

  async function buildGameBoard(rows, columns, size, gutter) {
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
    // console.log(`GameBoard => buildGameBoard completed, grid: `, grid);
    await createDirectionArrays();
    addDirectionArraysToPlayerObjects();
    // console.log(`GameBoard => buildGameBoard completed, lines: `, lines);
    grid = grid;
    return grid;
  }

  async function clearGameBoard() {
    // console.log(`clearGameBoard called`);
    let gameboard = document.getElementById("gameboard-board");

    while (gameboard.firstChild) {
      // console.log(`renderGameBoardReload::: removing a DOM child el`);
      gameboard.removeChild(gameboard.firstChild);
    }
    grid = [];
  }

  async function resetGameBoard() {
    console.log(`\n resetGameBoard() called \n`)
    await clearGameBoard();
    buildGameBoard(
      settings.rows,
      settings.columns,
      settings.size,
      settings.gutter
    );
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
    // console.log("tickThis(cell)", cell);
    console.log("tickThis(cell) currentPlayer", currentPlayer);
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
    cell.classList.remove("ticked");
    let rowFactor = 60 / settings.rows;
    let colFactor = settings.columns / 100;
    let hue = rowFactor * row + 210;
    let alpha = ((parseInt(column) + 1) / 200 / colFactor).toFixed(2);
    let customBg = `--custom-bg: hsla(${hue}, 50%, 50%, ${alpha});`;
    cell.style = customBg;
    cell.dataset.ticked = false;
    cell.removeAttribute("player-id");
    cell.removeAttribute("player-name");
    state.movesRemaining++;
  }

  function setPlayerMove(cellId) {
    console.log(
      `setPlayerMove, gameHistoryFlat before operation: `,
      gameHistoryFlat
    );
    if (gameHistoryFlat.length > 0) {
      gameHistoryFlat.forEach(move => {
        if (move.id == cellId) {
          console.log(
            `setPlayerMove(cellId) => if (move.id ${move.id} == cellId ${cellId}) TRUE`
          );
          move.player = {
            id: currentPlayer.id,
            name: currentPlayer.name
          };
          move.move = moveNumber;
        }
      });
    }
    console.log(
      `setPlayerMove, gameHistoryFlat after operation: `,
      gameHistoryFlat
    );
    // gameHistoryFlat = gameHistoryFlat
    storeGameHistoryFlat.set(gameHistoryFlat);
    localStorage.setItem("gameHistoryFlat", JSON.stringify(gameHistoryFlat));
  }

  function removePlayerMove(id) {
    // let thisIndex
    if (gameHistoryFlat.filter(move => move.id == id).length > 0) {
      // let filtered = gameHistoryFlat.filter(move => move.id === id);
      const thisIndex = gameHistoryFlat.map(e => e.id).indexOf(id);
      console.log(
        `gameHistoryFlat already contains this move ${id} @index ${thisIndex} - that means we should remove it!`
      );
      gameHistoryFlat.forEach((move, index) => {
        console.log(
          `removePlayerMove => just filtered gameHistoryFlat, now need to reassign moveNumbers `
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
    console.log(`setTurnHistory => moveNumber ${moveNumber}`);
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
      console.log(
        `turnHistory already contains this move - that means we should remove it!`
      );
      turnHistory = turnHistory.filter(turn => turn.id !== cell.id);
    } else {
      console.log(
        `apparently we have not made this move yet, let's add it to turnHistory`
      );
      turnHistory = [...turnHistory, move];
      gameHistoryFlat = [...gameHistoryFlat, move];
      storeGameHistoryFlat.set(gameHistoryFlat);
      localStorage.setItem("gameHistoryFlat", JSON.stringify(gameHistoryFlat));
      localStorage.setItem("turnHistory", JSON.stringify(turnHistory));
    }
  }

  function setGameHistoryTurns() {
    console.log(`GameBoard => setGameHistoryTurns running`);
    let turnsPlayed = localStorage.getItem("gameHistoryTurns");
    if (turnsPlayed) {
      if (turnsPlayed.length > 0) {
        console.log(
          `if (localStorage.getItem("gameHistoryTurns"))****TRUE**** `,
          gameHistoryTurns.length,
          gameHistoryTurns
        );
        // gameHistoryTurns = JSON.parse(localStorage.getItem("gameHistoryTurns"));
        // console.log(
        //   `from LS gameHistoryTurns, `,
        //   gameHistoryTurns.length,
        //   gameHistoryTurns
        // );
      } else {
        gameHistoryTurns = [];
      }
    }

    turnHistory.forEach((turn, index) => {
      let pid = turn.player.id;
      let move = document.getElementById(`${turn.id}`);
      let thisMoveNum = moveNumber - settings.movesPerTurn + index + 1;
      console.log(
        `thisMoveNum ${thisMoveNum} = moveNumber ${moveNumber} - settings.movesPerTurn ${settings.movesPerTurn} + index ${index} + 1;`
      );
      move.setAttribute("locked", true);
      move.setAttribute("data-marker", players[pid].marker);
      turn.move = thisMoveNum;
      move.classList.add("locked");
      move.style.border = "1px solid rgba(0,0,0,0.5)";
    });
    gameHistoryTurns = [...gameHistoryTurns, turnHistory];
    storeGameHistoryTurns.set(gameHistoryTurns);
    localStorage.setItem("gameHistoryTurns", JSON.stringify(gameHistoryTurns));
    storeGameInProgress.set(true);
    storePreservePlayerDetails.set(true);
    turnHistory = [];
  }

  function playerChange() {
    localStorage.setItem("playerDetails", true);
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
      console.log(`#######################$$$$$$$$$$$$$$$$$$$$$$$$  inside playerChange,     if (id >= settings.numberOfPlayers - 1) {
      currentPlayer = players[0];`);
      currentPlayer = players[0];
      playerIndicator.style = `--custom-bg: ${currentPlayer.bgColor}`;
    } else {
      currentPlayer = players[id + 1];
      playerIndicator.style = `--custom-bg: ${currentPlayer.bgColor}`;
    }

    state.movesRemaining = settings.movesPerTurn;
    state.currentPlayer = currentPlayer;
    console.log(`GameBoard => playerChange, state `, state);
    storeState.set(state);
    storeCurrentPlayer.set(currentPlayer);
    localStorage.setItem("currentPlayer", JSON.stringify(currentPlayer));
    localStorage.setItem("state", JSON.stringify(state));
    localStorage.setItem("turnHistory", JSON.stringify(turnHistory));

    console.log(
      `playerChanges, currentPlayer AFTER change:`,
      currentPlayer.name
    );
    console.log(`playerIndicator`, playerIndicator);
    playerIndicator.classList.add(`player-${currentPlayer.id}`);
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

<!-- <div class="debug">
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
    <h2>storeGameHistoryTurns</h2>
    {#each gameHistoryTurns as turn}
      {#each turn as move}
        <div>{move.id}-{move.player.name}</div>
      {/each}
    {/each}
  </div>
</div> -->
