<script lang="ts">
	import { resolve } from '$app/paths';
	import MiniBoard from '#lib/components/MiniBoard.svelte';
</script>

<svelte:head>
	<title>How to play · Super Tic-Tac-Toe</title>
</svelte:head>

<main class="learn">
	<a class="btn ghost" href={resolve('/')}>← Home</a>
	<h1>How to play</h1>
	<p class="lead">
		Take turns placing marks until every square is filled. Then every run of marks in a row scores,
		and so does every line you own from edge to edge. Most points wins.
	</p>

	<section>
		<h2>Your turn</h2>
		<ul>
			<li>Place your marks anywhere: as many as the game's <em>moves per turn</em>.</li>
			<li>Tap one of this turn's marks to take it back. Marks from earlier turns are locked.</li>
			<li>
				The turn ends on your last mark, or when you press <strong>End turn</strong> if the game asks
				you to confirm.
			</li>
			<li>
				Every player gets exactly the same number of moves. When one turn is left, its squares are
				filled automatically.
			</li>
		</ul>
	</section>

	<section>
		<h2>Runs score points</h2>
		<p>
			With 3 to score, a run of 3 of your marks in a line earns 1 point, a run of 4 earns 2, and a
			run of 5 earns 3: one point for every 3 in a row inside the run. Runs count across, down and
			along both diagonals.
		</p>
		<MiniBoard
			rows={['AAAAABAAAB']}
			outline={[0, 1, 2, 3, 4, 6, 7, 8]}
			outlineColor="var(--dir-h)"
			label="A row of ten: a run of five fire marks scores 3 points and a run of three scores 1."
		/>
		<p class="caption">🔥 scores 3 + 1 = 4 points in this row. 🦄 scores nothing here.</p>
	</section>

	<section>
		<h2>Blocks against lines</h2>
		<p>
			Every mark counts in four directions at once, so tight blocks score well: this 3 × 3 block
			makes 8 points from 9 marks. Long straight lines can win a line bonus instead.
		</p>
		<MiniBoard
			rows={['AAA..', 'AAA.B', 'AAA..', '..B..']}
			outline={[0, 1, 2, 5, 6, 7, 10, 11, 12]}
			outlineColor="var(--dir-v)"
			label="A three by three block of fire marks."
		/>
		<p class="caption">3 across + 3 down + 1 + 1 diagonal = 8 points.</p>
	</section>

	<section>
		<h2>Line bonus</h2>
		<p>
			Own every square of a line and you earn a bonus on top of its run points. A line as long as
			the board's longer side gets the full bonus. On a rectangular board, lines as long as the
			shorter side (columns, and the longest diagonals) get a partial bonus: the full bonus divided
			by how many times longer the long side is, rounded up.
		</p>
		<MiniBoard
			rows={['AAAAAAAA', 'ABBBBBBA', 'ABBBBBBA', 'ABBBBBBA']}
			outline={[0, 1, 2, 3, 4, 5, 6, 7, 8, 16, 24, 15, 23, 31]}
			label="A four by eight board. Fire owns the whole top row and both end columns."
		/>
		<p class="caption">
			With a bonus of 8 on this 4 × 8 board, the top row earns 8 and each end column earns 8 ÷ 2 =
			4.
		</p>
	</section>

	<section>
		<h2>Strategy</h2>
		<ul>
			<li>Fewer marks to score favours blocks; more marks to score favours long lines.</li>
			<li>
				With several moves a turn you can build and block in the same turn. One mark can split a
				rival's run of 6 into two short ones.
			</li>
			<li>
				A bonus is all or nothing, so long lines are easy targets. Defend them or bait with them.
			</li>
			<li>Centre squares sit on the longest diagonals; corners sit on the shortest.</li>
		</ul>
	</section>

	<section>
		<h2>Keyboard</h2>
		<dl class="keys">
			<dt><kbd>Arrow keys</kbd></dt>
			<dd>Move around the board</dd>
			<dt><kbd>Enter</kbd> / <kbd>Space</kbd></dt>
			<dd>Place a mark, or take back this turn's mark</dd>
			<dt><kbd>Backspace</kbd></dt>
			<dd>Take back your last mark</dd>
			<dt><kbd>E</kbd></dt>
			<dd>End turn (when the game asks you to confirm)</dd>
			<dt><kbd>T</kbd></dt>
			<dd>Tally scores</dd>
		</dl>
	</section>

	<a class="btn primary" href={resolve('/setup')}>Start a game</a>
</main>

<style>
	.learn {
		max-width: 760px;
		margin: 0 auto;
		padding: var(--space-4) var(--space-4) var(--space-5);
	}
	h1 {
		margin: var(--space-3) 0 var(--space-2);
		font-size: 30px;
	}
	.lead {
		font-size: 17px;
		color: var(--fg-muted);
	}
	section {
		margin: var(--space-5) 0;
	}
	h2 {
		margin-bottom: var(--space-2);
		font-size: 20px;
	}
	li + li {
		margin-top: var(--space-1);
	}
	.caption {
		color: var(--fg-muted);
		font-size: 14px;
	}
	.keys {
		display: grid;
		grid-template-columns: auto 1fr;
		gap: var(--space-2) var(--space-4);
		dd {
			margin: 0;
		}
	}
	kbd {
		padding: 1px 6px;
		border: 1px solid var(--border);
		border-bottom-width: 2px;
		border-radius: 4px;
		background: var(--surface);
		font-family: inherit;
		font-size: 13px;
	}
</style>
