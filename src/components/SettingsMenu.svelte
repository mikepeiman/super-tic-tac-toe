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
  $: computedMoves =
    (settings.rows * settings.columns) / settings.numberOfPlayers;
  let computeThis = 0;
  let computedFactors = [];
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
    console.log(`highlight func`, e.target);
  }

  function setComputedWidget() {
    let widget = document.querySelector("#computed-widget");
  }

  function computeViableMoves(el) {
    console.log(`computeViableMoves(el) `, el);
    let thisAttr = el.getAttribute("name");
    console.log(`computeViableMoves(el) this attr ${thisAttr}`);
    let computedWidget = document.querySelector("#computed-widget");
    let menu = document.querySelector(".settings-menu");
    // el.parentElement.appendChild(computedWidget);
    let rows = settings.rows;
    let columns = settings.columns;
    let numPlayers = settings.numberOfPlayers;
    let movesPerPlayer = (rows * columns) / numPlayers;
    let movesPerTurn = settings.movesPerTurn;

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

    // below factors snippet from https://stackoverflow.com/a/43802308/7875457
    const factors = number =>
      Array.from(Array(number + 1), (_, i) => i).filter(i => number % i === 0);
    // end factors snippet
    console.log(`Factors of ${computeThis} `, factors(computeThis));
    console.log(
      `rows ${rows} columns ${columns} players ${numPlayers}, movesPerPlayer ${movesPerPlayer}`
    );
    computedFactors = factors((rows * columns) / numPlayers);

    // for each number up to movesPerPlayer, iterate and calculate for modulo integer
    // present options as:
    //      "For {x} rows X {x} columns, viable moves per turn are: "
    //      "For {x} columns and {x} moves per turn, viable rows are: "
    //      "For {x} rows and {x} moves per turns, viable columns are: "
    // do not present for players; that is a primary selection.
    // UI: highlight values that are not whole numbers in settings, automatically insert viable options as formatted above
    // Perhaps show this section via js only when that particular input is active - likely a good solutionbundleRenderer.renderToStream
    // ***note: work on loading indicator next, get some pretty style, feel better each time it reloads (x1000s)
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
        grid-template-areas:
          "settings-input settings-label"
          "computed computed";
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

  .viable-grid {
    background: green;
  }

  #computed-widget {
    grid-area: computed;
    margin-top: 1rem;
    padding: 0.5rem 1rem;
    color: var(--player-color-light);
    outline: 2px dashed var(--player-color-light);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    & span {
      &.computed-span {
        width: 100%;
        justify-content: space-between;
        display: flex;
        flex-direction: row;
        align-items: center;
      }
      &.computed-value {
        color: rgba(0, 155, 255, 1);
      }
      // border-bottom: 2px solid rgba(#{var(--player-color-light)}, 0.75);
    }
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
        min="1"
        max="8"
        on:focus={e => computeViableMoves(e.target)}
        on:change={e => computeViableMoves(e.target)}
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
        on:focus={e => computeViableMoves(e.target)}
        on:change={e => computeViableMoves(e.target)}
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
        on:focus={e => computeViableMoves(e.target)}
        on:change={e => computeViableMoves(e.target)}
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
        on:focus={e => computeViableMoves(e.target)}
        on:change={e => computeViableMoves(e.target)}
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
        on:focus={e => computeViableMoves(e.target)}
        on:change={e => computeViableMoves(e.target)}
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
        on:focus={e => computeViableMoves(e.target)}
        on:change={e => computeViableMoves(e.target)}
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
        on:focus={e => computeViableMoves(e.target)}
        on:change={e => computeViableMoves(e.target)}
        on:input={triggerGameBoardUpdate}
        on:click={highlight}
        style="width: 2.5ch;" />
      <!-- <i class="percent-symbol">%</i> -->
    </label>
  </div>
  <div class="settings-wrapper viable-game" id="computed-widget">
    <span class="computed-span">
      Total moves per player:
      <span class="computed-value">{computedMoves}</span>
    </span>
    <span class="computed-span">
      COMPUTED FACTORS
      <span class="computed-value">{computedFactors}</span>
    </span>
    <span class="computed-span">
      Possible moves per turn
      <span class="computed-value">
        {computedMoves / settings.movesPerTurn}
      </span>
    </span>
  </div>

  <!--  -->
{:else}
  <div class="settings-menu-heading">
    <h2 class="loading">Loading Settings...</h2>
    <div class="lds-ripple">
      <div />
      <div />
    </div>
  </div>
{/if}
