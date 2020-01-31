<script>
  import { onMount, createEventDispatcher } from "svelte";
  // import ConfigureGameToggle from "./ConfigureGameToggle.svelte";
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
  let rowsAndColumns = true;
  let movesAndRounds = false;
  let rowsUndetermined = false;
  let columnsUndetermined = false;
  let configuredRows = "?";
  let configuredColumns = "?";
  let configuredMovesPerTurn = "?";
  let configuredRoundsPerGame = "?";
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

  let totalMoves, totalMovesFactors, playerMoves, playerMovesFactors;
  let viableGameBoards = [];
  let viableMovesAndRounds = [];
  $: playerMoves =
    (settings.rows * settings.columns) / settings.numberOfPlayers;
  $: totalMoves =
    settings.numberOfPlayers * settings.movesPerTurn * settings.roundsPerGame;
  $: totalMovesFactors = factors(totalMoves);

  $: viableMoves = Number.isInteger(playerMoves);
  $: playerMovesFactors = viableMoves ? factors(playerMoves) : factors(2);
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
    totalMovesFactors = await factors(totalMoves);
    console.log(
      `calculateViableFactors() => totalMovesFactors ${totalMovesFactors}, viableMoves? ${viableMoves}`
    );
    // console.log(`calculateViableFactors() => totalMovesFactors.reverse() ${totalMovesFactors.reverse()}`);
    let lenTotalMoves = totalMovesFactors.length;
    totalMovesFactors = totalMovesFactors.slice(1, lenTotalMoves - 1);
    let totalMovesFactorsReversed = totalMovesFactors.slice().reverse();
    lenTotalMoves = totalMovesFactors.length;
    console.log(
      `calculateViableFactors() => totalMovesFactors lenTotalMoves ${lenTotalMoves} ${totalMovesFactors}`
    );
    console.log(
      `calculateViableFactors() => totalMovesFactors totalMovesFactorsReversed ${totalMovesFactorsReversed}`
    );
    viableGameBoards = [];
    for (let i = 0; i < lenTotalMoves; i++) {
      let gridPair = {
        row: totalMovesFactors[i],
        column: totalMovesFactorsReversed[i]
      };
      console.log(
        `generating viableGameBoards, grid row ${gridPair.row} col ${gridPair.column} `
      );
      viableGameBoards = [...viableGameBoards, gridPair];
    }

    let lenPlayerMoves = playerMovesFactors.length;
    let playerMovesFactorsReversed = playerMovesFactors.slice().reverse();
    viableMovesAndRounds = [];
    for (let i = 0; i < lenPlayerMoves; i++) {
      let movesRoundsPair = {
        moves: playerMovesFactors[i],
        rounds: playerMovesFactorsReversed[i]
      };
      console.log(
        `generating viableMovesAndRounds, moves ${movesRoundsPair.moves} rounds ${movesRoundsPair.rounds} `
      );
      viableMovesAndRounds = [...viableMovesAndRounds, movesRoundsPair];
    }

    console.log(`viableGameBoards `, viableGameBoards);
    console.log(`viableMovesAndRounds `, viableMovesAndRounds);
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
    let el = e.target;
    console.log(`setFactorValue() => e.target `, e.target);
    console.log(
      `setFactorValue() => e.target.textContent `,
      e.target.textContent
    );
    console.log(
      `settings updated? #1 rows ${settings.rows} columns ${settings.columns}`
    );
    if (movesAndRounds) {
      // if we're working with computed rows and columns
      let rowVal = parseInt(e.target.innerText);
      let columnVal = parseInt(e.target.nextElementSibling.innerText);
      console.log(`Clicked rowVal ${rowVal} columnVal ${columnVal}`);
      settings["rows"] = rowVal;
      configuredRows = rowVal;
      settings["columns"] = columnVal;
      configuredColumns = columnVal;
    } else if (rowsAndColumns) {
      let movesVal = parseInt(e.target.innerText);
      let roundsVal = parseInt(e.target.nextElementSibling.innerText);
      console.log(`Clicked movesVal ${movesVal} roundsVal ${roundsVal}`);
      settings["movesPerTurn"] = movesVal;
      configuredMovesPerTurn = movesVal;
      settings["roundsPerGame"] = roundsVal;
      configuredRoundsPerGame = roundsVal;
    }

    let rows = settings.rows;
    let columns = settings.columns;
    let numPlayers = settings.numberOfPlayers;
    let movesPerTurn = settings.movesPerTurn;
    let roundsPerGame = settings.roundsPerGame;
    let id = e.target.offsetParent.id;

    console.log(
      `settings updated? #2 rows ${settings.rows} columns ${settings.columns}`
    );
    calculateViableFactors();
    triggerGameBoardUpdate;
  }

  function setConfigurationMode(e) {
    toggleConfigurationFlag = true;
    console.log(`setConfigurationMode() clicked `, e.target);
    let id = e.target.id;
    console.log(`setConfigurationMode() clicked id ${id}`);
    if (id === "movesAndRounds") {
      rowsAndColumns = false;
      movesAndRounds = true;
    } else if (id === "rowsAndColumns") {
      rowsAndColumns = true;
      movesAndRounds = false;
    }
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
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    // padding: 0.5rem;
    // background: var(--theme-bg);
    // border-top: 3px solid var(--player-color);
    // margin: 0;
    // height: auto;
    // display: grid;
    // grid-template-areas:
    //   "players rows toScore size"
    //   "moves columns bonus .";
    // justify-content: space-between;
    // align-content: center;
    transition: all 0.25s;
    &.dark {
      // background: var(--theme-bg);
      color: var(--theme-fg);
      transition: all 0.25s;
    }
    &.light {
      // background: var(--theme-bg);
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
    color: #32c8ff;
    margin: 0;
    margin-left: -1ch;
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
      // padding: 0.5rem 0.5rem 0.5rem 0;
      margin: 0;
      // margin-right: 1rem;
      font-size: 1.5rem;
      // border-radius: 0 0 5px 5px;
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: flex-start;
      height: auto;
      flex-wrap: wrap;
      & .configuration-item {
        padding: 1rem;
        font-size: 2rem;
      }
      & label {
        font-size: 100%;
        display: flex;
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
      & .settings-input {
        width: 3rem;
        font-size: 1.5rem;
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
        // padding: 0.25rem;
        margin: 0.25rem;
        color: #efefefef;
        background: var(--theme-bg);
        // outline: 2px dashed var(--input-blue);
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
      }

      &.factor-item-sub {
        padding: 0.5rem;
        margin: 0;
        background: rgba(0, 0, 0, 0.75);
        display: flex;
        justify-content: center;
        align-items: center;
        outline: 1px dashed var(--input-blue);
      }
      &.highlighted {
        background: var(--player-color);
        transition: all 0.25s;
      }
      // border-bottom: 2px solid rgba(#{var(--player-color-light)}, 0.75);
    }
  }

  #computed-widget {
    & .computed-rows-columns {
      width: 100%;
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      // display: grid;
      // grid-template-columns: 8ch auto;
      // grid-template-areas: "labels factors";
      & .viablegameboards-wrapper {
        & .highlighted {
          background: var(--player-color);
          transition: all 0.25s;
        }
      }
    }
    & .computed-moves-rounds {
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
    }
  }
  .configuration-toggle-wrapper {
    margin: 0 auto;
    width: fit-content;
    display: flex;
    color: #efefefef;
    transition: all 0.25s;
    // background: #1a1a1aaa;
    & .configuration-item {
      margin: 1rem;
      padding: 1rem;
      font-size: 1.25rem;
      border-radius: 5px;
      background: darken(#32c8ff, 30%);
      transition: all 0.25s;
      &:hover {
        background: darkorange;
        transition: all 0.25s;
      }
    }
    // & .toggled {
    //   background: darken(darkorange, 30%);
    //   transition: all 0.25s;
    // }
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
    width: 2rem;
    font-size: 1rem;
    border-bottom: 1px solid #32c8ff;
    text-align: center;

    padding: 0;
  }

  .settings-content {
    margin: 0;
    color: var(--theme-fg);
    display: block;
    width: 100%;
    & p {
      margin: 0.75rem;
      font-size: 1.5rem;
      text-align: center;
      color: darkorange;
    }
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

  <!-- <div class="configuration-toggle-wrapper">
     <div class="configuration-item">
      <ConfigureGameToggle on:toggleConfiguration={toggleConfiguration} /> 
    </div> 
  </div> -->
  <div class="configuration-toggle-wrapper">
    <h1
      class:toggled={rowsAndColumns}
      id="rowsAndColumns"
      class="configuration-item"
      on:click={setConfigurationMode}>
      Configure By Rows And Columns
    </h1>
    <h1
      class:toggled={movesAndRounds}
      id="movesAndRounds"
      class="configuration-item"
      on:click={setConfigurationMode}>
      Configure By Moves And Rounds
    </h1>
  </div>
  {#if toggleConfigurationFlag}
    {#if movesAndRounds}
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
          . Your game board will occupy
          <input
            id="sizeFactor"
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
          <i class="percent-symbol">%</i>
          of the viewport.
        </div>
        <div class="settings-content">
          <p>Select your prefered gameboard configuration below:</p>
          <div class="configuration-row">
            <div class="settings-wrapper viable-game" id="computed-widget">

              <span class="computed-rows-columns">
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

                <div class="viablegameboards-wrapper">
                  {#each viableGameBoards as factor}
                    <span
                      class:highlighted={configuredRows == factor.row}
                      class="factor-item"
                      on:click={e => setFactorValue(e)}>
                      <span class="factor-item-sub">{factor.row}</span>
                      <span class="factor-item-sub">{factor.column}</span>
                    </span>
                  {/each}
                </div>
              </span>
            </div>
          </div>

        </div>

      </div>
    {:else if rowsAndColumns}
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
          players. The gameboard shall be
          <input
            name="rows"
            id="rows"
            type="number"
            class="settings-input"
            placeholder={settings.rows}
            bind:value={settings.rows}
            on:input={triggerGameBoardUpdate}
            min="2"
            on:focus={e => calculateViableFactors(e.target)}
            on:keyup={e => calculateViableFactors(e.target)}
            on:click={highlight} />
          rows tall by
          <input
            name="columns"
            id="columns"
            type="number"
            class="settings-input"
            placeholder={settings.columns}
            bind:value={settings.columns}
            on:input={triggerGameBoardUpdate}
            min="2"
            on:focus={e => calculateViableFactors(e.target)}
            on:keyup={e => calculateViableFactors(e.target)}
            on:click={highlight} />
          columns wide. This yields {settings.rows * settings.columns} total
          squares, which breaks down to {((settings.rows * settings.columns) / settings.numberOfPlayers).toFixed(2)}
          moves per player. It will take
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
          . Your game board will occupy
          <input
            id="sizeFactor"
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
          <i class="percent-symbol">%</i>
          of the viewport.
        </div>
        <div class="settings-content">
          <p>Select a moves and rounds configuration below:</p>
          <div class="configuration-row">
            <div class="settings-wrapper viable-game" id="computed-widget">

              <span class="computed-moves-rounds">
                <div class="settings-text">
                  <label for="movesPerTurn" id="movesPerTurn">
                    <div class="label-content">movesPerTurn:</div>
                    <input
                      name="movesPerTurn"
                      type="number"
                      class="settings-input"
                      placeholder="?"
                      bind:value={configuredMovesPerTurn} />
                  </label>
                  <label for="roundsPerGame" id="roundsPerGame">
                    <div class="label-content">roundsPerGame:</div>
                    <input
                      name="roundsPerGame"
                      type="number"
                      class="settings-input"
                      placeholder="?"
                      bind:value={configuredRoundsPerGame} />
                  </label>
                </div>

                <div class="viablegameboards-wrapper">
                  {#each viableMovesAndRounds as factor}
                    <span
                      class:highlighted={configuredMovesPerTurn == factor.moves}
                      class="factor-item"
                      on:click={e => setFactorValue(e)}>
                      <span class="factor-item-sub">{factor.moves}</span>
                      <span class="factor-item-sub">{factor.rounds}</span>
                    </span>
                  {/each}
                </div>
              </span>
            </div>
          </div>

        </div>
      </div>
    {/if}
  {:else}{/if}
{:else}
  <div class="settings-menu-heading">
    <h2 class="loading">Loading Settings...</h2>
    <div class="lds-ripple">
      <div />
      <div />
    </div>
  </div>
{/if}
