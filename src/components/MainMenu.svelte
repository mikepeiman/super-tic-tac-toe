<script>
  import { onMount, createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();
  export let players, settings;
  import { writable } from "svelte/store";
  import { xState, xSettings, xLines } from '../stores.js';
  
  $: console.log(`MainMenu settings.rows: ${settings.rows}`);
  $: console.log(`MainMenu settings.columns: ${settings.columns}`);
  $: state = xState


  onMount(() => {
    console.log(`MainMenu onMount(), settings`);
    console.log(settings);
  });

  function initializePlayers() {
    console.log(`MainMenu component, clicked to test countPoints: `, players);
  }

  function triggerGameBoardUpdate(e) {
    dispatch("updateGameSettings", settings);
    localStorage.setItem("settings", JSON.stringify(settings));
    e.target.style.width = `${e.target.value.toString().length + 0.5}ch`;
    console.log(
      `MainMenu => triggerGameBoardUpdate, check settings rows ${settings.rows}, columns ${settings.columns} `
    );
  }
</script>

<style lang="scss">

</style>

<h2>Layout and Game Options</h2>
{state.clickCount}
<div class="form-wrap">
  <label for="players">
    # Of Players:
    <input
      id="players"
      name="players"
      type="number"
      placeholder={settings.numberOfPlayers}
      bind:value={settings.numberOfPlayers}
      on:input={initializePlayers}
      style="width: 2.5ch;" />
  </label>
  <label for="rows">
    Rows:
    <input
      id="rows"
      name="rows"
      type="number"
      placeholder={settings.rows}
      bind:value={settings.rows}
      on:input={triggerGameBoardUpdate}
      style="width: 2.5ch;" />
  </label>
  <label for="columns">
    Columns:
    <input
      id="columns"
      name="columns"
      type="number"
      placeholder={settings.columns}
      bind:value={settings.columns}
      on:input={triggerGameBoardUpdate}
      style="width: 2.5ch;" />
  </label>
  <label for="movesPerTurn">
    Moves Per Turn:
    <input
      id="movesPerTurn"
      name="movesPerTurn"
      type="number"
      placeholder={settings.movesPerTurn}
      bind:value={settings.movesPerTurn}
      on:input={triggerGameBoardUpdate}
      style="width: 2.5ch;" />
  </label>
  <label for="movesPerTurn">
    Cells-in-a-row to score:
    <input
      id="cellsToScore"
      name="cellsToScore"
      type="number"
      placeholder={settings.cellsToScore}
      bind:value={settings.cellsToScore}
      on:input={triggerGameBoardUpdate}
      style="width: 2.5ch;" />
  </label>
  <label for="size">
    Square size (px):
    <input
      id="size"
      name="size"
      type="number"
      placeholder="24"
      bind:value={settings.size}
      step="4"
      on:input={triggerGameBoardUpdate}
      style="width: 2.5ch;" />
  </label>
  <label for="gutter">
    Gutter (px):
    <input
      id="gutter"
      name="gutter"
      type="number"
      placeholder={settings.gutter}
      bind:value={settings.gutter}
      on:input={triggerGameBoardUpdate}
      style="width: 1.5ch;" />
  </label>

</div>
