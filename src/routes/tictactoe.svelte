<script>
  import { onMount } from "svelte";
  // import Odometer from "odometer.min.js";
  // import { CountUp } from "countup.js";
  import GameBoard from "./../components/GameBoard.svelte";
  import Loading from "./../components/Loading.svelte";
  // import ScoreBoardNew from "./../components/ScoreBoardNew.svelte";
  import ScoreBoard from "./../components/ScoreBoard.svelte";
  import CountPoints from "./../components/CountPoints.svelte";
  // import OptionsWidget from "./../components/OptionsWidget.svelte";
  import SettingsMenu from "./../components/SettingsMenu.svelte";
  import TopMenu from "./../components/TopMenu.svelte";
  import SideMenu from "./../components/SideMenu.svelte";
  import GameInit from "./../components/GameInit.svelte";
  // import emojis from "emojis-list";
  // import Fa from "svelte-fa";
  // <Fa icon={abacus} {...faTheme} />
  import { writable } from "svelte/store";
  import {
    storeSettings,
    storeGameboardWidth,
    storeViewportSize,
    storeState,
    storeMoveNumber,
    storeMovesRemaining,
    storePlayers,
    storeButtonStyles,
    storeCurrentPlayer,
    storeDirectionArrays,
    storeGameInProgress,
    storeGameHistoryTurns,
    storePreservePlayerDetails,
    storeGameHistoryFlat
  } from "../stores.js";

  let players,
    settings,
    currentPlayer,
    gameboardWidth,
    moveNumber,
    movesRemaining,
    state,
    initialized;

  initialized = false;
  let smallScreenHeight = false;
  let smallScreenWidth = false;
  let landscape, portrait;
  let smallScreenMaxWidth = 900;
  let smallScreenMaxHeight = 700;
  let viewportSize = { width: "", height: "" };
  let { _color, _secondaryColor, _secondaryOpacity } = $storeButtonStyles;

  import Fa from "sveltejs-fontawesome";
  // import { faEmptySet } from "js/all.js"

  storeCurrentPlayer.subscribe(val => {
    currentPlayer = val;
    if (typeof window !== "undefined") {
      document.documentElement.style.setProperty(
        "--player-color",
        currentPlayer.colorMain
      );
    }
  });
  storeState.subscribe(value => {
    // console.log(
    //   `storeState subscribed value, movesRemaining from state ${value.movesRemaining}`,
    //   value
    // );
    state = value;
    if (typeof window !== "undefined") {
      movesRemaining = state.movesRemaining;
      storeMovesRemaining.set(movesRemaining);
      moveNumber = JSON.parse(localStorage.getItem("moveNumber"));
      if (!moveNumber) {
        moveNumber = 0;
      }
      storeMoveNumber.set(moveNumber);
    }
  });
  storeSettings.subscribe(value => {
    // console.log(`TicTacToe => storeSettings.subscribe value => `, value);
    settings = value;
    if (typeof window !== "undefined") {
      let lsMovesFromTurnHistory = JSON.parse(
        localStorage.getItem("turnHistory")
      );
      if (lsMovesFromTurnHistory) {
        lsMovesFromTurnHistory = JSON.parse(localStorage.getItem("turnHistory"))
          .length;
      }
      movesRemaining = settings.movesPerTurn - lsMovesFromTurnHistory;
      state.movesRemaining = movesRemaining;
      storeMovesRemaining.set(movesRemaining);
    }
  });
  storeViewportSize.subscribe(val => {
    // console.log(
    //   `tictactoe => storeViewportSize W:${val.width} H:${val.height}`
    // );
    viewportSize = val;
    if (val.width > val.height) {
      landscape = true;
      portrait = false;
    } else {
      portrait = true;
      landscape = false;
    }
    if (val.width < smallScreenMaxWidth) {
      smallScreenWidth = true;
    } else {
      smallScreenWidth = false;
    }
    if (val.height < smallScreenMaxHeight) {
      smallScreenHeight = true;
    } else {
      smallScreenHeight = false;
    }
  });

  onMount(async () => {
    // console.log(
    //   `TicTacToe.svelte onMount $storeViewportSize.width ${$storeViewportSize.width}`
    // );
    if (viewportSize.width < smallScreenMaxWidth) {
      smallScreenWidth = true;
    } else {
      smallScreenWidth = false;
    }
    if (viewportSize.height < smallScreenMaxHeight) {
      smallScreenHeight = true;
    } else {
      smallScreenHeight = false;
    }

    storePlayers.subscribe(value => {
      players = value;
      // console.log(`tictactoe => storePlayers.subscribe ||| YES assigned! length: ${players.length}`)
    });

    storeGameboardWidth.subscribe(val => {
      gameboardWidth = val;
    });
    storeMoveNumber.subscribe(val => {
      moveNumber = val;
      let lsMoveNumber = JSON.parse(localStorage.getItem("moveNumber"));
      if (lsMoveNumber) {
        moveNumber = lsMoveNumber;
      }
    });
    let statusbar = document.getElementById("statusbar");
    let gameboard = document.getElementById("gameboard");
    let menu = document.getElementById("menu");
    let scoreboard = document.getElementById("scoreboard");
    await setTimeout(() => {
      statusbar.classList.add("loaded");
    }, 150);
    await setTimeout(() => {
      scoreboard.classList.add("loaded");
    }, 300);
    await setTimeout(() => {
      menu.classList.add("loaded");
    }, 450);
    await setTimeout(() => {
      gameboard.classList.add("loaded");
    }, 600);

    setTimeout(async () => {
      initialized = true;
    }, 750);
  });

  function resetGame() {
    console.log(`TicTacToe => reset bubbled from OptionsWidget`);
  }

  function moveNotification(cell) {
    console.log(`TicTacToe.svelte moveNotification for `, cell.detail);
    // countUp.update(movesRemaining);
  }
  
  function finalTurnTally() {
    console.log(`finalTurnTally fired in tictactoe from GameBoard dispatch`);
  }

  function playersScored(e) {
    players = e.detail;
    // dispatch("playersScored", players);
  }

  function clearScores() {
    console.log(`clear scores`);
    players.forEach(player => {
      player.totalScore = 0;
      player.dirScoresByIndex = [0, 0, 0, 0];
    });
    storePlayers.set(players);
  }
