<script>
  import { onMount, createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();
  import CountPoints from "./CountPoints.svelte";
  export let players, state, gameboardMapped, highlighted

  $: players, resetPlayers()
  // $: state.reset ? resetPlayers() : (state.reset = false);

  onMount(() => {
    console.log(`ScoreBoard onMount(), players`);
    console.log(players);
  });

  function resetPlayers() {
    console.log(
      `ScoreBoard => resetPlayers due to players change from StatusBar => TicTacToe => ScoreBoard`
    );
  }

  function playersScored(e) {
    console.log(`ScoreBoard receiving dispatch of playersScored, `, e.detail);
    players = e.detail;
  }

  function highlight() {
    document.execCommand("selectall", null, false);
  }

  function setPlayersToLS(player) {
    console.log(`ScoreBoard => setPlayersToLS: input on:blur, marker ${player.marker}, state.currentPlayer: ${state.currentPlayer.name} `, state.currentPlayer);
    localStorage.setItem("players", JSON.stringify(players));
    localStorage.setItem("state", JSON.stringify(state));
    // localStorage.setItem("gameInProgress", true);
    localStorage.setItem("playerDetails", true);
    localStorage.setItem("currentPlayer", JSON.stringify(players[state.currentPlayer.id]));
    dispatch("playerNameOrMarkerUpdate", players);
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
    // position: absolute;
    // left: 0;
    background: rgba(0, 0, 155, 0.1);
  }
  .scoreboard-headings {
    background: rgba(0, 0, 155, 0.1);
  }
  .scoreboard-totals {
    background: rgba(0, 0, 155, 0.1);
  }
  .scoreboard-direction {
    background: rgba(0, 0, 155, 0.1);
    display: flex;
    // padding: .25rem;
  }

  .direction-icon {
    margin-left: 0.5rem;
    // background: #1a1a1a;
  }
  .direction-score-section {
    display: flex;
    justify-content: space-between;
    width: 100%;
  }
  .direction-score {
    justify-self: flex-end;
    margin-right: 0.5rem;
  }

  .total-score {
    background: var(--custom-bg);
    padding: 0.25rem;
    margin: 0;
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
    border: 10px solid var(--custom-bg);
    background: white;
  }
</style>

{#await players then players}
<div class="scoreboard-container">
  <div class="scoreboard-controls">
    <CountPoints {players} {gameboardMapped} on:playersScored={playersScored} />
  </div>
  {#each players as player}
    <div class="scoreboard-totals">
      <h3 class="total-score" class:highlighted={state.currentPlayer.id == player.id}>
        <input
          class="player-name"
          type="text"
          bind:value={player.name}
          placeholder={player.name}
          on:click={highlight}
          on:blur={() => setPlayersToLS(player)} />

        <input
          class="player-marker"
          type="text"
          bind:value={player.marker}
          placeholder={player.marker}
          maxlength="1"
          on:click={highlight}
          on:blur={() => setPlayersToLS(player)} />
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
              <div class="direction-name">{direction.name}:</div>
              <div class="direction-score">{player.dirScoresByIndex[i]}</div>
            </div>
          </div>
        {/each}
      </div>
    </div>
  {/each}
</div>
{/await}
