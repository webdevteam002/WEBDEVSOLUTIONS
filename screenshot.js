const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });
  
  console.log('Navigating...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
  console.log('Waiting for render...');
  await new Promise(r => setTimeout(r, 4000));
  
  console.log(`Saving screenshot to ${process.argv[2]}`);
  await page.screenshot({ path: process.argv[2] });
  
  await browser.close();
  console.log('Done.');
})();
