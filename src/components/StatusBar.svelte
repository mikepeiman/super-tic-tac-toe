<script>
  import { onMount, afterUpdate, createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();
  import CountPoints from "./CountPoints.svelte";
  export let state, players, settings, gameboardMapped;
  import {
    storeSettings,
    storeState,
    storePlayers,
    storeCurrentPlayer,
    storeDirectionArrays,
    storeGameInProgress,
    storeMovesPlayedHistory,
    storePreservePlayerDetails
  } from "../stores.js";

  // $: currentPlayer = JSON.parse(localStorage.getItem("currentPlayer"));
  $: currentPlayer = {};
  // $: players
  $: state = {};
  $: playerIndicator = {};
  // console.log(`StatusBar state change, currentplayer `, state.currentPlayer);
  storePlayers.subscribe(value => {
    console.log(`StatusBar => storePlayers.subscribe value => `, value);
    if (value.length > 0) {
      console.log(`StatusBar => subscribe(), ($storePlayers.length > 0) true`);
      players = value;
    }
  });
  onMount(() => {
    playerIndicator = document.querySelector(".player-indicator");
    console.log(`//////////////     StatusBar => onMount()`);
    currentPlayer = state.currentPlayer;
  });

  afterUpdate(() => {
    console.log("StatusBar => aterUpdate() fired #1, state ", state);
    if (localStorage.getItem("state")) {
      state = JSON.parse(localStorage.getItem("state"));
      currentPlayer = state.currentPlayer;
      // currentPlayer = state.currentPlayer;
    }
    console.log("StatusBar => aterUpdate() fired #2, state ", state);
  });

  function setStyle() {
    playerIndicator.style = `--custom-bg: ${players[0].bgColor}`;
  }

  function countPoints() {
    console.log(`StatusBar component, clicked to test countPoints: `, players);
    dispatch("tally", true);
  }

  function saveGame() {
    storeGameInProgress.set(true);
  }
  function loadGame() {
    storeGameInProgress.set(false);
  }

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
    dispatch("playersScored");
  }

  function reset() {
    localStorage.setItem("gameboard", []);
    localStorage.setItem("gameHistory", []);
    localStorage.setItem("gameboardMapped", []);
    localStorage.setItem("lines", []);
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
    localStorage.setItem("gameInProgress", false);

    players.forEach(player => {
      player.lines = [];
      player.totalScore = 0;
      player.dirScoresByIndex = [0, 0, 0, 0];
    });
    localStorage.setItem("players", JSON.stringify(players));
    location.reload();
    dispatch("reset", true);
  }
</script>

<style lang="scss">
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

  .player-status-bar {
    width: 100%;
    display: flex;
    justify-content: space-between;
    background: rgba(155, 55, 255, 0.75);
  }
</style>

<!-- {#if currentPlayer.id} -->
{#await players then players}
  <!-- {#await state then state} -->
  <div
    class="player-indicator player-0"
    style={`--custom-bg: ${currentPlayer.bgColor}`}>
    <!-- {#if $storeGameInProgress}
      <div>Test if storeGameInProgress</div>
    {/if} -->
    <h2 class="player-indicator-heading">Player: {currentPlayer.name}</h2>

    <h2 class="player-indicator-heading">Turn Moves: {state.movesRemaining}</h2>
    <h2 class="player-indicator-heading">Total Moves: {state.moveNumber}</h2>
    <div class="buttons-wrapper">
      <CountPoints
        {players}
        {gameboardMapped}
        on:playersScored={playersScored} />
      <button class="control-button" id="reset-game-button" on:click={reset}>
        Reset game
      </button>
      <button class="control-button" id="save-game-button" on:click={saveGame}>
        Save game
      </button>
      <button class="control-button" id="save-game-button" on:click={loadGame}>
        Load game
      </button>
    </div>
  </div>
  <!-- {/await} -->
{/await}
<!-- {/if} -->
