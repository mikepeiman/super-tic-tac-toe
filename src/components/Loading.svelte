<script>
  import { onMount } from "svelte";
  import LoadingSpinner from './LoadingSpinner.svelte';
  export let loadingMsg, thisId

      console.todo = function(msg) {
	console.log(` %c%s%s%s`, `color: darkorange; background-color: black;`, `–`, msg, `–`);
}
  onMount(async () => {
    console.log(`LOADING onMount`);
    console.todo(`LOADING onMount() => console.todo`)
  });

</script>

<style lang="scss">
h2 {
  color: white;
}
</style>

      <div class="loading-message" id={thisId}>
        <h2>{loadingMsg}</h2>
        <LoadingSpinner />
      </div>