<script>
  import { onMount, afterUpdate, createEventDispatcher } from "svelte";
  import SettingsInit from "./SettingsInit.svelte";
  import emojis from "emojis-list";
  const dispatch = createEventDispatcher();
  import { writable } from "svelte/store";
  import {
    storeSettings,
    storeState,
    storePlayers,
    storeCurrentPlayer,
    storeDirectionArrays,
    storeGameInProgress,
    storeGameboardWidth,
    storeGameHistoryTurns,
    storePreservePlayerDetails,
    storeGameHistoryFlat,
    storeFinalTurnCompleted
  } from "../stores.js";

  $: currentPlayer = {};
  $: state = {};
  $: players = {};
  let settings = {};
  let gameboardWidth;
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
  // unicode emojis selected from https://unicode.org/Public/emoji/13.0/emoji-test.txt
  let emojiShortlist = [
    "\u{1F525}",
    "\u{1F984}",
    "\u{2694}\u{FE0F}",
    "\u{1F405}",
    "\u{1F308}",
    "\u{2744}\u{FE0F}",
    "\u{1F3D4}\u{FE0F}",
    "\u{1F381}"
  ];
  let numberOfPlayers;
  ({ numberOfPlayers } = settings);
  $: {
    if (typeof window !== "undefined") {
      // console.log(
      //   `GameInit => reactive log for numberOfPlayers - we have window`
      // );
      let playerDetails = localStorage.getItem("preservePlayerDetails");
      if (!playerDetails) {
        // console.log(
        //   `GameInit => reactive log for numberOfPlayers: ${numberOfPlayers} - we have !playerDetails`
        // );
        numberOfPlayers && initializePlayers();
      } else {
        console.log(
          `We have player details in existence. Now time to modify players array rather than initialize it. How to determine which way to modify, and what argument to pass the function?`
        );
        let LSplayers = localStorage.getItem("players");
        if (LSplayers) {
          LSplayers = JSON.parse(LSplayers);
        }
        let len = LSplayers.length;
        // console.log(` LS players length: ${len}`);
        let len2 = players.length;
        // console.log(` var players length: ${len2}`);
        let num2 = settings.numberOfPlayers;
        // console.log(` settings.numberOfPlayers: ${settings.numberOfPlayers}`);
        if (num2 > len) {
          modifyPlayers("add");
        } else if (num2 < len) {
          modifyPlayers("remove");
        } else {
          // console.log(`I see no change in players needed`);
        }

        // numberOfPlayers && modifyPlayers();
      }
    }
  }

  onMount(() => {
    // console.log(`GameInit => onMount()`);
    storeSettings.subscribe(value => {
      settings = value;
      ({ numberOfPlayers } = settings);
    });
    storeGameboardWidth.subscribe(val => {
      gameboardWidth = val;
    });
    if(localStorage.getItem("finalTurnCompleted")) {
      console.info(`from GameInit, about to flag storeFinalTurnCompleted`)
      storeFinalTurnCompleted.set(true)
    }
    state = $storeState;
    // console.log(`GameInit => onMount() settings = `, settings);
    let gameInProgress = localStorage.getItem("gameInProgress");
    let playerDetails = localStorage.getItem("preservePlayerDetails");
    // console.log(`GameInit => onMount() playerDetails = `, playerDetails);
    if (gameInProgress) {
      let turnHistory = JSON.parse(localStorage.getItem("turnHistory"));

      state = JSON.parse(localStorage.getItem("state"));
      state.movesRemaining = settings.movesPerTurn - turnHistory.length;
      // console.log(`GameInit => onMount(), gameInProgress true`);
    } else {
      state.movesRemaining = settings.movesPerTurn;
      // console.log(`GameInit => onMount(), state `, state);
    }
    storeState.set(state);
    localStorage.setItem("state", JSON.stringify(state));
    if (playerDetails) {
      players = JSON.parse(localStorage.getItem("players"));
      // console.log(
      //   `GameInit => onMount() playerDetails, players `,
      //   playerDetails,
      //   players
      // );
      storePlayers.set(players);
      if (!gameInProgress) {
        // console.log(
        //   `GameInit,       if (!gameInProgress) { state.currentPlayer = players[0];`
        // );
        setCurrentPlayerZero();
        storePlayers.set(players);
      }
    } else {
      initializePlayers();
    }
  });

  function initializePlayers() {
    // console.log(`initializePlayers()`);
    let hueOffset = 180;
    let hueInterval = 360 / settings.numberOfPlayers;
    players = [];
    for (let i = 0; i < settings.numberOfPlayers; i++) {
      players = [
        ...players,
        {
          id: i,
          name: `Player ${i + 1}`,
          totalScore: 0,
          mark: emojiShortlist[i],
          colorMain: `hsla(${(i + 1) * hueInterval + hueOffset}, 50%, 50%, 1)`,
          colorLight: `hsla(${(i + 1) * hueInterval + hueOffset}, 75%, 65%, 1)`,
          colorDark: `hsla(${(i + 1) * hueInterval + hueOffset}, 75%, 35%, 1)`,
          colorHue: `${(i + 1) * hueInterval + hueOffset}`,
          moves: 0,
          scores: [],
          dirScoresByIndex: [0, 0, 0, 0],
          dirPointsByIndex: [0, 0, 0, 0],
          dirBonusesByIndex: [0, 0, 0, 0]
        }
      ];
      let bg = `hsla(${(i + 1) * hueInterval + hueOffset}, 50%, 50%, 1)`;
      scoreDirections.forEach((direction, index) => {
        players[i]["scores"].push(direction);
        players[i]["scores"][index]["lines"] = lines[direction.name];
      });
    }
    players = players;
    let gameInProgress = localStorage.getItem("gameInProgress");
    if (!gameInProgress) {
      setCurrentPlayerZero();
    }
    dispatch("playersInitialized", players);
    // console.log(`GameInit => initialized players done`, players);
    storePlayers.set(players);
  }

  function modifyPlayers(increment) {
    // console.log(`|||   MODIFY PLAYERS  ${increment}  |||`);
    if (increment === "remove") {
      players.pop();
      players = players;
    } else {
      let lastIndex = players.length;
      console.log(`modify players ADD, currently num players ${lastIndex}`);
      let lastPlayer = players[players.length - 1];
      let hueStart = lastPlayer.colorHue;
      let hues = players.map(player => parseInt(player.colorHue));
      let maxDiff = maxDifference(hues);
      console.dir(addNewPlayer(lastIndex, hueStart));
      console.log(
        `modify players ADD, currently num players ${lastIndex} hueStart: ${hueStart} maxDiff: ${maxDiff}`,
        hues
      );
      players = [...players, addNewPlayer(lastIndex, 0)];
    }
    for (let i = 0; i < settings.numberOfPlayers; i++) {
      players[i]["scores"] = [];
      scoreDirections.forEach((direction, index) => {
        players[i]["scores"].push(direction);
        players[i]["scores"][index]["lines"] = lines[direction.name];
      });
    }
    resetPlayerColors(360);
    players = players;
    let gameInProgress = localStorage.getItem("gameInProgress");
    if (!gameInProgress) {
      setCurrentPlayerZero();
    }
    dispatch("playersInitialized", players);
    console.log(`GameInit => initialized players done`, players);
    storePlayers.set(players);
  }

  function maxDifference(arr) {
    let maxDiff = arr[1] - arr[0];
    let minEle = arr[0];

    for (let i = 1; i < arr.length; i++) {
      if (arr[i] - minEle > maxDiff) {
        maxDiff = arr[i] - minEle;
      }
      if (arr[i] < minEle) {
        minEle = arr[i];
      }
    }
  }

  function resetPlayerColors(spread) {
    console.log(`resetPlayerColors()`);

    // for (let i = 0; i < settings.numberOfPlayers; i++) {
    //   players = [...players, {}];
    // }
    players.forEach((player, i) => {
      let hueOffset = 0;
      let hueInterval = parseInt(spread / settings.numberOfPlayers);
      let newHue = i * hueInterval + hueOffset;
      while (newHue > 360) {
        newHue = newHue - 360;
      }
      // console.log(`player hue ${player.colorHue}, newHue ${newHue}`);
      player["colorHue"] = newHue;
      player["colorLight"] = `hsla(${newHue}, 75%, 65%, 1)`;
      player["colorMain"] = `hsla(${newHue}, 50%, 50%, 1)`;
      player["colorDark"] = `hsla(${newHue}, 75%, 35%, 1)`;
      // console.log(`player hue ${player.colorHue}, player `, player);
    });
    players = players;
    // console.log(players);
  }

  function addNewPlayer(lastIndex, hueStart) {
    // console.log(`addNewPlayer(${lastIndex}, ${hueStart})`);
    let newIndex = lastIndex + 1;
    let hueOffset = parseInt(hueStart);
    let hueInterval = parseInt(360 / newIndex);
    // console.log(`hueInterval ${hueInterval}`);
    let newHue = newIndex * hueInterval + hueOffset;
    // console.log(
    //   `newHue before scoping to 360 degrees: ${newHue} ${typeof newHue}`
    // );
    while (newHue > 360) {
      newHue = newHue - 360;
    }
    // console.log(
    //   `newHue after scoping to 360 degrees: ${newHue} ${typeof newHue}`
    // );

    return {
      id: lastIndex,
      name: `Player ${newIndex}`,
      totalScore: 0,
      mark: emojiShortlist[lastIndex],
      colorMain: `hsla(${newHue}, 50%, 50%, 1)`,
      colorLight: `hsla(${newHue}, 75%, 65%, 1)`,
      colorDark: `hsla(${newHue}, 75%, 35%, 1)`,
      colorHue: `${newHue}`,
      moves: 0,
      scores: [],
      dirScoresByIndex: [0, 0, 0, 0],
      dirPointsByIndex: [0, 0, 0, 0],
      dirBonusesByIndex: [0, 0, 0, 0]
    };
  }

  function setCurrentPlayerZero() {
    state.currentPlayer = players[0];
    storeCurrentPlayer.set(players[0]);
    // console.log(`GameInit => initializePlayers run (currentPlayer reset to 0)`);
  }

  function updateGameSettings(e) {
    // console.log(`GameInit => reset bubbled from SettingsMenu settings change`, e);
    settings = e.detail;
    // storeSettings.set(e.detail);
  }
</script>

<style lang="scss">

</style>

<SettingsInit on:updateGameSettings={updateGameSettings} />
