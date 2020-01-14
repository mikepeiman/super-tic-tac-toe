<script>
  import { onMount, afterUpdate, createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();
  import CountPoints from "./CountPoints.svelte";
  export let state, players, highlighted;
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

  let appViewport = {};
  $: players = [];
  $: state = {};
  $: currentPlayer = {};
  $: moveNumber = 0;
  $: totalMovesInGame = 0;
  let settings = {};
  $: gameUnderway = false;

  let numberOfPlayers;
  ({ numberOfPlayers } = settings);
  $: {
    if (typeof window !== "undefined") {
      numberOfPlayers &&
        setTimeout(() => {
          addStyles();
        }, 1);
    }
  }

  onMount(() => {
    setViewportSize();
    storeSettings.subscribe(value => {
      // console.log(`ScoreBoard => storeSettings.subscribe value => `, value);
      settings = value;
      ({ numberOfPlayers } = settings);
      addStyles();
    });
    players = $storePlayers;
    state = $storeState;
    storeCurrentPlayer.subscribe(value => {
      // console.log(`ScoreBoard => storeCurrentPlayer subscribed`, value);
      currentPlayer = value;
      if (value === null) {
        currentPlayer = players[0];
      }
    });
    storePlayers.subscribe(value => {
      players = value;
    });
    storeViewportSize.subscribe(val => {
      console.log(`ScoreBoard subscribed to app viewport size: `, val);
      appViewport = val;
    });
    console.log(
      `ScoreBoard subscribed to app viewport size: `,
      appViewport.width
    );
    console.log(
      `ScoreBoard subscribed to app viewport size: `,
      appViewport.height
    );
  });

  afterUpdate(() => {
    // console.log(`afterUpdate()`)
    addHighlightIfGameInProgress();
  });

  function updateStoredPlayers(player) {
    // console.log(
    //   `ScoreBoard => updateStoredPlayers: input on:blur, marker ${player.marker}, state.currentPlayer: ${currentPlayer.name} `,
    //   currentPlayer
    // );
    storePlayers.set(players);
    localStorage.setItem("state", JSON.stringify(state));
    localStorage.setItem("players", JSON.stringify(players));
    localStorage.setItem("playerDetails", true);
    storeCurrentPlayer.set(players[currentPlayer.id]);
    // localStorage.setItem(
    //   "currentPlayer",
    //   JSON.stringify(players[currentPlayer.id])
    // );
    dispatch("playerNameOrMarkerUpdate", players);
    storePreservePlayerDetails.set(true);
    // localStorage.setItem("preservePlayerDetails", JSON.stringify(true));
  }

  function highlight() {
    document.execCommand("selectall", null, false);
  }

  function addStyles() {
    let scoreboardPlayers = document.querySelectorAll(".scoreboard-player");
    scoreboardPlayers.forEach((player, i) => {
      player.style = `--player-color: ${
        players[i].bgColor
      }; --viewport-width: ${
        appViewport.width
      }; --customWidthPx: ${appViewport.width * 0.2}px;
      --custom-marginBottom: -${2000 / appViewport.width}rem`;
      
    });
  }

  function addHighlightIfGameInProgress() {
    totalMovesInGame = settings.rows * settings.columns;
    moveNumber = JSON.parse(localStorage.getItem("moveNumber"));
    if (moveNumber >= totalMovesInGame || moveNumber < 1) {
      gameUnderway = false;
      return false;
    } else {
      gameUnderway = true;
      return true;
    }
  }
  function setViewportSize() {
    let app = document.querySelector("#sapper");
    console.log(`setViewportSize for app: `, app);
    let appWidth = app.offsetWidth;
    let appHeight = app.offsetHeight;
    storeViewportSize.set({
      width: appWidth,
      height: appHeight
    });
  }
</script>

<style lang="scss">
  :root {
    --customWidthPx: calc(var(--viewport-width) * 0.2) px;
  }
  .scoreboard-container-inner {
    margin-top: 1rem;
    width: max-content;
    max-width: 100%;
    height: 100%;
  }
  .scores-wrap {
    display: flex;
    flex-direction: column;
    background: #1a1a1a;
  }
  .scores-block {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
  }
  .scores-section {
    display: flex;
    flex-direction: column;
  }

  .scoreboard-totals {
    display: flex;
    justify-content: space-between;
    background: rgba(0, 0, 0, 0.5);
  }

  .scoreboard-player {
    background: var(--player-color);
    margin: 0 1rem 1rem 1rem;
    transition: all 0.25s;
    border: 5px solid #1a1a1a;
    min-width: max-content;
    // min-width: calc(var(--viewport-width) * 0.2) px;
    // min-width: var(--customWidthPx);
    transform-origin: top left;
    transform: scale(calc(var(--viewport-width) / 2100));
    margin-bottom: var(--custom-marginBottom);
  }
  .highlighted {
    border: 5px solid #eeeeee;
    position: relative;
    transition: all 0.25s;
    min-width: max-content;
    // transform: scale(1.025);
    transform: scale(calc(var(--viewport-width) / 2000));
  }
  .scoreboard-direction {
    // background: rgba(0, 0, 155, 0.5);
    display: flex;
    color: rgba(255, 255, 255, 0.5);
    font-weight: 100;
  }

  .direction-icon {
    margin: 0.5rem;
    filter: brightness(1) invert(1) opacity(0.5);
  }
  .direction-score-section {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
  }
  .direction-score {
    justify-self: flex-end;
    margin-right: 0.5rem;
  }

  .total-score {
    // background: var(--player-color);
    padding: 0.25rem;
    margin: 0 0.5rem;
    display: flex;
    justify-content: space-between;
  }

  .total-score-number {
    background: black;
    padding: 0.5rem;
    margin: 0.25rem;
    border-radius: 2px;
    max-width: 5ch;
    min-width: 3ch;
    color: var(--player-color);
    text-align: right;
  }
  .player-name {
    background: black;
    padding: 0.5rem;
    margin: 0.25rem;
    border-radius: 2px;
    width: 100%;
    color: var(--player-color);
  }
  .player-marker {
    background: black;
    padding: 0.5rem;
    margin: 0.25rem;
    border-radius: 2px;
    max-width: 2ch;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    color: var(--player-color);
  }

  @media screen and (min-width: 960px) {
    .scoreboard-player {
      background: var(--player-color);
      margin: 0 1rem 1rem 1rem;
      transition: all 0.25s;
      border: 5px solid #1a1a1a;
      // min-width: calc(100% - 10px - 1rem);
      transform: scale(1);
    }
    .highlighted {
      transform: scale(1.025);
      border: 5px solid #eeeeee;
      position: relative;
      transition: all 0.25s;
    }
  }
</style>

{#await players then players}
  <!-- {#await state then state} -->
  <div class="scoreboard-container-inner">
    {#each players as player}
      <div
        class="scoreboard-player"
        style={`--viewport-width: ${appViewport.width}`}
        class:highlighted={currentPlayer.id == player.id ? gameUnderway : false}>
        <h3 class="total-score">
          <input
            class="player-name"
            type="text"
            bind:value={player.name}
            placeholder={player.name}
            on:click={highlight}
            on:blur={() => updateStoredPlayers(player)} />

          <input
            class="player-marker"
            type="text"
            bind:value={player.marker}
            placeholder={player.marker}
            maxlength="1"
            on:click={highlight}
            on:blur={() => updateStoredPlayers(player)} />
          <div class="total-score-number">{player.totalScore}</div>
        </h3>
        <div class="scoreboard-totals">
          {#each player.scores as direction, i}
            <div class="scoreboard-direction">
              <div class="direction-score-section">
                <img
                  class="direction-icon"
                  src={direction.iconSrc}
                  width="20"
                  height="20"
                  alt="Icon for direction {direction.name}" />
                <!-- <div class="direction-name">{direction.name}:</div> -->
                <div class="direction-score">{player.dirScoresByIndex[i]}</div>
              </div>
            </div>
          {/each}
        </div>
      </div>
    {/each}
  </div>
{/await}
<!-- {/await}  -->
