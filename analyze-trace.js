const fs = require('fs');

const raw = fs.readFileSync('trace.json', 'utf8');
const traceData = JSON.parse(raw);
const events = traceData.traceEvents || traceData;

let totalScriptingTime = 0;
let totalRenderingTime = 0;
let totalPaintTime = 0;
let rAFCount = 0;
let rAFDuration = 0;

const functionTimes = {};
const eventCounts = {};

events.forEach(event => {
  eventCounts[event.name] = (eventCounts[event.name] || 0) + 1;

  if (event.ph === 'X') { // Complete events have duration (dur)
    const duration = event.dur / 1000; // milliseconds
    
    if (['EvaluateScript', 'FunctionCall', 'RunMicrotasks', 'TimerFire', 'v8.compile', 'EventDispatch'].includes(event.name)) {
      totalScriptingTime += duration;
      
      // Track specific functions if available
      if (event.args && event.args.data && event.args.data.functionName) {
        let funcName = event.args.data.functionName;
        if (event.args.data.url) {
            const urlParts = event.args.data.url.split('/');
            funcName += ' (' + urlParts[urlParts.length - 1] + ':' + event.args.data.lineNumber + ')';
        }
        functionTimes[funcName] = (functionTimes[funcName] || 0) + duration;
      }
    }
    
    if (['UpdateLayoutTree', 'Layout', 'HitTest'].includes(event.name)) {
      totalRenderingTime += duration;
    }
    
    if (['Paint', 'CompositeLayers', 'UpdateLayerTree', 'Rasterize'].includes(event.name)) {
      totalPaintTime += duration;
    }
    
    if (event.name === 'FireAnimationFrame') {
      rAFCount++;
      rAFDuration += duration;
    }
  }
});

const topFunctions = Object.entries(functionTimes)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 15);

console.log('--- Trace Analysis ---');
console.log(`Total Scripting Time: ${totalScriptingTime.toFixed(2)} ms`);
console.log(`Total Rendering Time: ${totalRenderingTime.toFixed(2)} ms`);
console.log(`Total Paint/Composite Time: ${totalPaintTime.toFixed(2)} ms`);
console.log(`requestAnimationFrame fired ${rAFCount} times, total duration: ${rAFDuration.toFixed(2)} ms`);
console.log('\nTop Functions (Scripting):');
topFunctions.forEach(([name, time]) => console.log(`- ${name || 'anonymous'}: ${time.toFixed(2)} ms`));
