// Shared helpers for question generators. Loaded before every categories/*.js file.
// See categories/README.md for the category / generator contract.

window.CATEGORIES = [];

// Registers a list of categories under a group name (shown as a heading in the category picker).
// Optional defaults are applied to every category in the list: registerCategories(group, [defaults,] list).
function registerCategories(group, defaults, list) {
    if (Array.isArray(defaults)) { list = defaults; defaults = {}; }
    list.forEach(cat => CATEGORIES.push(Object.assign({ group }, defaults, cat)));
}

// Source URLs cited by many categories (shorthand from research/catalog.md).
const SRC = {
    CBS: 'https://satsuite.collegeboard.org/media/pdf/digital-sat-sample-questions.pdf',
    OUT: 'https://outlierlearning.substack.com/p/an-evolving-sat-data-base',
};

// ===== Random numbers =====
function randInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function randNonZero(min, max) { let n = 0; while (n === 0) n = randInt(min, max); return n; }
function pick(arr) { return arr[randInt(0, arr.length - 1)]; }
function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
        const j = randInt(0, i);
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

// ===== Number theory / fractions =====
function gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a; }
function lcm(a, b) { return Math.abs(a * b) / gcd(a, b); }

// Reduces n/d and moves the sign to the numerator. Returns [n, d].
function reduceFraction(n, d) {
    if (d < 0) { n = -n; d = -d; }
    const g = gcd(n, d) || 1;
    return [n / g, d / g];
}

// "n/d" in lowest terms, or just "n" when it is a whole number. Valid as a student-produced answer.
function fracStr(n, d) {
    const [rn, rd] = reduceFraction(n, d);
    return rd === 1 ? `${rn}` : `${rn}/${rd}`;
}

// LaTeX for n/d in lowest terms, e.g. "-\frac{3}{4}" or "5".
function fracTex(n, d) {
    const [rn, rd] = reduceFraction(n, d);
    if (rd === 1) return `${rn}`;
    return `${rn < 0 ? '-' : ''}\\frac{${Math.abs(rn)}}{${rd}}`;
}

// Rounds to a number of decimal places, avoiding floating-point noise like 0.30000000000000004.
function roundTo(x, places) {
    const f = Math.pow(10, places);
    return Math.round((x + Number.EPSILON) * f) / f;
}

// ===== Number formatting =====
// Groups thousands with commas, as the SAT writes numbers of 1,000 or more: commas(3025) → "3,025".
// places (optional) fixes the decimals: commas(37, 2) → "37.00". For prose and plain-text choices.
function commas(x, places) {
    const s = places === undefined ? String(x) : Number(x).toFixed(places);
    const [int, frac] = s.split('.');
    return int.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + (frac !== undefined ? '.' + frac : '');
}

// The same inside \\( \\) or $$ $$ math, where TeX needs {,} so no space follows the comma: "3{,}025".
function texNum(x, places) { return commas(x, places).replace(/,/g, '{,}'); }

// Money for questionText and choices: money(5.5) → "\$5.50", money(1200) → "\$1,200".
// Whole amounts get no cents unless places is given (money(37, 2) → "\$37.00").
function money(x, places) {
    if (places === undefined) places = Number.isInteger(x) ? 0 : 2;
    return '\\$' + commas(x, places);
}

// The article for a number as it is read aloud: aAn(8) → "an", aAn(11000) → "an", aAn(5) → "a".
// "an" goes before 8…, and before 11 or 18 when they lead a group (11, 18, 11,000, 18,500,000).
// capital=true gives "A"/"An" for the start of a sentence or choice.
function aAn(n, capital) {
    const digits = commas(n).replace(/^-/, '').split('.')[0];
    const plain = digits.replace(/,/g, '');
    const groupLen = digits.includes(',') ? digits.split(',')[0].length : plain.length % 3 || 3;
    const an = plain[0] === '8' || (groupLen === 2 && (plain.startsWith('11') || plain.startsWith('18')));
    return (capital ? (an ? 'An' : 'A') : (an ? 'an' : 'a'));
}

