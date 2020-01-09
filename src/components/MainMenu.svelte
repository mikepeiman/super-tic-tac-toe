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

  let initialized = false;
  let settings = {
    numberOfPlayers: 3,
    movesPerTurn: 8,
    cellsToScore: 3,
    bonusForCompleteRow: 15,
    rows: 12,
    columns: 20,
    size: 24,
    gutter: 0
  };
  $: settings, initializeSettings();
  // $: console.log(`MainMenu settings.rows: ${settings.rows}`);
  // $: console.log(`MainMenu settings.columns: ${settings.columns}`);
  if (typeof window !== "undefined") {
    if (localStorage.getItem("settings")) {
      let ls = JSON.parse(localStorage.getItem("settings"));
      console.log(`client operation, settings exists `, ls);
      settings = ls;
    }
  }
  onMount(() => {
    console.log(`MainMenu onMount(), settings`, settings);
    initializeSettings();
    setAllInputWidths();
    storeSettings.set(settings);
    storeSettings.subscribe(value => {
      console.log(`MainMenu => storeSettings.subscribe value => `, value);
      // settings = value;
    });

    // settings.numberOfPlayers;
  });

  function initializeSettings() {
    let initSettings = new Promise((resolve, reject) => {
      if (!settings) {
        let settings = {
          numberOfPlayers: 3,
          movesPerTurn: 8,
          cellsToScore: 3,
          bonusForCompleteRow: 15,
          rows: 12,
          columns: 20,
          size: 24,
          gutter: 0
        };
      }
      if (settings.rows) {
        settings = settings;
      }
      let lsSet = localStorage.getItem("settings");
      if (lsSet) {
        let lsJSet = JSON.parse(lsSet);
        if (lsJSet) {
          console.log("settings.lineBonus: ", lsJSet.lineBonus);
          if (lsJSet.lineBonus === "undefined") {
            lsJSet.lineBonus = 0;
          }
          if (lsJSet.rows) {
            console.log(
              `initSettings :PROMISE: => localStorage settings contains rows property`
            );
            storeSettings.set(lsJSet);
            initialized = true;
            resolve(lsJSet);
          }
        }
      } else {
        let reason = new Error("No localStorage, Initialized default settings");
        initialized = true;
        reject(reason);
      }
    });

    initSettings
      .then(s => {
        console.log(
          `Here are the settings returned from our init promise: `,
          s
        );
      })
      .catch(err => {
        console.log(`Here is the error returned from our promise: `, err);
      });
  }

  function updatePlayers() {
    console.log(`MainMenu component, clicked to test countPoints: `, players);
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
    // console.log(`triggerGameBoardUpdate settings should write to LS: `, settings)
    storeSettings.set(settings);
    setSingleInputWidth(e.target);
  }
</script>

<style lang="scss">
  .loading-settings-message {
    padding: 1rem;
    // background: #1a1a1a;
    color: white;
  }
  .settings-menu-heading {
color: #a1a1a1;
    font-size: .75rem;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    & h2 {
      padding: .5rem;
    }
  }

  .form-wrap {
    display: flex;
    justify-content: space-between;
    width: 100%;
    & label {
      display: flex;
      align-items: center;
      // margin: 0.5rem 0;
      padding: 0.5rem;
      color: #a1a1a1;
    }
  }

  .settings-menu {
  }
</style>

<div class="settings-menu-heading">
  <h2>Layout and Game Options</h2>
</div>
{#if initialized}
  <div class="form-wrap settings-menu">
    <label for="players">
      # Of Players:
      <input
        id="players"
        name="players"
        type="number"
        placeholder={settings.numberOfPlayers}
        bind:value={settings.numberOfPlayers}
        on:input={triggerGameBoardUpdate}
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
    <label for="bonus">
      Line bonus:
      <input
        id="bonusForCompleteRow"
        name="bonusForCompleteRow"
        type="number"
        placeholder={settings.bonusForCompleteRow}
        bind:value={settings.bonusForCompleteRow}
        on:input={triggerGameBoardUpdate}
        style="width: 2.5ch;" />
    </label>
    <label for="size">
      Square size (px):
      <input
        id="size"
        name="size"
        type="number"
        placeholder={settings.size}
        bind:value={settings.size}
        step="4"
        on:input={triggerGameBoardUpdate}
        style="width: 2.5ch;" />
    </label>
  </div>
{:else}
  <div>
    <h1 class="loading-settings-message">Loading settings data...</h1>
  </div>
{/if}
