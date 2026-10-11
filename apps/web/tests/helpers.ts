import { expect, type Page } from '@playwright/test';

export interface SetupOptions {
	preset?: string;
	autoEndTurn?: boolean;
	liveScore?: boolean;
	solo?: boolean;
}

/** Start a game through the setup screen, as a player would. */
export async function startGame(page: Page, opts: SetupOptions = {}) {
	await page.goto(opts.solo ? 'setup?mode=solo' : 'setup');
	await page.getByRole('radio', { name: new RegExp(opts.preset ?? 'Warm-up') }).click();
	const autoEnd = page.getByRole('checkbox', { name: /End the turn on the last move/ });
	if (opts.autoEndTurn === false) await autoEnd.uncheck();
	if (opts.autoEndTurn === true) await autoEnd.check();
	const live = page.getByRole('checkbox', { name: /Live score/ });
	if (opts.liveScore === true) await live.check();
	if (opts.liveScore === false) await live.uncheck();
	await page.getByRole('button', { name: 'Start game' }).click();
	await expect(page).toHaveURL(/\/play$/);
	await expect(page.getByRole('grid')).toBeVisible();
}

export const cell = (page: Page, i: number) => page.locator(`[data-cell="${i}"]`);

/** Click the first empty cells, in reading order, n times. */
export async function playEmpty(page: Page, n: number) {
	for (let k = 0; k < n; k++) {
		await page.locator('.cell.empty').first().click();
	}
}

export const movesPlayed = (page: Page) => page.getByTestId('moves-played');
