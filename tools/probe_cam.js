const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const OUT = path.join(__dirname, 'shots', 'cam');

const views = [
	['c1', '0.9,1.15,4.3', '-0.9,0.65,0.2'],
	['c2', '1.1,1.3,3.6', '-1.3,0.55,0'],
	['c3', '0.5,1.2,3.9', '-0.6,0.6,-0.6'],
	['c4', '1.3,1.05,3.2', '-1.5,0.7,0.6']
];

(async () => {
	fs.mkdirSync(OUT, { recursive: true });
	const browser = await puppeteer.launch({ executablePath: EDGE, headless: 'new', args: ['--use-gl=angle'] });
	const page = await browser.newPage();
	await page.setViewport({ width: 1200, height: 750 });
	for (const [name, cam, tgt] of views) {
		await page.goto(`http://localhost:8642/index.html?cam=${cam}&tgt=${tgt}`, { waitUntil: 'networkidle2' });
		await new Promise((r) => setTimeout(r, 2500));
		// hide the carousel so we see the room clearly
		await page.evaluate(() => {
			document.querySelector('.carousel-zone').style.display = 'none';
			document.querySelector('.carousel-indicators').style.display = 'none';
		});
		await new Promise((r) => setTimeout(r, 400));
		await page.screenshot({ path: path.join(OUT, `${name}.png`) });
		console.log(name, 'done');
	}
	await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
