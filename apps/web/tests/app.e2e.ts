import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import { cell, playEmpty, startGame } from './helpers.ts';

test.beforeEach(async ({ page }) => {
	await page.goto('./');
	await page.evaluate(() => localStorage.clear());
});

test('a solo game against the computer plays to the end', async ({ page }) => {
	await startGame(page, { preset: 'Blitz', solo: true });
	const seats = page.locator('.card');
	await expect(seats.nth(1)).toContainText('Bot');
	// Human turns: 5 clicks each; the bot answers on its own. 4 rounds, the last turn forced.
	for (let turn = 0; turn < 4; turn++) {
		await expect(page.locator('.who')).toContainText('Player 1', { timeout: 15_000 });
		await playEmpty(page, 5);
	}
	await expect(page.getByRole('dialog', { name: 'Game over' })).toBeVisible({ timeout: 20_000 });
	await expect(page.locator('.cell.empty')).toHaveCount(0);
});

test('saves to file, lists history, and loads a game from file', async ({ page }) => {
	await startGame(page, { preset: 'Warm-up' });
	await playEmpty(page, 34);
	const results = page.getByRole('dialog', { name: 'Game over' });
	const download = page.waitForEvent('download');
	await results.getByRole('button', { name: 'Save to file' }).click();
	const file = await download;
	expect(file.suggestedFilename()).toMatch(/\.sttt\.json$/);
	const path = await file.path();

	await page.goto('./');
	await expect(page.getByRole('heading', { name: 'Your games' })).toBeVisible();
	await expect(page.getByRole('button', { name: 'View' })).toHaveCount(1);

	// A game in progress, then load the saved file over it.
	await startGame(page, { preset: 'Classic' });
	await cell(page, 0).click();
	await page.goto('./');
	await expect(page.getByRole('link', { name: /Continue game/ })).toBeVisible();
	await page.locator('input[type=file]').setInputFiles(path);
	const confirm = page.getByRole('dialog', { name: 'Replace the game in progress?' });
	await confirm.getByRole('button', { name: 'Replace and open' }).click();
	await expect(page).toHaveURL(/\/play$/);
	await expect(page.locator('.cell')).toHaveCount(36);
	await expect(page.locator('.cell.empty')).toHaveCount(0);
	await expect(page.getByRole('dialog', { name: 'Game over' })).toBeVisible();
});

test('rejects a file that is not a saved game', async ({ page }) => {
	await page.locator('input[type=file]').setInputFiles({
		name: 'nope.sttt.json',
		mimeType: 'application/json',
		buffer: Buffer.from('{"version":1,"turns":"lots"}')
	});
	await expect(page.getByRole('alert')).toHaveText(/not a saved game|incomplete/);
});

test('custom setup keeps the game fair', async ({ page }) => {
	await page.goto('setup');
	await page.getByRole('radio', { name: /Custom/ }).click();
	const rows = page.getByRole('spinbutton', { name: 'Rows' });
	const cols = page.getByRole('spinbutton', { name: 'Columns' });
	await page.getByRole('button', { name: 'Add a player' }).click(); // 3 players
	await rows.fill('7');
	await rows.press('Tab');
	await cols.fill('7');
	await cols.press('Tab');
	// 7 x 7 = 49 does not divide by 3; a side steps to the nearest fair value.
	const r = Number(await rows.inputValue());
	const c = Number(await cols.inputValue());
	expect((r * c) % 3).toBe(0);
	await page.getByRole('radio', { name: 'Pace first' }).click();
	await expect(
		page.getByRole('radiogroup', { name: 'Board shape' }).getByRole('radio').first()
	).toBeVisible();
	await page.getByRole('button', { name: 'Start game' }).click();
	await expect(page.getByRole('grid')).toBeVisible();
});

for (const path of ['./', 'setup', 'learn']) {
	test(`has no detectable accessibility violations: ${path}`, async ({ page }) => {
		await page.goto(path);
		const results = await new AxeBuilder({ page }).analyze();
		expect(results.violations.map((v) => `${v.id}: ${v.nodes.length}`)).toEqual([]);
	});
}

test('has no detectable accessibility violations: game screen', async ({ page }) => {
	await startGame(page, { preset: 'Classic', autoEndTurn: false });
	await cell(page, 0).click();
	await cell(page, 13).click();
	const results = await new AxeBuilder({ page }).analyze();
	expect(results.violations.map((v) => `${v.id}: ${v.nodes.length}`)).toEqual([]);
});

test('works offline once installed', async ({ page, context }) => {
	await page.goto('./');
	await page.evaluate(async () => {
		const reg = await navigator.serviceWorker.ready;
		return reg.active?.state;
	});
	await page.reload();
	await context.setOffline(true);
	await startGame(page, { preset: 'Warm-up' });
	await cell(page, 0).click();
	await page.goto('learn');
	await expect(page.getByRole('heading', { name: 'How to play' })).toBeVisible();
	await context.setOffline(false);
});

test('fits the phone screen without sideways scrolling @phone', async ({ page }) => {
	await startGame(page, { preset: 'Party' });
	const overflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
	expect(overflow).toBeLessThanOrEqual(0);
	await expect(page.getByRole('button', { name: 'Take back' })).toBeInViewport();
	await cell(page, 0).tap();
	await expect(cell(page, 0)).toHaveAttribute('aria-label', /pending/);
});
