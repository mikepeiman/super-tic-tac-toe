import { expect, test } from '@playwright/test';
import { cell, movesPlayed, playEmpty, startGame } from './helpers.ts';

test.beforeEach(async ({ page }) => {
	await page.goto('./');
	await page.evaluate(() => localStorage.clear());
});

test('plays a whole Warm-up game and tallies at the end without a reload', async ({ page }) => {
	await startGame(page, { preset: 'Warm-up' });
	// 6 x 6, 2 players, 2 moves: 17 turns are played, the 18th is forced.
	await playEmpty(page, 34);
	await expect(page.getByText('Game over').first()).toBeVisible();
	const results = page.getByRole('dialog', { name: 'Game over' });
	await expect(results).toBeVisible({ timeout: 10_000 });
	// The exact scores are covered by the engine's oracle tests; here the board is full and the
	// standings are revealed.
	await expect(page.locator('.cell.empty')).toHaveCount(0);
	await expect(results.getByRole('row')).toHaveCount(3);
	await expect(results.getByRole('button', { name: 'Rematch' })).toBeVisible();
	await expect(page.getByText('?')).toHaveCount(0);
});

test('confirm-turn mode: take back, End turn, and resume pending marks after reload', async ({
	page
}) => {
	await startGame(page, { preset: 'Classic', autoEndTurn: false });
	const endTurn = page.getByRole('button', { name: 'End turn' });
	await cell(page, 0).click();
	await cell(page, 1).click();
	await cell(page, 2).click();
	await cell(page, 3).click();
	await expect(endTurn).toBeEnabled();
	await expect(page.locator('.cell.pending')).toHaveCount(4);

	// Take back by tapping a pending mark, then place it elsewhere.
	await cell(page, 1).click();
	await expect(page.locator('.cell.pending')).toHaveCount(3);
	await expect(endTurn).toBeDisabled();
	await cell(page, 13).click();

	await page.reload();
	await expect(page.locator('.cell.pending')).toHaveCount(4);
	await expect(page.getByTestId('moves-left')).toHaveText('0');

	await page.getByRole('button', { name: 'End turn' }).click();
	await expect(page.locator('.cell.pending')).toHaveCount(0);
	await expect(page.locator('.who')).toContainText('Player 2');
	// Locked marks cannot be taken back.
	await cell(page, 0).click();
	await expect(cell(page, 0)).toHaveAttribute('aria-label', /locked/);
	await expect(movesPlayed(page)).toHaveText('4');
});

test('hides scores until Tally when live score is off', async ({ page }) => {
	await startGame(page, { preset: 'Warm-up', liveScore: false });
	await cell(page, 0).click();
	await cell(page, 1).click();
	await cell(page, 6).click();
	await cell(page, 7).click();
	await cell(page, 2).click();
	const firstTotal = page.locator('.card .total').first();
	await expect(firstTotal).toHaveText('?');
	await page.getByRole('button', { name: 'Tally scores' }).click();
	// Player 1 has 0,1,2 in a row: 1 point.
	await expect(firstTotal).toHaveText('1');
});

test('shows scores live when live score is on', async ({ page }) => {
	await startGame(page, { preset: 'Warm-up', liveScore: true });
	await expect(page.getByRole('button', { name: 'Tally scores' })).toHaveCount(0);
	for (const i of [0, 1, 6, 7]) await cell(page, i).click();
	await cell(page, 2).click();
	await expect(page.locator('.card .total').first()).toHaveText('1');
});

test('plays from the keyboard', async ({ page }) => {
	await startGame(page, { preset: 'Warm-up' });
	await cell(page, 0).focus();
	await page.keyboard.press('ArrowRight');
	await page.keyboard.press('ArrowDown');
	await page.keyboard.press('Enter');
	await expect(cell(page, 7)).toHaveAttribute('aria-label', /Player 1.*pending/);
	await page.keyboard.press('ArrowRight');
	await page.keyboard.press('Space');
	await expect(cell(page, 8)).toHaveAttribute('aria-label', /Player 1.*locked/);
	await expect(page.locator('.who')).toContainText('Player 2');
	await page.keyboard.press('ArrowDown');
	await page.keyboard.press('Enter');
	await page.keyboard.press('Backspace');
	await expect(cell(page, 14)).toHaveAttribute('aria-label', /empty/);
});

test('rematch rotates who moves first', async ({ page }) => {
	await startGame(page, { preset: 'Warm-up' });
	await playEmpty(page, 34);
	await page
		.getByRole('dialog', { name: 'Game over' })
		.getByRole('button', { name: 'Rematch' })
		.click();
	await expect(page.locator('.cell.empty')).toHaveCount(36);
	await expect(page.locator('.who')).toContainText('Player 2');
});

test('edits a player name and mark mid-game', async ({ page }) => {
	await startGame(page, { preset: 'Warm-up' });
	await cell(page, 0).click();
	await page.getByRole('button', { name: 'Edit Player 1' }).click();
	const dialog = page.getByRole('dialog', { name: 'Edit player' });
	await dialog.getByLabel('Name').fill('Mike');
	await dialog.getByRole('radio', { name: '🐙' }).click();
	await dialog.getByRole('button', { name: 'Save player' }).click();
	await expect(page.locator('.who')).toContainText('Mike');
	await expect(cell(page, 0)).toHaveAttribute('aria-label', /Mike 🐙/);
});
