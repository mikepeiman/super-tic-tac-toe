<script>
  import { onMount } from "svelte";
  import GameBoard from "./../components/GameBoard.svelte";
  import ScoreBoard from "./../components/ScoreBoard.svelte";
  import StatusBar from "./../components/StatusBar.svelte";
  import MainMenu from "./../components/MainMenu.svelte";
  import GameInit from "./../components/GameInit.svelte";
  import { writable } from "svelte/store";
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

  storeState.subscribe(value => {
    // console.log(`TicTacToe => storeState.subscribe value => `, value);
    // state = value
  });
  storeSettings.subscribe(value => {
    // console.log(`TicTacToe => storeSettings.subscribe value => `, value);
  });
  storeGameInProgress.subscribe(value => {
    // console.log(`TicTacToe => storeGameInProgress subscribed`, value);
  });
  storePlayers.subscribe(value => {
    // console.log(`TicTacToe => storePlayers subscribed`, value);
  });
  storePreservePlayerDetails.subscribe(value => {
    // console.log(`TicTacToe => storePreservePlayerDetails subscribed`, value);
  });
  // const unsubState = storeState.subscribe(value => {
  //   console.log(`TicTacToe => storeState unsubscribe value => `, value);
  //   // state = value
  // });
  // const unsubSettings = storeSettings.subscribe(value => {
  //   console.log(`TicTacToe => storeSettings unsubscribe value => `, value);
  // });

  $: state = null;
  $: players = null;
  $: settings = null;
  $: gameboardMapped = [];

  onMount(() => {
    console.log(`TicTacToe.svelte onMount`);
    // there are three things to deal with in getting a game ready to go:
    // 1. Settings (game options and gameboard setup) => get these from the MainMenu
    // 2. Players (if they have any custom details) => get this from store or LS
    // 3. History (if a game is in progress, tracking turns and moves done and current player state) => get this from store or LS

    // check if there is a game in progress via boolean flag or check data
    // we want to preserve the games turns and moves history if it exists
    // we also want to preserve player details if they exist (name, marker, colors)
    //
    // if gameHistory length is not zero:
    //  reload the game from gamehistory
    //  else, redraw gameboard from settings and check for existing players
    // if players array exists, preserve it
    // else, initialize players array
  });

  function resetGame() {
    console.log(`TicTacToe => reset bubbled from StatusBar`);
    // state.reset = true;
    setTimeout(() => {
      // state.reset = false;
    }, 10);
  }

  function moveNotification(cell) {
    console.log(`TicTacToe.svelte moveNotification for `, cell.detail);
    // state = state;
  }

  function setPlayersToStore(e) {
    console.log(
      `TicTacToe => setPlayersToStore triggered by player init or detail change`,
      e.detail
    );
    players = e.detail;
    players.forEach(player => {
      console.log(player.name, player.marker);
    });
    storePlayers.set(players);
  }
</script>

<style lang="scss" global>
  $input-blue: rgba(50, 200, 255, 1);
  #topnav {
    background: #1a1a1a;
    color: #006f98;
    border-bottom: 1px solid rgba(0,0,0,0);
  }

  #layout-main {
    background: #1a1a1a;
  }

  .page-container {
    display: grid;
    grid-template-columns: 1fr 4fr 1fr;
    grid-template-areas:
      "scoreboard statusbar statusbar"
      "scoreboard gameboard mainmenu";
    // background: #1a1a1a;
    height: 100%;
  }

  .gameboard-container {
    grid-area: gameboard;
    display: flex;
    flex-direction: column;
    color: #eee;
    justify-content: start;
    align-items: start;
    // overflow: hidden;
    margin-bottom: 2rem;
  }
  .scoreboard-container {
    grid-area: scoreboard;
    margin: 1rem 0 0 0;
  }
  .statusbar-container {
    grid-area: statusbar;
    border-top: 5px solid rgba(0,0,0,0);
  }
  .mainmenu-container {
    grid-area: mainmenu;
    margin: 0 1rem 0 0;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    height: max-content;
  }

  input {
    background: none;
    border: none;
    color: $input-blue;
    font-family: "Muli";
    font-size: 1.1rem;
    padding-left: 0.25rem;
    width: 5ch;
    border-bottom: 1px solid $input-blue;
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
    color: #eeeeee;
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
    // margin: 0.25rem;
    color: #eeeeee;
    // border: 1px solid $input-blue;
    &:hover {
      background: rgba(0, 25, 75, 0.5);
      color: #eeeeee;
    }
  }

  .title-container {
    background: #1a1a1a;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #eeeeee;
    margin: 0;
    padding: 0.25rem;

    & h1 {
      margin: 0;
      padding: 0.5rem 0 0 0;
      border-bottom: 2.5px solid #eeeeee;
    }
  }
</style>

<!-- <div class="title-container">
  <h1>SUPER Tic Tac Toe!</h1>
</div> -->

{#await players then players}
  <div class="page-container">
    <div class="mainmenu-container">
      <GameInit on:playersInitialized={setPlayersToStore} />
    </div>

    <div class="scoreboard-container">
      <ScoreBoard on:playerNameOrMarkerUpdate={setPlayersToStore} />
    </div>

    <div class="statusbar-container">
      <StatusBar
        on:resetGame={resetGame}
        on:playersScored={setPlayersToStore} />
    </div>
    <div class="gameboard-container">
      <GameBoard on:move={moveNotification} />
    </div>
  </div>

{/await}
