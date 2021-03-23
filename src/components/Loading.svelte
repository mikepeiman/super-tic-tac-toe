<script>
  import { onMount } from "svelte";
  import LoadingSpinner from "./LoadingSpinner.svelte";
  export let loadingMsg, thisId;

  console.todo = function(msg) {
    console.log(
      ` %c%s%s%s`,
      `color: darkorange; background-color: black;`,
      `–`,
      msg,
      `–`
    );
  };

  const light = "#efefefef";
  const dark = "#1a1a1a";
  onMount(async () => {
    // console.log(`LOADING onMount`);
    // console.todo(`LOADING onMount() => console.todo`);
    document.documentElement.style.setProperty("--theme-bg", dark);
    document.documentElement.style.setProperty("--theme-dark", dark);
    document.documentElement.style.setProperty("--theme-fg", light);
    document.documentElement.style.setProperty("--theme-light", light);
  });
</script>

<style lang="scss">

</style>

<div class="loading-message" id={thisId}>
  <h2>{loadingMsg}</h2>
  <!-- <LoadingSpinner /> -->
</div>
