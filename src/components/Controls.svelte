<script>
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
    storeGameHistoryFlat,
    storeMovesRemaining
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
      // console.log(`StatusBar => storeSettings.subscribe value => `, value);
      settings = value;
      let lsMovesFromTurnHistory = JSON.parse(
        localStorage.getItem("turnHistory")
      );
      if (lsMovesFromTurnHistory) {
        lsMovesFromTurnHistory = JSON.parse(localStorage.getItem("turnHistory"))
          .length;
      }

      movesRemaining = settings.movesPerTurn - lsMovesFromTurnHistory;
      state.movesRemaining = movesRemaining;
    });
    storeCurrentPlayer.subscribe(value => {
      currentPlayer = value;
    });

    let lsCurrentPlayer = JSON.parse(localStorage.getItem("currentPlayer"));
    currentPlayer = lsCurrentPlayer;
    storeState.subscribe(value => {
      state = value;
      movesRemaining = state.movesRemaining;
      // movesRemaining = $storeMovesRemaining;
      moveNumber = JSON.parse(localStorage.getItem("moveNumber"));
      if (!moveNumber) {
        moveNumber = 0;
      }
    });
    players = $storePlayers;
    // state = $storeState;
    settings = $storeSettings;
    if (localStorage.getItem("gameInProgress")) {
      moveNumber = JSON.parse(localStorage.getItem("moveNumber"));
    }
    if (!currentPlayer) {
      console.log(`StatusBar => if (!(currentPlayer)), set to players[0]`);
      currentPlayer = players[0];
      storeCurrentPlayer.set(currentPlayer);
    }
  });

  function resetGame() {
    console.log(`reset game`);
    localStorage.removeItem("gameboard");
    localStorage.removeItem("gameHistoryFlat");
    localStorage.removeItem("gameHistoryTurns");
    localStorage.removeItem("turnHistory");
    localStorage.removeItem("lines");
    localStorage.removeItem("moveNumber");

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
    // localStorage.setItem("players", JSON.stringify(players));

    storeCurrentPlayer.set(players[0]);
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
    resetGame();
    location.reload();
    dispatch("resetGame", true);
  }

  function resetAll() {
    localStorage.clear();
    location.reload();
    dispatch("resetGame", true);
  }

  function saveGame() {
    alert(`Save game function not yet implemented`);
  }
  function loadGame() {
    alert(`Load game function not yet implemented`);
  }
</script>

<style lang="scss">
  .controls-wrapper {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    & .subgroup {
      display: flex;
      justify-content: center;
      width: 100%;
      & button.control-button {
        font-size: 1.25rem;
        padding: 1rem 4rem;
        margin: 1rem;
      }
      & .sub-subgroup {
        flex-direction: column;
      }
    }
  }

  :global(button.control-button) {
    font-size: 1rem;
    padding: 0.5rem;
    display: flex;
    justify-content: flex-start;
    align-content: center;
    background: hsla(var(--player-color-hue), 75%, 50%, 0.5);
    color: var(--theme-fg);
    transition: all 0.1s;
    & svg {
      margin-right: 0.25rem;
      align-self: center;
      font-size: 1.25rem;
    }
    & .button-text {
      position: relative;
      top: 0;
      font-size: 0.75rem;
      width: auto;
      align-self: center;
    }
    &:hover {
      background: var(--player-color);
    }
  }

  .control-button {
    background: var(--theme-dark);
    color: var(--theme-light);
    width: 100%;
    margin: 1rem;
    padding: 2rem 0.5rem;
    display: flex;
    justify-content: center;
    align-content: center;
    &:hover {
      background: rgba(0, 0, 0, 0.5);
      color: white;
    }
  }

  #new-game-button {
    background: hsla(95, 100%, 50%, 0.5);

    &:hover {
      background: hsla(95, 100%, 55%, 0.75);
    }
  }
  #save-game-button {
    background: hsla(160, 100%, 50%, 0.5);

    &:hover {
      background: hsla(160, 100%, 55%, 0.75);
    }
  }
  #load-game-button {
    background: hsla(220, 100%, 60%, 0.5);

    &:hover {
      background: hsla(220, 100%, 65%, 0.75);
    }
  }
  #reset-players-button {
    background: hsla(280, 100%, 50%, 0.5);

    &:hover {
      background: hsla(280, 100%, 55%, 0.75);
    }
  }
  #reset-all-button {
    background: hsla(0, 100%, 50%, 0.5);

    &:hover {
      background: hsla(0, 100%, 55%, 0.75);
    }
  }
</style>

<div class="controls-wrapper">

  <div class="subgroup">
    <button class="control-button" id="save-game-button" on:click={saveGame}>
      Save game
    </button>
    <button class="control-button" id="load-game-button" on:click={loadGame}>
      Load game
    </button>
  </div>
  <div class="subgroup">
    <button class="control-button" id="new-game-button" on:click={resetGame}>
      New Game
    </button>
    <div class="sub-subgroup">
      <button
        class="control-button"
        id="reset-players-button"
        on:click={resetPlayers}>
        Reset players
      </button>
      <button class="control-button" id="reset-all-button" on:click={resetAll}>
        RESET ALL
      </button>
    </div>
  </div>
</div>
