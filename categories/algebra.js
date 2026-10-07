// Algebra question types. Each category follows the contract in categories/README.md.
// Note: tips are inserted after MathJax runs, so they use plain HTML/Unicode, not \( \) math.
(() => {

// ===== Shared helpers for this file =====

// Plain text for "coef times val" in Desmos notes: prodText(4, -2) → "4(-2)", prodText(1, 3) → "3", prodText(-1, 3) → "-3".
// signed=true is for a term after + or −: the sign is printed separately and a bare negative value gets parentheses.
function prodText(coef, val, signed) {
    const c = signed ? Math.abs(coef) : coef;
    const body = c === 1 ? (signed && val < 0 ? `(${val})` : `${val}`) : c === -1 ? `${-val}` : `${c}(${val})`;
    return signed ? `${coef < 0 ? ' - ' : ' + '}${body}` : body;
}

// Plain-text linear expression for Desmos notes, e.g. linText(-4, -4, 4) → "-4(-4) + 4", linText(1, 3, 8) → "3 + 8".
function linText(m, x, b) {
    return prodText(m, x) + (b > 0 ? ` + ${b}` : b < 0 ? ` - ${-b}` : '');
}

// Solves a1·x + b1·y = c1, a2·x + b2·y = c2 with integer inputs.
// Returns [x, y] when both are integers, [NaN, NaN] when not, or null when the system is singular.
function solveIntSystem(a1, b1, c1, a2, b2, c2) {
    const D = a1 * b2 - a2 * b1;
    if (D === 0) return null;
    const xn = c1 * b2 - c2 * b1, yn = a1 * c2 - a2 * c1;
    return [xn % D === 0 ? xn / D : NaN, yn % D === 0 ? yn / D : NaN];
}

// For sys-word-problem: builds a two-store purchase backward from its answers. Returns
// { P: [a1, b1, a2, b2], x, y, T: [c1, c2], distractors } (prices and totals in cents), or null.
// The true counts (x, y) solve a1·x + b1·y = c1, a2·x + b2·y = c2. A "setup slip" system (one store's two prices
// swapped, or the two totals swapped) has the whole-number solution (xs, ys), which supplies the distractors.
// k is the asked count (0 → x, 1 → y); target is how many of the three distractors must be below the key.
// ctx gives grid ([lo, hi, step] per price), ok(P) for context rules, and counts().
function buildSlipSystem(ctx, k, target, mode) {
    const onGrid = (v, [lo, hi, step]) => Number.isInteger(v) && v >= lo && v <= hi && v % step === 0;
    const gridVals = ([lo, hi, step]) => { const out = []; for (let v = Math.ceil(lo / step) * step; v <= hi; v += step) out.push(v); return out; };
    // all (a, b) on the grids with a/b = num/den
    const ratioPairs = (num, den, ga, gb) => (num * den <= 0 ? [] : gridVals(gb).map(b => [b * num / den, b]).filter(([a]) => onGrid(a, ga)));
    const fine = P => {
        const [a1, b1, a2, b2] = P;
        if (!ctx.ok(P) || a1 * b2 === a2 * b1) return false;
        // the lines must not be close to parallel (price ratios differ by at least 20%)
        return Math.abs(a1 / b1 - a2 / b2) >= 0.2 * Math.max(a1 / b1, a2 / b2);
    };
    const g = ctx.grid;
    const vals = g.map(gridVals);
    // Prices for one slip type, scanned in random order; returns the first set that works, or null.
    function pricesFor(type, x, y, xs, ys) {
        if (type === 'totals') {
            // a1·xs + b1·ys = c2 and a2·xs + b2·ys = c1: pick store 1's prices, solve for store 2's
            const det = x * ys - y * xs;
            // store 2's prices come out on the price grid only when det divides both numerators: try small det only
            if (det === 0 || Math.abs(det) > 12) return null;
            for (let i = 0; i < 60; i++) {   // a random sample of store 1's price pairs
                const a1 = pick(vals[0]), b1 = pick(vals[1]);
                const c1 = a1 * x + b1 * y, c2 = a1 * xs + b1 * ys;
                const P = [a1, b1, (c2 * ys - c1 * y) / det, (x * c1 - xs * c2) / det];
                if (onGrid(P[2], g[2]) && onGrid(P[3], g[3]) && fine(P)) return P;
            }
            return null;
        }
        // prices swapped at one store: that store's ratio must satisfy a(x − ys) = b(xs − y);
        // the other store's slipped equation is unchanged, so a(x − xs) = b(ys − y)
        const swapped = [xs - y, x - ys], kept = [ys - y, x - xs];
        const [r1, r2] = type === 'store1' ? [swapped, kept] : [kept, swapped];
        const s1 = ratioPairs(r1[0], r1[1], g[0], g[1]);
        if (!s1.length) return null;
        const s2 = shuffle(ratioPairs(r2[0], r2[1], g[2], g[3]));
        for (const p1 of shuffle(s1)) for (const p2 of s2) {
            const [a1, b1, a2, b2] = [...p1, ...p2];
            // the slipped system must have only the one solution (xs, ys)
            if ((type === 'store1' ? b1 * b2 - a1 * a2 : a1 * a2 - b1 * b2) !== 0 && fine([a1, b1, a2, b2])) return [a1, b1, a2, b2];
        }
        return null;
    }
    for (let attempt = 0; attempt < 15; attempt++) {
        const [x, y] = ctx.counts();
        if (x === y) continue;
        const key = [x, y][k], other = [x, y][1 - k];
        // every slipped solution (xs, ys) that puts the key at the target position
        const options = [];
        for (let xs = 1; xs <= 20; xs++) for (let ys = 1; ys <= 20; ys++) {
            if (xs === ys || xs === x || xs === y || ys === x || ys === y) continue;
            const sk = k === 0 ? xs : ys, so = k === 0 ? ys : xs;
            const shown = mode === 'pair' ? [other, sk, so] : [other, x + y, sk];
            if (mode === 'sum' && sk === x + y) continue;
            if ((shown[0] < key) + (shown[1] < key) + (shown[2] < key) === target) options.push([xs, ys, shown]);
        }
        for (const [xs, ys, shown] of shuffle(options).slice(0, 30)) {
            for (const type of shuffle(['store1', 'store2', 'totals'])) {
                const P = pricesFor(type, x, y, xs, ys);
                if (P) return { P, x, y, T: [P[0] * x + P[1] * y, P[2] * x + P[3] * y], distractors: shown };
            }
        }
    }
    return null;
}

// Inequality symbols: TeX for the question (\lt/\gt are safe inside HTML), Desmos LaTeX, plain text for notes.
const INEQ_OPS = {
    '<': { tex: '\\lt', desmos: '<', text: '<', strict: true, holds: m => m < 0 },
    '≤': { tex: '\\le', desmos: '\\le ', text: '≤', strict: false, holds: m => m <= 0 },
    '>': { tex: '\\gt', desmos: '>', text: '>', strict: true, holds: m => m > 0 },
    '≥': { tex: '\\ge', desmos: '\\ge ', text: '≥', strict: false, holds: m => m >= 0 },
};

// A random inequality, either y (op) mx + b or ax + by (op) c.
// margin(x, y) = (left side) − (right side), so the inequality holds when op.holds(margin) is true.
function randomInequality(form) {
    const op = INEQ_OPS[pick(Object.keys(INEQ_OPS))];
    if (form === 'slope') {
        const m = randNonZero(-4, 4), b = randInt(-6, 6);
        const rhs = polyTex([m, b]);
        return {
            op, form, m, b,
            tex: `y ${op.tex} ${rhs}`,
            desmos: `y${op.desmos}${rhs.replace(/ /g, '')}`,
            margin: (x, y) => y - (m * x + b),
            check: (x, y) => `${y} ${op.text} ${linText(m, x, b)} = ${m * x + b}`,
        };
    }
    let a, b;
    do { a = randInt(1, 5); b = randNonZero(-5, 5); } while (gcd(a, b) !== 1 || (Math.abs(a) === 1 && Math.abs(b) === 1));
    const c = randInt(-12, 12);
    const lhs = `${term(a, 'x', true)}${term(b, 'y')}`;
    return {
        op, form, a, b, c,
        tex: `${lhs} ${op.tex} ${c}`,
        desmos: `${lhs.replace(/ /g, '')}${op.desmos}${c}`,
        margin: (x, y) => a * x + b * y - c,
        check: (x, y) => `${prodText(a, x)}${prodText(b, y, true)} = ${a * x + b * y} ${op.text} ${c}`,
    };
}

// ===== Line helpers (batch 5) =====

// TeX coefficient of x for the slope n/d (reduced): 1 → "", -1 → "-", 3 → "3", 3/4 → "\frac{3}{4}", -3/4 → "-\frac{3}{4}".
function coefTex(n, d) {
    const [a, b] = reduceFraction(n, d);
    if (b === 1) return a === 1 ? '' : a === -1 ? '-' : `${a}`;
    return `${a < 0 ? '-' : ''}\\frac{${Math.abs(a)}}{${b}}`;
}

// "y = mx + b" in TeX for slope n/d and intercept b: lineTex(-4, 3, 7) → "y = -\frac{4}{3}x + 7".
function lineTex(n, d, b) {
    if (n === 0) return `y = ${b}`;
    return `y = ${coefTex(n, d)}x${term(b, '')}`;
}

// "Ax + By = C" in TeX, e.g. stdTex(3, -4, 8) → "3x - 4y = 8".
function stdTex(A, B, C) { return `${term(A, 'x', true)}${term(B, 'y')} = ${C}`; }

// An exact numeric choice (value + TeX) for makeChoicesSorted / choicesFromPool.
function fracChoice(n, d = 1) {
    const [rn, rd] = reduceFraction(n, d);
    return { value: rn / rd, html: `\\(${fracTex(rn, rd)}\\)` };
}

// A point as a choice, e.g. pointTex(0, 3, 2) → "\left(0, \frac{3}{2}\right)" (coordinates may be fractions [n, d]).
function pointTex(x, y) {
    const f = v => (Array.isArray(v) ? fracTex(v[0], v[1]) : `${v}`);
    return `\\(\\left(${f(x)}, ${f(y)}\\right)\\)`;
}

const ACE = 'https://acely.com/desmos-guide-library/';

// "y = mx + b" in plain text for notes: lineText(-5, 2, -7) → "y = (-5/2)x - 7", lineText(1, 1, 0) → "y = x".
function lineText(n, d, bn, bd = 1) {
    const [a, b] = reduceFraction(n, d);
    const m = b === 1 ? (a === 1 ? '' : a === -1 ? '-' : `${a}`) : `(${a}/${b})`;
    const [cn, cd] = reduceFraction(bn, bd);
    return `y = ${a === 0 ? '' : `${m}x`}${cn === 0 ? (a === 0 ? '0' : '') : `${a === 0 ? (cn < 0 ? '-' : '') : cn < 0 ? ' - ' : ' + '}${fracStr(Math.abs(cn), cd)}`}`;
}

registerCategories('Algebra', [

    // ===== #1 =====
    {
        id: 'linf-evaluate-combination',
        title: '(Easy) Evaluate a Combination of Linear Functions',
        skill: 'Linear functions',
        source: SRC.CBS,
        tips: [
            'Evaluate each function at the given input first, then combine the outputs. For 4<i>f</i>(2) − <i>g</i>(2): find <i>f</i>(2) and <i>g</i>(2), multiply <i>f</i>(2) by 4, then subtract <i>g</i>(2).',
            'Trap: 4<i>f</i>(2) means 4 times the whole output <i>f</i>(2). If <i>f</i>(<i>x</i>) = <i>x</i> + 7, then 4<i>f</i>(2) = 4(2 + 7) = 36, not 4(2) + 7 = 15. Also watch whether the expression adds or subtracts.',
            'Desmos: type <code>f(x)=</code>… and <code>g(x)=</code>… on two lines, then type the expression exactly as written, e.g. <code>4f(2)-g(2)</code>. Desmos shows its value, and you match it to a choice.',
        ],
        questionGenerator() {
            // The key's letter is chosen first (it depends on where the key falls among the sorted values), so every
            // letter is equally likely; the loop keeps the last valid instance in case none hits the target.
            const targetLetter = pick(CHOICE_LETTERS);
            let inst = null;
            for (let attempt = 0; attempt < 300; attempt++) {
                const a = randNonZero(-9, 9), c = randNonZero(-9, 9);
                const b = randInt(-12, 12), d = randInt(-12, 12);
                const n = randNonZero(-5, 6);
                // p multiplies f(n), q multiplies g(n); at least one of them is 2 or more
                const shape = pick(['f', 'f', 'both', 'g']);
                const p = shape === 'g' ? 1 : randInt(2, 5);
                const q = shape === 'f' ? 1 : shape === 'both' ? randInt(2, 3) : randInt(2, 5);
                const s = pick([1, -1]);
                const F = a * n + b, G = c * n + d;
                const correct = p * F + s * q * G;
                if (Math.abs(correct) > 150 || F === 0 || G === 0) continue;
                const noCoef = F + s * G;                                   // dropped the coefficient(s)
                const xTermOnly = (p * a * n + b) + s * (q * c * n + d);    // multiplied only the x-term, e.g. 4(2) + 7
                const otherOp = p * F - s * q * G;                          // added instead of subtracting, or vice versa
                const built = makeChoicesSorted(correct, [noCoef, xTermOnly, otherOp]);
                if (!built) continue;
                inst = { a, b, c, d, n, p, q, s, F, G, correct, built };
                if (built.answer === targetLetter) break;
            }
            if (!inst) { // deterministic fallback: f(x) = 2x + 5, g(x) = 3x - 4, 3f(2) - g(2) = 3(9) - 2 = 25
                // distractors: 9 - 2 = 7, (3·2·2 + 5) - 2 = 15, 3(9) + 2 = 29
                inst = { a: 2, b: 5, c: 3, d: -4, n: 2, p: 3, q: 1, s: -1, F: 9, G: 2, correct: 25, built: makeChoicesSorted(25, [7, 15, 29]) };
            }
            const { a, b, c, d, n, p, q, s, F, G, correct, built } = inst;

            const fTex = polyTex([a, b]), gTex = polyTex([c, d]);
            const coef = k => (k === 1 ? '' : k);
            const expr = `${coef(p)}f(${n}) ${s > 0 ? '+' : '-'} ${coef(q)}g(${n})`;
            const stems = [
                `<p>If \\(f(x) = ${fTex}\\) and \\(g(x) = ${gTex}\\), what is the value of \\(${expr}\\)?</p>`,
                `$$f(x) = ${fTex}$$ $$g(x) = ${gTex}$$<p>The functions \\(f\\) and \\(g\\) are defined by the given equations. What is the value of \\(${expr}\\)?</p>`,
                `<p>The functions \\(f\\) and \\(g\\) are defined by \\(f(x) = ${fTex}\\) and \\(g(x) = ${gTex}\\). What is the value of \\(${expr}\\)?</p>`,
            ];

            const times = (k, v) => (k === 1 ? (v < 0 ? `(${v})` : `${v}`) : `${k}(${v})`);
            const combineText = `${times(p, F)} ${s > 0 ? '+' : '-'} ${times(q, G)}`;
            return {
                questionText: pick(stems),
                choices: built.choices,
                answer: built.answer,
                desmosSolutions: [
                    { id: 'f', latex: `f(x)=${fTex.replace(/ /g, '')}` },
                    { id: 'g', latex: `g(x)=${gTex.replace(/ /g, '')}` },
                    { id: 'value', latex: expr.replace(/ /g, '') },
                    { type: 'text', id: 'note1', text: `By hand: f(${n}) = ${linText(a, n, b)} = ${F} and g(${n}) = ${linText(c, n, d)} = ${G}.` },
                    { type: 'text', id: 'note2', text: `Then ${expr} = ${combineText} = ${correct}.` },
                    { type: 'text', id: 'note3', text: `The value is ${correct}.` },
                ],
            };
        },
    },

    // ===== #2 =====
    {
        id: 'linf-interpret-context',
        title: '(Easy) Interpret the Slope or Intercept of a Linear Model',
        skill: 'Linear functions',
        source: SRC.CBS,
        tips: [
            'In a linear model such as <i>C</i>(<i>n</i>) = 25<i>n</i> + 100, the number multiplying the variable (25) is the <b>rate</b>: how much the output changes when the input goes up by 1. It is also the slope of the graph. The constant (100) is the <b>starting value</b>: the output when the input is 0, which is the y-intercept of the graph.',
            'Check with units: 25<i>n</i> must be in dollars and <i>n</i> counts games, so 25 is dollars per game. The trap choices give the rate&#39;s number a starting-value meaning, or give the right meaning to the wrong number. If the rate is subtracted (480 − 12<i>t</i>), the quantity decreases.',
            'Desmos isn&#39;t needed, but you can confirm: define the function, then <code>C(0)</code> shows the starting value and <code>C(1)-C(0)</code> shows the change per unit.',
        ],
        questionGenerator() {
            const contexts = [
                {
                    fn: 'C', v: 'n', dec: false,
                    nums: () => [pick([15, 20, 25, 30, 35, 40, 45, 50, 60]), pick([100, 120, 150, 180, 200, 250, 300, 350, 400])],
                    intro: eq => `The function \\(${eq}\\) gives the total cost, in dollars, of buying a video game system and \\(n\\) games for the system.`,
                    rate: r => `Each game costs ${money(r)}.`,
                    start: k => `The video game system costs ${money(k)}.`,
                },
                {
                    fn: 'P', v: 'm', dec: false,
                    nums: () => [pick([20, 25, 30, 35, 40, 45, 50, 55]), pick([25, 40, 50, 60, 75, 100, 150])],
                    intro: eq => `The function \\(${eq}\\) gives the total amount, in dollars, a member has paid to a gym \\(m\\) months after joining the gym.`,
                    rate: r => `The gym charges a fee of ${money(r)} each month.`,
                    start: k => `The gym charges a one-time joining fee of ${money(k)}.`,
                },
                {
                    fn: 'h', v: 'w', dec: false,
                    nums: () => [randInt(2, 6), randInt(7, 24)],
                    intro: eq => `The function \\(${eq}\\) gives the height, in centimeters, of a plant \\(w\\) weeks after a student first measured it.`,
                    rate: r => `The plant grows ${r} centimeters each week.`,
                    start: k => `The plant was ${k} centimeters tall when it was first measured.`,
                },
                {
                    fn: 'F', v: 'd', dec: false,
                    nums: () => [pick([1.5, 2, 2.5, 3, 3.5]), pick([2.5, 3, 4, 4.5, 5])],
                    intro: eq => `The function \\(${eq}\\) gives the fare, in dollars, for a taxi ride of \\(d\\) miles.`,
                    rate: r => `The taxi charges ${money(r, 2)} for each mile of the ride.`,
                    start: k => `Each ride has a base fare of ${money(k, 2)} before any miles are driven.`,
                },
                {
                    fn: 'V', v: 't', dec: true,
                    nums: () => { const r = randInt(5, 25); return [r, r * pick([12, 15, 16, 18, 20, 24, 25, 30, 32, 40])]; },
                    intro: eq => `The function \\(${eq}\\) gives the volume of water, in liters, in a tank \\(t\\) minutes after the tank began to drain.`,
                    rate: (r, up) => `The volume of water in the tank ${up ? 'increases' : 'decreases'} by ${commas(r)} liters each minute.`,
                    start: k => `The tank contained ${commas(k)} liters of water when it began to drain.`,
                },
                {
                    fn: 'B', v: 'n', dec: true,
                    nums: () => [pick([4, 5, 6, 7, 8, 9, 10, 12]), pick([50, 60, 75, 80, 100, 120, 150, 200])],
                    intro: eq => `The function \\(${eq}\\) gives the balance, in dollars, remaining on a gift card after \\(n\\) sandwiches have been bought with the card.`,
                    rate: (r, up) => `The balance ${up ? 'increases' : 'decreases'} by ${money(r)} for each sandwich bought.`,
                    start: k => `The gift card had a starting balance of ${money(k)}.`,
                },
                {
                    fn: 'E', v: 'h', dec: true,
                    nums: () => [pick([150, 200, 250, 300, 350, 400, 450]), pick([1200, 1500, 1800, 2100, 2400, 2700, 3000])],
                    intro: eq => `The function \\(${eq}\\) gives a hiker's elevation, in meters, \\(h\\) hours after the hiker began descending a mountain.`,
                    rate: (r, up) => `The hiker's elevation ${up ? 'increases' : 'decreases'} by ${commas(r)} meters each hour.`,
                    start: k => `The hiker's elevation was ${commas(k)} meters when the descent began.`,
                },
            ];
            const ctx = pick(contexts);
            let r, k;
            do { [r, k] = ctx.nums(); } while (r === k);

            const eq = ctx.dec ? `${ctx.fn}(${ctx.v}) = ${texNum(k)} - ${texNum(r)}${ctx.v}` : `${ctx.fn}(${ctx.v}) = ${texNum(r)}${ctx.v} + ${texNum(k)}`;
            const graph = `the graph of \\(y = ${ctx.fn}(${ctx.v})\\)`;
            const ask = pick(['rateNum', 'slope', 'startNum', 'intercept']);
            const asks = {
                rateNum: `What is the best interpretation of \\(${texNum(r)}\\) in this context?`,
                slope: `What is the best interpretation of the slope of ${graph} in this context?`,
                startNum: `What is the best interpretation of \\(${texNum(k)}\\) in this context?`,
                intercept: `What is the best interpretation of the <i>y</i>-intercept of ${graph} in this context?`,
            };

            // CBS Q3's 2×2 grid: {rate meaning, starting-value meaning} × {rate number, constant number}.
            // For a decreasing model, "increases by r" replaces the rate meaning with the constant's number.
            let correct, distractors;
            if (ask === 'rateNum' || ask === 'slope') {
                correct = ctx.rate(r, false);
                distractors = [ctx.start(r), ctx.dec ? ctx.rate(r, true) : ctx.rate(k, false), ctx.start(k)];
            } else {
                correct = ctx.start(k);
                distractors = [ctx.start(r), ctx.rate(k, false), ctx.rate(r, false)];
            }
            const built = makeChoices(correct, distractors);

            const fnDesmos = ctx.dec ? `${ctx.fn}(${ctx.v})=${k}-${r}${ctx.v}` : `${ctx.fn}(${ctx.v})=${r}${ctx.v}+${k}`;
            const isRate = ask === 'rateNum' || ask === 'slope';
            return {
                questionText: `<p>${ctx.intro(eq)}</p><p>${asks[ask]}</p>`,
                choices: built.choices,
                answer: built.answer,
                desmosSolutions: [
                    { id: 'fn', latex: fnDesmos },
                    { id: 'start', latex: `${ctx.fn}(0)` },
                    { id: 'rate', latex: `${ctx.fn}(1)-${ctx.fn}(0)` },
                    { type: 'text', id: 'note1', text: `${ctx.fn}(0) = ${k}: the constant is the value when ${ctx.v} = 0 (the starting value, and the y-intercept of the graph).` },
                    { type: 'text', id: 'note2', text: `${ctx.fn}(1) − ${ctx.fn}(0) = ${ctx.dec ? -r : r}: the coefficient of ${ctx.v} is the change for each increase of 1 in ${ctx.v} (the slope)${ctx.dec ? ', and the minus sign means the quantity decreases' : ''}.` },
                    { type: 'text', id: 'note3', text: `So ${isRate ? `${ask === 'slope' ? 'the slope' : r} is the rate` : `${ask === 'intercept' ? 'the y-intercept' : k} is the starting value`}. Answer: ${noteText(correct)}` },
                ],
            };
        },
    },

    // ===== #3 =====
    {
        id: 'lin2-interpret-coefficient',
        title: '(Easy) Interpret a Coefficient in a Two-Variable Equation',
        skill: 'Linear equations in two variables',
        source: SRC.CBS,
        tips: [
            'Every term in the equation is measured in the same units as the total. In 3<i>x</i> + 6<i>y</i> = 63, where 63 is a total perimeter in inches, 6<i>y</i> is also in inches. Since <i>y</i> counts sides, 6 must be the number of inches per side.',
            'Trap 1: a coefficient is a rate (per item), not a count. The counts are the variables. Trap 2: check which variable the number multiplies. 6 goes with <i>y</i>, so it describes figure B, not figure A.',
            'The constant by itself on one side is the total for the whole situation (total inches, dollars or points), not a total number of items.',
        ],
        questionGenerator() {
            const name = pick(['Priya', 'Marcus', 'Elena', 'Jordan', 'Aisha', 'Mateo', 'Hannah', 'Kenji']);
            const contexts = [
                {
                    vars: ['x', 'y'], constMode: false,
                    nums: () => { let p, q; do { p = randInt(2, 12); q = randInt(2, 12); } while (p === q); return [p, q, randInt(3, 10), randInt(3, 10)]; },
                    coefStem: (eq, T) => `Figure A and figure B are regular polygons, and the perimeters of the two figures add up to ${commas(T)} inches. The equation \\(${eq}\\) represents this situation, where \\(x\\) is the number of sides of figure A and \\(y\\) is the number of sides of figure B.`,
                    coef: (i, v) => `Each side of figure ${'AB'[i]} is ${v} inches long.`,
                    count: (i, v) => `Figure ${'AB'[i]} has ${v} sides.`,
                    units: 'inches', counts: ['the sides of figure A', 'the sides of figure B'], per: ['side of figure A', 'side of figure B'],
                },
                {
                    vars: ['a', 'c'], constMode: true,
                    nums: () => { const p = randInt(9, 20); return [p, randInt(5, p - 2), randInt(10, 60), randInt(10, 80)]; },
                    coefStem: (eq, T) => `On Saturday, a community theater collected ${money(T)} from selling adult tickets and child tickets. The equation \\(${eq}\\) represents this situation, where \\(a\\) is the number of adult tickets and \\(c\\) is the number of child tickets the theater sold on Saturday.`,
                    constStem: (eq, p, q) => `A community theater charges ${money(p)} for each adult ticket and ${money(q)} for each child ticket. The equation \\(${eq}\\) represents the theater's ticket sales on Saturday, where \\(a\\) is the number of adult tickets and \\(c\\) is the number of child tickets sold that day.`,
                    coef: (i, v) => `Each ${['adult', 'child'][i]} ticket costs ${money(v)}.`,
                    count: (i, v) => `The theater sold ${v} ${['adult', 'child'][i]} tickets on Saturday.`,
                    total: T => `The theater collected a total of ${money(T)} from ticket sales on Saturday.`,
                    totalWrong: T => [`The theater sold a total of ${commas(T)} tickets on Saturday.`, `The theater collected ${money(T)} from the sale of adult tickets on Saturday.`, `The theater collected ${money(T)} from the sale of child tickets on Saturday.`],
                    units: 'dollars', counts: ['adult tickets', 'child tickets'], per: ['adult ticket', 'child ticket'], totalNoun: 'amount collected', items: 'tickets',
                },
                {
                    vars: ['e', 'h'], constMode: true,
                    nums: () => { const p = randInt(2, 5); return [p, randInt(p + 1, 10), randInt(3, 20), randInt(1, 12)]; },
                    coefStem: (eq, T) => `In a trivia competition, a team scored a total of ${T} points by correctly answering easy questions and hard questions. The equation \\(${eq}\\) represents this situation, where \\(e\\) is the number of easy questions and \\(h\\) is the number of hard questions the team answered correctly.`,
                    constStem: (eq, p, q) => `In a trivia competition, each easy question answered correctly is worth ${p} points and each hard question answered correctly is worth ${q} points. The equation \\(${eq}\\) represents one team's results, where \\(e\\) is the number of easy questions and \\(h\\) is the number of hard questions the team answered correctly.`,
                    coef: (i, v) => `Each ${['easy', 'hard'][i]} question answered correctly is worth ${v} points.`,
                    count: (i, v) => `The team correctly answered ${v} ${['easy', 'hard'][i]} questions.`,
                    total: T => `The team scored a total of ${T} points.`,
                    totalWrong: T => [`The team correctly answered a total of ${T} questions.`, `The team scored ${T} points from easy questions.`, `The team scored ${T} points from hard questions.`],
                    units: 'points', counts: ['easy questions', 'hard questions'], per: ['easy question', 'hard question'], totalNoun: 'number of points scored', items: 'questions',
                },
                {
                    vars: ['b', 'y'], constMode: true,
                    nums: () => { let p, q; do { p = 10 * randInt(11, 25); q = 10 * randInt(8, 18); } while (p === q); return [p, q, randInt(2, 9), randInt(2, 9)]; },
                    coefStem: (eq, T) => `Last week, ${name} ate granola bars and cups of yogurt that contained a total of ${commas(T)} calories. The equation \\(${eq}\\) represents this situation, where \\(b\\) is the number of granola bars and \\(y\\) is the number of cups of yogurt ${name} ate last week.`,
                    constStem: (eq, p, q) => `Each granola bar that ${name} eats contains ${p} calories, and each cup of yogurt contains ${q} calories. The equation \\(${eq}\\) represents what ${name} ate last week, where \\(b\\) is the number of granola bars and \\(y\\) is the number of cups of yogurt.`,
                    coef: (i, v) => `Each ${['granola bar', 'cup of yogurt'][i]} contains ${v} calories.`,
                    count: (i, v) => `${name} ate ${v} ${['granola bars', 'cups of yogurt'][i]} last week.`,
                    total: T => `${name} consumed a total of ${commas(T)} calories from granola bars and yogurt last week.`,
                    totalWrong: T => [`${name} ate a total of ${commas(T)} granola bars and cups of yogurt last week.`, `${name} consumed ${commas(T)} calories from granola bars last week.`, `${name} consumed ${commas(T)} calories from yogurt last week.`],
                    units: 'calories', counts: ['granola bars', 'cups of yogurt'], per: ['granola bar', 'cup of yogurt'], totalNoun: 'number of calories', items: 'foods eaten',
                },
                {
                    vars: ['x', 'y'], constMode: true,
                    nums: () => { const p = randInt(4, 15); return [p, randInt(p + 6, 40), randInt(5, 30), randInt(5, 30)]; },
                    coefStem: (eq, T) => `A delivery van is carrying small boxes and large boxes that have a total weight of ${commas(T)} pounds. The equation \\(${eq}\\) represents this situation, where \\(x\\) is the number of small boxes and \\(y\\) is the number of large boxes in the van.`,
                    constStem: (eq, p, q) => `Each small box that a company ships weighs ${p} pounds, and each large box weighs ${q} pounds. The equation \\(${eq}\\) represents the boxes loaded into one delivery van, where \\(x\\) is the number of small boxes and \\(y\\) is the number of large boxes.`,
                    coef: (i, v) => `Each ${['small', 'large'][i]} box weighs ${v} pounds.`,
                    count: (i, v) => `The van is carrying ${v} ${['small', 'large'][i]} boxes.`,
                    total: T => `The boxes in the van have a total weight of ${commas(T)} pounds.`,
                    totalWrong: T => [`The van is carrying a total of ${commas(T)} boxes.`, `The small boxes in the van have a total weight of ${commas(T)} pounds.`, `The large boxes in the van have a total weight of ${commas(T)} pounds.`],
                    units: 'pounds', counts: ['small boxes', 'large boxes'], per: ['small box', 'large box'], totalNoun: 'total weight', items: 'boxes',
                },
                {
                    vars: ['t', 'w'], constMode: true,
                    nums: () => [randInt(18, 35), randInt(12, 17), randInt(4, 20), randInt(10, 40)],
                    coefStem: (eq, T) => `Last month, ${name} earned ${money(T)} from two part-time jobs, tutoring and working at a bookstore. The equation \\(${eq}\\) represents this situation, where \\(t\\) is the number of hours ${name} spent tutoring and \\(w\\) is the number of hours ${name} worked at the bookstore last month.`,
                    constStem: (eq, p, q) => `${name} earns ${money(p)} per hour tutoring and ${money(q)} per hour working at a bookstore. The equation \\(${eq}\\) represents ${name}'s earnings from the two jobs last month, where \\(t\\) is the number of hours spent tutoring and \\(w\\) is the number of hours worked at the bookstore.`,
                    coef: (i, v) => `${name} earns ${money(v)} per hour ${['tutoring', 'working at the bookstore'][i]}.`,
                    count: (i, v) => `${name} ${['spent', 'worked'][i]} ${v} hours ${['tutoring', 'at the bookstore'][i]} last month.`,
                    total: T => `${name} earned a total of ${money(T)} from the two jobs last month.`,
                    totalWrong: T => [`${name} worked a total of ${commas(T)} hours last month.`, `${name} earned ${money(T)} from tutoring last month.`, `${name} earned ${money(T)} from working at the bookstore last month.`],
                    units: 'dollars', counts: ['hours spent tutoring', 'hours worked at the bookstore'], per: ['hour of tutoring', 'hour at the bookstore'], totalNoun: 'amount earned', items: 'hours',
                },
            ];
            const ctx = pick(contexts);
            const [p, q, x, y] = ctx.nums();
            const T = p * x + q * y;
            const [v1, v2] = ctx.vars;
            const eq = `${p}${v1} + ${q}${v2} = ${texNum(T)}`;
            const mode = ctx.constMode && Math.random() < 1 / 3 ? 'const' : 'coef';

            let stem, asked, correct, distractors, why;
            if (mode === 'coef') {
                const i = randInt(0, 1), j = 1 - i, v = [p, q][i];
                stem = ctx.coefStem(eq, T);
                asked = v;
                correct = ctx.coef(i, v);
                distractors = [ctx.count(i, v), ctx.coef(j, v), ctx.count(j, v)];
                why = `The term ${v}${ctx.vars[i]} is measured in ${ctx.units}, like the total, and ${ctx.vars[i]} counts ${ctx.counts[i]}. So ${v} is ${ctx.units} per ${ctx.per[i]}.`;
            } else {
                stem = ctx.constStem(eq, p, q);
                asked = T;
                correct = ctx.total(T);
                distractors = ctx.totalWrong(T);
                why = `${p}${v1} and ${q}${v2} are both in ${ctx.units}, so their sum ${T} is the ${ctx.totalNoun} for the whole situation, not a number of ${ctx.items}.`;
            }
            const built = makeChoices(correct, distractors);
            return {
                questionText: `<p>${stem}</p><p>Which statement is the best interpretation of \\(${texNum(asked)}\\) in this context?</p>`,
                choices: built.choices,
                answer: built.answer,
                desmosSolutions: [
                    { type: 'text', id: 'note1', text: `Desmos doesn't help much here. Use units: every term of ${p}${v1} + ${q}${v2} = ${T} is in ${ctx.units}.` },
                    { type: 'text', id: 'note2', text: why },
                    { type: 'text', id: 'note3', text: `Answer: ${noteText(correct)}` },
                ],
            };
        },
    },

    // ===== #4 =====
    {
        id: 'ineq-point-satisfies',
        title: '(Easy) Which Point Satisfies the Inequality?',
        skill: 'Linear inequalities in one or two variables',
        source: SRC.CBS,
        tips: [
            'Substitute each point&#39;s <i>x</i> and <i>y</i> into the inequality and keep the one that makes it true. For a system, the point must make <b>both</b> inequalities true.',
            'Trap: with &lt; or &gt;, a point on the boundary line (where both sides are equal) is <b>not</b> a solution. With ≤ or ≥ it is. Also watch negative signs when you substitute.',
            'Desmos: type the inequality exactly as given (both of them for a system), then type the four points. The answer is the point in the shaded region, or in the overlap for a system. A dashed boundary means points on the line don&#39;t count.',
        ],
        questionGenerator() {
            const grid = [];
            for (let x = -6; x <= 6; x++) for (let y = -6; y <= 6; y++) grid.push([x, y]);
            const isSystem = Math.random() < 0.3;
            let ineqs, correctPt, wrongPts, plan;

            for (let attempt = 0; attempt < 50 && !correctPt; attempt++) {
                if (!isSystem) {
                    const I = randomInequality(Math.random() < 0.6 ? 'slope' : 'standard');
                    const scale = I.form === 'slope' ? Math.abs(I.m) + 1 : Math.abs(I.a) + Math.abs(I.b);
                    const near = ([x, y]) => Math.abs(I.margin(x, y)) <= 2 * scale + 2;
                    const inside = grid.filter(([x, y]) => I.margin(x, y) !== 0 && I.op.holds(I.margin(x, y)) && near([x, y]));
                    const onLine = grid.filter(([x, y]) => I.margin(x, y) === 0);
                    const outside = shuffle(grid.filter(([x, y]) => !I.op.holds(I.margin(x, y)) && near([x, y])));
                    if (!inside.length || outside.length < 3) continue;
                    if (I.op.strict) {
                        if (!onLine.length) continue;
                        correctPt = pick(inside);
                        wrongPts = [pick(onLine), outside[0], outside[1]];  // boundary point of a strict inequality, then wrong side
                        plan = 'strict';
                    } else {
                        const useLine = onLine.length && Math.random() < 0.5;
                        correctPt = useLine ? pick(onLine) : pick(inside);
                        wrongPts = outside.slice(0, 3);
                        plan = useLine ? 'onLine' : 'inside';
                    }
                    ineqs = [I];
                } else {
                    const I1 = randomInequality('slope');
                    const I2 = randomInequality(Math.random() < 0.7 ? 'slope' : 'standard');
                    const slope2 = I2.form === 'slope' ? I2.m : -I2.a / I2.b;
                    if (slope2 === I1.m) continue;
                    const ok = (I, [x, y]) => I.op.holds(I.margin(x, y));
                    const near = ([x, y]) => Math.min(Math.abs(I1.margin(x, y)), Math.abs(I2.margin(x, y))) <= 6;
                    const both = grid.filter(P => ok(I1, P) && ok(I2, P) && near(P));
                    const only1 = grid.filter(P => ok(I1, P) && !ok(I2, P) && near(P));
                    const only2 = grid.filter(P => !ok(I1, P) && ok(I2, P) && near(P));
                    const neither = grid.filter(P => !ok(I1, P) && !ok(I2, P) && near(P));
                    // a point on a strict boundary that satisfies the other inequality: looks right on the graph but isn't
                    const strictEdge = grid.filter(P => (I1.op.strict && I1.margin(...P) === 0 && ok(I2, P)) || (I2.op.strict && I2.margin(...P) === 0 && ok(I1, P)));
                    const third = strictEdge.length && Math.random() < 0.5 ? strictEdge : neither;
                    if (!both.length || !only1.length || !only2.length || !third.length) continue;
                    correctPt = pick(both);
                    wrongPts = [pick(only1), pick(only2), pick(third)];
                    ineqs = [I1, I2];
                    plan = 'system';
                }
                const keys = [correctPt, ...wrongPts].map(P => P.join(','));
                if (new Set(keys).size !== 4) correctPt = undefined;
            }
            if (!correctPt) { // deterministic fallback: y < -2x + 3
                const m = -2, b = 3, op = INEQ_OPS['<'];
                ineqs = [{ op, form: 'slope', m, b, tex: `y ${op.tex} -2x + 3`, desmos: 'y<-2x+3', margin: (x, y) => y - (m * x + b), check: (x, y) => `${y} < ${linText(m, x, b)} = ${m * x + b}` }];
                correctPt = [-1, 2]; wrongPts = [[1, 1], [2, 0], [0, 4]]; plan = 'strict';
            }

            const ptTex = ([x, y]) => `\\((${x}, ${y})\\)`;
            const built = makeChoices(ptTex(correctPt), wrongPts.map(ptTex));
            const byTex = new Map([correctPt, ...wrongPts].map(P => [ptTex(P), P]));
            const pts = built.choices.map(c => byTex.get(c));

            let questionText;
            if (ineqs.length === 1) {
                const t = ineqs[0].tex;
                questionText = pick([
                    `$$${t}$$<p>Which point \\((x, y)\\) is a solution to the given inequality in the <i>xy</i>-plane?</p>`,
                    `$$${t}$$<p>For which of the following ordered pairs \\((x, y)\\) is the given inequality true?</p>`,
                    `<p>Which of the following ordered pairs \\((x, y)\\) satisfies the inequality \\(${t}\\)?</p>`,
                ]);
            } else {
                const sys = `$$${ineqs[0].tex}$$ $$${ineqs[1].tex}$$`;
                questionText = pick([
                    `${sys}<p>Which point \\((x, y)\\) is a solution to the given system of inequalities in the <i>xy</i>-plane?</p>`,
                    `${sys}<p>For which of the following ordered pairs \\((x, y)\\) are both of the given inequalities true?</p>`,
                ]);
            }

            const [cx, cy] = correctPt;
            const boundaryNote = {
                strict: `The inequality is strict (${ineqs[0].op.text}), so its boundary line is dashed: a point ON the line is not a solution.`,
                onLine: `The inequality includes equality (${ineqs[0].op.text}), so its boundary line is solid: a point on the line IS a solution.`,
                inside: `Only one of the points is in the shaded region.`,
                system: `The solutions of a system are where the two shaded regions overlap. Each wrong choice is outside at least one region${ineqs.some(I => I.op.strict) ? ' (or on a dashed line)' : ''}.`,
            }[plan];
            return {
                questionText,
                choices: built.choices,
                answer: built.answer,
                desmosSolutions: [
                    ...ineqs.map((I, i) => ({ id: `ineq${i + 1}`, latex: I.desmos })),
                    ...pts.map(([x, y], i) => ({ id: `pt${CHOICE_LETTERS[i]}`, latex: `(${x},${y})`, label: CHOICE_LETTERS[i], showLabel: true })),
                    { type: 'text', id: 'note1', text: boundaryNote },
                    { type: 'text', id: 'note2', text: `Check (${cx}, ${cy}) by substituting: ${ineqs.map(I => I.check(cx, cy)).join('; and ')}. ${ineqs.length > 1 ? 'Both are' : 'This is'} true.` },
                    { type: 'text', id: 'note3', text: `Answer: ${built.answer}) (${cx}, ${cy})` },
                ],
            };
        },
    },

    // ===== #5 =====
    {
        id: 'sys-word-problem',
        title: '(Medium) Solve a System of Equations in Context',
        skill: 'Systems of two linear equations in two variables',
        source: SRC.CBS,
        tips: [
            'Write one equation for each store (or day, or company): (price of item 1)·<i>x</i> + (price of item 2)·<i>y</i> = total there. The two equations share the same unknown counts <i>x</i> and <i>y</i>. Then solve the system.',
            'Trap: the question asks for only one of the two counts. After solving, re-read which item it asks about, because the other count is always one of the choices. Adding the two counts is another trap.',
            'Desmos: enter both equations using <i>x</i> and <i>y</i> and click the intersection point; zoom out if you can&#39;t see it. To get exact values, a list regression also works, e.g. <code>[5.5u+3v, 6.5u+8v] ~ [37, 66]</code>.',
        ],
        questionGenerator() {
            const name = pick(['Leah', 'Omar', 'Grace', 'Diego', 'Nina', 'Samir', 'Chloe', 'Ethan']);
            const contexts = [
                () => {
                    const [i1, i2, unit] = pick([['strawberries', 'blueberries', 'pint'], ['raspberries', 'blackberries', 'pint'], ['cherries', 'grapes', 'pound']]);
                    const [S1, S2] = pick([['Store A', 'Store B'], ['Market A', 'Market B'], ['Farm Stand A', 'Farm Stand B']]);
                    return {
                        grid: [[200, 800, 25], [200, 800, 25], [200, 800, 25], [200, 800, 25]],
                        ok: () => true,
                        counts: () => [randInt(2, 12), randInt(2, 12)],
                        xy: [`${unit}s of ${i1}`, `${unit}s of ${i2}`],
                        stem: (P, T, k) => `${S1} sells ${i1} for ${money(P[0] / 100, 2)} per ${unit} and ${i2} for ${money(P[1] / 100, 2)} per ${unit}. ${S2} sells ${i1} for ${money(P[2] / 100, 2)} per ${unit} and ${i2} for ${money(P[3] / 100, 2)} per ${unit}. ${name}'s purchase of ${i1} and ${i2} would cost ${money(T[0] / 100, 2)} at ${S1} or ${money(T[1] / 100, 2)} at ${S2}. How many ${unit}s of ${[i1, i2][k]} are in ${name}'s purchase?`,
                    };
                },
                () => ({
                    grid: [[800, 2000, 50], [600, 1800, 50], [900, 2600, 50], [700, 2400, 50]],
                    ok: ([a1, b1, a2, b2]) => a2 > a1 && b2 > b1,                          // weekend prices are higher
                    counts: () => [randInt(3, 15), randInt(3, 15)],
                    xy: ['general admission tickets', 'planetarium show tickets'],
                    stem: (P, T, k) => `On weekdays, a science museum charges ${money(P[0] / 100, 2)} for each general admission ticket and ${money(P[1] / 100, 2)} for each planetarium show ticket. On weekends, the museum charges ${money(P[2] / 100, 2)} for each general admission ticket and ${money(P[3] / 100, 2)} for each planetarium show ticket. A school group's order of general admission tickets and planetarium show tickets would cost ${money(T[0] / 100, 2)} on a weekday or ${money(T[1] / 100, 2)} on a weekend. How many ${['general admission', 'planetarium show'][k]} tickets are in the group's order?`,
                }),
                () => ({
                    grid: [[200, 600, 25], [75, 350, 25], [200, 600, 25], [75, 350, 25]],
                    ok: () => true,
                    counts: () => [randInt(4, 15), randInt(4, 15)],
                    xy: ['binders', 'notebooks'],
                    stem: (P, T, k) => `A teacher is ordering binders and notebooks for a class. Supplier A charges ${money(P[0] / 100, 2)} per binder and ${money(P[1] / 100, 2)} per notebook. Supplier B charges ${money(P[2] / 100, 2)} per binder and ${money(P[3] / 100, 2)} per notebook. The teacher's order would cost ${money(T[0] / 100, 2)} from Supplier A or ${money(T[1] / 100, 2)} from Supplier B. How many ${['binders', 'notebooks'][k]} are in the teacher's order?`,
                }),
                () => ({
                    grid: [[900, 2400, 25], [900, 2400, 25], [900, 2400, 25], [900, 2400, 25]],
                    ok: () => true,
                    counts: () => [randInt(2, 15), randInt(2, 15)],
                    xy: ['boxes to Canada', 'boxes to Mexico'],
                    stem: (P, T, k) => `Shipping Company A charges ${money(P[0] / 100, 2)} to ship a box to Canada and ${money(P[1] / 100, 2)} to ship a box to Mexico. Shipping Company B charges ${money(P[2] / 100, 2)} to ship a box to Canada and ${money(P[3] / 100, 2)} to ship a box to Mexico. A store's shipment of boxes to Canada and Mexico would cost ${money(T[0] / 100, 2)} with Company A or ${money(T[1] / 100, 2)} with Company B. How many boxes is the store shipping to ${['Canada', 'Mexico'][k]}?`,
                }),
            ];
            let ctx = pick(contexts)();
            const k = randInt(0, 1); // which count is asked for

            // Distractors come from "setup slips": solving the system with one equation set up wrong (the two prices
            // swapped at one store, or each total attached to the wrong store). Such a slipped system has its own
            // solution (x', y'). Two distractor sets:
            //  'pair': the other count, x' and y' (the slip, and the slip plus reporting the wrong variable);
            //  'sum':  the other count, the total number of items x + y, and the slip value for the asked item.
            // The key's position among the sorted choices is chosen first (uniformly; x + y is always above the key, so
            // 'sum' can't put the key last), then buildSlipSystem works backward to prices that produce it.
            const target = randInt(0, 3);
            const mode = target === 3 || Math.random() < 0.5 ? 'pair' : 'sum';
            let inst = buildSlipSystem(ctx, k, target, mode) || buildSlipSystem(ctx, k, target, 'pair')
                || buildSlipSystem(ctx, k, randInt(0, 2), 'sum');
            if (!inst) { // deterministic fallback (verified): 3x + 2y = 30, 3.5x + 4y = 50 → (4, 9);
                // swapping the first store's two prices gives 2x + 3y = 30, 3.5x + 4y = 50 → (12, 2)
                ctx = contexts[0]();
                inst = { P: [300, 200, 350, 400], x: 4, y: 9, T: [3000, 5000], distractors: k === 1 ? [4, 2, 12] : [9, 12, 2] };
            }
            const { P, x, y, T } = inst;
            const correct = [x, y][k];
            const built = makeChoicesSorted(correct, inst.distractors);

            const d = c => String(c / 100);
            const [a1, b1, a2, b2] = P;
            return {
                questionText: `<p>${ctx.stem(P, T, k)}</p>`,
                choices: built.choices,
                answer: built.answer,
                desmosSolutions: [
                    { type: 'text', id: 'note1', text: `Let x = number of ${ctx.xy[0]} and y = number of ${ctx.xy[1]}. Write one equation for each price list:` },
                    { id: 'eq1', latex: `${d(a1)}x+${d(b1)}y=${d(T[0])}` },
                    { id: 'eq2', latex: `${d(a2)}x+${d(b2)}y=${d(T[1])}` },
                    { type: 'text', id: 'note2', text: `Click the intersection of the two lines (zoom out if you can't see it). Or let a list regression solve the system exactly, with u = x and v = y:` },
                    { id: 'reg', latex: `\\left[${d(a1)}u+${d(b1)}v,${d(a2)}u+${d(b2)}v\\right]\\sim\\left[${d(T[0])},${d(T[1])}\\right]` },
                    { id: 'sol', latex: `(${x},${y})`, label: 'solution', showLabel: true },
                    { type: 'text', id: 'note3', text: `The lines meet at (${x}, ${y}): ${x} ${ctx.xy[0]} and ${y} ${ctx.xy[1]}. The question asks for the number of ${ctx.xy[k]}, so the answer is ${correct}.` },
                ],
            };
        },
    },

    // ===== #21 =====
    {
        id: 'lin2-standard-form-features',
        title: '(Easy) Slope and Intercepts from Standard Form',
        skill: 'Linear equations in two variables',
        source: ACE + 'linear-equations-in-2-variables-x-intercept',
        tips: [
            'For \\(Ax + By = C\\): the slope is \\(-\\frac{A}{B}\\). The y-intercept comes from setting \\(x = 0\\), so it is \\(\\left(0, \\frac{C}{B}\\right)\\). The x-intercept comes from setting \\(y = 0\\), so it is \\(\\left(\\frac{C}{A}, 0\\right)\\).',
            'Or solve for \\(y\\) to get slope-intercept form: \\(4x - 6y = 18\\) becomes \\(y = \\frac{2}{3}x - 3\\). Traps: dropping the minus sign in \\(-\\frac{A}{B}\\), flipping the fraction, and swapping the coordinates of an intercept.',
            'Desmos: type the equation as given and click the points where the line crosses the axes. For the slope, find two points on the line and compute rise over run.',
        ],
        questionGenerator() {
            const inst = balancedChoice(target => {
                const A = randInt(1, 9), B = randNonZero(-9, 9);
                if (A === Math.abs(B)) return null;
                // integer intercepts about 70% of the time (C a multiple of both A and B)
                const C = Math.random() < 0.7 ? lcm(A, Math.abs(B)) * randNonZero(-4, 4) : randNonZero(-30, 30);
                if (Math.abs(C) > 60) return null;
                const ask = pick(['slope', 'slope', 'yint', 'xint']);
                if (ask === 'slope') {
                    // errors: A/B (sign lost); -B/A (flipped); C/B (the y-intercept value); B/A (flipped and sign lost)
                    const built = choicesFromPool(fracChoice(-A, B), [fracChoice(A, B), fracChoice(-B, A), fracChoice(C, B), fracChoice(B, A)], undefined, target);
                    return built && { ...built, A, B, C, ask };
                }
                const yi = [C, B], xi = [C, A], neg = ([n, d]) => [-n, d];
                const correct = ask === 'yint' ? pointTex(0, yi) : pointTex(xi, 0);
                // errors: coordinates swapped; a sign error; the other intercept
                const wrong = ask === 'yint' ? [pointTex(yi, 0), pointTex(0, neg(yi)), pointTex(xi, 0)] : [pointTex(0, xi), pointTex(neg(xi), 0), pointTex(0, yi)];
                if (new Set([correct, ...wrong]).size !== 4) return null;
                return { ...makeChoices(correct, wrong), A, B, C, ask };
            });
            const { A, B, C, ask } = inst;
            const eq = stdTex(A, B, C);
            const what = { slope: 'the slope', yint: 'the <i>y</i>-intercept', xint: 'the <i>x</i>-intercept' }[ask];
            const questionText = pick([
                `<p>What is ${what} of the graph of \\(${eq}\\) in the <i>xy</i>-plane?</p>`,
                `$$${eq}$$<p>The graph of the given equation is a line in the <i>xy</i>-plane. What is ${what} of the line?</p>`,
            ]);
            return {
                questionText,
                choices: inst.choices,
                answer: inst.answer,
                desmosSolutions: [
                    { id: 'line', latex: eq.replace(/ /g, '') },
                    { type: 'text', id: 'note1', text: `Solve for y: ${term(B, 'y', true)} = ${polyText([-A, C])}, so ${lineText(-A, B, C, B)}.` },
                    { type: 'text', id: 'note2', text: ask === 'slope' ? `The slope is the coefficient of x: -A/B = ${fracStr(-A, B)}.`
                        : ask === 'yint' ? `Set x = 0: ${B}y = ${C}, so y = ${fracStr(C, B)}. The y-intercept is (0, ${fracStr(C, B)}).`
                        : `Set y = 0: ${A}x = ${C}, so x = ${fracStr(C, A)}. The x-intercept is (${fracStr(C, A)}, 0).` },
                    { type: 'text', id: 'note3', text: `Answer: ${inst.answer}) ${noteText(inst.choices[CHOICE_LETTERS.indexOf(inst.answer)])}` },
                ],
            };
        },
    },

    // ===== #22 =====
    {
        id: 'lin2-point-on-line',
        title: '(Easy) Missing Coordinate of a Point on a Line',
        skill: 'Linear equations in two variables',
        source: ACE + 'linear-equations-in-2-variables-point-on-a-line-spr',
        tips: [
            'A point lies on a line exactly when its coordinates make the equation true. Substitute the coordinate you know, then solve for the unknown one.',
            'Keep track of which coordinate is which: in \\((4, k)\\), 4 is the x-value and \\(k\\) is the y-value. With a fractional slope, multiply both sides by the denominator to clear the fraction.',
            'Desmos: graph the line, then the vertical line \\(x = 4\\) (or the horizontal line \\(y = 9\\)) and click where they meet.',
        ],
        questionGenerator() {
            const v = pick(['k', 'a']);
            let lineTexStr, lineDesmos, px, py, askY, solveNote;
            for (let attempt = 0; attempt < 100; attempt++) {
                askY = Math.random() < 0.6;
                if (Math.random() < 0.55) {   // standard form; the point is chosen first
                    const A = randInt(1, 8), B = randNonZero(-8, 8);
                    px = randInt(-10, 10); py = randInt(-12, 12);
                    const C = A * px + B * py;
                    if (C === 0 || Math.abs(A) === Math.abs(B)) continue;
                    lineTexStr = stdTex(A, B, C);
                    solveNote = askY ? `${prodText(A, px)}${term(B, v)} = ${C}, so ${term(B, v, true)} = ${C - A * px} and ${v} = ${py}.`
                        : `${term(A, v, true)}${prodText(B, py, true)} = ${C}, so ${term(A, v, true)} = ${C - B * py} and ${v} = ${px}.`;
                } else {                      // slope-intercept form with a fractional slope
                    let n, d;
                    do { n = randNonZero(-5, 5); d = randInt(2, 5); } while (gcd(n, d) !== 1);
                    px = d * randNonZero(-4, 4);
                    const b = randInt(-9, 9);
                    py = n * px / d + b;
                    if (Math.abs(py) > 20) continue;
                    lineTexStr = lineTex(n, d, b);
                    solveNote = askY ? `y = (${n}/${d})(${px})${b < 0 ? ' - ' + -b : ' + ' + b} = ${py}.` : `${py} = (${n}/${d})${v}${b < 0 ? ' - ' + -b : ' + ' + b}, so (${n}/${d})${v} = ${py - b} and ${v} = ${px}.`;
                }
                if (Math.abs(px) <= 20) break;
            }
            lineDesmos = lineTexStr.replace(/ /g, '');
            const point = askY ? `(${px}, ${v})` : `(${v}, ${py})`;
            const questionText = pick([
                `<p>The point \\(${point}\\) lies on the graph of \\(${lineTexStr}\\) in the <i>xy</i>-plane. What is the value of \\(${v}\\)?</p>`,
                `<p>In the <i>xy</i>-plane, the graph of \\(${lineTexStr}\\) passes through the point \\(${point}\\). What is the value of \\(${v}\\)?</p>`,
                `$$${lineTexStr}$$<p>The graph of the given equation in the <i>xy</i>-plane contains the point \\(${point}\\). What is the value of \\(${v}\\)?</p>`,
            ]);
            const answer = askY ? py : px;
            return {
                questionText,
                answer,
                desmosSolutions: [
                    { id: 'line', latex: lineDesmos },
                    { id: 'known', latex: askY ? `x=${px}` : `y=${py}` },
                    { id: 'pt', latex: `(${px},${py})`, label: 'intersection', showLabel: true },
                    { type: 'text', id: 'note1', text: `The point is where the line crosses ${askY ? `x = ${px}` : `y = ${py}`}. By hand: ${solveNote}` },
                    { type: 'text', id: 'note2', text: `Answer: ${answer}` },
                ],
            };
        },
    },

    // ===== #23 =====
    {
        id: 'sys-solve-intersection',
        title: '(Easy) Solve a Linear System',
        skill: 'Systems of two linear equations in two variables',
        source: ACE + 'linear-systems-of-equations-point-of-intersection-solution-spr',
        tips: [
            'Elimination: if one variable has opposite coefficients (like \\(2y\\) and \\(-2y\\)), add the equations to eliminate it. Otherwise multiply one equation first. Substitution: if an equation is already solved for \\(y\\), replace \\(y\\) in the other equation.',
            'Answer the question asked: after finding one variable, substitute back to find the other only if it is the one asked for. Clear fractions by multiplying the whole equation by the denominator.',
            'Desmos: type both equations as given and click the intersection point. Its coordinates are \\((x, y)\\).',
        ],
        questionGenerator() {
            const x0 = randInt(-12, 12), y0 = randInt(-12, 12);
            const form = pick(['elim', 'elim', 'subst', 'frac']);
            let e1, e2, how;
            for (let attempt = 0; attempt < 100; attempt++) {
                if (form === 'elim') {
                    const a1 = randInt(1, 6), b1 = randNonZero(-6, 6);
                    // ready for elimination: opposite y-coefficients, or equal x-coefficients
                    const [a2, b2] = Math.random() < 0.6 ? [randNonZero(-6, 6), -b1] : [a1, randNonZero(-6, 6)];
                    if (a1 * b2 - a2 * b1 === 0) continue;
                    e1 = [a1, b1, a1 * x0 + b1 * y0]; e2 = [a2, b2, a2 * x0 + b2 * y0];
                    const [t1, t2] = [stdTex(...e1), stdTex(...e2)];
                    how = b2 === -b1 ? 'Add the equations: the y-terms cancel.' : 'Subtract the equations: the x-terms cancel.';
                    if (Math.abs(e1[2]) > 80 || Math.abs(e2[2]) > 80) continue;
                    return finish(t1, t2);
                }
                if (form === 'subst') {
                    const m = randNonZero(-5, 5), b = y0 - m * x0;
                    const a2 = randNonZero(-6, 6), b2 = randNonZero(-6, 6);
                    if (Math.abs(b) > 30 || a2 + b2 * m === 0) continue;
                    e2 = [a2, b2, a2 * x0 + b2 * y0];
                    how = 'Substitute the first equation into the second.';
                    return finish(`y = ${polyTex([m, b])}`, stdTex(...e2));
                }
                // one equation with a fractional coefficient
                const d = randInt(2, 4), a1n = randNonZero(-3, 3);
                if (gcd(a1n, d) !== 1 || x0 % d !== 0) continue;
                const b1 = randNonZero(-5, 5), c1 = a1n * x0 / d + b1 * y0;
                const a2 = randNonZero(-6, 6), b2 = randNonZero(-6, 6);
                if ((a1n / d) * b2 - a2 * b1 === 0) continue;
                e2 = [a2, b2, a2 * x0 + b2 * y0];
                how = `Multiply the first equation by ${d} to clear the fraction, then eliminate.`;
                return finish(`${coefTex(a1n, d)}x${term(b1, 'y')} = ${c1}`, stdTex(...e2));
            }
            return finish(stdTex(3, 2, 16), stdTex(1, -2, 0), 4, 2);

            function finish(t1, t2, fx = x0, fy = y0) {
                const askX = Math.random() < 0.5;
                const [first, second] = Math.random() < 0.5 ? [t1, t2] : [t2, t1];
                const questionText = pick([
                    `$$${first}$$ $$${second}$$<p>The solution to the given system of equations is \\((x, y)\\). What is the value of \\(${askX ? 'x' : 'y'}\\)?</p>`,
                    `$$${first}$$ $$${second}$$<p>If \\((x, y)\\) is the solution to the given system of equations, what is the value of \\(${askX ? 'x' : 'y'}\\)?</p>`,
                ]);
                return {
                    questionText,
                    answer: askX ? fx : fy,
                    desmosSolutions: [
                        { id: 'eq1', latex: first.replace(/ /g, '') },
                        { id: 'eq2', latex: second.replace(/ /g, '') },
                        { id: 'sol', latex: `(${fx},${fy})`, label: 'solution', showLabel: true },
                        { type: 'text', id: 'note1', text: `The lines meet at (${fx}, ${fy}). By hand: ${how || 'eliminate one variable.'}` },
                        { type: 'text', id: 'note2', text: `The question asks for ${askX ? 'x' : 'y'}. Answer: ${askX ? fx : fy}` },
                    ],
                };
            }
        },
    },

    // ===== #24 =====
    {
        id: 'lin2-perpendicular-line',
        title: '(Medium) Equation of a Perpendicular Line',
        skill: 'Linear equations in two variables',
        source: ACE + 'linear-equations-in-2-variables-perpendicular-line',
        tips: [
            'Perpendicular lines have slopes that are <b>negative reciprocals</b>: flip the fraction and change the sign. If line ℓ has slope \\(\\frac{3}{4}\\), a perpendicular line has slope \\(-\\frac{4}{3}\\). Then use the given point to find the y-intercept: \\(b = y - mx\\).',
            'Traps: keeping the same slope (that makes a parallel line), only changing the sign, or only flipping the fraction. All four choices usually pass through the given point, so checking the point alone won&#39;t decide it; check the slope.',
            'Desmos: graph line ℓ and the choices. The answer crosses ℓ at a right angle and goes through the point. Two slopes are perpendicular when their product is \\(-1\\).',
        ],
        questionGenerator() {
            let n, d;
            do { n = randNonZero(-5, 5); d = randInt(1, 5); } while (gcd(n, d) !== 1 || Math.abs(n) === d);
            // line ℓ: slope n/d; the perpendicular slope is -d/n. The point's x is a multiple of n and d, so every
            // choice line through the point has an integer y-intercept.
            const form = pick(['std', 'std', 'slope', 'points', 'yint']);
            const bL = randInt(-9, 9);
            const L = lcm(Math.abs(n), d);
            let x0 = form === 'yint' ? 0 : L * randNonZero(-3, 3);
            if (Math.abs(x0) > 24) x0 = L * pick([-1, 1]);
            const y0 = form === 'yint' ? bL : randInt(-10, 10);
            const slopes = [[-d, n], [n, d], [-n, d], [d, n]];   // perpendicular (key); parallel; sign only; reciprocal only
            const lines = slopes.map(([p, q]) => {
                const [rp, rq] = reduceFraction(p, q);
                return { p: rp, q: rq, b: y0 - rp * x0 / rq };
            });
            const html = l => `\\(${lineTex(l.p, l.q, l.b)}\\)`;
            const built = makeChoices(html(lines[0]), lines.slice(1).map(html));
            // line ℓ in the chosen form
            // standard form A x + B y = C with A > 0 and slope -A/B = n/d, y-intercept C/B = bL
            const A = Math.abs(n) * randInt(1, 2), B = -Math.sign(n) * d * (A / Math.abs(n)), C = B * bL;
            let ellTex, given;
            if (form === 'std' || form === 'yint') { ellTex = stdTex(A, B, C); given = `\\(${ellTex}\\)`; }
            else if (form === 'slope') { ellTex = lineTex(n, d, bL); given = `\\(${ellTex}\\)`; }
            else { const x1 = d * randInt(-3, 1), x2 = x1 + d * randInt(1, 2); ellTex = lineTex(n, d, bL); given = null;   // integer points
                var pts = [[x1, n * x1 / d + bL], [x2, n * x2 / d + bL]]; }
            const pointText = form === 'yint' ? 'passes through the <i>y</i>-intercept of line \\(\\ell\\)' : `passes through the point \\((${x0}, ${y0})\\)`;
            const ellText = form === 'points' ? `In the <i>xy</i>-plane, line \\(\\ell\\) passes through the points \\((${pts[0][0]}, ${pts[0][1]})\\) and \\((${pts[1][0]}, ${pts[1][1]})\\).` : `In the <i>xy</i>-plane, line \\(\\ell\\) is defined by ${given}.`;
            const questionText = `<p>${ellText} Line \\(p\\) is perpendicular to line \\(\\ell\\) and ${pointText}. Which equation defines line \\(p\\)?</p>`;
            const key = lines[0];
            return {
                questionText,
                choices: built.choices,
                answer: built.answer,
                desmosSolutions: [
                    { id: 'ell', latex: (form === 'std' || form === 'yint' ? ellTex : lineTex(n, d, bL)).replace(/ /g, '') },
                    { id: 'pt', latex: `(${x0},${y0})` },
                    ...lines.map((l, i) => ({ id: `choice${i}`, latex: lineTex(l.p, l.q, l.b).replace(/ /g, '') })),
                    { type: 'text', id: 'note1', text: `Line ℓ has slope ${fracStr(n, d)}${form === 'yint' ? ` and y-intercept (0, ${bL})` : ''}. A perpendicular slope is the negative reciprocal: ${fracStr(-d, n)} (the product is -1).` },
                    { type: 'text', id: 'note2', text: `Through (${x0}, ${y0}): b = ${y0} - (${fracStr(-d, n)})(${x0}) = ${key.b}. All four choices pass through this point, but only one has the perpendicular slope.` },
                    { type: 'text', id: 'note3', text: `Answer: ${built.answer}) ${noteText(html(key))}` },
                ],
            };
        },
    },

    // ===== #25 =====
    {
        id: 'sys-number-of-solutions',
        title: '(Medium) Number of Solutions of a Linear System',
        skill: 'Systems of two linear equations in two variables',
        source: ACE + 'linear-systems-of-equations-number-of-solutions',
        tips: [
            'Put both equations in slope-intercept form \\(y = mx + b\\) and compare. Different slopes: exactly one solution. Same slope, different y-intercepts: parallel lines, zero solutions. Same slope and same y-intercept: the same line, infinitely many solutions.',
            'A standard-form equation may be a multiple of the other equation: \\(6x - 4y = 16\\) is \\(y = \\frac{3}{2}x - 4\\) multiplied through. Two different lines can never meet in exactly two points, so "Exactly two" is never right for a linear system.',
            'Desmos: graph both equations. Crossing lines meet once, parallel lines never meet, and if you see only one line, the two equations are the same line.',
        ],
        questionGenerator() {
            let n, d;
            do { n = randNonZero(-5, 5); d = randInt(1, 4); } while (gcd(n, d) !== 1);
            const b = randInt(-9, 9);
            const want = pick(['one', 'zero', 'inf']);
            // second line y = (n2/d2)x + b2, written in standard form scaled by k
            let n2 = n, d2 = d, b2 = b;
            if (want === 'zero') b2 = b + pick([-1, 1]) * randInt(1, 6);
            if (want === 'one') { do { n2 = n + randNonZero(-2, 2); } while (n2 === 0 || n2 * d === n * d2); b2 = Math.random() < 0.5 ? b : randInt(-9, 9); }
            // n2 x - d2 y = -d2 b2, times k, with a positive x-coefficient
            const k = randInt(2, 4) * (n2 < 0 ? -1 : 1);
            const A = n2 * k, B = -d2 * k, C = -d2 * b2 * k;
            const e1 = lineTex(n, d, b), e2 = stdTex(A, B, C);
            const [first, second] = Math.random() < 0.5 ? [e1, e2] : [e2, e1];
            const choices = ['Exactly one', 'Exactly two', 'Infinitely many', 'Zero'];
            const answer = { one: 'A', inf: 'C', zero: 'D' }[want];
            // self-check: compare slopes and intercepts of the two equations as written
            const [s2n, s2d] = reduceFraction(-A, B), [i2n, i2d] = reduceFraction(C, B), [s1n, s1d] = reduceFraction(n, d);
            const same = s2n === s1n && s2d === s1d, sameB = i2d === 1 && i2n === b;
            const got = !same ? 'one' : sameB ? 'inf' : 'zero';
            if (got !== want) throw new Error(`case mismatch ${want} vs ${got}`);
            return {
                questionText: pick([
                    `$$${first}$$ $$${second}$$<p>How many solutions does the given system of equations have?</p>`,
                    `$$${first}$$ $$${second}$$<p>The given system of equations has how many solutions?</p>`,
                ]),
                choices,
                answer,
                desmosSolutions: [
                    { id: 'eq1', latex: e1.replace(/ /g, '') },
                    { id: 'eq2', latex: e2.replace(/ /g, '') },
                    { type: 'text', id: 'note1', text: `Solve the standard-form equation for y: ${lineText(-A, B, C, B)}. The other line is ${lineText(n, d, b)}.` },
                    { type: 'text', id: 'note2', text: want === 'one' ? 'The slopes are different, so the lines cross exactly once.' : want === 'zero' ? 'Same slope but different y-intercepts: the lines are parallel and never meet.' : 'Same slope and same y-intercept: both equations describe the same line, so every point on it is a solution.' },
                    { type: 'text', id: 'note3', text: `Answer: ${answer}) ${choices['ABCD'.indexOf(answer)]}` },
                ],
            };
        },
    },

    // ===== #41 =====
    {
        id: 'lin2-shifted-line-x-intercept',
        title: '(Hard) x-Intercept After Translating a Line',
        skill: 'Linear equations in two variables',
        source: ACE + 'linear-equations-in-2-variables-x-intercept-translation-spr',
        tips: [
            'To translate a graph, replace the variables: <b>down \\(k\\)</b> means replace \\(y\\) with \\(y + k\\); <b>up \\(k\\)</b> means \\(y - k\\); <b>right \\(h\\)</b> means replace \\(x\\) with \\(x - h\\); <b>left \\(h\\)</b> means \\(x + h\\). Then set \\(y = 0\\) and solve for \\(x\\).',
            'Example: \\(9x - 10y = 19\\) translated down 4 becomes \\(9x - 10(y + 4) = 19\\). At \\(y = 0\\): \\(9x - 40 = 19\\), so \\(x = \\frac{59}{9}\\). Traps: shifting the wrong way, and finding the original intercept. A fraction answer can be entered as a fraction.',
            'Desmos: type the shifted equation, e.g. <code>9x-10(y+4)=19</code>, and click where it crosses the x-axis. Or graph the original and drag a copy.',
        ],
        questionGenerator() {
            for (let attempt = 0; attempt < 200; attempt++) {
                const dir = pick(['up', 'down', 'left', 'right']), k = randInt(1, 9);
                const [dx, dy] = { up: [0, k], down: [0, -k], left: [-k, 0], right: [k, 0] }[dir];
                let lineTexStr, shiftedLatex, num, den;   // x-intercept = num/den
                if (Math.random() < 0.65) {   // standard form Ax + By = C → A(x - dx) + B(y - dy) = C
                    const A = randInt(2, 12), B = randNonZero(-12, 12), C = randInt(-30, 30);
                    if (gcd(gcd(A, Math.abs(B)), Math.abs(C)) !== 1 || Math.abs(B) === A) continue;
                    lineTexStr = stdTex(A, B, C);
                    // y = 0: A(x - dx) - B·dy = C → x = (C + B·dy)/A + dx
                    [num, den] = [C + B * dy + A * dx, A];
                    const xs = dx === 0 ? 'x' : `\\left(x${dx > 0 ? '-' : '+'}${Math.abs(dx)}\\right)`, ys = dy === 0 ? 'y' : `\\left(y${dy > 0 ? '-' : '+'}${Math.abs(dy)}\\right)`;
                    shiftedLatex = `${A}${xs}${B < 0 ? '-' : '+'}${Math.abs(B) === 1 ? '' : Math.abs(B)}${ys}=${C}`;
                    // self-check: substitute the intercept into the shifted equation
                    const xv = num / den;
                    if (Math.abs(A * (xv - dx) + B * (0 - dy) - C) > 1e-9) throw new Error('shift check');
                } else {                      // y = (n/d)x + b → y - dy = (n/d)(x - dx) + b
                    let n, d; do { n = randNonZero(-6, 6); d = randInt(1, 5); } while (gcd(n, d) !== 1);
                    const b = randNonZero(-9, 9);
                    lineTexStr = lineTex(n, d, b);
                    // y = 0: -dy = (n/d)(x - dx) + b → x = dx + (-dy - b)·d/n
                    [num, den] = [dx * n + (-dy - b) * d, n];
                    const xs = dx === 0 ? 'x' : `\\left(x${dx > 0 ? '-' : '+'}${Math.abs(dx)}\\right)`;
                    shiftedLatex = `y${dy === 0 ? '' : dy > 0 ? `-${dy}` : `+${-dy}`}=${coefTex(n, d)}${xs}${term(b, '').replace(/ /g, '')}`;
                    const xv = num / den;
                    if (Math.abs((n / d) * (xv - dx) + b + dy) > 1e-9) throw new Error('shift check');
                }
                const answer = fracStr(num, den);
                if (answer.replace(/^-/, '').length > 5 || num === 0) continue;
                const xv = num / den;
                return {
                    questionText: pick([
                        `<p>The graph of \\(${lineTexStr}\\) is translated ${dir} ${k} unit${k === 1 ? '' : 's'} in the <i>xy</i>-plane. What is the <i>x</i>-coordinate of the <i>x</i>-intercept of the resulting graph?</p>`,
                        `$$${lineTexStr}$$<p>In the <i>xy</i>-plane, the graph of the given equation is translated ${dir} ${k} unit${k === 1 ? '' : 's'}. What is the <i>x</i>-coordinate of the <i>x</i>-intercept of the resulting graph?</p>`,
                    ]),
                    answer,
                    desmosSolutions: [
                        { id: 'orig', latex: lineTexStr.replace(/ /g, '') },
                        { id: 'shifted', latex: shiftedLatex },
                        { id: 'pt', latex: `(${roundTo(xv, 6)},0)`, label: 'x-intercept', showLabel: true },
                        { type: 'text', id: 'note1', text: `Translating ${dir} ${k}: replace ${dy !== 0 ? `y with ${dy > 0 ? `y - ${dy}` : `y + ${-dy}`}` : `x with ${dx > 0 ? `x - ${dx}` : `x + ${-dx}`}`}. Then set y = 0 and solve for x.` },
                        { type: 'text', id: 'note2', text: `The x-intercept of the new line is x = ${answer}${den !== 1 && Number.isInteger(num / den) === false ? ` (about ${roundTo(xv, 4)})` : ''}. Answer: ${answer}` },
                    ],
                };
            }
            throw new Error('lin2-shifted-line-x-intercept: no instance');
        },
    },

    // ===== #42 =====
    {
        id: 'sys-no-solution-constant',
        title: '(Hard) Constant That Makes a System Have No Solution',
        skill: 'Systems of two linear equations in two variables',
        source: ACE + 'linear-systems-of-equations-no-solutions-w-slider-spr',
        tips: [
            'A system of two linear equations has <b>no solution</b> when the lines are parallel: the x- and y-coefficients are proportional, but the constants are not. It has <b>infinitely many</b> solutions when the whole equations are proportional (the same line).',
            'Find the scale factor from the coefficients you know: in \\(3x - 5y = 12\\) and \\(kx + 15y = 7\\), \\(15 = -3(-5)\\), so the factor is \\(-3\\) and \\(k = 3(-3) = -9\\). Check that \\(7 \\ne 12(-3)\\), so the lines are parallel, not the same.',
            'Desmos: type both equations; Desmos offers a slider for \\(k\\). Drag it until the lines are parallel (they never meet).',
        ],
        questionGenerator() {
            for (let attempt = 0; attempt < 200; attempt++) {
                const a1 = randInt(1, 9), b1 = randNonZero(-9, 9), c1 = randInt(-20, 20);
                if (gcd(gcd(Math.abs(a1), Math.abs(b1)), Math.abs(c1)) !== 1) continue;
                const p = v => (String(v).startsWith('-') ? `(${v})` : `${v}`);   // parenthesize negatives in notes
                const [tn, td] = pick([[randNonZero(-5, 5), 1], [randNonZero(-5, 5), 2], [randNonZero(-4, 4), 3]]);
                const t = tn / td;   // the second equation's coefficients are t times the first's
                const a2 = a1 * t, b2 = b1 * t;
                if (!Number.isInteger(a2) || !Number.isInteger(b2) || t === 1) continue;
                const infinite = Math.random() < 0.3;
                const kLetter = pick(['k', 'a', 'r']);
                let e2, answer, unknownDesmos, solveNote;
                if (infinite) {
                    const c2 = c1 * t;
                    if (!Number.isInteger(c2)) continue;
                    answer = c2;
                    e2 = `${term(a2, 'x', true)}${term(b2, 'y')} = ${kLetter}`;
                    unknownDesmos = `${kLetter}=${c2}`;
                    solveNote = `The coefficients of the second equation are ${fracStr(tn, td)} times those of the first, so for the same line the constant must be ${p(fracStr(tn, td))} × ${p(c1)} = ${c2}.`;
                } else {
                    let c2; do { c2 = randInt(-20, 20); } while (c2 === c1 * t);   // constants not proportional: parallel, not the same line
                    const unknownX = Math.random() < 0.6;
                    answer = unknownX ? fracStr(a2, 1) : fracStr(b2, 1);
                    e2 = unknownX ? `${kLetter}x${term(b2, 'y')} = ${c2}` : `${term(a2, 'x', true)} + ${kLetter}y = ${c2}`;
                    unknownDesmos = `${kLetter}=${unknownX ? a2 : b2}`;
                    solveNote = `The ${unknownX ? 'y' : 'x'}-coefficients give the factor ${unknownX ? `${b2}/${p(b1)}` : `${a2}/${p(a1)}`} = ${fracStr(tn, td)}, so ${kLetter} = ${p(fracStr(tn, td))} × ${p(unknownX ? a1 : b1)} = ${unknownX ? a2 : b2}. The constants ${c1} and ${c2} are not in that ratio, so the lines are parallel.`;
                    // self-check: with this value the coefficient determinant is 0 and the system is inconsistent
                    if (a1 * b2 - a2 * b1 !== 0 || c2 === c1 * t) throw new Error('no-solution check');
                }
                if (String(answer).replace(/^-/, '').length > 5) continue;
                const e1 = stdTex(a1, b1, c1);
                const cond = infinite ? 'infinitely many solutions' : 'no solution';
                return {
                    questionText: `$$${e1}$$ $$${e2}$$<p>In the given system of equations, \\(${kLetter}\\) is a constant. If the system has ${cond}, what is the value of \\(${kLetter}\\)?</p>`,
                    answer,
                    desmosSolutions: [
                        { id: 'eq1', latex: e1.replace(/ /g, '') },
                        { id: 'eq2', latex: e2.replace(/ /g, '') },
                        { id: 'slider', latex: unknownDesmos },
                        { type: 'text', id: 'note1', text: `Drag the slider for ${kLetter}: ${infinite ? 'at the right value the two lines lie on top of each other' : 'at the right value the lines become parallel and never meet'}.` },
                        { type: 'text', id: 'note2', text: `${solveNote} Answer: ${answer}` },
                    ],
                };
            }
            throw new Error('sys-no-solution-constant: no instance');
        },
    },

    // ===== #43 =====
    {
        id: 'lin1-both-sides',
        title: '(Easy) Solve a Linear Equation with Variables on Both Sides',
        skill: 'Linear equations in one variable',
        source: ACE + 'linear-equations-in-1-variable-solving-by-splitting-equation-method-2',
        tips: [
            'Distribute any parentheses first, then collect the \\(x\\)-terms on one side and the constants on the other. For \\(7x - 12 = 3x + 20\\): subtract \\(3x\\) and add 12 to get \\(4x = 32\\), so \\(x = 8\\).',
            'Watch signs when distributing a negative: \\(-3(x - 4) = -3x + 12\\). Check your answer by substituting it into both sides.',
            'Desmos: type the equation exactly as given. Desmos draws a vertical line at the solution; click it to read \\(x\\).',
        ],
        questionGenerator() {
            const x = randNonZero(-15, 15);
            let lhs, rhs;
            for (let attempt = 0; attempt < 100; attempt++) {
                const shape = pick(['plain', 'plain', 'paren', 'both']);
                if (shape === 'plain') {   // ax + b = cx + d
                    const a = randNonZero(-9, 9), c = randNonZero(-9, 9), b = randInt(-20, 20);
                    if (a === c) continue;
                    const d = a * x + b - c * x;
                    if (Math.abs(d) > 60) continue;
                    [lhs, rhs] = [polyTex([a, b]), polyTex([c, d])];
                } else if (shape === 'paren') {   // a(x + b) = cx + d
                    const a = randNonZero(-6, 6), b = randNonZero(-9, 9), c = randNonZero(-9, 9);
                    if (a === c || Math.abs(a) === 1) continue;
                    const d = a * (x + b) - c * x;
                    if (Math.abs(d) > 80) continue;
                    [lhs, rhs] = [`${a}(${polyTex([1, b])})`, polyTex([c, d])];
                } else {                          // a(x + b) + c = d(x + e)
                    const a = randInt(2, 6), b = randNonZero(-9, 9), d = randNonZero(-6, 6), c = randInt(-20, 20);
                    if (a === d || Math.abs(d) === 1) continue;
                    // a(x + b) + c = d(x + e) → e = (a(x + b) + c)/d − x must be an integer
                    const e = (a * (x + b) + c) / d - x;
                    if (!Number.isInteger(e) || e === 0 || Math.abs(e) > 15) continue;
                    [lhs, rhs] = [`${a}(${polyTex([1, b])})${term(c, '')}`, `${d}(${polyTex([1, e])})`];
                }
                break;
            }
            const eq = `${lhs} = ${rhs}`;
            return {
                questionText: pick([
                    `$$${eq}$$<p>What value of \\(x\\) is the solution to the given equation?</p>`,
                    `<p>If \\(${eq}\\), what is the value of \\(x\\)?</p>`,
                ]),
                answer: x,
                desmosSolutions: [
                    { id: 'eq', latex: eq.replace(/ /g, '') },
                    { type: 'text', id: 'note1', text: 'Desmos draws the solution as a vertical line. By hand: distribute, collect the x-terms on one side and the constants on the other, then divide.' },
                    { type: 'text', id: 'note2', text: `x = ${x}. Answer: ${x}` },
                ],
            };
        },
    },

    // ===== #44 =====
    {
        id: 'lin1-solve-for-expression',
        title: '(Easy) Value of an Expression from a Linear Equation',
        skill: 'Linear equations in one variable',
        source: 'https://test-ninjas.com/sat-linear-equations-in-one-variable',
        tips: [
            'Look for a shortcut: if \\(3x + 5 = 20\\), then \\(6x + 10 = 40\\) (double both sides), so \\(6x + 4 = 40 - 6 = 34\\). You can also solve for \\(x\\) first (\\(x = 5\\)) and substitute.',
            'Read the question last: it asks for the value of an expression, not for \\(x\\). Traps: giving \\(x\\), forgetting to adjust the constant after scaling, and multiplying only the \\(x\\)-term.',
            'Desmos: type the equation to find \\(x\\), then type the expression with that value.',
        ],
        questionGenerator() {
            const fmt = v => `\\(${v}\\)`;
            const inst = balancedChoice(target => {
                const a = randInt(2, 9), x = randInt(-8, 12), b = randNonZero(-15, 15), c = a * x + b;
                if (x === 0) return null;
                let targetTex, key, pool;
                if (Math.random() < 0.75) {   // k(ax + b) + adj
                    const k = randInt(2, 4), adj = randNonZero(-12, 12);
                    const K = k * a, M = k * b + adj;
                    key = K * x + M;
                    targetTex = polyTex([K, M]);
                    // errors: x itself; k·c without the adjustment; K·x without the constant; the original right side
                    pool = [x, k * c, K * x, c, k * c - adj];
                } else {                      // a shift of x
                    const p = randNonZero(-9, 9);
                    key = x + p;
                    targetTex = polyTex([1, p]);
                    pool = [x, x - p, c + p, c];   // x itself; the shift the wrong way; shifted the right side; the right side
                }
                pool = pool.filter(v => v !== key);
                const built = choicesFromPool(key, pool, fmt, target);
                return built && { ...built, a, b, c, x, targetTex, key };
            });
            const { a, b, c, x, targetTex, key } = inst;
            const eq = `${polyTex([a, b])} = ${c}`;
            return {
                questionText: pick([
                    `<p>If \\(${eq}\\), what is the value of \\(${targetTex}\\)?</p>`,
                    `$$${eq}$$<p>Based on the given equation, what is the value of \\(${targetTex}\\)?</p>`,
                ]),
                choices: inst.choices,
                answer: inst.answer,
                desmosSolutions: [
                    { id: 'eq', latex: eq.replace(/ /g, '') },
                    { id: 'val', latex: targetTex.replace(/x/g, `\\left(${x}\\right)`).replace(/ /g, '') },
                    { type: 'text', id: 'note1', text: `Desmos shows x = ${x} as a vertical line. Substituting x = ${x} into ${noteText(targetTex)} gives ${key}.` },
                    { type: 'text', id: 'note2', text: `Answer: ${inst.answer}) ${key}` },
                ],
            };
        },
    },

    // ===== #45 =====
    {
        id: 'lin1-word-fee-rate',
        title: '(Easy) Flat Fee Plus Rate Word Problem',
        skill: 'Linear equations in one variable',
        source: 'https://test-ninjas.com/sat-linear-equations-in-one-variable',
        tips: [
            'Total = (one-time fee) + (rate) × (number of units). Subtract the fee from the total first, then divide by the rate: \\(\\frac{345 - 75}{60} = 4.5\\) hours.',
            'Traps: dividing the total by the rate without removing the fee, adding the fee instead of subtracting it, and mixing up which number is the fee and which is the rate.',
            'Desmos: type the equation with \\(x\\) for the unknown, e.g. <code>75+60x=345</code>. Desmos draws a vertical line at the answer.',
        ],
        questionGenerator() {
            const contexts = [
                { who: 'A plumber', fee: [50, 120, 5], rate: [40, 95, 5], units: [2, 8], half: true, unit: 'hour', stem: (F, R, T) => `A plumber charges a one-time fee of ${money(F)} plus ${money(R)} per hour of work. A customer's total bill was ${money(T)}. For how many hours did the plumber work?` },
                { who: 'truck', fee: [20, 60, 5], rate: [35, 90, 5], units: [2, 10], unit: 'day', stem: (F, R, T) => `A company rents trucks for a one-time fee of ${money(F)} plus ${money(R)} per day. A customer paid ${money(T)} in total to rent a truck. For how many days did the customer rent the truck?` },
                { who: 'bike', fee: [5, 15, 1], rate: [3, 9, 1], units: [2, 8], half: true, unit: 'hour', stem: (F, R, T) => `A bike rental shop charges ${money(F)} to rent a bike plus ${money(R)} for each hour the bike is rented. A rider paid ${money(T, Number.isInteger(T) ? 0 : 2)} in total. For how many hours did the rider rent the bike?` },
                { who: 'phone', fee: [20, 40, 5], rate: [5, 15, 1], units: [2, 12], unit: 'gigabyte', stem: (F, R, T) => `A phone plan costs ${money(F)} per month plus ${money(R)} for each gigabyte of data used. One month, a customer's bill was ${money(T)}. How many gigabytes of data did the customer use that month?` },
                { who: 'catering', fee: [150, 400, 25], rate: [12, 35, 1], units: [20, 80], unit: 'guest', stem: (F, R, T) => `A caterer charges a setup fee of ${money(F)} plus ${money(R)} per guest. The total cost of an event was ${money(T)}. How many guests attended the event?` },
                { who: 'tutor', fee: [20, 50, 5], rate: [25, 60, 5], units: [2, 10], half: true, unit: 'hour', stem: (F, R, T) => `A tutor charges a one-time registration fee of ${money(F)} plus ${money(R)} per hour of tutoring. A family paid ${money(T)} in total. For how many hours of tutoring did the family pay?` },
            ];
            const clean = v => v > 0 && Number.isInteger(roundTo(10 * v, 6));   // a whole number or tenth
            const fmt = v => `\\(${num(v)}\\)`;
            const num = v => commas(roundTo(v, 6));
            const inst = balancedChoice(target => {
                const ctx = pick(contexts);
                const step = ctx.fee[2];
                const F = step * randInt(Math.ceil(ctx.fee[0] / step), Math.floor(ctx.fee[1] / step));
                const R = (ctx.rate[2] || 1) * randInt(Math.ceil(ctx.rate[0] / (ctx.rate[2] || 1)), Math.floor(ctx.rate[1] / (ctx.rate[2] || 1)));
                if (F === R) return null;
                const u = ctx.half && Math.random() < 0.35 ? randInt(ctx.units[0], ctx.units[1] - 1) + 0.5 : randInt(ctx.units[0], ctx.units[1]);
                const T = F + R * u;
                // errors: the fee ignored; the fee added; the fee and rate swapped; the fee added to the rate
                const raw = [T / R, (T + F) / R, (T - R) / F, T / (F + R)];
                // error values that aren't a whole number or tenth are dropped; the off-by-one values (a units-counting
                // slip) are always available, so the key can land in any position
                const pool = raw.filter(v => clean(v) && Math.abs(v - u) > 1e-9);
                pool.push(u - 1, u + 1);
                const built = choicesFromPool(u, [...new Set(pool.map(v => roundTo(v, 6)))].filter(v => v > 0), fmt, target);
                return built && { ...built, ctx, F, R, T, u };
            });
            const { ctx, F, R, T, u } = inst;
            return {
                questionText: `<p>${ctx.stem(F, R, T)}</p>`,
                choices: inst.choices,
                answer: inst.answer,
                desmosSolutions: [
                    { id: 'eq', latex: `${F}+${R}x=${roundTo(T, 6)}` },
                    { type: 'text', id: 'note1', text: `Total = fee + rate × units: ${F} + ${R}x = ${num(T)}. Subtract the fee: ${R}x = ${num(T - F)}. Divide: x = ${num(u)}.` },
                    { type: 'text', id: 'note2', text: `Answer: ${inst.answer}) ${num(u)} ${ctx.unit}${u === 1 ? '' : 's'}` },
                ],
            };
        },
    },

    // ===== #105 =====
    {
        id: 'sys-mixture',
        title: '(Hard) Mixture or Blend System',
        skill: 'Systems of two linear equations in two variables',
        source: 'https://test-ninjas.com/sat-linear-equations-in-one-variable',
        tips: [
            'Write two equations: one for the amounts (\\(x + y =\\) total) and one for what the amounts contain (acid, cost, or interest). For 40 liters of 25% acid from 10% and 30% solutions: \\(x + y = 40\\) and \\(0.10x + 0.30y = 0.25(40)\\).',
            'Sanity check: the mix is closer to the ingredient you use more of. 25% is closer to 30% than to 10%, so more of the 30% solution is used. Traps: answering with the other amount, splitting the total in half, and answering with the amount of pure acid.',
            'Desmos: graph both equations, e.g. <code>x+y=40</code> and <code>0.1x+0.3y=10</code>, and click the intersection point.',
        ],
        questionGenerator() {
            const kind = pick(['acid', 'acid', 'coffee', 'nuts', 'money']);   // chosen first, so every context appears often
            const inst = balancedChoice(target => {
                let lo, hi, T, xLo, c, unit, step;
                if (kind === 'acid') {
                    [lo, hi] = pick([[10, 30], [5, 20], [10, 40], [20, 50], [15, 35], [10, 25], [30, 60], [8, 20]]);
                    T = 10 * randInt(2, 10); step = 1;
                } else if (kind === 'money') {
                    [lo, hi] = pick([[3, 5], [2, 6], [4, 7], [3, 8], [2, 5], [4, 6]]);
                    T = 1000 * randInt(5, 30); step = 500;
                } else {
                    [lo, hi] = kind === 'coffee' ? pick([[8, 14], [9, 15], [10, 16], [7, 12], [8, 12], [9, 13]]) : pick([[3, 9], [4, 10], [2, 8], [3, 7], [4, 12], [5, 11]]);
                    T = 5 * randInt(4, 16); step = 1;
                }
                // every split whose mixed value is clean: a whole percent (acid), a price to the quarter dollar, or whole dollars of interest
                const valid = [];
                for (let x = step; x < T; x += step) {
                    const cv = (lo * x + hi * (T - x)) / T;
                    if (kind === 'acid' ? Number.isInteger(cv) : kind === 'money' ? Number.isInteger((lo * x + hi * (T - x)) / 100) : Number.isInteger(4 * cv)) valid.push(x);
                }
                if (!valid.length) return null;
                xLo = pick(valid);
                const xHi = T - xLo;
                c = (lo * xLo + hi * xHi) / T;
                if (!(c > lo && c < hi)) return null;
                if (kind === 'acid' && !Number.isInteger(c)) return null;
                if ((kind === 'coffee' || kind === 'nuts') && !Number.isInteger(4 * c)) return null;   // a price to the quarter dollar
                if (kind === 'money' && !Number.isInteger(lo * xLo / 100 + hi * xHi / 100)) return null;
                const askLo = Math.random() < 0.5;
                const key = askLo ? xLo : xHi;
                const okAmt = v => v > 0 && v < T && Math.abs(v - key) > 1e-9 && (kind === 'money' ? v % 100 === 0 : Number.isInteger(2 * v));
                // errors: the other amount; half the total; the high ingredient alone carrying everything (hi·y = c·T); its complement; acid: pure acid c%·T, the percent gap read as liters
                let pool = [T - key, T / 2, c * T / hi, T - c * T / hi];
                if (kind === 'acid') pool.push(c * T / 100, c - lo, hi - c);
                if (kind === 'money') pool.push(T * lo / (lo + hi), T * hi / (lo + hi));   // split in the ratio of the rates
                pool = [...new Set(pool.map(v => roundTo(v, 6)))].filter(okAmt);
                const fmt = kind === 'money' ? v => money(v) : v => `\\(${texNum(roundTo(v, 6))}\\)`;
                const built = choicesFromPool(key, pool, fmt, target);
                return built && { ...built, kind, lo, hi, T, xLo, xHi, c, askLo, key };
            }, 600);
            const { lo, hi, T, xLo, xHi, c, askLo, key } = inst;
            let stem, eq2, note;
            if (kind === 'acid') {
                stem = `A chemist mixes ${aAn(lo)} ${lo}% acid solution with ${aAn(hi)} ${hi}% acid solution to make ${T} liters of ${aAn(c)} ${c}% acid solution. How many liters of the ${askLo ? lo : hi}% solution does the chemist use?`;
                eq2 = `${lo / 100}x+${hi / 100}y=${roundTo(c * T / 100, 6)}`;
                note = `x + y = ${T} (liters) and ${lo / 100}x + ${hi / 100}y = ${roundTo(c * T / 100, 6)} (liters of acid).`;
            } else if (kind === 'money') {
                const who = pick(['Elena', 'Marcus', 'Priya', 'Jordan', 'Wei']);
                stem = `${who} invested a total of ${money(T)} in two accounts. One account earns ${lo}% simple annual interest, and the other earns ${hi}% simple annual interest. After one year, the two accounts earned a total of ${money(roundTo(c * T / 100, 2))} in interest. How much money, in dollars, did ${who} invest in the account that earns ${askLo ? lo : hi}%?`;
                eq2 = `${lo / 100}x+${hi / 100}y=${roundTo(c * T / 100, 6)}`;
                note = `x + y = ${T} (dollars invested) and ${lo / 100}x + ${hi / 100}y = ${roundTo(c * T / 100, 6)} (dollars of interest).`;
            } else {
                const [a, b, what] = kind === 'coffee' ? ['a coffee that costs', 'a coffee that costs', 'blend'] : ['peanuts that cost', 'cashews that cost', 'mix'];
                stem = `A store mixes ${a} ${money(lo)} per pound with ${b} ${money(hi)} per pound to make ${T} pounds of a ${what} that costs ${money(c, Number.isInteger(c) ? 0 : 2)} per pound. How many pounds of the ${money(askLo ? lo : hi)}-per-pound ${kind === 'coffee' ? 'coffee' : askLo ? 'peanuts' : 'cashews'} are used?`;
                eq2 = `${lo}x+${hi}y=${roundTo(c * T, 6)}`;
                note = `x + y = ${T} (pounds) and ${lo}x + ${hi}y = ${roundTo(c * T, 6)} (dollars of value).`;
            }
            return {
                questionText: `<p>${stem}</p>`,
                choices: inst.choices,
                answer: inst.answer,
                desmosSolutions: [
                    { id: 'e1', latex: `x+y=${T}` },
                    { id: 'e2', latex: eq2 },
                    { type: 'text', id: 'note1', text: `Let x be the amount at ${kind === 'acid' ? `${lo}%` : kind === 'money' ? `${lo}%` : `$${lo} per pound`} and y the amount at ${kind === 'acid' ? `${hi}%` : kind === 'money' ? `${hi}%` : `$${hi} per pound`}: ${note} The intersection is (${xLo}, ${xHi}).` },
                    { type: 'text', id: 'note2', text: `The question asks for ${askLo ? 'x' : 'y'}. Answer: ${inst.answer}) ${commas(key)}` },
                ],
            };
        },
    },

    // ===== #121 =====
    {
        id: 'ineq-system-max',
        title: '(Hard) Greatest or Least Value in a System of Inequalities',
        skill: 'Linear inequalities in one or two variables',
        source: 'https://test-ninjas.com/sat-linear-inequalities-in-one-or-two-variables',
        tips: [
            'Rewrite each inequality as \\(y \\le \\ldots\\) or \\(y \\ge \\ldots\\). Remember to flip the inequality sign when you multiply or divide by a negative number.',
            'When both inequalities are \\(y \\le\\) and one boundary line rises while the other falls, the solution region comes to a peak where the lines meet: the greatest possible \\(y\\) is at that intersection. With two \\(y \\ge\\) inequalities, the region has a lowest point there instead. Set the two right sides equal to find it.',
            'Desmos: graph both inequalities, then click the corner point of the overlapping region to read its coordinates.',
        ],
        questionGenerator() {
            for (let attempt = 0; attempt < 500; attempt++) {
                const isMax = Math.random() < 0.6;
                const h = randInt(-6, 8), k = randInt(-8, 12);
                // boundary lines through the vertex (h, k): y = (p/q)x + r/q, one falling and one rising
                const sl = () => { const q = pick([1, 1, 2, 3]); let p; do { p = randInt(1, 5); } while (gcd(p, q) !== 1); return [p, q]; };
                const [pa, qa] = sl(), [pb, qb] = sl();
                const lines = shuffle([[-pa, qa], [pb, qb]]).map(([p, q]) => ({ p, q, r: q * k - p * h }));   // q·y = p·x + r
                // display: slope-intercept, standard form, or standard form with the sign reversed (the flip trap)
                const forms = shuffle(['slope', 'std', 'flip']).slice(0, 2);
                const op = isMax ? '\\le' : '\\ge', rop = isMax ? '\\ge' : '\\le';
                const lead = a => a === 1 ? '' : a === -1 ? '-' : `${a}`;
                const tex = ({ p, q, r }, form) => {
                    if (form === 'slope') {
                        const m = q === 1 ? `${lead(p)}x` : `${p < 0 ? '-' : ''}\\frac{${Math.abs(p)}}{${q}}x`;
                        const [rn, rd] = reduceFraction(Math.abs(r), q);
                        const b = r === 0 ? '' : rd === 1 ? term(r / q, '') : ` ${r < 0 ? '-' : '+'} \\frac{${rn}}{${rd}}`;
                        return `y ${op} ${m}${b}`;
                    }
                    if (form === 'std') return `${term(-p, 'x', true)}${term(q, 'y')} ${op} ${r}`;   // -p x + q y ≤ r
                    return `${term(p, 'x', true)}${term(-q, 'y')} ${rop} ${-r}`;                     // p x - q y ≥ -r
                };
                const ask = Math.random() < 0.75 ? 'b' : 'a';
                const answer = ask === 'b' ? k : h;
                const t1 = tex(lines[0], forms[0]), t2 = tex(lines[1], forms[1]);
                const desm = s => s.replace(/ /g, '').replace(/\\le/g, '\\le ').replace(/\\ge/g, '\\ge ');
                const lineTxt = ({ p, q, r }) => { const nm = `${p === 1 ? '' : p === -1 ? '−' : String(p).replace('-', '−')}x${r ? ` ${r < 0 ? '−' : '+'} ${Math.abs(r)}` : ''}`; return q === 1 ? nm : `(${nm})/${q}`; };
                const word = isMax ? 'maximum' : 'minimum';
                const question = ask === 'b' ? `What is the ${word} possible value of \\(b\\)?` : `If \\(b\\) is as ${isMax ? 'large' : 'small'} as possible, what is the value of \\(a\\)?`;
                return {
                    questionText: `<p>$$${t1}$$ $$${t2}$$</p><p>In the <i>xy</i>-plane, the point \\((a, b)\\) is a solution to the given system of inequalities. ${question}</p>`,
                    answer,
                    desmosSolutions: [
                        { id: 'i1', latex: desm(t1) },
                        { id: 'i2', latex: desm(t2) },
                        { id: 'v', latex: `\\left(${h},${k}\\right)` },
                        { type: 'text', id: 'note1', text: `As y ${isMax ? '≤' : '≥'} inequalities: y ${isMax ? '≤' : '≥'} ${lines.map(lineTxt).join(` and y ${isMax ? '≤' : '≥'} `)}. One boundary rises and the other falls, so the region's ${isMax ? 'highest' : 'lowest'} point is where the lines meet: (${h}, ${k}).` },
                        { type: 'text', id: 'note2', text: `${ask === 'b' ? `The ${word} value of b is ${k}` : `At that point a = ${h}`}. Answer: ${answer}` },
                    ],
                };
            }
            return {
                questionText: '<p>$$y \\le -2x + 15$$ $$y \\le 3x - 5$$</p><p>In the <i>xy</i>-plane, the point \\((a, b)\\) is a solution to the given system of inequalities. What is the maximum possible value of \\(b\\)?</p>',
                answer: 7,
                desmosSolutions: [
                    { id: 'i1', latex: 'y\\le -2x+15' }, { id: 'i2', latex: 'y\\le 3x-5' },
                    { type: 'text', id: 'note1', text: '−2x + 15 = 3x − 5 gives x = 4 and y = 7. Answer: 7' },
                ],
            };
        },
    },

]);

})();
