<script>
  import { onMount, createEventDispatcher } from "svelte";
  import ConfigureGameToggle from "./ConfigureGameToggle.svelte";
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
  let viableGameFlag = true;
  let viableMovesFlag = true;
  let viableRoundsFlag = true;
  let toggleConfigurationFlag = false;
  let rowsUndetermined = false;
  let configuredRows = "?";
  let columnsUndetermined = false;
  let configuredColumns = "?";
  let computedGameMoves, computedMovesPerPlayer, computedRoundsPerGame;
  $: {
    computedGameMoves =
      settings.movesPerTurn * settings.numberOfPlayers * settings.roundsPerGame;
    computedMovesPerPlayer =
      (settings.rows * settings.columns) / settings.numberOfPlayers;
  }

  let initialized = false;
  let initialSettings = {
    numberOfPlayers: 3,
    movesPerTurn: 4,
    roundsPerGame: 8,
    cellsToScore: 3,
    bonusForCompleteLine: 12,
    rows: 8,
    columns: 12,
    sizeFactor: 75,
    gutter: 0
  };
  // I stumbled on absolute basics: I'd forgotten that a simple = assignment creates a reference, not a copy of the object. Fixed.
  let settings = JSON.parse(JSON.stringify(initialSettings));

  // below factors snippet from https://stackoverflow.com/a/43802308/7875457
  const factors = number =>
    Array.from(Array(number + 1), (_, i) => i).filter(i => number % i === 0);
  // end factors snippet

  let totalMoves, totalMovesFactors;
  let viableGameBoards = [];
  $: totalMoves =
    settings.numberOfPlayers * settings.movesPerTurn * settings.roundsPerGame;
  $: totalMovesFactors = factors(totalMoves);
  $: viableMoves = [];
  $: viableRows = totalMovesFactors;
  $: viableColumns = totalMovesFactors;

  onMount(async () => {
    console.log(
      `SettingsMenu => onMount(), settings, totalMoves ${totalMoves}, totalMovesFactors ${totalMovesFactors}`,
      settings
    );
    storeCurrentPlayer.subscribe(val => {
      currentPlayer = val;
    });
    let lsCurrentPlayer = JSON.parse(localStorage.getItem("currentPlayer"));
    currentPlayer = lsCurrentPlayer;
    initializeSettingsFromLS();
    viableGameFlag = true;
    setAllInputWidths();
    calculateViableFactors();
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
    console.log(`highlight func`, e.target);
  }

  async function calculateViableFactors() {
    console.log(
      `calculateViableFactors() => totalMovesFactors ${totalMovesFactors}`
    );
    // console.log(`calculateViableFactors() => totalMovesFactors.reverse() ${totalMovesFactors.reverse()}`);
    let len = totalMovesFactors.length;
    totalMovesFactors = totalMovesFactors.slice(1, len - 1);
    const reversed = totalMovesFactors.slice().reverse();
    len = totalMovesFactors.length;
    console.log(
      `calculateViableFactors() => totalMovesFactors len ${len} ${totalMovesFactors}`
    );
    console.log(
      `calculateViableFactors() => totalMovesFactors reversed ${reversed}`
    );
    viableGameBoards = [];
    for (let i = 0; i < len; i++) {
      let gridPair = {
        row: totalMovesFactors[i],
        column: reversed[i]
      };
      console.log(
        `generating viableGameBoards, grid row ${gridPair.row} col ${gridPair.column} `
      );
      viableGameBoards = [...viableGameBoards, gridPair];
    }

    console.log(`viableGameBoards `, viableGameBoards);
    let rows = settings.rows;
    let columns = settings.columns;
    let numPlayers = settings.numberOfPlayers;
    let movesPerTurn = settings.movesPerTurn;
    let roundsPerGame = settings.roundsPerGame;
    if (toggleConfigurationFlag) {
      if (rowsUndetermined) {
        rows = settings.rows = "?";
        viableRows = totalMovesFactors;
      }
      if (columnsUndetermined) {
        columns = settings.columns = "?";
        viableColumns = totalMovesFactors;
      }
      console.log(
        `rows ${rows} and columns ${columns}, typeof rows ${typeof rows} typeof columns ${typeof columns}`
      );

      if (typeof configuredRows !== "string") {
        console.log(`configuredRows !== string: ${typeof configuredRows}`);
      } else {
        if (typeof configuredColumns !== "string") {
          console.log(
            `configuredRows !== string && confyiguredColumns !== string`
          );
        }
      }
      if (typeof configuredColumns !== "string") {
        console.log(
          `configuredColumns !== string: ${typeof configuredColumns}`
        );
      } else {
        if (typeof configuredRows !== "string") {
        }
        console.log(
          `configuredColumns === string: ${typeof configuredColumns}`
        );
      }
      console.log(`viableRows ${viableRows}, viableColumns ${viableColumns}`);
    } else {
      if (typeof computedRoundsPerGame !== "string") {
        roundsPerGame = await computedRoundsPerGame;
      } else {
        roundsPerGame = Math.ceil(
          computedMovesPerPlayer / settings.movesPerTurn
        );
      }
      storeSettings.set(settings);
    }
    if (!rowsUndetermined && !columnsUndetermined) {
      storeSettings.set(settings);
    }
  }

  function setFactorValue(e) {
    console.log(`setFactorValue() => e `, e);
    console.log(`setFactorValue() => e.target.innerText `, e.target.innerText);
    console.log(
      `setFactorValue() => e.target.textContent `,
      e.target.textContent
    );
    if (toggleConfigurationFlag) {
      // if we're working with computed rows and columns
      let rowVal = parseInt(e.target.innerText);
      let columnVal = parseInt(e.target.nextElementSibling.innerText);
      console.log(`Clicked rowVal ${rowVal} columnVal ${columnVal}`);
      settings["rows"] = rowVal
      settings["columns"] = columnVal
    }

    let rows = settings.rows;
    let columns = settings.columns;
    let numPlayers = settings.numberOfPlayers;
    let movesPerTurn = settings.movesPerTurn;
    let roundsPerGame = settings.roundsPerGame;
    let id = e.target.offsetParent.id;
    // e.target.classList.add("highlighted");
    // let id = e.target.parentElement.parentElement.children[0].children[0].id;
    // console.log(`setFactorValue() => e.target.id `, id);
    // let el = document.getElementById(id);
    // // let input = el.children[1];
    // let val = parseInt(e.target.innerText);
    // console.log(`setFactorValue() => el, input id ${id}`, el);
    // el.value = val;
    // console.log(`settings updated? #1 ${settings.rows}`);
    // settings[id] = val;
    
    if (id === "rows") {
      console.log(`This is ROW`);
      configuredRows = val;
      rowsUndetermined = false;
      viableColumns = factors(
        Math.round((movesPerTurn * numPlayers * roundsPerGame) / configuredRows)
      );
    }
    if (id === "columns") {
      console.log(`This is COLUMN`);
      configuredColumns = val;
      columnsUndetermined = false;
      viableRows = factors(
        Math.round(
          (movesPerTurn * numPlayers * roundsPerGame) / configuredColumns
        )
      );
    }
    // storeSettings.set(settings);
    console.log(`settings updated? #2 ${settings.rows}`);
    calculateViableFactors();
    triggerGameBoardUpdate;
  }

  function toggleConfiguration(e) {
    console.log(
      `SettingsMenu => responding to event dispatched from configuration toggle `,
      e.detail
    );
    toggleConfigurationFlag = e.detail;
    calculateViableFactors();
  }
</script>

<style lang="scss">
  body {
    font-size: 24px;
  }
  $input-blue: rgba(50, 200, 255, 1);
  .not-viable {
    &:before {
      content: "< Not a viable value for each player to have equal turns!";
      color: red;
      position: absolute;
      top: 0;
      left: 0;
    }
  }
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
      transition: all 0.25s;
    }
  }
  .modal-title {
    border-bottom: 3px solid var(--player-color);
  }
  .settings-wrapper {
    padding: 0.5rem;
    background: var(--theme-bg);
    // border-top: 3px solid var(--player-color);
    margin: 0;
    height: auto;
    display: grid;
    grid-template-areas:
      "players rows toScore size"
      "moves columns bonus .";
    justify-content: space-between;
    align-content: center;
    transition: all 0.25s;
    &.dark {
      background: var(--theme-bg);
      color: var(--theme-fg);
      transition: all 0.25s;
    }
    &.light {
      background: var(--theme-bg);
      color: var(--theme-fg);
      transition: all 0.25s;
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
        // text-align: end;

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
      font-size: 2rem;
      // border-radius: 0 0 5px 5px;
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: flex-start;
      height: auto;
      flex-wrap: wrap;
      & label {
        // display: grid;

        // grid-template-columns: 1fr 4fr 4fr;
        // grid-template-areas: "settings-input settings-label computed";
        // display: -webkit-box;
        font-size: 100%;
        display: flex;
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

  .viable-grid {
    background: green;
  }

  #computed-widget {
    grid-area: computed;
    margin-top: 0;
    padding: 0;
    color: var(--player-color-light);
    // outline: 2px dashed var(--player-color-light);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    width: 100%;

    & span {
      &.computed-span {
        width: 100%;
        justify-content: flex-start;
        display: flex;
        flex-direction: row;
        align-items: center;
        flex-wrap: wrap;
        word-break: break-all;
      }
      &.computed-value {
        color: rgba(0, 155, 255, 1);
      }
      &.factor-item {
        padding: 0.25rem;
        margin: 0.25rem;
        color: #efefefef;
        background: var(--theme-bg);
        outline: 2px dashed var(--input-blue);
        width: auto;
        display: flex;
        justify-content: center;
        transition: all 0.25s;
        flex-direction: column;
        &:hover {
          background: var(--player-color-dark);
          transition: all 0.25s;
          cursor: pointer;
        }
        &img {
          width: 2.5rem;
          height: 2.5rem;
        }
      }
      &.factor-item-sub {
        padding: 0.25rem;
        margin: 0.25rem;
        background: rgba(0, 0, 0, 0.75);
        display: flex;
        justify-content: center;
        align-items: center;
      }
      &.highlighted {
        background: var(--player-color);
        transition: all 0.25s;
      }
      // border-bottom: 2px solid rgba(#{var(--player-color-light)}, 0.75);
    }
  }

  span.computed-span-row-columns {
    width: 100%;
    display: grid;
    grid-template-columns: 8ch auto;
    grid-template-areas: "labels factors";
  }
  .configuration-toggle-wrapper {
    margin: 0 auto;
    width: fit-content;
    display: flex;
    color: #efefefef;
    transition: all 0.25s;
    background: var(--theme-bg);
    & .configuration-item {
      margin: 1rem;
      background: rgba(0, 0, 0, 0);
    }
    & .toggled {
      background: var(--player-color-dark);
      transition: all 0.25s;
    }
  }
  .viablegameboards-wrapper {
    grid-area: factors;
    display: flex;
  }
  .configuration-row {
    display: flex;
    // background: rgba(255, 255, 255, 0.1);
    padding: 1rem;
  }

  .settings-input {
    width: 4ch;
    border-bottom: 1px solid #32c8ff;
    text-align: center;
    font-size: 2rem;
    padding: 0;
  }

  .settings-content {
    margin: 0;
    color: var(--theme-fg);
    display: block;
  }

  .settings-text {
    grid-area: labels;
    & label {
      flex-direction: row;
      margin-top: 1rem;
    }
  }

  span.direction-icon {
    width: 2rem;
    height: 2rem;
  }
</style>

{#if initialized}

  <div class="configuration-toggle-wrapper">
    <div class="configuration-item">
      <ConfigureGameToggle on:toggleConfiguration={toggleConfiguration} />
    </div>
  </div>
  <div class="configuration-toggle-wrapper">
    <h1 class:toggled={!toggleConfigurationFlag} class="configuration-item">
      Configure By Rows And Columns
    </h1>
    <h1 class:toggled={toggleConfigurationFlag} class="configuration-item">
      Configure By Moves And Rounds
    </h1>
  </div>
  {#if toggleConfigurationFlag}
    <div
      class:hidden={toggleConfigurationFlag}
      class="settings-wrapper settings-menu"
      id="moves-and-rounds-wrapper"
      style={`--player-color: ${currentPlayer.colorMain}`}>
      <div class="settings-content">
        This game shall have
        <input
          name="players"
          id="numberOfPlayers"
          type="number"
          class="settings-input"
          placeholder={settings.numberOfPlayers}
          bind:value={settings.numberOfPlayers}
          on:input={triggerGameBoardUpdate}
          min="1"
          max="8"
          on:focus={e => calculateViableFactors(e.target)}
          on:keyup={e => calculateViableFactors(e.target)}
          on:click={highlight} />
        players, each receiving
        <input
          name="movesPerTurn"
          id="movesPerTurn"
          type="number"
          class="settings-input"
          placeholder={settings.movesPerTurn}
          bind:value={settings.movesPerTurn}
          on:input={triggerGameBoardUpdate}
          min="1"
          on:focus={e => calculateViableFactors(e.target)}
          on:keyup={e => calculateViableFactors(e.target)}
          on:click={highlight} />
        moves per turn. They will engage in battle for
        <input
          name="roundsPerGame"
          id="roundsPerGame"
          type="number"
          class="settings-input"
          placeholder={settings.roundsPerGame}
          bind:value={settings.roundsPerGame}
          on:input={triggerGameBoardUpdate}
          min="1"
          on:focus={e => calculateViableFactors(e.target)}
          on:keyup={e => calculateViableFactors(e.target)}
          on:click={highlight} />
        rounds before a victor is determined. This constitutes {computedGameMoves}
        total moves. It will take
        <input
          name="cellsToScore"
          type="number"
          class="settings-input"
          id="cellsToScore"
          placeholder={settings.cellsToScore}
          bind:value={settings.cellsToScore}
          on:focus={e => calculateViableFactors(e.target)}
          on:keyup={e => calculateViableFactors(e.target)}
          on:input={triggerGameBoardUpdate}
          on:click={highlight} />
        moves in a row to score, and a complete line will receive a bonus of
        <input
          name="bonusForCompleteLine"
          type="number"
          class="settings-input"
          id="bonusForCompleteLine"
          placeholder={settings.bonusForCompleteLine}
          bind:value={settings.bonusForCompleteLine}
          on:focus={e => calculateViableFactors(e.target)}
          on:keyup={e => calculateViableFactors(e.target)}
          on:input={triggerGameBoardUpdate}
          on:click={highlight} />
        .
      </div>
      <div class="settings-content">
        <p>Select your prefered gameboard configuration below:</p>
        <div class="configuration-row">
          <div class="settings-wrapper viable-game" id="computed-widget">

            <span class="computed-span-row-columns">
              <div class="settings-text">
                <label for="rows" id="rows">
                  <div class="label-content">Rows:</div>
                  <input
                    name="rows"
                    type="number"
                    class="settings-input"
                    placeholder="?"
                    bind:value={configuredRows} />
                </label>
                <label for="columns" id="columns">
                  <div class="label-content">Columns:</div>
                  <input
                    name="columns"
                    type="number"
                    class="settings-input"
                    placeholder="?"
                    bind:value={configuredColumns} />
                </label>
              </div>
              <!-- <span class="factor-item">
                <img
                  class="direction-icon"
                  src="tictactoe-horizontal.png"
                  alt="" />
                <img
                  class="direction-icon"
                  src="tictactoe-vertical.png"
                  alt="" />
              </span> -->

              <div class="viablegameboards-wrapper">
                {#each viableGameBoards as factor}
                  <span class="factor-item">
                    <span
                      class="factor-item-sub"
                      on:click={e => setFactorValue(e)}>
                      {factor.row}
                    </span>
                    <span
                      class="factor-item-sub"
                      on:click={e => setFactorValue(e)}>
                      {factor.column}
                    </span>
                  </span>
                {/each}
              </div>
            </span>
          </div>
        </div>
        <label for="sizeFactor" id="sizeFactor">
          <div class="label-content">Board size (%)</div>
          <input
            name="sizeFactor"
            type="number"
            class="settings-input"
            placeholder={settings.sizeFactor}
            bind:value={settings.sizeFactor}
            max="100"
            step="5"
            min="10"
            on:focus={e => calculateViableFactors(e.target)}
            on:keyup={e => calculateViableFactors(e.target)}
            on:input={triggerGameBoardUpdate}
            on:click={highlight} />
          <!-- <i class="percent-symbol">%</i> -->
        </label>
      </div>

    </div>
  {:else}
    <div
      class:hidden={toggleConfigurationFlag}
      class="settings-wrapper settings-menu"
      id="rows-and-columns-wrapper"
      style={`--player-color: ${currentPlayer.colorMain}`}>
      <label for="players" id="players">
        <div class="label-content">players</div>
        <input
          name="players"
          type="number"
          class="settings-input"
          placeholder={settings.numberOfPlayers}
          bind:value={settings.numberOfPlayers}
          on:input={triggerGameBoardUpdate}
          min="1"
          max="8"
          on:focus={e => calculateViableFactors(e.target)}
          on:keyup={e => calculateViableFactors(e.target)}
          on:click={highlight} />
      </label>
      <label for="rows" id="rows">
        <div class="label-content">rows</div>
        <input
          name="rows"
          type="number"
          class="settings-input"
          placeholder={settings.rows}
          bind:value={settings.rows}
          on:focus={e => calculateViableFactors(e.target)}
          on:keyup={e => calculateViableFactors(e.target)}
          on:input={triggerGameBoardUpdate}
          on:click={highlight} />
        <div class="settings-wrapper viable-game" id="computed-widget">
          <span class="computed-span">
            {#each viableRows as factor}
              <span class="factor-item" on:click={e => setFactorValue(e)}>
                {factor}
              </span>
            {/each}
          </span>
        </div>
      </label>
      <label for="columns" id="columns">
        <div class="label-content">columns</div>
        <input
          name="columns"
          type="number"
          class="settings-input"
          placeholder={settings.columns}
          bind:value={settings.columns}
          on:focus={e => calculateViableFactors(e.target)}
          on:keyup={e => calculateViableFactors(e.target)}
          on:input={triggerGameBoardUpdate}
          on:click={highlight} />
        <div class="settings-wrapper viable-game" id="computed-widget">
          <span class="computed-span">
            {#each viableColumns as factor}
              <span class="factor-item" on:click={e => setFactorValue(e)}>
                {factor}
              </span>
            {/each}
          </span>
        </div>
      </label>
      <label for="movesPerTurn" id="movesPerTurn">
        <div class="label-content">moves per turn</div>
        <input
          name="movesPerTurn"
          type="number"
          class="settings-input"
          placeholder={settings.movesPerTurn}
          bind:value={settings.movesPerTurn}
          on:focus={e => calculateViableFactors(e.target)}
          on:keyup={e => calculateViableFactors(e.target)}
          on:input={triggerGameBoardUpdate}
          on:click={highlight} />
        <div class="settings-wrapper viable-game" id="computed-widget">
          <span class="computed-span">

            {#each viableMoves as factor}
              <span class="factor-item" on:click={e => setFactorValue(e)}>
                {factor}
              </span>
            {/each}
          </span>
        </div>
      </label>
      <label for="cellsToScore" id="cellsToScore">
        <div class="label-content">in a row to score</div>
        <input
          name="cellsToScore"
          type="number"
          class="settings-input"
          placeholder={settings.cellsToScore}
          bind:value={settings.cellsToScore}
          on:focus={e => calculateViableFactors(e.target)}
          on:keyup={e => calculateViableFactors(e.target)}
          on:input={triggerGameBoardUpdate}
          on:click={highlight} />
      </label>
      <label for="bonusForCompleteLine" id="bonusForCompleteLine">
        <div class="label-content">bonus for complete line</div>
        <input
          name="bonusForCompleteLine"
          type="number"
          class="settings-input"
          placeholder={settings.bonusForCompleteLine}
          bind:value={settings.bonusForCompleteLine}
          on:focus={e => calculateViableFactors(e.target)}
          on:keyup={e => calculateViableFactors(e.target)}
          on:input={triggerGameBoardUpdate}
          on:click={highlight} />
      </label>
      <label for="sizeFactor" id="sizeFactor">
        <div class="label-content">Board size (%)</div>
        <input
          name="sizeFactor"
          type="number"
          class="settings-input"
          placeholder={settings.sizeFactor}
          bind:value={settings.sizeFactor}
          max="100"
          step="5"
          min="10"
          on:focus={e => calculateViableFactors(e.target)}
          on:keyup={e => calculateViableFactors(e.target)}
          on:input={triggerGameBoardUpdate}
          on:click={highlight} />
        <!-- <i class="percent-symbol">%</i> -->
      </label>
    </div>
  {/if}
{:else}
  <div class="settings-menu-heading">
    <h2 class="loading">Loading Settings...</h2>
    <div class="lds-ripple">
      <div />
      <div />
    </div>
  </div>
{/if}
