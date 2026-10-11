// Renders static/icon.svg to the PNG sizes the manifest and iOS need.
// Run with: node scripts/render-icons.mjs (requires the Playwright Chromium browser).
import { readFile } from 'node:fs/promises';
import { chromium } from '@playwright/test';

const svg = await readFile(new URL('../static/icon.svg', import.meta.url), 'utf8');
const browser = await chromium.launch();
for (const size of [192, 512]) {
	const page = await browser.newPage({ viewport: { width: size, height: size } });
	await page.setContent(
		`<style>html,body{margin:0}svg{display:block;width:${size}px;height:${size}px}</style>${svg}`
	);
	await page.screenshot({
		path: new URL(`../static/icon-${size}.png`, import.meta.url).pathname.replace(/^\/(\w:)/, '$1'),
		omitBackground: true
	});
	await page.close();
}
await browser.close();
