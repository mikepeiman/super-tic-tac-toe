<script>
  import { onMount, afterUpdate, createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();
  import CountPoints from "./CountPoints.svelte";
  export let state, players, gameboardMapped;

  // $: currentPlayer = JSON.parse(localStorage.getItem("currentPlayer"));
  $: currentPlayer = state.currentPlayer;
  $: players,
    console.log(
      `StatusBar players change, players, state.currentPlayer `,
      players,
      state.currentPlayer
    ),
    (currentPlayer = state.currentPlayer);
  $: state,
    console.log(`StatusBar state change, currentplayer `, state.currentPlayer);

  onMount(() => {
    currentPlayer = state.currentPlayer;
  });

  afterUpdate(() => {
    console.log("StatusBar => aterUpdate() fired");
  });

  function countPoints() {
    console.log(`StatusBar component, clicked to test countPoints: `, players);
    dispatch("tally", true);
  }

  function updateCurrentPlayer() {
    console.log(
      `updateCurrentPlayer() run, currentPlayer: `,
      state.currentPlayer
    );
    let id = currentPlayer.id;
    console.log(`updateCurrentPlayer() run, currentPlayer id: `, id);
    state.currentPlayer = players[id];
    console.log(
      `updateCurrentPlayer() updated, currentPlayer: `,
      state.currentPlayer
    );
  }

  function saveGame() {
    console.log(`StatusBar component, clicked to test countPoints: `, players);
  }
  function loadGame() {
    console.log(`StatusBar component, clicked to test countPoints: `, players);
  }

  function playersScored(e) {
    console.log(`ScoreBoard receiving dispatch of playersScored, `, e.detail);
    players = e.detail;
  }

  function reset() {
    localStorage.setItem("gameboard", []);
    localStorage.setItem("gameHistory", []);
    localStorage.setItem("gameboardMapped", []);
    localStorage.setItem("diagonalDownLeft", []);
    localStorage.setItem("diagonalDownRight", []);
    localStorage.setItem("topToBottom", []);
    localStorage.setItem("leftToRight", []);

    localStorage.setItem("lines", []);
    let currentPlayerId = state.currentPlayer.id;
    localStorage.setItem("state", {
      lastTicked: "",
      currentPlayer: {},
      movesRemaining: 0,
      turn: 0,
      gameHistory: [],
      turnHistory: [],
      clickCount: 0,
      moveNumber: 0,
      reset: false
    });
    localStorage.setItem("gameInProgress", false);

    players.forEach(player => {
      player.lines = [];
    });
    localStorage.setItem("players", JSON.stringify(players));
    location.reload();
    dispatch("reset", true);
    // let settings = JSON.parse(localStorage.getItem('gameSettings'))
    // settings.columns = document.getElementById("columns").value;
    // settings.rows = document.getElementById("rows").value;
    // settings.size = document.getElementById("size").value;
    // settings.gutter = document.getElementById("gutter").value;
    // localStorage.setItem('gameSettings', settings)
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

{#await players then players}
  {#await state then state}
    <div
      class="player-indicator player-0"
      style={`--custom-bg: ${currentPlayer.bgColor}`}>
      <h2 class="player-indicator-heading">Player: {currentPlayer.name}</h2>
      <h2 class="player-indicator-heading">
        Turn Moves: {state.movesRemaining}
      </h2>
      <h2 class="player-indicator-heading">Total Moves: {state.moveNumber}</h2>
      <div class="buttons-wrapper">
        <CountPoints
          {players}
          {gameboardMapped}
          on:playersScored={playersScored} />
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
  {/await}
{/await}
