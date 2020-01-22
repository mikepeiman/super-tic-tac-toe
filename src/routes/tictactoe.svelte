<script>
  import { onMount } from "svelte";
  import GameBoard from "./../components/GameBoard.svelte";
  import ScoreBoard from "./../components/ScoreBoard.svelte";
  import CountPoints from "./../components/CountPoints.svelte";
  import OptionsWidget from "./../components/OptionsWidget.svelte";
  import SettingsMenu from "./../components/SettingsMenu.svelte";
  import GameInit from "./../components/GameInit.svelte";
  import emojis from "emojis-list";
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
    storeCurrentPlayer,
    storeDirectionArrays,
    storeGameInProgress,
    storeGameHistoryTurns,
    storePreservePlayerDetails,
    storeGameHistoryFlat
  } from "../stores.js";

  import Fa from "sveltejs-fontawesome";
  import { faEmptySet } from "@fortawesome/pro-duotone-svg-icons";

  let players,
    settings,
    currentPlayer,
    gameboardWidth,
    moveNumber,
    movesRemaining,
    state;

  storeCurrentPlayer.subscribe(val => {
    currentPlayer = val;
    if (typeof window !== "undefined") {
      document.documentElement.style.setProperty(
        "--player-color",
        currentPlayer.colorMain
      );
    }
  });
  storeSettings.subscribe(value => {
    console.log(`TicTacToe => storeSettings.subscribe value => `, value);
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
      // state.movesRemaining = movesRemaining;
      storeMovesRemaining.set(movesRemaining);
    }
  });

  onMount(() => {
    console.log(`TicTacToe.svelte onMount, emojis ${emojis[55]}`);

    storeState.subscribe(value => {
      state = value;
      movesRemaining = state.movesRemaining;
      moveNumber = JSON.parse(localStorage.getItem("moveNumber"));
      if (!moveNumber) {
        moveNumber = 0;
      }
    });
    storeState.subscribe(val => {
      state = val;
    });
    storePlayers.subscribe(value => {
      players = value;
      // console.log(`TicTacToe => storePlayers subscribed`, value);
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
  });

  function resetGame() {
    console.log(`TicTacToe => reset bubbled from OptionsWidget`);
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
  :global(:root) {
    --input-blue: 50, 200, 255;
  }

  $input-blue: rgba(50, 200, 255, 1);

  #layout-main {
    background: #1a1a1a;
  }

  .page-container {
    box-sizing: border-box;
    display: grid;
    grid-template-areas:
      ". gameboard ."
      "scoreboard gameboard optionswidget";
    grid-template-columns: 20vw 70vw 10vw;
    min-height: 100vh;
    max-height: 100vh;
    min-width: 100vw;
    max-width: 100vw;
    grid-template-rows: 5vh auto;
    transition: all 0.25s;
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

  .gameboard-container {
    grid-area: gameboard;
    display: flex;
    flex-direction: column;
    color: #eee;
    justify-content: flex-start;
    align-items: flex-end;
    height: auto;
    // margin-right: 1rem;
    // background: #1a1a1a;
    z-index: 0;
    & .gameboard-board {
      z-index: 8;
    }
  }

  .scoreboard-container {
    grid-area: scoreboard;
    margin: 0;
    display: flex;
    max-width: 100%;
    justify-content: flex-start;
    flex-direction: column;
    // border-top: 6px solid rgba(0, 0, 0, 0);
    z-index: 7;
    align-items: flex-start;
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

  .SettingsMenu-container {
    z-index: 9;
    grid-area: SettingsMenu;
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

  :global(.optionswidget-slim-wrapper) {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 1rem;
    border-radius: 0 0 5px 5px;
    color: var(--theme-fg);
    min-width: var(--gameboard-width);
    max-width: var(--gameboard-width);
    background: var(--theme-bg);
    box-shadow: 0 0 9px 2px hsla(var(--player-color-hue), 70%, 70%, 0.55);
    position: relative;
    & #player-name {
      background: var(--theme-bg);
      padding: 0 3rem 0 1rem;
      position: absolute;
      left: 0;
      margin: 0 1rem 0 0;
      border-radius: 0 0 0 5px;
      border-bottom: 5px solid var(--player-color);
      height: 3rem;

      display: flex;
      justify-content: center;
      align-items: center;
      & h2 {
        font-size: 1.25rem;
        margin: 0 0.5rem 0 0;
        & #text {
          font-size: 3rem;
        }
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
        font-size: 1.5rem;
        position: absolute;
        top: 1.25rem;
        right: 0;
        -webkit-transform: translate(-50%, -50%);
        transform: translate(-50%, -50%);
        -webkit-transform-origin: top left;
        transform-origin: top left;
      }
    }
    & #moves-wrapper {
      display: flex;
      flex-direction: row;
      position: relative;
      margin: 0 auto;
      & .player-status-detail {
        display: flex;
        flex-direction: row;
        justify-content: center;
        height: 3rem;
        align-items: center;
        & .dynamic-value {
          margin: 0;
          padding: 0;
          background: var(--theme-bg);
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
        }
      }
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
        ". gameboard ."
        "scoreboard gameboard optionswidget";
      grid-template-columns: 20vw 70vw 10vw;
      min-height: 100vh;
      max-height: 100vh;
      min-width: 100vw;
      max-width: 100vw;
      grid-template-rows: 5vh auto;
      transition: all 0.25s;
    }
    .optionswidget-container {
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
        flex-direction: column;
        margin-right: 1rem;
        align-items: flex-end;
      }
      & #menu-modal-wrapper {
        top: 0;
      }
      & #tally-points-wrapper,
      #clear-points-wrapper {
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

    .SettingsMenu-container {
      & .settings-wrapper {
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
  }

  @media screen and (min-width: 900px) {
    .gameboard-container {
      align-items: center;
      margin-right: 0;
    }
    .SettingsMenu-container {
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
    }
    .page-container {
      box-sizing: border-box;
      display: grid;
      grid-template-areas:
        ". gameboard ."
        "scoreboard gameboard optionswidget";
      grid-template-columns: 20vw 70vw 10vw;
      min-height: 100vh;
      max-height: 100vh;
      min-width: 100vw;
      max-width: 100vw;
      grid-template-rows: 5vh auto;
      transition: all 0.25s;
    }
  }
</style>

<!-- <div class="title-container">
  <h1>SUPER Tic Tac Toe!</h1>
</div> -->

{#await players then players}

  <div
    class="page-container"
    style={`--player-color: ${currentPlayer.colorMain}`}>
    <GameInit />

    <div class="scoreboard-container">
      <div id="tally-points-wrapper">

        <CountPoints {players} on:playersScored={playersScored} />
        <button
          class="control-button"
          id="clear-game-button"
          on:click={clearScores}>
          <Fa
            icon={faEmptySet}
            color="var(--theme-fg)"
            secondaryColor="hsla(calc(var(--player-color-hue) + 60), 60%, 60%,
            1)" />
          <span class="button-text">Clear Scores</span>
        </button>
      </div>
      <ScoreBoard />
    </div>
    <div class="gameboard-container">
      {#if currentPlayer}
        <div class="optionswidget-slim-wrapper">

          <div class="player-status-detail" id="player-name">
            <h2
              class="player-name"
              style={`--player-color: ${currentPlayer.colorMain}`}>
              {currentPlayer.name}
            </h2>
            <span>{currentPlayer.marker}</span>
          </div>

          <div
            id="moves-wrapper"
            style={`--moves-wrapper-width: ${gameboardWidth}px`}>
            <div class="player-status-detail" id="turn-moves">
              <span class="dynamic-value">{movesRemaining}</span>
              <p class="dynamic-wrapper">moves remaining in turn,</p>
              <span class="dynamic-value">{moveNumber}</span>
              <p class="dynamic-wrapper">
                {#if settings.rows}
                  of {settings.rows * settings.columns} total moves played
                {/if}
              </p>
            </div>
          </div>

        </div>
      {:else}
        <div class="player-status-detail" id="player-name">
          <h2>Loading...</h2>
        </div>
      {/if}

      <GameBoard />
    </div>
    <div class="optionswidget-container">
      <OptionsWidget />
    </div>
  </div>

{/await}
