<script>
  import { onMount, afterUpdate, createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();
  import { writable } from "svelte/store";
  import {
    storeSettings,
    storeState,
    storePlayers,
    storeCurrentPlayer,
    storeDirectionArrays,
    storeGameInProgress,
    storeGameHistory,
    storePreservePlayerDetails
  } from "../stores.js";

  $: currentPlayer = {};
  $: state = {};
  $: players = {};
  $: settings = {};
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

  onMount(() => {
    console.log(`onMount() => GameInit`);
    players = $storePlayers;
    settings = $storeSettings;
    console.log(`onMount() settings = `, settings);
    let gameInProgress = $storeGameInProgress;
    let playerDetails = localStorage.getItem("storePreservePlayerDetails");
    console.log(`onMount() playerDetails = `, playerDetails);
    if (gameInProgress) {
      console.log(
        `//////////////     GameInit => onMount(), gameInProgress true`
      );
    } else {
      state.movesRemaining = settings.movesPerTurn
      storeState.set(state)
    }

    if (playerDetails) {
      playerDetails = JSON.parse(playerDetails);
      players = JSON.parse(localStorage.getItem("players"));
      console.log(`onMount() playerDetails = `, playerDetails);
      console.log(players);
      storePlayers.set(players);
      state.currentPlayer = players[0];
    } else {
      initializePlayers();
    }
    // players = $storePlayers;
    // state = $storeState;
    // currentPlayer = $storeCurrentPlayer;
    // console.log(`//////////////     StatusBar => onMount() `, state, players);

    // if (!(currentPlayer.length > 0)) {
    //   currentPlayer = players[0];
    // }
    // storeCurrentPlayer.set(currentPlayer)
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

      scoreDirections.forEach((direction, index) => {
        // console.log(`GameBoard => initializePlayers => scoreDirections.forEach direction: ${direction.name}, lines `, lines)
        players[i]["scores"].push(direction);
        players[i]["scores"][index]["lines"] = lines[direction.name];
        console.log(
          `GameInit => initializePlayers => scoreDirections.forEach player[${i}]["scores"][${index}] `,
          players[i]["scores"][index]
        );
      });
    }
    // players = players;
    localStorage.setItem("players", JSON.stringify(players));
    storePlayers.set(players);
    state.currentPlayer = players[0];
    storeCurrentPlayer.set(players[0]);
    dispatch("playersInitialized", players);
    console.log(`GameInit => initialized players done`);
  }
</script>

<style lang="scss">
  $title-margin: 1rem;
  $title-padding-horizontal: 1rem;
  $title-padding-vertical: 0.5rem;
  $calc-padding: 2 * $title-padding-horizontal;

  .player-indicator {
    width: calc(100% - (2 * #{$title-padding-horizontal}));
    background: var(--custom-bg);
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
