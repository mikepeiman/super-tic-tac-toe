<script>
  import { onMount, afterUpdate, createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();
  import CountPoints from "./CountPoints.svelte";
  export let state, players, gameboardMapped;
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
  // $: settings.movesPerTurn, (state.movesRemaining = settings.movesPerTurn);
  // $: settings.movesPerTurn, console.log('\n' + 'REACTIVE LOGGING settings.movesPerTurn' + '\n')

  onMount(() => {
    console.log(`state.moveNumber `, state.moveNumber);
    if (state.moveNumber) {
      console.log(
        `123672548345693746028462107630237627038462037683240324 it's undefined`
      );
      state.moveNumber = 0;
    }
    storeSettings.subscribe(value => {
      // console.log(`StatusBar => storeSettings.subscribe value => `, value);
      settings = value;
    });
    storeCurrentPlayer.subscribe(value => {
      // console.log(`StatusBar => storeCurrentPlayer subscribed`, value);
      currentPlayer = value;
    });

    let ls = JSON.parse(localStorage.getItem("currentPlayer"));
    currentPlayer = ls;
    // console.log(`StatusBar => onMount() currentPlayer LS`, ls);
    storeState.subscribe(value => {
      console.log(
        `StatusBar => storeState subscribed - move: ${state.moveNumber}`,
        value
      );
      state = value;
      console.log(
        `StatusBar => storeState subscribed - move after state: ${state.moveNumber}`,
        value
      );
      moveNumber = JSON.parse(localStorage.getItem("moveNumber"));
      if (!moveNumber) {
        console.log(
          `123672548345693746028462107630237627038462037683240324 it's undefined`
        );
        moveNumber = 0;
      }
      console.log(
        `StatusBar => storeState subscribed - move after LS: ${moveNumber}`
      );
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
  });

  afterUpdate(() => {
    // console.log(`StatusBar => afterUpdate(() #1 state`, state);
    // state = $storeState;
    // console.log(`StatusBar => afterUpdate(() #2 state`, state);
    // let history = $storeGameHistoryTurns
    // console.log(`StatusBar => afterUpdate(() gameHistoryTurns from store `, history);
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
    localStorage.removeItem("lines");
    localStorage.removeItem("state");
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
    localStorage.removeItem("storePreservePlayerDetails");
    localStorage.removeItem("players");
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
</script>

<style lang="scss">
  $title-margin: 1rem;
  $title-padding-horizontal: 1rem;
  $title-padding-vertical: 0.5rem;
  $calc-padding: 2 * $title-padding-horizontal;

  .player-indicator {
    color: #eee;
    width: calc(100% - (2 * #{$title-padding-horizontal}));
    background: var(--custom-bg);
    transition: all 0.5s;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 1rem;
    padding: $title-padding-vertical $title-padding-horizontal;
    // border: 2px solid #eeeeee;

    & h2 {
      margin: 0;
      font-size: 1.25rem;
    }
  }

  .player-status-bar {
    width: 100%;
    display: flex;
    justify-content: space-between;
    background: rgba(155, 55, 255, 0.75);
  }
</style>

<!-- {#await players then players} -->
<!-- {#await state then state} -->
{#if currentPlayer.name}
  <div
    class="player-indicator player-0"
    style={`--custom-bg: ${currentPlayer.bgColor}`}>
    <h2 class="player-indicator-heading">Player: {currentPlayer.name}</h2>
    <h2 class="player-indicator-heading">Moves Left: {state.movesRemaining}</h2>
    <h2 class="player-indicator-heading">
      Game Progress: {moveNumber}/{settings.rows * settings.columns}
    </h2>
    <div class="buttons-wrapper">
      <CountPoints
        {players}
        {gameboardMapped}
        on:playersScored={playersScored} />
      <button class="control-button" id="new-game-button" on:click={resetGame}>
        New Game
      </button>
      <button class="control-button" id="save-game-button" on:click={saveGame}>
        Save game
      </button>
      <button class="control-button" id="save-game-button" on:click={loadGame}>
        Load game
      </button>

      <button
        class="control-button"
        id="reset-players-button"
        on:click={resetPlayers}>
        Reset players
      </button>
    </div>
  </div>
{:else}
  <div
    class="player-indicator player-0"
    style={`--custom-bg: #006f98;`}>
    <h2 class="player-indicator-heading">Loading players data...</h2>
  </div>
{/if}
<!-- {/await} -->
<!-- {/await} -->
