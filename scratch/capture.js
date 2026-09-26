const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  
  await page.setViewport({ width: 1440, height: 900 });

  console.log('Capturing homepage...');
  await page.goto('http://localhost:3008', { waitUntil: 'networkidle2' });
  await page.screenshot({ path: 'public/docs/home-screenshot.png' });

  console.log('Capturing developer page...');
  await page.goto('http://localhost:3008/developer', { waitUntil: 'networkidle2' });
  await page.screenshot({ path: 'public/docs/dev-screenshot.png' });

  console.log('Capturing auditor page...');
  await page.goto('http://localhost:3008/auditor', { waitUntil: 'networkidle2' });
  await page.screenshot({ path: 'public/docs/auditor-screenshot.png' });

  await browser.close();
  console.log('Done!');
})();