</script>

<style lang="scss" global>
  // :global(:root) {
  //   --input-blue: 50, 200, 255;
  // }

  body {
    color: var(--theme-fg);
    background: var(--theme-bg);
  }
  $input-blue: rgba(50, 200, 255, 1);

  #layout-main {
    // background: var(--theme-dark);
  }

  .page-container {
    box-sizing: border-box;
    display: grid;
    grid-template-areas:
      "statusbar statusbar sidemenu"
      "scoreboard gameboard sidemenu";
    grid-template-columns: 20vw 65vw 15vw;
    min-height: 100vh;
    max-height: 100vh;
    min-width: 100vw;
    max-width: 100vw;
    grid-template-rows: minmax(8vh, 4rem) auto;
    transition: all 0.45s;
    position: relative;
    &.dark {
      background: var(--theme-bg);
      color: var(--theme-fg);
      transition: all.25s;
    }
    &.light {
      background: var(--theme-bg);
      color: var(--theme-fg);
      transition: all.25s;
    }
  }

  .loading-page-container {
    box-sizing: border-box;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    max-height: 100vh;
    min-width: 100vw;
    max-width: 100vw;
    position: relative;
    background: #1a1a1a;
    & .loading-container-inner {
      // width: 40vw;
      // height: 40vh;
      background: rgba(200, 200, 255, 0.15);
      // background: var(--theme-dark);
      padding: 3rem 6rem 3rem 3rem;
      border-radius: 1rem;
      position: relative;
      // display: grid;
      // grid-template-columns: auto;
      // grid-template-rows: auto;
      // grid-template-areas:
      //   "statusbar"
      //   "gamemenu"
      //   "scoreboard"
      //   "gameboard";
      // justify-content: center;
      // justify-items: center;
      // align-content: center;
    }
  }
  .loading-message {
    grid-area: gameboard;
    display: flex;
    position: relative;
    top: 0;
    left: 0;
    color: rgba(255, 255, 255, 0.25);
    transition: all 0.25s;
    // grid-template-areas: "statusbar" "scoreboard" "menu" "gameboard";
    &.loaded {
      // background: green;
      color: #efefefef;
      transition: all 0.25s;
      position: relative;
      // margin-right:2rem;
      &:after {
        content: "\2714";
        position: absolute;
        display: flex;
        justify-content: center;
        align-items: center;
        color: rgba(0, 255, 55, 1);
        min-height: 2rem;
        min-width: 2rem;
        border-radius: 1rem;
        background: rgba(0, 255, 55, 0.1);
        top: 0;
        right: -2rem;
      }
    }
    &#statusbar {
      grid-area: statusbar;
      transition: all 0.1s;
    }
    &#scoreboard {
      grid-area: scoreboard;
      transition: all 0.1s;
    }
    &#menu {
      grid-area: gamemenu;
      transition: all 0.1s;
    }
    &#gameboard {
      grid-area: gameboard;
      transition: all 0.1s;
    }
  }

  .topmenu-container {
    display: none;
  }
  .sidemenu-container {
    grid-area: sidemenu;
    display: -webkit-box;
    display: flex;
    flex-direction: column-reverse;
    -webkit-box-pack: justify;
    justify-content: space-between;
    -webkit-box-align: start;
    align-items: flex-start;
    height: fit-content;
    margin-left: 10%;
    z-index: 9;
    // @media screen and (max-width: 1000px) {
    //   margin-left: -3rem;
    // }
    // background: var(--player-color-dark);
    padding: 0.5rem;
    border-radius: 0 0 0 5px;
    & #theme-switch-wrapper {
      position: relative;
      width: auto;
      left: 3.75rem;
      & .theme-switch {
        margin-top: -0.5rem;
        margin-bottom: 1rem;
      }
      & .icon {
        position: absolute;
        top: 0.6rem;
        right: 3rem;
        opacity: 1;
        transition: all 0.45s;
        &.sun {
          right: 1rem;
        }
        &.moon {
        }
        &.hidden {
          opacity: 0;
          transition: all 0.45s;
        }
      }

      & svg {
        font-size: 24px;
        position: absolute;
        top: 0.25rem;
        left: -0.3rem;
      }
      & .icon svg {
        font-size: 20px;
      }
    }
    & .modal-wrapper.options-control-wrapper {
      margin: 0.25rem;
    }
    & button.control-button {
      padding: 0.25rem 0.5rem;
      font-size: 0.75rem;
      width: 6rem;
      margin-right: 0.25rem;
      background: rgba(255, 255, 255, 0.15);
      border: 2px solid var(--input-blue);
      &:text {
        align-self: center;
      }
      & div {
        align-self: center;
        text-align: left;
      }
      &:hover {
        background: var(--player-color-dark);
      }
    }
  }

  .gameboard-container {
    grid-area: gameboard;
    display: flex;
    flex-direction: column;
    color: var(--theme-fg);
    justify-content: center;
    align-items: center;
    height: auto;
    max-height: 90vh;

    // margin-right: 1rem;
    // background: #1a1a1a;
    z-index: 0;
    & .gameboard-board {
      z-index: 8;
      max-height: 85vh;
    }
  }
  .scoreboardnew-container {
    display: none;
  }
  .scoreboard-container {
    grid-area: scoreboard;
    margin: 1rem 0 0 0;
    display: flex;
    max-width: 100%;
    justify-content: flex-start;
    flex-direction: column;
    // border-top: 6px solid rgba(0, 0, 0, 0);
    z-index: 7;
    align-items: flex-start;
  }

  .statusbar-slim-wrapper {
    grid-area: statusbar;
    display: flex;
    font-size: 1rem;
    justify-content: center;
    align-items: center;
    margin-bottom: 1rem;
    border-radius: 0 0 5px 5px;
    color: var(--theme-fg);
    min-width: 100vw;
    // min-width: var(--gameboard-width);
    // max-width: var(--gameboard-width);
    background: var(--theme-bg);
    box-shadow: 0 0 9px 2px hsla(var(--player-color-hue), 70%, 70%, 0.55);
    position: relative;
    height: 3rem;
    &.dark {
      background: var(--theme-bg);
      color: var(--theme-fg);
      transition: all.25s;
    }
    &.light {
      background: var(--theme-bg);
      color: var(--theme-fg);
      transition: all.25s;
    }
    & #player-name {
      color: var(--theme-bg);
      left: 0;
      height: 3rem;
      // box-shadow: 0 0 4px var(--player-color);
      display: flex;
      justify-content: center;
      align-items: center;
      top: 0;
      margin: 0;
      padding: 0;
      // border-radius: 0 2rem 2rem 0;
      position: absolute;
      left: 0;
      min-height: 100%;
      max-height: 2.5rem;
      width: 19vw;
      background: var(--player-color);
      & h2.player-name {
        font-size: 1.25rem;
        margin: 0 1.5rem 0 0;
        background: none;
        padding: 0;
        border-radius: 0;
        max-width: fit-content;
        min-width: auto;
        color: var(--theme-fg);
      }
      & span {
        display: flex;
        -webkit-box-align: center;
        align-items: center;
        -webkit-box-pack: center;
        justify-content: center;
        height: 3rem;
        align-self: center;
        justify-self: center;
        font-size: 2rem;
        position: relative;
        top: -2px;
        // position: absolute;
        // top: 1.25rem;
        // right: 0;
        // -webkit-transform: translate(-50%, -50%);
        // transform: translate(-50%, -50%);
        // -webkit-transform-origin: top left;
        // transform-origin: top left;
      }
    }
    & #moves-wrapper {
      display: flex;
      flex-direction: row;
      position: relative;
      margin: 0 10vw 0 19vw;
      font-size: 1rem;
      & .player-status-detail {
        display: flex;
        flex-direction: row;
        justify-content: center;
        height: 3rem;
        align-items: center;
        & .dynamic-value {
          margin: 0;
          padding: 0;
          // background: var(--theme-bg);
          height: 3rem;
          width: 3rem;
          border-radius: 0;
          outline: 2px solid var(--player-color);
          outline-offset: -10px;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        & .dynamic-wrapper {
          padding: 0.5rem;
          font-size: 0.85rem;
        }
      }
    }
  }
  #tally-points-wrapper {
    margin: 0rem 2rem 1.5rem 1rem;
    display: flex;
    // width: 100%;
    // transform: scale(var(--placard-scale-value));
    // width: 237px;
    // transform-origin: top left;
  }

  .optionswidget-container {
    grid-area: optionswidget;
    height: fit-content;
    display: flex;
    justify-content: flex-end;
  }

  .settingsmenu-container {
    z-index: 9;
    grid-area: Settingsmenu;
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
    // border-bottom: 1px solid $input-blue;
    // margin: 0.5rem;
    justify-self: flex-end;
    &:focus {
      outline: none;
      border-bottom: 1px dashed $input-blue;
      margin-bottom: 0;
      padding: 0;
    }
  }
  .settings-wrapper {
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
    transition: all 0.5s;
    outline: 5px solid var(--theme-fg);
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
  }

  .game-square {
    width: 24px;
    height: 24px;
    min-width: 12px;
    min-height: 12px;
    width: var(--custom-size);
    height: var(--custom-size);
    background: var(--gg-bg);
    // background-image: radial-gradient(var(--gg-bg), transparent);
    // box-shadow: inset 0 0 0.15rem 0.025rem #1a1a1a;
    border: none;
    border: 1px solid rgba(0, 0, 0, 0.15);
    // border: 1px solid rgba(var(--theme-fg), 0.15);
    margin: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    &.unticked {
      // border: 1px solid rgba(var(--theme-fg), 0.15);
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
        content: attr(data-mark);
        font-size: var(--cell-mark-size);
        position: relative;
        justify-self: center;
        align-self: center;
        background: attr(data-background-color);
      }
      &::after {
        content: attr(data-mark);
        font-size: var(--cell-mark-size);
        position: relative;
        top: -0.15rem;
        justify-self: center;
        align-self: center;
        background: attr(data-background-color);
      }
    }
  }
  .locked {
    border: 1px solid rgba(0, 0, 0, 0.5);
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

  // and (orientation: portrait)
  // ****************************************************************************************************
  // media query
  // ----------------------------------------------------------------------------------------------------
  // ----------------------------------------------------------------------------------------------------
  // ****************************************************************************************************
  @media screen and (max-width: 900px) and (min-height: 700px) {
    .sidemenu-container {
      display: none;
    }
    .page-container {
      box-sizing: border-box;
      display: grid;
      grid-template-areas:
        "topmenu "
        "statusbar "
        "scoreboard "
        "gameboard ";
      grid-template-columns: 1fr;
      min-height: 100vh;
      max-height: 100vh;
      min-width: 100vw;
      max-width: 100vw;
      grid-template-rows: 4rem 4rem 8rem auto;
    }
    .topmenu-container {
      grid-area: topmenu;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      min-width: 90vw;
      max-width: 90vw;
      & #theme-switch-wrapper {
        position: relative;
        width: auto;
        left: 3.75rem;
        & .icon {
          position: absolute;
          top: 0.6rem;
          right: 3rem;
          opacity: 1;
          transition: all 0.45s;
          &.hidden {
            opacity: 0;
            transition: all 0.45s;
          }
        }

        & svg {
          font-size: 20px;
          position: absolute;
          top: 0.25rem;
          left: -0.3rem;
        }
      }
      & .modal-wrapper.options-control-wrapper {
        margin-right: 0.5rem;
        width: 100%;
      }
      & button.control-button {
        padding: 0.25rem;
        font-size: 0.75rem;
        width: 5rem;
        margin-right: 0.25rem;
        width: 100%;
        width: -moz-available; /* WebKit-based browsers will ignore this. */
        width: -webkit-fill-available; /* Mozilla-based browsers will ignore this. */
        width: fill-available;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
    .gameboard-container {
      justify-content: center;
      align-items: center;
    }
    .scoreboard-container {
      margin: 0;
      & .scoreboard-container-inner {
        flex-wrap: wrap;
        & .add-or-remove-players {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 5.75rem;
          margin-left: 0.5rem;
        }
        display: flex;
        flex-direction: row;
        max-width: 100vw;
        & .scoreboard-player {
          position: static;
        }
      }
    }
    .scoreboardnew-container {
      grid-area: scoreboard;
      min-width: 100vw;
      max-width: 100vw;
      overflow: auto;
      & .scoreboard-player {
        // flex-direction: row;
        & .scoreboard-totals {
          // flex-direction: column;
        }
        & .direction-icon {
          margin: 0.1rem;
          width: 15px;
          height: 15px;
        }
        & .total-score {
          margin: 0;
          padding: 0;
        }
      }
    }
    .menu-container {
      grid-area: menucontainer;
      display: flex;
      min-height: 2.5rem;
      max-height: 2.5rem;
      min-width: 100vw;
      max-width: 100vw;
    }
    .statusbar-slim-wrapper {
      position: relative;
      grid-area: statusbar;
      border-radius: 0;
      min-width: 100vw;
      max-width: 100vw;
      & .player-status-detail#player-name {
        top: 0;
        max-height: 2.5rem;
        margin: 0;
        background: var(--player-color);
        border-radius: 0 2rem 2rem 0;
        position: absolute;
        left: 0;
        padding: 0 1rem;
        min-width: 6rem;
        outline: none;
        & span {
          font-size: 1.5rem;
        }
        & h2.player-name {
          color: var(--theme-fg);
          background: var(--player-color);
          min-width: auto;
          margin: 0 0.5rem 0 0;
          padding: 0;
          font-size: 1rem;
        }
      }
      & #moves-wrapper {
        margin: 0;
        margin-left: 9rem;
      }
    }
    #tally-points-wrapper {
      grid-area: tallypoints;
      display: none;
    }
    .optionswidget-container {
      display: none;
      & #buttons-wrapper {
        flex-direction: row-reverse;
        width: auto;
        align-items: center;
        min-width: 50vw;
        font-size: 1rem;
        & .modal-wrapper.options-control-wrapper {
          margin: 0 0.5rem 0 0;
        }
        & button.control-button {
          width: 7rem;
          font-size: 0.75rem;
        }
      }
    }
  }

  // ****************************************************************************************************
  // media query
  // ----------------------------------------------------------------------------------------------------
  // ----------------------------------------------------------------------------------------------------
  // ****************************************************************************************************
  @media screen and (max-height: 700px) and (max-width: 900px) and (orientation: landscape) {
    .page-container {
      grid-template-rows: minmax(8vh, 4rem) auto;
    }
    .gameboard-container {
      background: none;
      justify-content: flex-start;
      & #gameboard {
        border: 2px solid var(--player-color-dark);
      }
    }
    .sidemenu-container {
      margin-left: -1rem;
      & #theme-switch-wrapper {
        height: 2.75rem;
      }
    }

    .statusbar-slim-wrapper {
      & #moves-wrapper .player-status-detail {
        & .dynamic-value {
          height: 2rem;
          width: 2rem;
          outline: 2px solid var(--player-color);
          outline-offset: -7px;
          font-size: 0.75rem;
        }
        & .dynamic-wrapper {
          padding: 0;
          font-size: 0.75rem;
        }
      }
      & #player-name {
        & h2.player-name {
          font-size: 1rem;
          margin: 0 0.5rem 0 0;
        }
        & span {
          font-size: 1.5rem;
        }
      }
    }
    .scoreboard-container {
      margin: 0;
      & .scoreboard-player {
        background: none;
        // background: var(--player-color);
        border: 2px solid var(--player-color);
        position: static;
        border-radius: 5px;
        left: 0;
        /* top: 0; */
        margin: 0 0 0.5rem 0.5rem;
        -webkit-transition: all 0.45s;
        transition: all 0.45s;
        min-width: -webkit-max-content;
        min-width: -moz-max-content;
        min-width: max-content;
        /* -webkit-transform-origin: top left; */
        /* transform-origin: top left; */
        /* -webkit-transform: scale(var(--scale-width)); */
        /* transform: scale(var(--scale-width)); */
        transform: scale(1);
        transition: all 0.45s;
        z-index: -1;

        & .total-score {
          height: 1rem;
          width: auto;
          & input {
            margin: 0;
            height: 1rem;
          }
          & .player-name {
            min-width: auto;
            max-width: fit-content;
            width: 7ch;
            min-width: 7ch;
            max-width: 7ch;
            padding: 0;
            font-size: 0.75rem;
          }
          & .player-mark {
            width: 1.25rem;
            max-width: 1.25rem;
            min-width: 1.25rem;
            margin: 0;
            padding: 0;
            height: 1.25rem;
            font-size: 1rem;
          }
          & .total-score-number {
            height: 1rem;
            margin: 0;
            padding: 0;
            font-size: 1rem;
          }
          & button.svelte-emoji-picker__trigger {
            max-width: 1.25rem;
            min-width: 1.25rem;
            margin: 0;
            height: 1.25rem;
            max-height: 1.25rem;
            min-height: 1.25rem;
            font-size: 1rem;
            left: 0;
            top: -2px;
            &:before {
              left: -1px;
              top: -2px;
              font-size: 1rem;
            }
          }
          & .player-details-icon {
            margin: 0;
            padding: 0;
            min-height: 1.5rem;
            min-width: 1.5rem;
            background: var(--player-color);
            position: relative;
            right: -0.3rem;
            top: -10px;
            border-radius: 0 5px 0 2px;
            right: -10px;
            padding: 2px;
          }
        }
        & .scoreboard-totals {
          justify-content: space-around;
          & .scoreboard-direction {
            & .direction-score-section {
              font-size: 0.75rem;
            }
          }
          & .direction-icon {
            margin: 0.1rem;
            width: 16px !important;
            height: 16px !important;
          }
        }
      }
    }
    .game-square {
      &.ticked {
        &::after {
          top: -1px;
        }
      }
    }
  }
