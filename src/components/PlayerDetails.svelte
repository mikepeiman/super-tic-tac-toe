<script>
  import { onMount, createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();

  import {
    storeSettings,
    storeState,
    storePlayers,
    storeCurrentPlayer,
    storeDirectionArrays,
    storeGameInProgress,
    storeGameHistoryTurns,
    storePreservePlayerDetails,
    storeGameHistoryFlat
  } from "../stores.js";

  let currentPlayer;
  let initialized = false;
  let initialSettings = {
    numberOfPlayers: 3,
    movesPerTurn: 4,
    cellsToScore: 3,
    bonusForCompleteLine: 12,
    rows: 8,
    columns: 12,
    sizeFactor: 75,
    gutter: 0
  };
  // I stumbled on absolute basics: I'd forgotten that a simple = assignment creates a reference, not a copy of the object. Fixed.
  let settings = JSON.parse(JSON.stringify(initialSettings));
  // let settings = Object.assign({}, initialSettings);

  onMount(() => {
    console.log(`SettingsMenu onMount(), settings`, settings);
    storeCurrentPlayer.subscribe(val => {
      currentPlayer = val;
    });
    let lsCurrentPlayer = JSON.parse(localStorage.getItem("currentPlayer"));
    currentPlayer = lsCurrentPlayer;
    initializeSettingsFromLS();
    setAllInputWidths();
    storeSettings.set(settings);
  });

  function initializeSettingsFromLS() {
    let gameInProgress = localStorage.getItem("gameInProgress");
    let ls = JSON.parse(localStorage.getItem("settings"));
    if (ls !== null) {
      settings = ls;
      storeSettings.set(ls);
      initialized = true;
    }
  }

  function setSingleInputWidth(input) {
    if (!input.classList.contains("player-mark")) {
      input.style.width = `${input.value.toString().length + 0.5}ch`;
    } else {
      input.style.width = `3ch`;
    }
  }

  function setAllInputWidths() {
    let inputs = document.querySelectorAll("input");
    let len = inputs.length;
    for (let i = 0; i < len; i++) {
      setSingleInputWidth(inputs[i]);
    }
  }

  function triggerGameBoardUpdate(e) {
    dispatch("updateGameSettings", settings);
    storeSettings.set(settings);
    setSingleInputWidth(e.target);
  }

  function highlight(e) {
    e.target.select();
  }
</script>

<style lang="scss">
  body {
    font-size: 24px;
  }
  $input-blue: rgba(50, 200, 255, 1);

  .loading-settings-message {
    padding: 1rem;
    color: #eeeeee;
  }
  .settings-menu-heading {
    color: white;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    & h2 {
      font-size: 125%;
    }
    & .loading {
      color: hsla(280, 100%, 50%, 1);
      // animation: loading-title 1s cubic-bezier(0, 0.2, 0.8, 1) infinite;
      transition: all .45s;
    }
  }

  .settings-wrapper {
    padding: 0.5rem;
    background: var(--theme-bg); 
    border-top: 3px solid var(--player-color);
    border-bottom: 3px solid var(--player-color);
    margin: 0;
    height: auto;
    display: grid;
    grid-template-areas:
      "players rows toScore size"
      "moves columns bonus .";
    justify-content: space-between;
    align-content: center;
    transition: all .45s;
    &.dark {
      background: var(--theme-bg);
      color: var(--theme-fg);
      transition: all .45s;
    }
    &.light {
      background: var(--theme-bg);
      color: var(--theme-fg);
      transition: all .45s;
    }

    & label {
      display: flex;
      flex-direction: row-reverse;
      // grid-template-columns: 1fr 5fr;
      // grid-template-rows: 1.5rem 1.5rem;
      // grid-template-areas: "settings-input settings-label";
      // display: -webkit-box;
      font-size: 80%;
      // display: flex;
      // flex-flow: row-reverse;
      align-items: baseline;
      justify-content: flex-end;
      position: relative;

      & .label-content {
        grid-area: settings-label;
        margin-left: 0.25em;
        color: darken($input-blue, 30%);
      }
      & input {
        grid-area: settings-input;
        margin: 0;
        outline: none;
        // border-bottom: none;
        border-bottom: 1px solid darken($input-blue, 30%);
        font-size: 1em;
        position: relative;

        padding: 0;
        &:focus {
          border-bottom: 1px solid $input-blue;
          outline: none;
        }
        &::selection {
          color: white;
          background: $input-blue;
        }
      }
    }
  }
  #players {
    grid-area: players;
  }
  #rows {
    grid-area: rows;
  }
  #columns {
    grid-area: columns;
  }
  #movesPerTurn {
    grid-area: moves;
  }
  #cellsToScore {
    grid-area: toScore;
  }
  #bonusForCompleteLine {
    grid-area: bonus;
  }
  #sizeFactor {
    grid-area: size;
  }

  #sizeFactor {
    position: relative;
  }
  .percent-symbol {
    position: absolute;
    color: $input-blue;
    margin-right: 1ch;
    left: 3ch;
    font-family: "Muli";
  }

  .lds-ripple {
    display: inline-block;
    position: relative;
    width: 2rem;
    height: 2rem;
  }
  .lds-ripple div {
    position: absolute;
    border: 4px solid #fff;
    opacity: 1;
    border-radius: 50%;
    // animation: lds-ripple 1s cubic-bezier(0, 0.2, 0.8, 1) infinite;
  }
  .lds-ripple div:nth-child(2) {
    animation-delay: -0.5s;
  }
  @keyframes lds-ripple {
    0% {
      top: 2rem; // 36px;
      left: 2rem;
      // top: 0px;
      // left: 0px;
      width: 0;
      height: 0;
      opacity: 1;
    }
    100% {
      top: 0px;
      left: 0px;
      width: 4rem; // 72px;
      height: 4rem;
      opacity: 0;
    }
  }

  @keyframes loading-title {
    0% {
      top: 2rem; // 36px;
      left: 2rem;
      // top: 0px;
      // left: 0px;
      width: 0;
      height: 0;
      opacity: 1;
    }
    100% {
      top: 0px;
      left: 0px;
      width: 4rem; // 72px;
      height: 4rem;
      opacity: 0;
    }
  }

  @media screen and (min-width: 600px) {

  }
  @media screen and (min-width: 900px) {

    .settings-wrapper {
      padding: 0.5rem 0.5rem 0.5rem 0;
      margin: 0;
      margin-right: 1rem;
      // border-radius: 0 0 5px 5px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      height: auto;
      & label {
        display: grid;
        grid-template-columns: 1fr 5fr;
        grid-template-areas: "settings-input settings-label";
        // display: -webkit-box;
        font-size: 100%;
        // display: flex;
        // flex-flow: row-reverse;
        align-items: baseline;
        justify-content: flex-end;
        position: relative;

        & .label-content {
          grid-area: settings-label;
          margin-left: 0.25em;
          color: darken($input-blue, 30%);
        }
        & input {
          grid-area: settings-input;
          margin: 0;
          outline: none;
          // border-bottom: none;
          border-bottom: 1px solid darken($input-blue, 30%);
          font-size: 100%;
          position: relative;

          padding: 0;
          &:focus {
            border-bottom: 1px solid $input-blue;
            outline: none;
          }
          &::selection {
            color: white;
            background: $input-blue;
          }
        }
      }
    }
  }

  @media screen and (min-width: 1200px) {

  }

  @media screen and (min-width: 1500px) {

  }