// Turns question/choice HTML into plain text for a Desmos note (notes can't render MathJax):
// strips tags and math delimiters and unescapes \$.
function noteText(html) {
    return String(html)
        .replace(/<[^>]+>/g, '')
        .replace(/\\\(|\\\)|\$\$/g, '')
        .replace(/\\\$/g, '$')
        .replace(/\{,\}/g, ',')
        .replace(/\\lt\b/g, '<').replace(/\\gt\b/g, '>').replace(/\\le\b/g, '≤').replace(/\\ge\b/g, '≥')
        .replace(/&#39;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&')
        .replace(/\\left|\\right/g, '').replace(/\\cdot/g, '·')
        .replace(/\\frac\{([^{}]+)\}\{([^{}]+)\}/g, '$1/$2')
        .replace(/\^\{([^{}]+)\}/g, (m, e) => (/^[\w.]+$/.test(e) ? `^${e}` : `^(${e})`))
        .replace(/\s+/g, ' ')
        .trim();
}

// ===== LaTeX formatting =====
// Formats one term of a polynomial with its sign, e.g. term(-3, 'x^2') → "- 3x^{2}"-style pieces.
// first=true omits a leading "+" and writes "-" tight to the number.
function term(coef, variable, first) {
    if (coef === 0) return '';
    const abs = Math.abs(coef);
    const body = variable ? (abs === 1 ? variable : `${abs}${variable}`) : `${abs}`;
    if (first) return coef < 0 ? `-${body}` : body;
    return coef < 0 ? ` - ${body}` : ` + ${body}`;
}

// LaTeX polynomial from coefficients, highest power first: polyTex([2, -3, 1]) → "2x^{2} - 3x + 1".
function polyTex(coeffs, v = 'x') {
    const deg = coeffs.length - 1;
    let out = '';
    coeffs.forEach((c, i) => {
        const p = deg - i;
        const variable = p === 0 ? '' : p === 1 ? v : `${v}^{${p}}`;
        const t = term(c, variable, out === '');
        out += t;
    });
    return out === '' ? '0' : out;
}

// Plain-text polynomial for Desmos notes (no MathJax there): polyText([2, -3, 1]) → "2x² - 3x + 1".
function polyText(coeffs, v = 'x') {
    const sup = p => String(p).replace(/\d/g, d => '⁰¹²³⁴⁵⁶⁷⁸⁹'[d]);
    const deg = coeffs.length - 1;
    let out = '';
    coeffs.forEach((c, i) => {
        const p = deg - i;
        out += term(c, p === 0 ? '' : p === 1 ? v : `${v}${sup(p)}`, out === '');
    });
    return out === '' ? '0' : out;
}

// ===== Multiple choice =====
const CHOICE_LETTERS = ['A', 'B', 'C', 'D'];

// Shuffles the correct choice in with three distractors.
// Returns { choices, answer } where answer is the letter of the correct choice.
// Choices are HTML strings and may contain MathJax, e.g. '\\(y = 2x + 3\\)'.
function makeChoices(correct, distractors) {
    if (distractors.length !== 3) throw new Error('makeChoices needs exactly 3 distractors');
    const all = shuffle([correct, ...distractors]);
    return { choices: all, answer: CHOICE_LETTERS[all.indexOf(correct)] };
}

// Keeps the answer letter uniform when choices are sorted (sorting can hide patterns such as "the key is never the
// largest"). Picks a target letter, then calls make(target) up to `tries` times; make returns an object with an
// `answer` letter (e.g. the result of makeChoicesSorted plus anything else the generator needs) or null. Returns the
// first result whose answer is the target, else the last valid result, else null.
function balancedChoice(make, tries = 300) {
    const target = pick(CHOICE_LETTERS);
    let last = null;
    for (let i = 0; i < tries; i++) {
        const r = make(target);
        if (!r) continue;
        last = r;
        if (r.answer === target) return r;
    }
    return last;
}

// Sorted numeric choices from a pool of error values (each a real student error): tries every set of 3 distractors
// from the pool and returns one that puts the key on the target letter, or any valid set if none does (null if no
// set has 4 distinct values). Pool entries may be numbers or { value, html }, as in makeChoicesSorted.
function choicesFromPool(correct, pool, format, target) {
    const sets = [];
    for (let i = 0; i < pool.length; i++)
        for (let j = i + 1; j < pool.length; j++)
            for (let k = j + 1; k < pool.length; k++) {
                const built = makeChoicesSorted(correct, [pool[i], pool[j], pool[k]], format);
                if (built) sets.push(built);
            }
    if (!sets.length) return null;
    const hits = sets.filter(b => b.answer === target);
    return pick(hits.length ? hits : sets);
}

// Numeric multiple choice, listed in increasing order as on the SAT.
// Each of correct/distractors is a number (shown with format, default inline math) or { value, html }
// when the display isn't just the number (fractions, radicals, units).
// Returns { choices, answer }, or null when two choices have the same value, so the caller can pick
// new numbers instead of showing a duplicate.
function makeChoicesSorted(correct, distractors, format = v => `\\(${v}\\)`) {
    if (distractors.length !== 3) throw new Error('makeChoicesSorted needs exactly 3 distractors');
    const items = [correct, ...distractors].map(c => (c !== null && typeof c === 'object') ? c : { value: c, html: format(c) });
    if (items.some(it => !Number.isFinite(it.value))) return null;
    for (let i = 0; i < 4; i++)
        for (let j = i + 1; j < 4; j++)
            if (Math.abs(items[i].value - items[j].value) < 1e-9) return null;
    const sorted = items.slice().sort((p, q) => p.value - q.value);
    return { choices: sorted.map(it => it.html), answer: CHOICE_LETTERS[sorted.indexOf(items[0])] };
}
