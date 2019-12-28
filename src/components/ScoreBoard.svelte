<script>
import {onMount} from 'svelte'
export let players

onMount(() => {
  console.log(`ScoreBoard onMount(), players`)
  console.log(players)
})

function test() {
  console.log(`scoreBoard component, clicked to test players: `, players)
}
</script>

<style lang="scss">

</style>

   <div class="scoreboard-container" on:click={test} >
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
