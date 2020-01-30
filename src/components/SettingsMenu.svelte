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
  let computedGameMoves, computedMovesPerPlayer, computedRoundsPerGame;
  $: {
    computedGameMoves =
      settings.movesPerTurn * settings.numberOfPlayers * settings.roundsPerGame;
    computedMovesPerPlayer =
      (settings.rows * settings.columns) / settings.numberOfPlayers;
    {
      if (!Number.isInteger(computedMovesPerPlayer)) {
        computedMovesPerPlayer = "Not viable!";
        viableGameFlag = false;
        viableMovesFlag = false;
      } else {
        computedMovesPerPlayer =
          (settings.rows * settings.columns) / settings.numberOfPlayers;
        viableGameFlag = true;
        viableMovesFlag = true;
      }
    }
    {
      if (!Number.isInteger(computedRoundsPerGame)) {
        computedRoundsPerGame = "Not viable!";
        viableGameFlag = false;
        viableRoundsFlag = false;
      } else {
        computedRoundsPerGame = computedMovesPerPlayer / settings.movesPerTurn;
        viableGameFlag = true;
        viableRoundsFlag = true;
      }
    }
  }
  // $: computedGameMoves =
  //   settings.movesPerTurn * settings.numberOfPlayers * settings.roundsPerGame;
  // $: computedMovesPerPlayer =
  //   (settings.rows * settings.columns) / settings.numberOfPlayers;
  // $: {
  //   if (!Number.isInteger(computedMovesPerPlayer)) {
  //     computedMovesPerPlayer = "Not viable!";
  //     viableGameFlag = false;
  //     viableMovesFlag = false;
  //   } else {
  //     computedMovesPerPlayer =
  //       (settings.rows * settings.columns) / settings.numberOfPlayers;
  //     viableGameFlag = true;
  //     viableMovesFlag = true;
  //   }
  // }
  // $: computedRoundsPerGame = computedMovesPerPlayer / settings.movesPerTurn;

  // below factors snippet from https://stackoverflow.com/a/43802308/7875457
  const factors = number =>
    Array.from(Array(number + 1), (_, i) => i).filter(i => number % i === 0);
  // end factors snippet

  let computeThis = 0;
  $: viableMoves = [];
  $: viableRows = [];
  $: viableColumns = [];
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

  onMount(async () => {
    console.log(`SettingsMenu onMount(), settings`, settings);
    storeCurrentPlayer.subscribe(val => {
      currentPlayer = val;
    });
    let lsCurrentPlayer = JSON.parse(localStorage.getItem("currentPlayer"));
    currentPlayer = lsCurrentPlayer;
    initializeSettingsFromLS();
    setAllInputWidths();
    storeSettings.set(settings);
    calculateViableFactors();
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
    console.log(`calculateViableFactors()`);
    let rows = settings.rows;
    let columns = settings.columns;
    let numPlayers = settings.numberOfPlayers;
    let movesPerTurn = settings.movesPerTurn;
    let roundsPerGame = settings.roundsPerGame;
    // roundsPerGame = await computedRoundsPerGame;
    if (toggleConfigurationFlag) {
      roundsPerGame;
    } else {
      if (typeof computedRoundsPerGame !== "string") {
        roundsPerGame = await computedRoundsPerGame;
      } else {
        roundsPerGame = Math.ceil(
          computedMovesPerPlayer / settings.movesPerTurn
        );
      }
      // settings.roundsPerGame = roundsPerGame
      // storeSettings.set(settings)
    }
    storeSettings.set(settings);
    if (viableGameFlag) {
      viableMoves = factors(Math.round((rows * columns) / numPlayers));
      viableRows = factors(
        Math.round((movesPerTurn * numPlayers * roundsPerGame) / columns)
      );
      viableRows = [...viableRows, viableRows[viableRows.length - 1] * 2];
      viableColumns = factors(
        Math.round((movesPerTurn * numPlayers * roundsPerGame) / rows)
      );
      viableColumns = [
        ...viableColumns,
        viableColumns[viableColumns.length - 1] * 2
      ];
    } else {
      if (viableMovesFlag) {
        viableRows = "Not viable. Change columns, rows, or moves";
        viableColumns = "Not viable. Change columns, rows, or moves";
      } else if (viableRoundsFlag) {
        viableMoves = "Not viable. Change columns, rows, or moves";
      } else {
        viableMoves = "Not viable. Change columns, rows, or moves";
        viableRows = "Not viable. Change columns, rows, or moves";
        viableColumns = "Not viable. Change columns, rows, or moves";
      }
    }
  }

  function computeViableMoves(el) {
    console.log(`computeViableMoves(el) `, el);
    let thisAttr = el.getAttribute("name");
    console.log(`computeViableMoves(el) this attr ${thisAttr}`);
    let computedWidget = document.querySelector("#computed-widget");
    let menu = document.querySelector(".settings-menu");

    let rows = settings.rows;
    let columns = settings.columns;
    let numPlayers = settings.numberOfPlayers;
    let movesPerPlayer = (rows * columns) / numPlayers;
    let movesPerTurn = settings.movesPerTurn;

    calculateViableFactors();
    let elRows = document.querySelector("#rows");
    let elColumns = document.querySelector("#columns");
    let elMovesPerTurn = document.querySelector("#movesPerTurn");
    let alertBg = `rgba(255,15,25,0.2)`;
    if (viableGameFlag === false) {
      elRows.style = `background: ${alertBg};`;
      elColumns.style = `background: ${alertBg};`;
      elMovesPerTurn.style = `background: ${alertBg};`;
    } else {
      elRows.style = `background: none;`;
      elColumns.style = `background: none;`;
      elMovesPerTurn.style = `background: none;`;
    }

    if (thisAttr === "players") {
      console.log(`this el is number of players ${el.value}`);
    } else if (thisAttr === "rows") {
      console.log(`this el is number of rows ${el.value}`);
      computeThis = columns * movesPerTurn;
      // compute viable value for this, based on given columns and moves per turn
    } else if (thisAttr === "columns") {
      console.log(`this el is number of columns ${el.value}`);
      computeThis = rows * movesPerTurn;
      // compute viable value for this, based on given row and moves per turn
    } else if (thisAttr === "movesPerTurn") {
      console.log(`this el is number of movesPerTurn ${el.value}`);
      computeThis = columns * rows;
      // compute viable value for this, based on given columns and rows
    } else {
      // settingsMenu.appendChild(computedWidget);
    }
  }

  function setFactorValue(e) {
    console.log(`setFactorValue() => e `, e);
    console.log(`setFactorValue() => e.target.innerText `, e.target.innerText);
    console.log(
      `setFactorValue() => e.target.offsetParent.id `,
      e.target.offsetParent.id
    );
    let id = e.target.offsetParent.id;
    let el = document.getElementById(id);
    let input = el.children[1];
    let val = parseInt(e.target.innerText);
    console.log(`setFactorValue() => el, input `, el, input);
    input.value = val;
    console.log(`settings updated? #1 ${settings.rows}`);
    settings[id] = val;
    storeSettings.set(settings);
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
        width: 3ch;
        display: flex;
        justify-content: center;
        transition: all 0.25s;
        &:hover {
          background: var(--player-color-dark);
          transition: all 0.25s;
          cursor: pointer;
        }
      }
      // border-bottom: 2px solid rgba(#{var(--player-color-light)}, 0.75);
    }
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
    }
    & .toggled {
      background: var(--player-color-dark);
      transition: all 0.25s;
    }
  }

  .configuration-row {
    display: flex;
    background: rgba(255, 255, 255, 0.1);
    padding: 1rem;
  }

  .settings-input {
    width: 4ch;
    border-bottom: 1px solid #32c8ff;
    text-align: center;
    font-size: 2rem;
  }

  .settings-content {
    margin: 0;
    color: var(--theme-fg);
    display: block;
  }

  .settings-text {
    & label {
      flex-direction: row;
      margin-top: 1rem;
    }
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
          on:focus={e => computeViableMoves(e.target)}
          on:keyup={e => computeViableMoves(e.target)}
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
          on:focus={e => computeViableMoves(e.target)}
          on:keyup={e => computeViableMoves(e.target)}
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
          on:focus={e => computeViableMoves(e.target)}
          on:keyup={e => computeViableMoves(e.target)}
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
          on:focus={e => computeViableMoves(e.target)}
          on:keyup={e => computeViableMoves(e.target)}
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
          on:focus={e => computeViableMoves(e.target)}
          on:keyup={e => computeViableMoves(e.target)}
          on:input={triggerGameBoardUpdate}
          on:click={highlight} />
        .
      </div>
      <p class="settings-content">
        Select your prefered gameboard configuration below:
      </p>
      <div class="configuration-row">
        <div class="settings-wrapper viable-game" id="computed-widget">
          <div class="settings-text">
            <label for="rows" id="rows">
              <div class="label-content">Rows:</div>
              <input
                name="rows"
                type="number"
                class="settings-input"
                placeholder={settings.rows}
                bind:value={settings.rows}
                on:focus={e => computeViableMoves(e.target)}
                on:keyup={e => computeViableMoves(e.target)}
                on:input={triggerGameBoardUpdate}
                on:click={highlight} />
            </label>
          </div>
          <span class="computed-span">
            {#each viableRows as factor}
              <span class="factor-item" on:click={e => setFactorValue(e)}>
                {factor}
              </span>
            {/each}
          </span>
        </div>
        <div class="settings-wrapper viable-game" id="computed-widget">
          <div class="settings-text">
            <label for="columns" id="columns">
              <div class="label-content">Columns:</div>
              <input
                name="columns"
                type="number"
                class="settings-input"
                placeholder={settings.columns}
                bind:value={settings.columns}
                on:focus={e => computeViableMoves(e.target)}
                on:keyup={e => computeViableMoves(e.target)}
                on:input={triggerGameBoardUpdate}
                on:click={highlight} />
            </label>
          </div>
          <span class="computed-span">
            {#each viableColumns as factor}
              <span class="factor-item" on:click={e => setFactorValue(e)}>
                {factor}
              </span>
            {/each}
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
          on:focus={e => computeViableMoves(e.target)}
          on:keyup={e => computeViableMoves(e.target)}
          on:input={triggerGameBoardUpdate}
          on:click={highlight} />
        <!-- <i class="percent-symbol">%</i> -->
      </label>
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
          on:focus={e => computeViableMoves(e.target)}
          on:keyup={e => computeViableMoves(e.target)}
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
          on:focus={e => computeViableMoves(e.target)}
          on:keyup={e => computeViableMoves(e.target)}
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
          on:focus={e => computeViableMoves(e.target)}
          on:keyup={e => computeViableMoves(e.target)}
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
          on:focus={e => computeViableMoves(e.target)}
          on:keyup={e => computeViableMoves(e.target)}
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
          on:focus={e => computeViableMoves(e.target)}
          on:keyup={e => computeViableMoves(e.target)}
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
          on:focus={e => computeViableMoves(e.target)}
          on:keyup={e => computeViableMoves(e.target)}
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
          on:focus={e => computeViableMoves(e.target)}
          on:keyup={e => computeViableMoves(e.target)}
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
