<script>
  import { onMount, afterUpdate, createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();
  import CountPoints from "./CountPoints.svelte";
  export let state, players, highlighted;
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
    // setTimeout(() => {
    //   addStyles();
    // }, 1);
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
    let scoreHeadings = document.querySelectorAll(".scoreboard-player");
    // console.log(
    //   `addStyle function, scoreHeadings for total-score: `,
    //   scoreHeadings
    // );
    scoreHeadings.forEach((h, i) => {
      h.style = `--custom-bg: ${players[i].bgColor}`;
    });
  }

  function addHighlightIfGameInProgress() {
    totalMovesInGame = settings.rows * settings.columns;
    moveNumber = JSON.parse(localStorage.getItem("moveNumber"));
    if (moveNumber >= totalMovesInGame || moveNumber < 1) {
      gameUnderway = false;
      return false;
      // console.log(
      //   `addHighlightIfGameInProgress! FALSE!!!! moveNumber ${moveNumber} totalMovesInGame ${totalMovesInGame}`
      // );
    } else {
      // console.log(
      //   `addHighlightIfGameInProgress! TRUE!!!!! ${moveNumber} totalMovesInGame ${totalMovesInGame}`
      // );
      gameUnderway = true;
      return true;
    }
  }
</script>

<style lang="scss">
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
    background: var(--custom-bg);
    margin: 0 1rem 1rem 1rem;
    transition: all 0.25s;
    border: 5px solid #1a1a1a;
    min-width: 200%;
    // min-width: 30vw;
    transform-origin: top left;
    transform: scale(0.5);
    margin-bottom: -2.75rem;
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
    // background: var(--custom-bg);
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
    color: var(--custom-bg);
    text-align: right;
  }
  .player-name {
    background: black;
    padding: 0.5rem;
    margin: 0.25rem;
    border-radius: 2px;
    width: 100%;
    color: var(--custom-bg);
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
    color: var(--custom-bg);
  }
  .highlighted {
    border: 5px solid #eeeeee;
    position: relative;
    transition: all 0.25s;
    // transform: scale(1.025);
    transform: translateX(1rem) scale(0.55);
  }
  @media screen and (min-width: 960px) {
    .scoreboard-player {
      background: var(--custom-bg);
      margin: 0 1rem 1rem 1rem;
      transition: all 0.25s;
      border: 5px solid #1a1a1a;
      min-width: calc(100% - 10px - 1rem);
      transform: scale(1);
    }
    .highlighted {
      transform: translateX(1rem) scale(1.025);
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
