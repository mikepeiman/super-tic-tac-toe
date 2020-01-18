<script>
  import { onMount } from "svelte";
  // import { storeViewportSize } from "./../stores.js";


  onMount(() => {
  });

  const toggleStyles = () => {
    console.log(`toggleStyles ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^`)
  };
</script>

<style lang="scss">
  :global(.window button.close) {
    width: 3rem;
    height: 3rem;
    &:before {
      left: 0.5rem;
      width: 2rem;
    }
    &:after {
      left: 0.5rem;
      width: 2rem;
    }
  }
</style>

<button
  class="control-button"
  id="night-mode-toggle"
  on:click={toggleStyles}>
  Game Menu
</button>
