import { writable } from "svelte/store";

if (typeof window !== "undefined") {
  console.log("we are running on the client");
} else {
  console.log("we are running on the server");
}

let settings = writable({
  numberOfPlayers: 3,
  movesPerTurn: 3,
  cellsToScore: 3,
  bonusForCompleteRow: 5,
  rows: 5,
  columns: 15,
  size: 24,
  gutter: 0
});
let state = writable({
  lastTicked: "",
  currentPlayer: {},
  movesRemaining: 0,
  turn: 0,
  gameHistory: [],
  turnHistory: [],
  clickCount: 0,
  moveNumber: 0,
  reset: false
});
let directionArrays = writable(false);
let currentPlayer = writable(false);
let gameInProgress = writable(0);
let preservePlayerDetails = writable(0);
let gameBoardMoveHistoryFlatArray = writable(false);
// let players = writable(JSON.parse(localStorage.getItem('settings')) || false);
let players = writable(0);
let gameHistory = writable([
  [
    { move: 1, id: "R0C0", clickCount: 1, player: { id: 0, name: "Player 1" } },
    { move: 2, id: "R1C1", clickCount: 2, player: { id: 0, name: "Player 1" } },
    { move: 3, id: "R2C2", clickCount: 3, player: { id: 0, name: "Player 1" } }
  ],
  [
    {
      move: 4,
      id: "R4C14",
      clickCount: 4,
      player: { id: 1, name: "Player 2" }
    },
    {
      move: 5,
      id: "R3C14",
      clickCount: 5,
      player: { id: 1, name: "Player 2" }
    },
    { move: 6, id: "R2C14", clickCount: 6, player: { id: 1, name: "Player 2" } }
  ],
  [
    {
      move: 7,
      id: "R0C13",
      clickCount: 7,
      player: { id: 2, name: "Player 3" }
    },
    {
      move: 8,
      id: "R1C12",
      clickCount: 8,
      player: { id: 2, name: "Player 3" }
    },
    { move: 9, id: "R2C11", clickCount: 9, player: { id: 2, name: "Player 3" } }
  ],
  [
    {
      move: 10,
      id: "R3C3",
      clickCount: 10,
      player: { id: 0, name: "Player 1" }
    },
    {
      move: 11,
      id: "R4C4",
      clickCount: 11,
      player: { id: 0, name: "Player 1" }
    },
    {
      move: 12,
      id: "R4C5",
      clickCount: 12,
      player: { id: 0, name: "Player 1" }
    }
  ],
  [
    {
      move: 13,
      id: "R1C14",
      clickCount: 13,
      player: { id: 1, name: "Player 2" }
    },
    {
      move: 14,
      id: "R0C14",
      clickCount: 14,
      player: { id: 1, name: "Player 2" }
    },
    {
      move: 15,
      id: "R1C13",
      clickCount: 15,
      player: { id: 1, name: "Player 2" }
    }
  ],
  [
    {
      move: 16,
      id: "R0C12",
      clickCount: 16,
      player: { id: 2, name: "Player 3" }
    },
    {
      move: 17,
      id: "R0C11",
      clickCount: 17,
      player: { id: 2, name: "Player 3" }
    },
    {
      move: 18,
      id: "R1C11",
      clickCount: 18,
      player: { id: 2, name: "Player 3" }
    }
  ]
]);

export const storePlayers = {
  subscribe: players.subscribe,
  set: updatedPlayers => {
    players.set(updatedPlayers);
  }
};
export const storeGameHistory = {
  subscribe: gameHistory.subscribe,
  set: val => {
    gameHistory.set(val);
    localStorage.setItem("gameHistory", JSON.stringify(gameHistory));
  }
};
export const storeSettings = {
  subscribe: settings.subscribe,
  set: val => {
    settings.set(val);
  }
};
export const storeState = {
  subscribe: state.subscribe,
  set: val => {
    state.set(val);
    localStorage.setItem("state", JSON.stringify(state));
  }
};
export const storeDirectionArrays = {
  subscribe: directionArrays.subscribe,
  set: val => {
    directionArrays.set(val);
  }
};
export const storeCurrentPlayer = {
  subscribe: currentPlayer.subscribe,
  set: player => {
    currentPlayer.set(player);
    localStorage.setItem("currentPlayer", JSON.stringify(currentPlayer));
  }
};
export const storeGameInProgress = {
  subscribe: gameInProgress.subscribe,
  set: val => {
    gameInProgress.set(val);
    localStorage.setItem("gameInProgress", true);
  }
};
export const storePreservePlayerDetails = {
  subscribe: preservePlayerDetails.subscribe,
  set: details => {
    preservePlayerDetails.set(details);
  }
};
export const storeGameBoardMoveHistoryFlatArray = {
  subscribe: gameBoardMoveHistoryFlatArray.subscribe,
  set: history => {
    gameBoardMoveHistoryFlatArray.set(history);
    localStorage.setItem(
      "gameBoardMoveHistoryFlatArray",
      JSON.stringify(gameBoardMoveHistoryFlatArray)
    );
  }
};
