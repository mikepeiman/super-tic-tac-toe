<script>
  import Content from "./modalOne.svelte";
  import Modal from "svelte-simple-modal";
  import { getContext } from "svelte";
  import { onMount, afterUpdate, createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();
  import CountPoints from "./CountPoints.svelte";
  export let state, players;
  import {
    storeSettings,
    storeGameboardWidth,
    storeState,
    storePlayers,
    storeCurrentPlayer,
    storeDirectionArrays,
    storeGameInProgress,
    storeGameHistoryTurns,
    storePreservePlayerDetails,
    storeGameHistoryFlat
  } from "../stores.js";

  let gameboardWidth = "420px";
  $: currentPlayer = {};
  $: state = {};
  $: players = {};
  $: settings = {};
  $: moveNumber = 0;
  $: movesRemaining = 0;
  // $: settings.movesPerTurn, (state.movesRemaining = settings.movesPerTurn);
  // $: settings.movesPerTurn, console.log('\n' + 'REACTIVE LOGGING settings.movesPerTurn' + '\n')

  onMount(() => {
    storeSettings.subscribe(value => {
      console.log(`StatusBar => storeSettings.subscribe value => `, value);
      settings = value;
      let lsMovesFromTurnHistory = JSON.parse(
        localStorage.getItem("turnHistory")
      );
      if (lsMovesFromTurnHistory) {
        lsMovesFromTurnHistory = JSON.parse(localStorage.getItem("turnHistory"))
          .length;
      }

      // console.log(`lsMoveFromTurnHistory: `, lsMovesFromTurnHistory);
      movesRemaining = settings.movesPerTurn - lsMovesFromTurnHistory;
      state.movesRemaining = movesRemaining;
    });
    storeCurrentPlayer.subscribe(value => {
      // console.log(`StatusBar => storeCurrentPlayer subscribed`, value);
      currentPlayer = value;
    });
    storeGameboardWidth.subscribe(val => {
      console.log(`from statusBar => gameboard el width: `, val);
      gameboardWidth = val;
    });

    let lsCurrentPlayer = JSON.parse(localStorage.getItem("currentPlayer"));
    currentPlayer = lsCurrentPlayer;
    // console.log(`StatusBar => onMount() currentPlayer LS`, ls);
    storeState.subscribe(value => {
      state = value;
      // console.log(
      //   `StatusBar => storeState subscribed - moveNumber of game after state: ${state.moveNumber}`,
      //   value
      // );
      // console.log(
      //   `StatusBar => storeState subscribed - movesRemaining in turn after state: ${state.movesRemaining}`,
      //   value
      // );
      movesRemaining = state.movesRemaining;
      moveNumber = JSON.parse(localStorage.getItem("moveNumber"));
      if (!moveNumber) {
        moveNumber = 0;
      }
      // console.log(
      //   `StatusBar => storeState subscribed - move after LS: ${moveNumber}`
      // );
    });
    players = $storePlayers;
    // console.log(`StatusBar => onMount(() #1 state`, state);
    state = $storeState;
    // console.log(`StatusBar => onMount(() #2 state`, state);
    settings = $storeSettings;
    if (localStorage.getItem("gameInProgress")) {
      moveNumber = JSON.parse(localStorage.getItem("moveNumber"));
    }
    // currentPlayer = $storeCurrentPlayer;
    // console.log(`//////////////     StatusBar => onMount() `, state, players);
    if (!currentPlayer) {
      console.log(`StatusBar => if (!(currentPlayer)), set to players[0]`);
      currentPlayer = players[0];
      storeCurrentPlayer.set(currentPlayer);
    }

    setAllInputWidths();
  });

  function playersScored(e) {
    console.log(
      `StatusBar receiving dispatch of playersScored from CountPoints, `,
      e.detail
    );
    console.log(
      `StatusBar receiving dispatch of playersScored from CountPoints, state.currentPlayer `,
      state.currentPlayer
    );
    players = e.detail;
    localStorage.setItem("state", JSON.stringify(state));
    dispatch("playersScored", players);
  }

  function resetGame() {
    localStorage.removeItem("gameboard");
    localStorage.removeItem("gameHistoryFlat");
    localStorage.removeItem("gameHistoryTurns");
    localStorage.removeItem("turnHistory");
    localStorage.removeItem("lines");
    localStorage.removeItem("moveNumber");
    let currentPlayerId = state.currentPlayer.id;
    localStorage.setItem(
      "state",
      JSON.stringify({
        lastTicked: "",
        currentPlayer: players[0],
        movesRemaining: settings.movesPerTurn,
        turn: 0,
        gameHistory: [],
        turnHistory: [],
        clickCount: 0,
        moveNumber: 0,
        reset: false
      })
    );
    localStorage.removeItem("gameInProgress");

    players.forEach(player => {
      player.lines = [];
      player.totalScore = 0;
      player.dirScoresByIndex = [0, 0, 0, 0];
    });
    localStorage.setItem("players", JSON.stringify(players));
    location.reload();
    dispatch("resetGame", true);
  }

  function resetPlayers() {
    storePreservePlayerDetails.set(false);
    localStorage.removeItem("preservePlayerDetails");
    localStorage.removeItem("players");
    localStorage.removeItem("state");
    localStorage.removeItem("currentPlayer");
    localStorage.removeItem("directionArrays");
    localStorage.removeItem("state");
    resetGame();
    location.reload();
    dispatch("resetGame", true);
  }

  function saveGame() {
    // storeGameInProgress.set(true);
  }
  function loadGame() {
    // storeGameInProgress.set(false);
  }

  function setSingleInputWidth(input) {
    // console.log(`setSingleInputWidth value ${input.value.toString()} `, input);
    input.style.width = `${input.value.toString().length + 0.5}ch`;
  }

  async function setAllInputWidths() {
    await currentPlayer;
    // console.log(`setAllInputWidths() called`);
    let inputs = await document.querySelectorAll("input");
    // console.log(`setAllInputWidths() called`, inputs);
    let len = inputs.length;
    for (let i = 0; i < len; i++) {
      setSingleInputWidth(inputs[i]);
    }
  }
</script>

<style lang="scss">
  $title-margin: 0.5rem;
  $title-padding-horizontal: 0.5rem;
  $title-padding-vertical: 0.25rem;
  $calc-padding: 2 * $title-padding-horizontal;
  .player-indicator {
    border-top: 12px solid var(--player-color);
    border-bottom: 6px solid var(--player-color);
    color: #eee;
    transition: all 0.5s;
    display: flex;
    & h2 {
      font-size: 1.25rem;
    }
  }

  .player-status-bar {
    width: 100%;
    display: flex;
    justify-content: space-between;
    // background: rgba(155, 55, 255, 0.75);
  }

  .player-status-detail {
    display: flex;
    align-items: center;
    position: relative;
    // background: rgba(0, 0, 0, 0.5);
    // padding: 0.125rem;
    // width: 100%;
    // text-transform: lowercase;
    color: #006f98;
    & p {
      font-size: 1rem;
    }
    & label {
      font-size: 1rem;
      margin-left: 0.25rem;
      word-wrap: normal;
    }
    & input {
      background: rgba(255, 255, 255, 0.15);
      border: none;
      color: white;
      font-family: inherit;
      font-weight: 400;
      font-size: 1rem;
      padding: 0.125rem;
      border-radius: 0.125rem;
      border-bottom: none;
      margin: 0;
      justify-self: flex-start;
      &.value {
        font-size: 1rem;
        padding: 0.125rem;
        background: rgba(0, 0, 0, 0);
      }
    }
    & .dynamic-wrapper {
      position: relative;
      width: 21ch;
      margin: 1rem 0 1rem -0.75rem;
    }
    & .dynamic-value {
      background: var(--player-color);
      border: none;
      margin-top: 7px;
      color: white;
      font-family: inherit;
      font-weight: 400;
      font-size: 1rem;
      padding: 0.125rem 0.175rem;
      min-height: 2.25rem;
      min-width: 2.25rem;
      border-radius: 2px;
      position: absolute;
      left: -3.8rem;
      top: 0;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
  #turn-moves .dynamic-value {

  }
  #total-moves .dynamic-value {
    background: black;
    color: #006f98;
    padding: calc(0.125rem - 2px) calc(0.175rem - 2px);
    border: 2px solid var(--player-color);
  }
  .statusbar-details-wrapper {
    width: 100%;
    display: grid;
    /* justify-items: center; */
    grid-template-areas: "playername moves controls";
    grid-template-columns: 1fr auto 1fr;
  }

  #player-name {
    grid-area: playername;
    justify-self: flex-start;
    &:before {
      content: "";
      margin-right: 0.5rem;
      width: 0;
      height: 0;
      border-style: solid;
      border-width: 50px 0 50px 50px;
      border-color: transparent transparent transparent var(--player-color);
    }
  }
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

  .player-indicator-heading {
    padding: 1rem;
  }

  #tally-points-wrapper {
    top: 3px;
    position: relative;
  }

  #modal-wrapper {
    top: -3px;
    position: relative;
  }

  #turn-moves {
    top: 3px;
  }
  #total-moves {
    top: -3px;
  }
  .player-name {
    color: var(--player-color);
  }
  .inputs-wrapper {
    display: flex;
  }

  :global(#tally-game-button) {
    font-size: 0.75rem;
    background: hsla(260, 100%, 50%, 1);
    border: 2px solid rgba(0, 0, 0, 0);

    &:hover {
      background: hsla(260, 100%, 35%, 1);
      cursor: pointer;
      border: 2px solid hsla(260, 100%, 70%, 1);
    }
  }

  :global(#game-menu-button) {
    font-size: 0.75rem;
    background: hsla(130, 50%, 35%, 1);
    border: 2px solid rgba(0, 0, 0, 0);

    &:hover {
      background: hsla(130, 50%, 45%, 1);
      cursor: pointer;
      border: 2px solid hsla(130, 50%, 70%, 1);
    }
  }

  @media screen and (min-width: 600px) {
    body {
      font-size: 80%;
    }
  }
  @media screen and (min-width: 900px) {
    body {
      font-size: 90%;
    }
    #buttons-wrapper {
      flex-direction: row;
    }
    #tally-points-wrapper {
      top: 0;
      position: relative;
    }
    #modal-wrapper {
      top: 0;
      position: relative;
    }
    .player-indicator {
      border-top: 12px solid var(--player-color);
      border-bottom: 12px solid var(--player-color);
      color: #eee;
      transition: all 0.5s;
      display: flex;
      & h2 {
        font-size: 1.25rem;
      }
    }
  }

  @media screen and (min-width: 1100px) {
    body {
      font-size: 100%;
    }
    #moves-wrapper {
      flex-direction: row;
      justify-content: space-between;
    }
    .player-status-detail {
      margin: 0 1rem;
      & .dynamic-value {
        min-height: 3rem;
        min-width: 3rem;
        margin-top: 0;
        left: -2.8rem;
      }
      & .dynamic-wrapper {
        position: relative;
        width: 21ch;
        margin: 1rem;
      }
    }
  }

  @media screen and (min-width: 1500px) {
    body {
      font-size: 110%;
    }
  }
  // @media screen and (min-width: 960px) {
  //   .statusbar-container-inner {
  //     border-top: 5px solid var(--player-color);
  //   }
  // }
