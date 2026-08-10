const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const client = await page.target().createCDPSession();
  
  console.log('Navigating to http://localhost:3000...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
  
  await client.send('Profiler.enable');
  await client.send('Profiler.start');
  
  console.log('Scrolling...');
  for (let i = 0; i < 100; i++) {
    await page.evaluate(() => { window.scrollBy(0, 500); });
    await new Promise(r => setTimeout(r, 100));
  }
  
  const { profile } = await client.send('Profiler.stop');
  await client.send('Profiler.disable');
  await browser.close();
  
  const selfTimes = {};
  
  for (const node of profile.nodes) {
    let fnName = node.callFrame.functionName || '(anonymous)';
    if (!fnName) fnName = '(anonymous)';
    const url = node.callFrame.url;
    // Skip some internals if we want, but let's see them all.
    const key = `${fnName} - ${url}`;
    if (!selfTimes[key]) selfTimes[key] = 0;
    selfTimes[key] += node.hitCount || 0;
  }
  
  const sorted = Object.entries(selfTimes).sort((a, b) => b[1] - a[1]);
  console.log('Top CPU Consumers (by hit count, self time):');
  sorted.slice(0, 30).forEach(([name, hits]) => {
    if (hits > 0) console.log(`${name}: ${hits} hits`);
  });
})();
