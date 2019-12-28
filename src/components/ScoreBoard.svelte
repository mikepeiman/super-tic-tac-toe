<script>
  import { onMount } from "svelte";
  import CountPoints from './CountPoints.svelte';
  export let players;

  onMount(() => {
    console.log(`ScoreBoard onMount(), players`);
    console.log(players);
  });

  function test() {
    console.log(`ScoreBoard component, clicked to test players: `, players);
  }

    function countPoints() {
    console.log(`ScoreBoard component, clicked to countPoints, players: `, players);
  }


</script>

<style lang="scss">

</style>

<div class="scoreboard-container" on:click={test}>
  <div class="scoreboard-controls">
    <CountPoints {players} />
  </div>
  {#each players as player}
    <div class="scoreboard-totals">
      <h3 class="total-score">
        <div>{player.name}:</div>
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
