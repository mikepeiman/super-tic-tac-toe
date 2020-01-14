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
    bonusForCompleteRow: 12,
    rows: 8,
    columns: 12,
    size: 40,
    gutter: 0
  };
  // I stumbled on absolute basics: I'd forgotten that a simple = assignment creates a reference, not a copy of the object. Fixed.
  let settings = JSON.parse(JSON.stringify(initialSettings));
  // let settings = Object.assign({}, initialSettings);

  onMount(() => {
    console.log(`MainMenu onMount(), settings`, settings);
    storeCurrentPlayer.subscribe(val => {
      currentPlayer = val;
      console.log(`MainMenu => currentPlayer from store: `, currentPlayer);
    });
    let lsCurrentPlayer = JSON.parse(localStorage.getItem("currentPlayer"));
    currentPlayer = lsCurrentPlayer;
    console.log(`MainMenu => currentPlayer from ls: `, currentPlayer);
    initializeSettingsFromLS();
    initialized = true;
    setAllInputWidths();
    storeSettings.set(settings);
    storeSettings.subscribe(value => {
      console.log(`MainMenu => storeSettings.subscribe value => `, value);
    });
  });

  function initializeSettingsFromLS() {
    let gameInProgress = localStorage.getItem("gameInProgress");
    let ls = JSON.parse(localStorage.getItem("settings"));
    if (ls !== null) {
      console.log(
        `loadSettingsFromLS >>>>>>>>>>>> NOT NULL \n\n`,
        ls,
        `\nCurrent settings: \n`,
        settings
      );
      settings = ls;
      storeSettings.set(ls);
      // setTimeout(() => {
      //   initialized = true;
      // }, 5000);
    }
  }

  function setSingleInputWidth(input) {
    input.style.width = `${input.value.toString().length + 0.5}ch`;
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
    console.log(
      `triggerGameBoardUpdate settings should write to LS, eg #players ${settings.numberOfPlayers}: `,
      settings
    );
    storeSettings.set(settings);
    setSingleInputWidth(e.target);
  }

  function highlight(e) {
    e.target.select();
  }
</script>

<style lang="scss">
  $input-blue: rgba(50, 200, 255, 1);

  .loading-settings-message {
    padding: 1rem;
    // background: #1a1a1a;
    color: #eeeeee;
  }
  .settings-menu-heading {
    // color: #1a1a1a;
    // background: darken($input-blue, 30%);
    color: white;
    // border-bottom: 5px solid var(--player-color);

    display: flex;
    align-items: center;
    justify-content: flex-start;
    // margin-bottom: 0.5rem;
    & h2 {
      // padding: 0.5rem;
      font-size: .75rem;
    }
    & .loading {
      color: hsla(280, 100%, 50%, 1);
      // animation: loading-title 1s cubic-bezier(0, 0.2, 0.8, 1) infinite;
      transition: all 0.25s;
    }
  }

  .form-wrap {
    border: 2px solid var(--player-color);
    padding: 0.5rem;
    border-radius: 5px;
    display: -webkit-box;
    display: flex;
    flex-direction: column;
    -webkit-box-pack: justify;
    justify-content: space-between;
    width: 100%;
    margin-left: 2px;
    & label {
      display: grid;
      grid-template-columns: 1fr 5fr;
      grid-template-areas: "settings-input settings-label";
      // display: -webkit-box;
      font-size: 0.5rem;
      // display: flex;
      // flex-flow: row-reverse;
      align-items: flex-start;
      justify-content: flex-end;

      & .label-content {
        grid-area: settings-label;
        margin-left: 0.75rem;
        color: darken($input-blue, 30%);
      }
      & input {
        grid-area: settings-input;
        margin: 0;
        outline: none;
        // border-bottom: 1px solid darken($input-blue, 30%);
        font-size: 0.65rem;
        border-bottom: none;
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
</style>

{#if initialized}
  <div class="settings-menu-heading">
    <h2>Game Settings</h2>
  </div>
  <div
    class="form-wrap settings-menu"
    style={`--player-color: ${currentPlayer.bgColor}`}>
    <label for="players">
      <div class="label-content">players</div>
      <input
        id="players"
        name="players"
        type="number"
        placeholder={settings.numberOfPlayers}
        bind:value={settings.numberOfPlayers}
        on:input={triggerGameBoardUpdate}
        on:click={highlight}
        style="width: 2.5ch;" />
    </label>
    <label for="rows">
      <div class="label-content">rows</div>
      <input
        id="rows"
        name="rows"
        type="number"
        placeholder={settings.rows}
        bind:value={settings.rows}
        on:input={triggerGameBoardUpdate}
        on:click={highlight}
        style="width: 2.5ch;" />
    </label>
    <label for="columns">
      <div class="label-content">columns</div>
      <input
        id="columns"
        name="columns"
        type="number"
        placeholder={settings.columns}
        bind:value={settings.columns}
        on:input={triggerGameBoardUpdate}
        on:click={highlight}
        style="width: 2.5ch;" />
    </label>
    <label for="movesPerTurn">
      <div class="label-content">moves per turn</div>
      <input
        id="movesPerTurn"
        name="movesPerTurn"
        type="number"
        placeholder={settings.movesPerTurn}
        bind:value={settings.movesPerTurn}
        on:input={triggerGameBoardUpdate}
        on:click={highlight}
        style="width: 2.5ch;" />
    </label>
    <label for="movesPerTurn">
      <div class="label-content">in a row to score</div>
      <input
        id="cellsToScore"
        name="cellsToScore"
        type="number"
        placeholder={settings.cellsToScore}
        bind:value={settings.cellsToScore}
        on:input={triggerGameBoardUpdate}
        on:click={highlight}
        style="width: 2.5ch;" />
    </label>
    <label for="bonus">
      <div class="label-content">bonus for complete line</div>
      <input
        id="bonusForCompleteRow"
        name="bonusForCompleteRow"
        type="number"
        placeholder={settings.bonusForCompleteRow}
        bind:value={settings.bonusForCompleteRow}
        on:input={triggerGameBoardUpdate}
        on:click={highlight}
        style="width: 2.5ch;" />
    </label>
    <label for="size">
      <div class="label-content">square size (px)</div>
      <input
        id="size"
        name="size"
        type="number"
        placeholder={settings.size}
        bind:value={settings.size}
        step="4"
        on:input={triggerGameBoardUpdate}
        on:click={highlight}
        style="width: 2.5ch;" />
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
