<script>
  import { onMount } from "svelte";
  export let players;

  onMount(() => {
    console.log(`CountPoints onMount(), players`);
    console.log(players);
  });

    function countPoints() {
    console.log(`CountPoints component, clicked to countPoints, players: `, players);
  }


</script>

<style lang="scss">

</style>

    <button
      class="control-button"
      id="tally-game-button"
      on:click={countPoints}>
      Tally points
    </button>
