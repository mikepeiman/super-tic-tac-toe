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
  if(typeof window !== "undefined") {
    if(localStorage.getItem("settings")) {
      let ls = JSON.parse(localStorage.getItem("settings"))
      console.log(`client operation, settings exists `, ls)
      settings = ls
    }
  }
  onMount(() => {
    console.log(`MainMenu onMount(), settings`, settings);
    initializeSettings();
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
          if (lsJSet.rows) {
            console.log(
              `initSettings :PROMISE: => localStorage settings contains rows property`
            );
            storeSettings.set(lsJSet);
            resolve(lsJSet);
          }
        }
      } else {
        let reason = new Error("Initialized settings");
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
  function triggerGameBoardUpdate(e) {
    dispatch("updateGameSettings", settings);
    console.log(`triggerGameBoardUpdate settings should write to LS: `, settings)
    storeSettings.set(settings);
    e.target.style.width = `${e.target.value.toString().length + 0.5}ch`;
    console.log(
      `MainMenu => triggerGameBoardUpdate, check settings rows ${settings.rows}, columns ${settings.columns} `
    );
  }
</script>

<style lang="scss">

</style>

<h2>Layout and Game Options</h2>
<div class="form-wrap">
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
      style="width: 1.5ch;" />
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
