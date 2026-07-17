/* Screenshot the local site with Edge for visual verification. */
const puppeteer = require('puppeteer-core');
const path = require('path');

const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const BASE = 'http://localhost:8642';
const OUT = path.join(__dirname, 'shots');

const targets = process.argv.slice(2);
const pages = targets.length ? targets : [
	'index.html', 'fallen-fate.html', 'political-party-animal.html',
	'art-fight.html', 'au-bon-cake.html', 'personal-3d.html'
];

(async () => {
	const fs = require('fs');
	fs.mkdirSync(OUT, { recursive: true });
	const browser = await puppeteer.launch({
		executablePath: EDGE,
		headless: 'new',
		args: ['--force-device-scale-factor=1', '--use-gl=angle']
	});
	const page = await browser.newPage();
	await page.setViewport({ width: 1440, height: 900 });

	for (const p of pages) {
		const errors = [];
		page.removeAllListeners('console');
		page.removeAllListeners('pageerror');
		page.on('pageerror', (e) => errors.push('PAGEERROR: ' + e.message));
		page.on('console', (m) => {
			if (m.type() === 'error' || m.type() === 'warning') errors.push(m.type().toUpperCase() + ': ' + m.text());
		});

		await page.goto(`${BASE}/${p}`, { waitUntil: 'networkidle2', timeout: 60000 });
		await new Promise((r) => setTimeout(r, 3500));
		const name = p.replace('.html', '');
		await page.screenshot({ path: path.join(OUT, `${name}-top.png`) });
		// mid-page shot
		await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight * 0.45));
		await new Promise((r) => setTimeout(r, 1200));
		await page.screenshot({ path: path.join(OUT, `${name}-mid.png`) });
		// bottom
		await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
		await new Promise((r) => setTimeout(r, 1200));
		await page.screenshot({ path: path.join(OUT, `${name}-bottom.png`) });
		console.log(`${p}: OK${errors.length ? '\n  ' + errors.join('\n  ') : ''}`);
	}

	await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
