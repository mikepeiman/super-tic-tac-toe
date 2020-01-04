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
    storeGameHistory,
    storePreservePlayerDetails
  } from "../stores.js";

  $: players = [];
  $: state = {};
  $: currentPlayer = {};

  // storePlayers.subscribe(value => {
  //   console.log(`ScoreBoard => storePlayers subscribed`, value);
  //   players = value;
  // });
  // storeState.subscribe(value => {
  //   console.log(`ScoreBoard => storeState subscribed`, value);
  //   players = value;
  // });


  onMount(() => {
    players = $storePlayers;
    state = $storeState;
    currentPlayer = $storeCurrentPlayer;
      storeCurrentPlayer.subscribe(value => {
    console.log(`ScoreBoard => storeCurrentPlayer subscribed`, value);
    currentPlayer = value
  });
  storePlayers.subscribe(value => {
    console.log(`ScoreBoard => storePlayers subscribed value, players `, value, players);
    // players = value
  });
  });

  afterUpdate(() => {
    // storePlayers.set(players)
  });

  function updateStoredPlayers(player) {
    console.log(
      `ScoreBoard => updateStoredPlayers: input on:blur, marker ${player.marker}, state.currentPlayer: ${currentPlayer.name} `,
      currentPlayer
    );
    storePlayers.set(players);
    localStorage.setItem("state", JSON.stringify(state));
    localStorage.setItem("players", JSON.stringify(players));
    localStorage.setItem("playerDetails", true);
    localStorage.setItem(
      "currentPlayer",
      JSON.stringify(players[currentPlayer.id])
    );
    dispatch("playerNameOrMarkerUpdate", players);
    storePreservePlayerDetails.set(true);
    localStorage.setItem("storePreservePlayerDetails", JSON.stringify(true));
  }

  function highlight() {
    document.execCommand("selectall", null, false);
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

  .scoreboard-container {
    background: #1a1a1a;
  }
  .scoreboard-player {
    display: flex;
    justify-content: space-between;
    background: rgba(0, 0, 0, 0.5);
  }
  // .scoreboard-headings {
  // }
  .scoreboard-totals {
    background: var(--custom-bg);
    margin: 1rem;
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
    background: var(--custom-bg);
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
    // border: 10px solid var(--custom-bg);
    border: 5px solid white;
    // background: rgba(255, 255, 255, 0.5);
  }
</style>

{#await players then players}
  {#await state then state}
    <div class="scoreboard-container">
      {#each players as player}
        <div
          class="scoreboard-totals"
          class:highlighted={currentPlayer.id == player.id}>
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
          <div class="scoreboard-player">
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
                  <div class="direction-score">
                    {player.dirScoresByIndex[i]}
                  </div>
                </div>
              </div>
            {/each}
          </div>
        </div>
      {/each}
    </div>
  {/await}
{/await}
