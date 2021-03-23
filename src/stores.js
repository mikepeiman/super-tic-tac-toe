import { writable } from "svelte/store";

// if (typeof window !== "undefined") {
//   console.log("we are running on the client");
//   let cpls = JSON.parse(localStorage.getItem("currentPlayer"))
//   console.log(`Checking for running LS on client via stores.js, here's currentPlayer from ls: `, cpls)
// } else {
//   console.log("we are running on the server");
// }

let settings = writable({});
let cellSize = writable(0);
let gameboardWidth = writable(0);
let viewportSize = writable({});
let state = writable({
  lastTicked: "",
  currentPlayer: {},
  movesRemaining: 0,
  turn: 0,
  gameHistoryTurns: [],
  turnHistory: [],
  clickCount: 0,
  moveNumber: 0,
  reset: false
});
let directionArrays = writable(false);
let currentPlayer = writable(false);
let moveNumber = writable(false);
let movesRemaining = writable(false);
let gameInProgress = writable(false);
let playersScored = writable(false);
let preservePlayerDetails = writable(false);
let toggleConfiguration = writable(false);
let toggleAutoFillFinalTurn = writable(false);
let gameHistoryFlat = writable(false);
let finalTurnCompleted = writable(false);
// let players = writable(JSON.parse(localStorage.getItem('settings')) || false);
let players = writable(false);
let gameHistoryTurns = writable([]);
let turnHistory = writable([]);
let buttonStyles = writable({
  _color: "var(--input-blue)",
  _secondaryColor: "var(--input-blue)",
  _secondaryOpacity: "1"
});

// color="var(--theme-bg)"
// secondaryColor="hsla(calc(var(--player-color-hue) + 30), 100%, 70%, 1)"
// secondaryOpacity="1"

export const storePlayersScored = {
  subscribe: playersScored.subscribe,
  set: val => {
    playersScored.set(val);
    localStorage.setItem("playersScored", JSON.stringify(val));
  }
};

export const storeToggleAutoFillFinalTurn = {
  subscribe: toggleAutoFillFinalTurn.subscribe,
  set: val => {
    toggleAutoFillFinalTurn.set(val);
    localStorage.setItem("toggleAutoFillFinalTurn", JSON.stringify(val));
  }
};


export const storeToggleConfiguration = {
  subscribe: toggleConfiguration.subscribe,
  set: val => {
    toggleConfiguration.set(val);
    localStorage.setItem("toggleConfiguration", JSON.stringify(val));
  }
};``

export const storePlayers = {
  subscribe: players.subscribe,
  set: val => {
    players.set(val);
    localStorage.setItem("players", JSON.stringify(val));
  }
};

export const storeFinalTurnCompleted = {
  subscribe: finalTurnCompleted.subscribe,
  set: val => {
    finalTurnCompleted.set(val);
    console.info(`storeFinalTurnCompleted called ${val}`)
    localStorage.setItem("finalTurnCompleted", JSON.stringify(val));
  }
};

export const storeSettings = {
  subscribe: settings.subscribe,
  set: val => {
    settings.set(val);
    localStorage.setItem("settings", JSON.stringify(val));
  }
};

export const storeCellSize = {
  subscribe: cellSize.subscribe,
  set: val => {
    cellSize.set(val);
    localStorage.setItem("cellSize", JSON.stringify(val));
  }
};

export const storeGameboardWidth = {
  subscribe: gameboardWidth.subscribe,
  set: val => {
    gameboardWidth.set(val);
    localStorage.setItem("gameboardWidth", JSON.stringify(val));
  }
};

export const storeViewportSize = {
  subscribe: viewportSize.subscribe,
  set: val => {
    viewportSize.set(val);
    localStorage.setItem("viewportSize", JSON.stringify(val));
  }
};

export const storeState = {
  subscribe: state.subscribe,
  set: val => {
    state.set(val);
    localStorage.setItem("state", JSON.stringify(val));
  }
};

export const storeMoveNumber = {
  subscribe: moveNumber.subscribe,
  set: val => {
    moveNumber.set(val);
    localStorage.setItem("moveNumber", JSON.stringify(val));
  }
};

export const storeMovesRemaining = {
  subscribe: movesRemaining.subscribe,
  set: val => {
    movesRemaining.set(val);
    localStorage.setItem("movesRemaining", JSON.stringify(val));
  }
};

export const storeDirectionArrays = {
  subscribe: directionArrays.subscribe,
  set: val => {
    directionArrays.set(val);
    localStorage.setItem("directionArrays", JSON.stringify(directionArrays));
  }
};
export const storeCurrentPlayer = {
  subscribe: currentPlayer.subscribe,
  set: val => {
    currentPlayer.set(val);
    localStorage.setItem("currentPlayer", JSON.stringify(val));
  }
};
export const storeGameInProgress = {
  subscribe: gameInProgress.subscribe,
  set: val => {
    gameInProgress.set(val);
    localStorage.setItem("gameInProgress", val);
  }
};
export const storePreservePlayerDetails = {
  subscribe: preservePlayerDetails.subscribe,
  set: val => {
    preservePlayerDetails.set(val);
    if (typeof window !== "undefined") {
      if (!val) {
        localStorage.removeItem("preservePlayerDetails");
      } else {
        localStorage.setItem("preservePlayerDetails", JSON.stringify(val));
      }
    }
  }
};
export const storeGameHistoryTurns = {
  subscribe: gameHistoryTurns.subscribe,
  set: val => {
    console.log(`storeGameHistoryTurns.set val => `, val);
    gameHistoryTurns.set(val);
    localStorage.setItem("gameHistoryTurns", JSON.stringify(val));
  }
};

export const storeTurnHistory = {
  subscribe: turnHistory.subscribe,
  set: val => {
    console.log(`storeTurnHistory.set val => `, val);
    turnHistory.set(val);
    localStorage.setItem("turnHistory", JSON.stringify(val));
  }
};

export const storeGameHistoryFlat = {
  subscribe: gameHistoryFlat.subscribe,
  set: val => {
    gameHistoryFlat.set(val);
    localStorage.setItem("gameHistoryFlat", JSON.stringify(val));
  }
};

export const storeButtonStyles = {
  subscribe: buttonStyles.subscribe,
  set: val => {
    buttonStyles.set(val);
    localStorage.setItem("buttonStyles", JSON.stringify(val));
  }
};