</style>

{#await currentPlayer then currentPlayer}
  {#if !currentPlayer.name}
    <div class="player-indicator player-0" style={`--player-color: #006f98`}>
      <h2 class="player-indicator-heading">Loading players data...</h2>
    </div>
  {:else}
    <div
      class="player-indicator player-0"
      style={`--player-color: ${currentPlayer.bgColor}`}>

      <div class="statusbar-details-wrapper">
        <div class="player-status-detail" id="player-name">
          <!-- <label for="player-name"></label>
        <input name="player-name" value={currentPlayer.name} /> -->
          <h2
            class="player-name"
            style={`--player-color: ${currentPlayer.bgColor}`}>
            {currentPlayer.name}
          </h2>
        </div>

        <div
          id="moves-wrapper"
          style={`--moves-wrapper-width: ${gameboardWidth}px`}>
          <div class="player-status-detail" id="turn-moves">

            <span class="dynamic-value">{movesRemaining}</span>
            <p class="dynamic-wrapper">moves remaining in turn</p>
          </div>
          <div class="player-status-detail" id="total-moves">

            <span class="dynamic-value">{moveNumber}</span>
            <p class="dynamic-wrapper">
              of {settings.rows * settings.columns} total moves played
            </p>
          </div>
        </div>
        <div class="buttons-wrapper" id="buttons-wrapper">
          <div id="tally-points-wrapper">
            <CountPoints {players} on:playersScored={playersScored} />
          </div>
          <div id="modal-wrapper">
            <Modal>
              <Content />
            </Modal>
          </div>

        </div>
      </div>
    </div>
  {/if}
{/await}