</style>

<GameInit />
{#if initialized}
  {#await players then players}
    <div
      class="page-container"
      style={`--player-color: ${currentPlayer.colorMain}`}>

      <div class="scoreboard-container">
        <ScoreBoard players />
      </div>

      {#if currentPlayer}
        <div class="statusbar-slim-wrapper">
          <div class="player-status-detail" id="player-name">
            <h2
              class="player-name"
              style={`--player-color: ${currentPlayer.colorMain}`}>
              {currentPlayer.name}
            </h2>
            <span>{currentPlayer.mark}</span>
          </div>
          <div
            id="moves-wrapper"
            style={`--moves-wrapper-width: ${gameboardWidth}px`}>
            <div class="player-status-detail" id="turn-moves">
              <span class="dynamic-value odometer" id="movesRemaining">
                {movesRemaining}
              </span>
              <p class="dynamic-wrapper">moves remaining in turn</p>
              <span class="dynamic-value odometer" id="movesPlayed">
                {moveNumber ? moveNumber : 0}
              </span>
              <p class="dynamic-wrapper">
                {#if settings.rows}
                  of {settings.rows * settings.columns} total moves played
                {/if}
              </p>
            </div>
          </div>

        </div>
      {:else}
        <Loading loadingMsg="StatusBar loading..." thisId="statusbar" />
      {/if}

      <div class="gameboard-container">
        <GameBoard
          on:moveNotification={moveNotification}
          on:finalturn={finalTurnTally} />
      </div>

      {#if smallScreenWidth}
        <div class="topmenu-container">
          <TopMenu />
        </div>
      {:else if !smallScreenWidth || landscape}
        <div class="sidemenu-container">
          <SideMenu />
        </div>
      {/if}
    </div>

  {/await}
{:else}
  <div class="loading-page-container">
    <div class="loading-container-inner">
      <Loading loadingMsg="ScoreBoard loading..." thisId="scoreboard" />
      <Loading loadingMsg="GameBoard loading..." thisId="gameboard" />
      <Loading loadingMsg="Menu loading..." thisId="menu" />
      <Loading loadingMsg="Statusbar loading..." thisId="statusbar" />
    </div>
  </div>
{/if}
