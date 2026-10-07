#!/usr/bin/env node
// Runs every question generator many times and checks its output against the contract in categories/README.md.
//
//   node tests/check-generators.js                    check everything (exit 1 on any error)
//   node tests/check-generators.js --only id1,id2     check only these category ids
//   node tests/check-generators.js --group Algebra    check one group
//   node tests/check-generators.js --samples 3        also print 3 sample questions per checked category
//   node tests/check-generators.js --runs 500         generator calls per category (default 300)

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.join(__dirname, '..');
const ORIGINAL_GROUP = 'Desmos Techniques';
const SCRIPT_ORDER = ['js/helpers.js', ...scriptTagsFromIndex()];

function scriptTagsFromIndex() {
    const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
    return [...html.matchAll(/<script src="(categories\/[^"]+\.js)"><\/script>/g)].map(m => m[1]);
}

function parseArgs() {
    const args = { runs: 300, samples: 0, only: null, group: null };
    const argv = process.argv.slice(2);
    for (let i = 0; i < argv.length; i++) {
        const next = () => argv[++i];
        if (argv[i] === '--runs') args.runs = parseInt(next(), 10);
        else if (argv[i] === '--samples') args.samples = parseInt(next(), 10);
        else if (argv[i] === '--only') args.only = new Set(next().split(','));
        else if (argv[i] === '--group') args.group = next();
        else throw new Error(`Unknown argument ${argv[i]}`);
    }
    return args;
}

function loadCategories() {
    const context = vm.createContext({ console, Math, JSON });
    context.window = context;
    for (const rel of SCRIPT_ORDER) {
        vm.runInContext(fs.readFileSync(path.join(ROOT, rel), 'utf8'), context, { filename: rel, timeout: 5000 });
    }
    return context;
}

// Mirrors the parsing in handleCheckAnswer (index.html)
function parseAnswer(a) {
    if (typeof a === 'number') return a;
    if (typeof a !== 'string') return NaN;
    if (a.includes('/')) {
        const [n, d] = a.split('/').map(Number);
        return d ? n / d : NaN;
    }
    return a.trim() === '' ? NaN : Number(a);
}

