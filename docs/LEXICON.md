# Lexicon

Accepted domain terms for Super Tic-Tac-Toe. Definitions follow
[the GDD](GDD.md); aliases list names used by the legacy Sapper code in `src/`.

| Term | Meaning | Aliases |
| --- | --- | --- |
| Cell | One square of the board. | square, game-square |
| Mark | A player's emoji placed in a cell. | tick, ticked cell |
| Move | Placing one mark. | |
| Turn | One player's consecutive moves, `movesPerTurn` of them. | turnHistory (the open turn) |
| Round | Every player taking one turn once. | roundsPerGame |
| Pending mark | A mark placed this turn that can still be taken back. | unlocked |
| Locked mark | A mark from a finished turn; never removable. | locked |
| Take back | Removing one of your pending marks. | untick |
| End turn | Committing pending marks and passing play on. | playerChange |
| Final turn | The last turn, filled automatically because it has no choice. | tickFinalTurnMoves, autofill |
| N (cells to score) | Run length that earns the first point. | cellsToScore |
| Run | Consecutive cells in one line owned by one player. | countInLoop |
| Run points | `max(0, k − N + 1)` for a run of length k. | points |
| Line | A full row, column or diagonal, edge to edge. | |
| Line bonus | Points for owning every cell of a qualifying line. | bonusForCompleteLine, lineBonus |
| Partial bonus | Bonus for lines at least as long as the shorter board side. | |
| Direction | Horizontal, vertical, diagonal down-right, diagonal down-left. | leftToRight, topToBottom, diagonalDownRight, diagonalDownLeft |
| Tally | Computing and revealing scores. | countPoints, Tally Scores |
| Live score | Room option showing scores during play. | |
| Fair configuration | Rows × columns = players × moves per turn × rounds. | viable game |
| Board first / Pace first | The two custom setup methods. | rowsAndColumns / movesAndRounds |
| Game record | Versioned config, seats and ordered turns; source of all derived state. | gameHistoryTurns, gameHistoryFlat |
| Seat | A player slot in a game, human or bot. | player |
| Room | An online game instance with a join code. | |
| Topology | Cells plus scoring lines; rectangles, hexes, tori and Tiers are topologies. | |
| Tiers | Variant with three linked flat levels, like 3D chess. | |
