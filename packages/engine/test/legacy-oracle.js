// Test oracle: the legacy Sapper app's line building and scoring, kept as close to verbatim as
// possible. Sources: legacy/src/components/GameBoard.svelte (makeLinesFrom, makeLineFrom,
// nextCellFrom) and legacy/src/components/CountPoints.svelte (score,
// getPlayerFromCellInGameHistory).
//
// Adaptations, and nothing else:
// - `settings` and `gameHistoryFlat` are parameters instead of stores and localStorage.
// - console logging and commented-out code are removed.
// - makeLinesFrom returns the lines object instead of writing stores.

export function legacyLines(settings) {
	const lines = { leftToRight: [], topToBottom: [], diagonalDownLeft: [], diagonalDownRight: [] };

	function nextCellFrom(row, column, rowChange, columnChange, line) {
		let id = `R${row}C${column}`;
		line = [...line, { id: id, row: row, column: column, player: { id: null, name: 'none' } }];
		let nextRow = row + rowChange;
		let nextColumn = column + columnChange;
		let nextCell = { row: nextRow, column: nextColumn, player: { id: null, name: 'none' } };

		if (nextRow >= settings.rows) {
			return line;
		}
		if (nextColumn >= settings.columns || nextColumn < 0) {
			return line;
		}

		nextCell = nextCellFrom(nextRow, nextColumn, rowChange, columnChange, line);
		return nextCell;
	}

	function makeLineFrom(start, pattern) {
		let line = [];
		let nextLine = nextCellFrom(start.row, start.column, pattern.row, pattern.column, line);
		return nextLine;
	}

	function makeLinesFrom(dir) {
		let rows = settings.rows;
		let columns = settings.columns;
		let start,
			pattern = {};
		let theseLines = [],
			newLine = [];

		if (dir == 1) {
			start = { row: 0, column: 0 };
			pattern = { row: 0, column: +1 };
			for (let i = 0; i < rows; i++) {
				newLine = makeLineFrom(start, pattern);
				start.row++;
				theseLines.push(newLine);
			}
			lines.leftToRight = theseLines;
		}
		if (dir == 2) {
			start = { row: 0, column: 0 };
			pattern = { row: +1, column: 0 };
			for (let i = 0; i < columns; i++) {
				newLine = makeLineFrom(start, pattern);
				start.column++;
				theseLines.push(newLine);
			}
			lines.topToBottom = theseLines;
		}
		if (dir == 3) {
			start = { row: rows, column: 0 };
			pattern = { row: +1, column: +1 };
			for (let i = 0; i < rows; i++) {
				start.row--;
				newLine = makeLineFrom(start, pattern);
				theseLines.push(newLine);
			}
			start = { row: 0, column: 1 };
			pattern = { row: +1, column: +1 };
			for (let i = 1; i < columns; i++) {
				newLine = makeLineFrom(start, pattern);
				start.column++;
				theseLines.push(newLine);
			}
			lines.diagonalDownRight = theseLines;
		}
		if (dir == 4) {
			start = { row: rows, column: columns - 1 };
			pattern = { row: +1, column: -1 };
			for (let i = 0; i < rows; i++) {
				start.row--;
				newLine = makeLineFrom(start, pattern);
				theseLines.push(newLine);
			}
			start = { row: 0, column: columns - 1 };
			pattern = { row: +1, column: -1 };
			for (let i = 1; i < columns; i++) {
				start.column--;
				newLine = makeLineFrom(start, pattern);
				theseLines.push(newLine);
			}
			lines.diagonalDownLeft = theseLines;
		}
	}

	for (let i = 1; i <= 4; i++) makeLinesFrom(i);
	return lines;
}

function getPlayerFromCellInGameHistory(gh, id) {
	let payload;
	let len = gh.length;
	for (let i = 0; i < len; i++) {
		let move = gh[i];
		if (move.id == id) {
			payload = move.player;
		}
	}
	return payload;
}

function score(settings, direction, player, gameHistoryFlat) {
	let dirScore = 0;
	let dirPoints = 0;
	let dirBonus = 0;

	direction.lines.forEach((line) => {
		let countInLoop = 0;
		let points = 0;
		let bonusPoints = 0;

		let rows = settings.rows;
		let columns = settings.columns;
		let bonusForCompleteLine = settings.bonusForCompleteLine;
		let longerDimension = rows > columns ? rows : columns;
		let shorterDimension = rows < columns ? rows : columns;
		let len = line.length;
		let lineBonus = bonusForCompleteLine;
		if (len >= longerDimension) {
			lineBonus = bonusForCompleteLine;
		} else if (len >= shorterDimension) {
			lineBonus = Math.ceil(bonusForCompleteLine / (longerDimension / shorterDimension));
		} else {
			lineBonus = 0;
		}
		line.forEach((move) => {
			let p = move.player;
			if (gameHistoryFlat) {
				p = getPlayerFromCellInGameHistory(gameHistoryFlat, move.id);
			}

			if (p) {
				if (p.name !== 'none' && p.id === player.id) {
					countInLoop++;
				}
				if (p.id !== player.id) {
					lineBonus = 0;
					if (countInLoop >= settings.cellsToScore) {
						points += countInLoop - (settings.cellsToScore - 1);
					}
					countInLoop = 0;
				}
			} else {
				lineBonus = 0;
				if (countInLoop >= settings.cellsToScore) {
					points += countInLoop - (settings.cellsToScore - 1);
				}
				countInLoop = 0;
			}
		});
		if (countInLoop >= settings.cellsToScore) {
			points += countInLoop - (settings.cellsToScore - 1);
		}

		dirPoints += points;
		bonusPoints += lineBonus;
		dirScore += points + lineBonus;
		dirBonus += bonusPoints;
	});

	return { points: dirPoints, bonus: dirBonus };
}

/** Legacy scores for a board of owners (-1 empty), in the legacy direction order. */
export function legacyScores(owners, rows, columns, players, cellsToScore, bonusForCompleteLine) {
	const settings = { rows, columns, cellsToScore, bonusForCompleteLine };
	const lines = legacyLines(settings);
	const gameHistoryFlat = [];
	owners.forEach((o, i) => {
		if (o >= 0) {
			const id = `R${Math.floor(i / columns)}C${i % columns}`;
			gameHistoryFlat.push({ id, player: { id: o, name: `Player ${o + 1}` } });
		}
	});
	const names = ['leftToRight', 'topToBottom', 'diagonalDownLeft', 'diagonalDownRight'];
	return Array.from({ length: players }, (_, id) =>
		names.map((name) => score(settings, { name, lines: lines[name] }, { id }, gameHistoryFlat))
	);
}