const BAD_TEXT = /\bundefined\b|\bNaN\b|Infinity|\[object |\+ ?-|- ?-\d|\+ ?\+/;

function count(str, needle) { return str.split(needle).length - 1; }

// "a 8-inch", "a 11%", "an 5" — the article must match how the number is read aloud (an 8, an 11, an 18, an 80…, a 5)
const NUMBER_AFTER_ARTICLE = /\b([Aa]n?) (?:\\\(\s*)?(\d[\d,]*)/g;
function articleProblem(str) {
    for (const m of String(str).matchAll(NUMBER_AFTER_ARTICLE)) {
        const digits = m[2].replace(/,$/, '');
        const plain = digits.replace(/,/g, '');
        const lead2 = plain.slice(0, 2);
        // 11 and 18 take "an" when they lead a group read as "eleven"/"eighteen" (11, 11,000, 18 million…)
        const groupLen = digits.includes(',') ? digits.split(',')[0].length : plain.length % 3 || 3;
        const needsAn = plain[0] === '8' || (groupLen === 2 && (lead2 === '11' || lead2 === '18'));
        if (needsAn !== (m[1].toLowerCase() === 'an')) return `"${m[0]}" should be "${needsAn ? 'an' : 'a'} ${digits}"`;
    }
    return null;
}

function checkMath(label, str, problems) {
    if (BAD_TEXT.test(str)) problems.add(`${label} contains suspicious text: ${str.match(BAD_TEXT)[0]} … "${snippet(str)}"`);
    const article = articleProblem(str);
    if (article) problems.add(`${label} article error: ${article}`);
    if (count(str, '$$') % 2) problems.add(`${label} has unbalanced $$ delimiters: "${snippet(str)}"`);
    if (count(str, '\\(') !== count(str, '\\)')) problems.add(`${label} has unbalanced \\( \\) delimiters: "${snippet(str)}"`);
    if (count(str, '{') !== count(str, '}')) problems.add(`${label} has unbalanced braces: "${snippet(str)}"`);
    if (/(^|[^\\$])\$(?!\$)/.test(str.replace(/\$\$/g, '')) ) problems.add(`${label} uses single-$ math, which MathJax does not render here (use \\( \\) or $$ $$): "${snippet(str)}"`);
}

function snippet(s) { s = String(s).replace(/\s+/g, ' ').trim(); return s.length > 140 ? s.slice(0, 140) + '…' : s; }

function checkCategory(cat, runs, ids) {
    const errors = new Set();
    const warnings = new Set();
    const isNew = cat.group !== ORIGINAL_GROUP;

    if (!cat.id || typeof cat.id !== 'string') errors.add('missing id');
    else if (ids.has(cat.id)) errors.add(`duplicate id "${cat.id}"`);
    if (!/^\((Easy|Medium|Hard)\) \S/.test(cat.title || '')) errors.add('title must start with (Easy), (Medium) or (Hard)');
    if (!Array.isArray(cat.tips) || cat.tips.length < (isNew ? 2 : 1)) errors.add('needs at least 2 tips');
    if (typeof cat.questionGenerator !== 'function') { errors.add('missing questionGenerator'); return { errors, warnings, samples: [] }; }
    if (isNew) {
        if (!/^https?:\/\//.test(cat.source || '')) errors.add('new categories need a source URL showing where the question type comes from');
        if (!cat.skill) errors.add('new categories need a skill (official College Board skill name)');
        if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(cat.id || '')) errors.add('new category ids must be kebab-case');
    }

    const texts = new Set();
    const samples = [];
    const answerCounts = {};
    const start = Date.now();
    for (let i = 0; i < runs; i++) {
        let q;
        try {
            q = cat.questionGenerator();
        } catch (e) {
            errors.add(`generator threw: ${e.message}`);
            break;
        }
        if (Date.now() - start > 5000) { errors.add(`too slow: ${i} runs took over 5s (possible near-infinite retry loop)`); break; }
        if (!q || typeof q.questionText !== 'string' || !q.questionText.trim()) { errors.add('questionText missing or empty'); continue; }
        texts.add(q.questionText.replace(/\s+/g, ' ').trim() + JSON.stringify(q.choices || ''));
        if (samples.length < 50) samples.push(q);
        checkMath('questionText', q.questionText, errors);

        if (q.choices !== undefined && q.choices !== null) {
            if (!Array.isArray(q.choices) || q.choices.length !== 4) errors.add('choices must be an array of exactly 4 strings');
            else {
                q.choices.forEach((c, j) => {
                    if (typeof c !== 'string' || !c.trim()) errors.add(`choice ${j} is empty or not a string`);
                    else checkMath(`choice ${'ABCD'[j]}`, c, errors);
                });
                const normalized = q.choices.map(c => String(c).replace(/\s+/g, ''));
                if (new Set(normalized).size !== 4) errors.add(`duplicate choices: ${JSON.stringify(q.choices)}`);
            }
            if (!['A', 'B', 'C', 'D'].includes(q.answer)) errors.add(`multiple-choice answer must be a letter A-D, got ${JSON.stringify(q.answer)}`);
            answerCounts[q.answer] = (answerCounts[q.answer] || 0) + 1;
        } else {
            const v = parseAnswer(q.answer);
            if (!Number.isFinite(v)) errors.add(`answer must be a number or "a/b" string, got ${JSON.stringify(q.answer)}`);
            else if (isNew) {
                if (typeof q.answer === 'number' && !Number.isInteger(q.answer) && String(q.answer).split('.')[1].length > 4)
                    errors.add(`answer ${q.answer} has more than 4 decimal places; return a fraction string (fracStr) or round it`);
                if (String(q.answer).replace(/^-/, '').length > 5)
                    warnings.add(`answer "${q.answer}" is longer than the 5 characters an SAT grid-in allows`);
            }
        }

        if (isNew || q.desmosSolutions !== undefined) {
            if (!Array.isArray(q.desmosSolutions) || q.desmosSolutions.length === 0) errors.add('desmosSolutions must be a non-empty array');
            else {
                const seen = new Set();
                q.desmosSolutions.forEach(e => {
                    if (!e || typeof e !== 'object') { errors.add('desmosSolutions entries must be objects'); return; }
                    if (e.id !== undefined) {
                        if (seen.has(e.id)) errors.add(`duplicate desmosSolutions id "${e.id}"`);
                        seen.add(e.id);
                    }
                    if (e.type === 'text') { if (typeof e.text !== 'string' || !e.text.trim()) errors.add('text note without text'); else if (BAD_TEXT.test(e.text)) errors.add(`Desmos note contains suspicious text: "${snippet(e.text)}"`); else if (articleProblem(e.text)) errors.add(`Desmos note article error: ${articleProblem(e.text)}`); }
                    else if (e.type === 'table') { if (!Array.isArray(e.columns)) errors.add('table without columns'); }
                    else if (typeof e.latex !== 'string') errors.add(`desmos expression without latex: ${JSON.stringify(e)}`);
                    else if (/\bundefined\b|\bNaN\b|Infinity/.test(e.latex)) errors.add(`Desmos latex contains suspicious text: "${snippet(e.latex)}"`);
                    else if (count(e.latex, '{') !== count(e.latex, '}')) errors.add(`Desmos latex has unbalanced braces: "${snippet(e.latex)}"`);
                });
            }
        }
    }

    const minDistinct = Math.min(10, Math.floor(runs / 4));
    if (texts.size < minDistinct && isNew) errors.add(`only ${texts.size} distinct questions in ${runs} runs — needs more variety`);
    else if (texts.size < 30 && isNew) warnings.add(`only ${texts.size} distinct questions in ${runs} runs`);
    const letters = Object.keys(answerCounts);
    const mcRuns = Object.values(answerCounts).reduce((a, b) => a + b, 0);
    if (letters.length && letters.length < 4 && runs >= 100) warnings.add(`correct answer only ever lands on ${letters.sort().join(',')} — shuffle choices (makeChoices)`);
    else if (mcRuns >= 300) {
        // The SAT spreads keys evenly; flag any letter outside 15–35% (use --runs 4000 for a tighter read)
        const shares = ['A', 'B', 'C', 'D'].map(l => (answerCounts[l] || 0) / mcRuns);
        if (shares.some(x => x < 0.15 || x > 0.35)) warnings.add(`answer letters are skewed: ${shares.map((x, i) => `${'ABCD'[i]} ${Math.round(x * 100)}%`).join(', ')} — aim for 18–32% each`);
    }

    return { errors, warnings, samples, distinct: texts.size };
}

function printSample(q) {
    const strip = s => String(s).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    console.log(`    Q: ${strip(q.questionText)}`);
    if (q.choices) q.choices.forEach((c, j) => console.log(`       ${'ABCD'[j]}) ${strip(c)}`));
    console.log(`    Answer: ${q.answer}`);
    const notes = (q.desmosSolutions || []).map(e => e.type === 'text' ? `"${strip(e.text)}"` : e.latex || (e.type === 'table' ? '[table]' : '')).filter(Boolean);
    if (notes.length) console.log(`    Desmos: ${notes.join(' | ')}`);
    console.log('');
}

function main() {
    const args = parseArgs();
    const missing = fs.readdirSync(path.join(ROOT, 'categories')).filter(f => f.endsWith('.js') && !SCRIPT_ORDER.includes(`categories/${f}`));
    let failed = false;
    if (missing.length) { console.log(`ERROR: categories files not loaded by index.html: ${missing.join(', ')}`); failed = true; }

    const context = loadCategories();
    const all = context.CATEGORIES;
    const ids = new Set();
    const groupCounts = {};
    let checked = 0, warned = 0;

    for (const cat of all) {
        groupCounts[cat.group] = (groupCounts[cat.group] || 0) + 1;
        const selected = (!args.only || args.only.has(cat.id)) && (!args.group || cat.group === args.group);
        if (!selected) { ids.add(cat.id); continue; }
        const { errors, warnings, samples, distinct } = checkCategory(cat, args.runs, ids);
        ids.add(cat.id);
        checked++;
        const status = errors.size ? 'FAIL' : warnings.size ? 'WARN' : 'ok';
        if (errors.size) failed = true;
        if (warnings.size) warned++;
        if (errors.size || warnings.size || args.samples) {
            console.log(`[${status}] ${cat.group} › ${cat.id}  (${distinct ?? 0} distinct)`);
            [...errors].slice(0, 8).forEach(e => console.log(`    error: ${e}`));
            [...warnings].slice(0, 5).forEach(w => console.log(`    warn:  ${w}`));
            if (args.samples) shuffleInPlace(samples).slice(0, args.samples).forEach(printSample);
        }
    }
    if (args.only) for (const id of args.only) if (!ids.has(id)) { console.log(`ERROR: no category with id "${id}"`); failed = true; }

    console.log(`\nCategories by group: ${Object.entries(groupCounts).map(([g, n]) => `${g}: ${n}`).join(', ')}  — total ${all.length}`);
    console.log(`Checked ${checked} categories × ${args.runs} runs: ${failed ? 'FAILED' : 'all passed'}${warned ? ` (${warned} with warnings)` : ''}`);
    process.exit(failed ? 1 : 0);
}

function shuffleInPlace(a) {
    for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
    return a;
}

main();
