<script>
  import { onMount, createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();
  import CountPoints from "./CountPoints.svelte";
  export let players, state, gameboardMapped;

  $: players
  // $: state.reset ? resetPlayers() : (state.reset = false);

  onMount(() => {
    console.log(`ScoreBoard onMount(), players`);
    console.log(players);
  });

  function resetPlayers() {
    console.log(`ScoreBoard => resetPlayers due to state.reset from StatusBar => TicTacToe => ScoreBoard`)
  }


  function playersScored(e) {
    console.log(`ScoreBoard receiving dispatch of playersScored, `, e.detail)
    players = e.detail
  }

  function highlight() {
document.execCommand("selectall",null,false)
  }

  function setPlayersToLS(player) {
    console.log(`ScoreBoard input on:blur, marker ${player.marker}`)
    localStorage.setItem('players', JSON.stringify(players))
    dispatch('playerNameOrMarkerUpdate', players)
  }

</script>

<style lang="scss">
.player-name {
  background: black;
  padding: .5rem;
  margin: .25rem;
  border-radius: 2px;
  width: 100%;
  color: var(--custom-bg);
}
.player-marker {
  background: black;
  padding: .5rem;
  margin: .25rem;
  border-radius: 2px;
  // width: 100%;
  color: var(--custom-bg);
}
</style>

<div class="scoreboard-container">
  <div class="scoreboard-controls">
    <CountPoints {players} {gameboardMapped} on:playersScored={playersScored} />
  </div>
  {#each players as player}
    <div class="scoreboard-totals">
      <h3 class="total-score">
      <input class="player-name" type="text" bind:value={player.name} placeholder={player.name} on:click={highlight} on:blur={() => setPlayersToLS(player)}>
        <div class="total-score-number">{player.totalScore}</div>
        <input class="player-marker" type="text" bind:value={player.marker} placeholder={player.marker} maxlength="1" on:click={highlight} on:blur={() => setPlayersToLS(player)}>
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
