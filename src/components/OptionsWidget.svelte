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

  let gameboardWidth = "500px";
  let containerWidth = "1000px";
  $: {
    if (typeof window !== "undefined") {
      let gameboard = document.getElementById("gameboard");
      let container = document.querySelector(".gameboard-container");
      if (gameboard) {
        gameboardWidth = gameboard.offsetWidth;
        containerWidth = container.offsetWidth;
        console.log(`setGlobalCSSVars() gameboardwidth ${gameboardWidth}`);
        document.documentElement.style.setProperty(
          "--gameboard-width",
          `${gameboardWidth}px`
        );
        document.documentElement.style.setProperty(
          "--gameboard-container-width",
          `${containerWidth}px`
        );
      }
      // gameboardWidth;
    }
  }
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
  #buttons-wrapper {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    grid-area: controls;
    padding: 0;
    width: 6rem;
    justify-self: flex-end;
    justify-content: space-between;
    & button.control-button {
      margin: 0.5rem;
      width: 100%;
      min-height: 2rem;
      height: 100%;
      max-height: 3rem;
      display: block;
    }
    & .options-control-wrapper {
      margin: 0.5rem;
    }
  }

  .inputs-wrapper {
    display: flex;
  }

  @media screen and (min-width: 600px) {
  }
  @media screen and (min-width: 900px) {
  }

  @media screen and (min-width: 1100px) {
  }

  @media screen and (min-width: 1500px) {
  }
</style>

{#await currentPlayer then currentPlayer}
  {#if !currentPlayer.name}
    <h2 class="player-indicator-heading">Loading players data...</h2>
  {:else}
    <div class="buttons-wrapper" id="buttons-wrapper">
      <div
        class="modal-wrapper options-control-wrapper"
        id="theme-switch-wrapper">
        <NightModeToggle />
      </div>
      <div
        class="modal-wrapper options-control-wrapper"
        id="menu-modal-wrapper">
        <Modal>
          <MenuModal />
        </Modal>
      </div>
      <div
        class="modal-wrapper options-control-wrapper"
        id="settings-modal-wrapper">
        <Modal>
          <SettingsModal />
        </Modal>
      </div>
    </div>
  {/if}
{/await}
