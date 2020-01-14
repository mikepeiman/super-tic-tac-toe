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
    storeState,
    storePlayers,
    storeCurrentPlayer,
    storeDirectionArrays,
    storeGameInProgress,
    storeGameHistoryTurns,
    storePreservePlayerDetails,
    storeGameHistoryFlat
  } from "../stores.js";

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
  $title-margin: 1rem;
  $title-padding-horizontal: 1rem;
  $title-padding-vertical: 0.5rem;
  $calc-padding: 2 * $title-padding-horizontal;
  .player-indicator {
    // margin: 1rem;
    // padding: 0.5rem;
    color: #eee;
    // background: var(--player-color);
    // background: #1a1a1a;
    transition: all 0.5s;
    display: flex;
    flex-direction: column;
    // justify-content: space-between;
    // align-items: center;
    // padding: $title-padding-vertical $title-padding-horizontal;
    // height: 100%;
    // height: -moz-available; /* WebKit-based browsers will ignore this. */
    // height: -webkit-fill-available; /* Mozilla-based browsers will ignore this. */
    // height: fill-available;
    & h2 {
      margin: 0;
      font-size: 0.75rem;
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
    // background: rgba(0, 0, 0, 0.5);
    // padding: 0.125rem;
    width: 100%;
    // text-transform: lowercase;
    color: #006f98;
    & p {
      font-size: 0.5rem;
    }
    & h2 {
      color: white;
      text-transform: capitalize;
      margin-bottom: 0.25rem;
    }
    & label {
      font-size: 0.5rem;
      margin-left: 0.25rem;
      word-wrap: normal;
    }
    & input {
      background: rgba(255, 255, 255, 0.15);
      border: none;
      color: white;
      font-family: inherit;
      font-weight: 400;
      font-size: 0.6rem;
      padding: 0.125rem;
      border-radius: 0.125rem;
      border-bottom: none;
      margin: 0;
      justify-self: flex-start;
      &.value {
        font-size: 0.6rem;
        padding: 0.125rem;
        background: rgba(0, 0, 0, 0);
      }
    }
    & .dynamic-value {
      background: rgba(255, 255, 255, 0.15);
      border: none;
      color: white;
      font-family: inherit;
      font-weight: 400;
      font-size: 0.6rem;
      padding: 0.125rem .175rem;
      border-radius: 2px;
    }
  }
  .statusbar-details-wrapper {
    padding: 0.5rem;
    border: 2px solid var(--player-color);
    border-radius: 5px;
    margin-left: 2px;
    width: min-content;
  }
  .player-name {
    // padding: 0.5rem;
    // border-bottom: 5px solid var(--player-color);
  }
  .inputs-wrapper {
    display: flex;
  }
  .buttons-wrapper {
    display: flex;
    // width: 15vw;
  }

  button {
    padding: 0.25rem;
    margin: 0.25rem;
    background: rgba(0, 25, 75, 0.25);
    font-size: 0.75rem;
    border: none;
    color: #1a1a1a;
    &:hover {
      background: rgba(0, 0, 0, 0.5);
      color: white;
    }
  }

  #tally-game-button {
    background: hsla(260, 100%, 50%, 1);

    &:hover {
      background: hsla(260, 100%, 25%, 1);
    }
  }

  @media screen and (min-width: 960px) {
    .player-indicator {
      color: #eee;
      // width: calc(100% - (2 * #{$title-padding-horizontal}));
      background: var(--player-color);
      transition: all 0.5s;
      display: flex;
      justify-content: space-between;
      align-items: center;
      // width: 100%;
      // width: 75vw;
      padding: $title-padding-vertical $title-padding-horizontal;
      // border: 2px solid #eeeeee;

      & h2 {
        margin: 0;
        font-size: 1.25rem;
      }
    }
  }
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
      <div class="player-status-detail" id="player-name">
        <!-- <label for="player-name"></label>
        <input name="player-name" value={currentPlayer.name} /> -->
        <h2 class="player-name">{currentPlayer.name}</h2>
      </div>

      <div class="statusbar-details-wrapper">
        <div class="player-status-detail" id="turn-moves">
          <p>
            <span class="dynamic-value">{movesRemaining}</span>
            moves remaining in turn
          </p>
        </div>
        <div class="player-status-detail" id="total-moves">
          <p>
            <span class="dynamic-value">{moveNumber}</span>
            of {settings.rows * settings.columns} total moves played
          </p>
        </div>
        <div class="buttons-wrapper">
          <Modal>
            <Content />
          </Modal>
          <div>
            <CountPoints {players} on:playersScored={playersScored} />
          </div>
        </div>
      </div>
    </div>
  {/if}
{/await}
