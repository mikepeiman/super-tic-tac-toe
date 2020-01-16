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
let gameInProgress = writable(false);
let preservePlayerDetails = writable(false);
let gameHistoryFlat = writable(false);
// let players = writable(JSON.parse(localStorage.getItem('settings')) || false);
let players = writable(false);
let gameHistoryTurns = writable([]);

export const storePlayers = {
  subscribe: players.subscribe,
  set: val => {
    players.set(val);
    localStorage.setItem("players", JSON.stringify(val));
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
export const storeGameHistoryFlat = {
  subscribe: gameHistoryFlat.subscribe,
  set: val => {
    gameHistoryFlat.set(val);
    localStorage.setItem("gameHistoryFlat", JSON.stringify(val));
  }
};