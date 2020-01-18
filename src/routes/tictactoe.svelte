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
    storeViewportSize,
    storeState,
    storePlayers,
    storeCurrentPlayer,
    storeDirectionArrays,
    storeGameInProgress,
    storeGameHistoryTurns,
    storePreservePlayerDetails,
    storeGameHistoryFlat
  } from "../stores.js";

  $: state = null;
  $: players = null;
  $: settings = null;
  let currentPlayer;

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
  storeCurrentPlayer.subscribe(val => {
    currentPlayer = val;
  });

  onMount(() => {
    console.log(`TicTacToe.svelte onMount`);
    // setViewportSize();
  });

  function resetGame() {
    console.log(`TicTacToe => reset bubbled from StatusBar`);
  }

  function moveNotification(cell) {
    console.log(`TicTacToe.svelte moveNotification for `, cell.detail);
  }

  function setViewportSize() {
    let app = document.querySelector("#sapper");
    console.log(`setViewportSize for app: `, app);
    let appWidth = app.offsetWidth;
    let appHeight = app.offsetHeight;
    let appRatio = (appWidth / appHeight).toFixed(2);
    storeViewportSize.set({
      width: appWidth,
      height: appHeight,
      ratio: appRatio
    });
  }
</script>

<style lang="scss" global>
  :global(:root) {
    --input-blue: 50, 200, 255;
    --theme-bg: #1a1a1a;
    --theme-color: #efefef;
  }
  [data-theme="dark"] {
    --theme-bg: #efefef;
    --theme-color: #1a1a1a;
  }

  body {
    transition: all 0.25s;
    &.dark-theme {
      background: var(--theme-bg);
      background: #1a1a1a;
      transition: all.25s;
    }
    &.light-theme {
      background: var(--theme-bg);
      background: white;
      transition: all.25s;
    }
  }

  $input-blue: rgba(50, 200, 255, 1);

  #layout-main {
    background: #1a1a1a;
  }

  .page-container {
    box-sizing: border-box;
    display: grid;
    grid-template-areas:
      "statusbar statusbar statusbar"
      "mainmenu mainmenu mainmenu"
      "scoreboard gameboard gameboard";
    min-height: 100vh;
    max-height: 100vh;
    min-width: 100vw;
    max-width: 100vw;
    grid-template-columns: 20vw 60vw 20vw;
    grid-template-rows: 16vh 13vh auto;
    // background: var(--player-color);
    // background-image: linear-gradient(125deg, var(--theme-bg), rgba(26,26,26, 0.7));
    transition: all 0.25s;
    &.dark {
      background: var(--theme-bg);
      // background: #1a1a1a;
      transition: all.25s;
    }
    &.light {
      background: var(--theme-bg);
      // background: white;
      transition: all.25s;
    }
  }

  .gameboard-container {
    grid-area: gameboard;
    display: flex;
    flex-direction: column;
    color: #eee;
    justify-content: flex-start;
    align-items: flex-end;
    height: auto;
    margin-right: 1rem;
    // background: #1a1a1a;
    z-index: 0;
    & .gameboard-board {
      z-index: 8;
    }
  }

  .scoreboard-container {
    grid-area: scoreboard;
    margin: 0;
    max-width: 100%;
    border-top: 6px solid rgba(0, 0, 0, 0);
    z-index: 7;
  }

  .statusbar-container {
    grid-area: statusbar;
    z-index: 10;
    min-height: 15vh;
    max-height: 15vh;
  }

  .mainmenu-container {
    z-index: 9;
    grid-area: mainmenu;
    margin: 0;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
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
  .form-wrap {
    & input {
      font-size: 0.75rem;
    }
    & label {
      font-size: 0.5rem;
    }
  }
  input[type="number"]::-webkit-inner-spin-button,
  input[type="number"]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  input[type="number"] {
    -moz-appearance: textfield;
  }

  .game-row {
    display: flex;
  }

  .player-change {
    transition: all 0.25s;
    border: 5px solid white;
    background: rgba(255, 255, 255, 0.25);
  }

  button {
    min-height: 2.5rem;
    margin-right: 0.5rem;
    // margin-top: .35rem;
    border-radius: 2px;
    font-size: 1.25rem;
    border: none;
    color: #eeeeee;
    // background: rgba(var(--input-blue), 0.5);
    background: rgba(255, 255, 255, 0.15);
    &:hover {
      background: rgba(255, 255, 255, 0.25);
      background: rgba(var(--input-blue), 1);
    }
    &.control-button {
      font-size: 1rem;
      padding: 0.5rem;
      // margin-top: 7px;
    }
  }

  .game-square {
    width: 24px;
    height: 24px;
    min-width: 12px;
    min-height: 12px;
    width: var(--custom-size);
    height: var(--custom-size);
    // background: var(--player-color, #1a1a1a);
    // background: #1a1a1a;
    border: none;
    border: 1px solid rgba(255, 255, 255, 0.05);
    margin: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    &.unticked {
      &:hover {
        // background: rgba(150, 150, 255, 0.5);
        // background: var(--player-color);
        // border: 2px solid var(--player-color);
        outline: 3px solid var(--player-color);
        outline-offset: -4px;
        background: rgba(26, 26, 26, 0.15);
        // content: var(--player-mark);
        color: rgba(255, 255, 255, 0.25);
      }
      &:hover::after {
        content: var(--player-mark);
        font-size: var(--custom-mark-size);
        position: relative;
        justify-self: center;
        align-self: center;
        // background: attr(data-background-color);
      }
    }

    &.ticked {
      background: var(--player-color);
      outline: 3px solid #1a1a1a;
      outline-offset: -4px;
      &.locked {
        outline: none;
      }
      &:hover {
        background-image: linear-gradient(
          45deg,
          rgba(26, 26, 26, 0.35),
          rgba(26, 26, 26, 0.45)
        );
      }
      &:hover::after {
        content: attr(data-marker);
        font-size: var(--cell-marker-size);
        position: relative;
        justify-self: center;
        align-self: center;
        background: attr(data-background-color);
      }
      &::after {
        content: attr(data-marker);
        font-size: var(--cell-marker-size);
        position: relative;
        top: -0.15rem;
        justify-self: center;
        align-self: center;
        background: attr(data-background-color);
      }
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

  // @media screen and (min-width: 320px) and (max-width: 820px) and (orientation: portrait) {

  //   html {
  //     transform: rotate(-90deg);
  //     transform-origin: left top;
  //     width: 100vh;
  //     height: 100vw;
  //     overflow-x: hidden;
  //     position: absolute;
  //     top: 100%;
  //     left: 0;
  //   }

  // }

  @media screen and (min-width: 320px) and (max-width: 960px) and (orientation: landscape) {
    .page-container {
      box-sizing: border-box;
      display: grid;
      grid-template-areas:
        "statusbar statusbar statusbar"
        "mainmenu mainmenu mainmenu"
        "scoreboard gameboard gameboard";
      min-height: calc(100vh - 10px);
      max-height: calc(100vh - 10px);
      // min-width: calc(100vw - 12px);
      max-width: 100vw;
      grid-template-columns: 20vw 60vw 20vw;
      grid-template-rows: 16vh 13vh auto;
    }
    .statusbar-container {
      min-height: 15vh;
      max-height: 15vh;
    }
    .player-indicator {
      height: 100%;
      min-height: 15vh;
      max-height: 15vh;
      & #moves-wrapper {
        flex-direction: row;
        min-width: 50vw;
        justify-content: space-between;
        margin: 0;
      }
      & #turn-moves {
        top: 0;
      }
      & #total-moves {
        top: 0;
      }
      & #player-name::before {
        border: 0;
        display: none;
      }

      & #buttons-wrapper {
        justify-content: space-around;
        flex-direction: row;
        margin-right: 1rem;
      }
      & #modal-wrapper {
        top: 0;
      }
      & #tally-points-wrapper {
        top: 0;
      }
    }
    .gameboard-container {
      align-items: center;
      // margin-top: 1rem;
    }

    .scoreboard-container {
      // margin-top: 1rem;
    }

    .mainmenu-container {
      & .form-wrap {
        padding: 0.5rem 1.5rem;
      }
    }
    @media (max-width: 400px) {
      #moves-wrapper {
        margin-left: 3.8rem;
        grid-area: moves;
        justify-self: center;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        // min-width: var(--moves-wrapper-width);
        & .player-status-detail {
          & .dynamic-value {
            min-height: 2rem;
            /* height: 2rem; */
            font-size: 0.75rem;
            margin: 0;
            top: 0.5rem;
            position: initial;
          }
          & .dynamic-wrapper {
            font-size: 0.75rem;
            margin: 0 0 0 0.25rem;
          }
        }
      }
      .player-indicator {
        & #buttons-wrapper {
          display: flex;
          flex-direction: row;
          align-items: center;
          grid-area: controls;
          padding: 8px;
          margin-right: 0;
          justify-self: flex-end;
          justify-content: space-between;
          & button {
            min-height: 1.5rem;
          }
          & #tally-game-button {
            font-size: 0.5rem;
            border: none;
            height: 2rem;
            &:hover {
              border: none;
            }
          }
          & #game-menu-button {
            font-size: 0.5rem;
            border: none;
            height: 2rem;
            &:hover {
              border: none;
            }
          }
        }
        & #player-name h2 {
          font-size: 0.75rem;
        }
      }
    }
    @media (min-width: 820px) {
      #moves-wrapper {
        margin-left: 3.8rem;
        grid-area: moves;
        justify-self: center;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        // min-width: var(--moves-wrapper-width);
      }
      #buttons-wrapper {
        display: flex;
        flex-direction: column;
        align-items: center;
        grid-area: controls;
        padding: 8px;
        justify-self: flex-end;
        justify-content: space-between;
        &:nth-child(1) {
          top: 3px;
        }
        &:nth-child(2) {
          top: -3px;
        }
      }
    }
  }

  @media screen and (min-height: 320px) and (max-height: 670px) and (orientation: landscape) {
    .gameboard-container {
      align-items: center;
      margin-top: 1rem;
    }

    .scoreboard-container {
      margin-top: 1rem;
    }
  }

  @media screen and (min-width: 1100px) {
    .page-container {
      grid-template-rows: 16vh 13vh auto;
    }
  }

  @media screen and (min-width: 900px) {
    .gameboard-container {
      align-items: center;
      margin-right: 0;
    }
    .mainmenu-container {
      border-top: 6px solid rgba(0, 0, 0, 0);
    }
    button {
      min-height: 3rem;
      margin-right: 0.5rem;
      border-radius: 2px;
      font-size: 1.25rem;
      border: none;
      color: #eeeeee;
      // background: rgba(var(--input-blue), 0.5);
      background: rgba(255, 255, 255, 0.15);
      &:hover {
        background: rgba(255, 255, 255, 0.25);
        background: rgba(var(--input-blue), 1);
      }
      &.control-button {
        font-size: 1rem;
        padding: 0.5rem;
      }
    }
    .page-container {
      box-sizing: border-box;
      display: grid;
      grid-template-areas:
        "statusbar statusbar statusbar"
        ". . ."
        "scoreboard gameboard mainmenu";
      min-height: calc(100vh - 10px);
      max-height: calc(100vh - 10px);
      // min-width: calc(100vw - 12px);
      max-width: 100vw;
      grid-template-columns: 20vw 60vw 20vw;
      // grid-template-rows: 18vh 7vh auto;
    }
  }
</style>

<!-- <div class="title-container">
  <h1>SUPER Tic Tac Toe!</h1>
</div> -->

{#await players then players}
  <div
    class="page-container"
    style={`--player-color: ${currentPlayer.bgColor}`}>
    <div class="mainmenu-container">
      <GameInit />
    </div>
    <div class="statusbar-container">
      <StatusBar />
    </div>
    <div class="scoreboard-container">
      <ScoreBoard />
    </div>
    <div class="gameboard-container">
      <GameBoard />
    </div>
  </div>

{/await}
