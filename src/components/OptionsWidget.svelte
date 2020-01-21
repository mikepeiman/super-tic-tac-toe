<script>
  import MenuModal from "./GameMenuModal.svelte";
  import SettingsModal from "./SettingsModal.svelte";
  import NightModeToggle from "./NightModeToggle.svelte";
  import Modal from "svelte-simple-modal";
  import { getContext } from "svelte";
  import { onMount, afterUpdate, createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();
  import CountPoints from "./CountPoints.svelte";
  export let state, players;
  import {
    storeSettings,
    storeGameboardWidth,
    storeState,
    storePlayers,
    storeCurrentPlayer,
    storeDirectionArrays,
    storeGameInProgress,
    storeGameHistoryTurns,
    storePreservePlayerDetails,
    storeGameHistoryFlat
  } from "../stores.js";

  let gameboardWidth = "420px";
  $: currentPlayer = {};

  let colorMain, colorLight, colorDark, colorHue;

  $: {
    if (typeof window !== "undefined") {
      ({ colorMain, colorLight, colorDark, colorHue } = currentPlayer);
      let colorMainVar = "--player-color";
      let colorLightVar = "--player-color-light";
      let colorDarkVar = "--player-color-dark";
      let colorHueVar = "--player-color-hue";

      let styles = `--player-color: ${colorMain}; --player-color-light: ${colorLight}; --player-color-dark: ${colorDark}; --player-hue: ${colorHue};`;
      console.log(`Styles of player color from currentPlayer: `, styles);
      document.documentElement.style.setProperty(colorMainVar, colorMain);
      document.documentElement.style.setProperty(colorLightVar, colorLight);
      document.documentElement.style.setProperty(colorDarkVar, colorDark);
      document.documentElement.style.setProperty(colorHueVar, colorHue);
    }
  }
  $: state = {};
  $: players = {};
  $: settings = {};
  $: moveNumber = 0;
  $: movesRemaining = 0;
  // $: settings.movesPerTurn, (state.movesRemaining = settings.movesPerTurn);
  // $: settings.movesPerTurn, console.log('\n' + 'REACTIVE LOGGING settings.movesPerTurn' + '\n')

  onMount(() => {
    storeSettings.subscribe(value => {
      console.log(`StatusBar => storeSettings.subscribe value => `, value);
      settings = value;
      let lsMovesFromTurnHistory = JSON.parse(
        localStorage.getItem("turnHistory")
      );
      if (lsMovesFromTurnHistory) {
        lsMovesFromTurnHistory = JSON.parse(localStorage.getItem("turnHistory"))
          .length;
      }

      // console.log(`lsMoveFromTurnHistory: `, lsMovesFromTurnHistory);
      movesRemaining = settings.movesPerTurn - lsMovesFromTurnHistory;
      state.movesRemaining = movesRemaining;
    });
    storeCurrentPlayer.subscribe(value => {
      currentPlayer = value;
    });
    storeGameboardWidth.subscribe(val => {
      console.log(`from statusBar => gameboard el width: `, val);
      gameboardWidth = val;
    });

    let lsCurrentPlayer = JSON.parse(localStorage.getItem("currentPlayer"));
    currentPlayer = lsCurrentPlayer;

    storeState.subscribe(value => {
      state = value;
      movesRemaining = state.movesRemaining;
      moveNumber = JSON.parse(localStorage.getItem("moveNumber"));
      if (!moveNumber) {
        moveNumber = 0;
      }
    });
    players = $storePlayers;
    state = $storeState;
    settings = $storeSettings;
    if (localStorage.getItem("gameInProgress")) {
      moveNumber = JSON.parse(localStorage.getItem("moveNumber"));
    }
    if (!currentPlayer) {
      console.log(`StatusBar => if (!(currentPlayer)), set to players[0]`);
      currentPlayer = players[0];
      storeCurrentPlayer.set(currentPlayer);
    }

    setAllInputWidths();
  });

  function playersScored(e) {
    console.log(
      `StatusBar receiving dispatch of playersScored from CountPoints, `,
      e.detail
    );
    console.log(
      `StatusBar receiving dispatch of playersScored from CountPoints, state.currentPlayer `,
      state.currentPlayer
    );
    players = e.detail;
    localStorage.setItem("state", JSON.stringify(state));
    dispatch("playersScored", players);
  }

  function setSingleInputWidth(input) {
    // console.log(`setSingleInputWidth value ${input.value.toString()} `, input);
    input.style.width = `${input.value.toString().length + 0.5}ch`;
  }

  async function setAllInputWidths() {
    await currentPlayer;
    // console.log(`setAllInputWidths() called`);
    let inputs = await document.querySelectorAll("input");
    // console.log(`setAllInputWidths() called`, inputs);
    let len = inputs.length;
    for (let i = 0; i < len; i++) {
      setSingleInputWidth(inputs[i]);
    }
  }
</script>

<style lang="scss">
  $title-margin: 0.5rem;
  $title-padding-horizontal: 0.5rem;
  $title-padding-vertical: 0.25rem;
  $calc-padding: 2 * $title-padding-horizontal;
  .player-indicator {
    color: #eee;
    transition: all 0.5s;
    display: flex;
    height: auto;
    & h2 {
      font-size: 1.25rem;
    }
  }

  .player-status-bar {
    width: 100%;
    display: flex;
    justify-content: space-between;
    // background: rgba(155, 55, 255, 0.75);
  }

  .player-status-detail {
    display: flex;
    align-items: center;
    position: relative;

    & p {
      font-size: 1rem;
    }
    & label {
      font-size: 1rem;
      margin-left: 0.25rem;
      word-wrap: normal;
    }
    & input {
      background: rgba(255, 255, 255, 0.15);
      border: none;
      color: white;
      font-family: inherit;
      font-weight: 400;
      font-size: 1rem;
      padding: 0.125rem;
      border-radius: 0.125rem;
      border-bottom: none;
      margin: 0;
      justify-self: flex-start;
      &.value {
        font-size: 1rem;
        padding: 0.125rem;
        background: rgba(0, 0, 0, 0);
      }
    }
    & .dynamic-wrapper {
      position: relative;
      width: 21ch;
      color: var(--theme-fg); //hsla(130, 50%, 25%, 1);
    }
    & .dynamic-value {
      background: hsla(
        var(--player-color-hue),
        50%,
        50%,
        0.5
      ); // hsla(130, 50%, 25%, 1); //var(--player-color);
      border: none;
      margin: 0 0.5ch 0 0;
      color: white;
      font-family: inherit;
      font-weight: 400;
      font-size: 1rem;
      min-height: 2.25rem;
      min-width: 2.25rem;
      border-radius: 2px;
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
  #turn-moves .dynamic-value {
  }
  #total-moves .dynamic-value {
  }
  .statusbar {
    width: 100%;
    display: grid;
    /* justify-items: center; */
    grid-template-areas: "playername moves controls";
    grid-template-columns: 1fr auto 1fr;
  }

  #player-name {
    grid-area: playername;
    justify-self: flex-start;

    & h2 {
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 0;
      background: var(--player-color);
      color: white;
      padding: 0 0.75rem;
      min-height: 2.5rem;
      border-radius: 2px;
    }
    &:before {
      margin: 0;
      border: 0;
      display: none;
    }
  }
  #moves-wrapper {
    grid-area: moves;
    justify-self: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    // min-width: var(--moves-wrapper-width);
  }
  #buttons-wrapper {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    grid-area: controls;
    padding: 8px;
    justify-self: flex-end;
    justify-content: space-between;
    &:nth-child(1) {
      top: 3px;
    }
    &:nth-child(2) {
      top: -3px;
    }
  }

  .player-indicator-heading {
    padding: 1rem;
  }

  #menu-modal-wrapper {
    top: -3px;
    position: relative;
  }

  #turn-moves {
    top: 3px;
  }
  #total-moves {
    top: -3px;
  }
  .player-name {
    color: var(--player-color);
    & h2 {
      margin: 0 0 4px 0;
    }
  }
  .inputs-wrapper {
    display: flex;
  }

  @media screen and (min-width: 600px) {
    body {
      font-size: 80%;
    }
  }
  @media screen and (min-width: 900px) {
    body {
      font-size: 90%;
    }
    #buttons-wrapper {
      flex-direction: row;
      align-items: center;
    }
    // #tally-points-wrapper {
    //   top: 0;
    //   position: relative;
    // }
    #menu-modal-wrapper {
      top: 0;
      position: relative;
    }
    .player-indicator {
      border-top: none;
      color: #eee;
      transition: all 0.5s;
      display: flex;
      min-height: 100%;
      & h2 {
        font-size: 1.25rem;
      }
      & #player-name h2 {
        min-height: 3rem;
      }
      & #player-name::before {
        content: "";
        margin-right: 0.5rem;
        margin-left: -1rem;
        width: 0;
        height: 0;
        border-style: solid;
        border-width: 50px 0 50px 50px;
        border-color: transparent transparent transparent var(--player-color);
      }
    }
    #moves-wrapper {
      flex-direction: row;
      justify-content: space-between;
    }
    #turn-moves {
      top: 0;
    }
    #total-moves {
      top: 0;
    }
    .player-status-detail {
      & .dynamic-value {
        // min-height: 3rem;
        // min-width: 3rem;
        // margin-top: 0;
        // left: -3.3rem;
      }
      & .dynamic-wrapper {
        position: relative;
        width: 22ch;
      }
    }
  }

  @media screen and (min-width: 1100px) {
    body {
      font-size: 100%;
    }
    .player-indicator {
      // border-bottom: 6px solid var(--player-color-dark);
    }
  }

  @media screen and (min-width: 1500px) {
    body {
      font-size: 110%;
    }
  }
  span {
    margin-left: 10px;
    font-size: 1rem;
  }
</style>

{#await currentPlayer then currentPlayer}
  {#if !currentPlayer.name}
    <h2 class="player-indicator-heading">Loading players data...</h2>
  {:else}
    <div class="buttons-wrapper" id="buttons-wrapper">
      <div id="theme-switch-wrapper">
        <NightModeToggle />
      </div>
      <!-- <div id="tally-points-wrapper">
            <CountPoints {players} on:playersScored={playersScored} />
          </div> -->
      <div class="modal-wrapper" id="menu-modal-wrapper">
        <Modal>
          <MenuModal />
        </Modal>
      </div>
      <div class="modal-wrapper" id="settings-modal-wrapper">
        <Modal>
          <SettingsModal />
        </Modal>
      </div>
    </div>
  {/if}
{/await}
