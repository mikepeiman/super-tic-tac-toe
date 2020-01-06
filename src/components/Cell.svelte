<script>
  import { onMount, createEventDispatcher } from "svelte";
  // import { createEventDispatcher } from 'svelte';
  export let id, row, column, player, ticked, cellClasses, cellStyles, customBg;
  import { storeSettings } from "../stores.js";

  const dispatch = createEventDispatcher();
  onMount(() => {
    let settings = $storeSettings;
    let rowFactor = 60 / settings.rows;
    let colFactor = settings.columns / 100;
    let hue = rowFactor * row + 210;
    let alpha = parseFloat((column + 1) / 200 / colFactor).toFixed(2);
    customBg = `--custom-bg: hsla(${hue}, 50%, 50%, ${alpha})`;
    // console.log(`------------Cell => onMount() ${id} row ${row} column ${column} rowFactor ${rowFactor} colFactor ${colFactor} color vars: hue ${hue} alpha ${alpha}`);
  });

  function moveNotification() {
    dispatch("move", id);
  }
</script>

<style lang="scss">
  .gameboard-board {
    margin: 2rem;
    display: flex;
    flex-direction: column;
    align-self: center;
    border: 0px solid none;
  }

  .game-row {
    display: flex;
  }

  .game-square {
    width: 24px;
    height: 24px;
    background: var(--custom-bg);
    border: 1px solid black;
    display: flex;
    justify-content: center;
    align-items: center;
    &:hover {
      background: rgba(150, 150, 255, 0.5);
    }
  }
  .ticked {
    &.unlocked {
      border: 1px solid red;
    }
    &:hover {
      background: rgba(150, 150, 255, 0.5);
    }
    &::after {
      content: attr(data-marker);
      justify-self: center;
      align-self: center;
      background: attr(data-background-color);
    }
  }
</style>

<div
  class="game-square"
  {row}
  {column}
  {id}
  on:click={moveNotification}
  data-ticked={ticked}
  data-marker="Y"
  style={customBg} />
