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

// let gameHistoryTurns = writable([
//   [
//     { move: 1, id: "R0C0", clickCount: 1, player: { id: 0, name: "Player 1" } },
//     { move: 2, id: "R1C1", clickCount: 2, player: { id: 0, name: "Player 1" } },
//     { move: 3, id: "R2C2", clickCount: 3, player: { id: 0, name: "Player 1" } }
//   ],
//   [
//     {
//       move: 4,
//       id: "R4C14",
//       clickCount: 4,
//       player: { id: 1, name: "Player 2" }
//     },
//     {
//       move: 5,
//       id: "R3C14",
//       clickCount: 5,
//       player: { id: 1, name: "Player 2" }
//     },
//     { move: 6, id: "R2C14", clickCount: 6, player: { id: 1, name: "Player 2" } }
//   ],
//   [
//     {
//       move: 7,
//       id: "R0C13",
//       clickCount: 7,
//       player: { id: 2, name: "Player 3" }
//     },
//     {
//       move: 8,
//       id: "R1C12",
//       clickCount: 8,
//       player: { id: 2, name: "Player 3" }
//     },
//     { move: 9, id: "R2C11", clickCount: 9, player: { id: 2, name: "Player 3" } }
//   ],
//   [
//     {
//       move: 10,
//       id: "R3C3",
//       clickCount: 10,
//       player: { id: 0, name: "Player 1" }
//     },
//     {
//       move: 11,
//       id: "R4C4",
//       clickCount: 11,
//       player: { id: 0, name: "Player 1" }
//     },
//     {
//       move: 12,
//       id: "R4C5",
//       clickCount: 12,
//       player: { id: 0, name: "Player 1" }
//     }
//   ],
//   [
//     {
//       move: 13,
//       id: "R1C14",
//       clickCount: 13,
//       player: { id: 1, name: "Player 2" }
//     },
//     {
//       move: 14,
//       id: "R0C14",
//       clickCount: 14,
//       player: { id: 1, name: "Player 2" }
//     },
//     {
//       move: 15,
//       id: "R1C13",
//       clickCount: 15,
//       player: { id: 1, name: "Player 2" }
//     }
//   ],
//   [
//     {
//       move: 16,
//       id: "R0C12",
//       clickCount: 16,
//       player: { id: 2, name: "Player 3" }
//     },
//     {
//       move: 17,
//       id: "R0C11",
//       clickCount: 17,
//       player: { id: 2, name: "Player 3" }
//     },
//     {
//       move: 18,
//       id: "R1C11",
//       clickCount: 18,
//       player: { id: 2, name: "Player 3" }
//     }
//   ]
// ]);
