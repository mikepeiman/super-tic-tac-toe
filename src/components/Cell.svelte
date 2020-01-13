<script>
  import { onMount, createEventDispatcher } from "svelte";
  // import { createEventDispatcher } from 'svelte';
  export let id, row, column, ticked, customSize, customBg;
  import { storeSettings, storeCellSize } from "../stores.js";

  let cellSize, customStyles;

  const dispatch = createEventDispatcher();
  onMount(() => {
    storeCellSize.subscribe(val => {
      cellSize = val;
    });
    let settings = $storeSettings;
    let rowFactor = 60 / settings.rows;
    let colFactor = settings.columns / 100;
    let hue = rowFactor * row + 210;
    let alpha = parseFloat((column + 1) / 200 / colFactor).toFixed(2);
    customBg = `--custom-bg: hsla(${hue}, 50%, 50%, ${alpha})`;
    customSize = `--custom-size: ${cellSize}px`;
    customStyles = `${customBg}; ${customSize}`
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
    // width: 24px;
    // height: 24px;
    width: 24px;
    height: 24px;
    min-width: 12px;
    min-height: 12px;
    width: var(--custom-size);
    height: var(--custom-size);
    background: var(--custom-bg);
    border: none;
    border: 1px solid rgba(0, 0, 0, 0.5);
    margin: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    &:hover {
      background: rgba(150, 150, 255, 0.5);
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
  width={customSize}
  height={cellSize}
  style={customStyles} />
