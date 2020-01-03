import { writable } from "svelte/store";

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
let directionArrays = writable([]);
let currentPlayer = writable({});
let gameInProgress = writable(false);
let preservePlayerDetails = writable(false);
// let movesPlayedHistory = writable([]);
// let players = writable([]);

let players = writable([
  {
    id: 0,
    name: "Player 1",
    totalScore: 5,
    marker: "x",
    bgColor: "hsla(200, 50%, 50%, 1)",
    moves: 0,
    scores: [
      {
        id: 1,
        name: "leftToRight",
        lines: [
          [
            {
              id: "R0C0",
              row: 0,
              column: 0,
              player: { id: 0, name: "Player 1" }
            },
            {
              id: "R0C1",
              row: 0,
              column: 1,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R0C2",
              row: 0,
              column: 2,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R0C3",
              row: 0,
              column: 3,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R0C4",
              row: 0,
              column: 4,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R0C5",
              row: 0,
              column: 5,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R0C6",
              row: 0,
              column: 6,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R0C7",
              row: 0,
              column: 7,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R0C8",
              row: 0,
              column: 8,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R0C9",
              row: 0,
              column: 9,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R0C10",
              row: 0,
              column: 10,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R0C11",
              row: 0,
              column: 11,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R0C12",
              row: 0,
              column: 12,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R0C13",
              row: 0,
              column: 13,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R0C14",
              row: 0,
              column: 14,
              player: { id: "zzz", name: "zzz" }
            }
          ],
          [
            {
              id: "R1C0",
              row: 1,
              column: 0,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R1C1",
              row: 1,
              column: 1,
              player: { id: 0, name: "Player 1" }
            },
            {
              id: "R1C2",
              row: 1,
              column: 2,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R1C3",
              row: 1,
              column: 3,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R1C4",
              row: 1,
              column: 4,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R1C5",
              row: 1,
              column: 5,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R1C6",
              row: 1,
              column: 6,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R1C7",
              row: 1,
              column: 7,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R1C8",
              row: 1,
              column: 8,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R1C9",
              row: 1,
              column: 9,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R1C10",
              row: 1,
              column: 10,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R1C11",
              row: 1,
              column: 11,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R1C12",
              row: 1,
              column: 12,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R1C13",
              row: 1,
              column: 13,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R1C14",
              row: 1,
              column: 14,
              player: { id: "zzz", name: "zzz" }
            }
          ],
          [
            {
              id: "R2C0",
              row: 2,
              column: 0,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R2C1",
              row: 2,
              column: 1,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R2C2",
              row: 2,
              column: 2,
              player: { id: 0, name: "Player 1" }
            },
            {
              id: "R2C3",
              row: 2,
              column: 3,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R2C4",
              row: 2,
              column: 4,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R2C5",
              row: 2,
              column: 5,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R2C6",
              row: 2,
              column: 6,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R2C7",
              row: 2,
              column: 7,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R2C8",
              row: 2,
              column: 8,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R2C9",
              row: 2,
              column: 9,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R2C10",
              row: 2,
              column: 10,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R2C11",
              row: 2,
              column: 11,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R2C12",
              row: 2,
              column: 12,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R2C13",
              row: 2,
              column: 13,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R2C14",
              row: 2,
              column: 14,
              player: { id: "zzz", name: "zzz" }
            }
          ],
          [
            {
              id: "R3C0",
              row: 3,
              column: 0,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R3C1",
              row: 3,
              column: 1,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R3C2",
              row: 3,
              column: 2,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R3C3",
              row: 3,
              column: 3,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R3C4",
              row: 3,
              column: 4,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R3C5",
              row: 3,
              column: 5,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R3C6",
              row: 3,
              column: 6,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R3C7",
              row: 3,
              column: 7,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R3C8",
              row: 3,
              column: 8,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R3C9",
              row: 3,
              column: 9,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R3C10",
              row: 3,
              column: 10,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R3C11",
              row: 3,
              column: 11,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R3C12",
              row: 3,
              column: 12,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R3C13",
              row: 3,
              column: 13,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R3C14",
              row: 3,
              column: 14,
              player: { id: "zzz", name: "zzz" }
            }
          ],
          [
            {
              id: "R4C0",
              row: 4,
              column: 0,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R4C1",
              row: 4,
              column: 1,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R4C2",
              row: 4,
              column: 2,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R4C3",
              row: 4,
              column: 3,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R4C4",
              row: 4,
              column: 4,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R4C5",
              row: 4,
              column: 5,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R4C6",
              row: 4,
              column: 6,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R4C7",
              row: 4,
              column: 7,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R4C8",
              row: 4,
              column: 8,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R4C9",
              row: 4,
              column: 9,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R4C10",
              row: 4,
              column: 10,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R4C11",
              row: 4,
              column: 11,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R4C12",
              row: 4,
              column: 12,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R4C13",
              row: 4,
              column: 13,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R4C14",
              row: 4,
              column: 14,
              player: { id: "zzz", name: "zzz" }
            }
          ]
        ],
        scoringLines: [],
        dirScore: 0,
        iconSrc: "tictactoe-horizontal.png"
      },
      {
        id: 2,
        name: "topToBottom",
        lines: [
          [
            {
              id: "R0C0",
              row: 0,
              column: 0,
              player: { id: 0, name: "Player 1" }
            },
            {
              id: "R1C0",
              row: 1,
              column: 0,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R2C0",
              row: 2,
              column: 0,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R3C0",
              row: 3,
              column: 0,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R4C0",
              row: 4,
              column: 0,
              player: { id: "zzz", name: "zzz" }
            }
          ],
          [
            {
              id: "R0C1",
              row: 0,
              column: 1,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R1C1",
              row: 1,
              column: 1,
              player: { id: 0, name: "Player 1" }
            },
            {
              id: "R2C1",
              row: 2,
              column: 1,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R3C1",
              row: 3,
              column: 1,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R4C1",
              row: 4,
              column: 1,
              player: { id: "zzz", name: "zzz" }
            }
          ],
          [
            {
              id: "R0C2",
              row: 0,
              column: 2,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R1C2",
              row: 1,
              column: 2,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R2C2",
              row: 2,
              column: 2,
              player: { id: 0, name: "Player 1" }
            },
            {
              id: "R3C2",
              row: 3,
              column: 2,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R4C2",
              row: 4,
              column: 2,
              player: { id: "zzz", name: "zzz" }
            }
          ],
          [
            {
              id: "R0C3",
              row: 0,
              column: 3,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R1C3",
              row: 1,
              column: 3,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R2C3",
              row: 2,
              column: 3,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R3C3",
              row: 3,
              column: 3,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R4C3",
              row: 4,
              column: 3,
              player: { id: "zzz", name: "zzz" }
            }
          ],
          [
            {
              id: "R0C4",
              row: 0,
              column: 4,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R1C4",
              row: 1,
              column: 4,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R2C4",
              row: 2,
              column: 4,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R3C4",
              row: 3,
              column: 4,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R4C4",
              row: 4,
              column: 4,
              player: { id: "zzz", name: "zzz" }
            }
          ],
          [
            {
              id: "R0C5",
              row: 0,
              column: 5,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R1C5",
              row: 1,
              column: 5,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R2C5",
              row: 2,
              column: 5,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R3C5",
              row: 3,
              column: 5,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R4C5",
              row: 4,
              column: 5,
              player: { id: "zzz", name: "zzz" }
            }
          ],
          [
            {
              id: "R0C6",
              row: 0,
              column: 6,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R1C6",
              row: 1,
              column: 6,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R2C6",
              row: 2,
              column: 6,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R3C6",
              row: 3,
              column: 6,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R4C6",
              row: 4,
              column: 6,
              player: { id: "zzz", name: "zzz" }
            }
          ],
          [
            {
              id: "R0C7",
              row: 0,
              column: 7,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R1C7",
              row: 1,
              column: 7,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R2C7",
              row: 2,
              column: 7,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R3C7",
              row: 3,
              column: 7,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R4C7",
              row: 4,
              column: 7,
              player: { id: "zzz", name: "zzz" }
            }
          ],
          [
            {
              id: "R0C8",
              row: 0,
              column: 8,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R1C8",
              row: 1,
              column: 8,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R2C8",
              row: 2,
              column: 8,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R3C8",
              row: 3,
              column: 8,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R4C8",
              row: 4,
              column: 8,
              player: { id: "zzz", name: "zzz" }
            }
          ],
          [
            {
              id: "R0C9",
              row: 0,
              column: 9,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R1C9",
              row: 1,
              column: 9,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R2C9",
              row: 2,
              column: 9,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R3C9",
              row: 3,
              column: 9,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R4C9",
              row: 4,
              column: 9,
              player: { id: "zzz", name: "zzz" }
            }
          ],
          [
            {
              id: "R0C10",
              row: 0,
              column: 10,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R1C10",
              row: 1,
              column: 10,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R2C10",
              row: 2,
              column: 10,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R3C10",
              row: 3,
              column: 10,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R4C10",
              row: 4,
              column: 10,
              player: { id: "zzz", name: "zzz" }
            }
          ],
          [
            {
              id: "R0C11",
              row: 0,
              column: 11,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R1C11",
              row: 1,
              column: 11,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R2C11",
              row: 2,
              column: 11,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R3C11",
              row: 3,
              column: 11,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R4C11",
              row: 4,
              column: 11,
              player: { id: "zzz", name: "zzz" }
            }
          ],
          [
            {
              id: "R0C12",
              row: 0,
              column: 12,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R1C12",
              row: 1,
              column: 12,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R2C12",
              row: 2,
              column: 12,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R3C12",
              row: 3,
              column: 12,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R4C12",
              row: 4,
              column: 12,
              player: { id: "zzz", name: "zzz" }
            }
          ],
          [
            {
              id: "R0C13",
              row: 0,
              column: 13,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R1C13",
              row: 1,
              column: 13,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R2C13",
              row: 2,
              column: 13,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R3C13",
              row: 3,
              column: 13,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R4C13",
              row: 4,
              column: 13,
              player: { id: "zzz", name: "zzz" }
            }
          ],
          [
            {
              id: "R0C14",
              row: 0,
              column: 14,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R1C14",
              row: 1,
              column: 14,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R2C14",
              row: 2,
              column: 14,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R3C14",
              row: 3,
              column: 14,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R4C14",
              row: 4,
              column: 14,
              player: { id: "zzz", name: "zzz" }
            }
          ]
        ],
        scoringLines: [],
        dirScore: 0,
        iconSrc: "tictactoe-vertical.png"
      },
      {
        id: 3,
        name: "diagonalDownLeft",
        lines: [
          [
            {
              id: "R4C14",
              row: 4,
              column: 14,
              player: { id: "zzz", name: "zzz" }
            }
          ],
          [
            {
              id: "R3C14",
              row: 3,
              column: 14,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R4C13",
              row: 4,
              column: 13,
              player: { id: "zzz", name: "zzz" }
            }
          ],
          [
            {
              id: "R2C14",
              row: 2,
              column: 14,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R3C13",
              row: 3,
              column: 13,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R4C12",
              row: 4,
              column: 12,
              player: { id: "zzz", name: "zzz" }
            }
          ],
          [
            {
              id: "R1C14",
              row: 1,
              column: 14,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R2C13",
              row: 2,
              column: 13,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R3C12",
              row: 3,
              column: 12,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R4C11",
              row: 4,
              column: 11,
              player: { id: "zzz", name: "zzz" }
            }
          ],
          [
            {
              id: "R0C14",
              row: 0,
              column: 14,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R1C13",
              row: 1,
              column: 13,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R2C12",
              row: 2,
              column: 12,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R3C11",
              row: 3,
              column: 11,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R4C10",
              row: 4,
              column: 10,
              player: { id: "zzz", name: "zzz" }
            }
          ],
          [
            {
              id: "R0C13",
              row: 0,
              column: 13,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R1C12",
              row: 1,
              column: 12,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R2C11",
              row: 2,
              column: 11,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R3C10",
              row: 3,
              column: 10,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R4C9",
              row: 4,
              column: 9,
              player: { id: "zzz", name: "zzz" }
            }
          ],
          [
            {
              id: "R0C12",
              row: 0,
              column: 12,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R1C11",
              row: 1,
              column: 11,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R2C10",
              row: 2,
              column: 10,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R3C9",
              row: 3,
              column: 9,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R4C8",
              row: 4,
              column: 8,
              player: { id: "zzz", name: "zzz" }
            }
          ],
          [
            {
              id: "R0C11",
              row: 0,
              column: 11,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R1C10",
              row: 1,
              column: 10,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R2C9",
              row: 2,
              column: 9,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R3C8",
              row: 3,
              column: 8,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R4C7",
              row: 4,
              column: 7,
              player: { id: "zzz", name: "zzz" }
            }
          ],
          [
            {
              id: "R0C10",
              row: 0,
              column: 10,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R1C9",
              row: 1,
              column: 9,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R2C8",
              row: 2,
              column: 8,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R3C7",
              row: 3,
              column: 7,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R4C6",
              row: 4,
              column: 6,
              player: { id: "zzz", name: "zzz" }
            }
          ],
          [
            {
              id: "R0C9",
              row: 0,
              column: 9,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R1C8",
              row: 1,
              column: 8,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R2C7",
              row: 2,
              column: 7,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R3C6",
              row: 3,
              column: 6,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R4C5",
              row: 4,
              column: 5,
              player: { id: "zzz", name: "zzz" }
            }
          ],
          [
            {
              id: "R0C8",
              row: 0,
              column: 8,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R1C7",
              row: 1,
              column: 7,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R2C6",
              row: 2,
              column: 6,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R3C5",
              row: 3,
              column: 5,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R4C4",
              row: 4,
              column: 4,
              player: { id: "zzz", name: "zzz" }
            }
          ],
          [
            {
              id: "R0C7",
              row: 0,
              column: 7,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R1C6",
              row: 1,
              column: 6,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R2C5",
              row: 2,
              column: 5,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R3C4",
              row: 3,
              column: 4,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R4C3",
              row: 4,
              column: 3,
              player: { id: "zzz", name: "zzz" }
            }
          ],
          [
            {
              id: "R0C6",
              row: 0,
              column: 6,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R1C5",
              row: 1,
              column: 5,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R2C4",
              row: 2,
              column: 4,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R3C3",
              row: 3,
              column: 3,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R4C2",
              row: 4,
              column: 2,
              player: { id: "zzz", name: "zzz" }
            }
          ],
          [
            {
              id: "R0C5",
              row: 0,
              column: 5,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R1C4",
              row: 1,
              column: 4,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R2C3",
              row: 2,
              column: 3,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R3C2",
              row: 3,
              column: 2,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R4C1",
              row: 4,
              column: 1,
              player: { id: "zzz", name: "zzz" }
            }
          ],
          [
            {
              id: "R0C4",
              row: 0,
              column: 4,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R1C3",
              row: 1,
              column: 3,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R2C2",
              row: 2,
              column: 2,
              player: { id: 0, name: "Player 1" }
            },
            {
              id: "R3C1",
              row: 3,
              column: 1,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R4C0",
              row: 4,
              column: 0,
              player: { id: "zzz", name: "zzz" }
            }
          ],
          [
            {
              id: "R0C3",
              row: 0,
              column: 3,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R1C2",
              row: 1,
              column: 2,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R2C1",
              row: 2,
              column: 1,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R3C0",
              row: 3,
              column: 0,
              player: { id: "zzz", name: "zzz" }
            }
          ],
          [
            {
              id: "R0C2",
              row: 0,
              column: 2,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R1C1",
              row: 1,
              column: 1,
              player: { id: 0, name: "Player 1" }
            },
            {
              id: "R2C0",
              row: 2,
              column: 0,
              player: { id: "zzz", name: "zzz" }
            }
          ],
          [
            {
              id: "R0C1",
              row: 0,
              column: 1,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R1C0",
              row: 1,
              column: 0,
              player: { id: "zzz", name: "zzz" }
            }
          ],
          [
            {
              id: "R0C0",
              row: 0,
              column: 0,
              player: { id: 0, name: "Player 1" }
            }
          ]
        ],
        scoringLines: [],
        dirScore: 0,
        iconSrc: "tictactoe-diagonal-down-left.png"
      },
      {
        id: 4,
        name: "diagonalDownRight",
        lines: [
          [
            {
              id: "R4C0",
              row: 4,
              column: 0,
              player: { id: "zzz", name: "zzz" }
            }
          ],
          [
            {
              id: "R3C0",
              row: 3,
              column: 0,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R4C1",
              row: 4,
              column: 1,
              player: { id: "zzz", name: "zzz" }
            }
          ],
          [
            {
              id: "R2C0",
              row: 2,
              column: 0,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R3C1",
              row: 3,
              column: 1,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R4C2",
              row: 4,
              column: 2,
              player: { id: "zzz", name: "zzz" }
            }
          ],
          [
            {
              id: "R1C0",
              row: 1,
              column: 0,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R2C1",
              row: 2,
              column: 1,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R3C2",
              row: 3,
              column: 2,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R4C3",
              row: 4,
              column: 3,
              player: { id: "zzz", name: "zzz" }
            }
          ],
          [
            {
              id: "R0C0",
              row: 0,
              column: 0,
              player: { id: 0, name: "Player 1" }
            },
            {
              id: "R1C1",
              row: 1,
              column: 1,
              player: { id: 0, name: "Player 1" }
            },
            {
              id: "R2C2",
              row: 2,
              column: 2,
              player: { id: 0, name: "Player 1" }
            },
            {
              id: "R3C3",
              row: 3,
              column: 3,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R4C4",
              row: 4,
              column: 4,
              player: { id: "zzz", name: "zzz" }
            }
          ],
          [
            {
              id: "R0C1",
              row: 0,
              column: 1,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R1C2",
              row: 1,
              column: 2,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R2C3",
              row: 2,
              column: 3,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R3C4",
              row: 3,
              column: 4,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R4C5",
              row: 4,
              column: 5,
              player: { id: "zzz", name: "zzz" }
            }
          ],
          [
            {
              id: "R0C2",
              row: 0,
              column: 2,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R1C3",
              row: 1,
              column: 3,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R2C4",
              row: 2,
              column: 4,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R3C5",
              row: 3,
              column: 5,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R4C6",
              row: 4,
              column: 6,
              player: { id: "zzz", name: "zzz" }
            }
          ],
          [
            {
              id: "R0C3",
              row: 0,
              column: 3,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R1C4",
              row: 1,
              column: 4,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R2C5",
              row: 2,
              column: 5,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R3C6",
              row: 3,
              column: 6,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R4C7",
              row: 4,
              column: 7,
              player: { id: "zzz", name: "zzz" }
            }
          ],
          [
            {
              id: "R0C4",
              row: 0,
              column: 4,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R1C5",
              row: 1,
              column: 5,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R2C6",
              row: 2,
              column: 6,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R3C7",
              row: 3,
              column: 7,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R4C8",
              row: 4,
              column: 8,
              player: { id: "zzz", name: "zzz" }
            }
          ],
          [
            {
              id: "R0C5",
              row: 0,
              column: 5,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R1C6",
              row: 1,
              column: 6,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R2C7",
              row: 2,
              column: 7,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R3C8",
              row: 3,
              column: 8,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R4C9",
              row: 4,
              column: 9,
              player: { id: "zzz", name: "zzz" }
            }
          ],
          [
            {
              id: "R0C6",
              row: 0,
              column: 6,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R1C7",
              row: 1,
              column: 7,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R2C8",
              row: 2,
              column: 8,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R3C9",
              row: 3,
              column: 9,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R4C10",
              row: 4,
              column: 10,
              player: { id: "zzz", name: "zzz" }
            }
          ],
          [
            {
              id: "R0C7",
              row: 0,
              column: 7,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R1C8",
              row: 1,
              column: 8,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R2C9",
              row: 2,
              column: 9,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R3C10",
              row: 3,
              column: 10,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R4C11",
              row: 4,
              column: 11,
              player: { id: "zzz", name: "zzz" }
            }
          ],
          [
            {
              id: "R0C8",
              row: 0,
              column: 8,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R1C9",
              row: 1,
              column: 9,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R2C10",
              row: 2,
              column: 10,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R3C11",
              row: 3,
              column: 11,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R4C12",
              row: 4,
              column: 12,
              player: { id: "zzz", name: "zzz" }
            }
          ],
          [
            {
              id: "R0C9",
              row: 0,
              column: 9,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R1C10",
              row: 1,
              column: 10,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R2C11",
              row: 2,
              column: 11,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R3C12",
              row: 3,
              column: 12,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R4C13",
              row: 4,
              column: 13,
              player: { id: "zzz", name: "zzz" }
            }
          ],
          [
            {
              id: "R0C10",
              row: 0,
              column: 10,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R1C11",
              row: 1,
              column: 11,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R2C12",
              row: 2,
              column: 12,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R3C13",
              row: 3,
              column: 13,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R4C14",
              row: 4,
              column: 14,
              player: { id: "zzz", name: "zzz" }
            }
          ],
          [
            {
              id: "R0C11",
              row: 0,
              column: 11,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R1C12",
              row: 1,
              column: 12,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R2C13",
              row: 2,
              column: 13,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R3C14",
              row: 3,
              column: 14,
              player: { id: "zzz", name: "zzz" }
            }
          ],
          [
            {
              id: "R0C12",
              row: 0,
              column: 12,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R1C13",
              row: 1,
              column: 13,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R2C14",
              row: 2,
              column: 14,
              player: { id: "zzz", name: "zzz" }
            }
          ],
          [
            {
              id: "R0C13",
              row: 0,
              column: 13,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R1C14",
              row: 1,
              column: 14,
              player: { id: "zzz", name: "zzz" }
            }
          ],
          [
            {
              id: "R0C14",
              row: 0,
              column: 14,
              player: { id: "zzz", name: "zzz" }
            }
          ]
        ],
        scoringLines: [],
        dirScore: 5,
        iconSrc: "tictactoe-diagonal-down-right.png"
      }
    ],
    dirScoresByIndex: [0, 0, 0, 5]
  },
  {
    id: 1,
    name: "Player 2",
    totalScore: 5,
    marker: "x",
    bgColor: "hsla(260, 50%, 50%, 1)",
    moves: 0,
    scores: [
      {
        id: 1,
        name: "leftToRight",
        lines: [
          [
            {
              id: "R0C0",
              row: 0,
              column: 0,
              player: { id: 0, name: "Player 1" }
            },
            {
              id: "R0C1",
              row: 0,
              column: 1,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R0C2",
              row: 0,
              column: 2,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R0C3",
              row: 0,
              column: 3,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R0C4",
              row: 0,
              column: 4,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R0C5",
              row: 0,
              column: 5,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R0C6",
              row: 0,
              column: 6,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R0C7",
              row: 0,
              column: 7,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R0C8",
              row: 0,
              column: 8,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R0C9",
              row: 0,
              column: 9,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R0C10",
              row: 0,
              column: 10,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R0C11",
              row: 0,
              column: 11,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R0C12",
              row: 0,
              column: 12,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R0C13",
              row: 0,
              column: 13,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R0C14",
              row: 0,
              column: 14,
              player: { id: "zzz", name: "zzz" }
            }
          ],
          [
            {
              id: "R1C0",
              row: 1,
              column: 0,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R1C1",
              row: 1,
              column: 1,
              player: { id: 0, name: "Player 1" }
            },
            {
              id: "R1C2",
              row: 1,
              column: 2,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R1C3",
              row: 1,
              column: 3,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R1C4",
              row: 1,
              column: 4,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R1C5",
              row: 1,
              column: 5,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R1C6",
              row: 1,
              column: 6,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R1C7",
              row: 1,
              column: 7,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R1C8",
              row: 1,
              column: 8,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R1C9",
              row: 1,
              column: 9,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R1C10",
              row: 1,
              column: 10,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R1C11",
              row: 1,
              column: 11,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R1C12",
              row: 1,
              column: 12,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R1C13",
              row: 1,
              column: 13,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R1C14",
              row: 1,
              column: 14,
              player: { id: "zzz", name: "zzz" }
            }
          ],
          [
            {
              id: "R2C0",
              row: 2,
              column: 0,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R2C1",
              row: 2,
              column: 1,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R2C2",
              row: 2,
              column: 2,
              player: { id: 0, name: "Player 1" }
            },
            {
              id: "R2C3",
              row: 2,
              column: 3,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R2C4",
              row: 2,
              column: 4,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R2C5",
              row: 2,
              column: 5,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R2C6",
              row: 2,
              column: 6,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R2C7",
              row: 2,
              column: 7,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R2C8",
              row: 2,
              column: 8,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R2C9",
              row: 2,
              column: 9,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R2C10",
              row: 2,
              column: 10,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R2C11",
              row: 2,
              column: 11,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R2C12",
              row: 2,
              column: 12,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R2C13",
              row: 2,
              column: 13,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R2C14",
              row: 2,
              column: 14,
              player: { id: "zzz", name: "zzz" }
            }
          ],
          [
            {
              id: "R3C0",
              row: 3,
              column: 0,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R3C1",
              row: 3,
              column: 1,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R3C2",
              row: 3,
              column: 2,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R3C3",
              row: 3,
              column: 3,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R3C4",
              row: 3,
              column: 4,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R3C5",
              row: 3,
              column: 5,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R3C6",
              row: 3,
              column: 6,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R3C7",
              row: 3,
              column: 7,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R3C8",
              row: 3,
              column: 8,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R3C9",
              row: 3,
              column: 9,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R3C10",
              row: 3,
              column: 10,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R3C11",
              row: 3,
              column: 11,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R3C12",
              row: 3,
              column: 12,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R3C13",
              row: 3,
              column: 13,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R3C14",
              row: 3,
              column: 14,
              player: { id: "zzz", name: "zzz" }
            }
          ],
          [
            {
              id: "R4C0",
              row: 4,
              column: 0,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R4C1",
              row: 4,
              column: 1,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R4C2",
              row: 4,
              column: 2,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R4C3",
              row: 4,
              column: 3,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R4C4",
              row: 4,
              column: 4,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R4C5",
              row: 4,
              column: 5,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R4C6",
              row: 4,
              column: 6,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R4C7",
              row: 4,
              column: 7,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R4C8",
              row: 4,
              column: 8,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R4C9",
              row: 4,
              column: 9,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R4C10",
              row: 4,
              column: 10,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R4C11",
              row: 4,
              column: 11,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R4C12",
              row: 4,
              column: 12,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R4C13",
              row: 4,
              column: 13,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R4C14",
              row: 4,
              column: 14,
              player: { id: "zzz", name: "zzz" }
            }
          ]
        ],
        scoringLines: [],
        dirScore: 0,
        iconSrc: "tictactoe-horizontal.png"
      },
      {
        id: 2,
        name: "topToBottom",
        lines: [
          [
            {
              id: "R0C0",
              row: 0,
              column: 0,
              player: { id: 0, name: "Player 1" }
            },
            {
              id: "R1C0",
              row: 1,
              column: 0,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R2C0",
              row: 2,
              column: 0,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R3C0",
              row: 3,
              column: 0,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R4C0",
              row: 4,
              column: 0,
              player: { id: "zzz", name: "zzz" }
            }
          ],
          [
            {
              id: "R0C1",
              row: 0,
              column: 1,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R1C1",
              row: 1,
              column: 1,
              player: { id: 0, name: "Player 1" }
            },
            {
              id: "R2C1",
              row: 2,
              column: 1,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R3C1",
              row: 3,
              column: 1,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R4C1",
              row: 4,
              column: 1,
              player: { id: "zzz", name: "zzz" }
            }
          ],
          [
            {
              id: "R0C2",
              row: 0,
              column: 2,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R1C2",
              row: 1,
              column: 2,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R2C2",
              row: 2,
              column: 2,
              player: { id: 0, name: "Player 1" }
            },
            {
              id: "R3C2",
              row: 3,
              column: 2,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R4C2",
              row: 4,
              column: 2,
              player: { id: "zzz", name: "zzz" }
            }
          ],
          [
            {
              id: "R0C3",
              row: 0,
              column: 3,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R1C3",
              row: 1,
              column: 3,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R2C3",
              row: 2,
              column: 3,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R3C3",
              row: 3,
              column: 3,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R4C3",
              row: 4,
              column: 3,
              player: { id: "zzz", name: "zzz" }
            }
          ],
          [
            {
              id: "R0C4",
              row: 0,
              column: 4,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R1C4",
              row: 1,
              column: 4,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R2C4",
              row: 2,
              column: 4,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R3C4",
              row: 3,
              column: 4,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R4C4",
              row: 4,
              column: 4,
              player: { id: "zzz", name: "zzz" }
            }
          ],
          [
            {
              id: "R0C5",
              row: 0,
              column: 5,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R1C5",
              row: 1,
              column: 5,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R2C5",
              row: 2,
              column: 5,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R3C5",
              row: 3,
              column: 5,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R4C5",
              row: 4,
              column: 5,
              player: { id: "zzz", name: "zzz" }
            }
          ],
          [
            {
              id: "R0C6",
              row: 0,
              column: 6,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R1C6",
              row: 1,
              column: 6,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R2C6",
              row: 2,
              column: 6,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R3C6",
              row: 3,
              column: 6,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R4C6",
              row: 4,
              column: 6,
              player: { id: "zzz", name: "zzz" }
            }
          ],
          [
            {
              id: "R0C7",
              row: 0,
              column: 7,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R1C7",
              row: 1,
              column: 7,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R2C7",
              row: 2,
              column: 7,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R3C7",
              row: 3,
              column: 7,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R4C7",
              row: 4,
              column: 7,
              player: { id: "zzz", name: "zzz" }
            }
          ],
          [
            {
              id: "R0C8",
              row: 0,
              column: 8,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R1C8",
              row: 1,
              column: 8,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R2C8",
              row: 2,
              column: 8,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R3C8",
              row: 3,
              column: 8,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R4C8",
              row: 4,
              column: 8,
              player: { id: "zzz", name: "zzz" }
            }
          ],
          [
            {
              id: "R0C9",
              row: 0,
              column: 9,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R1C9",
              row: 1,
              column: 9,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R2C9",
              row: 2,
              column: 9,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R3C9",
              row: 3,
              column: 9,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R4C9",
              row: 4,
              column: 9,
              player: { id: "zzz", name: "zzz" }
            }
          ],
          [
            {
              id: "R0C10",
              row: 0,
              column: 10,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R1C10",
              row: 1,
              column: 10,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R2C10",
              row: 2,
              column: 10,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R3C10",
              row: 3,
              column: 10,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R4C10",
              row: 4,
              column: 10,
              player: { id: "zzz", name: "zzz" }
            }
          ],
          [
            {
              id: "R0C11",
              row: 0,
              column: 11,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R1C11",
              row: 1,
              column: 11,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R2C11",
              row: 2,
              column: 11,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R3C11",
              row: 3,
              column: 11,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R4C11",
              row: 4,
              column: 11,
              player: { id: "zzz", name: "zzz" }
            }
          ],
          [
            {
              id: "R0C12",
              row: 0,
              column: 12,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R1C12",
              row: 1,
              column: 12,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R2C12",
              row: 2,
              column: 12,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R3C12",
              row: 3,
              column: 12,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R4C12",
              row: 4,
              column: 12,
              player: { id: "zzz", name: "zzz" }
            }
          ],
          [
            {
              id: "R0C13",
              row: 0,
              column: 13,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R1C13",
              row: 1,
              column: 13,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R2C13",
              row: 2,
              column: 13,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R3C13",
              row: 3,
              column: 13,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R4C13",
              row: 4,
              column: 13,
              player: { id: "zzz", name: "zzz" }
            }
          ],
          [
            {
              id: "R0C14",
              row: 0,
              column: 14,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R1C14",
              row: 1,
              column: 14,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R2C14",
              row: 2,
              column: 14,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R3C14",
              row: 3,
              column: 14,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R4C14",
              row: 4,
              column: 14,
              player: { id: "zzz", name: "zzz" }
            }
          ]
        ],
        scoringLines: [],
        dirScore: 5,
        iconSrc: "tictactoe-vertical.png"
      },
      {
        id: 3,
        name: "diagonalDownLeft",
        lines: [
          [
            {
              id: "R4C14",
              row: 4,
              column: 14,
              player: { id: "zzz", name: "zzz" }
            }
          ],
          [
            {
              id: "R3C14",
              row: 3,
              column: 14,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R4C13",
              row: 4,
              column: 13,
              player: { id: "zzz", name: "zzz" }
            }
          ],
          [
            {
              id: "R2C14",
              row: 2,
              column: 14,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R3C13",
              row: 3,
              column: 13,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R4C12",
              row: 4,
              column: 12,
              player: { id: "zzz", name: "zzz" }
            }
          ],
          [
            {
              id: "R1C14",
              row: 1,
              column: 14,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R2C13",
              row: 2,
              column: 13,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R3C12",
              row: 3,
              column: 12,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R4C11",
              row: 4,
              column: 11,
              player: { id: "zzz", name: "zzz" }
            }
          ],
          [
            {
              id: "R0C14",
              row: 0,
              column: 14,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R1C13",
              row: 1,
              column: 13,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R2C12",
              row: 2,
              column: 12,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R3C11",
              row: 3,
              column: 11,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R4C10",
              row: 4,
              column: 10,
              player: { id: "zzz", name: "zzz" }
            }
          ],
          [
            {
              id: "R0C13",
              row: 0,
              column: 13,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R1C12",
              row: 1,
              column: 12,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R2C11",
              row: 2,
              column: 11,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R3C10",
              row: 3,
              column: 10,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R4C9",
              row: 4,
              column: 9,
              player: { id: "zzz", name: "zzz" }
            }
          ],
          [
            {
              id: "R0C12",
              row: 0,
              column: 12,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R1C11",
              row: 1,
              column: 11,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R2C10",
              row: 2,
              column: 10,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R3C9",
              row: 3,
              column: 9,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R4C8",
              row: 4,
              column: 8,
              player: { id: "zzz", name: "zzz" }
            }
          ],
          [
            {
              id: "R0C11",
              row: 0,
              column: 11,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R1C10",
              row: 1,
              column: 10,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R2C9",
              row: 2,
              column: 9,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R3C8",
              row: 3,
              column: 8,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R4C7",
              row: 4,
              column: 7,
              player: { id: "zzz", name: "zzz" }
            }
          ],
          [
            {
              id: "R0C10",
              row: 0,
              column: 10,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R1C9",
              row: 1,
              column: 9,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R2C8",
              row: 2,
              column: 8,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R3C7",
              row: 3,
              column: 7,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R4C6",
              row: 4,
              column: 6,
              player: { id: "zzz", name: "zzz" }
            }
          ],
          [
            {
              id: "R0C9",
              row: 0,
              column: 9,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R1C8",
              row: 1,
              column: 8,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R2C7",
              row: 2,
              column: 7,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R3C6",
              row: 3,
              column: 6,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R4C5",
              row: 4,
              column: 5,
              player: { id: "zzz", name: "zzz" }
            }
          ],
          [
            {
              id: "R0C8",
              row: 0,
              column: 8,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R1C7",
              row: 1,
              column: 7,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R2C6",
              row: 2,
              column: 6,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R3C5",
              row: 3,
              column: 5,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R4C4",
              row: 4,
              column: 4,
              player: { id: "zzz", name: "zzz" }
            }
          ],
          [
            {
              id: "R0C7",
              row: 0,
              column: 7,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R1C6",
              row: 1,
              column: 6,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R2C5",
              row: 2,
              column: 5,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R3C4",
              row: 3,
              column: 4,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R4C3",
              row: 4,
              column: 3,
              player: { id: "zzz", name: "zzz" }
            }
          ],
          [
            {
              id: "R0C6",
              row: 0,
              column: 6,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R1C5",
              row: 1,
              column: 5,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R2C4",
              row: 2,
              column: 4,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R3C3",
              row: 3,
              column: 3,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R4C2",
              row: 4,
              column: 2,
              player: { id: "zzz", name: "zzz" }
            }
          ],
          [
            {
              id: "R0C5",
              row: 0,
              column: 5,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R1C4",
              row: 1,
              column: 4,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R2C3",
              row: 2,
              column: 3,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R3C2",
              row: 3,
              column: 2,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R4C1",
              row: 4,
              column: 1,
              player: { id: "zzz", name: "zzz" }
            }
          ],
          [
            {
              id: "R0C4",
              row: 0,
              column: 4,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R1C3",
              row: 1,
              column: 3,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R2C2",
              row: 2,
              column: 2,
              player: { id: 0, name: "Player 1" }
            },
            {
              id: "R3C1",
              row: 3,
              column: 1,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R4C0",
              row: 4,
              column: 0,
              player: { id: "zzz", name: "zzz" }
            }
          ],
          [
            {
              id: "R0C3",
              row: 0,
              column: 3,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R1C2",
              row: 1,
              column: 2,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R2C1",
              row: 2,
              column: 1,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R3C0",
              row: 3,
              column: 0,
              player: { id: "zzz", name: "zzz" }
            }
          ],
          [
            {
              id: "R0C2",
              row: 0,
              column: 2,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R1C1",
              row: 1,
              column: 1,
              player: { id: 0, name: "Player 1" }
            },
            {
              id: "R2C0",
              row: 2,
              column: 0,
              player: { id: "zzz", name: "zzz" }
            }
          ],
          [
            {
              id: "R0C1",
              row: 0,
              column: 1,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R1C0",
              row: 1,
              column: 0,
              player: { id: "zzz", name: "zzz" }
            }
          ],
          [
            {
              id: "R0C0",
              row: 0,
              column: 0,
              player: { id: 0, name: "Player 1" }
            }
          ]
        ],
        scoringLines: [],
        dirScore: 0,
        iconSrc: "tictactoe-diagonal-down-left.png"
      },
      {
        id: 4,
        name: "diagonalDownRight",
        lines: [
          [
            {
              id: "R4C0",
              row: 4,
              column: 0,
              player: { id: "zzz", name: "zzz" }
            }
          ],
          [
            {
              id: "R3C0",
              row: 3,
              column: 0,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R4C1",
              row: 4,
              column: 1,
              player: { id: "zzz", name: "zzz" }
            }
          ],
          [
            {
              id: "R2C0",
              row: 2,
              column: 0,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R3C1",
              row: 3,
              column: 1,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R4C2",
              row: 4,
              column: 2,
              player: { id: "zzz", name: "zzz" }
            }
          ],
          [
            {
              id: "R1C0",
              row: 1,
              column: 0,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R2C1",
              row: 2,
              column: 1,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R3C2",
              row: 3,
              column: 2,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R4C3",
              row: 4,
              column: 3,
              player: { id: "zzz", name: "zzz" }
            }
          ],
          [
            {
              id: "R0C0",
              row: 0,
              column: 0,
              player: { id: 0, name: "Player 1" }
            },
            {
              id: "R1C1",
              row: 1,
              column: 1,
              player: { id: 0, name: "Player 1" }
            },
            {
              id: "R2C2",
              row: 2,
              column: 2,
              player: { id: 0, name: "Player 1" }
            },
            {
              id: "R3C3",
              row: 3,
              column: 3,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R4C4",
              row: 4,
              column: 4,
              player: { id: "zzz", name: "zzz" }
            }
          ],
          [
            {
              id: "R0C1",
              row: 0,
              column: 1,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R1C2",
              row: 1,
              column: 2,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R2C3",
              row: 2,
              column: 3,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R3C4",
              row: 3,
              column: 4,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R4C5",
              row: 4,
              column: 5,
              player: { id: "zzz", name: "zzz" }
            }
          ],
          [
            {
              id: "R0C2",
              row: 0,
              column: 2,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R1C3",
              row: 1,
              column: 3,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R2C4",
              row: 2,
              column: 4,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R3C5",
              row: 3,
              column: 5,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R4C6",
              row: 4,
              column: 6,
              player: { id: "zzz", name: "zzz" }
            }
          ],
          [
            {
              id: "R0C3",
              row: 0,
              column: 3,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R1C4",
              row: 1,
              column: 4,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R2C5",
              row: 2,
              column: 5,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R3C6",
              row: 3,
              column: 6,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R4C7",
              row: 4,
              column: 7,
              player: { id: "zzz", name: "zzz" }
            }
          ],
          [
            {
              id: "R0C4",
              row: 0,
              column: 4,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R1C5",
              row: 1,
              column: 5,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R2C6",
              row: 2,
              column: 6,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R3C7",
              row: 3,
              column: 7,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R4C8",
              row: 4,
              column: 8,
              player: { id: "zzz", name: "zzz" }
            }
          ],
          [
            {
              id: "R0C5",
              row: 0,
              column: 5,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R1C6",
              row: 1,
              column: 6,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R2C7",
              row: 2,
              column: 7,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R3C8",
              row: 3,
              column: 8,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R4C9",
              row: 4,
              column: 9,
              player: { id: "zzz", name: "zzz" }
            }
          ],
          [
            {
              id: "R0C6",
              row: 0,
              column: 6,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R1C7",
              row: 1,
              column: 7,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R2C8",
              row: 2,
              column: 8,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R3C9",
              row: 3,
              column: 9,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R4C10",
              row: 4,
              column: 10,
              player: { id: "zzz", name: "zzz" }
            }
          ],
          [
            {
              id: "R0C7",
              row: 0,
              column: 7,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R1C8",
              row: 1,
              column: 8,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R2C9",
              row: 2,
              column: 9,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R3C10",
              row: 3,
              column: 10,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R4C11",
              row: 4,
              column: 11,
              player: { id: "zzz", name: "zzz" }
            }
          ],
          [
            {
              id: "R0C8",
              row: 0,
              column: 8,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R1C9",
              row: 1,
              column: 9,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R2C10",
              row: 2,
              column: 10,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R3C11",
              row: 3,
              column: 11,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R4C12",
              row: 4,
              column: 12,
              player: { id: "zzz", name: "zzz" }
            }
          ],
          [
            {
              id: "R0C9",
              row: 0,
              column: 9,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R1C10",
              row: 1,
              column: 10,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R2C11",
              row: 2,
              column: 11,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R3C12",
              row: 3,
              column: 12,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R4C13",
              row: 4,
              column: 13,
              player: { id: "zzz", name: "zzz" }
            }
          ],
          [
            {
              id: "R0C10",
              row: 0,
              column: 10,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R1C11",
              row: 1,
              column: 11,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R2C12",
              row: 2,
              column: 12,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R3C13",
              row: 3,
              column: 13,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R4C14",
              row: 4,
              column: 14,
              player: { id: "zzz", name: "zzz" }
            }
          ],
          [
            {
              id: "R0C11",
              row: 0,
              column: 11,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R1C12",
              row: 1,
              column: 12,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R2C13",
              row: 2,
              column: 13,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R3C14",
              row: 3,
              column: 14,
              player: { id: "zzz", name: "zzz" }
            }
          ],
          [
            {
              id: "R0C12",
              row: 0,
              column: 12,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R1C13",
              row: 1,
              column: 13,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R2C14",
              row: 2,
              column: 14,
              player: { id: "zzz", name: "zzz" }
            }
          ],
          [
            {
              id: "R0C13",
              row: 0,
              column: 13,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R1C14",
              row: 1,
              column: 14,
              player: { id: "zzz", name: "zzz" }
            }
          ],
          [
            {
              id: "R0C14",
              row: 0,
              column: 14,
              player: { id: "zzz", name: "zzz" }
            }
          ]
        ],
        scoringLines: [],
        dirScore: 0,
        iconSrc: "tictactoe-diagonal-down-right.png"
      }
    ],
    dirScoresByIndex: [0, 5, 0, 0]
  },
  {
    id: 2,
    name: "Player 3",
    totalScore: 3,
    marker: "x",
    bgColor: "hsla(320, 50%, 50%, 1)",
    moves: 0,
    scores: [
      {
        id: 1,
        name: "leftToRight",
        lines: [
          [
            {
              id: "R0C0",
              row: 0,
              column: 0,
              player: { id: 0, name: "Player 1" }
            },
            {
              id: "R0C1",
              row: 0,
              column: 1,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R0C2",
              row: 0,
              column: 2,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R0C3",
              row: 0,
              column: 3,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R0C4",
              row: 0,
              column: 4,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R0C5",
              row: 0,
              column: 5,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R0C6",
              row: 0,
              column: 6,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R0C7",
              row: 0,
              column: 7,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R0C8",
              row: 0,
              column: 8,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R0C9",
              row: 0,
              column: 9,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R0C10",
              row: 0,
              column: 10,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R0C11",
              row: 0,
              column: 11,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R0C12",
              row: 0,
              column: 12,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R0C13",
              row: 0,
              column: 13,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R0C14",
              row: 0,
              column: 14,
              player: { id: "zzz", name: "zzz" }
            }
          ],
          [
            {
              id: "R1C0",
              row: 1,
              column: 0,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R1C1",
              row: 1,
              column: 1,
              player: { id: 0, name: "Player 1" }
            },
            {
              id: "R1C2",
              row: 1,
              column: 2,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R1C3",
              row: 1,
              column: 3,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R1C4",
              row: 1,
              column: 4,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R1C5",
              row: 1,
              column: 5,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R1C6",
              row: 1,
              column: 6,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R1C7",
              row: 1,
              column: 7,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R1C8",
              row: 1,
              column: 8,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R1C9",
              row: 1,
              column: 9,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R1C10",
              row: 1,
              column: 10,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R1C11",
              row: 1,
              column: 11,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R1C12",
              row: 1,
              column: 12,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R1C13",
              row: 1,
              column: 13,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R1C14",
              row: 1,
              column: 14,
              player: { id: "zzz", name: "zzz" }
            }
          ],
          [
            {
              id: "R2C0",
              row: 2,
              column: 0,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R2C1",
              row: 2,
              column: 1,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R2C2",
              row: 2,
              column: 2,
              player: { id: 0, name: "Player 1" }
            },
            {
              id: "R2C3",
              row: 2,
              column: 3,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R2C4",
              row: 2,
              column: 4,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R2C5",
              row: 2,
              column: 5,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R2C6",
              row: 2,
              column: 6,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R2C7",
              row: 2,
              column: 7,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R2C8",
              row: 2,
              column: 8,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R2C9",
              row: 2,
              column: 9,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R2C10",
              row: 2,
              column: 10,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R2C11",
              row: 2,
              column: 11,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R2C12",
              row: 2,
              column: 12,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R2C13",
              row: 2,
              column: 13,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R2C14",
              row: 2,
              column: 14,
              player: { id: "zzz", name: "zzz" }
            }
          ],
          [
            {
              id: "R3C0",
              row: 3,
              column: 0,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R3C1",
              row: 3,
              column: 1,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R3C2",
              row: 3,
              column: 2,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R3C3",
              row: 3,
              column: 3,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R3C4",
              row: 3,
              column: 4,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R3C5",
              row: 3,
              column: 5,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R3C6",
              row: 3,
              column: 6,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R3C7",
              row: 3,
              column: 7,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R3C8",
              row: 3,
              column: 8,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R3C9",
              row: 3,
              column: 9,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R3C10",
              row: 3,
              column: 10,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R3C11",
              row: 3,
              column: 11,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R3C12",
              row: 3,
              column: 12,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R3C13",
              row: 3,
              column: 13,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R3C14",
              row: 3,
              column: 14,
              player: { id: "zzz", name: "zzz" }
            }
          ],
          [
            {
              id: "R4C0",
              row: 4,
              column: 0,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R4C1",
              row: 4,
              column: 1,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R4C2",
              row: 4,
              column: 2,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R4C3",
              row: 4,
              column: 3,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R4C4",
              row: 4,
              column: 4,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R4C5",
              row: 4,
              column: 5,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R4C6",
              row: 4,
              column: 6,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R4C7",
              row: 4,
              column: 7,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R4C8",
              row: 4,
              column: 8,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R4C9",
              row: 4,
              column: 9,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R4C10",
              row: 4,
              column: 10,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R4C11",
              row: 4,
              column: 11,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R4C12",
              row: 4,
              column: 12,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R4C13",
              row: 4,
              column: 13,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R4C14",
              row: 4,
              column: 14,
              player: { id: "zzz", name: "zzz" }
            }
          ]
        ],
        scoringLines: [],
        dirScore: 1,
        iconSrc: "tictactoe-horizontal.png"
      },
      {
        id: 2,
        name: "topToBottom",
        lines: [
          [
            {
              id: "R0C0",
              row: 0,
              column: 0,
              player: { id: 0, name: "Player 1" }
            },
            {
              id: "R1C0",
              row: 1,
              column: 0,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R2C0",
              row: 2,
              column: 0,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R3C0",
              row: 3,
              column: 0,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R4C0",
              row: 4,
              column: 0,
              player: { id: "zzz", name: "zzz" }
            }
          ],
          [
            {
              id: "R0C1",
              row: 0,
              column: 1,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R1C1",
              row: 1,
              column: 1,
              player: { id: 0, name: "Player 1" }
            },
            {
              id: "R2C1",
              row: 2,
              column: 1,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R3C1",
              row: 3,
              column: 1,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R4C1",
              row: 4,
              column: 1,
              player: { id: "zzz", name: "zzz" }
            }
          ],
          [
            {
              id: "R0C2",
              row: 0,
              column: 2,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R1C2",
              row: 1,
              column: 2,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R2C2",
              row: 2,
              column: 2,
              player: { id: 0, name: "Player 1" }
            },
            {
              id: "R3C2",
              row: 3,
              column: 2,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R4C2",
              row: 4,
              column: 2,
              player: { id: "zzz", name: "zzz" }
            }
          ],
          [
            {
              id: "R0C3",
              row: 0,
              column: 3,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R1C3",
              row: 1,
              column: 3,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R2C3",
              row: 2,
              column: 3,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R3C3",
              row: 3,
              column: 3,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R4C3",
              row: 4,
              column: 3,
              player: { id: "zzz", name: "zzz" }
            }
          ],
          [
            {
              id: "R0C4",
              row: 0,
              column: 4,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R1C4",
              row: 1,
              column: 4,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R2C4",
              row: 2,
              column: 4,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R3C4",
              row: 3,
              column: 4,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R4C4",
              row: 4,
              column: 4,
              player: { id: "zzz", name: "zzz" }
            }
          ],
          [
            {
              id: "R0C5",
              row: 0,
              column: 5,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R1C5",
              row: 1,
              column: 5,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R2C5",
              row: 2,
              column: 5,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R3C5",
              row: 3,
              column: 5,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R4C5",
              row: 4,
              column: 5,
              player: { id: "zzz", name: "zzz" }
            }
          ],
          [
            {
              id: "R0C6",
              row: 0,
              column: 6,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R1C6",
              row: 1,
              column: 6,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R2C6",
              row: 2,
              column: 6,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R3C6",
              row: 3,
              column: 6,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R4C6",
              row: 4,
              column: 6,
              player: { id: "zzz", name: "zzz" }
            }
          ],
          [
            {
              id: "R0C7",
              row: 0,
              column: 7,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R1C7",
              row: 1,
              column: 7,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R2C7",
              row: 2,
              column: 7,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R3C7",
              row: 3,
              column: 7,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R4C7",
              row: 4,
              column: 7,
              player: { id: "zzz", name: "zzz" }
            }
          ],
          [
            {
              id: "R0C8",
              row: 0,
              column: 8,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R1C8",
              row: 1,
              column: 8,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R2C8",
              row: 2,
              column: 8,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R3C8",
              row: 3,
              column: 8,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R4C8",
              row: 4,
              column: 8,
              player: { id: "zzz", name: "zzz" }
            }
          ],
          [
            {
              id: "R0C9",
              row: 0,
              column: 9,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R1C9",
              row: 1,
              column: 9,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R2C9",
              row: 2,
              column: 9,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R3C9",
              row: 3,
              column: 9,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R4C9",
              row: 4,
              column: 9,
              player: { id: "zzz", name: "zzz" }
            }
          ],
          [
            {
              id: "R0C10",
              row: 0,
              column: 10,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R1C10",
              row: 1,
              column: 10,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R2C10",
              row: 2,
              column: 10,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R3C10",
              row: 3,
              column: 10,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R4C10",
              row: 4,
              column: 10,
              player: { id: "zzz", name: "zzz" }
            }
          ],
          [
            {
              id: "R0C11",
              row: 0,
              column: 11,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R1C11",
              row: 1,
              column: 11,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R2C11",
              row: 2,
              column: 11,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R3C11",
              row: 3,
              column: 11,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R4C11",
              row: 4,
              column: 11,
              player: { id: "zzz", name: "zzz" }
            }
          ],
          [
            {
              id: "R0C12",
              row: 0,
              column: 12,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R1C12",
              row: 1,
              column: 12,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R2C12",
              row: 2,
              column: 12,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R3C12",
              row: 3,
              column: 12,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R4C12",
              row: 4,
              column: 12,
              player: { id: "zzz", name: "zzz" }
            }
          ],
          [
            {
              id: "R0C13",
              row: 0,
              column: 13,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R1C13",
              row: 1,
              column: 13,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R2C13",
              row: 2,
              column: 13,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R3C13",
              row: 3,
              column: 13,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R4C13",
              row: 4,
              column: 13,
              player: { id: "zzz", name: "zzz" }
            }
          ],
          [
            {
              id: "R0C14",
              row: 0,
              column: 14,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R1C14",
              row: 1,
              column: 14,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R2C14",
              row: 2,
              column: 14,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R3C14",
              row: 3,
              column: 14,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R4C14",
              row: 4,
              column: 14,
              player: { id: "zzz", name: "zzz" }
            }
          ]
        ],
        scoringLines: [],
        dirScore: 1,
        iconSrc: "tictactoe-vertical.png"
      },
      {
        id: 3,
        name: "diagonalDownLeft",
        lines: [
          [
            {
              id: "R4C14",
              row: 4,
              column: 14,
              player: { id: "zzz", name: "zzz" }
            }
          ],
          [
            {
              id: "R3C14",
              row: 3,
              column: 14,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R4C13",
              row: 4,
              column: 13,
              player: { id: "zzz", name: "zzz" }
            }
          ],
          [
            {
              id: "R2C14",
              row: 2,
              column: 14,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R3C13",
              row: 3,
              column: 13,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R4C12",
              row: 4,
              column: 12,
              player: { id: "zzz", name: "zzz" }
            }
          ],
          [
            {
              id: "R1C14",
              row: 1,
              column: 14,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R2C13",
              row: 2,
              column: 13,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R3C12",
              row: 3,
              column: 12,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R4C11",
              row: 4,
              column: 11,
              player: { id: "zzz", name: "zzz" }
            }
          ],
          [
            {
              id: "R0C14",
              row: 0,
              column: 14,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R1C13",
              row: 1,
              column: 13,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R2C12",
              row: 2,
              column: 12,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R3C11",
              row: 3,
              column: 11,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R4C10",
              row: 4,
              column: 10,
              player: { id: "zzz", name: "zzz" }
            }
          ],
          [
            {
              id: "R0C13",
              row: 0,
              column: 13,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R1C12",
              row: 1,
              column: 12,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R2C11",
              row: 2,
              column: 11,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R3C10",
              row: 3,
              column: 10,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R4C9",
              row: 4,
              column: 9,
              player: { id: "zzz", name: "zzz" }
            }
          ],
          [
            {
              id: "R0C12",
              row: 0,
              column: 12,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R1C11",
              row: 1,
              column: 11,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R2C10",
              row: 2,
              column: 10,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R3C9",
              row: 3,
              column: 9,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R4C8",
              row: 4,
              column: 8,
              player: { id: "zzz", name: "zzz" }
            }
          ],
          [
            {
              id: "R0C11",
              row: 0,
              column: 11,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R1C10",
              row: 1,
              column: 10,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R2C9",
              row: 2,
              column: 9,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R3C8",
              row: 3,
              column: 8,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R4C7",
              row: 4,
              column: 7,
              player: { id: "zzz", name: "zzz" }
            }
          ],
          [
            {
              id: "R0C10",
              row: 0,
              column: 10,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R1C9",
              row: 1,
              column: 9,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R2C8",
              row: 2,
              column: 8,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R3C7",
              row: 3,
              column: 7,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R4C6",
              row: 4,
              column: 6,
              player: { id: "zzz", name: "zzz" }
            }
          ],
          [
            {
              id: "R0C9",
              row: 0,
              column: 9,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R1C8",
              row: 1,
              column: 8,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R2C7",
              row: 2,
              column: 7,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R3C6",
              row: 3,
              column: 6,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R4C5",
              row: 4,
              column: 5,
              player: { id: "zzz", name: "zzz" }
            }
          ],
          [
            {
              id: "R0C8",
              row: 0,
              column: 8,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R1C7",
              row: 1,
              column: 7,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R2C6",
              row: 2,
              column: 6,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R3C5",
              row: 3,
              column: 5,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R4C4",
              row: 4,
              column: 4,
              player: { id: "zzz", name: "zzz" }
            }
          ],
          [
            {
              id: "R0C7",
              row: 0,
              column: 7,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R1C6",
              row: 1,
              column: 6,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R2C5",
              row: 2,
              column: 5,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R3C4",
              row: 3,
              column: 4,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R4C3",
              row: 4,
              column: 3,
              player: { id: "zzz", name: "zzz" }
            }
          ],
          [
            {
              id: "R0C6",
              row: 0,
              column: 6,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R1C5",
              row: 1,
              column: 5,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R2C4",
              row: 2,
              column: 4,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R3C3",
              row: 3,
              column: 3,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R4C2",
              row: 4,
              column: 2,
              player: { id: "zzz", name: "zzz" }
            }
          ],
          [
            {
              id: "R0C5",
              row: 0,
              column: 5,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R1C4",
              row: 1,
              column: 4,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R2C3",
              row: 2,
              column: 3,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R3C2",
              row: 3,
              column: 2,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R4C1",
              row: 4,
              column: 1,
              player: { id: "zzz", name: "zzz" }
            }
          ],
          [
            {
              id: "R0C4",
              row: 0,
              column: 4,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R1C3",
              row: 1,
              column: 3,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R2C2",
              row: 2,
              column: 2,
              player: { id: 0, name: "Player 1" }
            },
            {
              id: "R3C1",
              row: 3,
              column: 1,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R4C0",
              row: 4,
              column: 0,
              player: { id: "zzz", name: "zzz" }
            }
          ],
          [
            {
              id: "R0C3",
              row: 0,
              column: 3,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R1C2",
              row: 1,
              column: 2,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R2C1",
              row: 2,
              column: 1,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R3C0",
              row: 3,
              column: 0,
              player: { id: "zzz", name: "zzz" }
            }
          ],
          [
            {
              id: "R0C2",
              row: 0,
              column: 2,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R1C1",
              row: 1,
              column: 1,
              player: { id: 0, name: "Player 1" }
            },
            {
              id: "R2C0",
              row: 2,
              column: 0,
              player: { id: "zzz", name: "zzz" }
            }
          ],
          [
            {
              id: "R0C1",
              row: 0,
              column: 1,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R1C0",
              row: 1,
              column: 0,
              player: { id: "zzz", name: "zzz" }
            }
          ],
          [
            {
              id: "R0C0",
              row: 0,
              column: 0,
              player: { id: 0, name: "Player 1" }
            }
          ]
        ],
        scoringLines: [],
        dirScore: 1,
        iconSrc: "tictactoe-diagonal-down-left.png"
      },
      {
        id: 4,
        name: "diagonalDownRight",
        lines: [
          [
            {
              id: "R4C0",
              row: 4,
              column: 0,
              player: { id: "zzz", name: "zzz" }
            }
          ],
          [
            {
              id: "R3C0",
              row: 3,
              column: 0,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R4C1",
              row: 4,
              column: 1,
              player: { id: "zzz", name: "zzz" }
            }
          ],
          [
            {
              id: "R2C0",
              row: 2,
              column: 0,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R3C1",
              row: 3,
              column: 1,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R4C2",
              row: 4,
              column: 2,
              player: { id: "zzz", name: "zzz" }
            }
          ],
          [
            {
              id: "R1C0",
              row: 1,
              column: 0,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R2C1",
              row: 2,
              column: 1,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R3C2",
              row: 3,
              column: 2,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R4C3",
              row: 4,
              column: 3,
              player: { id: "zzz", name: "zzz" }
            }
          ],
          [
            {
              id: "R0C0",
              row: 0,
              column: 0,
              player: { id: 0, name: "Player 1" }
            },
            {
              id: "R1C1",
              row: 1,
              column: 1,
              player: { id: 0, name: "Player 1" }
            },
            {
              id: "R2C2",
              row: 2,
              column: 2,
              player: { id: 0, name: "Player 1" }
            },
            {
              id: "R3C3",
              row: 3,
              column: 3,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R4C4",
              row: 4,
              column: 4,
              player: { id: "zzz", name: "zzz" }
            }
          ],
          [
            {
              id: "R0C1",
              row: 0,
              column: 1,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R1C2",
              row: 1,
              column: 2,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R2C3",
              row: 2,
              column: 3,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R3C4",
              row: 3,
              column: 4,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R4C5",
              row: 4,
              column: 5,
              player: { id: "zzz", name: "zzz" }
            }
          ],
          [
            {
              id: "R0C2",
              row: 0,
              column: 2,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R1C3",
              row: 1,
              column: 3,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R2C4",
              row: 2,
              column: 4,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R3C5",
              row: 3,
              column: 5,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R4C6",
              row: 4,
              column: 6,
              player: { id: "zzz", name: "zzz" }
            }
          ],
          [
            {
              id: "R0C3",
              row: 0,
              column: 3,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R1C4",
              row: 1,
              column: 4,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R2C5",
              row: 2,
              column: 5,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R3C6",
              row: 3,
              column: 6,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R4C7",
              row: 4,
              column: 7,
              player: { id: "zzz", name: "zzz" }
            }
          ],
          [
            {
              id: "R0C4",
              row: 0,
              column: 4,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R1C5",
              row: 1,
              column: 5,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R2C6",
              row: 2,
              column: 6,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R3C7",
              row: 3,
              column: 7,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R4C8",
              row: 4,
              column: 8,
              player: { id: "zzz", name: "zzz" }
            }
          ],
          [
            {
              id: "R0C5",
              row: 0,
              column: 5,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R1C6",
              row: 1,
              column: 6,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R2C7",
              row: 2,
              column: 7,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R3C8",
              row: 3,
              column: 8,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R4C9",
              row: 4,
              column: 9,
              player: { id: "zzz", name: "zzz" }
            }
          ],
          [
            {
              id: "R0C6",
              row: 0,
              column: 6,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R1C7",
              row: 1,
              column: 7,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R2C8",
              row: 2,
              column: 8,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R3C9",
              row: 3,
              column: 9,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R4C10",
              row: 4,
              column: 10,
              player: { id: "zzz", name: "zzz" }
            }
          ],
          [
            {
              id: "R0C7",
              row: 0,
              column: 7,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R1C8",
              row: 1,
              column: 8,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R2C9",
              row: 2,
              column: 9,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R3C10",
              row: 3,
              column: 10,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R4C11",
              row: 4,
              column: 11,
              player: { id: "zzz", name: "zzz" }
            }
          ],
          [
            {
              id: "R0C8",
              row: 0,
              column: 8,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R1C9",
              row: 1,
              column: 9,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R2C10",
              row: 2,
              column: 10,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R3C11",
              row: 3,
              column: 11,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R4C12",
              row: 4,
              column: 12,
              player: { id: "zzz", name: "zzz" }
            }
          ],
          [
            {
              id: "R0C9",
              row: 0,
              column: 9,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R1C10",
              row: 1,
              column: 10,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R2C11",
              row: 2,
              column: 11,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R3C12",
              row: 3,
              column: 12,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R4C13",
              row: 4,
              column: 13,
              player: { id: "zzz", name: "zzz" }
            }
          ],
          [
            {
              id: "R0C10",
              row: 0,
              column: 10,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R1C11",
              row: 1,
              column: 11,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R2C12",
              row: 2,
              column: 12,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R3C13",
              row: 3,
              column: 13,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R4C14",
              row: 4,
              column: 14,
              player: { id: "zzz", name: "zzz" }
            }
          ],
          [
            {
              id: "R0C11",
              row: 0,
              column: 11,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R1C12",
              row: 1,
              column: 12,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R2C13",
              row: 2,
              column: 13,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R3C14",
              row: 3,
              column: 14,
              player: { id: "zzz", name: "zzz" }
            }
          ],
          [
            {
              id: "R0C12",
              row: 0,
              column: 12,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R1C13",
              row: 1,
              column: 13,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R2C14",
              row: 2,
              column: 14,
              player: { id: "zzz", name: "zzz" }
            }
          ],
          [
            {
              id: "R0C13",
              row: 0,
              column: 13,
              player: { id: "zzz", name: "zzz" }
            },
            {
              id: "R1C14",
              row: 1,
              column: 14,
              player: { id: "zzz", name: "zzz" }
            }
          ],
          [
            {
              id: "R0C14",
              row: 0,
              column: 14,
              player: { id: "zzz", name: "zzz" }
            }
          ]
        ],
        scoringLines: [],
        dirScore: 0,
        iconSrc: "tictactoe-diagonal-down-right.png"
      }
    ],
    dirScoresByIndex: [1, 1, 1, 0]
  }
]);
let movesPlayedHistory = writable([
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
  subscribe: players.subscribe
};
export const storeMovesPlayedHistory = {
  subscribe: movesPlayedHistory.subscribe
};
export const storeSettings = {
  subscribe: settings.subscribe
};
export const storeState = {
  subscribe: state.subscribe
};
export const storeDirectionArrays = {
  subscribe: directionArrays.subscribe
};
export const storeCurrentPlayer = {
  subscribe: currentPlayer.subscribe
};
export const storeGameInProgress = {
  subscribe: gameInProgress.subscribe
};
export const storePreservePlayerDetails = {
  subscribe: preservePlayerDetails.subscribe
};

// storeSettings, storeState, storePlayers, storeCurrentPlayer, storeDirectionArrays, storeGameInProgress, storeMovesPlayedHistory, storePreservePlayerDetails

// export let storeSettings = {
//   subscribe: settings.subscribe,
//   updateSettings: newSettings => {
//     settings.set(newSettings);
//   }
// };

// export let storeState = {
//   subscribe: state.subscribe,
//   set: newState => {
//     state.set(newState);
//     localStorage.setItem("storeState", JSON.stringify(newState));
//     // localStorage.setItem('storeState', JSON.stringify(newState))
//   }
// };

// export let storePlayers = {
//   subscribe: players.subscribe
// };

// export let storeDirectionArrays = {
//   subscribe: directionArrays.subscribe
// };

// export let storeGameInProgress = {
//   subscribe: gameInProgress.subscribe
// };

// export let storeCurrentPlayer = {
//   subscribe: currentPlayer.subscribe
// };

// export let storePreservePlayerDetails = {
//   subscribe: preservePlayerDetails.subscribe
// };

// export let storeMovesPlayedHistory = {
//   subscribe: movesPlayedHistory.subscribe
// };
