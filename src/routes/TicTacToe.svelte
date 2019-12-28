<script>
  import { onMount } from "svelte";
  import GameBoard from "./../components/GameBoard.svelte";

  $: settings = {
    numberOfPlayers: 3,
    movesPerTurn: 5,
    cellsToScore: 3,
    bonusForCompleteRow: 5,
    rows: 10,
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

  $: gameboardMapped = [];
  $: tickedArray = [];
  $: scoredPlayers = [];
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
  $: lines = {
    leftToRight: [],
    topToBottom: [],
    diagonalDownLeft: [],
    diagonalDownRight: []
  };
  $: scores = [];

  onMount(() => {
    let gameboardMapped = ['test','two','three']
    console.log(`TicTacToe.svelte onMount`)
    console.log(`test props for GameBoard: gameboardMapped`)
    console.log(gameboardMapped)
    let storedPlayers = [];
    if (localStorage.getItem("scoredPlayers").length > 0) {
      storedPlayers = JSON.parse(localStorage.getItem("scoredPlayers"));
    }

    console.log("onMount, stored scoredPlayers length: ", storedPlayers.length);
    if (storedPlayers.length < 1) {
      console.log("onMount called initializePlayers()");
      initializePlayers();
      // renderGameBoard(
      //   settings.rows,
      //   settings.columns,
      //   settings.size,
      //   settings.gutter
      // );
      createDirectionArrays();
    } else {
      console.log("onMount called reloadPlayers()");
      reloadPlayers();
    }

    state.movesRemaining = settings.movesPerTurn;
    state.currentPlayer = scoredPlayers[0];
    setTimeout(() => {
      addStyles();
    }, 1);
    setGameSettings();
    // renderGameBoardReload();
  });

  function setGameSettings() {
    localStorage.setItem("gameSettings", {});
    localStorage.setItem("gameSettings", JSON.stringify(settings));
  }

  function saveGame() {
    localStorage.setItem(
      "savedGame",
      JSON.stringify({ gameboard: gameboardMapped, players: scoredPlayers })
    );

    let test = localStorage.getItem("savedGame");
    console.log("saveGame calling LS: ");
    console.log(JSON.parse(test));
  }

  function loadGame() {
    let saved = JSON.parse(localStorage.getItem("gameHistory"));
    let settings = JSON.parse(localStorage.getItem("gameSettings"));
    let ps = JSON.parse(localStorage.getItem("players"));
    console.log(
      `check for saved game: gameHistory, players, settings: `,
      saved,
      ps,
      settings
    );
    renderGameBoardReload();
  }

  function addStyles() {
    let scoreHeadings = document.querySelectorAll(".total-score");
    console.log(
      `addStyle function, scoreHeadings for total-score: `,
      scoreHeadings
    );
    scoreHeadings.forEach((h, i) => {
      h.style = `--custom-bg: ${scoredPlayers[i].bgColor}`;
    });
  }

  function reset() {
    localStorage.setItem("gameboard", []);
    localStorage.setItem("gameHistory", []);
    localStorage.setItem("gameboardMapped", []);
    localStorage.setItem("diagonalDownLeft", []);
    localStorage.setItem("diagonalDownRight", []);
    localStorage.setItem("topToBottom", []);
    localStorage.setItem("leftToRight", []);
    localStorage.setItem("scoredPlayers", []);
    settings.columns = document.getElementById("columns").value;
    settings.rows = document.getElementById("rows").value;
    settings.size = document.getElementById("size").value;
    settings.gutter = document.getElementById("gutter").value;
    renderGameBoard(
      settings.rows,
      settings.columns,
      settings.size,
      settings.gutter
    );
  }

  function initializePlayers() {
    scoredPlayers = [];
    for (let i = 0; i < settings.numberOfPlayers; i++) {
      scoredPlayers = [
        ...scoredPlayers,
        {
          id: i,
          name: `Player ${i + 1}`,
          totalScore: 0,
          bgColor: `hsla(${(i + 1) * (360 / settings.numberOfPlayers) +
            30}, 50%, 50%, .75)`,
          moves: 0,
          scores: [],
          dirScoresByIndex: [0, 0, 0, 0]
        }
      ];

      scoreDirections.forEach((direction, index) => {
        scoredPlayers[i]["scores"].push(direction);
        scoredPlayers[i]["scores"][index]["lines"] = lines[direction.name];
      });
    }
    scoredPlayers = scoredPlayers;
    localStorage.setItem("scoredPlayers", JSON.stringify(scoredPlayers));
    let playerIndicator = document.querySelector(".player-indicator");
    let id = state.currentPlayer.id;
    playerIndicator.style = `--custom-bg: ${scoredPlayers[0].bgColor}`;
  }

  function reloadPlayers() {
    scoredPlayers = JSON.parse(localStorage.getItem("scoredPlayers"));
    state.currentPlayer = scoredPlayers[0];

    scoredPlayers.forEach(player => {
      player.scores.forEach(direction => {
        direction.lines.forEach(line => {
          line.forEach(move => {
            let player = getMoveFromHistory(move.id);
            move.player = player;
            console.log(
              "reloadPlayers loop, each getMoveFromHistory player: ",
              player
            );
            console.log("reloadPlayers loop, each move's player: ", move);
            move = move;
            console.log(
              "reloadPlayers loop, each move's player: ",
              move.player
            );
          });
          line = line;
        });
        direction = direction;
      });
      player = player;
    });
    scoredPlayers = scoredPlayers;

    localStorage.setItem("scoredPlayers", JSON.stringify(scoredPlayers));
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

  function triggerGameBoardUpdate(e) {
    reset();
    e.target.style.width = `${e.target.value.toString().length + 0.5}ch`;
    // localStorage.setItem("gameHistory", []);
  }

  function updateGameSettings() {
    state.movesRemaining = settings.movesPerTurn;
  }

  function countPoints() {
    console.log(
      "*************__________countPoints called________**************"
    );
    console.log(
      "scoredPlayers from countPoints before checking localStorage: ",
      scoredPlayers
    );
    // let players = JSON.parse(localStorage.getItem('scoredPlayers'))

    localStorage.setItem("gameboardMapped", JSON.stringify(gameboardMapped));
    let players = scoredPlayers;
    if (localStorage.getItem("scoredPlayers")) {
      players = JSON.parse(localStorage.getItem("scoredPlayers"));
      console.log("using localStorage");
    }
    console.log(
      "scoredPlayers from countPoints after checking localStorage, before loop: ",
      players
    );
    console.log(
      "gameboardMapped from countPoints from localStorage before loop: ",
      gameboardMapped
    );
    players.forEach(player => {
      player.scores.forEach((direction, index) => {
        // console.log(
        //   `!!!!!! player.scores.forEach direction.name and index: ${direction.name}, ${index} !!!!!!!!!!!!!!!!!!!!!!!!!!`
        // );
        let thisScore = score(direction, player, index);
        // console.log(`!!!!!! POINTS  ${thisScore} !!!!!!!!!!!!!!!!!!!!!!!!!!`);
        player["dirScoresByIndex"][index] = thisScore;
        player["scores"][index]["dirScore"] = thisScore;
        let totalScore = player["dirScoresByIndex"].reduce((a, b) => a + b, 0);
        player["totalScore"] = totalScore;
        localStorage.setItem(
          `${direction.name}`,
          JSON.stringify(lines[direction.name])
        );
      });
    });
    scoredPlayers = players;
    localStorage.setItem(`scoredPlayers`, JSON.stringify(scoredPlayers));
  }

  function score(direction, player, idx) {
    // $: settings.cellsToScore
    // console.log(
    //   `score called with direction and player and idx ${idx}`,
    //   direction,
    //   player
    // );

    let dirLines = [];
    let dirScore = 0;
    let name = direction.name;

    direction.lines.forEach((line, index) => {
      let countInLine = 0;
      let countInLoop = 0;
      let points = 0;
      line.forEach(move => {
        console.log(`scoring ${move.id}`, move);
        let p = move.player;
        console.log(`scoring p = move.player, `, p);
        p = getPlayerFromCell(move.id);
        console.log(`scoring p = getPlayerFromCell, `, p);
        // move.player = {
        //   name: p.name,
        //   id: p.id
        // };
        if (p.name !== "none" && p.id === player.id) {
          countInLoop++;
        }
        if (p.id !== player.id) {
          if (countInLoop >= settings.cellsToScore) {
            points += countInLoop - (settings.cellsToScore - 1);
          }
          countInLine += countInLoop;
          countInLoop = 0;
        }
      });
      if (countInLoop >= settings.cellsToScore) {
        points += countInLoop - (settings.cellsToScore - 1);
      }
      dirLines.push({ countInLine: countInLine, points: points });
      // console.log(`dirLines `, dirLines)
      dirScore += points;
    });
    scoredPlayers = scoredPlayers;
    console.log(
      `score closing with direction score ${dirScore} | player: `,
      player
    );
    return dirScore;
  }

  function setPlayerMove(squareId) {
    console.log(
      `setPlayerMove(${squareId}) - state.currentPlayer.id ${state.currentPlayer.id}`
    );
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
    // scoredPlayers
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

  function getPlayerFromCell(id) {
    let payload;
    gameboardMapped.forEach(move => {
      if (move.id == id) {
        payload = move.player;
      }
    });
    return payload;
  }

  function createDirectionArrays() {
    for (let i = 1; i === 4; i++) {
      makeLinesFrom(i);
    }
    initializePlayers();
  }

  function makeLinesFrom(dir) {
    let start,
      pattern = {};
    let theseLines = [],
      newLine = [];

    if (dir == 1) {
      start = { row: 0, column: 0 };
      pattern = { row: 0, column: +1 };

      for (let i = 0; i < settings.columns; i++) {
        newLine = makeLineFrom(start, pattern);
        start.row++;
        theseLines.push(newLine);
      }
      lines.leftToRight = theseLines;
    }

    if (dir == 2) {
      start = { row: 0, column: 0 };
      pattern = { row: +1, column: 0 };

      for (let i = 0; i < settings.columns; i++) {
        newLine = makeLineFrom(start, pattern);
        start.column++;
        theseLines.push(newLine);
      }
      lines.topToBottom = theseLines;
    }

    if (dir == 3) {
      start = { row: settings.rows, column: 0 };
      pattern = { row: +1, column: +1 };

      for (let i = 0; i < settings.rows; i++) {
        start.row--;
        newLine = makeLineFrom(start, pattern);
        theseLines.push(newLine);
      }

      start = { row: 0, column: 1 };
      pattern = { row: +1, column: +1 };

      for (let i = 1; i < settings.columns; i++) {
        newLine = makeLineFrom(start, pattern);
        start.column++;
        theseLines.push(newLine);
      }
      lines.diagonalDownRight = theseLines;
    }

    if (dir == 4) {
      start = { row: settings.rows, column: settings.columns - 1 };
      pattern = { row: +1, column: -1 };

      for (let i = 0; i < settings.columns; i++) {
        start.row--;
        newLine = makeLineFrom(start, pattern);
        theseLines.push(newLine);
      }

      start = { row: 0, column: settings.columns - 1 };
      pattern = { row: +1, column: -1 };

      for (let i = 1; i < settings.columns; i++) {
        start.column--;
        newLine = makeLineFrom(start, pattern);
        theseLines.push(newLine);
      }
      lines.diagonalDownLeft = theseLines;
    }
  }

  function makeLineFrom(start, pattern) {
    let line = [];
    let nextLine = nextSquareFrom(
      start.row,
      start.column,
      pattern.row,
      pattern.column,
      line
    );
    return nextLine;
  }

  function nextSquareFrom(row, column, rowChange, columnChange, line) {
    line = [
      ...line,
      {
        id: `R${row}C${column}`,
        row: row,
        column: column,
        player: { id: null, name: "none" }
      }
    ];
    let nextRow = row + rowChange;
    let nextColumn = column + columnChange;
    let nextSquare = {
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

    nextSquare = nextSquareFrom(
      nextRow,
      nextColumn,
      rowChange,
      columnChange,
      line
    );
    return nextSquare;
  }

  function renderGameBoardReload() {
    let settings = JSON.parse(localStorage.getItem("gameSettings"));
    let gameboard = document.getElementById("gameboard-board");

    while (gameboard.firstChild) {
      gameboard.removeChild(gameboard.firstChild);
    }
    renderGameBoard(
      settings.rows,
      settings.columns,
      settings.size,
      settings.gutter
    );
    let history = state.gameHistory;
    let players = scoredPlayers;
    let amount, number;
    let len = history.length;

    const delay = (amount = number) => {
      return new Promise(resolve => {
        setTimeout(resolve, amount);
      });
    };
    async function loop(history) {
      for (let i = 0; i < len; i++) {
        let turn = history[i];
        // console.log(`building reload function, this turn is: `, turn);
        for (let j = 0; j < settings.movesPerTurn; j++) {
          let move = turn[j];
          let p = move.player.id;
          // console.log(`building reload function, this move is: `, move);
          // console.log(`building reload function, this player is: `, p);
          let square = document.getElementById(move.squareId);
          square.style = `--custom-bg: ${players[p].bgColor}`;
          square.style.margin = settings.gutter + "px";
          square.style.width = settings.size + "px";
          square.style.height = settings.size + "px";
          square.setAttribute("data-marker", "O");
          square.setAttribute("data-ticked", true);
          square.classList.add("locked", "ticked");
          square.setAttribute("locked", true);
          square.style.border = "1px solid rgba(0,0,0,0.5)";
          await delay(5);
        }
      }
    }

    if (localStorage.getItem("gameHistory")) {
      history = JSON.parse(localStorage.getItem("gameHistory"));
      // players = JSON.parse(localStorage.getItem("scoredPlayers"));
      loop(history);
    }
    scoredPlayers = players;
    console.log(`history length: ${len}, scoredPlayers`, scoredPlayers);
  }

  function setTurnHistory(square) {
    let move = {};
    let id = square.id;
    move["move"] = state.moveNumber;
    move["squareId"] = square.id;
    move["clickCount"] = state.clickCount;
    move["player"] = {
      id: state.currentPlayer.id,
      name: state.currentPlayer.name
    };
    if (state.turnHistory.filter(turn => turn.squareId == id).length > 0) {
      // console.log(
      //   `turnHistory already contains this move - that means we should remove it!`
      // );
      state.turnHistory = state.turnHistory.filter(
        turn => turn.squareId !== id
      );
    } else {
      // console.log(
      //   `apparently we have not made this move yet, let's add it to state.turnHistory`
      // );
      state.turnHistory = [...state.turnHistory, move];
    }
    console.log(state.turnHistory);
  }

  function setGameHistory(square) {
    state.gameHistory = [...state.gameHistory, state.turnHistory];
    state.turnHistory.forEach((turn, index) => {
      let move = document.getElementById(`${turn.squareId}`);
      let thisMoveNum = state.moveNumber - settings.movesPerTurn + index + 1;
      move.setAttribute("locked", true);
      move.setAttribute("data-marker", "O");
      turn.move = thisMoveNum;
      move.classList.add("locked");
      move.style.border = "1px solid rgba(0,0,0,0.5)";
    });
    state.turnHistory = [];
    localStorage.setItem(
      "state.gameHistory",
      JSON.stringify(state.gameHistory)
    );
  }

  function tickThis(square) {
    console.log("tickThis(square)");
    let id = square.id;
    let row = id[1];
    let column = id[3];
    lastTicked = {
      row: row,
      column: column,
      playerId: state.currentPlayer.id,
      playerName: state.currentPlayer.name
    };
    square.classList.add("ticked");
    square.dataset.ticked = true;
    square.setAttribute("player-id", state.currentPlayer.id);
    square.setAttribute("player-name", state.currentPlayer.name);
    square.style = `--custom-bg: ${state.currentPlayer.bgColor}`;
    square.setAttribute("data-marker", "O");
  }

  function untickThis(square) {
    console.log(`------------untickThis(square)`);
    square.classList.remove("ticked");
    square.style = "--custom-bg: rgba(150, 150, 255, 0.25)";
    square.dataset.ticked = false;
    square.removeAttribute("player-id");
    square.removeAttribute("player-name");
    // removeFromScoringArray(square)
    state.movesRemaining++;
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
      state.currentPlayer = scoredPlayers[0];
      playerIndicator.style = `--custom-bg: ${scoredPlayers[0].bgColor}`;
    } else {
      state.currentPlayer = scoredPlayers[id + 1];
      playerIndicator.style = `--custom-bg: ${scoredPlayers[id + 1].bgColor}`;
    }

    state.movesRemaining = settings.movesPerTurn;
    console.log(
      `playerChanges, state.currentPlayer.id AFTER change:`,
      state.currentPlayer.id
    );
    console.log(`playerIndicator`, playerIndicator);
    playerIndicator.classList.add(`player-${state.currentPlayer.id}`);
  }

  function setWidthByChars(e) {
    console.log(`setWidthByChars called`, e.target.style.width);
    // let len = e.target.value.toString().length
    e.target.style.width = `${e.target.value.toString().length + 0.5}ch`;
    console.log(e.target.style.width);
  }
</script>

<style lang="scss" global>
  .page-container {
    display: grid;
    grid-template-columns: 1fr 4fr;
  }

  .gameboard-container {
    background: #1a1a1a;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    color: #eee;
    justify-content: start;
    align-items: start;
    height: 90vh;
    overflow: hidden;
  }

  .player-status-bar {
    width: 100%;
    display: flex;
    justify-content: space-between;
    background: rgba(155, 55, 255, 0.75);
  }

  $title-margin: 1rem;
  $title-padding-horizontal: 1rem;
  $title-padding-vertical: 0.5rem;
  $calc-padding: 2 * $title-padding-horizontal;

  .player-indicator {
    width: calc(100% - (2 * #{$title-padding-horizontal}));
    background: var(--custom-bg);
    transition: all 0.5s;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
    padding: $title-padding-vertical $title-padding-horizontal;
    border-radius: 5px;
    border-bottom: 5px solid rgba(0, 255, 155, 0.85);

    & h2 {
      margin: 0;
    }
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

  .gameboard-board {
    margin: 2rem;
    display: flex;
    flex-direction: column;
    align-self: center;
    border: 0px solid none;
  }

  .game-row {
    display: flex;
  }

  .game-square {
    width: 24px;
    height: 24px;
    background: var(--custom-bg);
    border: 1px solid black;
    display: flex;
    justify-content: center;
    align-items: center;
    &:hover {
      background: rgba(150, 150, 255, 0.5);
    }
  }
  .ticked {
    &.unlocked {
      border: 1px solid red;
    }
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

  .player-change {
    transition: all 0.25s;
    // border: 50px solid red;
    background: rgba(155, 255, 155, 1);
  }

  button {
    padding: 1rem;
    border-radius: 3px;
    border: none;
    color: white;
    background: rgba(55, 255, 155, 0.5);
    &:hover {
      background: rgba(0, 25, 75, 1);
    }
  }

  .locked {
    opacity: 0.75;
    border: 1px solid rgba(0, 0, 0, 0.5);
    &::before {
      background: #000;
      display: block;
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: -2;
      opacity: 1;
    }
  }

  .control-button {
    background: rgba(0, 25, 75, 0.25);
    margin: 0.25rem;
    &:hover {
      background: rgba(0, 25, 75, 0.5);
    }
  }
  .dir-1 {
    display: flex;
    flex-direction: column;
  }
  .scores-wrap {
    display: flex;
    flex-direction: column;
    background: #1a1a1a;
  }
  .scores-block {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
  }
  .scores-section {
    display: flex;
    flex-direction: column;
  }

  .scoreboard-container {
    // position: absolute;
    // left: 0;
    background: rgba(0, 0, 155, 0.1);
  }
  .scoreboard-headings {
    background: rgba(0, 0, 155, 0.1);
  }
  .scoreboard-totals {
    background: rgba(0, 0, 155, 0.1);
  }
  .scoreboard-direction {
    background: rgba(0, 0, 155, 0.1);
    display: flex;
    // padding: .25rem;
  }

  .direction-icon {
    margin-left: 0.5rem;
    // background: #1a1a1a;
  }
  .direction-score-section {
    display: flex;
    justify-content: space-between;
    width: 100%;
  }
  .direction-score {
    justify-self: flex-end;
    margin-right: 0.5rem;
  }

  .total-score {
    background: var(--custom-bg);
    padding: 0.25rem;
    margin: 0;
    display: flex;
    justify-content: space-between;
  }

  .total-score-number {
    border: 2px solid white;
    padding: 0.25rem;
  }
</style>

<h1>Tic Tac Toe</h1>

<div class="page-container">
  <div class="scoreboard-container">
    {#each scoredPlayers as player}
      <div class="scoreboard-totals">
        <h3 class="total-score">
          <div>{player.name}:</div>
          <div class="total-score-number">{player.totalScore}</div>
        </h3>
        <div class="scoreboard-player">
          {#each player.scores as direction, i}
            <div class="scoreboard-direction">
              <div class="direction-score-section">
                <img
                  class="direction-icon"
                  src={direction.iconSrc}
                  width="20"
                  height="20"
                  alt="Icon for direction {direction.name}" />
                <div class="direction-name">{direction.name}:</div>
                <div class="direction-score">{player.dirScoresByIndex[i]}</div>
              </div>
            </div>
          {/each}
        </div>
      </div>
    {/each}
  </div>

  <div class="gameboard-container">
    <div class="player-indicator player-0">
      <h2 class="player-indicator-heading">
        Player: {state.currentPlayer.name}
      </h2>
      <h2 class="player-indicator-heading">
        Turn Moves: {state.movesRemaining}
      </h2>
      <h2 class="player-indicator-heading">Total Moves: {state.moveNumber}</h2>

      <div class="buttons-wrapper">
        <button class="control-button" id="next-turn-button">End turn</button>
        <button
          class="control-button"
          id="tally-game-button"
          on:click={countPoints}>
          Tally points
        </button>
        <button class="control-button" id="reset-game-button" on:click={reset}>
          Reset game
        </button>
        <button
          class="control-button"
          id="save-game-button"
          on:click={saveGame}>
          Save game
        </button>
        <button
          class="control-button"
          id="save-game-button"
          on:click={loadGame}>
          Load game
        </button>
      </div>
    </div>

    <h2>Layout and Game Options</h2>
    <div class="form-wrap">
      <label for="players">
        # Of Players:
        <input
          id="players"
          name="players"
          type="number"
          placeholder={settings.numberOfPlayers}
          bind:value={settings.numberOfPlayers}
          on:input={initializePlayers}
          style="width: 2.5ch;" />
      </label>
      <label for="rows">
        Rows:
        <input
          id="rows"
          name="rows"
          type="number"
          placeholder={settings.rows}
          value={settings.rows}
          on:input={triggerGameBoardUpdate}
          style="width: 2.5ch;" />
      </label>
      <label for="columns">
        Columns:
        <input
          id="columns"
          name="columns"
          type="number"
          placeholder={settings.columns}
          value={settings.columns}
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
          value={settings.size}
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
          placeholder={settings.gutter}
          value={settings.gutter}
          on:input={triggerGameBoardUpdate}
          style="width: 1.5ch;" />
      </label>
      <label for="movesPerTurn">
        Moves Per Turn:
        <input
          id="movesPerTurn"
          name="movesPerTurn"
          type="number"
          placeholder={settings.movesPerTurn}
          bind:value={settings.movesPerTurn}
          on:input={updateGameSettings}
          style="width: 1.5ch;" />
      </label>

    </div>
    <!-- 
    <div class="form-wrap">
      <h2>GAME OPTIONS</h2>
  
    </div> -->

  <GameBoard
  {gameboardMapped}
  {settings}
  {state} />
  </div>

</div>
