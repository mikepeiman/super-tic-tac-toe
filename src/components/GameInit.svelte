<script>
  import { onMount, afterUpdate, createEventDispatcher } from "svelte";
  import MainMenu from "./MainMenu.svelte";
  const dispatch = createEventDispatcher();
  import { writable } from "svelte/store";
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

  $: currentPlayer = {};
  $: state = {};
  $: players = {};
  let settings = {};
  $: scoreDirections = [
    {
      id: 1,
      name: "leftToRight",
      lines: lines.leftToRight,
      scoringLines: [],
      dirScore: 0,
      iconSrc: "tictactoe-horizontal.png"
    },
    {
      id: 2,
      name: "topToBottom",
      lines: lines.topToBottom,
      scoringLines: [],
      dirScore: 0,
      iconSrc: "tictactoe-vertical.png"
    },
    {
      id: 3,
      name: "diagonalDownLeft",
      lines: lines.diagonalDownLeft,
      scoringLines: [],
      dirScore: 0,
      iconSrc: "tictactoe-diagonal-down-left.png"
    },
    {
      id: 4,
      name: "diagonalDownRight",
      lines: lines.diagonalDownRight,
      scoringLines: [],
      dirScore: 0,
      iconSrc: "tictactoe-diagonal-down-right.png"
    }
  ];
  $: lines = {
    leftToRight: [],
    topToBottom: [],
    diagonalDownLeft: [],
    diagonalDownRight: []
  };

  let numberOfPlayers;
  ({ numberOfPlayers } = settings);
  $: {
    if (typeof window !== "undefined") {
      let playerDetails = localStorage.getItem("preservePlayerDetails");
      // if (!playerDetails) {
        numberOfPlayers && initializePlayers();
      // }
    }

    // storePreservePlayerDetails.set(false);
  }

  onMount(() => {
    console.log(`GameInit => onMount()`);
    storeSettings.subscribe(value => {
      settings = value;
      ({ numberOfPlayers } = settings);
      // ***
      // DO NOT DO THE FOLLOWING - INFITINE LOOP!
      // storeSettings.set(value)
      // ***
      console.log(
        `GameInit => subscribed to settings, numberOfPlayers = ${numberOfPlayers}`
      );

    });
    // settings = $storeSettings;
    state = $storeState;
    console.log(`GameInit => onMount() settings = `, settings);
    let gameInProgress = localStorage.getItem("gameInProgress");
    let playerDetails = localStorage.getItem("preservePlayerDetails");
    console.log(`GameInit => onMount() playerDetails = `, playerDetails);
    if (gameInProgress) {
      let turnHistory = JSON.parse(localStorage.getItem("turnHistory"));

      state = JSON.parse(localStorage.getItem("state"));
      state.movesRemaining = settings.movesPerTurn - turnHistory.length;
      console.log(`GameInit => onMount(), gameInProgress true`);
    } else {
      state.movesRemaining = settings.movesPerTurn;
      console.log(`GameInit => onMount(), state `, state);
    }
    storeState.set(state);
    localStorage.setItem("state", JSON.stringify(state));
    if (playerDetails) {
      players = JSON.parse(localStorage.getItem("players"));
      console.log(
        `GameInit => onMount() playerDetails, players `,
        playerDetails,
        players
      );
      storePlayers.set(players);
      if (!gameInProgress) {
        console.log(
          `GameInit,       if (!gameInProgress) { state.currentPlayer = players[0];`
        );
        initializeCurrentPlayer();
      }
    } else {
      initializePlayers();
    }
  });

  afterUpdate(() => {});

  function initializePlayers() {
    let hueOffset = 140;
    // let hueInterval = (360 / settings.numberOfPlayers)
    let hueInterval = 180 / settings.numberOfPlayers;

    players = [];
    for (let i = 0; i < settings.numberOfPlayers; i++) {
      players = [
        ...players,
        {
          id: i,
          name: `Player ${i + 1}`,
          totalScore: 0,
          marker: "x",
          bgColor: `hsla(${(i + 1) * hueInterval + hueOffset}, 50%, 50%, 1)`,
          moves: 0,
          scores: [],
          dirScoresByIndex: [0, 0, 0, 0]
        }
      ];
      let bg = `hsla(${(i + 1) * hueInterval + hueOffset}, 50%, 50%, 1)`;
      // console.log(
      //   `GameInit => initializePlayers(), settings.numberOfPlayers = ${settings.numberOfPlayers}, bgColor = ${bg}`
      // );
      scoreDirections.forEach((direction, index) => {
        // console.log(`GameBoard => initializePlayers => scoreDirections.forEach direction: ${direction.name}, lines `, lines)
        players[i]["scores"].push(direction);
        players[i]["scores"][index]["lines"] = lines[direction.name];
        // console.log(
        //   `GameInit => initializePlayers => scoreDirections.forEach player[${i}]["scores"][${index}] `,
        //   players[i]["scores"][index]
        // );
      });
    }
    // players = players
    storePlayers.set(players);
    let gameInProgress = localStorage.getItem("gameInProgress");
    if (!gameInProgress) {
      initializeCurrentPlayer();
    }
    dispatch("playersInitialized", players);
    console.log(`GameInit => initialized players done`, players);
  }

  function initializeCurrentPlayer() {
    state.currentPlayer = players[0];
    storeCurrentPlayer.set(players[0]);
    console.log(`GameInit => initializePlayers run (currentPlayer reset to 0)`);
  }

  function setCurrentPlayer() {
    console.log(`GameInit => setCurrentPlayer subscribed`, value);
    let ls = JSON.parse(localStorage.getItem("currentPlayer"));
    console.log(`GameInit => setCurrentPlayer LS`, ls);
    if (value !== false) {
      console.log(`GameInit => setCurrentPlayer subscribed, value !== false`);
      localStorage.setItem("currentPlayer", JSON.stringify(value));
    } else {
      console.log(`GameInit => setCurrentPlayer subscribed, value === false`);
      storeCurrentPlayer.set(ls);
    }
  }

  function updateGameSettings(e) {
    console.log(`GameInit => reset bubbled from MainMenu settings change`, e);
    settings = e.detail;
    // storeSettings.set(e.detail);
  }
</script>

<style lang="scss">
  $title-margin: 1rem;
  $title-padding-horizontal: 1rem;
  $title-padding-vertical: 0.5rem;
  $calc-padding: 2 * $title-padding-horizontal;

  .player-indicator {
    width: calc(100% - (2 * #{$title-padding-horizontal}));
    background: var(--player-color);
    transition: all 0.5s;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
    padding: $title-padding-vertical $title-padding-horizontal;
    border-radius: 5px;
    border-bottom: 5px solid rgba(0, 255, 155, 0.85);

    & h2 {
      margin: 0;
    }
  }

  .player-status-bar {
    width: 100%;
    display: flex;
    justify-content: space-between;
    background: rgba(155, 55, 255, 0.75);
  }
</style>

<MainMenu on:updateGameSettings={updateGameSettings} />
