#!/usr/bin/env node
// Loads each generator's desmosSolutions into a real Desmos calculator (headless Chrome) and reports
// expressions that Desmos flags as errors (bad LaTeX, undefined variables, etc.).
//
//   node tests/check-desmos.js                  check every category (3 questions each)
//   node tests/check-desmos.js --only id1,id2   check only these category ids
//   node tests/check-desmos.js --runs 5         questions per category
//
// Needs Google Chrome and an internet connection (the Desmos API is loaded from desmos.com).

const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawn } = require('child_process');

const ROOT = path.join(__dirname, '..');
const CHROME = process.env.CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

const argv = process.argv.slice(2);
const opt = (name, fallback) => { const i = argv.indexOf(name); return i >= 0 ? argv[i + 1] : fallback; };
const only = opt('--only', '');
const runs = parseInt(opt('--runs', '3'), 10);

const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
const desmosScript = html.match(/<script src="(https:\/\/www\.desmos\.com\/api\/[^"]+)"><\/script>/)[1];
const localScripts = [...html.matchAll(/<script src="((?:js|categories)\/[^"]+\.js)"><\/script>/g)].map(m => m[1]);

const page = `<!doctype html><html><head><meta charset="utf-8">
<script src="${desmosScript}"></script>
${localScripts.map(s => `<script src="${path.join(ROOT, s)}"></script>`).join('\n')}
</head><body><div id="calc" style="width:600px;height:400px"></div><pre id="results">pending</pre>
<script>
(async () => {
  const only = ${JSON.stringify(only ? only.split(',') : [])};
  const calculator = Desmos.GraphingCalculator(document.getElementById('calc'));
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const results = [];
  for (const cat of CATEGORIES) {
    if (only.length && !only.includes(cat.id)) continue;
    const problems = [];
    for (let i = 0; i < ${runs}; i++) {
      let q;
      try { q = cat.questionGenerator(); } catch (e) { problems.push('generator threw: ' + e.message); break; }
      if (!q.desmosSolutions) continue;
      calculator.setBlank();
      calculator.updateSettings({ degreeMode: !!cat.degreeMode });
      try { calculator.setExpressions(q.desmosSolutions); } catch (e) { problems.push('setExpressions threw: ' + e.message); continue; }
      await sleep(400);
      const exprs = calculator.getExpressions();
      const analysis = calculator.expressionAnalysis || {};
      for (const e of exprs) {
        const a = analysis[e.id];
        if (a && a.isError) problems.push(e.latex + '  →  ' + a.errorMessage);
      }
    }
    results.push({ id: cat.id, group: cat.group, problems: [...new Set(problems)] });
  }
  document.getElementById('results').textContent = 'RESULTS:' + JSON.stringify(results);
})().catch(e => { document.getElementById('results').textContent = 'CRASH:' + e.stack; });
</script></body></html>`;

// Opens the page in headless Chrome and polls #results over the DevTools protocol until the run finishes.
async function runInChrome(pagePath, tmpDir) {
    const port = 9300 + Math.floor(Math.random() * 600);
    const chrome = spawn(CHROME, [
        '--headless=new', '--disable-gpu', '--allow-file-access-from-files', `--user-data-dir=${tmpDir}/profile`,
        `--remote-debugging-port=${port}`, `file://${pagePath}`,
    ], { stdio: 'ignore' });
    const sleep = ms => new Promise(r => setTimeout(r, ms));
    try {
        let target;
        for (let i = 0; i < 50 && !target; i++) {
            await sleep(200);
            try { target = (await (await fetch(`http://127.0.0.1:${port}/json`)).json()).find(t => t.type === 'page'); } catch {}
        }
        if (!target) throw new Error('could not connect to headless Chrome');
        const ws = new WebSocket(target.webSocketDebuggerUrl);
        await new Promise((resolve, reject) => { ws.onopen = resolve; ws.onerror = reject; });
        let nextId = 1;
        const pending = new Map();
        ws.onmessage = e => { const m = JSON.parse(e.data); if (pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); } };
        const evaluate = expression => new Promise(resolve => {
            const id = nextId++;
            pending.set(id, resolve);
            ws.send(JSON.stringify({ id, method: 'Runtime.evaluate', params: { expression, returnByValue: true } }));
        });
        const deadline = Date.now() + 15 * 60 * 1000;
        while (Date.now() < deadline) {
            await sleep(1000);
            const m = await evaluate("(document.getElementById('results') || {}).textContent || ''");
            const text = (m.result && m.result.result && m.result.result.value) || '';
            if (text.startsWith('RESULTS:') || text.startsWith('CRASH:')) { ws.close(); return text; }
        }
        throw new Error('timed out after 15 minutes');
    } finally {
        chrome.kill();
    }
}

(async () => {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'desmos-check-'));
    const pagePath = path.join(tmpDir, 'check.html');
    fs.writeFileSync(pagePath, page);
    let text;
    try {
        text = await runInChrome(pagePath, tmpDir);
    } catch (e) {
        console.log(`Desmos check did not finish: ${e.message}`);
        process.exit(2);
    } finally {
        setTimeout(() => fs.rmSync(tmpDir, { recursive: true, force: true }), 500);
    }
    if (!text.startsWith('RESULTS:')) {
        console.log(`Desmos check crashed: ${text.slice(0, 2000)}`);
        process.exit(2);
    }
    const results = JSON.parse(text.slice('RESULTS:'.length));
    let failed = 0;
    for (const r of results) {
        if (!r.problems.length) continue;
        failed++;
        console.log(`[DESMOS] ${r.group} › ${r.id}`);
        r.problems.slice(0, 6).forEach(p => console.log(`    ${p}`));
    }
    console.log(`\nDesmos-checked ${results.length} categories × ${runs} questions: ${failed ? `${failed} with Desmos errors` : 'no Desmos errors'}`);
    setTimeout(() => process.exit(failed ? 1 : 0), 600);
})();
