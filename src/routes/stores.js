import { writable } from "svelte/store";
export const xSettings = writable(0);
export const xState = writable(0);

xSettings.subscribe(value => {
  console.log(`TicTacToe => xSettings.subscribe value => `, value);
});
xState.subscribe(value => {
  console.log(`TicTacToe => xState.subscribe value => `, value);
});

xSettings.set({
  numberOfPlayers: 3,
  movesPerTurn: 3,
  cellsToScore: 3,
  bonusForCompleteRow: 5,
  rows: 5,
  columns: 15,
  size: 24,
  gutter: 0
});

xState.set({
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