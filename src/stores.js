import { writable } from "svelte/store";

export const storeSettings = writable({
  numberOfPlayers: 3,
  movesPerTurn: 3,
  cellsToScore: 3,
  bonusForCompleteRow: 5,
  rows: 5,
  columns: 15,
  size: 24,
  gutter: 0
});
export const storeState = writable({
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
export const storeDirectionArrays = writable([]);
export const storeCurrentPlayer = writable({});
export const storeGameInProgress = writable(false);
export const storePreservePlayerDetails = writable(false);
export const storeMovesPlayedHistory = writable([]);
export const storePlayers = writable([]);

// storeSettings, storeState, storePlayers, storeCurrentPlayer, storeDirectionArrays, storeGameInProgress, storeMovesPlayedHistory, storePreservePlayerDetails

// export let storeSettings = {
//   subscribe: settings.subscribe,
//   updateSettings: (newSettings) => {
//     settings.set(newSettings)
//   }
// }

// export let storeState = {
//   subscribe: state.subscribe,
//   set: newState => {
//     state.set(newState)
//     localStorage.setItem('storeState', JSON.stringify(newState))
//     // localStorage.setItem('storeState', JSON.stringify(newState))
//   }
// }

// export let storePlayers = {
//   subscribe: players.subscribe,
// }

// export let storeDirectionArrays = {
//   subscribe: directionArrays.subscribe,
// }

// export let storeGameInProgress = {
//   subscribe: gameInProgress.subscribe,
// }

// export let storeCurrentPlayer = {
//   subscribe: currentPlayer.subscribe,
// }

// export let storePreservePlayerDetails = {
//   subscribe: preservePlayerDetails.subscribe,
// }

// export let storeMovesPlayedHistory = {
//   subscribe: movesPlayedHistory.subscribe,
// }
