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
      // console.log(`StatusBar => storeSettings.subscribe value => `, value);
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
  });

  function resetGame() {
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
    localStorage.setItem("players", JSON.stringify(players));
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
</script>

<style lang="scss">
  .controls-wrapper {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    & .subgroup {
      display: flex;
      width: 100%;
    }
  }

  :global(button.control-button) {
    font-size: 1rem;
    padding: 0.5rem;
    display: flex;
    justify-content: center;
    align-content: center;
    background: hsla(var(--player-color-hue), 50%, 40%, 0.5);
    color: var(--theme-fg);
    & svg {
      margin-right: 0.25rem;
    }
    & .button-text {
      position: relative;
      top: 1px;
    }
  }

  .control-button {
    background: rgba(0, 25, 75, 0.25);
    color: #1a1a1a;
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
    background: hsla(50, 100%, 50%, 0.5);

    &:hover {
      background: hsla(50, 100%, 55%, 0.75);
    }
  }
  #save-game-button {
    background: hsla(100, 100%, 50%, 0.5);

    &:hover {
      background: hsla(100, 100%, 55%, 0.75);
    }
  }
  #load-game-button {
    background: hsla(200, 100%, 50%, 0.5);

    &:hover {
      background: hsla(200, 100%, 55%, 0.75);
    }
  }
  #reset-players-button {
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
    <button
      class="control-button"
      id="reset-players-button"
      on:click={resetPlayers}>
      Reset players
    </button>
  </div>
</div>
