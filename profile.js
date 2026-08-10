const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  console.log('Starting puppeteer...');
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  await page.setViewport({ width: 1920, height: 1080 });
  
  console.log('Navigating to http://localhost:3000...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
  
  console.log('Starting trace...');
  await page.tracing.start({ path: 'trace.json', screenshots: false });
  
  console.log('Scrolling down...');
  for (let i = 0; i < 40; i++) {
    await page.evaluate(() => {
      window.scrollBy(0, window.innerHeight / 2);
    });
    await new Promise(r => setTimeout(r, 200));
  }
  
  console.log('Stopping trace...');
  await page.tracing.stop();
  
  await browser.close();
  console.log('Trace saved to trace.json');
})();