</style>

{#if initialized}
  <div
    class="settings-wrapper settings-menu"
    style={`--player-color: ${currentPlayer.colorMain}`}>
    <label for="players" id="players">
      <div class="label-content">players</div>
      <input
        name="players"
        type="number"
        placeholder={settings.numberOfPlayers}
        bind:value={settings.numberOfPlayers}
        on:input={triggerGameBoardUpdate}
        on:click={highlight}
        style="width: 2.5ch;" />
    </label>
    <label for="rows" id="rows">
      <div class="label-content">rows</div>
      <input
        name="rows"
        type="number"
        placeholder={settings.rows}
        bind:value={settings.rows}
        on:input={triggerGameBoardUpdate}
        on:click={highlight}
        style="width: 2.5ch;" />
    </label>
    <label for="columns" id="columns">
      <div class="label-content">columns</div>
      <input
        name="columns"
        type="number"
        placeholder={settings.columns}
        bind:value={settings.columns}
        on:input={triggerGameBoardUpdate}
        on:click={highlight}
        style="width: 2.5ch;" />
    </label>
    <label for="movesPerTurn" id="movesPerTurn">
      <div class="label-content">moves per turn</div>
      <input
        name="movesPerTurn"
        type="number"
        placeholder={settings.movesPerTurn}
        bind:value={settings.movesPerTurn}
        on:input={triggerGameBoardUpdate}
        on:click={highlight}
        style="width: 2.5ch;" />
    </label>
    <label for="cellsToScore" id="cellsToScore">
      <div class="label-content">in a row to score</div>
      <input
        name="cellsToScore"
        type="number"
        placeholder={settings.cellsToScore}
        bind:value={settings.cellsToScore}
        on:input={triggerGameBoardUpdate}
        on:click={highlight}
        style="width: 2.5ch;" />
    </label>
    <label for="bonusForCompleteLine" id="bonusForCompleteLine">
      <div class="label-content">bonus for complete line</div>
      <input
        name="bonusForCompleteLine"
        type="number"
        placeholder={settings.bonusForCompleteLine}
        bind:value={settings.bonusForCompleteLine}
        on:input={triggerGameBoardUpdate}
        on:click={highlight}
        style="width: 2.5ch;" />
    </label>
    <label for="sizeFactor" id="sizeFactor">
      <div class="label-content">Board size (%)</div>
      <input
        name="sizeFactor"
        type="number"
        placeholder={settings.sizeFactor}
        bind:value={settings.sizeFactor}
        max="100"
        step="5"
        min="10"
        on:input={triggerGameBoardUpdate}
        on:click={highlight}
        style="width: 2.5ch;" />
      <!-- <i class="percent-symbol">%</i> -->
    </label>
  </div>
{:else}
  <div class="settings-menu-heading">
    <h2 class="loading">Loading Settings...</h2>
    <div class="lds-ripple">
      <div />
      <div />
    </div>
  </div>
{/if}
