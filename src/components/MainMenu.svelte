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
  $: {
    // settings, initializeSettings();
    if (typeof window !== "undefined") {
      settings && checkForLSSettings();
    }
  }
  // $: console.log(`MainMenu settings.rows: ${settings.rows}`);
  // $: console.log(`MainMenu settings.columns: ${settings.columns}`);

  function checkForLSSettings() {
    let JSONls = localStorage.getItem("settings");
    let JSONinit = JSON.stringify(initialSettings);
    let JSONcurrent = JSON.stringify(settings);
    let ls = JSON.parse(JSONls);

    console.log(
      `MainMenu => checkForLSSettings() initialSettings #players ${
        initialSettings.numberOfPlayers
      }::: initialSettings === current settings::: ${JSONinit ===
        JSONcurrent}\n`,
      JSONinit,
      `\n`,
      JSONcurrent
    );
    if (JSONls !== null) {
      console.log(
        `MainMenu => checkForLSSettings() ls #players ${
          ls.numberOfPlayers
        }::: initialSettings === ls ::: ${JSONinit === JSONls}\n`,
        JSONinit,
        `\n`,
        JSONls
      );
    }
    if (ls !== null) {
      console.log(
        `MainMenu => checkForLSSettings() current #players ${
          settings.numberOfPlayers
        }::: ls === current settings ::: ${JSONls === JSONcurrent}\n`,
        JSONls,
        `\n`,
        JSONcurrent
      );
    }

    if (JSONls !== JSONcurrent) {
      if (ls !== null) {
        console.log(
          `MainMenu => checkForLSSettings() ls ${ls.numberOfPlayers} !== current settings ${settings.numberOfPlayers} so checking now which differs from initialSettings :::\n`
        );
        if (JSONcurrent === JSONinit) {
          console.log(
            `MainMenu => checkForLSSettings() current matches initial. Settings should = LS :::\n`
          );
          settings = ls;
          storeSettings.set(settings);
        } else {
          console.log(
            `Looks like we need to set current settings to LS... let's try that`
          );
          storeSettings.set(settings);
        }
      }
    } else {
      console.log(
        `MainMenu => checkForLSSettings() ls ${ls.numberOfPlayers} === current settings ${settings.numberOfPlayers}, so setting current to storeSettings :::`
      );
    }
    storeSettings.set(settings);
    initialized = true;
    // if (localStorage.getItem("settings")) {
    //   console.log(`client operation, settings exists before LS eg #players ${settings.numberOfPlayers}`, settings);
    //   let ls = JSON.parse(localStorage.getItem("settings"));
    //   console.log(`client operation, settings exists from LS eg #players ${ls.numberOfPlayers}`, ls);
    //   settings = ls;
    //   storeSettings.set(ls);
    //   initialized = true;
    // }
  }
  onMount(() => {
    console.log(`MainMenu onMount(), settings`, settings);
    // initializeSettings();
    // checkForLSSettings();
    setAllInputWidths();
    // storeSettings.set(settings);
    storeSettings.subscribe(value => {
      console.log(`MainMenu => storeSettings.subscribe value => `, value);
      // settings = value;
    });

    // settings.numberOfPlayers;
  });

  function initializeSettings() {
    let initSettings = new Promise((resolve, reject) => {
      if (!settings) {
        let settings = initialSettings;
      }
      if (settings.rows) {
        settings = settings;
      }
      let lsSet = localStorage.getItem("settings");
      if (lsSet) {
        let lsJSetParsed = JSON.parse(lsSet);
        if (lsJSetParsed) {
          // console.log("settings.lineBonus: ", lsJSet.lineBonus);
          if (lsJSetParsed.lineBonus === "undefined") {
            lsJSetParsed.lineBonus = 0;
          }
          if (lsJSetParsed.rows) {
            // console.log(
            //   `initSettings :PROMISE: => localStorage settings contains rows property`
            // );
            storeSettings.set(lsJSetParsed);
            initialized = true;
            resolve(lsJSetParsed);
          }
        }
      } else {
        let reason = new Error(
          "Not an error - no settings in localStorage, so I initialized default settings"
        );
        initialized = true;
        reject(reason);
      }
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
    color: #1a1a1a;
    background: darken($input-blue, 30%);
    font-size: 0.75rem;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    margin-bottom: 0.5rem;
    & h2 {
      padding: 0.5rem 0.5rem 0 0.5rem;
    }
  }

  .form-wrap {
    display: -webkit-box;
    display: flex;
    flex-direction: column;
    -webkit-box-pack: justify;
    justify-content: space-between;
    width: 100%;
    & label {
      display: grid;
      grid-template-columns: 1fr 5fr;
      grid-template-areas: "settings-input settings-label";
      // display: -webkit-box;
      font-size: 1rem;
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
        border-bottom: 1px solid darken($input-blue, 30%);
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
</style>

<div class="settings-menu-heading">
  <h2>Game Settings</h2>
</div>
<!-- {#if initialized} -->
<div class="form-wrap settings-menu">
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
<!-- {:else}
  <div>
    <h1 class="loading-settings-message">Loading settings data...</h1>
  </div>
{/if} -->
