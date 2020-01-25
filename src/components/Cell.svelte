<script>
  import { onMount, createEventDispatcher } from "svelte";
  // import { createEventDispatcher } from 'svelte';
  export let id,
    row,
    column,
    ticked,
    customSize,
    customMarkSize,
    customMark,
    playerColor,
    ggBg;
  import {
    storeSettings,
    storeCellSize,
    storeCurrentPlayer
  } from "../stores.js";

  let cellSize, customStyles, currentPlayer;

  const dispatch = createEventDispatcher();
  onMount(() => {
    storeCellSize.subscribe(val => {
      cellSize = val;
    });
    storeCurrentPlayer.subscribe(val => {
      currentPlayer = val;
    });
    let settings = $storeSettings;
    let rowFactor = 60 / settings.rows;
    let colFactor = settings.columns / 100;
    let hue = rowFactor * row + 210;
    let alpha = parseFloat((column + 1) / 200 / colFactor).toFixed(2);
    ggBg = `--gg-bg: hsla(${hue}, 50%, 50%, ${alpha})`;
    playerColor = `--player-color: ${currentPlayer.color}`
    customSize = `--custom-size: ${cellSize}px`;
    customMarkSize = `--custom-mark-size: ${cellSize / 2}px`;
    customMark = `--player-mark: ${currentPlayer.mark}`;
    customStyles = `${ggBg}; ${playerColor}; ${customSize}; ${customMarkSize}; ${customMark};`;
    // console.log(`------------Cell => onMount() ${id} row ${row} column ${column} rowFactor ${rowFactor} colFactor ${colFactor} color vars: hue ${hue} alpha ${alpha}`);
  });

  function moveNotification() {
    dispatch("move", id);
  }
</script>

<style lang="scss">

</style>

<div
  class="game-square unticked"
  {row}
  {column}
  {id}
  on:click={moveNotification}
  data-ticked={ticked}
  style={customStyles} />
