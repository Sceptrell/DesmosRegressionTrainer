// Advanced Math question types. Each category follows the contract in categories/README.md.
(() => {

// ===== Shared helpers for this file =====

// A coefficient written in front of parentheses or x: 1 → "", -1 → "-", otherwise the number.
function lead(a) { return a === 1 ? '' : a === -1 ? '-' : `${a}`; }

// "x - h" in TeX (h = 3 → "x - 3", h = -3 → "x + 3"), or just "x" when h = 0.
function shiftTex(h, v = 'x') { return h === 0 ? v : `${v} ${h > 0 ? '-' : '+'} ${Math.abs(h)}`; }

// Vertex form a(x - h)^2 + k in TeX, e.g. vertexTex(-2, 3, 11) → "-2(x - 3)^2 + 11".
function vertexTex(a, h, k) {
    return `${lead(a)}${h === 0 ? 'x^2' : `(${shiftTex(h)})^2`}${term(k, '')}`;
}

// An exact numeric choice for makeChoicesSorted: an integer (with commas) or a reduced \frac.
function fracChoice(n, d = 1) {
    const [rn, rd] = reduceFraction(n, d);
    return { value: rn / rd, html: `\\(${rd === 1 ? texNum(rn) : fracTex(rn, rd)}\\)` };
}

// Polynomial arithmetic on coefficient arrays, highest power first.
function polyMul(p, q) {
    const out = Array(p.length + q.length - 1).fill(0);
    p.forEach((a, i) => q.forEach((b, j) => { out[i + j] += a * b; }));
    return out;
}
function polyAdd(p, q) {
    const n = Math.max(p.length, q.length);
    const P = Array(n - p.length).fill(0).concat(p), Q = Array(n - q.length).fill(0).concat(q);
    return P.map((v, i) => v + Q[i]);
}

// A decimal for display, without float noise: dec(0.88) → "0.88", dec(1.2) → "1.2".
function dec(x) { return String(roundTo(x, 6)); }

// A point (n/d, 0) as an inline-math choice, e.g. pointTexAM(-3, 2) → "\\(\\left(-\\frac{3}{2}, 0\\right)\\)".
function pointTexAM(n, d) { return `\\(\\left(${fracTex(n, d)}, 0\\right)\\)`; }

const ACE_AM = 'https://acely.com/desmos-guide-library/';

// Evaluates simple radical/power TeX numerically (for self-checks): \sqrt[n]{…}, \sqrt{…}, x^{…}, \frac, \cdot.
function texToJsAM(t) {
    let s = t.replace(/\\left|\\right/g, '').replace(/\\dfrac/g, '\\frac').replace(/\\cdot/g, '*');
    for (let i = 0; i < 4; i++) {
        s = s.replace(/\\sqrt\[(\d+)\]\{([^{}]*)\}/g, '(($2)**(1/$1))').replace(/\\sqrt\{([^{}]*)\}/g, '(($1)**(1/2))');
        s = s.replace(/\\frac\{([^{}]*)\}\{([^{}]*)\}/g, '(($1)/($2))');
        s = s.replace(/\^\{([^{}]*)\}/g, '**($1)');
    }
    return s.replace(/(\d|\))\s*(?=[(x])/g, '$1*').replace(/x\s*(?=\()/g, 'x*');
}

registerCategories('Advanced Math', [

    // ===== #6 =====
    {
        id: 'nlf-vertex-form-extremum',
        title: '(Easy) Maximum or Minimum from Vertex Form',
        skill: 'Nonlinear functions',
        source: SRC.CBS,
        tips: [
            'In vertex form \\(f(x) = a(x - h)^2 + k\\), the vertex is \\((h, k)\\). If \\(a > 0\\) the parabola opens up and \\(k\\) is the <b>minimum</b> value; if \\(a < 0\\) it opens down and \\(k\\) is the <b>maximum</b> value.',
            'Trap: \\(h\\) is <i>where</i> the maximum or minimum happens (an x-value), not the value itself. Also watch the sign: \\((x + 3)^2\\) means \\(h = -3\\). For \\(x^2 + 55\\), the vertex is \\((0, 55)\\).',
            'Desmos: graph the function and click its turning point. The gray point shows the vertex; its y-coordinate is the answer. Zoom out if the vertex is off screen.',
        ],
        questionGenerator() {
            // The key's letter is chosen first (it depends on where k falls among the sorted values), so every
            // letter is equally likely; the loop keeps the last valid instance in case none hits the target.
            const targetLetter = pick(CHOICE_LETTERS);
            let inst = null;
            for (let attempt = 0; attempt < 300; attempt++) {
                const a = randNonZero(-5, 5);
                const h = Math.random() < 0.2 ? 0 : randNonZero(-9, 9);   // h = 0 is the CB sample's x^2 + 55 form
                const k = randNonZero(-20, 60);
                if (k === h) continue;
                // Errors: h, the x-value where the extremum occurs (always offered, as in CB Q7); 2k and k^2 (CB Q7);
                // f(0), the y-intercept, read as the extremum; k with its minus sign dropped; a·k (multiplied k by the
                // leading coefficient); -h (misread the sign inside (x - h), then gave the x-value).
                const pool = [2 * k, k * k];
                if (h !== 0) pool.push(a * h * h + k, -h);
                if (k < 0) pool.push(-k);
                if (Math.abs(a) > 1) pool.push(a * k);
                const built = makeChoicesSorted(k, [h, ...shuffle(pool).slice(0, 2)], v => `\\(${texNum(v)}\\)`);
                if (!built) continue;
                inst = { a, h, k, built };
                if (built.answer === targetLetter) break;
            }
            if (!inst) inst = { a: -2, h: 3, k: 11, built: makeChoicesSorted(11, [3, 22, 121], v => `\\(${v}\\)`) };
            const { a, h, k, built } = inst;

            const fn = pick(['f', 'g', 'p']);
            const form = vertexTex(a, h, k);
            const mm = a > 0 ? 'minimum' : 'maximum';
            const stems = [
                `$$${fn}(x) = ${form}$$<p>What is the ${mm} value of the given function?</p>`,
                `<p>The function \\(${fn}\\) is defined by \\(${fn}(x) = ${form}\\). What is the ${mm} value of \\(${fn}(x)\\)?</p>`,
                `$$${fn}(x) = ${form}$$<p>The quadratic function \\(${fn}\\) is defined by the given equation. What is the ${mm} value of \\(${fn}\\)?</p>`,
            ];
            return {
                questionText: pick(stems),
                choices: built.choices,
                answer: built.answer,
                desmosSolutions: [
                    { id: 'fn', latex: `${fn}(x)=${form.replace(/ /g, '')}` },
                    { id: 'vertex', latex: `(${h},${k})`, label: 'vertex', showLabel: true },
                    { type: 'text', id: 'note1', text: `In vertex form a(x - h)² + k, the vertex is (h, k). Here it is (${h}, ${k}). Zoom out if it is off screen.` },
                    { type: 'text', id: 'note2', text: `a = ${a} is ${a > 0 ? 'positive, so the parabola opens up and the vertex is its lowest point' : 'negative, so the parabola opens down and the vertex is its highest point'}.` },
                    { type: 'text', id: 'note3', text: `The ${mm} value is the vertex's y-coordinate, ${k}. (It occurs at x = ${h}, which is a trap choice.)` },
                ],
            };
        },
    },

    // ===== #7 =====
    {
        id: 'nleq-number-of-real-solutions',
        title: '(Medium) How Many Real Solutions Does a Quadratic Have?',
        skill: 'Nonlinear equations in one variable and systems of equations in two variables',
        source: SRC.CBS,
        tips: [
            'Move everything to one side to get \\(ax^2 + bx + c = 0\\), then find the discriminant \\(b^2 - 4ac\\). Positive: two real solutions. Zero: exactly one. Negative: zero real solutions.',
            'Shortcut for \\((x - h)^2 = k\\): a square is never negative. If \\(k < 0\\) there are no real solutions, if \\(k = 0\\) there is one, and if \\(k > 0\\) there are two. A trinomial such as \\(x^2 + 6x + 9\\) is the square \\((x + 3)^2\\).',
            'If both sides have the same \\(x^2\\) term, it cancels and the equation is really linear. A true statement such as \\(0 = 0\\) means infinitely many solutions (the two sides are equivalent), a false one such as \\(5 = 0\\) means zero, and anything with \\(x\\) left over means exactly one.',
            'Desmos: graph \\(y =\\) (left side) and \\(y =\\) (right side) and count the intersection points. If the right side is 0, count the x-intercepts. If the two graphs lie exactly on top of each other, there are infinitely many solutions.',
        ],
        questionGenerator() {
            // About 21% are identities (infinitely many solutions). Another 18% look the same, with x^2 on both sides
            // that cancels, but have zero or one solution, so the look never gives the answer away.
            const r0 = Math.random();
            const want = r0 < 0.21 ? 'inf' : r0 < 0.39 ? pick(['zero', 'one']) : pick(['zero', 'one', 'two']);
            const form = r0 < 0.39 ? 'cancel' : pick(want === 'one' ? ['square', 'trinomial', 'general', 'twoSided'] : ['square', 'trinomial', 'general', 'twoSided', 'noLinear']);

            // A x^2 + B x + C = 0 with the wanted number of real solutions (coefficients kept to SAT sizes)
            function abc() {
                if (want === 'one') {   // m(sx + t)^2
                    let s, t, m;
                    do { s = randInt(1, 3); t = randNonZero(-7, 7); m = pick([1, 1, 2, 3, -1]); }
                    while (gcd(s, t) !== 1 || Math.abs(2 * m * s * t) > 30 || Math.abs(m * t * t) > 30);
                    return [m * s * s, 2 * m * s * t, m * t * t];
                }
                const A = randInt(1, 6);
                let B, C;
                if (want === 'zero') { B = randInt(-10, 10); C = Math.floor(B * B / (4 * A)) + randInt(1, 10); }
                else { do { B = randInt(-12, 12); C = randNonZero(-15, 15); } while (B * B - 4 * A * C <= 0); }
                const sign = pick([1, 1, -1]);
                return [sign * A, sign * B, sign * C];
            }
            // right-hand side q of (x - h)^2 = q
            const rhsFor = p => (want === 'zero' ? -randInt(1, 20) : want === 'one' ? 0 : pick([p * randInt(1, 9) ** 2, randInt(1, 30)]));

            let lhs, rhs, A, B, C, method;
            if (form === 'cancel') {
                // p(x - h)^2 = p x^2 + Bq x + Cq, where (left − right) = L x + K after the x^2 terms cancel
                const p = pick([1, 1, 2, 3]), h = randNonZero(-6, 6);
                const L = want === 'one' ? randNonZero(-6, 6) : 0;
                const K = want === 'inf' ? 0 : want === 'zero' ? randNonZero(-9, 9) : randInt(-9, 9);
                const Bq = -2 * p * h - L, Cq = p * h * h - K;
                const sq = `${lead(p)}(${shiftTex(h)})^2`, ex = polyTex([p, Bq, Cq]);
                [lhs, rhs] = Math.random() < 0.5 ? [sq, ex] : [ex, sq];
                // recompute (square − expanded) from the displayed coefficients for the self-check below
                [A, B, C] = [p - p, -2 * p * h - Bq, p * h * h - Cq];
                const sqText = `${p === 1 ? '' : p}(x ${h > 0 ? '-' : '+'} ${Math.abs(h)})²`;
                method = `Expand the square: ${sqText} = ${polyText([p, -2 * p * h, p * h * h])}. The x² terms cancel. Subtracting the other side leaves ${polyText([B, C])} = 0, ` +
                    (want === 'inf' ? 'which is true for every x: the two sides are equivalent, so there are infinitely many solutions.'
                        : want === 'zero' ? 'which is never true: no solutions.'
                        : `a linear equation with exactly one solution, x = ${fracStr(-C, B)}.`);
            } else if (form === 'square' || form === 'trinomial') {
                const p = form === 'square' ? pick([1, 1, 1, 2, 3, 4]) : 1;
                const h = form === 'square' ? randInt(-9, 9) : randNonZero(-9, 9);
                const q = rhsFor(p);
                lhs = form === 'square' ? `${lead(p)}${h === 0 ? 'x^2' : `(${shiftTex(h)})^2`}` : polyTex([1, -2 * h, h * h]);
                rhs = `${q}`;
                [A, B, C] = [p, -2 * p * h, p * h * h - q];
                const sq = h === 0 ? 'x²' : `(x ${h > 0 ? '-' : '+'} ${Math.abs(h)})²`;
                const intro = form === 'trinomial' ? `The left side is a perfect square: ${polyText([1, -2 * h, h * h])} = ${sq}. ` : p !== 1 ? `Divide both sides by ${p}: ${sq} = ${fracStr(q, p)}. ` : '';
                const qp = q / p;
                method = intro + (qp < 0 ? `A square is never negative, so ${sq} can't equal ${fracStr(q, p)}: no real solutions.`
                    : qp === 0 ? `${sq} = 0 only when x = ${h}: exactly one solution.`
                    : `${sq} = ${fracStr(q, p)} gives two values of x (one for the positive square root and one for the negative): two solutions.`);
            } else if (form === 'noLinear') {
                const a = randInt(1, 6), m = want === 'two' ? pick([a * randInt(1, 8) ** 2, randInt(1, 40)]) : randInt(1, 40);
                const c = want === 'two' ? -m : m;   // a x^2 + c = 0: same signs → no solution, opposite → two
                const sign = pick([1, -1]);
                [A, B, C] = [sign * a, 0, sign * c];
                if (Math.random() < 0.5) { lhs = polyTex([A, 0, C]); rhs = '0'; } else { lhs = polyTex([A, 0, 0]); rhs = `${-C}`; }
                method = `Rewrite as ${polyText([A, 0, C])} = 0, so x² = ${fracStr(-C, A)}. ${-C / A < 0 ? 'A square is never negative: no real solutions.' : 'A positive number has two square roots: two solutions.'}`;
            } else {
                [A, B, C] = abc();
                if (form === 'general') { lhs = polyTex([A, B, C]); rhs = '0'; }
                else {   // two-sided: A x^2 + (B + d)x + e = dx + (e - C)
                    const d = randNonZero(-6, 6), e = randInt(-9, 9);
                    lhs = polyTex([A, B + d, e]);
                    rhs = polyTex([d, e - C]);
                }
                const D = B * B - 4 * A * C;
                method = `${form === 'twoSided' ? 'Move every term to the left: ' : ''}${polyText([A, B, C])} = 0. The discriminant is b² − 4ac = (${B})² − 4(${A})(${C}) = ${D}, which is ${D < 0 ? 'negative: no real solutions' : D === 0 ? 'zero: exactly one solution' : 'positive: two solutions'}.`;
            }
            // self-check: the rearranged equation A x^2 + B x + C = 0 must have the wanted number of solutions
            const count = A !== 0 ? (B * B - 4 * A * C < 0 ? 'zero' : B * B - 4 * A * C === 0 ? 'one' : 'two')
                : B !== 0 ? 'one' : C === 0 ? 'inf' : 'zero';
            if (count !== want) throw new Error(`case mismatch: wanted ${want}, equation has ${count}`);

            const choices = ['Exactly one', 'Exactly two', 'Infinitely many', 'Zero'];
            const answer = { one: 'A', two: 'B', inf: 'C', zero: 'D' }[want];
            const eq = `${lhs} = ${rhs}`;
            const questionText = pick([
                `$$${eq}$$<p>How many distinct real solutions does the given equation have?</p>`,
                `<p>How many distinct real solutions does the equation \\(${eq}\\) have?</p>`,
            ]);
            const L = lhs.replace(/ /g, ''), R = rhs.replace(/ /g, '');
            return {
                questionText,
                choices,
                answer,
                desmosSolutions: [
                    { id: 'left', latex: `y=${L}` },
                    { id: 'right', latex: `y=${R}` },
                    { type: 'text', id: 'note1', text: `Each intersection point of y = (left side) and y = (right side) is a real solution. Count them${R === '0' ? ' (here, the x-intercepts)' : ''}.` },
                    { type: 'text', id: 'note2', text: method },
                    { type: 'text', id: 'note3', text: `Answer: ${answer}) ${choices['ABCD'.indexOf(answer)]}` },
                ],
            };
        },
    },

    // ===== #8 =====
    {
        id: 'nlf-exp-model-from-context',
        title: '(Medium) Exponential Model from a Description',
        skill: 'Nonlinear functions',
        source: SRC.CBS,
        tips: [
            'An exponential model is (starting value) × (factor)<sup>time</sup>. An increase of r% per step means a factor of \\(1 + \\frac{r}{100}\\); a decrease of r% means \\(1 - \\frac{r}{100}\\). A 12% decrease gives 0.88, and a 5% increase gives 1.05.',
            'Trap choices: using the rate itself as the factor (0.12 instead of 0.88), going the wrong direction (1.12 for a decrease), or a linear model such as \\(18{,}000(1 - 0.12t)\\), which subtracts the same amount every year.',
            '"Doubles every 5 years" means the exponent is \\(\\frac{t}{5}\\): after 5 years the exponent is 1. Desmos: graph the choices and check that the value at time 0 is the starting value and that each step multiplies by the right factor.',
        ],
        questionGenerator() {
            const name = pick(['Kai', 'Rosa', 'Malik', 'Ines', 'Theo']);
            function makeContext() {
                const which = pick(['town', 'car', 'bacteriaPct', 'bacteriaDouble', 'medPct', 'medHalf', 'savings', 'cbs', 'cbs']);
                const year = pick([2015, 2018, 2020, 2022]);
                switch (which) {
                    case 'town': {
                        const up = Math.random() < 0.5, P0 = pick([12000, 18000, 24000, 35000, 48000]);
                        const r = up ? pick([2, 3, 4, 5, 6, 8]) : pick([2, 3, 4, 5, 8, 10, 12]);
                        return { fn: 'P', v: 't', P0, kind: 'pct', up, r, unit: 'year',
                            stem: `<p>The population of a town was ${commas(P0)} in ${year}, and the population ${up ? 'increases' : 'decreases'} by ${r}% each year. Which function \\(P\\) gives the population of the town \\(t\\) years after ${year}?</p>` };
                    }
                    case 'car': {
                        const V0 = pick([18000, 24000, 28000, 32500, 40000]), r = pick([10, 12, 15, 18, 20]);
                        return { fn: 'V', v: 't', P0: V0, kind: 'pct', up: false, r, unit: 'year',
                            stem: `<p>A car was purchased for ${money(V0)}. The value of the car decreases by ${r}% each year. Which function \\(V\\) gives the value of the car, in dollars, \\(t\\) years after it was purchased?</p>` };
                    }
                    case 'bacteriaPct': {
                        const N0 = pick([200, 500, 800, 1500]), r = pick([10, 20, 25, 30, 40, 60]);
                        return { fn: 'N', v: 'h', P0: N0, kind: 'pct', up: true, r, unit: 'hour',
                            stem: `<p>At the start of an experiment, a culture contains ${commas(N0)} bacteria. The number of bacteria increases by ${r}% each hour. Which function \\(N\\) gives the number of bacteria in the culture \\(h\\) hours after the start of the experiment?</p>` };
                    }
                    case 'bacteriaDouble': {
                        const N0 = pick([200, 500, 800, 1500]), k = randInt(2, 6);
                        return { fn: 'N', v: 'h', P0: N0, kind: 'double', k, unit: 'hour',
                            stem: `<p>At the start of an experiment, a culture contains ${commas(N0)} bacteria. The number of bacteria doubles every ${k} hours. Which function \\(N\\) gives the number of bacteria in the culture \\(h\\) hours after the start of the experiment?</p>` };
                    }
                    case 'medPct': {
                        const M0 = pick([200, 400, 500, 800]), r = pick([10, 15, 20, 25, 30]);
                        return { fn: 'A', v: 't', P0: M0, kind: 'pct', up: false, r, unit: 'hour',
                            stem: `<p>A patient receives ${aAn(M0)} ${M0}-milligram dose of a medication. The amount of the medication in the patient's body decreases by ${r}% each hour. Which function \\(A\\) gives the amount of the medication, in milligrams, in the patient's body \\(t\\) hours after the dose?</p>` };
                    }
                    case 'medHalf': {
                        const M0 = pick([200, 400, 500, 800]), k = pick([2, 3, 4, 6, 8]);
                        return { fn: 'A', v: 't', P0: M0, kind: 'half', k, unit: 'hour',
                            stem: `<p>A patient receives ${aAn(M0)} ${M0}-milligram dose of a medication. The amount of the medication in the patient's body is halved every ${k} hours. Which function \\(A\\) gives the amount of the medication, in milligrams, in the patient's body \\(t\\) hours after the dose?</p>` };
                    }
                    case 'savings': {
                        const D0 = pick([1000, 1500, 2500, 4000, 5000]), r = pick([2, 3, 4, 5, 6]);
                        return { fn: 'S', v: 't', P0: D0, kind: 'pct', up: true, r, unit: 'year',
                            stem: `<p>${name} deposits ${money(D0)} into a savings account. The balance of the account increases by ${r}% each year, and no other deposits or withdrawals are made. Which function \\(S\\) gives the balance, in dollars, of the account \\(t\\) years after the deposit?</p>` };
                    }
                    default: {   // the CB sample's own wording (Q11)
                        const up = Math.random() < 0.4, n = pick([50, 64, 86, 120, 150, 200, 250]);
                        const r = up ? pick([10, 20, 25, 30, 40, 60]) : pick([10, 20, 25, 30, 40, 60, 75, 80]);   // never 50: 0.5 would be both the rate and the flipped factor
                        return { fn: 'f', v: 'x', P0: n, kind: 'pct', up, r, unit: 'increase in x by 1', cbs: true,
                            stem: `<p>For the function \\(f\\), \\(f(0) = ${n}\\), and for each increase in \\(x\\) by 1, the value of \\(f(x)\\) ${up ? 'increases' : 'decreases'} by ${r}%. Which equation defines \\(f\\)?</p>` };
                    }
                }
            }
            const ctx = makeContext();
            const { fn, v, P0, kind } = ctx;
            const start = texNum(P0);
            const half = '\\left(\\frac{1}{2}\\right)';
            // each option: [TeX of the right side, Desmos LaTeX of the right side]
            let correct, wrong, factorNote, step = 1;
            if (kind === 'pct') {
                const rate = ctx.r / 100, factor = ctx.up ? 1 + rate : 1 - rate, flipped = ctx.up ? 1 - rate : 1 + rate;
                const exp = (b) => [`${start}(${dec(b)})^{${v}}`, `${P0}\\left(${dec(b)}\\right)^{${v}}`];
                correct = exp(factor);
                wrong = [
                    exp(rate),                                                                     // the rate used as the factor
                    exp(flipped),                                                                  // growth and decay mixed up
                    [`${start}(1 ${ctx.up ? '+' : '-'} ${dec(rate)}${v})`, `${P0}\\left(1${ctx.up ? '+' : '-'}${dec(rate)}${v}\\right)`],   // linear model
                ];
                factorNote = `${aAn(ctx.r, true)} ${ctx.r}% ${ctx.up ? 'increase' : 'decrease'} per ${ctx.cbs ? 'step' : ctx.unit} means each value is ${ctx.up ? 100 + ctx.r : 100 - ctx.r}% of the one before, so the factor is ${dec(factor)}.`;
            } else {
                const k = ctx.k, base = kind === 'double' ? ['(2)', '2'] : [half, '\\frac{1}{2}'], other = kind === 'double' ? [half, '\\frac{1}{2}'] : ['(2)', '2'];
                const exp = (b, eTex, eDes) => [`${start}${b[0]}^{${eTex}}`, `${P0}\\left(${b[1]}\\right)^{${eDes}}`];
                correct = exp(base, `${v}/${k}`, `\\frac{${v}}{${k}}`);
                wrong = [
                    exp(base, `${k}${v}`, `${k}${v}`),                      // multiplied by the period instead of dividing
                    exp(base, v, v),                                         // doubled (or halved) every unit instead of every k
                    exp(other, `${v}/${k}`, `\\frac{${v}}{${k}}`),          // the wrong direction
                ];
                step = k;
                factorNote = `${kind === 'double' ? 'Doubling' : 'Halving'} every ${k} hours means the factor ${kind === 'double' ? '2' : '1/2'} is applied once per ${k} hours, so the exponent is ${v}/${k} (it equals 1 when ${v} = ${k}).`;
            }
            const built = makeChoices(`\\(${fn}(${v}) = ${correct[0]}\\)`, wrong.map(w => `\\(${fn}(${v}) = ${w[0]}\\)`));
            const desmosOf = new Map([correct, ...wrong].map(o => [`\\(${fn}(${v}) = ${o[0]}\\)`, o[1]]));
            const L = CHOICE_LETTERS;
            return {
                questionText: ctx.stem,
                choices: built.choices,
                answer: built.answer,
                desmosSolutions: [
                    { type: 'text', id: 'note1', text: `Each choice is entered below as a function named by its letter.` },
                    ...built.choices.map((c, i) => ({ id: `fn${L[i]}`, latex: `${L[i]}\\left(${v}\\right)=${desmosOf.get(c)}` })),
                    { id: 'start', latex: `\\left[A\\left(0\\right),B\\left(0\\right),C\\left(0\\right),D\\left(0\\right)\\right]` },
                    { id: 'factor', latex: `\\left[${L.map(l => `\\frac{${l}\\left(${step}\\right)}{${l}\\left(0\\right)}`).join(',')}\\right]` },
                    { type: 'text', id: 'note2', text: `The first list shows each choice at ${v} = 0 (all start at ${P0}). The second shows how each one changes over ${step === 1 ? `one ${ctx.cbs ? 'step' : ctx.unit}` : `${step} hours`}. ${factorNote}` },
                    { type: 'text', id: 'note3', text: `Only choice ${built.answer} has that factor and is exponential. Answer: ${built.answer}) ${noteText(built.choices[L.indexOf(built.answer)])}` },
                ],
            };
        },
    },

    // ===== #9 =====
    {
        id: 'nlf-form-shows-feature',
        title: '(Medium) Which Equivalent Form Shows the Feature?',
        skill: 'Nonlinear functions',
        source: SRC.CBS,
        tips: [
            'Know what each form shows. Factored form \\(y = a(x - r)(x - s)\\) shows the x-intercepts \\(r\\) and \\(s\\). Vertex form \\(y = a(x - h)^2 + k\\) shows the vertex \\((h, k)\\), so it shows the minimum or maximum value \\(k\\). Standard form \\(y = ax^2 + bx + c\\) shows the y-intercept \\(c\\).',
            'Trap: \\(y = x(x - 6) + 5\\) looks factored, but 0 and 6 are not x-intercepts because of the "+ 5". And \\(y - 5 = x^2 - 6x\\) is just standard form rearranged.',
            'Desmos: graph all four choices. They are the same parabola, so the graph can&#39;t pick the answer, but clicking the vertex and the x-intercepts tells you which numbers to look for in the choices.',
        ],
        questionGenerator() {
            // roots r1 ≠ r2 (nonzero, same parity so the vertex is at an integer x ≠ 0), leading coefficient ±1 or ±2
            let r1, r2;
            do { r1 = randNonZero(-9, 9); r2 = randNonZero(-9, 9); } while (r1 === r2 || (r1 + r2) % 2 !== 0 || r1 + r2 === 0);
            const a = pick([1, 1, -1, 2, -2]);
            const h = (r1 + r2) / 2, k = -a * ((r1 - r2) / 2) ** 2;
            const std = [a, -a * (r1 + r2), a * r1 * r2];
            const [, b, c] = std;
            const s = r1 + r2;

            // Each form: TeX, Desmos LaTeX, and its expansion (computed from the form's own structure)
            const F = {
                factored: { tex: `y = ${lead(a)}(${shiftTex(r1)})(${shiftTex(r2)})`, poly: polyMul([a], polyMul([1, -r1], [1, -r2])) },
                vertex: { tex: `y = ${vertexTex(a, h, k)}`, poly: polyAdd(polyMul([a], polyMul([1, -h], [1, -h])), [k]) },
                vertexShift: { tex: `y ${k < 0 ? '+' : '-'} ${Math.abs(k)} = ${lead(a)}(${shiftTex(h)})^2`, poly: polyAdd(polyMul([a], polyMul([1, -h], [1, -h])), [k]) },
                standard: { tex: `y = ${polyTex(std)}`, poly: std.slice() },
                stdShift: { tex: `y ${c < 0 ? '+' : '-'} ${Math.abs(c)} = ${polyTex([a, b, 0])}`, poly: polyAdd([a, b, 0], [c]) },
                partial: { tex: `y = ${lead(a)}x(${shiftTex(s)}) ${c < 0 ? '-' : '+'} ${Math.abs(c)}`, poly: polyAdd(polyMul([a, 0], [1, -s]), [c]) },
            };
            // self-check: every form must expand to the same polynomial
            for (const [key, f] of Object.entries(F))
                if (f.poly.length !== 3 || f.poly.some((v, i) => v !== std[i])) throw new Error(`form ${key} is not equivalent: ${f.poly} vs ${std}`);

            const ask = pick(['xint', 'xint', 'vertex', 'extremum', 'xvertex']);
            const mm = a > 0 ? 'minimum' : 'maximum';
            const asks = {
                xint: 'the <i>x</i>-intercepts of the parabola as constants or coefficients',
                vertex: 'the coordinates of the vertex of the parabola as constants or coefficients',
                extremum: `the ${mm} value of \\(y\\) as a constant or coefficient`,
                xvertex: 'the <i>x</i>-coordinate of the vertex of the parabola as a constant or coefficient',
            };
            let given, keyForm, others;
            if (ask === 'xint') {
                given = pick(['standard', 'standard', 'vertex']);
                keyForm = 'factored';
                others = ['partial', 'stdShift', given === 'vertex' ? 'standard' : pick(['vertex', 'vertexShift'])];
            } else {
                // y - k = a(x - h)^2 also shows the vertex, so it is never a distractor here
                given = pick(['standard', 'standard', 'factored']);
                keyForm = 'vertex';
                others = ['partial', 'stdShift', given === 'factored' ? 'standard' : 'factored'];
            }
            const built = makeChoices(`\\(${F[keyForm].tex}\\)`, others.map(o => `\\(${F[o].tex}\\)`));
            const formOf = new Map([keyForm, ...others].map(o => [`\\(${F[o].tex}\\)`, o]));
            const givenTex = F[given].tex;
            const questionText = pick([
                `$$${givenTex}$$<p>The given equation represents a parabola in the <i>xy</i>-plane. Which of the following equivalent forms of the equation displays ${asks[ask]}?</p>`,
                `<p>A parabola in the <i>xy</i>-plane has equation \\(${givenTex}\\). Which equivalent form of this equation displays ${asks[ask]}?</p>`,
            ]);
            const feature = ask === 'xint' ? `x-intercepts (${r1}, 0) and (${r2}, 0)` : `vertex (${h}, ${k})`;
            return {
                questionText,
                choices: built.choices,
                answer: built.answer,
                desmosSolutions: [
                    ...built.choices.map((ch, i) => ({ id: `form${CHOICE_LETTERS[i]}`, latex: F[formOf.get(ch)].tex.replace(/ /g, '') })),
                    { type: 'text', id: 'note1', text: `All four equations draw the same parabola, so they are equivalent. Click it: the vertex is (${h}, ${k}) and the x-intercepts are (${Math.min(r1, r2)}, 0) and (${Math.max(r1, r2)}, 0).` },
                    { type: 'text', id: 'note2', text: ask === 'xint'
                        ? `Factored form a(x - r)(x - s) shows the x-intercepts r and s directly. In ${noteText(F.partial.tex)}, the 0 and ${s} are not x-intercepts because of the added constant.`
                        : `Vertex form a(x - h)² + k shows the vertex (h, k), and k is the ${mm} value of y.` },
                    { type: 'text', id: 'note3', text: `The question asks for the ${feature.split(' (')[0]}, so the answer is ${built.answer}) ${noteText(built.choices[CHOICE_LETTERS.indexOf(built.answer)])}` },
                ],
            };
        },
    },

    // ===== #10 =====
    {
        id: 'nlf-exp-two-points',
        title: '(Hard) Exponential Constants from Two Points',
        skill: 'Nonlinear functions',
        source: SRC.CBS,
        tips: [
            'Substitute each point into the equation to get one equation per point. For \\(h(x) = a^x + b\\), use \\(x = 0\\) first: \\(a^0 = 1\\), so \\(h(0) = 1 + b\\) gives \\(b\\) right away. Then the other point gives \\(a\\).',
            'For \\(f(x) = ab^x\\), divide the two outputs: \\(\\frac{f(3)}{f(1)} = b^2\\), so take a square root to get \\(b\\), then \\(a = \\frac{f(1)}{b}\\). Trap: the ratio of two outputs two steps apart is \\(b^2\\), not \\(b\\).',
            'Read the question last: "the value of \\(ab\\)" means \\(a\\) times \\(b\\), not \\(a\\) times a y-value and not \\(a^{-2}b\\). Desmos: type <code>b=</code> and <code>a=</code> from your two equations, then type the expression asked for.',
        ],
        questionGenerator() {
            const targetLetter = pick(CHOICE_LETTERS);
            let inst = null;
            for (let attempt = 0; attempt < 300 && !(inst && inst.built.answer === targetLetter); attempt++) {
                const cand = Math.random() < 0.55 ? sumForm() : productForm();
                if (cand) inst = cand;
            }
            if (!inst) throw new Error('nlf-exp-two-points: no instance');   // unreachable: both builders almost always succeed

            // CB Q8: h(x) = a^x + b through (0, 1 + b) and (x2, a^x2 + b); asks for ab
            function sumForm() {
                const a = randInt(2, 7), b = randInt(2, 12);
                const x2 = pick([-2, -2, -1, 2]);
                const n = Math.abs(x2);
                const y2 = x2 < 0 ? [1 + b * a ** n, a ** n] : [a ** n + b, 1];
                const key = a * b;
                const pool = [
                    x2 < 0 ? fracChoice(b, a ** n) : fracChoice(a ** n * b),   // a^x2 · b: kept the point's exponent (CB)
                    fracChoice(a * (1 + b)),                                    // a times the first y-value, not b (CB)
                    fracChoice(a + b),                                          // a + b
                    fracChoice(b),                                              // stopped at b
                ];
                if (x2 === -2) pool.push(fracChoice(a * a * b));               // a^{-2} read as a^2
                if (x2 === 2) pool.push(fracChoice(a * (a * a + b)));          // a times the second y-value
                const built = makeChoicesSorted(fracChoice(key), shuffle(pool).slice(0, 3));
                if (!built) return null;
                return { form: 'sum', a, b, x2, y2, key, built };
            }
            // f(x) = ab^x through (x1, a·b^x1) and (x1 + 2, a·b^(x1+2)); asks for f(0) or the next value
            function productForm() {
                const x1 = pick([1, 1, 2]), x2 = x1 + 2;
                const a = randInt(2, 7), b = x1 === 1 ? randInt(2, 5) : randInt(2, 3);
                const y1 = a * b ** x1, y2 = a * b ** x2;
                const ask = pick(['f0', 'next']);
                let key, pool;
                if (ask === 'f0') {
                    key = fracChoice(a);
                    pool = [
                        fracChoice(y1),                          // the y-value at x1, not at 0
                        fracChoice(b),                           // the base instead of the coefficient
                        fracChoice(y1, (b * b) ** x1),           // used the ratio b^2 as b (no square root)
                        fracChoice(b * b),                       // the ratio itself
                    ];
                } else {
                    const xn = x2 + 1;
                    key = fracChoice(a * b ** xn);
                    pool = [
                        fracChoice(2 * y2 + (y2 - y1), 2),       // linear: added the average change per unit, (y2 - y1)/2
                        fracChoice(y2 * b * b),                  // multiplied by the two-step ratio b^2 instead of b
                        fracChoice(b ** xn),                     // forgot the coefficient a
                        fracChoice(2 * y2 - y1),                 // added the two-step difference again (linear)
                    ];
                }
                const built = makeChoicesSorted(key, shuffle(pool).slice(0, 3));
                if (!built) return null;
                return { form: 'product', ask, a, b, x1, x2, y1, y2, built };
            }

            const fn = pick(['f', 'g', 'h']);
            let questionText, desmos;
            if (inst.form === 'sum') {
                const { a, b, x2, y2 } = inst;
                const p2 = y2[1] === 1 ? `${y2[0]}` : `\\frac{${y2[0]}}{${y2[1]}}`;
                questionText = pick([
                    `<p>The function \\(${fn}\\) is defined by \\(${fn}(x) = a^x + b\\), where \\(a\\) and \\(b\\) are positive constants. The graph of \\(y = ${fn}(x)\\) in the <i>xy</i>-plane passes through the points \\((0, ${1 + b})\\) and \\(\\left(${x2}, ${p2}\\right)\\). What is the value of \\(ab\\)?</p>`,
                    `<p>For the function \\(${fn}\\) defined by \\(${fn}(x) = a^x + b\\), where \\(a\\) and \\(b\\) are positive constants, the graph of \\(y = ${fn}(x)\\) in the <i>xy</i>-plane contains the points \\((0, ${1 + b})\\) and \\(\\left(${x2}, ${p2}\\right)\\). What is the value of \\(ab\\)?</p>`,
                ]);
                desmos = [
                    { type: 'text', id: 'note1', text: `At x = 0: a⁰ + b = 1 + b = ${1 + b}, so b = ${b}.` },
                    { id: 'b', latex: `b=${1 + b}-1` },
                    { type: 'text', id: 'note2', text: `At x = ${x2}: a^(${x2}) + b = ${y2[1] === 1 ? y2[0] : `${y2[0]}/${y2[1]}`}, so a^(${x2}) = ${y2[1] === 1 ? y2[0] - b : `1/${y2[1]}`}. Solve for a (a is positive):` },
                    { id: 'a', latex: `a=\\left(\\frac{${y2[0]}}{${y2[1]}}-b\\right)^{\\frac{1}{${x2}}}` },
                    { id: 'ab', latex: 'ab' },
                    { type: 'text', id: 'note3', text: `a = ${a} and b = ${b}, so ab = ${a * b}.` },
                ];
            } else {
                const { a, b, x1, x2, y1, y2, ask } = inst;
                const xn = x2 + 1;
                questionText = `<p>The function \\(${fn}\\) is defined by \\(${fn}(x) = ab^x\\), where \\(a\\) and \\(b\\) are positive constants. The graph of \\(y = ${fn}(x)\\) in the <i>xy</i>-plane passes through the points \\((${x1}, ${texNum(y1)})\\) and \\((${x2}, ${texNum(y2)})\\). What is the value of \\(${fn}(${ask === 'f0' ? 0 : xn})\\)?</p>`;
                desmos = [
                    { type: 'text', id: 'note1', text: `Dividing the outputs: ${y2}/${y1} = b^${x2 - x1} = ${b * b}, so b = ${b}. Then a = ${y1}/b^${x1} = ${a}.` },
                    { id: 'b', latex: `b=\\left(\\frac{${y2}}{${y1}}\\right)^{\\frac{1}{${x2 - x1}}}` },
                    { id: 'a', latex: `a=\\frac{${y1}}{b^{${x1}}}` },
                    { id: 'fn', latex: `${fn}\\left(x\\right)=ab^{x}` },
                    { id: 'val', latex: `${fn}\\left(${ask === 'f0' ? 0 : xn}\\right)` },
                    { type: 'text', id: 'note3', text: `${fn}(${ask === 'f0' ? 0 : xn}) = ${ask === 'f0' ? a : a * b ** xn}.` },
                ];
            }
            const keyHtml = inst.built.choices[CHOICE_LETTERS.indexOf(inst.built.answer)];
            desmos.push({ type: 'text', id: 'note4', text: `Answer: ${inst.built.answer}) ${noteText(keyHtml)}` });
            return { questionText, choices: inst.built.choices, answer: inst.built.answer, desmosSolutions: desmos };
        },
    },

    // ===== #26 =====
    {
        id: 'eqx-combine-rational',
        title: '(Hard) Add or Subtract Rational Expressions',
        skill: 'Equivalent expressions',
        source: SRC.CBS,
        tips: [
            'To add or subtract fractions with different denominators, use the common denominator \\((ax + b)(cx + d)\\): multiply each numerator by the <i>other</i> denominator, then combine. \\(\\frac{4}{4x - 5} - \\frac{1}{x + 1} = \\frac{4(x + 1) - 1(4x - 5)}{(x + 1)(4x - 5)} = \\frac{9}{(x + 1)(4x - 5)}\\).',
            'Traps: combining tops and bottoms separately, as in \\(\\frac{4 - 1}{(4x - 5) - (x + 1)}\\); not distributing the minus sign to every term of the second numerator; and multiplying each numerator by its <i>own</i> denominator.',
            'Desmos: graph the given expression as \\(y = \\ldots\\), then graph each choice. Only the equivalent choice lies exactly on top of it everywhere.',
        ],
        questionGenerator() {
            for (let attempt = 0; attempt < 200; attempt++) {
                const a = randInt(1, 5), c = randInt(1, 5), b = randNonZero(-9, 9), d = randNonZero(-9, 9);
                if (a * d === b * c || gcd(a, b) !== 1 || gcd(c, d) !== 1) continue;   // the denominators share no factor
                const minus = Math.random() < 0.65;
                let p, q;
                if (minus && Math.random() < 0.5) { const t = randInt(1, 2); p = a * t; q = c * t; }   // a constant numerator, as in CB Q10
                else { p = randInt(1, 6); q = randInt(1, 6); }
                const sg = minus ? -1 : 1;
                const num = [p * c + sg * q * a, p * d + sg * q * b];                 // p(cx + d) ± q(ax + b)
                if (num[0] === 0 && num[1] === 0) continue;
                const den1 = polyTex([a, b]), den2 = polyTex([c, d]);
                const prod = `(${den1})(${den2})`;
                // a negative constant numerator is written in front of the fraction: -\frac{1}{…}
                const fr = (n, dn) => (/^-\d+$/.test(String(n)) ? `-\\frac{${String(n).slice(1)}}{${dn}}` : `\\frac{${n}}{${dn}}`);
                const key = fr(polyTex(num), prod);
                const wrong = [
                    fr(`${p + sg * q}`, polyTex([a + sg * c, b + sg * d])),                       // tops and bottoms combined separately
                    fr(polyTex(minus ? [p * c - q * a, p * d + q * b] : [p * c - q * a, p * d - q * b]), prod),   // sign not distributed / subtracted instead of added
                    fr(polyTex([p * a + sg * q * c, p * b + sg * q * d]), prod),                // each numerator times its own denominator
                    fr(`${p + sg * q}`, prod),                                                   // numerators combined over the product
                ];
                // self-check: the key equals the original at several x-values, and no distractor does
                const orig = x => p / (a * x + b) + sg * q / (c * x + d);
                const evalFrac = (n, dfn) => x => n(x) / dfn(x);
                const fns = [
                    evalFrac(x => num[0] * x + num[1], x => (a * x + b) * (c * x + d)),
                    evalFrac(() => p + sg * q, x => (a + sg * c) * x + b + sg * d),
                    evalFrac(x => (minus ? (p * c - q * a) * x + p * d + q * b : (p * c - q * a) * x + p * d - q * b), x => (a * x + b) * (c * x + d)),
                    evalFrac(x => (p * a + sg * q * c) * x + p * b + sg * q * d, x => (a * x + b) * (c * x + d)),
                    evalFrac(() => p + sg * q, x => (a * x + b) * (c * x + d)),
                ];
                const xs = [0.37, 1.91, -2.73, 4.13, 7.7];
                const equiv = f => xs.every(x => Math.abs(f(x) - orig(x)) < 1e-9 * Math.max(1, Math.abs(orig(x))));
                if (!equiv(fns[0])) throw new Error('key not equivalent');
                const distr = wrong.map((w, i) => [w, fns[i + 1]]).filter(([w, f]) => !equiv(f) && w !== key && !/\\frac\{0\}/.test(w) && !/\{0\}$/.test(w));
                if (distr.length < 3) continue;
                const chosen = shuffle(distr).slice(0, 3).map(([w]) => w);
                if (new Set([key, ...chosen]).size !== 4) continue;
                // choices use \dfrac so the stacked fractions are readable at choice size
                const big = w => `\\(${w.replace(/\\frac/g, '\\dfrac')}\\)`;
                const built = makeChoices(big(key), chosen.map(big));
                const given = `${fr(p, den1)} ${minus ? '-' : '+'} ${fr(q, den2)}`;
                const dz = s => s.replace(/ /g, '').replace(/\(/g, '\\left(').replace(/\)/g, '\\right)');
                return {
                    questionText: pick([
                        `<p>Which expression is equivalent to \\(${given}\\)?</p>`,
                        `$$${given}$$<p>Which of the following is equivalent to the given expression for all values of \\(x\\) for which the expression is defined?</p>`,
                    ]),
                    choices: built.choices,
                    answer: built.answer,
                    desmosSolutions: [
                        { id: 'given', latex: `y=${dz(given)}` },
                        ...built.choices.map((ch, i) => ({ id: `ch${CHOICE_LETTERS[i]}`, latex: `y=${dz(ch.slice(2, -2).replace(/\\dfrac/g, '\\frac'))}` })),
                        { type: 'text', id: 'note1', text: `Common denominator (${polyText([a, b])})(${polyText([c, d])}): the numerator is ${p}(${polyText([c, d])}) ${minus ? '-' : '+'} ${q}(${polyText([a, b])}) = ${polyText(num)}.` },
                        { type: 'text', id: 'note2', text: `Only one choice's graph lies exactly on the given expression's graph. Answer: ${built.answer}` },
                    ],
                };
            }
            throw new Error('eqx-combine-rational: no instance');
        },
    },

    // ===== #27 =====
    {
        id: 'nleq-discriminant-condition',
        title: '(Hard) Constant That Gives No (or Two) Real Solutions',
        skill: 'Nonlinear equations in one variable and systems of equations in two variables',
        source: SRC.CBS,
        tips: [
            'For \\(ax^2 + bx + c = 0\\), the discriminant \\(b^2 - 4ac\\) decides the number of real solutions: negative means none, zero means exactly one, positive means two. Write the condition as an inequality and solve it for the unknown constant.',
            'For \\(2x^2 + 8x + c = 0\\) to have no real solutions: \\(64 - 8c < 0\\), so \\(c > 8\\). Traps: choosing the boundary value itself (8 gives exactly one solution) and flipping the inequality. For an unknown \\(b\\), remember that \\(b\\) can be negative: \\(b^2 < 64\\) means \\(-8 < b < 8\\).',
            'Desmos: type the equation as <code>y=2x^2+8x+c</code> and add a slider for \\(c\\). Drag it: no real solutions means the parabola never touches the x-axis; two means it crosses twice.',
        ],
        questionGenerator() {
            const fmt = v => `\\(${v}\\)`;
            // The condition is chosen inside the loop: with an unknown c, every wrong value is on one side of the
            // threshold (key smallest or largest); an unknown b with "no real solutions" puts the key in the middle.
            const inst = balancedChoice(target => {
                const want = pick(['none', 'two']);
                if (Math.random() < 0.6) {   // unknown c: threshold c* = b²/(4a) = a·m² with b = 2am
                    const a = randInt(1, 4), m = randInt(1, 6), b = 2 * a * m * pick([1, -1]), T = a * m * m;
                    const del = randInt(1, 9);
                    let key, pool;
                    if (want === 'none') {   // need c > T
                        key = T + del;
                        pool = [T, T - randInt(1, 9), -key, -T];                       // boundary; wrong side; sign-flipped
                    } else {                 // need c < T
                        key = T - del;
                        pool = [T, T + randInt(1, 9), 4 * T, 2 * T];                    // boundary; wrong side; b²/a; b²/(2a)
                    }
                    pool = pool.filter(v => (want === 'none' ? v <= T : v >= T));       // every distractor fails the condition
                    const built = choicesFromPool(key, pool, fmt, target);
                    return built && { ...built, want, unknown: 'c', a, b, T, key };
                }
                // unknown b: threshold |b| = 2√(ac) = 2am with c = a·m²
                const a = randInt(1, 3), m = randInt(1, 6), c = a * m * m, T = 2 * a * m;
                let key, pool;
                if (want === 'none') {   // need |b| < T
                    key = randInt(1, T - 1);
                    pool = [T, -T, T + randInt(1, 6), -(T + randInt(1, 6))];
                } else {                 // need |b| > T
                    key = pick([1, -1]) * (T + randInt(1, 6));
                    pool = [T, -T, randInt(0, T - 1), -randInt(1, T - 1)].filter(v => Math.abs(v) <= T);
                }
                if (key === 0) return null;
                const built = choicesFromPool(key, pool, fmt, target);
                return built && { ...built, want, unknown: 'b', a, c, T, key };
            });
            const { unknown, a, T, want } = inst;
            const k = unknown;
            const eq = unknown === 'c' ? `${polyTex([a, inst.b, 0])} + c = 0` : `${polyTex([a, 0, 0])} + bx + ${inst.c} = 0`;
            const cond = want === 'none' ? 'has no real solutions' : 'has two distinct real solutions';
            // self-check: exactly one choice satisfies the condition
            const ok = v => { const D = unknown === 'c' ? inst.b * inst.b - 4 * a * v : v * v - 4 * a * inst.c; return want === 'none' ? D < 0 : D > 0; };
            const vals = inst.choices.map(ch => Number(ch.slice(2, -2)));
            if (vals.filter(ok).length !== 1 || !ok(vals[CHOICE_LETTERS.indexOf(inst.answer)])) throw new Error('condition check failed');
            const disc = unknown === 'c' ? `${inst.b * inst.b} - ${4 * a}c` : `b² - ${4 * a * inst.c}`;
            const sol = unknown === 'c' ? (want === 'none' ? `c > ${T}` : `c < ${T}`) : (want === 'none' ? `-${T} < b < ${T}` : `b < -${T} or b > ${T}`);
            return {
                questionText: `$$${eq}$$<p>In the given equation, \\(${k}\\) is a constant. The equation ${cond}. Which of the following could be the value of \\(${k}\\)?</p>`,
                choices: inst.choices,
                answer: inst.answer,
                desmosSolutions: [
                    { id: 'par', latex: unknown === 'c' ? `y=${polyTex([a, inst.b, 0]).replace(/ /g, '')}+c` : `y=${polyTex([a, 0, 0]).replace(/ /g, '')}+bx+${inst.c}` },
                    { id: 'slider', latex: `${k}=${inst.key}` },
                    { type: 'text', id: 'note1', text: `Discriminant: ${disc}. ${want === 'none' ? 'No real solutions: it must be negative' : 'Two real solutions: it must be positive'}, so ${sol}. At ${k} = ${unknown === 'c' ? T : `±${T}`} there is exactly one solution (the boundary).` },
                    { type: 'text', id: 'note2', text: `Drag the slider: at ${k} = ${inst.key} the parabola ${want === 'none' ? 'stays off' : 'crosses'} the x-axis. Answer: ${inst.answer}) ${inst.key}` },
                ],
            };
        },
    },

    // ===== #28 =====
    {
        id: 'nleq-quadratic-positive-solution',
        title: '(Easy) Positive Solution of a Factorable Quadratic',
        skill: 'Nonlinear equations in one variable and systems of equations in two variables',
        source: ACE_AM + 'nonlinear-equations-solutions-for-quadratic',
        tips: [
            'Get everything on one side so the other side is 0, then factor: \\(x^2 - 3x - 28 = (x - 7)(x + 4)\\), so \\(x = 7\\) or \\(x = -4\\). The question wants only the positive one.',
            'If the equation is not in standard form, such as \\(x(x + 5) = 24\\), expand and move the 24 first: you can&#39;t set each factor equal to 24. With a leading coefficient, a factor like \\(2x - 5 = 0\\) gives \\(x = \\frac{5}{2}\\) (enter 5/2 or 2.5).',
            'Desmos: graph \\(y =\\) (left side) and \\(y =\\) (right side) and click the intersection with the positive x-value, or graph the difference and click its positive x-intercept.',
        ],
        questionGenerator() {
            const form = pick(['monic', 'lead', 'product', 'moved']);
            let lhs, rhs, answer, fac, negRoot;
            for (let attempt = 0; attempt < 100; attempt++) {
                const n = randInt(1, 9);                                 // the negative root is -n
                negRoot = -n;
                if (form === 'monic' || form === 'product') {
                    const r = randInt(2, 12);
                    if (r === n) continue;
                    const B = n - r, C = -r * n;                         // x² + Bx + C with roots r and -n
                    answer = r; fac = `(x - ${r})(x + ${n})`;
                    if (form === 'monic') { lhs = polyTex([1, B, C]); rhs = '0'; }
                    else { if (B === 0) continue; lhs = `x(${polyTex([1, B])})`; rhs = `${-C}`; }   // x(x + B) = -C
                } else {
                    const k = randInt(2, 6), m = randInt(1, 15);        // (kx - m)(x + n): roots m/k and -n
                    if (gcd(k, m) !== 1 || fracStr(m, k).length > 5) continue;
                    const A = k, B = k * n - m, C = -m * n;
                    answer = fracStr(m, k); fac = `(${k}x - ${m})(x + ${n})`;
                    if (form === 'lead') { lhs = polyTex([A, B, C]); rhs = '0'; }
                    else { lhs = `${A}x^2`; rhs = polyTex([-B, -C]); }         // A x² = -Bx - C
                }
                break;
            }
            const L = lhs.replace(/ /g, ''), R = rhs.replace(/ /g, '');
            const ansVal = typeof answer === 'number' ? answer : Number(answer.split('/')[0]) / Number(answer.split('/')[1]);
            return {
                questionText: pick([
                    `$$${lhs} = ${rhs}$$<p>What is the positive solution to the given equation?</p>`,
                    `<p>What is the positive solution to the equation \\(${lhs} = ${rhs}\\)?</p>`,
                ]),
                answer,
                desmosSolutions: [
                    { id: 'diff', latex: R === '0' ? `y=${L}` : `y=${L}-\\left(${R}\\right)` },
                    { id: 'pt', latex: `(${ansVal},0)`, label: 'positive solution', showLabel: true },
                    { type: 'text', id: 'note1', text: `${rhs === '0' ? '' : 'Move everything to one side first. '}It factors as ${fac} = 0, so the solutions are ${answer} and ${negRoot}.` },
                    { type: 'text', id: 'note2', text: `The positive solution is ${answer}${typeof answer === 'string' ? ` (or ${roundTo(ansVal, 4)})` : ''}.` },
                ],
            };
        },
    },

    // ===== #29 =====
    {
        id: 'nlf-factored-x-intercepts',
        title: '(Easy) x-Intercepts from Factored Form',
        skill: 'Nonlinear functions',
        source: SRC.OUT,
        tips: [
            'An x-intercept is where \\(f(x) = 0\\). A product is 0 when one factor is 0, so set each factor equal to 0: \\(x - 5 = 0\\) gives \\(x = 5\\), and \\(2x + 3 = 0\\) gives \\(x = -\\frac{3}{2}\\). The intercepts are \\((5, 0)\\) and \\(\\left(-\\frac{3}{2}, 0\\right)\\).',
            'Traps: the sign (\\(x - 5\\) gives \\(+5\\), not \\(-5\\)), ignoring the coefficient (\\(2x + 3\\) gives \\(-\\frac{3}{2}\\), not \\(-3\\)), and the y-intercept \\((0, f(0))\\), which is where the graph crosses the other axis.',
            'Desmos: graph \\(f\\) and click the points where it crosses the x-axis.',
        ],
        questionGenerator() {
            const fn = pick(['f', 'g', 'h']);
            for (let attempt = 0; attempt < 200; attempt++) {
                const cubic = Math.random() < 0.3;
                const lead = Math.random() < 0.25 ? -1 : 1;
                // factors (k x - m): root m/k
                const facs = cubic
                    ? [[1, randNonZero(-9, 9)], [1, randNonZero(-9, 9)], [1, randNonZero(-9, 9)]]
                    : [[1, randNonZero(-9, 9)], [randInt(2, 5), randNonZero(-9, 9)]];
                if (facs.some(([k, m]) => gcd(k, m) !== 1)) continue;
                const roots = facs.map(([k, m]) => [m, k]);
                const rv = roots.map(([m, k]) => m / k);
                if (new Set(rv).size !== rv.length) continue;
                const f = x => lead * facs.reduce((acc, [k, m]) => acc * (k * x - m), 1);
                const y0 = f(0);
                const keyRoot = pick(roots);
                const pt = (n, d) => [n / d, pointTexAM(n, d)];
                // errors: a root with its sign flipped; a root with the coefficient ignored; the y-intercept as a point
                const cand = [];
                roots.forEach(([m, k]) => { cand.push(pt(-m, k)); if (k !== 1) cand.push(pt(m, 1), pt(-m, 1)); });
                const yint = [null, `\\(\\left(0, ${y0}\\right)\\)`];
                const pool = cand.filter(([x]) => Math.abs(f(x)) > 1e-9);   // never another true x-intercept
                const uniq = [...new Map(pool.map(p => [p[1], p])).values()];
                if (uniq.length < 2) continue;
                const chosen = shuffle(uniq).slice(0, 2).map(p => p[1]);
                const keyHtml = pointTexAM(keyRoot[0], keyRoot[1]);
                if (new Set([keyHtml, ...chosen, yint[1]]).size !== 4) continue;
                const built = makeChoices(keyHtml, [...chosen, yint[1]]);
                const facTex = facs.map(([k, m]) => `(${polyTex([k, -m])})`).join('');
                const def = `${lead === -1 ? '-' : ''}${facTex}`;
                // self-check: exactly one choice is a true x-intercept
                const isX = h => { const m = h.match(/\\left\((.*), (.*)\\right\)/); const yv = Number(m[2]); if (yv !== 0) return false; const xv = m[1].replace(/\\frac\{(\d+)\}\{(\d+)\}/, '($1/$2)'); return Math.abs(f(Function(`return ${xv}`)())) < 1e-9; };
                if (built.choices.filter(isX).length !== 1 || !isX(built.choices[CHOICE_LETTERS.indexOf(built.answer)])) throw new Error('x-intercept check failed');
                return {
                    questionText: pick([
                        `<p>The function \\(${fn}\\) is defined by \\(${fn}(x) = ${def}\\). Which of the following is an <i>x</i>-intercept of the graph of \\(y = ${fn}(x)\\) in the <i>xy</i>-plane?</p>`,
                        `$$${fn}(x) = ${def}$$<p>The function \\(${fn}\\) is defined by the given equation. Which of the following is an <i>x</i>-intercept of the graph of \\(y = ${fn}(x)\\) in the <i>xy</i>-plane?</p>`,
                    ]),
                    choices: built.choices,
                    answer: built.answer,
                    desmosSolutions: [
                        { id: 'fn', latex: `${fn}(x)=${def.replace(/ /g, '')}` },
                        { type: 'text', id: 'note1', text: `Set each factor equal to 0: ${facs.map(([k, m]) => `${polyText([k, -m])} = 0 gives x = ${fracStr(m, k)}`).join('; ')}.` },
                        { type: 'text', id: 'note2', text: `The x-intercepts are ${roots.map(([m, k]) => `(${fracStr(m, k)}, 0)`).join(', ')}. (0, ${y0}) is the y-intercept. Answer: ${built.answer}) ${noteText(built.choices[CHOICE_LETTERS.indexOf(built.answer)])}` },
                    ],
                };
            }
            throw new Error('nlf-factored-x-intercepts: no instance');
        },
    },

    // ===== #30 =====
    {
        id: 'nlf-y-intercept',
        title: '(Easy) y-Intercept of a Nonlinear Function',
        skill: 'Nonlinear functions',
        source: ACE_AM + 'nonlinear-functions-y-intercept',
        tips: [
            'The y-intercept is where \\(x = 0\\), so its y-coordinate is \\(f(0)\\). Substitute 0 for every \\(x\\).',
            'For \\(f(x) = a(b)^x + c\\), remember \\(b^0 = 1\\), so \\(f(0) = a + c\\), not \\(ab + c\\) and not \\(c\\). For a factored polynomial, multiply the constants: \\(3(0 - 2)(0 + 5) = -30\\). Watch the signs.',
            'Desmos: define the function and type <code>f(0)</code>, or graph it and click where it crosses the y-axis.',
        ],
        questionGenerator() {
            const fn = pick(['f', 'g', 'h']);
            const form = pick(['exp', 'exp', 'exp', 'quad', 'cubic', 'vertex']);
            let def, b0;
            if (form === 'exp') {
                const a = randNonZero(-9, 9), base = randInt(2, 9), c = randNonZero(-20, 20);
                def = `${lead(a)}(${base})^x${term(c, '')}`; b0 = a + c;
            } else if (form === 'quad') {
                const a = randNonZero(-5, 5), p = randNonZero(-9, 9), q = randNonZero(-9, 9);
                def = `${lead(a)}(${shiftTex(p)})(${shiftTex(-q)})`; b0 = a * (-p) * q;
            } else if (form === 'cubic') {
                const k = randNonZero(-3, 3), r = [randNonZero(-6, 6), randNonZero(-6, 6), randNonZero(-6, 6)];
                def = `${lead(k)}${r.map(v => `(${shiftTex(v)})`).join('')}`; b0 = k * r.reduce((acc, v) => acc * -v, 1);
            } else {
                const a = randNonZero(-4, 4), h = randNonZero(-7, 7), k = randInt(-20, 20);
                def = vertexTex(a, h, k); b0 = a * h * h + k;
            }
            const questionText = pick([
                `<p>The function \\(${fn}\\) is defined by \\(${fn}(x) = ${def}\\). The graph of \\(y = ${fn}(x)\\) in the <i>xy</i>-plane has a <i>y</i>-intercept at \\((0, k)\\). What is the value of \\(k\\)?</p>`,
                `$$${fn}(x) = ${def}$$<p>What is the <i>y</i>-coordinate of the <i>y</i>-intercept of the graph of \\(y = ${fn}(x)\\) in the <i>xy</i>-plane?</p>`,
            ]);
            return {
                questionText,
                answer: b0,
                desmosSolutions: [
                    { id: 'fn', latex: `${fn}(x)=${def.replace(/ /g, '')}` },
                    { id: 'val', latex: `${fn}(0)` },
                    { type: 'text', id: 'note1', text: form === 'exp' ? `At x = 0 the power is 1 (any nonzero number to the 0 power is 1), so ${fn}(0) = (coefficient) + (constant).` : 'Substitute x = 0 into every factor and multiply (or evaluate the expression).' },
                    { type: 'text', id: 'note2', text: `${fn}(0) = ${b0}, so the y-intercept is (0, ${b0}). Answer: ${b0}` },
                ],
            };
        },
    },

    // ===== #46 =====
    {
        id: 'nleq-absolute-value',
        title: '(Medium) Absolute Value Equation',
        skill: 'Nonlinear equations in one variable and systems of equations in two variables',
        source: ACE_AM + 'nonlinear-equations-absolute-value-solutions',
        tips: [
            'Isolate the absolute value first, then split into two equations: \\(|2x - 7| = 11\\) means \\(2x - 7 = 11\\) or \\(2x - 7 = -11\\), so \\(x = 9\\) or \\(x = -2\\).',
            'For \\(a|x - h| + c = k\\), subtract \\(c\\) and divide by \\(a\\) before splitting. Read the question: it may want the sum of both solutions, the positive one, or the greater one.',
            'Desmos: graph \\(y = |2x - 7|\\) (type <code>abs</code> or the | key) and \\(y = 11\\), then click both intersection points.',
        ],
        questionGenerator() {
            for (let attempt = 0; attempt < 200; attempt++) {
                let lhsTex, rhs, sols, isolate;
                if (Math.random() < 0.6) {   // |px + q| = k
                    const p = pick([1, 2, 2, 3, 4, 5]), q = randNonZero(-15, 15), k = randInt(1, 20);
                    sols = [(k - q) / p, (-k - q) / p];
                    lhsTex = `\\left|${polyTex([p, q])}\\right|`; rhs = k;
                    isolate = `${polyText([p, q])} = ${k} or ${polyText([p, q])} = -${k}`;
                    var fr = [[k - q, p], [-k - q, p]];
                } else {                     // a|x - h| + c = k with (k - c)/a > 0
                    const a = randInt(2, 5), h = randNonZero(-9, 9), m = randInt(1, 12), c = randInt(-15, 15);
                    const k = a * m + c;
                    sols = [h + m, h - m];
                    lhsTex = `${a}\\left|${shiftTex(h)}\\right|${term(c, '')}`; rhs = k;
                    isolate = `|x ${h > 0 ? '-' : '+'} ${Math.abs(h)}| = (${k} − ${c < 0 ? `(${c})` : c})/${a} = ${m}, so x = ${h} + ${m} or x = ${h} − ${m}`;
                    var fr = [[h + m, 1], [h - m, 1]];
                }
                const askOpts = ['sum', 'greater'];
                if (sols.filter(s => s > 0).length === 1) askOpts.push('positive', 'positive');
                const ask = pick(askOpts);
                let answer;
                if (ask === 'sum') { const [[n1, d1], [n2, d2]] = fr; answer = fracStr(n1 * d2 + n2 * d1, d1 * d2); }
                else { const pickF = ask === 'greater' ? (sols[0] > sols[1] ? fr[0] : fr[1]) : fr[sols.findIndex(s => s > 0)]; answer = fracStr(...pickF); }
                if (String(answer).replace(/^-/, '').length > 5) continue;
                const eq = `${lhsTex} = ${rhs}`;
                const askText = { sum: 'What is the sum of the solutions to the given equation?', greater: 'What is the greater of the two solutions to the given equation?', positive: 'What is the positive solution to the given equation?' }[ask];
                return {
                    questionText: `$$${eq}$$<p>${askText}</p>`,
                    answer,
                    desmosSolutions: [
                        { id: 'left', latex: `y=${lhsTex.replace(/ /g, '')}` },
                        { id: 'right', latex: `y=${rhs}` },
                        { type: 'text', id: 'note1', text: `Split the absolute value: ${isolate}. The solutions are ${fracStr(...fr[0])} and ${fracStr(...fr[1])}.` },
                        { type: 'text', id: 'note2', text: `The question asks for the ${ask === 'sum' ? 'sum' : ask === 'greater' ? 'greater solution' : 'positive solution'}. Answer: ${answer}` },
                    ],
                };
            }
            throw new Error('nleq-absolute-value: no instance');
        },
    },

    // ===== #47 =====
    {
        id: 'nleq-linear-quadratic-system',
        title: '(Medium) Intersection of a Line and a Parabola',
        skill: 'Nonlinear equations in one variable and systems of equations in two variables',
        source: ACE_AM + 'nonlinear-equations-systems-of-equations-solution-for-x',
        tips: [
            'Set the two expressions for \\(y\\) equal, move everything to one side, and solve the quadratic: \\(x^2 - 4x + 1 = 2x - 7\\) becomes \\(x^2 - 6x + 8 = 0\\), so \\(x = 2\\) or \\(x = 4\\). Substitute an \\(x\\) into the line to get the matching \\(y\\).',
            'Traps: adding the line instead of subtracting it, sign errors when factoring, and giving a \\(y\\)-value when the question asks for \\(x\\) (or the reverse).',
            'Desmos: graph both equations and click the intersection points. Their coordinates are the solutions \\((x, y)\\).',
        ],
        questionGenerator() {
            const fmt = v => `\\(${v}\\)`;
            const inst = balancedChoice(target => {
                const a = pick([1, 1, 1, 2]), r1 = randNonZero(-8, 8), r2 = randNonZero(-8, 8);
                if (r1 === r2 || r1 === -r2) return null;   // two distinct intersections, not tangent
                const m = randNonZero(-5, 5), n = randInt(-12, 12);
                const b = m - a * (r1 + r2), c = n + a * r1 * r2;
                const askY = Math.random() < 0.3;
                const [x1, x2] = [r1, r2], y1 = m * x1 + n, y2 = m * x2 + n;
                // wrong combination: a x² + (b + m)x + (c + n) = 0 (the line added instead of subtracted), integer roots only
                const D = (b + m) ** 2 - 4 * a * (c + n);
                const wrong = [];
                if (D >= 0 && Number.isInteger(Math.sqrt(D))) { const s = Math.sqrt(D); [(-(b + m) + s) / (2 * a), (-(b + m) - s) / (2 * a)].forEach(v => Number.isInteger(v) && wrong.push(v)); }
                let key, pool;
                if (!askY) {
                    key = x1;
                    pool = [y1, -x1, ...wrong, y1 - n];   // a y-value; the sign flipped; the wrong combination; the line's slope term only
                    pool = pool.filter(v => v !== x1 && v !== x2);   // never the other intersection's x
                } else {
                    key = y1;
                    pool = [x1, -y1, a * x1 * x1 + b * x1, ...wrong.map(w => m * w + n)];
                    pool = pool.filter(v => v !== y1 && v !== y2);
                }
                const built = choicesFromPool(key, [...new Set(pool)], fmt, target);
                return built && { ...built, a, b, c, m, n, askY, x1, x2, y1, y2 };
            });
            const { a, b, c, m, n, askY, x1, x2, y1, y2 } = inst;
            const par = `y = ${polyTex([a, b, c])}`, line = `y = ${polyTex([m, n])}`;
            const [e1, e2] = Math.random() < 0.5 ? [par, line] : [line, par];
            return {
                questionText: `$$${e1}$$ $$${e2}$$<p>If \\((x, y)\\) is a solution to the given system of equations, which of the following could be the value of \\(${askY ? 'y' : 'x'}\\)?</p>`,
                choices: inst.choices,
                answer: inst.answer,
                desmosSolutions: [
                    { id: 'par', latex: par.replace(/ /g, '') },
                    { id: 'line', latex: line.replace(/ /g, '') },
                    { type: 'text', id: 'note1', text: `Set them equal: ${polyText([a, b, c])} = ${polyText([m, n])}, so ${polyText([a, b - m, c - n])} = 0, which gives x = ${x1} or x = ${x2}. The solutions are (${x1}, ${y1}) and (${x2}, ${y2}).` },
                    { type: 'text', id: 'note2', text: `Only one of these values is among the choices. Answer: ${inst.answer}) ${askY ? y1 : x1}` },
                ],
            };
        },
    },

    // ===== #48 =====
    {
        id: 'nlf-transformation-vertex',
        title: '(Medium) Translate a Function’s Graph',
        skill: 'Nonlinear functions',
        source: ACE_AM + 'nonlinear-functions-translate-function-with-constant-spr',
        tips: [
            'Inside the function, the shift goes the "opposite" way: \\(f(x + 4)\\) moves the graph 4 units <b>left</b>, and \\(f(x - 4)\\) moves it 4 units right. Outside, it goes the way it looks: \\(f(x) - 1\\) moves the graph down 1.',
            'For a vertex \\((h, k)\\), the graph of \\(y = f(x + p) + q\\) has vertex \\((h - p, k + q)\\). Traps: moving the wrong way horizontally, moving the wrong way vertically, and mixing up which number shifts which coordinate.',
            'Desmos: define \\(f\\), then graph the transformed function, e.g. <code>f(x+4)-1</code>, and click its vertex (or its y-intercept).',
        ],
        questionGenerator() {
            const target = pick(CHOICE_LETTERS);   // the exponential mode's sorted choices are kept on a uniform letter
            for (let attempt = 0; attempt < 200; attempt++) {
                const mode = pick(['vertex', 'vertex', 'equation', 'exp']);
                const p = randNonZero(-6, 6), q = randNonZero(-6, 6);
                if (Math.abs(p) === Math.abs(q)) continue;   // keeps the "swapped shifts" choice distinct from the key
                const inner = `x${p > 0 ? ` + ${p}` : ` - ${-p}`}`, outer = term(q, '');
                if (mode === 'vertex') {
                    const h = randNonZero(-7, 7), k = randNonZero(-9, 9), a = pick([1, 1, -1, 2, -3]);
                    const pt = (x, y) => `\\((${x}, ${y})\\)`;
                    const key = pt(h - p, k + q);
                    const wrong = [pt(h + p, k + q), pt(h - p, k - q), pt(h - q, k + p)];   // wrong horizontal; wrong vertical; shifts swapped
                    if (new Set([key, ...wrong]).size !== 4) continue;
                    const built = makeChoices(key, wrong);
                    return out(`<p>The function \\(f\\) is defined by \\(f(x) = ${vertexTex(a, h, k)}\\). In the <i>xy</i>-plane, what is the vertex of the graph of \\(y = f(${inner})${outer}\\)?</p>`,
                        built, `f(x)=${vertexTex(a, h, k).replace(/ /g, '')}`, `y=f(${inner.replace(/ /g, '')})${outer.replace(/ /g, '')}`,
                        `f has vertex (${h}, ${k}). f(${inner}) moves it ${Math.abs(p)} ${p > 0 ? 'left' : 'right'} and ${q > 0 ? '+' : '−'}${Math.abs(q)} moves it ${q > 0 ? 'up' : 'down'} ${Math.abs(q)}: (${h - p}, ${k + q}).`, `(${h - p}, ${k + q})`);
                }
                if (mode === 'equation') {
                    const amt = randInt(1, 8), up = randNonZero(-8, 8), dir = pick(['right', 'left']);
                    if (amt === Math.abs(up)) continue;
                    const hh = dir === 'right' ? amt : -amt;   // y = (x - hh)^2 + up
                    const eq = (h2, k2) => `\\(y = (x ${h2 > 0 ? '-' : '+'} ${Math.abs(h2)})^2${term(k2, '')}\\)`;
                    // errors: horizontal shift the wrong way; vertical shift the wrong way; the two amounts swapped
                    const key = eq(hh, up), wrong = [eq(-hh, up), eq(hh, -up), eq(Math.sign(hh) * Math.abs(up), Math.sign(up) * amt)];
                    if (new Set([key, ...wrong]).size !== 4) continue;
                    const built = makeChoices(key, wrong);
                    return out(`<p>The graph of \\(y = x^2\\) is shifted ${amt} unit${amt === 1 ? '' : 's'} ${dir} and ${Math.abs(up)} unit${Math.abs(up) === 1 ? '' : 's'} ${up > 0 ? 'up' : 'down'} in the <i>xy</i>-plane. Which equation represents the resulting graph?</p>`,
                        built, 'y=x^2', key.slice(2, -2).replace(/ /g, ''),
                        `Shifting right h replaces x with x − h (left: x + h); shifting up k adds k (down: subtracts k).`, noteText(key));
                }
                // exponential: y-intercept of y = f(x + P) + q with f(x) = b^x, so the key b^P + q is a whole number
                const base = pick([2, 3]), P = randInt(1, base === 2 ? 5 : 3);
                const val = (n, d, add) => ({ value: n / d + add, html: `\\((0, ${fracTex(n + add * d, d)})\\)` });
                const key = val(base ** P, 1, q);
                // errors: shifted the wrong way horizontally (b^(-P) + q); the wrong way vertically; ignored the horizontal
                // shift (1 + q); ignored the vertical shift (b^P)
                const pool = [val(1, base ** P, q), val(base ** P, 1, -q), val(1, 1, q), val(base ** P, 1, 0)];
                const built = choicesFromPool(key, pool, undefined, target);
                if (!built || (built.answer !== target && attempt < 150)) continue;
                return out(`<p>The function \\(f\\) is defined by \\(f(x) = ${base}^x\\). What is the <i>y</i>-intercept of the graph of \\(y = f(x + ${P})${outer}\\) in the <i>xy</i>-plane?</p>`,
                    built, `f(x)=${base}^{x}`, `y=f(x+${P})${outer.replace(/ /g, '')}`,
                    `At x = 0: f(0 + ${P}) ${q > 0 ? '+' : '−'} ${Math.abs(q)} = ${base}^${P} ${q > 0 ? '+' : '−'} ${Math.abs(q)} = ${base ** P + q}.`, `(0, ${base ** P + q})`);
            }
            throw new Error('nlf-transformation-vertex: no instance');

            function out(stem, built, fLatex, gLatex, note, keyText) {
                return {
                    questionText: stem,
                    choices: built.choices,
                    answer: built.answer,
                    desmosSolutions: [
                        { id: 'f', latex: fLatex },
                        { id: 'g', latex: gLatex },
                        { type: 'text', id: 'note1', text: note },
                        { type: 'text', id: 'note2', text: `Answer: ${built.answer}) ${keyText}` },
                    ],
                };
            }
        },
    },

    // ===== #49 =====
    {
        id: 'nleq-sum-of-solutions',
        title: '(Hard) Sum of the Solutions of a Quadratic',
        skill: 'Nonlinear equations in one variable and systems of equations in two variables',
        source: ACE_AM + 'nonlinear-equations-solutions-for-quadratic',
        tips: [
            'For \\(ax^2 + bx + c = 0\\), the sum of the solutions is \\(-\\frac{b}{a}\\) and the product is \\(\\frac{c}{a}\\). You don&#39;t need the solutions themselves, which is useful when the quadratic doesn&#39;t factor.',
            'First expand and move every term to one side so the other side is 0. Traps: using \\(\\frac{b}{a}\\) without the minus sign, and reading \\(b\\) before the equation is rearranged.',
            'Desmos: graph \\(y =\\) (left side) − (right side), click both x-intercepts, and add them. The decimals can be rounded, so the exact value \\(-\\frac{b}{a}\\) is safer.',
        ],
        questionGenerator() {
            for (let attempt = 0; attempt < 300; attempt++) {
                const form = pick(['product', 'product', 'sides', 'xfactor']);
                let lhs, rhs, A, B, C;
                if (form === 'product') {   // (x - p)(qx + r) = sx + t
                    const p = randNonZero(-9, 9), qq = randInt(1, 5), r = randNonZero(-9, 9), s = randInt(-9, 9), t = randInt(-15, 15);
                    lhs = `(${polyTex([1, -p])})(${polyTex([qq, r])})`; rhs = polyTex([s, t]);
                    [A, B, C] = [qq, r - p * qq - s, -p * r - t];
                } else if (form === 'sides') {   // a x² + b x = c x + d
                    const a = randInt(2, 7), b = randNonZero(-12, 12), c = randNonZero(-12, 12), d = randNonZero(-20, 20);
                    lhs = polyTex([a, b, 0]); rhs = polyTex([c, d]);
                    [A, B, C] = [a, b - c, -d];
                } else {                         // x(ax + b) = c - dx
                    const a = randInt(2, 6), b = randNonZero(-10, 10), c = randNonZero(-20, 20), d = randNonZero(-9, 9);
                    lhs = `x(${polyTex([a, b])})`; rhs = `${c}${term(-d, 'x')}`;
                    [A, B, C] = [a, b + d, -c];
                }
                if (A === 0 || B === 0) continue;
                const D = B * B - 4 * A * C;
                if (D <= 0) continue;                                          // two real solutions
                if (Number.isInteger(Math.sqrt(D)) && Math.random() < 0.8) continue;   // mostly not factorable
                const askProduct = Math.random() < 0.25;
                const answer = askProduct ? fracStr(C, A) : fracStr(-B, A);
                if (answer.replace(/^-/, '').length > 5) continue;
                const eq = `${lhs} = ${rhs}`;
                const L = lhs.replace(/ /g, ''), R = rhs.replace(/ /g, '');
                return {
                    questionText: pick([
                        `<p>What is the ${askProduct ? 'product' : 'sum'} of the solutions to \\(${eq}\\)?</p>`,
                        `$$${eq}$$<p>What is the ${askProduct ? 'product' : 'sum'} of the solutions to the given equation?</p>`,
                    ]),
                    answer,
                    desmosSolutions: [
                        { id: 'diff', latex: `y=${L}-\\left(${R}\\right)` },
                        { type: 'text', id: 'note1', text: `Move everything to one side: ${polyText([A, B, C])} = 0, so a = ${A}, b = ${B}, c = ${C}.` },
                        { type: 'text', id: 'note2', text: askProduct ? `The product of the solutions is c/a = ${C}/${A} = ${answer}.` : `The sum of the solutions is −b/a = ${-B}/${A} = ${answer}. (Adding the two x-intercepts in Desmos gives the same value as a decimal.)` },
                        { type: 'text', id: 'note3', text: `Answer: ${answer}` },
                    ],
                };
            }
            throw new Error('nleq-sum-of-solutions: no instance');
        },
    },

    // ===== #50 =====
    {
        id: 'nleq-other-solution-from-known',
        title: '(Hard) Use a Known Solution to Find a Constant',
        skill: 'Nonlinear equations in one variable and systems of equations in two variables',
        source: ACE_AM + 'nonlinear-equations-solution-with-constant',
        tips: [
            'A solution makes the equation true, so substitute it for \\(x\\) to find the unknown constant. Then solve the full equation (or use the product or sum of the solutions) to find the other solution.',
            'Shortcuts for \\(ax^2 + bx + c = 0\\): the product of the solutions is \\(\\frac{c}{a}\\) and the sum is \\(-\\frac{b}{a}\\). If 3 is one solution of \\(x^2 + ax - 24 = 0\\), the other is \\(\\frac{-24}{3} = -8\\). Trap: answering with the given solution or with the constant when the other solution is asked for.',
            'Desmos: type the equation with the constant as a slider and drag until the graph crosses the x-axis at the known solution; then read the other x-intercept.',
        ],
        questionGenerator() {
            for (let attempt = 0; attempt < 300; attempt++) {
                const mode = pick(['monicB', 'monicB', 'monicC', 'lead']);
                const L = pick(['a', 'k', 'b']);
                let eqTex, given, answer, askOther, note, sliderLatex, poly;
                if (mode === 'monicB' || mode === 'monicC') {   // x² + bx + c with roots r (given) and s
                    const r = randNonZero(-9, 9), s = randNonZero(-12, 12);
                    if (r === s) continue;
                    const b = -(r + s), c = r * s;
                    if (b === 0) continue;
                    askOther = Math.random() < 0.65;
                    if (mode === 'monicB') { eqTex = `x^2 + ${L}x${term(c, '')} = 0`; answer = askOther ? s : b; sliderLatex = `${L}=${b}`; poly = `x^{2}+${L}x${term(c, '').replace(/ /g, '')}`; }
                    else { eqTex = `${polyTex([1, b, 0])} + ${L} = 0`; answer = askOther ? s : c; sliderLatex = `${L}=${c}`; poly = `${polyTex([1, b, 0]).replace(/ /g, '')}+${L}`; }
                    given = r;
                    note = `Substituting x = ${r} gives ${L} = ${mode === 'monicB' ? b : c}, so the equation is ${polyText([1, b, c])} = 0. Its solutions multiply to ${c}, so the other solution is ${c} ÷ ${r < 0 ? `(${r})` : r} = ${s}.`;
                } else {   // non-monic: L x² + B x + C = 0 with known root r; L found by substitution
                    const r = pick([1, -1, 2, -2, 3]), Bc = randNonZero(-15, 15), Cc = randNonZero(-15, 15);
                    const a = -(Bc * r + Cc) / (r * r);
                    if (!Number.isInteger(a) || a === 0 || a === 1) continue;
                    const prod = [Cc, a];                                    // product of the solutions = C/a
                    const other = fracStr(prod[0], prod[1] * r);
                    if (other === fracStr(r, 1)) continue;                   // the other solution must differ from the given one
                    askOther = Math.random() < 0.7;
                    answer = askOther ? other : a;
                    eqTex = `${L}x^2${term(Bc, 'x')}${term(Cc, '')} = 0`;
                    given = r; sliderLatex = `${L}=${a}`; poly = `${L}x^{2}${term(Bc, 'x').replace(/ /g, '')}${term(Cc, '').replace(/ /g, '')}`;
                    note = `Substitute x = ${r}: ${L}(${r})² ${Bc * r < 0 ? '−' : '+'} ${Math.abs(Bc * r)} ${Cc < 0 ? '−' : '+'} ${Math.abs(Cc)} = 0, so ${L} = ${a}. The product of the solutions is c/a = ${fracStr(Cc, a)}, so the other solution is ${fracStr(Cc, a)} ÷ ${r < 0 ? `(${r})` : r} = ${other}.`;
                }
                if (String(answer).replace(/^-/, '').length > 5) continue;
                if (askOther && String(answer) === String(given)) continue;   // never the given solution
                return {
                    questionText: `$$${eqTex}$$<p>In the given equation, \\(${L}\\) is a constant. If \\(${given}\\) is a solution to the equation, what is ${askOther ? 'the other solution to the equation' : `the value of \\(${L}\\)`}?</p>`,
                    answer,
                    desmosSolutions: [
                        { id: 'graph', latex: `y=${poly}` },
                        { id: 'slider', latex: sliderLatex },
                        { type: 'text', id: 'note1', text: `With ${sliderLatex.replace('=', ' = ')}, the graph crosses the x-axis at x = ${given}. ${note}` },
                        { type: 'text', id: 'note2', text: `Answer: ${answer}` },
                    ],
                };
            }
            throw new Error('nleq-other-solution-from-known: no instance');
        },
    },

    // ===== #124 =====
    {
        id: 'eqx-polynomial-division',
        title: '(Hard) Quotient Plus Remainder Form',
        skill: 'Equivalent expressions',
        source: SRC.CBS,
        tips: [
            'Divide the numerator by the divisor (long or synthetic division). For a divisor \\(x - r\\), synthetic division uses \\(r\\): \\(x + 2\\) means \\(r = -2\\). The result has the form quotient \\(+ \\frac{\\text{remainder}}{\\text{divisor}}\\).',
            'Check a choice by reversing it: (quotient)(divisor) + remainder must give back the original numerator. Traps: the remainder&#39;s sign, dividing by \\(x + r\\) instead of \\(x - r\\) in synthetic division, and dropping the remainder.',
            'Desmos: graph the original expression and each choice. Only the equivalent one lies exactly on top of it.',
        ],
        questionGenerator() {
            for (let attempt = 0; attempt < 300; attempt++) {
                const a = Math.random() < 0.5 ? pick([2, 3]) : 1;
                const r = randNonZero(-6, 6), b = randInt(-12, 12), c = randInt(-20, 20);
                const q1 = b + a * r, R = a * r * r + b * r + c;   // a x² + b x + c = (x - r)(a x + q1) + R
                if (R === 0 || q1 === 0) continue;
                if (a === 1 && R > 0 && Math.random() < 0.5) continue;   // about half have a leading 2 or 3 or a negative remainder
                const div = polyTex([1, -r]);
                const form = (qa, qb, rem) => `${polyTex([qa, qb])}${rem === 0 ? '' : rem > 0 ? ` + \\dfrac{${rem}}{${div}}` : ` - \\dfrac{${-rem}}{${div}}`}`;
                const key = form(a, q1, R);
                const Rw = a * r * r - b * r + c, q1w = b - a * r;   // synthetic division with the wrong root (-r)
                const cand = [[a, q1, -R], [a, q1w, Rw], [a, q1, 0], [a, b, c - b]];   // sign of the remainder; wrong root; remainder dropped; (a x + b) + (c − b)/(x − r)
                // self-check: quotient·divisor + remainder must reproduce the numerator only for the key
                const numer = x => a * x * x + b * x + c;
                const rebuild = ([qa, qb, rem]) => x => (qa * x + qb) * (x - r) + rem;
                const xs = [0.5, 2.3, -3.7, 6.1];
                if (!xs.every(x => Math.abs(rebuild([a, q1, R])(x) - numer(x)) < 1e-9)) throw new Error('key fails the self-check');
                const wrong = cand.filter(cv => !xs.every(x => Math.abs(rebuild(cv)(x) - numer(x)) < 1e-9)).map(cv => form(...cv)).filter(w => w !== key);
                const uniq = [...new Set(wrong)];
                if (uniq.length < 3) continue;
                const chosen = [uniq[0], uniq[1], uniq[2]].includes(form(a, q1w, Rw)) ? uniq.slice(0, 3) : [uniq[0], form(a, q1w, Rw), uniq[1]].filter(Boolean).slice(0, 3);
                if (new Set([key, ...chosen]).size !== 4) continue;
                const built = makeChoices(`\\(${key}\\)`, chosen.map(w => `\\(${w}\\)`));
                const numTex = polyTex([a, b, c]);
                const toDesmos = s2 => s2.replace(/\\dfrac/g, '\\frac').replace(/ /g, '');
                return {
                    questionText: pick([
                        `<p>Which expression is equivalent to \\(\\dfrac{${numTex}}{${div}}\\)?</p>`,
                        `$$\\frac{${numTex}}{${div}}$$<p>Which of the following is equivalent to the given expression for \\(x \\neq ${r}\\)?</p>`,
                    ]),
                    choices: built.choices,
                    answer: built.answer,
                    desmosSolutions: [
                        { id: 'orig', latex: `y=\\frac{${numTex.replace(/ /g, '')}}{${div.replace(/ /g, '')}}` },
                        ...built.choices.map((ch, i) => ({ id: `ch${CHOICE_LETTERS[i]}`, latex: `y=${toDesmos(ch.slice(2, -2))}` })),
                        { type: 'text', id: 'note1', text: `Synthetic division by x ${r > 0 ? '-' : '+'} ${Math.abs(r)} uses ${r}: the quotient is ${polyText([a, q1])} and the remainder is ${R}.` },
                        { type: 'text', id: 'note2', text: `Check: (${polyText([a, q1])})(${polyText([1, -r])}) ${R < 0 ? '−' : '+'} ${Math.abs(R)} = ${polyText([a, b, c])}. Only one graph matches the original. Answer: ${built.answer}` },
                    ],
                };
            }
            throw new Error('eqx-polynomial-division: no instance');
        },
    },

    // ===== #119 =====
    {
        id: 'nleq-rational-equation',
        title: '(Hard) Rational Equation with an Extraneous Solution',
        skill: 'Nonlinear equations in one variable and systems of equations in two variables',
        source: 'https://www.varsitytutors.com/practice/subjects/algebra/help/solving-rational-and-radical-equations',
        tips: [
            'Multiply both sides by the common denominator to clear the fractions, solve the resulting equation, and then <b>check each answer</b> in the original equation. A value that makes a denominator 0 is excluded: it is not a solution.',
            'Traps: keeping an excluded value (it may appear when you clear denominators), and sign errors when distributing. If every candidate is excluded, the equation has no solution.',
            'Desmos: graph \\(y =\\) (left side) and \\(y =\\) (right side). At an excluded value there is a hole or an asymptote, so the graphs don&#39;t truly meet there.',
        ],
        questionGenerator() {
            const set = vals => (vals.length ? `\\(\\{${vals.join(', ')}\\}\\)` : 'There are no solutions.');
            for (let attempt = 0; attempt < 300; attempt++) {
                const kind = pick(['none', 'mixed', 'both']);   // no solution / one root excluded / both roots valid
                let lhsTex, rhsTex, f, g, excluded, valid, cand;
                if (kind === 'none') {   // px/(x − a) + m = pa/(x − a): the only candidate is x = a, which is excluded
                    const a = randNonZero(-8, 8), p = randInt(1, 5), m = randNonZero(-4, 4);
                    if (p + m === 0) continue;
                    lhsTex = `\\dfrac{${polyTex([p, 0])}}{${polyTex([1, -a])}}${term(m, '')}`; rhsTex = `\\dfrac{${p * a}}{${polyTex([1, -a])}}`;
                    f = x => p * x / (x - a) + m; g = x => p * a / (x - a);
                    excluded = [a]; valid = []; cand = [a];
                } else if (kind === 'mixed') {   // x/(x − a) − b/(x + c) = d/((x − a)(x + c)) with roots s (valid) and a (excluded)
                    const a = randNonZero(-7, 7), s = randNonZero(-9, 9), c = randNonZero(-7, 7);
                    const b = c + s + a, d = a * b - s * a;
                    if (s === a || -c === a || s === -c || b === 0 || d === 0) continue;
                    lhsTex = `\\dfrac{x}{${polyTex([1, -a])}} - \\dfrac{${b}}{${polyTex([1, c])}}`; rhsTex = `\\dfrac{${d}}{(${polyTex([1, -a])})(${polyTex([1, c])})}`;
                    if (b < 0) lhsTex = `\\dfrac{x}{${polyTex([1, -a])}} + \\dfrac{${-b}}{${polyTex([1, c])}}`;
                    f = x => x / (x - a) - b / (x + c); g = x => d / ((x - a) * (x + c));
                    excluded = [a, -c]; valid = [s]; cand = [s, a];
                } else {                          // same form as 'mixed', but both roots s1, s2 are valid
                    const a = randNonZero(-7, 7), c = randNonZero(-7, 7), s1 = randNonZero(-9, 9), s2 = randNonZero(-9, 9);
                    const b = c + s1 + s2, d = a * b - s1 * s2;
                    if (s1 === s2 || [s1, s2].some(v => v === a || v === -c) || -c === a || b === 0 || d === 0) continue;
                    lhsTex = b > 0 ? `\\dfrac{x}{${polyTex([1, -a])}} - \\dfrac{${b}}{${polyTex([1, c])}}` : `\\dfrac{x}{${polyTex([1, -a])}} + \\dfrac{${-b}}{${polyTex([1, c])}}`;
                    rhsTex = `\\dfrac{${d}}{(${polyTex([1, -a])})(${polyTex([1, c])})}`;
                    f = x => x / (x - a) - b / (x + c); g = x => d / ((x - a) * (x + c));
                    excluded = [a, -c]; valid = [s1, s2].sort((u, v) => u - v); cand = valid.slice();
                }
                // self-check: substitute every candidate; valid ones satisfy the equation, excluded ones are not allowed
                for (const v of valid) if (excluded.includes(v) || Math.abs(f(v) - g(v)) > 1e-9) throw new Error('candidate check failed');
                const key = set(valid);
                let wrong;
                if (kind === 'none') wrong = [set(excluded), set([-excluded[0]]), set([excluded[0], -excluded[0]])];
                else if (kind === 'mixed') wrong = [set([excluded[0]]), set([...cand].sort((x, y) => x - y)), set([-valid[0]])];
                else wrong = [set([valid[0]]), set([valid[1]]), set([-valid[1], -valid[0]]), set([])].slice(0, 4).filter((w, i, arr) => arr.indexOf(w) === i).slice(0, 3);
                if (new Set([key, ...wrong]).size !== 4) continue;
                const built = makeChoices(key, wrong);
                return {
                    questionText: `$$${lhsTex} = ${rhsTex}$$<p>What is the solution set of the given equation?</p>`,
                    choices: built.choices,
                    answer: built.answer,
                    desmosSolutions: [
                        { id: 'left', latex: `y=${lhsTex.replace(/\\dfrac/g, '\\frac').replace(/ /g, '')}` },
                        { id: 'right', latex: `y=${rhsTex.replace(/\\dfrac/g, '\\frac').replace(/ /g, '')}` },
                        { type: 'text', id: 'note1', text: `Excluded values (denominators of 0): x = ${excluded.join(' and x = ')}. Clearing the denominators gives the candidate${cand.length > 1 ? 's' : ''} x = ${cand.join(' and x = ')}.` },
                        { type: 'text', id: 'note2', text: `${kind === 'none' ? `x = ${cand[0]} makes a denominator 0, so it is not a solution: there are no solutions.` : kind === 'mixed' ? `x = ${excluded[0]} is excluded, so only x = ${valid[0]} works.` : `Neither ${valid[0]} nor ${valid[1]} is an excluded value, so both are solutions.`} Answer: ${built.answer}) ${noteText(key)}` },
                    ],
                };
            }
            throw new Error('nleq-rational-equation: no instance');
        },
    },

    // ===== #123 =====
    {
        id: 'eqx-rational-exponents',
        title: '(Hard) Rewrite Radicals with Rational Exponents',
        skill: 'Equivalent expressions',
        source: 'https://www.albert.io/blog/rewriting-rational-radical-expressions-for-sat-math-success/',
        tips: [
            'Rewrite each radical as a power: \\(\\sqrt[n]{x^m} = x^{\\frac{m}{n}}\\). When you multiply powers of \\(x\\), add the exponents; when you divide, subtract them; when you raise a power to a power, multiply them.',
            'For a coefficient, apply the exponent to it too: \\((16x^8)^{\\frac{3}{4}} = 16^{\\frac{3}{4}} x^{6} = 8x^6\\). Traps: multiplying exponents that should be added, flipping the index and the power (\\(\\frac{n}{m}\\) instead of \\(\\frac{m}{n}\\)), and leaving the coefficient unchanged.',
            'Desmos: graph the original expression and each choice for \\(x > 0\\); only the equivalent choice lies exactly on top of it.',
        ],
        questionGenerator() {
            const F = (n, d) => fracTex(n, d);
            // x^(n/d) in TeX: x, x^{3}, x^{\frac{4}{3}}, x^{-\frac{16}{15}}
            const pow = (n, d) => {
                const [rn, rd] = reduceFraction(n, d);
                if (rd === 1) return rn === 1 ? 'x' : `x^{${rn}}`;
                return `x^{${rn < 0 ? '-' : ''}\\frac{${Math.abs(rn)}}{${rd}}}`;
            };
            const rad = (i, m) => (i === 2 ? `\\sqrt{x^{${m}}}` : `\\sqrt[${i}]{x^{${m}}}`).replace('x^{1}', 'x');
            for (let attempt = 0; attempt < 300; attempt++) {
                const mode = pick(['product', 'quotient', 'coef', 'radpow', 'nested']);   // every form takes two steps
                let tex, key, wrong, keyFn, fns;
                if (mode === 'product' || mode === 'quotient') {
                    const i = pick([2, 3, 4]), j = pick([2, 3, 5].filter(v => v !== i)), m = randInt(1, 7), n = randInt(1, 5);
                    if (m % i === 0 || n % j === 0) continue;
                    const sg = mode === 'product' ? 1 : -1;
                    const [kn, kd] = reduceFraction(m * j + sg * n * i, i * j);
                    if (kn === 0) continue;
                    tex = mode === 'product' ? `${rad(i, m)} \\cdot ${rad(j, n)}` : `\\dfrac{${rad(i, m)}}{${rad(j, n)}}`;
                    key = pow(kn, kd);
                    // errors: multiplied the exponents; flipped index and power in each; combined tops over bottoms
                    const cands = [[m * n, i * j], [i * n + sg * j * m, m * n], [m + sg * n, i + j]];
                    wrong = cands.filter(([p, q]) => q !== 0 && p !== 0).map(([p, q]) => pow(p, q));
                    keyFn = x => x ** (kn / kd); fns = cands.map(([p, q]) => x => x ** (p / q));
                } else if (mode === 'coef') {
                    const [base, root, rootN] = pick([[16, 2, 4], [81, 3, 4], [8, 2, 3], [27, 3, 3], [25, 5, 2], [9, 3, 2], [64, 4, 3]]);   // base = root^rootN
                    const p = randInt(1, 4); if (p % rootN === 0) continue;
                    const e = rootN * randInt(1, 3);                   // x^e so the x-exponent e·p/rootN is a whole number
                    const coefV = root ** p, xe = e * p / rootN;
                    tex = `\\left(${base}x^{${e}}\\right)^{\\frac{${p}}{${rootN}}}`;
                    key = `${coefV}${pow(xe, 1)}`;
                    // errors: the coefficient multiplied by the exponent; the coefficient left unchanged; the exponents added
                    const c1 = base * p / rootN;
                    wrong = [Number.isInteger(c1) ? `${c1}${pow(xe, 1)}` : `${coefV}${pow(e * rootN, p)}`, `${base}${pow(xe, 1)}`, `${coefV}${pow(e * rootN + p, rootN)}`];
                    keyFn = x => coefV * x ** xe;
                    fns = [x => (Number.isInteger(c1) ? c1 * x ** xe : coefV * x ** (e * rootN / p)), x => base * x ** xe, x => coefV * x ** ((e * rootN + p) / rootN)];
                } else if (mode === 'radpow') {   // a radical times a negative rational power: x^(m/i) · x^(-a/b)
                    const i = pick([3, 4, 5]), m = randInt(2, 9), [aa, bb] = pick([[1, 2], [1, 3], [2, 3], [3, 4], [1, 4]]);
                    if (m % i === 0 || i === bb) continue;
                    const [kn, kd] = reduceFraction(m * bb - aa * i, i * bb);
                    if (kn === 0) continue;
                    tex = `${rad(i, m)} \\cdot x^{-\\frac{${aa}}{${bb}}}`;
                    key = pow(kn, kd);
                    // errors: added the negative exponent as positive; multiplied the exponents; flipped the radical's index and power
                    const cands = [[m * bb + aa * i, i * bb], [-m * aa, i * bb], [i * bb - aa * m, m * bb]];
                    wrong = cands.map(([p2, q2]) => pow(p2, q2));
                    keyFn = x => x ** (kn / kd); fns = cands.map(([p2, q2]) => x => x ** (p2 / q2));
                } else {                          // a nested radical: √(x^m · ∛(x^n)) = x^((m + n/3)/2)
                    const m = randInt(1, 3), n = randInt(1, 2);
                    const [kn, kd] = reduceFraction(3 * m + n, 6);
                    tex = `\\sqrt{x^{${m}}\\sqrt[3]{x^{${n}}}}`.replace('x^{1}', 'x').replace('x^{1}', 'x');
                    key = pow(kn, kd);
                    // errors: the outer root not applied to the inner radical; the exponents added and the indexes multiplied; the exponents multiplied
                    const cands = [[3 * m + 2 * n, 6], [m + n, 6], [m * n, 6]];
                    wrong = cands.map(([p2, q2]) => pow(p2, q2));
                    keyFn = x => x ** (kn / kd); fns = cands.map(([p2, q2]) => x => x ** (p2 / q2));
                }
                // self-check: the key equals the original numerically for x > 0, and no distractor does
                const orig = x => Function('x', `return ${texToJsAM(tex)}`)(x);
                const xs = [0.6, 1.7, 3.2];
                if (!xs.every(x => Math.abs(keyFn(x) - orig(x)) < 1e-9 * Math.max(1, orig(x)))) throw new Error(`key not equivalent: ${tex}`);
                const okWrong = wrong.filter((w, idx) => w !== key && !xs.every(x => Math.abs(fns[idx](x) - orig(x)) < 1e-9 * Math.max(1, orig(x))));
                if (new Set([key, ...okWrong]).size !== 4) continue;
                const built = makeChoices(`\\(${key}\\)`, okWrong.map(w => `\\(${w}\\)`));
                return {
                    questionText: `$$${tex}$$<p>For \\(x \\gt 0\\), which of the following is equivalent to the given expression?</p>`,
                    choices: built.choices,
                    answer: built.answer,
                    desmosSolutions: [
                        { id: 'orig', latex: `y=${tex.replace(/\\dfrac/g, '\\frac')}\\left\\{x>0\\right\\}` },
                        ...built.choices.map((ch, idx) => ({ id: `ch${CHOICE_LETTERS[idx]}`, latex: `y=${ch.slice(2, -2)}\\left\\{x>0\\right\\}` })),
                        { type: 'text', id: 'note1', text: mode === 'coef' ? 'Apply the exponent to the coefficient and to the power of x: multiply the x-exponents, and take the root of the coefficient before raising it.' : mode === 'nested' ? 'Work from the inside out: the inner cube root is a power of x; multiply it by the other power (add exponents), then the outer square root halves the total exponent.' : `Write each radical as a power of x (the nth root of x^m is x^(m/n)), then ${mode === 'quotient' ? 'subtract' : 'add'} the exponents${mode === 'radpow' ? ' (the second exponent is negative)' : ''}.` },
                        { type: 'text', id: 'note2', text: `Answer: ${built.answer}) ${noteText(`\\(${key}\\)`)}` },
                    ],
                };
            }
            throw new Error('eqx-rational-exponents: no instance');
        },
    },

    // ===== #69 =====
    {
        id: 'nlf-exp-fractional-exponent-interpret',
        title: '(Hard) Interpret an Exponent of the Form t/k',
        skill: 'Nonlinear functions',
        source: SRC.OUT,
        tips: [
            'In \\(f(t) = a(b)^{\\frac{t}{k}}\\), the factor \\(b\\) is applied once every \\(k\\) units of \\(t\\): when \\(t\\) goes up by \\(k\\), the exponent goes up by 1. So \\(0.84^{\\frac{t}{3}}\\) means the value is multiplied by 0.84, a 16% decrease, every 3 years.',
            'Translate the factor into a percent change: \\(b = 1.08\\) is an 8% increase, \\(b = 0.84\\) is a 16% decrease, \\(b = 2\\) doubles, \\(b = \\frac{1}{2}\\) halves. Traps: reading the factor itself as the change (84%), ignoring the period \\(k\\), and dividing the percent by \\(k\\) (the per-year change is not \\(\\frac{16}{3}\\)%).',
            'Desmos: define \\(f\\), then <code>f(3)/f(0)</code> shows the factor over one period and <code>f(1)/f(0)</code> the factor over one unit, which is not the same.',
        ],
        questionGenerator() {
            const contexts = [
                { fn: 'V', unit: 'year', what: (P, e) => `The function \\(V(t) = ${P}${e}\\) gives the value, in dollars, of an item \\(t\\) years after it was purchased.`, P: () => texNum(pick([800, 1000, 1500, 2400, 5000])), subject: 'the value of the item' },
                { fn: 'P', unit: 'year', what: (P, e) => `The function \\(P(t) = ${P}${e}\\) models the population of a town \\(t\\) years after 2020.`, P: () => texNum(pick([12000, 25000, 40000, 8500])), subject: "the town's population" },
                { fn: 'N', unit: 'hour', what: (P, e) => `The function \\(N(t) = ${P}${e}\\) gives the number of bacteria in a culture \\(t\\) hours after an experiment began.`, P: () => texNum(pick([300, 500, 1200, 2000])), subject: 'the number of bacteria' },
                { fn: 'M', unit: 'hour', what: (P, e) => `The function \\(M(t) = ${P}${e}\\) gives the amount, in milligrams, of a medication in a patient's body \\(t\\) hours after a dose.`, P: () => pick([200, 400, 500, 800]), subject: 'the amount of medication' },
            ];
            const ctx = pick(contexts);
            const kind = pick(['pctDown', 'pctUp', 'double', 'half']);
            const k = kind === 'half' || kind === 'double' ? pick([2, 3, 4, 5, 6, 8, 10, 12]) : pick([2, 3, 4, 5, 6]);
            const unit = ctx.unit, per = n => `every ${n === 1 ? unit : `${n} ${unit}s`}`;
            let factorTex, key, wrong;
            if (kind === 'pctDown' || kind === 'pctUp') {
                const r = kind === 'pctDown' ? pick([4, 6, 8, 10, 12, 15, 16, 20, 25]) : pick([3, 4, 5, 6, 8, 10, 12, 15]);
                const b = kind === 'pctDown' ? 1 - r / 100 : 1 + r / 100;
                factorTex = `(${String(roundTo(b, 4))})^{\\frac{t}{${k}}}`;
                const dir = kind === 'pctDown' ? 'decreases' : 'increases';
                key = `It ${dir} by ${r}% ${per(k)}.`;
                const perYear = roundTo(r / k, 1);
                wrong = [
                    kind === 'pctDown' ? `It ${dir} by ${100 - r}% ${per(k)}.` : `It ${dir} by ${100 + r}% ${per(k)}.`,   // the factor read as the change
                    `It ${dir} by ${r}% ${per(1)}.`,                                                                         // the period ignored
                    `It ${dir} by about ${perYear}% ${per(1)}.`,                                                             // the percent divided by the period
                ];
            } else if (kind === 'double') {
                factorTex = `(2)^{\\frac{t}{${k}}}`;
                key = `It doubles ${per(k)}.`;
                wrong = [`It doubles ${per(1)}.`, `It increases by 200% ${per(k)}.`, `It increases by ${roundTo(100 / k, 1)}% ${per(1)}.`];
            } else {
                factorTex = `\\left(\\frac{1}{2}\\right)^{\\frac{t}{${k}}}`;
                key = `It is halved ${per(k)}.`;
                wrong = [`It is halved ${per(1)}.`, `It doubles ${per(k)}.`, `It decreases by ${roundTo(50 / k, 1)}% ${per(1)}.`];
            }
            if (new Set([key, ...wrong]).size !== 4) return this.questionGenerator();
            const built = makeChoices(key, wrong);
            const P = ctx.P();
            const bVal = kind === 'double' ? 2 : kind === 'half' ? 0.5 : Number(factorTex.match(/\(([\d.]+)\)/)[1]);
            return {
                questionText: `<p>${ctx.what(P, factorTex)} Which of the following best describes how ${ctx.subject} changes over time?</p>`,
                choices: built.choices,
                answer: built.answer,
                desmosSolutions: [
                    { id: 'f', latex: `${ctx.fn}\\left(t\\right)=${String(P).replace(/\{,\}/g, '')}${factorTex.replace(/\\left|\\right/g, '')}`.replace('(1/2)', '\\left(\\frac{1}{2}\\right)') },
                    { id: 'period', latex: `\\frac{${ctx.fn}\\left(${k}\\right)}{${ctx.fn}\\left(0\\right)}` },
                    { id: 'one', latex: `\\frac{${ctx.fn}\\left(1\\right)}{${ctx.fn}\\left(0\\right)}` },
                    { type: 'text', id: 'note1', text: `When t increases by ${k}, the exponent t/${k} increases by 1, so the value is multiplied by ${roundTo(bVal, 4)} once every ${k} ${unit}s (the first ratio). The ratio over a single ${unit} is a different number (the second ratio).` },
                    { type: 'text', id: 'note2', text: `Answer: ${built.answer}) ${key}` },
                ],
            };
        },
    },

    // ===== #70 =====
    {
        id: 'eqx-same-base-exponent',
        title: '(Hard) Equations with Exponents on a Common Base',
        skill: 'Equivalent expressions',
        source: SRC.OUT,
        tips: [
            'Rewrite every power with the same base, then set the exponents equal: \\(9^{x + 2} = 27^{x - 1}\\) becomes \\(3^{2(x + 2)} = 3^{3(x - 1)}\\), so \\(2x + 4 = 3x - 3\\) and \\(x = 7\\).',
            'Use the exponent rules: \\((b^m)^n = b^{mn}\\), \\(b^m \\cdot b^n = b^{m + n}\\), \\(\\frac{b^m}{b^n} = b^{m - n}\\). Traps: setting the exponents equal before the bases match, and forgetting to distribute when rewriting \\((3^2)^{x + 2}\\).',
            'Desmos: graph \\(y =\\) (left side) and \\(y =\\) (right side) and click the intersection (zoom out a lot). Or, after rewriting with one base, type the exponent equation itself.',
        ],
        questionGenerator() {
            const bases = [[2, [4, 8, 16, 32]], [3, [9, 27, 81]], [5, [25, 125]]];
            for (let attempt = 0; attempt < 300; attempt++) {
                const [b, powers] = pick(bases);
                const mode = pick(['ratio', 'linear', 'linear', 'product']);
                const e = P => Math.round(Math.log(P) / Math.log(b));   // P = b^e
                let tex, answer, exprEq;
                if (mode === 'linear') {   // P^(x + u) = Q^(x + v)
                    const [P, Q] = shuffle(powers).slice(0, 2), p = e(P), q = e(Q);
                    const u = randNonZero(-6, 6), v = randNonZero(-6, 6);
                    if (u === v) continue;   // identical exponents make x = -u obvious
                    const [n, d] = [q * v - p * u, p - q];
                    if (n === 0) continue;
                    answer = fracStr(n, d);
                    tex = `${P}^{${polyTex([1, u])}} = ${Q}^{${polyTex([1, v])}}`;
                    exprEq = `${p}\\left(${polyTex([1, u]).replace(/ /g, '')}\\right)=${q}\\left(${polyTex([1, v]).replace(/ /g, '')}\\right)`;
                } else if (mode === 'ratio') {   // P^(m x) / b^(n x) = b^K
                    const P = pick(powers), p = e(P), m = randInt(1, 3), n = randInt(1, 5), K = randInt(6, 40);
                    if (p * m - n <= 0) continue;
                    answer = fracStr(K, p * m - n);
                    tex = `\\dfrac{${P}^{${m === 1 ? '' : m}x}}{${b}^{${n === 1 ? '' : n}x}} = ${b}^{${K}}`;
                    exprEq = `${p * m}x-${n}x=${K}`;
                } else {   // (P^x)(b^c) = Q^K
                    const [P, Q] = shuffle(powers.concat([b])).slice(0, 2), p = e(P), q = e(Q);
                    const c = randInt(1, 6), K = randInt(2, 6);
                    answer = fracStr(q * K - c, p);
                    if (q * K - c === 0) continue;
                    tex = `\\left(${P}^{x}\\right)\\left(${b}^{${c}}\\right) = ${Q}^{${K}}`;
                    exprEq = `${p}x+${c}=${q * K}`;
                }
                if (answer.replace(/^-/, '').length > 5 || (answer.includes('/') && Number(answer.split('/')[1]) > 9)) continue;
                const toD = s2 => s2.replace(/\\dfrac/g, '\\frac').replace(/ /g, '');
                const [l, r] = tex.split(' = ');
                return {
                    questionText: pick([
                        `$$${tex}$$<p>What value of \\(x\\) satisfies the given equation?</p>`,
                        `<p>If \\(${tex}\\), what is the value of \\(x\\)?</p>`,
                    ]),
                    answer,
                    desmosSolutions: [
                        { id: 'left', latex: `y=${toD(l)}` },
                        { id: 'right', latex: `y=${toD(r)}` },
                        { id: 'exp', latex: exprEq },
                        { type: 'text', id: 'note1', text: `Rewrite every power as a power of ${b}, then set the exponents equal (the last line above). Desmos draws its solution as a vertical line; the two curves also meet there if you zoom out far enough.` },
                        { type: 'text', id: 'note2', text: `x = ${answer}. Answer: ${answer}` },
                    ],
                };
            }
            throw new Error('eqx-same-base-exponent: no instance');
        },
    },

    // ===== #88 =====
    {
        id: 'nlf-polynomial-from-zeros',
        title: '(Hard) Polynomial from Its Zeros (Described Graph)',
        skill: 'Nonlinear functions',
        source: SRC.OUT,
        tips: [
            'Each x-intercept \\(x = c\\) gives a factor \\((x - c)\\): an intercept at \\(x = -3\\) gives \\((x + 3)\\). Where the graph <b>crosses</b> the x-axis the factor appears an odd number of times (usually once); where it only <b>touches</b> the x-axis and turns back, the factor is squared.',
            'The zeros fix the factors but not the leading coefficient. Find it from the given point: substitute the point into \\(a(x - c_1)(x - c_2)\\cdots\\) and solve for \\(a\\). Traps: signs of the zeros flipped, the right factors with the wrong coefficient, and a single factor where the graph touches.',
            'Desmos: graph each choice and compare its x-intercepts (crossing or touching) and the given point with the description.',
        ],
        questionGenerator() {
            const mono = (roots, x0) => roots.reduce((v, [z, m]) => v * (x0 - z) ** m, 1);
            const key3 = roots => roots.map(([z, m]) => `${z}^${m}`).sort().join(',');
            const fTex = c => `p(x) = ${lead(c.a)}${c.roots.slice().sort((u, v) => u[0] - v[0]).map(([z, m]) => `(${shiftTex(z)})${m > 1 ? `^${m}` : ''}`).join('')}`;
            for (let attempt = 0; attempt < 500; attempt++) {
                const variant = pick(['three', 'three', 'double3', 'double4']);
                const nz = variant === 'double4' ? 3 : variant === 'double3' ? 2 : 3;
                const zs = new Set(); while (zs.size < nz) zs.add(randNonZero(-6, 6));
                const zl = [...zs];
                const roots = zl.map((z, i) => [z, variant !== 'three' && i === 0 ? 2 : 1]);
                const a = pick([1, -1, 2, -2, 3, -3, 2, -2]);
                const x0 = Math.random() < 0.6 ? 0 : randNonZero(-3, 3);
                if (zs.has(x0)) continue;
                const y0 = a * mono(roots, x0);
                if (y0 === 0 || Math.abs(y0) > 300) continue;
                const keyC = { a, roots };
                const ok = c => key3(c.roots) === key3(roots) && Math.abs(c.a * mono(c.roots, x0) - y0) < 1e-9;
                const fit = rs => { const v = mono(rs, x0); return v !== 0 && Number.isInteger(y0 / v) ? y0 / v : null; };   // the coefficient that makes the choice pass through the point
                const cand = [];
                const flipped = roots.map(([z, m]) => [-z, m]);
                cand.push({ a: fit(flipped) ?? a, roots: flipped });                          // signs of the zeros flipped
                cand.push({ a: a === 1 ? -1 : (Math.abs(a) === 1 ? 1 : a / Math.abs(a)), roots });   // right factors, coefficient dropped or its sign wrong
                cand.push({ a: -a, roots });                                                   // right factors, sign of the coefficient wrong
                if (variant === 'three') {
                    const i = randInt(0, 2);
                    const sq = roots.map(([z, m], j) => [z, j === i ? 2 : m]);
                    if (fit(sq) !== null) cand.push({ a: fit(sq), roots: sq });                 // a crossing zero written as a squared factor
                    const miss = roots.filter((_, j) => j !== i);
                    if (fit(miss) !== null) cand.push({ a: fit(miss), roots: miss });           // a factor left out
                } else {
                    const single = roots.map(([z]) => [z, 1]);
                    if (fit(single) !== null) cand.push({ a: fit(single), roots: single });     // the touching zero not squared
                    const moved = roots.map(([z], j) => [z, j === 1 ? 2 : 1]);
                    if (fit(moved) !== null) cand.push({ a: fit(moved), roots: moved });        // the square on the wrong zero
                }
                const seen = new Set([fTex(keyC)]);
                const ds = shuffle(cand).filter(c => Number.isInteger(c.a) && c.a !== 0 && !ok(c) && !seen.has(fTex(c)) && seen.add(fTex(c)));
                if (ds.length < 3) continue;
                const chosen = ds.slice(0, 3);
                const all = [keyC, ...chosen];
                if (all.filter(ok).length !== 1) throw new Error('nlf-polynomial-from-zeros: choice check failed');
                const { choices, answer } = makeChoices(`\\(${fTex(keyC)}\\)`, chosen.map(c => `\\(${fTex(c)}\\)`));
                const xs = zl.slice().sort((u, v) => u - v);
                const list = arr => arr.map(z => `\\(x = ${z}\\)`).reduce((s, t, i, A) => s + (i === 0 ? '' : i === A.length - 1 ? (A.length > 2 ? ', and ' : ' and ') : ', ') + t, '');
                let desc;
                if (variant === 'three') desc = `crosses the x-axis only at ${list(xs)} and`;
                else {
                    const dz = zl[0], cross = xs.filter(z => z !== dz);
                    desc = `crosses the x-axis at ${list(cross)} and touches the x-axis at \\(x = ${dz}\\) without crossing it. These are the only x-intercepts of the graph, which`;
                }
                return {
                    questionText: `<p>The graph of the polynomial function \\(p\\) in the <i>xy</i>-plane ${desc} passes through the point \\((${x0}, ${y0})\\). Which of the following could define \\(p\\)?</p>`,
                    choices, answer,
                    desmosSolutions: [
                        { id: 'p', latex: `p(x)=${lead(a)}${roots.slice().sort((u, v) => u[0] - v[0]).map(([z, m]) => `\\left(${shiftTex(z).replace(/ /g, '')}\\right)${m > 1 ? `^{${m}}` : ''}`).join('')}` },
                        { id: 'pt', latex: `\\left(${x0},${y0}\\right)` },
                        { type: 'text', id: 'note1', text: `Factors: ${xs.map(z => `(x ${z > 0 ? '−' : '+'} ${Math.abs(z)})${variant !== 'three' && z === zl[0] ? '² (touches)' : ''}`).join(', ')}. Substituting x = ${x0}: a × ${mono(roots, x0)} = ${y0}, so a = ${a}.` },
                        { type: 'text', id: 'note2', text: `Check each choice: only one has these intercepts (crossing or touching) and passes through (${x0}, ${y0}). Answer: ${answer}` },
                    ],
                };
            }
            // fallback (checked by hand): zeros −3, 1, 4 and p(0) = 24 → p(x) = 2(x + 3)(x − 1)(x − 4)
            const { choices, answer } = makeChoices('\\(p(x) = 2(x + 3)(x - 1)(x - 4)\\)', ['\\(p(x) = 2(x - 3)(x + 1)(x + 4)\\)', '\\(p(x) = (x + 3)(x - 1)(x - 4)\\)', '\\(p(x) = -2(x + 3)(x - 1)(x - 4)\\)']);
            return {
                questionText: '<p>The graph of the polynomial function \\(p\\) in the <i>xy</i>-plane crosses the x-axis only at \\(x = -3\\), \\(x = 1\\), and \\(x = 4\\) and passes through the point \\((0, 24)\\). Which of the following could define \\(p\\)?</p>',
                choices, answer,
                desmosSolutions: [
                    { id: 'p', latex: 'p(x)=2\\left(x+3\\right)\\left(x-1\\right)\\left(x-4\\right)' },
                    { type: 'text', id: 'note1', text: `Factors (x + 3), (x − 1), (x − 4); a × 12 = 24, so a = 2. Answer: ${answer}` },
                ],
            };
        },
    },

    // ===== #90 =====
    {
        id: 'nlf-quadratic-from-zeros-and-point',
        title: '(Hard) Quadratic from Its x-Intercepts and One Point',
        skill: 'Nonlinear functions',
        source: SRC.OUT,
        tips: [
            'x-intercepts at \\(x = r\\) and \\(x = s\\) mean \\(f(x) = a(x - r)(x - s)\\). Substitute the given point to find \\(a\\); then you can evaluate \\(f\\) anywhere.',
            'The vertex is halfway between the x-intercepts, at \\(x = \\frac{r + s}{2}\\); the minimum (if \\(a > 0\\)) or maximum (if \\(a < 0\\)) value is \\(f\\) of that x-value. Trap: stopping at \\(a\\), or at the vertex&#39;s x-coordinate.',
            'Desmos: type <code>a=32/((0-2)(0-8))</code>, then <code>f(x)=a(x-2)(x-8)</code>, and click the vertex (or type <code>f(5)</code>).',
        ],
        questionGenerator() {
            for (let attempt = 0; attempt < 2000; attempt++) {
                const r = randInt(-8, 6), s = r + 2 * randInt(1, 6);   // even gap: the vertex is at a whole number
                const a = pick([1, -1, 2, -2, 3, -3, 4, -4]);
                const f = x => a * (x - r) * (x - s);
                const h = (r + s) / 2;
                const ask = pick(['extreme', 'extreme', 'fk', 'yint']);
                let x0 = ask === 'yint' ? randInt(-6, 10) : (Math.random() < 0.5 ? 0 : randInt(-6, 10));
                if (x0 === r || x0 === s || x0 === h || (ask === 'yint' && (x0 === 0 || r === 0 || s === 0))) continue;
                if (x0 === 0 && (r === 0 || s === 0)) continue;
                const y0 = f(x0);
                if (Math.abs(y0) > 400) continue;
                let k, answer, question, eval_;
                if (ask === 'extreme') { answer = f(h); question = `What is the ${a > 0 ? 'minimum' : 'maximum'} value of \\(f\\)?`; eval_ = `f\\left(${h}\\right)`; }
                else if (ask === 'yint') { answer = f(0); question = 'What is the y-coordinate of the y-intercept of the graph of \\(y = f(x)\\)?'; eval_ = 'f\\left(0\\right)'; }
                else {
                    k = randInt(-6, 12);
                    if ([r, s, x0, h].includes(k)) continue;
                    answer = f(k); question = `What is the value of \\(f(${k})\\)?`; eval_ = `f\\left(${k}\\right)`;
                }
                if (answer === 0 || Math.abs(answer) > 9999) continue;
                const point = x0 === 0 ? `\\(f(0) = ${y0}\\)` : `the graph of \\(y = f(x)\\) passes through the point \\((${x0}, ${y0})\\)`;
                return {
                    questionText: `<p>The graph of the quadratic function \\(f\\) in the <i>xy</i>-plane has x-intercepts at \\((${r}, 0)\\) and \\((${s}, 0)\\), and ${point}. ${question}</p>`,
                    answer,
                    desmosSolutions: [
                        { id: 'a', latex: `a=\\frac{${y0}}{\\left(${x0}-${r < 0 ? `\\left(${r}\\right)` : r}\\right)\\left(${x0}-${s < 0 ? `\\left(${s}\\right)` : s}\\right)}` },
                        { id: 'f', latex: `f(x)=a\\left(${shiftTex(r)}\\right)\\left(${shiftTex(s)}\\right)`.replace(/ /g, '') },
                        { id: 'ans', latex: eval_ },
                        { type: 'text', id: 'note1', text: `f(x) = a(${shiftTex(r)})(${shiftTex(s)}). At x = ${x0}: a × ${(x0 - r) * (x0 - s)} = ${y0}, so a = ${a}.${ask === 'extreme' ? ` The vertex is halfway between the intercepts, at x = ${h}.` : ''}`.replace(/(\d)- (\d)/g, '$1 − $2') },
                        { type: 'text', id: 'note2', text: `${ask === 'extreme' ? `f(${h})` : ask === 'yint' ? 'f(0)' : `f(${k})`} = ${answer}. Answer: ${answer}` },
                    ],
                };
            }
            return {
                questionText: '<p>The graph of the quadratic function \\(f\\) in the <i>xy</i>-plane has x-intercepts at \\((2, 0)\\) and \\((8, 0)\\), and \\(f(0) = 32\\). What is the minimum value of \\(f\\)?</p>',
                answer: -18,
                desmosSolutions: [
                    { id: 'f', latex: 'f(x)=2\\left(x-2\\right)\\left(x-8\\right)' },
                    { type: 'text', id: 'note1', text: 'a × 16 = 32, so a = 2; the vertex is at x = 5, and f(5) = 2(3)(−3) = −18. Answer: -18' },
                ],
            };
        },
    },

    // ===== #89 =====
    {
        id: 'nlf-product-sum-numbers',
        title: '(Hard) Two Quantities from Two Conditions',
        skill: 'Nonlinear functions',
        source: SRC.OUT,
        tips: [
            'Name the two quantities and write one equation for each condition, e.g. \\(xy = 192\\) and \\(x + y = 28\\). Substitute \\(y = 28 - x\\) to get the quadratic \\(x(28 - x) = 192\\), then factor or use the quadratic formula. Both solutions describe the same pair, so read which quantity is asked for.',
            'For a rectangle, perimeter \\(= 2(L + W)\\): halve it first. With a diagonal \\(d\\), \\(L^2 + W^2 = d^2\\), and \\((L + W)^2 = L^2 + W^2 + 2LW\\) gives the sum without finding \\(L\\) and \\(W\\).',
            'Desmos: graph both equations, e.g. <code>xy=192</code> and <code>x+y=28</code>, and click an intersection point; its coordinates are the two quantities.',
        ],
        questionGenerator() {
            const triples = [[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25], [20, 21, 29]];
            for (let attempt = 0; attempt < 500; attempt++) {
                const mode = pick(['numSum', 'numSquares', 'rectAP', 'rectAP', 'rectDiag']);
                let stem, answer, eqs, note;
                if (mode === 'numSum' || mode === 'numSquares') {
                    const m = randInt(5, 30), n = randInt(2, 25);
                    if (m <= n) continue;
                    const S = m + n, P = m * n, Q = m * m + n * n;
                    const ask = mode === 'numSum' ? pick(['larger', 'smaller']) : pick(['larger', 'smaller', 'product']);
                    answer = ask === 'larger' ? m : ask === 'smaller' ? n : P;
                    const askText = ask === 'product' ? 'What is the product of the two numbers?' : `What is the ${ask} of the two numbers?`;
                    stem = mode === 'numSum' ? `The sum of two positive numbers is ${S}, and their product is ${texNum(P)}. ${askText}`
                        : `The sum of two positive numbers is ${S}, and the sum of their squares is ${texNum(Q)}. ${askText}`;
                    eqs = mode === 'numSum' ? [`xy=${P}`, `x+y=${S}`] : [`x^{2}+y^{2}=${Q}`, `x+y=${S}`];
                    note = mode === 'numSum' ? `x(${S} − x) = ${P} gives x = ${n} or x = ${m}; the numbers are ${n} and ${m}.`
                        : ask === 'product' ? `(x + y)² = x² + y² + 2xy, so ${S * S} = ${Q} + 2xy and xy = ${P}.` : `x² + (${S} − x)² = ${Q} gives x = ${n} or x = ${m}; the numbers are ${n} and ${m}.`;
                } else if (mode === 'rectAP') {
                    const ctx = pick([['garden', 'feet', 6, 40], ['patio', 'feet', 8, 30], ['poster', 'inches', 12, 48], ['parking lot', 'meters', 20, 90], ['rug', 'feet', 4, 14]]);
                    const L = randInt(ctx[2], ctx[3]), W = randInt(ctx[2], ctx[3]);
                    if (L <= W + 1 || L > 3 * W) continue;
                    const A = L * W, Pm = 2 * (L + W);
                    const ask = pick(['longer', 'shorter']);
                    answer = ask === 'longer' ? L : W;
                    stem = `A rectangular ${ctx[0]} has an area of ${texNum(A)} square ${ctx[1]} and a perimeter of ${Pm} ${ctx[1]}. What is the length, in ${ctx[1]}, of the ${ask} side of the ${ctx[0]}?`;
                    eqs = [`xy=${A}`, `2x+2y=${Pm}`];
                    note = `L + W = ${Pm}/2 = ${L + W} and LW = ${A}, so L(${L + W} − L) = ${A}: the sides are ${W} and ${L}.`;
                } else {
                    const [p, q, d0] = pick(triples), k = d0 >= 25 ? 1 : randInt(1, d0 >= 13 ? 3 : 8);
                    const W = k * p, L = k * q, d = k * d0, A = L * W;
                    const ctx = pick([['television screen', 'inches'], ['window', 'inches'], ['field', 'yards'], ['tablet screen', 'centimeters']]);
                    if ((ctx[0] === 'field') !== (d >= 40)) continue;   // fields are large, screens and windows small
                    if (ctx[0] !== 'field' && d > 85) continue;
                    const ask = pick(['perimeter', 'perimeter', 'longer']);
                    answer = ask === 'perimeter' ? 2 * (L + W) : L;
                    stem = `A rectangular ${ctx[0]} has a diagonal of length ${d} ${ctx[1]} and an area of ${texNum(A)} square ${ctx[1]}. ${ask === 'perimeter' ? `What is the perimeter, in ${ctx[1]}, of the ${ctx[0]}?` : `What is the length, in ${ctx[1]}, of the longer side of the ${ctx[0]}?`}`;
                    eqs = [`x^{2}+y^{2}=${d * d}`, `xy=${A}`];
                    note = ask === 'perimeter' ? `(L + W)² = L² + W² + 2LW = ${d * d} + ${2 * A} = ${(L + W) ** 2}, so L + W = ${L + W} and the perimeter is ${2 * (L + W)}.`
                        : `L² + W² = ${d * d} and LW = ${A}; then (L + W)² = ${(L + W) ** 2} and (L − W)² = ${(L - W) ** 2}, so L + W = ${L + W}, L − W = ${L - W}, and L = ${L}.`;
                }
                if (answer > 99999) continue;
                return {
                    questionText: `<p>${stem}</p>`.replace(/ (\d{4,}) /g, (_, m) => ` ${commas(+m)} `),
                    answer,
                    desmosSolutions: [
                        { id: 'e1', latex: eqs[0] },
                        { id: 'e2', latex: eqs[1] },
                        { type: 'text', id: 'note1', text: `${note} Desmos shows the same pair as the intersection points of the two graphs.` },
                        { type: 'text', id: 'note2', text: `Answer: ${answer}` },
                    ],
                };
            }
            return {
                questionText: '<p>The sum of two positive numbers is 28, and their product is 192. What is the larger of the two numbers?</p>',
                answer: 16,
                desmosSolutions: [
                    { id: 'e1', latex: 'xy=192' }, { id: 'e2', latex: 'x+y=28' },
                    { type: 'text', id: 'note1', text: 'x(28 − x) = 192 gives x = 12 or x = 16. Answer: 16' },
                ],
            };
        },
    },

    // ===== #122 =====
    {
        id: 'eqx-isolate-variable-formula',
        title: '(Hard) Solve a Formula for One Variable',
        skill: 'Equivalent expressions',
        source: 'https://blog.prepscholar.com/single-variable-equations-sat-math-strategies',
        tips: [
            'Undo the operations on the variable in reverse order: clear fractions (multiply both sides), divide by the other factors, and take a square root last if the variable is squared (a cube root if it is cubed).',
            'Check by picking numbers: choose values for the other variables, compute the formula, then substitute into each choice and see which gives back the value you started with. Traps: forgetting the root, flipping the fraction, and putting a coefficient on the wrong side.',
            'Desmos: define the values you picked, e.g. <code>V=4\\pi</code> and <code>h=3</code>, then type each choice and see which one returns your starting value.',
        ],
        questionGenerator() {
            const S = Math.sqrt, C = Math.cbrt, PI = Math.PI;
            // vals() returns all the variables of the formula; key and wrong give the solved variable from the others
            const F = [
                { intro: 'The formula \\(V = \\frac{1}{3}\\pi r^2 h\\) gives the volume \\(V\\) of a right circular cone with radius \\(r\\) and height \\(h\\).', v: 'r', of: 'V and h',
                  vals() { const r = rnd(), h = rnd(); return { r, h, V: PI * r * r * h / 3 }; }, target: o => o.r,
                  key: ['\\sqrt{\\dfrac{3V}{\\pi h}}', o => S(3 * o.V / (PI * o.h))],
                  wrong: [['\\dfrac{3V}{\\pi h}', o => 3 * o.V / (PI * o.h)], ['\\sqrt{\\dfrac{\\pi h}{3V}}', o => S(PI * o.h / (3 * o.V))], ['\\sqrt{\\dfrac{V}{3\\pi h}}', o => S(o.V / (3 * PI * o.h))], ['\\dfrac{\\sqrt{3V}}{\\pi h}', o => S(3 * o.V) / (PI * o.h)]],
                  check: 'r = 2 and h = 3 give V = 4π; the correct choice gives back r = 2.', plain: 'r = √(3V/(πh))' },
                { intro: 'The formula \\(V = \\frac{1}{3}\\pi r^2 h\\) gives the volume \\(V\\) of a right circular cone with radius \\(r\\) and height \\(h\\).', v: 'h', of: 'V and r', lin: true,
                  vals() { const r = rnd(), h = rnd(); return { r, h, V: PI * r * r * h / 3 }; }, target: o => o.h,
                  key: ['\\dfrac{3V}{\\pi r^2}', o => 3 * o.V / (PI * o.r ** 2)],
                  wrong: [['\\dfrac{V}{3\\pi r^2}', o => o.V / (3 * PI * o.r ** 2)], ['\\dfrac{\\pi r^2}{3V}', o => PI * o.r ** 2 / (3 * o.V)], ['\\sqrt{\\dfrac{3V}{\\pi r}}', o => S(3 * o.V / (PI * o.r))], ['\\dfrac{3V}{2\\pi r}', o => 3 * o.V / (2 * PI * o.r)]],
                  check: 'r = 3 and h = 2 give V = 6π; the correct choice gives back h = 2.', plain: 'h = 3V/(πr²)' },
                { intro: 'The formula \\(V = \\frac{4}{3}\\pi r^3\\) gives the volume \\(V\\) of a sphere with radius \\(r\\).', v: 'r', of: 'V',
                  vals() { const r = rnd(); return { r, V: 4 * PI * r ** 3 / 3 }; }, target: o => o.r,
                  key: ['\\sqrt[3]{\\dfrac{3V}{4\\pi}}', o => C(3 * o.V / (4 * PI))],
                  wrong: [['\\dfrac{3V}{4\\pi}', o => 3 * o.V / (4 * PI)], ['\\sqrt[3]{\\dfrac{4V}{3\\pi}}', o => C(4 * o.V / (3 * PI))], ['\\sqrt{\\dfrac{3V}{4\\pi}}', o => S(3 * o.V / (4 * PI))], ['\\sqrt[3]{\\dfrac{4\\pi}{3V}}', o => C(4 * PI / (3 * o.V))]],
                  check: 'r = 3 gives V = 36π; the correct choice gives back r = 3.', plain: 'r = ∛(3V/(4π))' },
                { intro: 'The kinetic energy \\(K\\) of an object with mass \\(m\\) moving at speed \\(v\\) is given by \\(K = \\frac{1}{2}mv^2\\).', v: 'v', of: 'K and m',
                  vals() { const m = rnd(), v = rnd(); return { m, v, K: m * v * v / 2 }; }, target: o => o.v,
                  key: ['\\sqrt{\\dfrac{2K}{m}}', o => S(2 * o.K / o.m)],
                  wrong: [['\\dfrac{2K}{m}', o => 2 * o.K / o.m], ['\\sqrt{\\dfrac{K}{2m}}', o => S(o.K / (2 * o.m))], ['\\sqrt{\\dfrac{m}{2K}}', o => S(o.m / (2 * o.K))], ['\\dfrac{\\sqrt{2K}}{m}', o => S(2 * o.K) / o.m]],
                  check: 'm = 2 and v = 3 give K = 9; the correct choice gives back v = 3.', plain: 'v = √(2K/m)' },
                { intro: 'The kinetic energy \\(K\\) of an object with mass \\(m\\) moving at speed \\(v\\) is given by \\(K = \\frac{1}{2}mv^2\\).', v: 'm', of: 'K and v', lin: true,
                  vals() { const m = rnd(), v = rnd(); return { m, v, K: m * v * v / 2 }; }, target: o => o.m,
                  key: ['\\dfrac{2K}{v^2}', o => 2 * o.K / o.v ** 2],
                  wrong: [['\\dfrac{K}{2v^2}', o => o.K / (2 * o.v ** 2)], ['2Kv^2', o => 2 * o.K * o.v ** 2], ['\\dfrac{2K}{v}', o => 2 * o.K / o.v], ['\\dfrac{v^2}{2K}', o => o.v ** 2 / (2 * o.K)]],
                  check: 'm = 2 and v = 3 give K = 9; the correct choice gives back m = 2.', plain: 'm = 2K/v²' },
                { intro: 'The gravitational force \\(F\\) between two objects with masses \\(m_1\\) and \\(m_2\\) whose centers are a distance \\(d\\) apart is given by \\(F = \\dfrac{Gm_1m_2}{d^2}\\), where \\(G\\) is a constant.', v: 'd', of: 'F, G, \\(m_1\\), and \\(m_2\\)',
                  vals() { const G = rnd(), a = rnd(), b = rnd(), d = rnd(); return { G, a, b, d, F: G * a * b / (d * d) }; }, target: o => o.d,
                  key: ['\\sqrt{\\dfrac{Gm_1m_2}{F}}', o => S(o.G * o.a * o.b / o.F)],
                  wrong: [['\\dfrac{Gm_1m_2}{F}', o => o.G * o.a * o.b / o.F], ['\\sqrt{\\dfrac{F}{Gm_1m_2}}', o => S(o.F / (o.G * o.a * o.b))], ['\\sqrt{FGm_1m_2}', o => S(o.F * o.G * o.a * o.b)], ['\\dfrac{\\sqrt{Gm_1m_2}}{F}', o => S(o.G * o.a * o.b) / o.F]],
                  check: 'G = 1, m₁ = 2, m₂ = 8, and d = 2 give F = 4; the correct choice gives back d = 2.', plain: 'd = √(Gm₁m₂/F)' },
                { intro: 'The power \\(P\\) used by an electrical circuit with current \\(I\\) and resistance \\(R\\) is given by \\(P = I^2R\\).', v: 'I', of: 'P and R',
                  vals() { const I = rnd(), R = rnd(); return { I, R, P: I * I * R }; }, target: o => o.I,
                  key: ['\\sqrt{\\dfrac{P}{R}}', o => S(o.P / o.R)],
                  wrong: [['\\dfrac{P}{R}', o => o.P / o.R], ['\\sqrt{\\dfrac{R}{P}}', o => S(o.R / o.P)], ['\\sqrt{PR}', o => S(o.P * o.R)], ['\\dfrac{P}{2R}', o => o.P / (2 * o.R)]],
                  check: 'I = 3 and R = 2 give P = 18; the correct choice gives back I = 3.', plain: 'I = √(P/R)' },
                { intro: 'The area \\(A\\) of a trapezoid with parallel bases \\(b_1\\) and \\(b_2\\) and height \\(h\\) is given by \\(A = \\frac{1}{2}(b_1 + b_2)h\\).', v: 'b_1', of: 'A, \\(b_2\\), and h', lin: true,
                  vals() { const a = rnd(), b = rnd(), h = rnd(); return { a, b, h, A: (a + b) * h / 2 }; }, target: o => o.a,
                  key: ['\\dfrac{2A}{h} - b_2', o => 2 * o.A / o.h - o.b],
                  wrong: [['\\dfrac{2A - b_2}{h}', o => (2 * o.A - o.b) / o.h], ['\\dfrac{A}{2h} - b_2', o => o.A / (2 * o.h) - o.b], ['\\dfrac{2A}{h} + b_2', o => 2 * o.A / o.h + o.b], ['2Ah - b_2', o => 2 * o.A * o.h - o.b]],
                  check: 'b₁ = 6, b₂ = 4, and h = 2 give A = 10; the correct choice gives back b₁ = 6.', plain: 'b₁ = 2A/h − b₂' },
                { intro: 'If \\(P\\) dollars are invested at a simple annual interest rate \\(r\\) (written as a decimal), the account is worth \\(A = P(1 + rt)\\) dollars after \\(t\\) years.', v: 'r', of: 'A, P, and t', lin: true,
                  vals() { const P = rnd(), r = rnd(), t = rnd(); return { P, r, t, A: P * (1 + r * t) }; }, target: o => o.r,
                  key: ['\\dfrac{A - P}{Pt}', o => (o.A - o.P) / (o.P * o.t)],
                  wrong: [['\\dfrac{A}{Pt} - 1', o => o.A / (o.P * o.t) - 1], ['\\dfrac{A - P}{t}', o => (o.A - o.P) / o.t], ['\\dfrac{A - 1}{Pt}', o => (o.A - 1) / (o.P * o.t)], ['\\dfrac{Pt}{A - P}', o => o.P * o.t / (o.A - o.P)]],
                  check: 'P = 100, r = 0.05, and t = 2 give A = 110; the correct choice gives back r = 0.05.', plain: 'r = (A − P)/(Pt)' },
                { intro: 'The period \\(T\\) of a simple pendulum of length \\(L\\) is given by \\(T = 2\\pi\\sqrt{\\dfrac{L}{g}}\\), where \\(g\\) is a constant.', v: 'L', of: 'T and g',
                  vals() { const L = rnd(), g = rnd(); return { L, g, T: 2 * PI * S(L / g) }; }, target: o => o.L,
                  key: ['\\dfrac{gT^2}{4\\pi^2}', o => o.g * o.T ** 2 / (4 * PI * PI)],
                  wrong: [['\\dfrac{T^2}{4\\pi^2g}', o => o.T ** 2 / (4 * PI * PI * o.g)], ['\\dfrac{gT^2}{2\\pi}', o => o.g * o.T ** 2 / (2 * PI)], ['\\dfrac{gT}{2\\pi}', o => o.g * o.T / (2 * PI)], ['\\dfrac{gT^2}{2\\pi^2}', o => o.g * o.T ** 2 / (2 * PI * PI)]],
                  check: 'L = 4 and g = 1 give T = 4π; the correct choice gives back L = 4.', plain: 'L = gT²/(4π²)' },
                { intro: 'An object dropped from rest falls a distance \\(d = \\frac{1}{2}gt^2\\) in \\(t\\) seconds, where \\(g\\) is a constant.', v: 't', of: 'd and g',
                  vals() { const t = rnd(), g = rnd(); return { t, g, d: g * t * t / 2 }; }, target: o => o.t,
                  key: ['\\sqrt{\\dfrac{2d}{g}}', o => S(2 * o.d / o.g)],
                  wrong: [['\\dfrac{2d}{g}', o => 2 * o.d / o.g], ['\\sqrt{\\dfrac{d}{2g}}', o => S(o.d / (2 * o.g))], ['\\sqrt{2dg}', o => S(2 * o.d * o.g)], ['\\sqrt{\\dfrac{g}{2d}}', o => S(o.g / (2 * o.d))]],
                  check: 'g = 2 and t = 3 give d = 9; the correct choice gives back t = 3.', plain: 't = √(2d/g)' },
            ];
            function rnd() { return 1.3 + 8 * Math.random(); }
            // the variable is linear in 4 of the 11 formulas; weight the root/power ones 3 to 1 so linear ones are about 16% of questions
            const bag = F.flatMap(e => Array(e.lin ? 1 : 3).fill(e));
            const f = pick(bag);
            // verify by substitution: the key returns the variable, and every distractor differs from it (several trials)
            for (let trial = 0; trial < 4; trial++) {
                const o = f.vals(), want = f.target(o);
                if (Math.abs(f.key[1](o) - want) > 1e-7 * Math.max(1, Math.abs(want))) throw new Error(`eqx-isolate-variable-formula: key fails for ${f.v}`);
                for (const [t, w] of f.wrong) if (Math.abs(w(o) - want) < 1e-6 * Math.max(1, Math.abs(want))) throw new Error(`eqx-isolate-variable-formula: distractor ${t} equals the key`);
            }
            const wrong = shuffle(f.wrong).slice(0, 3);
            const { choices, answer } = makeChoices(`\\(${f.v} = ${f.key[0]}\\)`, wrong.map(([t]) => `\\(${f.v} = ${t}\\)`));
            const of = f.of.includes('\\(') ? f.of.replace(/(^|, | and )([A-Za-z])(?=,| and|$)/g, '$1\\($2\\)') : f.of.replace(/\b([A-Za-z])\b/g, '\\($1\\)');
            return {
                questionText: `<p>${f.intro} Which of the following correctly expresses \\(${f.v}\\) in terms of ${of}?</p>`,
                choices, answer,
                desmosSolutions: [
                    { type: 'text', id: 'note1', text: `Pick numbers and test the choices: ${f.check}` },
                    { type: 'text', id: 'note2', text: `${f.plain}. Answer: ${answer}` },
                ],
            };
        },
    },

]);

})();
