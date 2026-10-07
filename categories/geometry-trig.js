// Geometry & Trigonometry question types. Each category follows the contract in categories/README.md.
(() => {

// ===== Shared helpers for this file =====

// A number for display without float noise, with commas: num(3.5) → "3.5".
function num(x) { return commas(roundTo(x, 6)); }

// The same inside TeX math: tnum(1234.5) → "1{,}234.5".
function tnum(x) { return texNum(roundTo(x, 6)); }

// k√m in TeX: radTex(5, 17) → "5\sqrt{17}", radTex(1, 17) → "\sqrt{17}", radTex(4, 1) → "4".
function radTex(k, m) { return m === 1 ? `${k}` : `${k === 1 ? '' : k}\\sqrt{${m}}`; }

// Simplified radical for √N: returns [k, m] with N = k²·m and m squarefree.
function simplifyRoot(N) {
    let k = 1, m = N;
    for (let f = 2; f * f <= m; f++) while (m % (f * f) === 0) { m /= f * f; k *= f; }
    return [k, m];
}

// A choice worth (n/d)·√m, shown in simplest form: "\frac{5\sqrt{17}}{4}", "\sqrt{17}", "12".
function radChoice(n, d, m) {
    const [rn, rd] = reduceFraction(n, d);
    const top = radTex(rn, m);
    return { value: rn / rd * Math.sqrt(m), html: `\\(${rd === 1 ? top : `\\frac{${top}}{${rd}}`}\\)` };
}

// A multiple of π, (n/d)π, shown as "6\pi", "\pi", "\frac{5\pi}{3}", "\frac{\pi}{2}"; value is the coefficient times π.
function piChoice(n, d) {
    const [rn, rd] = reduceFraction(n, d);
    const top = `${rn === 1 ? '' : rn}\\pi`;
    return { value: rn / rd * Math.PI, html: `\\(${rd === 1 ? top : `\\frac{${top}}{${rd}}`}\\)` };
}
function piText(n, d) { const [rn, rd] = reduceFraction(n, d); return `${rn === 1 ? '' : rn}π${rd === 1 ? '' : `/${rd}`}`; }

// "x - h" in TeX (h = 3 → "x - 3", h = -3 → "x + 3"), or just the variable when h = 0.
function shiftTex(h, v = 'x') { return h === 0 ? v : `${v} ${h > 0 ? '-' : '+'} ${Math.abs(h)}`; }

// An angle expression in degrees: degTex(5, -12) → "(5x - 12)^{\circ}", degTex(2, 0) → "2x^{\circ}".
function degTex(a, b) { return b === 0 ? `${polyTex([a, 0])}^{\\circ}` : `(${polyTex([a, b])})^{\\circ}`; }
function degText(a, b) { return b === 0 ? `${polyText([a, 0])}°` : `(${polyText([a, b])})°`; }

registerCategories('Geometry & Trigonometry', [

    // ===== #16 =====
    {
        id: 'geo-similar-shadows',
        title: '(Easy) Similar Triangles from Shadows',
        skill: 'Lines, angles, and triangles',
        source: SRC.CBS,
        tips: [
            'At the same moment, each upright object and its shadow form a right triangle, and the two triangles are similar. Their sides are proportional: \\(\\frac{\\text{height}_1}{\\text{shadow}_1} = \\frac{\\text{height}_2}{\\text{shadow}_2}\\).',
            'Traps: subtracting lengths (similar figures scale by multiplying, not by adding or subtracting), and flipping one ratio (height over shadow on one side but shadow over height on the other).',
            'Desmos: type the proportion with \\(x\\) for the unknown, e.g. <code>10/5=x/2</code>. Desmos draws a vertical line at the answer.',
        ],
        questionGenerator() {
            const contexts = [
                { a: 'tree', subj: 'one of the trees', b: 'other tree', intro: 'Two nearby trees stand straight up from flat ground.', h1: [8, 30], unit: 'feet' },
                { a: 'flagpole', b: 'person', who: true, intro: 'A flagpole and a person standing near it are both perpendicular to the flat ground.', h1: [18, 40], h2: [5, 5.5, 6, 6.5], unit: 'feet' },
                { a: 'building', b: 'lamp post', intro: 'A building and a nearby lamp post are both perpendicular to the flat ground.', h1: [30, 90], h2: [8, 10, 12, 15, 16, 20], unit: 'feet' },
                { a: 'pole', b: 'student', who: true, intro: 'A utility pole and a student standing near it are both perpendicular to the level ground.', h1: [6, 12], h2: [1.5, 2], unit: 'meters' },
            ];
            const fmt = v => `\\(${num(v)}\\)`;
            const inst = balancedChoice(target => {
                const ctx = pick(contexts);
                // ratio height : shadow = p : q (a small fraction), then the second object's lengths share it
                const [p, q] = pick([[2, 1], [3, 1], [3, 2], [4, 3], [5, 2], [5, 4], [4, 1], [5, 3], [2, 3], [3, 4], [1, 2]]);
                const t1 = randInt(1, 12), h1 = p * t1, s1 = q * t1;
                if (h1 < ctx.h1[0] || h1 > ctx.h1[1]) return null;
                let h2, s2;
                if (ctx.h2) {   // the second object has a realistic height in halves, so its shadow is h2·q/p
                    h2 = pick(ctx.h2); s2 = h2 * q / p;
                } else { s2 = randInt(2, 20) / 2; h2 = s2 * p / q; }
                if (!Number.isInteger(2 * h2) || !Number.isInteger(2 * s2) || h2 === h1 || s2 === s1) return null;
                const askShadow = !!ctx.h2 || Math.random() < 0.3;
                let key, pool;
                if (!askShadow) {   // know h1, s1, s2 → h2 (CB Q16)
                    key = h2;
                    // CB errors: the difference of the shadows; the first height minus the other shadow; the ratio
                    // flipped (shadow/height = h2/s2); plus the "same difference" error h1 − (s1 − s2)
                    pool = [Math.abs(s1 - s2), h1 - s2, s1 * s2 / h1, h1 - (s1 - s2)];
                } else {            // know h1, s1, h2 → s2
                    key = s2;
                    pool = [Math.abs(h1 - h2), s1 - h2, h1 * h2 / s1, s1 - (h1 - h2)];
                }
                pool = pool.map(v => roundTo(v, 6)).filter(v => v > 0 && Number.isInteger(4 * v));
                const built = choicesFromPool(key, pool, fmt, target);
                return built && { ...built, ctx, h1, s1, h2, s2, askShadow };
            }) || { ...makeChoicesSorted(4, [3, 8, 1], fmt), ctx: contexts[0], h1: 10, s1: 5, h2: 4, s2: 2, askShadow: false };
            const { ctx, h1, s1, h2, s2, askShadow } = inst;
            const u = ctx.unit;
            const stem = askShadow
                ? `${ctx.intro} At a certain time, ${ctx.subj || `the ${ctx.a}`} is ${num(h1)} ${u} tall and casts a shadow that is ${num(s1)} ${u} long. At the same time, the ${ctx.b}, ${ctx.who ? 'who' : 'which'} is ${num(h2)} ${u} tall, casts a shadow. How long, in ${u}, is the shadow of the ${ctx.b}?`
                : `${ctx.intro} At a certain time, ${ctx.subj || `the ${ctx.a}`} is ${num(h1)} ${u} tall and casts a shadow that is ${num(s1)} ${u} long. At the same time, the shadow of the ${ctx.b} is ${num(s2)} ${u} long. How tall, in ${u}, is the ${ctx.b}?`;
            const eq = askShadow ? `\\frac{${h1}}{${s1}}=\\frac{${h2}}{x}` : `\\frac{${h1}}{${s1}}=\\frac{x}{${s2}}`;
            const ans = askShadow ? s2 : h2;
            return {
                questionText: `<p>${stem}</p>`,
                choices: inst.choices,
                answer: inst.answer,
                desmosSolutions: [
                    { id: 'prop', latex: eq },
                    { type: 'text', id: 'note1', text: `The objects and their shadows form similar right triangles, so height/shadow is the same for both: ${h1}/${s1} = ${askShadow ? `${num(h2)}/x` : `x/${num(s2)}`}.` },
                    { type: 'text', id: 'note2', text: `Desmos draws the solution as a vertical line at x = ${num(ans)}. Answer: ${num(ans)} ${u}` },
                ],
            };
        },
    },

    // ===== #17 =====
    {
        id: 'trig-rectangle-diagonal',
        title: '(Medium) Rectangle Side from a Radical Diagonal',
        skill: 'Right triangles and trigonometry',
        source: SRC.CBS,
        tips: [
            'A diagonal splits a rectangle into two right triangles. The sides are the legs and the diagonal is the hypotenuse, so \\(\\text{side}_1^2 + \\text{side}_2^2 = \\text{diagonal}^2\\).',
            'Square a radical carefully: \\((5\\sqrt{17})^2 = 25 \\cdot 17 = 425\\). Traps: dividing the diagonal by the side, treating the diagonal as a leg (adding the squares instead of subtracting), and forgetting the final square root.',
            'Desmos: type <code>sqrt((5sqrt(17))^2-5^2)</code>, then compare the decimal with each choice (type the choices too if they are radicals).',
        ],
        questionGenerator() {
            const inst = balancedChoice(target => {
                const a = randInt(2, 20), b = randInt(a + 1, 24);
                const [k, m] = simplifyRoot(a * a + b * b);
                if (m === 1) return null;   // the diagonal must be a radical
                if (k === 1 && Math.random() < 0.75) return null;   // mostly k√m with k > 1, like CB's 5√17
                const d2 = a * a + b * b;
                const mode = pick(['longer', 'longer', 'shorter', 'area', 'perimeter']);
                let key, pool;
                const asRad = N => { const [kk, mm] = simplifyRoot(N); return radChoice(kk, 1, mm); };
                if (mode === 'longer' || mode === 'shorter') {
                    const given = mode === 'longer' ? a : b, want = mode === 'longer' ? b : a;
                    key = radChoice(want, 1, 1);
                    // CB errors: diagonal ÷ given side; the diagonal used as a leg, √(d² + side²); the square of the answer
                    pool = [radChoice(k, given, m), asRad(d2 + given * given), radChoice(want * want, 1, 1)];
                    if (k > given) pool.push({ value: k * Math.sqrt(m) - given, html: `\\(${radTex(k, m)} - ${given}\\)` });   // subtracted the lengths
                    if (k > 1 && k * m > given * given) pool.push(asRad(k * m - given * given));   // squared k√m as k·m (forgot to square k)
                } else if (mode === 'area') {
                    key = radChoice(a * b, 1, 1);
                    // errors: the shorter side times the diagonal; the shorter side times b² (no square root); the perimeter
                    pool = [radChoice(a * k, 1, m), radChoice(a * b * b, 1, 1), radChoice(2 * (a + b), 1, 1), radChoice(a * b, 2, 1)];   // … and ab/2, a triangle's area
                } else {
                    key = radChoice(2 * (a + b), 1, 1);
                    // errors: a + b (only half the perimeter); the area; 2(a + d) (the diagonal used as a side)
                    pool = [radChoice(a + b, 1, 1), radChoice(a * b, 1, 1), { value: 2 * a + 2 * k * Math.sqrt(m), html: `\\(${2 * a} + ${radTex(2 * k, m)}\\)` }, radChoice(2 * a + b, 1, 1)];   // … and 2a + b (only three sides)
                }
                const built = choicesFromPool(key, pool, undefined, target);
                return built && { ...built, a, b, k, m, mode };
            }) || { ...makeChoicesSorted(radChoice(20, 1, 1), [radChoice(1, 1, 17), radChoice(5, 1, 18), radChoice(400, 1, 1)]), a: 5, b: 20, k: 5, m: 17, mode: 'longer' };
            const { a, b, k, m, mode } = inst;
            const d = radTex(k, m);
            const stems = {
                longer: `The length of a rectangle's diagonal is \\(${d}\\), and the length of the rectangle's shorter side is \\(${a}\\). What is the length of the rectangle's longer side?`,
                shorter: `A rectangle has a diagonal of length \\(${d}\\). The longer side of the rectangle has length \\(${b}\\). What is the length of the shorter side of the rectangle?`,
                area: `The diagonal of a rectangle has length \\(${d}\\), and the shorter side of the rectangle has length \\(${a}\\). What is the area of the rectangle?`,
                perimeter: `The diagonal of a rectangle has length \\(${d}\\), and the shorter side of the rectangle has length \\(${a}\\). What is the perimeter of the rectangle?`,
            };
            const given = mode === 'shorter' ? b : a, other = mode === 'shorter' ? a : b;
            const finalNote = { longer: `The longer side is ${b}.`, shorter: `The shorter side is ${a}.`, area: `The sides are ${a} and ${b}, so the area is ${a} × ${b} = ${a * b}.`, perimeter: `The sides are ${a} and ${b}, so the perimeter is 2(${a} + ${b}) = ${2 * (a + b)}.` }[mode];
            return {
                questionText: `<p>${stems[mode]}</p>`,
                choices: inst.choices,
                answer: inst.answer,
                desmosSolutions: [
                    { id: 'side', latex: `\\sqrt{\\left(${d}\\right)^{2}-${given}^{2}}` },
                    { type: 'text', id: 'note1', text: `The diagonal is the hypotenuse of a right triangle whose legs are the sides: (${k === 1 ? '' : k}√${m})² = ${k === 1 ? '' : `${k * k} × ${m} = `}${a * a + b * b}.` },
                    { type: 'text', id: 'note2', text: `So the other side is √(${a * a + b * b} − ${given}²) = √${other * other} = ${other}. ${finalNote}` },
                    { type: 'text', id: 'note3', text: `Answer: ${inst.answer}) ${noteText(inst.choices[CHOICE_LETTERS.indexOf(inst.answer)]).replace(/\\sqrt\{(\d+)\}/g, '√$1')}` },
                ],
            };
        },
    },

    // ===== #18 =====
    {
        id: 'circ-arc-length',
        title: '(Medium) Arc Length, Arc Measure and Circumference',
        skill: 'Circles',
        source: SRC.CBS,
        tips: [
            'An arc is the same fraction of the circumference as its central angle is of 360°: \\(\\frac{\\text{arc length}}{\\text{circumference}} = \\frac{\\text{arc measure}}{360^\\circ}\\).',
            'Traps: answering with the arc length itself, using 180° in place of 360°, and using the area formula \\(\\pi r^2\\) instead of the circumference \\(2\\pi r\\).',
            'Desmos is just a calculator here: for a 45° arc of length 3, type <code>3*360/45</code>. Keep answers that contain \\(\\pi\\) in terms of \\(\\pi\\): find the coefficient and attach \\(\\pi\\).',
        ],
        questionGenerator() {
            const angles = [20, 24, 30, 36, 40, 45, 60, 72, 90, 120];
            const inst = balancedChoice(target => {
                const mode = pick(['circumference', 'circumference', 'arc', 'angle']);
                const theta = pick(angles), n = 360 / theta;   // the arc is 1/n of the circle
                if (mode === 'circumference') {   // CB Q18: arc measure and arc length → circumference
                    const L = randInt(2, 12), C = L * n;
                    // CB errors: the arc length; 2 × the arc length; the arc length squared; 180 used for 360
                    const pool = [L, 2 * L, L * L, L * 180 / theta].filter(v => Number.isInteger(v));
                    const built = choicesFromPool(C, pool, v => `\\(${num(v)}\\)`, target);
                    return built && { ...built, mode, theta, L, C };
                }
                if (mode === 'arc') {   // radius and central angle → arc length in terms of π
                    const r = randInt(2, 12);
                    // arc = 2πr / n; errors: the whole circumference; 180 for 360 (twice the arc); the sector area πr²/n;
                    // πr instead of 2πr
                    const pool = [piChoice(2 * r, 1), piChoice(2 * r * 2, n), piChoice(r * r, n), piChoice(r, n)];
                    const built = choicesFromPool(piChoice(2 * r, n), pool, undefined, target);
                    return built && { ...built, mode, theta, r };
                }
                // circumference and arc length (in terms of π) → central angle
                const C = pick([12, 18, 20, 24, 30, 36, 40, 48, 60]);
                if (C % n !== 0) return null;
                const L = C / n;
                // errors: 180 used for 360; the other (major) arc's angle; stopped at C/L (how many such arcs fit)
                const pool = [theta / 2, 360 - theta, n].filter(v => v > 0 && v !== theta);
                const built = choicesFromPool(theta, pool, v => `\\(${v}^{\\circ}\\)`, target);
                return built && { ...built, mode, theta, C, L };
            }) || { ...makeChoicesSorted(24, [3, 6, 9], v => `\\(${v}\\)`), mode: 'circumference', theta: 45, L: 3, C: 24 };
            const { mode, theta } = inst;
            let stem, desmos;
            const unit = pick(['inches', 'centimeters', 'meters']);
            if (mode === 'circumference') {
                const { L, C } = inst;
                stem = `Points \\(A\\) and \\(B\\) lie on a circle with center \\(O\\). The measure of arc \\(AB\\) is \\(${theta}^{\\circ}\\), and the length of arc \\(AB\\) is ${L} ${unit}. What is the circumference, in ${unit}, of the circle?`;
                desmos = [
                    { id: 'calc', latex: `${L}\\cdot\\frac{360}{${theta}}` },
                    { type: 'text', id: 'note1', text: `A ${theta}° arc is ${theta}/360 = 1/${360 / theta} of the circle, so the circumference is ${360 / theta} × ${L} = ${C}.` },
                    { type: 'text', id: 'note2', text: `Answer: ${C} ${unit}` },
                ];
            } else if (mode === 'arc') {
                const { r } = inst;
                stem = `A circle has center \\(O\\) and a radius of ${r} ${unit}. Points \\(P\\) and \\(Q\\) lie on the circle, and the measure of central angle \\(POQ\\) is \\(${theta}^{\\circ}\\). What is the length, in ${unit}, of minor arc \\(PQ\\)?`;
                desmos = [
                    { id: 'calc', latex: `2\\pi\\cdot${r}\\cdot\\frac{${theta}}{360}` },
                    { type: 'text', id: 'note1', text: `Circumference = 2π(${r}) = ${2 * r}π. The arc is ${theta}/360 = 1/${360 / theta} of it: ${2 * r}π/${360 / theta} = ${piText(2 * r, 360 / theta)}. (Desmos shows the decimal; the answer stays in terms of π.)` },
                    { type: 'text', id: 'note2', text: `Answer: ${piText(2 * r, 360 / theta)} ${unit}` },
                ];
            } else {
                const { C, L } = inst;
                stem = `A circle has a circumference of \\(${C}\\pi\\) ${unit}. An arc of the circle has a length of \\(${L === 1 ? '' : L}\\pi\\) ${unit}. What is the measure, in degrees, of the central angle that intercepts this arc?`;
                desmos = [
                    { id: 'calc', latex: `360\\cdot\\frac{${L}}{${C}}` },
                    { type: 'text', id: 'note1', text: `The arc is ${L}π/${C}π = ${fracStr(L, C)} of the circle, so the central angle is ${fracStr(L, C)} × 360° = ${theta}°.` },
                    { type: 'text', id: 'note2', text: `Answer: ${theta}°` },
                ];
            }
            return { questionText: `<p>${stem}</p>`, choices: inst.choices, answer: inst.answer, desmosSolutions: desmos };
        },
    },

    // ===== #19 =====
    {
        id: 'geo-parallel-transversal',
        title: '(Easy) Angles Formed by Parallel Lines and a Transversal',
        skill: 'Lines, angles, and triangles',
        source: SRC.OUT,
        tips: [
            'When a transversal crosses two parallel lines, corresponding angles, alternate interior angles and alternate exterior angles are <b>equal</b>. Same-side interior angles are <b>supplementary</b>: they add up to \\(180^\\circ\\).',
            'Set up the right equation: equal angles give \\(5x - 12 = 3x + 20\\); same-side interior angles give \\((5x - 12) + (3x + 20) = 180\\). If the question asks for an angle, substitute \\(x\\) back in.',
            'Desmos: type the equation with \\(x\\), e.g. <code>5x-12=3x+20</code>. Desmos draws a vertical line at the solution.',
        ],
        questionGenerator() {
            const rels = [
                { name: 'alternate interior angles', equal: true },
                { name: 'corresponding angles', equal: true },
                { name: 'alternate exterior angles', equal: true },
                { name: 'same-side interior angles', equal: false, extra: ' (interior angles on the same side of line \\(t\\))' },
            ];
            let rel, x, a, b, c, d, alpha, beta;
            for (let attempt = 0; attempt < 200; attempt++) {
                rel = pick(rels);
                x = randInt(4, 30);
                alpha = randInt(25, 155);
                beta = rel.equal ? alpha : 180 - alpha;
                a = randInt(2, 9); c = randInt(1, 9);
                if (a === c) continue;
                b = alpha - a * x; d = beta - c * x;
                if (Math.abs(b) <= 60 && Math.abs(d) <= 60 && (b !== 0 || d !== 0)) break;
                rel = null;
            }
            if (!rel) { rel = rels[0]; x = 16; a = 5; b = -12; c = 3; d = 20; alpha = 68; beta = 68; }
            const askAngle = Math.random() < 0.35;
            const first = Math.random() < 0.5;
            const ell = '\\(\\ell\\)';
            const questionText = `<p>Lines ${ell} and \\(m\\) are parallel, and line \\(t\\) intersects both of them. Two of the angles formed are ${rel.name}${rel.extra || ''}. The measures of these angles are \\(${degTex(a, b)}\\) and \\(${degTex(c, d)}\\). ${askAngle ? `What is the measure, in degrees, of the angle with measure \\(${first ? degTex(a, b) : degTex(c, d)}\\)?` : 'What is the value of \\(x\\)?'}</p>`;
            const answer = askAngle ? (first ? alpha : beta) : x;
            const eqLatex = rel.equal ? `${polyTex([a, b])}=${polyTex([c, d])}` : `${polyTex([a, b])}+${polyTex([c, d])}=180`;
            return {
                questionText,
                answer,
                desmosSolutions: [
                    { id: 'eq', latex: eqLatex.replace(/ /g, '') },
                    { type: 'text', id: 'note1', text: rel.equal
                        ? `${rel.name[0].toUpperCase() + rel.name.slice(1)} are equal, so ${polyText([a, b])} = ${polyText([c, d])}. Desmos draws the solution as a vertical line: x = ${x}.`
                        : `Same-side interior angles are supplementary, so (${polyText([a, b])}) + (${polyText([c, d])}) = 180. Desmos draws the solution as a vertical line: x = ${x}.` },
                    { type: 'text', id: 'note2', text: `The angles measure ${alpha}° and ${beta}°${rel.equal ? '' : ' (they add to 180°)'}. Answer: ${answer}` },
                ],
            };
        },
    },

    // ===== #20 =====
    {
        id: 'geo-triangle-angle-sum',
        title: '(Easy) Triangle Angle Sum with Expressions',
        skill: 'Lines, angles, and triangles',
        source: SRC.OUT,
        tips: [
            'The three angles of a triangle add up to \\(180^\\circ\\). Add the expressions, set the sum equal to 180, and solve for \\(x\\). In a right triangle the other two angles add up to \\(90^\\circ\\). An exterior angle equals the sum of the two interior angles that are not next to it.',
            'Read what is asked: if the question wants an angle, substitute \\(x\\) into that angle&#39;s expression. Traps: stopping at \\(x\\), giving a different angle, and using 360 (the sum for a quadrilateral) instead of 180.',
            'Desmos: type the equation, e.g. <code>2x+(x+15)+(3x-21)=180</code>. Click the vertical line to read \\(x\\), then type the angle&#39;s expression with that value.',
        ],
        questionGenerator() {
            const fmt = v => `\\(${v}\\)`;
            const inst = balancedChoice(target => {
                const kind = pick(['triangle', 'triangle', 'right', 'exterior']);
                const x = randInt(5, 30);
                const A = randInt(1, 4), B = randInt(1, 4);
                const angle = (k, b) => k * x + b;
                if (kind === 'triangle') {
                    const C = randInt(1, 4);
                    const b1 = randInt(-20, 30), b2 = randInt(-20, 30);
                    const b3 = 180 - (A + B + C) * x - b1 - b2;
                    const angs = [angle(A, b1), angle(B, b2), angle(C, b3)];
                    if (Math.abs(b3) > 60 || angs.some(v => v < 5 || v > 170)) return null;
                    const S = A + B + C, Bs = b1 + b2 + b3;
                    const x360 = (360 - Bs) / S;   // used 360 instead of 180
                    const askX = Math.random() < 0.3, which = randInt(0, 2);
                    const exprs = [[A, b1], [B, b2], [C, b3]];
                    let key, pool;
                    if (askX) { key = x; pool = [...angs, Number.isInteger(x360) ? x360 : null].filter(v => v !== null && v !== x); }
                    else {
                        key = angs[which];
                        pool = [x, ...angs.filter((_, i) => i !== which)];
                        if (Number.isInteger(x360)) pool.push(exprs[which][0] * x360 + exprs[which][1]);
                        if (angs.includes(x)) return null;   // the "value of x" distractor must differ from every angle
                    }
                    const built = choicesFromPool(key, pool.filter(v => v > 0), fmt, target);
                    return built && { ...built, kind, x, exprs, angs, askX, which };
                }
                if (kind === 'right') {
                    const b1 = randInt(-15, 30), b2 = 90 - (A + B) * x - b1;
                    const angs = [angle(A, b1), angle(B, b2)];
                    if (Math.abs(b2) > 60 || angs.some(v => v < 5 || v > 85) || angs.includes(x)) return null;
                    const which = randInt(0, 1), exprs = [[A, b1], [B, b2]];
                    const x180 = (180 - b1 - b2) / (A + B);   // forgot the right angle: set the two angles' sum to 180
                    const pool = [x, angs[1 - which]];
                    if (Number.isInteger(x180)) pool.push(exprs[which][0] * x180 + exprs[which][1]);
                    const built = choicesFromPool(angs[which], pool.filter(v => v > 0), fmt, target);
                    return built && { ...built, kind, x, exprs, angs, which };
                }
                // exterior angle at C = A + B (the two remote interior angles)
                const E = A + B + randInt(1, 3);   // the exterior angle's coefficient differs from A + B
                const b1 = randInt(-10, 30), b2 = randInt(-10, 30);
                const bE = (A + B - E) * x + b1 + b2;
                const angs = [angle(A, b1), angle(B, b2)], ext = angle(E, bE);
                if (Math.abs(bE) > 80 || angs.some(v => v < 5) || ext >= 175 || angs.includes(x) || ext === x) return null;
                const xWrong = (180 - b1 - b2 - bE) / (A + B + E);   // added all three to 180
                const pool = [x, 180 - ext, angs[0], angs[1]];
                if (Number.isInteger(xWrong) && xWrong > 0) pool.push(E * xWrong + bE);
                const built = choicesFromPool(ext, pool.filter(v => v > 0), fmt, target);
                return built && { ...built, kind, x, exprs: [[A, b1], [B, b2], [E, bE]], angs: [...angs, ext] };
            }) || { ...makeChoicesSorted(42, [27, 59, 79], fmt), kind: 'triangle', x: 27, exprs: [[2, 0], [1, 15], [3, -21]], angs: [54, 42, 60], askX: false, which: 1 };
            const { kind, x, exprs, angs } = inst;
            const L = ['A', 'B', 'C'];
            let stem, eq, steps;
            if (kind === 'triangle') {
                const { askX, which } = inst;
                stem = `In triangle \\(ABC\\), the measure of angle \\(A\\) is \\(${degTex(...exprs[0])}\\), the measure of angle \\(B\\) is \\(${degTex(...exprs[1])}\\), and the measure of angle \\(C\\) is \\(${degTex(...exprs[2])}\\). ${askX ? 'What is the value of \\(x\\)?' : `What is the measure, in degrees, of angle \\(${L[which]}\\)?`}`;
                eq = `${exprs.map(e => `\\left(${polyTex(e)}\\right)`).join('+')}=180`;
                steps = `The angles of a triangle add to 180: ${exprs.map(e => degText(...e)).join(' + ')} = 180°, so x = ${x}. The angles are ${angs.join('°, ')}°.`;
            } else if (kind === 'right') {
                const { which } = inst;
                stem = `In right triangle \\(ABC\\), angle \\(C\\) is a right angle. The measure of angle \\(A\\) is \\(${degTex(...exprs[0])}\\), and the measure of angle \\(B\\) is \\(${degTex(...exprs[1])}\\). What is the measure, in degrees, of angle \\(${L[which]}\\)?`;
                eq = `${exprs.map(e => `\\left(${polyTex(e)}\\right)`).join('+')}=90`;
                steps = `Angle C is 90°, so angles A and B add to 90: ${exprs.map(e => degText(...e)).join(' + ')} = 90°, so x = ${x}. Angle A is ${angs[0]}° and angle B is ${angs[1]}°.`;
            } else {
                stem = `In triangle \\(ABC\\), side \\(BC\\) is extended past \\(C\\) to point \\(D\\), forming exterior angle \\(ACD\\). The measure of angle \\(A\\) is \\(${degTex(...exprs[0])}\\), the measure of angle \\(B\\) is \\(${degTex(...exprs[1])}\\), and the measure of angle \\(ACD\\) is \\(${degTex(...exprs[2])}\\). What is the measure, in degrees, of angle \\(ACD\\)?`;
                eq = `${polyTex(exprs[2])}=\\left(${polyTex(exprs[0])}\\right)+\\left(${polyTex(exprs[1])}\\right)`;
                steps = `An exterior angle equals the sum of the two remote interior angles: ${degText(...exprs[2])} = ${degText(...exprs[0])} + ${degText(...exprs[1])}, so x = ${x}. Angle ACD is ${angs[2]}° (and angle ACB is ${180 - angs[2]}°).`;
            }
            return {
                questionText: `<p>${stem}</p>`,
                choices: inst.choices,
                answer: inst.answer,
                desmosSolutions: [
                    { id: 'eq', latex: eq.replace(/ /g, '') },
                    { type: 'text', id: 'note1', text: steps },
                    { type: 'text', id: 'note2', text: `Answer: ${inst.answer}) ${noteText(inst.choices[CHOICE_LETTERS.indexOf(inst.answer)])}` },
                ],
            };
        },
    },

    // ===== #36 =====
    {
        id: 'geo-rect-area-perimeter',
        title: '(Easy) Rectangle: Area and Perimeter',
        skill: 'Area and volume',
        source: SRC.OUT,
        tips: [
            'For a rectangle with length \\(\\ell\\) and width \\(w\\): area \\(= \\ell w\\) and perimeter \\(= 2\\ell + 2w\\). Use the facts you are given to find the missing side first, then compute what is asked.',
            'For a square with area \\(A\\), each side is \\(\\sqrt{A}\\) and the perimeter is \\(4\\sqrt{A}\\). If the length is \\(k\\) times the width, write the perimeter as \\(2(kw) + 2w\\) and solve for \\(w\\). Trap: answering with the side length or the area when the other measurement is asked for.',
            'Desmos is just a calculator here, e.g. <code>96/12</code> for the missing side, then <code>2(12+8)</code>.',
        ],
        questionGenerator() {
            // each object gets realistic units
            const [thing, noun, units] = pick([['A rectangle', 'rectangle', ['inches', 'feet', 'centimeters', 'meters']], ['A rectangular garden', 'garden', ['feet', 'meters']],
                ['A rectangular rug', 'rug', ['feet']], ['A rectangular poster', 'poster', ['inches', 'centimeters']]]);
            const unit = pick(units);
            const sq = { inches: 'square inches', feet: 'square feet', centimeters: 'square centimeters', meters: 'square meters' }[unit];
            const mode = pick(['areaToPerim', 'perimToArea', 'square', 'ratio']);
            let stem, answer, steps, calc;
            if (mode === 'areaToPerim') {
                const L = randInt(4, 20), W = randInt(2, L - 1);
                stem = `${thing} has an area of ${L * W} ${sq} and a length of ${L} ${unit}. What is the perimeter, in ${unit}, of the ${noun}?`;
                answer = 2 * (L + W); calc = `2\\left(${L}+\\frac{${L * W}}{${L}}\\right)`;
                steps = `Width = ${L * W} ÷ ${L} = ${W}. Perimeter = 2(${L} + ${W}) = ${answer}.`;
            } else if (mode === 'perimToArea') {
                const L = randInt(4, 20), W = randInt(2, L - 1);
                stem = `${thing} has a perimeter of ${2 * (L + W)} ${unit} and a width of ${W} ${unit}. What is the area, in ${sq}, of the ${noun}?`;
                answer = L * W; calc = `${W}\\left(\\frac{${2 * (L + W)}}{2}-${W}\\right)`;
                steps = `Length = ${2 * (L + W)} ÷ 2 − ${W} = ${L}. Area = ${L} × ${W} = ${answer}.`;
            } else if (mode === 'square') {
                const s = randInt(3, 25), askPerim = Math.random() < 0.6;
                stem = askPerim ? `A square has an area of ${s * s} ${sq}. What is the perimeter, in ${unit}, of the square?`
                    : `A square has a perimeter of ${4 * s} ${unit}. What is the area, in ${sq}, of the square?`;
                answer = askPerim ? 4 * s : s * s; calc = askPerim ? `4\\sqrt{${s * s}}` : `\\left(\\frac{${4 * s}}{4}\\right)^{2}`;
                steps = askPerim ? `Side = √${s * s} = ${s}. Perimeter = 4 × ${s} = ${answer}.` : `Side = ${4 * s} ÷ 4 = ${s}. Area = ${s}² = ${answer}.`;
            } else {
                const k = randInt(2, 5), W = randInt(2, 12), L = k * W;
                stem = `The length of ${thing.toLowerCase().replace(/^a /, 'a ')} is ${k} times its width, and its perimeter is ${2 * (L + W)} ${unit}. What is the area, in ${sq}, of the ${noun}?`;
                answer = L * W; calc = `${k}\\left(\\frac{${2 * (L + W)}}{${2 * (k + 1)}}\\right)^{2}`;
                steps = `Perimeter = 2(${k}w) + 2w = ${2 * (k + 1)}w = ${2 * (L + W)}, so w = ${W} and the length is ${L}. Area = ${L} × ${W} = ${answer}.`;
            }
            return {
                questionText: `<p>${stem}</p>`,
                answer,
                desmosSolutions: [
                    { id: 'calc', latex: calc },
                    { type: 'text', id: 'note1', text: steps },
                    { type: 'text', id: 'note2', text: `Answer: ${answer}` },
                ],
            };
        },
    },

    // ===== #37 =====
    {
        id: 'trig-ratio-from-sides',
        title: '(Easy) Trig Ratio from Side Lengths',
        skill: 'Right triangles and trigonometry',
        source: SRC.OUT,
        tips: [
            'SOH-CAH-TOA, measured from the angle in the question: \\(\\sin = \\frac{\\text{opposite}}{\\text{hypotenuse}}\\), \\(\\cos = \\frac{\\text{adjacent}}{\\text{hypotenuse}}\\), \\(\\tan = \\frac{\\text{opposite}}{\\text{adjacent}}\\). The hypotenuse is the side across from the right angle.',
            'The two acute angles are complementary, so \\(\\sin B = \\cos A\\) and \\(\\cos B = \\sin A\\): the side opposite one acute angle is adjacent to the other. If only two sides are given, find the third with \\(a^2 + b^2 = c^2\\) first.',
            'Traps: using the side opposite the wrong angle, giving the reciprocal (hypotenuse over a leg), and confusing sine with cosine.',
        ],
        questionGenerator() {
            const triples = [[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25], [20, 21, 29]];
            const inst = balancedChoice(target => {
                const [p, q, r] = pick(triples), k = r <= 13 ? randInt(1, 3) : 1;
                const [opA, adjA] = Math.random() < 0.5 ? [p * k, q * k] : [q * k, p * k];   // legs relative to angle A
                const hyp = r * k;
                const [A, B, C] = pick([['A', 'B', 'C'], ['P', 'Q', 'R'], ['X', 'Y', 'Z'], ['D', 'E', 'F']]);
                const atB = Math.random() < 1 / 3;
                const fn = pick(['sin', 'cos', 'tan']);
                // sides: BC is opposite A, AC is opposite B (adjacent to A), AB is the hypotenuse
                const opp = atB ? adjA : opA, adj = atB ? opA : adjA;
                const ratio = { sin: [opp, hyp], cos: [adj, hyp], tan: [opp, adj] };
                const F = ([n, d]) => { const [rn, rd] = reduceFraction(n, d); return { value: rn / rd, html: `\\(\\dfrac{${rn}}{${rd}}\\)` }; };
                const key = F(ratio[fn]);
                // errors: the other two ratios for this angle; the reciprocal of the answer; the same function of the other acute angle
                const otherAngle = { sin: [adj, hyp], cos: [opp, hyp], tan: [adj, opp] }[fn];
                const pool = Object.keys(ratio).filter(f => f !== fn).map(f => F(ratio[f]))
                    .concat([F([ratio[fn][1], ratio[fn][0]]), F(otherAngle)]);
                const built = choicesFromPool(key, pool, undefined, target);
                const given = Math.random() < 0.4 ? pick(['legs', 'legHyp']) : 'all';
                return built && { ...built, A, B, C, opA, adjA, hyp, atB, fn, given, ratio };
            });
            const { A, B, C, opA, adjA, hyp, atB, fn, given } = inst;
            const sides = [`${B}${C} = ${opA}`, `${A}${C} = ${adjA}`, `${A}${B} = ${hyp}`];
            const shown = given === 'all' ? sides : given === 'legs' ? sides.slice(0, 2) : pick([[sides[0], sides[2]], [sides[1], sides[2]]]);
            const ang = atB ? B : A;
            const sideList = `${shown.slice(0, -1).map(s => `\\(${s}\\)`).join(', ')}${shown.length > 2 ? ',' : ''} and \\(${shown[shown.length - 1]}\\)`;
            const [kn, kd] = inst.ratio[fn];
            return {
                questionText: `<p>In right triangle \\(${A}${B}${C}\\), angle \\(${C}\\) is a right angle, ${sideList}. What is the value of \\(\\${fn} ${ang}\\)?</p>`,
                choices: inst.choices,
                answer: inst.answer,
                desmosSolutions: [
                    { type: 'text', id: 'note1', text: `${given === 'all' ? '' : `First find the missing side with a² + b² = c²: the sides are ${B}${C} = ${opA}, ${A}${C} = ${adjA}, ${A}${B} = ${hyp}. `}The hypotenuse is ${A}${B} (opposite the right angle).` },
                    { type: 'text', id: 'note2', text: `From angle ${ang}: the opposite side is ${atB ? `${A}${C} = ${adjA}` : `${B}${C} = ${opA}`} and the adjacent side is ${atB ? `${B}${C} = ${opA}` : `${A}${C} = ${adjA}`}. ${fn} ${ang} = ${fn === 'sin' ? 'opposite/hypotenuse' : fn === 'cos' ? 'adjacent/hypotenuse' : 'opposite/adjacent'} = ${kn}/${kd}${fracStr(kn, kd) !== `${kn}/${kd}` ? ` = ${fracStr(kn, kd)}` : ''}.` },
                    { type: 'text', id: 'note3', text: `Answer: ${inst.answer}) ${fracStr(kn, kd)}` },
                ],
            };
        },
    },

    // ===== #38 =====
    {
        id: 'trig-special-right',
        title: '(Medium) Special Right Triangles',
        skill: 'Right triangles and trigonometry',
        source: SRC.OUT,
        tips: [
            '30°-60°-90°: the sides are in the ratio \\(1 : \\sqrt{3} : 2\\) (short leg, long leg, hypotenuse). The short leg is opposite 30°, and the hypotenuse is twice the short leg. 45°-45°-90°: the sides are \\(1 : 1 : \\sqrt{2}\\), so a square&#39;s diagonal is its side times \\(\\sqrt{2}\\).',
            'An equilateral triangle&#39;s height cuts it into two 30-60-90 triangles, so the height is \\(\\frac{\\sqrt{3}}{2}\\) times the side. Traps: using \\(\\sqrt{2}\\) in a 30-60-90 triangle (or \\(\\sqrt{3}\\) in a 45-45-90 one), multiplying where you should divide, and giving the wrong side.',
            'Desmos can check a decimal, e.g. <code>9sqrt(3)*2/sqrt(3)</code>, but the choices are exact. Compare decimals if you are unsure which radical matches.',
        ],
        questionGenerator() {
            // a length is stored as its square [num, den]; lenChoice shows it as a simplified radical
            const lenChoice = ([n, d]) => { const [rn, rd] = reduceFraction(n, d); const [k, m] = simplifyRoot(rn * rd); return radChoice(k, rd, m); };
            const sqTex = s => lenChoice(s).html.slice(2, -2);
            const inst = balancedChoice(target => {
                const mode = pick(['thirty', 'thirty', 'fortyfive', 'equilateral']);
                if (mode === 'thirty') {
                    const p = randInt(2, 12), S = Math.random() < 0.5 ? p * p : 3 * p * p;   // short leg = p or p√3
                    const sq = { short: [S, 1], long: [3 * S, 1], hyp: [4 * S, 1] };
                    const names = Object.keys(sq);
                    const g = pick(names), a = pick(names.filter(x => x !== g));
                    const third = names.find(x => x !== g && x !== a);
                    const G = sq[g][0];
                    const pool = [sq[third]];                                           // gave the wrong side
                    if (a === 'hyp') pool.push([2 * G, 1]);                             // √2 ratio: leg × √2
                    else if (g === 'hyp') pool.push([G, 2]);                            // √2 ratio: hypotenuse ÷ √2
                    else pool.push([G, 1]);                                             // treated the legs as equal (45-45-90)
                    if (g === 'short' && a === 'long') pool.push([G, 3]);               // divided by √3 instead of multiplying
                    if (g === 'long' && a === 'short') pool.push([3 * G, 1]);           // multiplied by √3 instead of dividing
                    if (g === 'short' && a === 'hyp') pool.push([G, 4]);                // halved instead of doubled
                    if (g === 'hyp' && a === 'short') pool.push([4 * G, 1]);            // doubled instead of halved
                    if (g === 'long' && a === 'hyp') pool.push([4 * G, 9]);             // 2 × (long ÷ √3) slip: 2·long/3
                    if (g === 'hyp' && a === 'long') pool.push([G, 4]);                 // took half the hypotenuse
                    const built = choicesFromPool(lenChoice(sq[a]), pool.map(lenChoice), undefined, target);
                    return built && { ...built, mode, g, a, sq };
                }
                if (mode === 'fortyfive') {
                    const p = randInt(2, 15), legIsInt = Math.random() < 0.5;
                    const leg = legIsInt ? [p * p, 1] : [2 * p * p, 1];                // leg p, or leg p√2 (so the diagonal is 2p)
                    const diag = [2 * leg[0], 1];
                    const askSide = Math.random() < 0.6;
                    const [G, key] = askSide ? [diag, leg] : [leg, diag];
                    const pool = askSide
                        ? [[2 * G[0], 1], [G[0], 4], [G[0], 3]]                         // multiplied by √2; halved; divided by √3
                        : [[G[0], 2], [3 * G[0], 1], [4 * G[0], 1]];                    // divided by √2; multiplied by √3; doubled
                    const built = choicesFromPool(lenChoice(key), pool.map(lenChoice), undefined, target);
                    return built && { ...built, mode, askSide, G, key };
                }
                const side = 2 * randInt(2, 12), usePerim = Math.random() < 0.4;
                const key = [3 * side * side, 4];                                       // (side·√3/2)²
                const pool = [[2 * side * side, 4], [side * side, 4], [3 * side * side, 1]];   // √2 for √3; half the side; forgot ÷2
                if (usePerim) pool.push([3 * 9 * side * side, 4]);                       // used the perimeter as the side
                const built = choicesFromPool(lenChoice(key), pool.map(lenChoice), undefined, target);
                return built && { ...built, mode, side, usePerim };
            });
            let stem, notes;
            if (inst.mode === 'thirty') {
                const { g, a, sq } = inst;
                const angA = pick([30, 60]);
                const [A, B, C] = ['A', 'B', 'C'];
                // short leg is opposite 30°: with angle A = 30°, BC is short and AC is long; with A = 60°, the reverse
                const seg = { short: angA === 30 ? 'BC' : 'AC', long: angA === 30 ? 'AC' : 'BC', hyp: 'AB' };
                stem = `In right triangle \\(ABC\\), angle \\(C\\) is a right angle and the measure of angle \\(A\\) is \\(${angA}^{\\circ}\\). If \\(${seg[g]} = ${sqTex(sq[g])}\\), what is the length of \\(${seg[a]}\\)?`;
                notes = `Angle B is ${90 - angA}°. The side opposite 30° (${seg.short}) is the short leg s, the side opposite 60° (${seg.long}) is s√3, and the hypotenuse (AB) is 2s. Here s = ${noteText(sqTex(sq.short)).replace(/\\sqrt\{(\d+)\}/g, '√$1')}.`;
            } else if (inst.mode === 'fortyfive') {
                const { askSide, G } = inst;
                stem = askSide ? pick([`A square has a diagonal of length \\(${sqTex(G)}\\). What is the side length of the square?`, `In an isosceles right triangle, the hypotenuse has length \\(${sqTex(G)}\\). What is the length of each leg?`])
                    : pick([`A square has a side length of \\(${sqTex(G)}\\). What is the length of a diagonal of the square?`, `In an isosceles right triangle, each leg has length \\(${sqTex(G)}\\). What is the length of the hypotenuse?`]);
                notes = `A square's diagonal splits it into two 45°-45°-90° triangles: hypotenuse = leg × √2${askSide ? ', so leg = hypotenuse ÷ √2' : ''}.`;
            } else {
                const { side, usePerim } = inst;
                stem = usePerim ? `An equilateral triangle has a perimeter of ${3 * side}. What is the height of the triangle?` : `An equilateral triangle has sides of length ${side}. What is the height of the triangle?`;
                notes = `${usePerim ? `Each side is ${3 * side} ÷ 3 = ${side}. ` : ''}The height splits the triangle into two 30°-60°-90° triangles with short leg ${side / 2}, so the height is ${side / 2}√3.`;
            }
            const keyText = noteText(inst.choices[CHOICE_LETTERS.indexOf(inst.answer)]).replace(/\\sqrt\{(\d+)\}/g, '√$1');
            return {
                questionText: `<p>${stem}</p>`,
                choices: inst.choices,
                answer: inst.answer,
                desmosSolutions: [
                    { type: 'text', id: 'note1', text: notes },
                    { type: 'text', id: 'note2', text: `Answer: ${inst.answer}) ${keyText}` },
                ],
            };
        },
    },

    // ===== #39 =====
    {
        id: 'geo-isosceles-exterior-angle',
        title: '(Medium) Isosceles Triangle and an Exterior Angle',
        skill: 'Lines, angles, and triangles',
        source: SRC.OUT,
        tips: [
            'In an isosceles triangle, the angles opposite the two equal sides are equal. If the angle between the equal sides is \\(v^\\circ\\), each of the other two angles is \\(\\frac{180 - v}{2}\\) degrees.',
            'An exterior angle and the interior angle next to it add up to \\(180^\\circ\\), and the exterior angle equals the sum of the two remote interior angles. Traps: mixing up which angles are equal, and stopping at an interior angle when the exterior angle is asked for.',
            'Sketch the triangle and label every angle you know as you go. Desmos isn&#39;t needed.',
        ],
        questionGenerator() {
            const fmt = v => `\\(${v}\\)`;
            const inst = balancedChoice(target => {
                const [X, Y, Z] = pick([['P', 'Q', 'R'], ['A', 'B', 'C'], ['D', 'E', 'F'], ['J', 'K', 'L']]);
                // rotate which vertex is the apex (the angle between the equal sides)
                const order = pick([[X, Y, Z], [Y, X, Z], [Z, X, Y]]);
                const [apex, b1, b2] = order;   // the base is b1 b2; the side b1 b2 is extended through b2 to S
                const mode = pick(['apexToExt', 'baseToApex', 'extToApex']);
                let key, pool, given, ask;
                if (mode === 'apexToExt') {
                    const v = 2 * randInt(10, 70), base = (180 - v) / 2;
                    key = 180 - base;                                     // exterior angle at b2
                    pool = [base, 180 - v, v, 180 - 2 * v].filter(x => x > 0 && x < 180);
                    given = `the measure of angle \\(${apex}\\) is \\(${v}^{\\circ}\\)`; ask = 'ext';
                } else if (mode === 'baseToApex') {
                    const b = randInt(20, 85), v = 180 - 2 * b;
                    key = v;
                    pool = [b, 180 - b, (180 - b) / 2, 90 - b].filter(x => Number.isInteger(x) && x > 0 && x < 180);
                    given = `the measure of angle \\(${b1}\\) is \\(${b}^{\\circ}\\)`; ask = 'apex';
                } else {
                    const b = randInt(20, 85), e = 180 - b, v = 180 - 2 * b;
                    key = v;
                    pool = [b, 2 * b, e - 90, e / 2].filter(x => Number.isInteger(x) && x > 0 && x < 180);
                    given = `the measure of angle \\(${apex}${b2}S\\) is \\(${e}^{\\circ}\\)`; ask = 'apex';
                }
                const built = choicesFromPool(key, pool, fmt, target);
                return built && { ...built, apex, b1, b2, given, ask, key, mode };
            });
            const { apex, b1, b2, given, ask, key } = inst;
            const tri = [apex, b1, b2].sort().join('');
            const ext = inst.mode === 'baseToApex' ? '' : ` Side \\(${b1}${b2}\\) is extended through \\(${b2}\\) to point \\(S\\).`;
            const stem = `In triangle \\(${tri}\\), \\(${apex}${b1} = ${apex}${b2}\\).${ext} In this triangle, ${given}. What is the measure, in degrees, of ${ask === 'ext' ? `angle \\(${apex}${b2}S\\)` : `angle \\(${apex}\\)`}?`;
            return {
                questionText: `<p>${stem}</p>`,
                choices: inst.choices,
                answer: inst.answer,
                desmosSolutions: [
                    { type: 'text', id: 'note1', text: `${apex}${b1} = ${apex}${b2}, so the angles opposite those sides are equal: angle ${b2} = angle ${b1}. Angle ${apex} is between the equal sides.` },
                    { type: 'text', id: 'note2', text: inst.mode === 'apexToExt'
                        ? `Each base angle is (180 − ${180 - 2 * (180 - key)})/2 = ${180 - key}°, and the exterior angle at ${b2} is 180 − ${180 - key} = ${key}°.`
                        : inst.mode === 'baseToApex' ? `Both base angles are ${(180 - key) / 2}°, so angle ${apex} = 180 − 2(${(180 - key) / 2}) = ${key}°.`
                        : `Angle ${apex}${b2}${b1} = 180 − (exterior angle) = ${(180 - key) / 2}°, which is also angle ${b1}. So angle ${apex} = 180 − 2(${(180 - key) / 2}) = ${key}°.` },
                    { type: 'text', id: 'note3', text: `Answer: ${inst.answer}) ${key}` },
                ],
            };
        },
    },

    // ===== #40 =====
    {
        id: 'geo-similar-parallel-side',
        title: '(Medium) Parallel Segment Inside a Triangle',
        skill: 'Lines, angles, and triangles',
        source: SRC.OUT,
        tips: [
            'If \\(DE\\) is parallel to \\(BC\\), triangle \\(ADE\\) is similar to triangle \\(ABC\\) (they share angle \\(A\\), and the parallel lines make the other angles equal). Corresponding sides are proportional: \\(\\frac{AD}{AB} = \\frac{AE}{AC} = \\frac{DE}{BC}\\).',
            'Use the whole side \\(AB = AD + DB\\), not \\(DB\\), when comparing with \\(BC\\). Traps: using \\(\\frac{DB}{AD}\\) or \\(\\frac{AD}{DB}\\) as the scale factor, and adding a length instead of scaling.',
            'Desmos: type the proportion with \\(x\\), e.g. <code>6/(6+4)=9/x</code>. Desmos draws a vertical line at the answer.',
        ],
        questionGenerator() {
            const fmt = v => `\\(${num(v)}\\)`;
            const ok = v => v > 0 && Number.isInteger(2 * roundTo(v, 9));
            const inst = balancedChoice(target => {
                let AD = randInt(2, 12), DB = randInt(1, 10);
                if (AD === DB) return null;
                const mode = pick(['BC', 'BC', 'DE', 'AE']);
                // a ratio is stated in lowest terms, as on the SAT ("3 to 1", never "12 to 4")
                if (mode === 'AE') { const g = gcd(AD, DB); AD /= g; DB /= g; }
                const AB = AD + DB;
                let key, pool, given, ask, eq;
                if (mode === 'BC') {
                    const DE = randInt(2, 15);
                    key = DE * AB / AD;
                    pool = [DE * DB / AD, DE * AD / DB, DE + DB, DE * AB / DB];       // DB/AD for AD/AB; AD/DB; additive; AB/DB
                    given = `\\(AD = ${AD}\\), \\(DB = ${DB}\\), and \\(DE = ${DE}\\)`; ask = 'BC'; eq = `\\frac{${AD}}{${AD}+${DB}}=\\frac{${DE}}{x}`;
                } else if (mode === 'DE') {
                    const BC = randInt(4, 24);
                    key = BC * AD / AB;
                    pool = [BC * AD / DB, BC * DB / AD, BC - DB, BC * DB / AB];       // AD/DB; DB/AD; subtracted; DB/AB
                    given = `\\(AD = ${AD}\\), \\(DB = ${DB}\\), and \\(BC = ${BC}\\)`; ask = 'DE'; eq = `\\frac{${AD}}{${AD}+${DB}}=\\frac{x}{${BC}}`;
                } else {
                    const AC = randInt(4, 30);
                    key = AC * AD / AB;
                    pool = [AC * AD / DB, AC * DB / AB, AC / 2, AC * DB / AD];         // AD/DB; EC instead of AE; halved; DB/AD
                    given = `the ratio of \\(AD\\) to \\(DB\\) is \\(${AD}\\) to \\(${DB}\\), and \\(AC = ${AC}\\)`; ask = 'AE'; eq = `\\frac{${AD}}{${AD}+${DB}}=\\frac{x}{${AC}}`;
                }
                if (!ok(key)) return null;
                const built = choicesFromPool(key, pool.filter(ok), fmt, target);
                return built && { ...built, given, ask, eq, key, AD, DB };
            });
            const { given, ask, eq, key, AD, DB } = inst;
            return {
                questionText: `<p>In triangle \\(ABC\\), point \\(D\\) lies on \\(\\overline{AB}\\) and point \\(E\\) lies on \\(\\overline{AC}\\) such that \\(\\overline{DE}\\) is parallel to \\(\\overline{BC}\\). If ${given}, what is the length of \\(\\overline{${ask}}\\)?</p>`,
                choices: inst.choices,
                answer: inst.answer,
                desmosSolutions: [
                    { id: 'prop', latex: eq },
                    { type: 'text', id: 'note1', text: `DE ∥ BC makes triangle ADE similar to triangle ABC with scale factor AD/AB = ${AD}/${AD + DB} (AB = AD + DB = ${AD + DB}).` },
                    { type: 'text', id: 'note2', text: `Desmos draws the solution as a vertical line at x = ${num(key)}. Answer: ${inst.answer}) ${num(key)}` },
                ],
            };
        },
    },

    // ===== #78 =====
    {
        id: 'circ-tangent-slope',
        title: '(Hard) Slope of a Line Tangent to a Circle',
        skill: 'Circles',
        source: 'https://acely.com/desmos-guide-library/circles-slope-of-tangent-line',
        tips: [
            'A tangent line is perpendicular to the radius drawn to the point of tangency. Find the slope of that radius (from the center to the point), then take the negative reciprocal.',
            'If the circle is written in expanded form, complete the square first to find the center. Traps: giving the radius&#39;s slope, its reciprocal, or its negative instead of the negative reciprocal, and using the point alone (as if the center were the origin).',
            'Desmos: graph the circle and the point, then type <code>y-y_0=m(x-x_0)</code> with the point&#39;s coordinates and add a slider for \\(m\\). The line touches the circle only once at the right slope.',
        ],
        questionGenerator() {
            const inst = balancedChoice(target => {
                const [p, q, r] = pick([[3, 4, 5], [5, 12, 13], [8, 15, 17]]), s = pick(r === 5 ? [1, 1, 2] : [1]);
                let [dx, dy] = Math.random() < 0.5 ? [p * s, q * s] : [q * s, p * s];
                dx *= pick([1, -1]); dy *= pick([1, -1]);
                const h = randInt(-8, 8), k = randInt(-8, 8), R = r * s;
                const px = h + dx, py = k + dy;
                if (px === 0 || py === 0 || (h === 0 && k === 0)) return null;
                const askInt = Math.random() < 0.25;
                const F = (n, d) => { const [rn, rd] = reduceFraction(n, d); return { value: rn / rd, html: `\\(${rd === 1 ? rn : `${rn < 0 ? '-' : ''}\\dfrac{${Math.abs(rn)}}{${rd}}`}\\)` }; };
                const slopes = { key: [-dx, dy], radius: [dy, dx], recip: [dx, dy], neg: [-dy, dx], origin: [-px, py] };   // origin: the center ignored
                let key, pool;
                if (!askInt) { key = F(...slopes.key); pool = [F(...slopes.radius), F(...slopes.recip), F(...slopes.neg), F(...slopes.origin)]; }
                else {   // y-intercept of the line through P with each slope: b = py - m·px
                    const bOf = ([n, d]) => F(py * d - n * px, d);
                    key = bOf(slopes.key); pool = [bOf(slopes.radius), bOf(slopes.recip), bOf(slopes.neg)];
                }
                const built = choicesFromPool(key, pool, undefined, target);
                return built && { ...built, h, k, R, px, py, dx, dy, askInt, expanded: Math.random() < 0.5 };
            });
            const { h, k, R, px, py, dx, dy, askInt, expanded } = inst;
            const std = `(${shiftTex(h)})^2 + (${shiftTex(k, 'y')})^2 = ${R * R}`.replace('(x)^2', 'x^2').replace('(y)^2', 'y^2');
            const exp = `x^2 + y^2${term(-2 * h, 'x')}${term(-2 * k, 'y')}${term(h * h + k * k - R * R, '')} = 0`;
            const circ = expanded ? exp : std;
            const m = fracStr(-dx, dy);
            return {
                questionText: `$$${circ}$$<p>The given equation defines a circle in the <i>xy</i>-plane. A line is tangent to the circle at the point \\((${px}, ${py})\\). What is ${askInt ? 'the <i>y</i>-coordinate of the <i>y</i>-intercept of this line' : 'the slope of this line'}?</p>`,
                choices: inst.choices,
                answer: inst.answer,
                desmosSolutions: [
                    { id: 'circle', latex: circ.replace(/ /g, '') },
                    { id: 'pt', latex: `(${px},${py})` },
                    { id: 'tan', latex: `y-${py < 0 ? `(${py})` : py}=m\\left(x-${px < 0 ? `(${px})` : px}\\right)` },
                    { id: 'm', latex: `m=${(-dx / dy).toFixed(6).replace(/\.?0+$/, '')}` },
                    { type: 'text', id: 'note1', text: `${expanded ? `Completing the square gives center (${h}, ${k}) and radius ${R}. ` : `The center is (${h}, ${k}). `}The radius to (${px}, ${py}) has slope (${py} − ${k < 0 ? `(${k})` : k})/(${px} − ${h < 0 ? `(${h})` : h}) = ${fracStr(dy, dx)}.` },
                    { type: 'text', id: 'note2', text: `The tangent is perpendicular to the radius, so its slope is the negative reciprocal, ${m}.${askInt ? ` Its y-intercept is ${py} − (${m})(${px}) = ${fracStr(py * dy + dx * px, dy)}.` : ''} Answer: ${inst.answer}) ${noteText(inst.choices[CHOICE_LETTERS.indexOf(inst.answer)]).replace(/\\dfrac\{(\d+)\}\{(\d+)\}/, '$1/$2')}` },
                ],
            };
        },
    },

    // ===== #77 =====
    {
        id: 'circ-point-inside-outside',
        title: '(Hard) Inside, On or Outside a Circle',
        skill: 'Circles',
        source: 'https://acely.com/desmos-guide-library/circle-point-outside-of-circle',
        tips: [
            'Find the center \\((h, k)\\) and radius \\(r\\) (complete the square if the equation is expanded). A point is inside the circle when its distance to the center is less than \\(r\\): \\((x - h)^2 + (y - k)^2 < r^2\\). Equal means on the circle, and greater means outside.',
            'Traps: a point exactly on the circle is neither inside nor outside, and \\((x - 3)^2\\) means the center has \\(x = 3\\), not \\(-3\\). Substitute each point into the left side and compare with \\(r^2\\).',
            'Desmos: graph the circle and type the four points; you can see which one is inside or outside. Use a point&#39;s exact value to settle anything that looks close to the circle.',
        ],
        questionGenerator() {
            for (let attempt = 0; attempt < 200; attempt++) {
                const h = randNonZero(-6, 6), k = randNonZero(-6, 6);
                if (Math.abs(h) + Math.abs(k) < 3) continue;   // the sign-flip trap needs the centers apart
                const [p, q, r] = pick([[3, 4, 5], [6, 8, 10], [5, 12, 13]]);
                const ask = pick(['inside', 'outside']);
                const d2 = (x, y, cx, cy) => (x - cx) ** 2 + (y - cy) ** 2;
                const R2 = r * r;
                const status = (x, y) => Math.sign(d2(x, y, h, k) - R2);   // −1 inside, 0 on, 1 outside
                const flipStatus = (x, y) => Math.sign(d2(x, y, -h, -k) - R2);
                const want = ask === 'inside' ? -1 : 1;
                const grid = [];
                for (let x = h - r - 4; x <= h + r + 4; x++) for (let y = k - r - 4; y <= k + r + 4; y++) grid.push([x, y]);
                const [ox, oy] = pick([[p, q], [q, p], [-p, q], [p, -q], [-q, -p]]);
                const onPt = [h + ox, k + oy];                                                        // exactly on the circle
                const flipPts = shuffle(grid.filter(([x, y]) => flipStatus(x, y) === want && status(x, y) !== want && status(x, y) !== 0));   // right only with the center's signs flipped
                const keyPts = shuffle(grid.filter(([x, y]) => status(x, y) === want && flipStatus(x, y) !== want && (x !== h || y !== k)));
                const otherPts = shuffle(grid.filter(([x, y]) => status(x, y) === -want && Math.abs(d2(x, y, h, k) - R2) <= 3 * r));   // just across the boundary
                if (!flipPts.length || !keyPts.length || !otherPts.length) continue;
                const pts = [keyPts[0], onPt, flipPts[0], otherPts[0]];
                if (new Set(pts.map(String)).size !== 4) continue;
                if (pts.filter(([x, y]) => status(x, y) === want).length !== 1) throw new Error('more than one point meets the condition');
                const tex = ([x, y]) => `\\((${x}, ${y})\\)`;
                const built = makeChoices(tex(pts[0]), pts.slice(1).map(tex));
                const expanded = Math.random() < 0.55;
                const circ = expanded ? `x^2 + y^2${term(-2 * h, 'x')}${term(-2 * k, 'y')}${term(h * h + k * k - R2, '')} = 0` : `(${shiftTex(h)})^2 + (${shiftTex(k, 'y')})^2 = ${R2}`;
                const byTex = new Map(pts.map(P => [tex(P), P]));
                return {
                    questionText: `$$${circ}$$<p>The given equation represents a circle in the <i>xy</i>-plane. Which of the following points lies ${ask} the circle?</p>`,
                    choices: built.choices,
                    answer: built.answer,
                    desmosSolutions: [
                        { id: 'circle', latex: circ.replace(/ /g, '') },
                        ...built.choices.map((ch, i) => { const [x, y] = byTex.get(ch); return { id: `pt${CHOICE_LETTERS[i]}`, latex: `(${x},${y})`, label: CHOICE_LETTERS[i], showLabel: true }; }),
                        { type: 'text', id: 'note1', text: `${expanded ? 'Completing the square: ' : ''}center (${h}, ${k}), radius ${r}, so r² = ${R2}. For each point compare (x − h)² + (y − k)² with ${R2}: ${built.choices.map(ch => { const [x, y] = byTex.get(ch); return `(${x}, ${y}) → ${d2(x, y, h, k)}`; }).join('; ')}.` },
                        { type: 'text', id: 'note2', text: `${ask === 'inside' ? 'Less than' : 'Greater than'} ${R2} means ${ask}. Answer: ${built.answer}) (${pts[0][0]}, ${pts[0][1]})` },
                    ],
                };
            }
            throw new Error('circ-point-inside-outside: no instance');
        },
    },

    // ===== #76 =====
    {
        id: 'circ-center-general-form',
        title: '(Hard) Center of a Circle from Its Expanded Equation',
        skill: 'Circles',
        source: 'https://acely.com/desmos-guide-library/circles-coordinates-of-center',
        tips: [
            'Get the \\(x^2\\) and \\(y^2\\) coefficients to 1 first (divide every term by 2 in \\(2x^2 + 2y^2 + \\ldots\\)). Then for \\(x^2 + y^2 + Dx + Ey + F = 0\\), the center is \\(\\left(-\\frac{D}{2}, -\\frac{E}{2}\\right)\\): complete the square on \\(x\\) and on \\(y\\).',
            'Traps: keeping the signs of \\(D\\) and \\(E\\) (the center&#39;s signs are opposite), forgetting to halve, swapping the coordinates, and halving before dividing out the leading coefficient.',
            'Desmos: graph the equation as given and click the circle&#39;s leftmost and rightmost points; the center&#39;s x-coordinate is halfway between them (do the same with the top and bottom for y).',
        ],
        questionGenerator() {
            for (let attempt = 0; attempt < 200; attempt++) {
                const a = Math.random() < 0.55 ? pick([2, 3]) : 1;
                const h = randNonZero(-9, 9), k = randNonZero(-9, 9), r = randInt(2, 10);
                if (Math.abs(h) === Math.abs(k)) continue;   // keeps "swapped" and "signs flipped" distinct
                const D = -2 * a * h, E = -2 * a * k, F = a * (h * h + k * k - r * r);
                const pt = (x, y) => `\\((${x}, ${y})\\)`;
                const key = pt(h, k);
                // errors: signs flipped; not halved; coordinates swapped; with a ≠ 1, halved without dividing by a first
                const pool = [pt(-h, -k), pt(-D / a, -E / a), pt(k, h)];
                // in the doubled form, "halved without dividing by the leading coefficient first" is always offered
                const must = a !== 1 ? [pt(-D / 2, -E / 2)] : [];
                const wrong = [...must, ...shuffle([...new Set(pool)].filter(w => w !== key && !must.includes(w)))].slice(0, 3);
                if (wrong.length < 3) continue;
                const built = makeChoices(key, wrong);
                const eq = `${a === 1 ? '' : a}x^2 + ${a === 1 ? '' : a}y^2${term(D, 'x')}${term(E, 'y')}${term(F, '')} = 0`;
                return {
                    questionText: pick([
                        `$$${eq}$$<p>The given equation defines a circle in the <i>xy</i>-plane. What are the coordinates of the center of the circle?</p>`,
                        `<p>The equation \\(${eq}\\) defines a circle in the <i>xy</i>-plane. What are the coordinates of the center of the circle?</p>`,
                    ]),
                    choices: built.choices,
                    answer: built.answer,
                    desmosSolutions: [
                        { id: 'circle', latex: eq.replace(/ /g, '') },
                        { id: 'center', latex: `(${h},${k})`, label: 'center', showLabel: true },
                        { type: 'text', id: 'note1', text: `${a === 1 ? '' : `Divide every term by ${a}: x² + y²${term(D / a, 'x')}${term(E / a, 'y')}${term(F / a, '')} = 0. `}Complete the square: (x ${h > 0 ? '-' : '+'} ${Math.abs(h)})² + (y ${k > 0 ? '-' : '+'} ${Math.abs(k)})² = ${r * r}.` },
                        { type: 'text', id: 'note2', text: `The center is (${h}, ${k}) and the radius is ${r}. Answer: ${built.answer}) (${h}, ${k})` },
                    ],
                };
            }
            throw new Error('circ-center-general-form: no instance');
        },
    },

    // ===== #79 =====
    {
        id: 'trig-cofunction-angle-equation',
        title: '(Hard) Complementary Angles: sin x° = cos y°',
        skill: 'Right triangles and trigonometry',
        source: SRC.OUT,
        degreeMode: true,
        tips: [
            'For acute angles, \\(\\sin a^\\circ = \\cos b^\\circ\\) exactly when \\(a + b = 90\\). So set the two angle expressions to add up to 90 and solve for the unknown.',
            'In a right triangle, the two acute angles add up to \\(90^\\circ\\), so \\(\\sin A = \\cos B\\). Trap: setting the two expressions <i>equal</i> to each other (that would be \\(\\sin a = \\sin b\\)).',
            'Desmos (in degree mode): type <code>(3x+8)+(2x-3)=90</code> and read the vertical line, then check by typing <code>sin(3k+8)</code> and <code>cos(2k-3)</code> with your value.',
        ],
        questionGenerator() {
            for (let attempt = 0; attempt < 300; attempt++) {
                const k = randInt(3, 20), a = randInt(1, 6), c = randInt(1, 6);
                const A = randInt(10, 80), B = 90 - A;                        // both strictly between 0 and 90
                const b = A - a * k, d = B - c * k;
                if (Math.abs(b) > 40 || Math.abs(d) > 40 || (b === 0 && d === 0)) continue;
                const L = pick(['k', 'x', 'n']);
                const ang = (m, n0) => `(${polyTex([m, n0]).replace(/x/g, L)})^{\\circ}`;
                const angText = (m, n0) => `(${polyText([m, n0]).replace(/x/g, L)})°`;
                const form = pick(['eq', 'eq', 'triangle']);
                const flip = Math.random() < 0.4;   // cos(...) = sin(...)
                let questionText;
                if (form === 'eq') {
                    const lhs = flip ? `\\cos\\left(${ang(a, b)}\\right)` : `\\sin\\left(${ang(a, b)}\\right)`;
                    const rhs = flip ? `\\sin\\left(${ang(c, d)}\\right)` : `\\cos\\left(${ang(c, d)}\\right)`;
                    questionText = `$$${lhs} = ${rhs}$$<p>In the given equation, both angle measures are between \\(0^{\\circ}\\) and \\(90^{\\circ}\\). What is the value of \\(${L}\\)?</p>`;
                } else {
                    questionText = `<p>In right triangle \\(ABC\\), angle \\(C\\) is a right angle and the measure of angle \\(A\\) is \\(${ang(a, b)}\\). If \\(\\sin A = \\cos\\left(${ang(c, d)}\\right)\\), where \\(0 \\lt ${polyTex([c, d]).replace(/x/g, L)} \\lt 90\\), what is the value of \\(${L}\\)?</p>`;
                }
                return {
                    questionText,
                    answer: k,
                    desmosSolutions: [
                        { id: 'eq', latex: `\\left(${polyTex([a, b]).replace(/ /g, '')}\\right)+\\left(${polyTex([c, d]).replace(/ /g, '')}\\right)=90` },
                        { id: 'check1', latex: `\\sin\\left(${A}\\right)` },
                        { id: 'check2', latex: `\\cos\\left(${B}\\right)` },
                        { type: 'text', id: 'note1', text: `The sine of one acute angle equals the cosine of its complement, so ${angText(a, b)} + ${angText(c, d)} = 90°. Desmos draws the solution as a vertical line at x = ${k}.` },
                        { type: 'text', id: 'note2', text: `With ${L} = ${k} the angles are ${A}° and ${B}°, which add to 90°, and sin(${A}°) = cos(${B}°) as the two values above show. Answer: ${k}` },
                    ],
                };
            }
            throw new Error('trig-cofunction-angle-equation: no instance');
        },
    },

    // ===== #80 =====
    {
        id: 'trig-similar-triangle-ratio',
        title: '(Hard) Carry a Trig Ratio to a Similar Triangle',
        skill: 'Right triangles and trigonometry',
        source: SRC.OUT,
        tips: [
            'Similar triangles have equal corresponding angles, so a trig ratio of angle \\(A\\) is the same as that ratio of the matching angle \\(D\\). Write the ratio for angle \\(D\\) using the sides of triangle \\(DEF\\), then substitute the known side.',
            'Name the sides from angle \\(D\\): the side opposite \\(D\\) is \\(EF\\), the side adjacent to \\(D\\) is \\(DF\\), and the hypotenuse (opposite the right angle at \\(F\\)) is \\(DE\\). Traps: using the reciprocal ratio, and giving the hypotenuse or the other leg.',
            'A quick check: the three sides of \\(DEF\\) are a scaled copy of a Pythagorean triple (such as 8-15-17), so every side is the same multiple of the matching side in that triple.',
        ],
        questionGenerator() {
            const inst = balancedChoice(target => {
                const [p, q, r] = pick([[8, 15, 17], [5, 12, 13], [7, 24, 25], [3, 4, 5], [20, 21, 29]]);
                // for angle A: opposite leg BC = p, adjacent leg AC = q, hypotenuse AB = r (as a ratio)
                const [opp, adj] = Math.random() < 0.5 ? [p, q] : [q, p];
                const s = randInt(2, r >= 25 ? 3 : 6);                          // DEF = s × (opp, adj, r)
                const sides = { EF: opp * s, DF: adj * s, DE: r * s };
                const fn = pick(['tan', 'sin', 'cos']);
                const ratio = { tan: [opp, adj], sin: [opp, r], cos: [adj, r] }[fn];
                // the given side and the asked side, consistent with the ratio
                const pairs = { tan: [['DF', 'EF'], ['EF', 'DF']], sin: [['DE', 'EF'], ['EF', 'DE']], cos: [['DE', 'DF'], ['DF', 'DE']] }[fn];
                const [giv, ask] = pick(pairs);
                const key = sides[ask];
                const other = ['EF', 'DF', 'DE'].find(x => x !== giv && x !== ask);
                // errors: the reciprocal ratio applied; the third side; a side of the triple not scaled; the right side but from the wrong leg
                const recip = giv === pairs[0][0] ? sides[giv] * ratio[1] / ratio[0] : sides[giv] * ratio[0] / ratio[1];
                // errors: the reciprocal ratio; the third side; a side of the triple left unscaled; the given side multiplied
                // by the ratio's numerator without dividing by its denominator
                const [rn0, rd0] = reduceFraction(...ratio);
                const forgotDivide = sides[giv] * (giv === pairs[0][0] ? rn0 : rd0);
                const pool = [recip, sides[other], key / s, sides[other] / s, forgotDivide]
                    .filter(v => v > 0 && Number.isInteger(v) && v !== key && v !== sides[giv]);
                const built = choicesFromPool(key, [...new Set(pool)], v => `\\(${v}\\)`, target);
                return built && { ...built, fn, ratio, giv, ask, sides, opp, adj, r, s };
            });
            const { fn, ratio, giv, ask, sides, s } = inst;
            const [rn, rd] = reduceFraction(...ratio);
            return {
                questionText: `<p>Triangles \\(ABC\\) and \\(DEF\\) are similar, where vertices \\(A\\), \\(B\\), and \\(C\\) correspond to vertices \\(D\\), \\(E\\), and \\(F\\), respectively. Angles \\(C\\) and \\(F\\) are right angles. If \\(\\${fn} A = \\dfrac{${rn}}{${rd}}\\) and \\(${giv} = ${sides[giv]}\\), what is the length of \\(${ask}\\)?</p>`,
                choices: inst.choices,
                answer: inst.answer,
                desmosSolutions: [
                    { type: 'text', id: 'note1', text: `A corresponds to D, so ${fn} D = ${fn} A = ${rn}/${rd}. From angle D: opposite = EF, adjacent = DF, hypotenuse = DE (across from the right angle at F).` },
                    { type: 'text', id: 'note2', text: `${fn} D = ${{ tan: 'EF/DF', sin: 'EF/DE', cos: 'DF/DE' }[fn]} = ${rn}/${rd}, and ${giv} = ${sides[giv]}, so ${ask} = ${sides[ask]}. (Triangle DEF's sides are ${sides.EF}, ${sides.DF}, ${sides.DE}: ${s} times a Pythagorean triple.)` },
                    { type: 'text', id: 'note3', text: `Answer: ${inst.answer}) ${sides[ask]}` },
                ],
            };
        },
    },

    // ===== #97 =====
    {
        id: 'geo-similar-solids-scale',
        title: '(Hard) Scale Factor for Area and Volume',
        skill: 'Area and volume',
        source: SRC.OUT,
        tips: [
            'If similar solids have lengths in the ratio \\(a : b\\), their areas (including surface areas) are in the ratio \\(a^2 : b^2\\) and their volumes in the ratio \\(a^3 : b^3\\).',
            'Go through the length ratio: areas in the ratio 4 : 9 means lengths 2 : 3, so volumes are 8 : 27. Traps: scaling a volume by the length ratio (or by the area ratio), and turning the ratio the wrong way around.',
            'Desmos is a calculator here: for lengths 2 : 3 and a smaller volume of 48, type <code>48(3/2)^3</code>.',
        ],
        questionGenerator() {
            const solids = [['rectangular prisms', 'prism'], ['square pyramids', 'pyramid'], ['triangular prisms', 'prism'], ['statues', 'statue']];
            const fmt = v => `\\(${tnum(v)}\\)`;
            const inst = balancedChoice(target => {
                const [solid, one] = pick(solids);
                let a, b; do { a = randInt(1, 4); b = randInt(2, 5); } while (a >= b || gcd(a, b) !== 1);
                const mode = pick(['areaToVolume', 'areaToVolume', 'volumeToArea', 'lengthToVolume']);
                const up = Math.random() < 0.65;   // given the smaller, find the larger (or the reverse)
                const [g, w] = up ? [a, b] : [b, a];
                let key, pool, stem;
                if (mode === 'volumeToArea') {   // volumes a³ : b³, surface area given → other surface area
                    const S = g * g * randInt(2, 9), key0 = S * w * w / (g * g);
                    if (S < 8) return null;
                    key = key0;
                    pool = [S * w / g, S * w ** 3 / g ** 3, S * g * g / (w * w), S * g / w, S * g ** 3 / w ** 3];   // linear; the volume ratio used; each of those inverted
                    stem = `Two similar ${solid} have volumes in the ratio ${a ** 3} to ${b ** 3}. The ${up ? 'smaller' : 'larger'} ${one} has a surface area of ${S} square inches. What is the surface area, in square inches, of the ${up ? 'larger' : 'smaller'} ${one}?`;
                } else {
                    const V = g ** 3 * randInt(1, 4), keyV = V * w ** 3 / g ** 3;
                    key = keyV;
                    pool = [V * w / g, V * w * w / (g * g), V * g ** 3 / w ** 3, V * (w * w / (g * g)) ** 3];   // linear; squared (the area ratio); inverted; the area ratio cubed
                    stem = mode === 'areaToVolume'
                        ? `Two similar ${solid} have surface areas in the ratio ${a * a} to ${b * b}. The volume of the ${up ? 'smaller' : 'larger'} ${one} is ${texNum(V)} cubic inches. What is the volume, in cubic inches, of the ${up ? 'larger' : 'smaller'} ${one}?`
                        : `Two similar ${solid} have corresponding edge lengths in the ratio ${a} to ${b}. The volume of the ${up ? 'smaller' : 'larger'} ${one} is ${texNum(V)} cubic inches. What is the volume, in cubic inches, of the ${up ? 'larger' : 'smaller'} ${one}?`;
                }
                pool = [...new Set(pool.filter(v => v > 0 && v < 20000 && Number.isInteger(roundTo(10 * v, 6)) && Math.abs(v - key) > 1e-9).map(v => roundTo(v, 6)))];
                if (!Number.isInteger(key)) return null;
                const built = choicesFromPool(key, pool, fmt, target);
                return built && { ...built, stem, a, b, mode, key };
            });
            const { stem, a, b, mode, key } = inst;
            return {
                questionText: `<p>${stem}</p>`.replace(/(\d{4,})/g, m => commas(+m)),
                choices: inst.choices,
                answer: inst.answer,
                desmosSolutions: [
                    { type: 'text', id: 'note1', text: `${mode === 'areaToVolume' ? `Areas ${a * a} : ${b * b} means lengths ${a} : ${b}` : mode === 'volumeToArea' ? `Volumes ${a ** 3} : ${b ** 3} means lengths ${a} : ${b}` : `Lengths ${a} : ${b}`}, so areas are ${a * a} : ${b * b} and volumes are ${a ** 3} : ${b ** 3}.` },
                    { type: 'text', id: 'note2', text: `Scale the given ${mode === 'volumeToArea' ? 'surface area by the area ratio' : 'volume by the volume ratio'} (the right way around). Answer: ${inst.answer}) ${num(key)}` },
                ],
            };
        },
    },

    // ===== #98 =====
    {
        id: 'geo-changed-dimensions',
        title: '(Hard) Volume After Changing Dimensions',
        skill: 'Area and volume',
        source: SRC.OUT,
        tips: [
            'Write the volume formula and replace each dimension by its new value: \\(V = \\pi r^2 h\\) with \\(r \\to 3r\\) and \\(h \\to \\frac{h}{2}\\) gives \\(\\pi (3r)^2 \\frac{h}{2} = \\frac{9}{2}\\pi r^2 h\\), so the volume is multiplied by 4.5.',
            'A dimension that is squared in the formula (a radius) multiplies the volume by the square of its factor. Traps: forgetting to square the radius factor, adding the factors instead of multiplying, and squaring the wrong factor.',
            'A quick check in Desmos: pick numbers (say \\(r = 1, h = 1\\)), compute both volumes, and divide.',
        ],
        questionGenerator() {
            const word = f => ({ 2: 'doubled', 3: 'tripled', 4: 'quadrupled', 0.5: 'halved', [1 / 3]: 'divided by 3' }[f]);
            function toFrac(v) { for (let d = 1; d <= 216; d++) if (Math.abs(v * d - Math.round(v * d)) < 1e-6) return reduceFraction(Math.round(v * d), d); throw new Error('geo-changed-dimensions: no fraction for ' + v); }
            const shown = v => { const [n, d] = toFrac(v); return d === 1 ? `${n}` : `\\dfrac{${n}}{${d}}`; };
            const plain = v => { const [n, d] = toFrac(v); return d === 1 ? `${n}` : `${n}/${d}`; };
            const inst = balancedChoice(target => {
                const solid = pick(['cylinder', 'cone', 'prism', 'prism']);
                const factors = [2, 3, 4, 0.5, 1 / 3];
                let key, pool, stem;
                if (solid === 'prism') {
                    const [x, y, z] = [pick(factors), pick(factors), pick(factors)];
                    if (new Set([x, y, z]).size < 2 || !([x, y, z].includes(0.5) || [x, y, z].includes(1 / 3))) return null;   // include a halving or a division
                    key = x * y * z;
                    pool = [x + y + z, x * y, y * z, x * x * y * z, x * y * z * z];   // factors added; one factor left out; one factor squared
                    stem = `The length of a right rectangular prism is ${word(x)}, its width is ${word(y)}, and its height is ${word(z)}. The volume of the new prism is how many times the volume of the original prism?`;
                } else {
                    const r = pick([2, 3, 0.5, 4]), h = pick([2, 3, 4, 0.5, 1 / 3]);
                    if (r === h || !(r < 1 || h < 1)) return null;   // one factor shrinks
                    key = r * r * h;
                    pool = [r * h, r + h, r * h * h, 2 * r * h];   // radius factor not squared; factors added; height squared instead; radius factor doubled instead of squared
                    stem = `The radius of a right circular ${solid} is ${word(r)} and its height is ${word(h)}. The volume of the new ${solid} is how many times the volume of the original ${solid}?`;
                }
                pool = [...new Set(pool.map(v => roundTo(v, 9)))].filter(v => Math.abs(v - key) > 1e-9 && v > 0);
                const built = choicesFromPool(roundTo(key, 9), pool, v => `\\(${shown(v)}\\)`, target);
                return built && { ...built, stem, key, solid };
            });
            const { stem, key, solid } = inst;
            return {
                questionText: `<p>${stem}</p>`,
                choices: inst.choices,
                answer: inst.answer,
                desmosSolutions: [
                    { type: 'text', id: 'note1', text: solid === 'prism' ? 'V = lwh: the new volume is the product of the three factors times the original volume.' : `V = ${solid === 'cone' ? '(1/3)' : ''}πr²h: the radius factor is squared, then multiplied by the height factor (the ${solid === 'cone' ? '1/3 and ' : ''}π stay the same).` },
                    { type: 'text', id: 'note2', text: `The volume is multiplied by ${plain(key)}. Answer: ${inst.answer}` },
                ],
            };
        },
    },

    // ===== #100 =====
    {
        id: 'geo-altitude-on-hypotenuse',
        title: '(Hard) Altitude to the Hypotenuse',
        skill: 'Lines, angles, and triangles',
        source: SRC.OUT,
        tips: [
            'The altitude from the right angle splits a right triangle into two smaller triangles that are similar to it and to each other. That gives three useful relationships: \\(CD^2 = AD \\cdot DB\\), \\(AC^2 = AD \\cdot AB\\), and \\(BC^2 = DB \\cdot AB\\).',
            'Match corresponding sides carefully: \\(AC\\) is the leg next to segment \\(AD\\), and \\(AB = AD + DB\\) is the whole hypotenuse. With two legs given, find \\(AB\\) first; then \\(CD = \\frac{AC \\cdot BC}{AB}\\) (two ways of writing the area).',
            'Desmos is a calculator here, e.g. <code>sqrt(4*9)</code>.',
        ],
        questionGenerator() {
            const [p, q, r] = pick([[3, 4, 5], [5, 12, 13], [8, 15, 17], [1, 2, null], [2, 3, null], [1, 3, null]]);
            const ask = r ? pick(['CD', 'leg', 'DBfromCD', 'CDfromLegs', 'ADfromLeg']) : pick(['CD', 'DBfromCD']);
            let s = randInt(1, r ? (r >= 13 ? 1 : 3) : 4);
            // AD = s p², DB = s q², CD = s p q, AB = s(p² + q²); with a Pythagorean triple: AC = s p r, BC = s q r
            const AD = s * p * p, DB = s * q * q, CD = s * p * q, AB = AD + DB, AC = r ? s * p * r : null, BC = r ? s * q * r : null;
            let given, answer, note, eq;
            if (ask === 'CD') { given = `\\(AD = ${AD}\\) and \\(DB = ${DB}\\), what is the length of \\(CD\\)`; answer = CD; note = `CD² = AD · DB = ${AD} · ${DB} = ${CD * CD}, so CD = ${CD}.`; eq = `\\sqrt{${AD}\\cdot${DB}}`; }
            else if (ask === 'DBfromCD') { given = `\\(CD = ${CD}\\) and \\(AD = ${AD}\\), what is the length of \\(DB\\)`; answer = DB; note = `CD² = AD · DB, so DB = ${CD * CD}/${AD} = ${DB}.`; eq = `\\frac{${CD}^{2}}{${AD}}`; }
            else if (ask === 'leg') { given = `\\(AD = ${AD}\\) and \\(AB = ${AB}\\), what is the length of \\(AC\\)`; answer = AC; note = `AC² = AD · AB = ${AD} · ${AB} = ${AC * AC}, so AC = ${AC}.`; eq = `\\sqrt{${AD}\\cdot${AB}}`; }
            else if (ask === 'ADfromLeg') { given = `\\(AC = ${AC}\\) and \\(AB = ${AB}\\), what is the length of \\(AD\\)`; answer = AD; note = `AC² = AD · AB, so AD = ${AC * AC}/${AB} = ${AD}.`; eq = `\\frac{${AC}^{2}}{${AB}}`; }
            else { given = `\\(AC = ${AC}\\) and \\(BC = ${BC}\\), what is the length of \\(CD\\)`; answer = CD; note = `AB = √(${AC}² + ${BC}²) = ${AB}. The area is (1/2)(AC)(BC) = (1/2)(AB)(CD), so CD = ${AC} · ${BC}/${AB} = ${CD}.`; eq = `\\frac{${AC}\\cdot${BC}}{\\sqrt{${AC}^{2}+${BC}^{2}}}`; }
            return {
                questionText: `<p>In right triangle \\(ABC\\), angle \\(C\\) is a right angle. Point \\(D\\) lies on hypotenuse \\(\\overline{AB}\\), and \\(\\overline{CD}\\) is perpendicular to \\(\\overline{AB}\\). If ${given}?</p>`,
                answer,
                desmosSolutions: [
                    { id: 'calc', latex: eq },
                    { type: 'text', id: 'note1', text: 'CD splits triangle ABC into triangles ACD and CBD, and all three triangles are similar.' },
                    { type: 'text', id: 'note2', text: `${note} Answer: ${answer}` },
                ],
            };
        },
    },

    // ===== #96 =====
    {
        id: 'geo-triangle-area-coordinates',
        title: '(Hard) Area of a Triangle from Its Vertices',
        skill: 'Area and volume',
        source: SRC.OUT,
        tips: [
            'If one side is horizontal or vertical, use it as the base: its length is a difference of coordinates, and the height is the perpendicular distance from the third vertex to that line. Area \\(= \\frac{1}{2}bh\\).',
            'If no side is horizontal or vertical, draw the smallest rectangle around the triangle (box method): subtract the three right triangles in the corners from the rectangle&#39;s area. Traps: forgetting the \\(\\frac{1}{2}\\), using a slanted side as the height, and stopping at the rectangle&#39;s area.',
            'Desmos: type <code>polygon((-3,2),(5,2),(1,9))</code> to see the triangle, then read the lengths from the coordinates.',
        ],
        questionGenerator() {
            const fmt = v => `\\(${num(v)}\\)`;
            const clean = v => v > 0 && Number.isInteger(roundTo(2 * v, 6));
            const inst = balancedChoice(target => {
                const box = Math.random() < 0.55;
                let P, pool, W, H, area;
                if (box) {
                    // One vertex at a corner of the bounding rectangle, one on each far side (not at a corner),
                    // so the rectangle minus the triangle is exactly three right triangles.
                    W = randInt(4, 12); H = randInt(4, 12);
                    const x0 = randInt(-6, 6) - Math.floor(W / 2), y0 = randInt(-6, 6) - Math.floor(H / 2);
                    const p = randInt(1, H - 1), q = randInt(1, W - 1);   // B = (W, p), C = (q, H) relative to the corner (0, 0)
                    const t1 = W * p / 2, t2 = q * H / 2, t3 = (W - q) * (H - p) / 2;   // the three corner triangles
                    area = W * H - t1 - t2 - t3;
                    let rel = [[0, 0], [W, p], [q, H]];
                    const sx = pick([1, -1]), sy = pick([1, -1]);   // reflect so the corner vertex can be any corner
                    P = shuffle(rel.map(([x, y]) => [x0 + (sx > 0 ? x : W - x), y0 + (sy > 0 ? y : H - y)]));
                    // errors: no ½; the rectangle; ½ × rectangle; result halved again; one corner triangle subtracted twice; the ½ left off one corner triangle
                    const big = Math.max(t1, t2, t3), small = Math.min(t1, t2, t3);
                    pool = [2 * area, W * H, W * H / 2, area / 2, area - big, area - small, area + small];
                } else {
                    const y0 = randInt(-6, 6), x1 = randInt(-8, 0), x2 = randInt(1, 8), ax = randInt(-8, 8), ay = y0 + randNonZero(-9, 9);
                    const base = x2 - x1, ht = Math.abs(ay - y0);
                    area = base * ht / 2;
                    const slant = Math.hypot(ax - x1, ay - y0);
                    // errors: no ½; slanted side as the height; base from x₂ + x₁ (sign slip); the apex's y-coordinate as the height
                    pool = [2 * area, base * slant / 2, Math.abs(x2 + x1) * ht / 2, base * Math.abs(ay) / 2, base * ht];
                    P = shuffle([[x1, y0], [x2, y0], [ax, ay]]);
                    if (Math.random() < 0.4) P = P.map(([x, y]) => [y, x]);   // a vertical base instead
                    const xs = P.map(pt => pt[0]), ys = P.map(pt => pt[1]);
                    W = Math.max(...xs) - Math.min(...xs); H = Math.max(...ys) - Math.min(...ys);
                }
                if (area < 3 || area > 60) return null;
                const [A, B, C] = P;
                const sides = [[A, B], [B, C], [C, A]];
                const axis = sides.some(([u, v]) => u[0] === v[0] || u[1] === v[1]);
                if (box === axis) return null;   // box questions have no horizontal or vertical side
                const shoelace = Math.abs((B[0] - A[0]) * (C[1] - A[1]) - (C[0] - A[0]) * (B[1] - A[1])) / 2;
                if (shoelace !== area) throw new Error('geo-triangle-area-coordinates: area self-check failed');
                pool = [...new Set(pool.filter(clean).map(v => roundTo(v, 6)))].filter(v => Math.abs(v - area) > 1e-9);
                const built = choicesFromPool(area, pool, fmt, target);
                return built && { ...built, P, area, box, W, H };
            });
            const { P, area, box, W, H } = inst;
            const [L1, L2, L3] = pick([['P', 'Q', 'R'], ['A', 'B', 'C'], ['J', 'K', 'L']]);
            const pt = (n, [x, y]) => `\\(${n}(${x}, ${y})\\)`;
            return {
                questionText: `<p>In the <i>xy</i>-plane, triangle \\(${L1}${L2}${L3}\\) has vertices ${pt(L1, P[0])}, ${pt(L2, P[1])}, and ${pt(L3, P[2])}. What is the area of triangle \\(${L1}${L2}${L3}\\)?</p>`,
                choices: inst.choices,
                answer: inst.answer,
                desmosSolutions: [
                    { id: 'tri', latex: `\\operatorname{polygon}\\left(${P.map(([x, y]) => `\\left(${x},${y}\\right)`).join(',')}\\right)` },
                    { type: 'text', id: 'note1', text: box ? `No side is horizontal or vertical. The surrounding rectangle is ${W} by ${H} (area ${W * H}); the three corner triangles have a total area of ${num(W * H - area)}, so the triangle's area is ${W * H} − ${num(W * H - area)} = ${num(area)}.` : `One side is ${P.some(([x], i) => P.some(([x2], j) => i !== j && x2 === x)) ? 'vertical' : 'horizontal'}; use it as the base and the distance from the third vertex to that line as the height: area = (1/2)(base)(height) = ${num(area)}.` },
                    { type: 'text', id: 'note2', text: `Answer: ${inst.answer}) ${num(area)}` },
                ],
            };
        },
    },

    // ===== #60 =====
    {
        id: 'geo-volume-cone-sphere',
        title: '(Hard) Cone and Sphere Volume',
        skill: 'Area and volume',
        source: SRC.OUT,
        tips: [
            'Cone: \\(V = \\frac{1}{3}\\pi r^2 h\\). Sphere: \\(V = \\frac{4}{3}\\pi r^3\\). Cylinder: \\(V = \\pi r^2 h\\). (These are on the SAT reference sheet.) Substitute what you know and solve for the unknown.',
            'Watch what is given: a diameter must be halved to get the radius, and a question may ask for a diameter after you find the radius. Traps: forgetting the \\(\\frac{1}{3}\\), mixing up radius and diameter, and not taking the cube root for a sphere.',
            'Desmos: type the volume equation with \\(x\\) for the unknown, e.g. <code>(1/3)pi*6^2x=96pi</code>, and read the vertical line.',
        ],
        questionGenerator() {
            const fmt = v => `\\(${tnum(v)}\\)`;
            const inst = balancedChoice(target => {
                const mode = pick(['coneFromDiameter', 'sphereDiameter', 'equalVolumes', 'equalSphereCyl']);
                let key, pool, stem, note, eq;
                if (mode === 'coneFromDiameter') {   // V and diameter given → height
                    const r = randInt(2, 9), h = randInt(2, 15), V = r * r * h;   // V = (1/3)π r² h  → shown as (r² h / 3)π
                    if (V % 3 !== 0) return null;
                    key = h;
                    pool = [h / 3, h / 4, h / 12, 3 * h];   // ⅓ forgotten; diameter as radius; both; …
                    stem = `A right circular cone has a volume of \\(${V / 3}\\pi\\) cubic centimeters, and the diameter of its base is ${2 * r} centimeters. What is the height, in centimeters, of the cone?`;
                    note = `The radius is ${2 * r}/2 = ${r}. (1/3)π(${r})²h = ${V / 3}π gives h = ${h}.`; eq = `\\frac{1}{3}\\pi\\cdot${r}^{2}x=${V / 3}\\pi`;
                } else if (mode === 'sphereDiameter') {   // V → radius → diameter
                    const r = randInt(1, 9);
                    const V3 = 4 * r ** 3;               // V = (4/3)π r³ = (V3/3)π
                    if (V3 % 3 !== 0) return null;
                    key = 2 * r;
                    pool = [r, r ** 3, 2 * r ** 3, 4 * r];   // the radius; the cube root not taken; …; doubled twice
                    stem = `A sphere has a volume of \\(${V3 / 3}\\pi\\) cubic inches. What is the diameter, in inches, of the sphere?`;
                    note = `(4/3)πr³ = ${V3 / 3}π gives r³ = ${r ** 3}, so r = ${r} and the diameter is ${2 * r}.`; eq = `\\frac{4}{3}\\pi x^{3}=${V3 / 3}\\pi`;
                } else if (mode === 'equalVolumes') {   // a cone and a cylinder with equal volumes and equal radii
                    const r = randInt(2, 8), hc = randInt(2, 12), hcone = 3 * hc;
                    key = hcone;
                    pool = [hc, hc / 3, 2 * hc, 9 * hc];   // same height; divided instead of multiplied; …
                    stem = `A right circular cylinder and a right circular cone have the same base radius, ${r} centimeters, and the same volume. The height of the cylinder is ${hc} centimeters. What is the height, in centimeters, of the cone?`;
                    note = `π(${r})²(${hc}) = (1/3)π(${r})²h, so h = 3 × ${hc} = ${hcone}.`; eq = `\\pi\\cdot${r}^{2}\\cdot${hc}=\\frac{1}{3}\\pi\\cdot${r}^{2}x`;
                } else {                               // a sphere and a cylinder with equal volumes
                    const R = randInt(1, 6) * 3, rc = pick([R / 3, 2 * R / 3, R]);
                    const hcyl = 4 * R ** 3 / (3 * rc * rc);
                    if (!Number.isInteger(hcyl)) return null;
                    key = hcyl;
                    pool = [R ** 3 / (rc * rc), 4 * R / 3, 4 * R ** 3 / (3 * rc), hcyl / 2];   // the 4/3 dropped; …; radius not squared; …
                    stem = `A sphere has a radius of ${R} inches. A right circular cylinder with a base radius of ${rc} inches has the same volume as the sphere. What is the height, in inches, of the cylinder?`;
                    note = `(4/3)π(${R})³ = π(${rc})²h gives h = ${4 * R ** 3 / 3}/${rc * rc} = ${hcyl}.`; eq = `\\frac{4}{3}\\pi\\cdot${R}^{3}=\\pi\\cdot${rc}^{2}x`;
                }
                pool = [...new Set(pool.filter(v => v > 0 && Number.isInteger(roundTo(2 * v, 6))).map(v => roundTo(v, 6)))].filter(v => v !== key);
                const built = choicesFromPool(key, pool, fmt, target);
                return built && { ...built, stem, note, eq, key };
            });
            const { stem, note, eq } = inst;
            return {
                questionText: `<p>${stem}</p>`,
                choices: inst.choices,
                answer: inst.answer,
                desmosSolutions: [
                    { id: 'eq', latex: eq },
                    { type: 'text', id: 'note1', text: `${note} Desmos draws the solution as a vertical line.` },
                    { type: 'text', id: 'note2', text: `Answer: ${inst.answer}) ${num(inst.key)}` },
                ],
            };
        },
    },

    // ===== #99 =====
    {
        id: 'geo-similarity-criteria',
        title: '(Hard) What Proves Two Triangles Congruent or Similar?',
        skill: 'Lines, angles, and triangles',
        source: SRC.OUT,
        tips: [
            '<b>Congruence</b> needs SSS, SAS (the angle between the two sides), ASA, or AAS. Two pairs of congruent angles give the third pair automatically, so with two angle pairs, any one pair of corresponding sides is enough.',
            '<b>Similarity</b> needs AA, SAS similarity (two pairs of sides in the same ratio <i>and</i> the angle between them), or SSS similarity (all three ratios equal). Traps: SSA (the angle is not between the sides) proves nothing, and AAA proves similarity but never congruence.',
            'Match the correspondence carefully: in triangles \\(ABC\\) and \\(DEF\\), \\(A\\) goes with \\(D\\), \\(B\\) with \\(E\\), and side \\(AB\\) with side \\(DE\\). The angle included between sides \\(AB\\) and \\(BC\\) is angle \\(B\\).',
        ],
        questionGenerator() {
            const plainGeo = t => t.replace(/\\dfrac\{(\w+)\}\{(\w+)\}/g, '$1/$2').replace(/\\angle /g, '∠').replace(/ \\cong /g, ' ≅ ').replace(/\\\(|\\\)/g, '');
            const names = pick([['ABC', 'DEF'], ['PQR', 'STU'], ['JKL', 'MNO'], ['RST', 'XYZ']]);
            const [P, Q] = names;
            // side i is opposite vertex i; side 2 = P0P1, side 0 = P1P2, side 1 = P0P2; the angle between sides i and j is the vertex opposite neither
            const sideName = (T, i) => [T[1] + T[2], T[0] + T[2], T[0] + T[1]][i];
            const included = (i, j) => 3 - i - j;
            const facts = [];
            for (let i = 0; i < 3; i++) facts.push({ kind: 'S', i, tex: `\\(${sideName(P, i)} = ${sideName(Q, i)}\\)` });
            for (let i = 0; i < 3; i++) facts.push({ kind: 'A', i, tex: `\\(\\angle ${P[i]} \\cong \\angle ${Q[i]}\\)` });
            for (const [i, j] of [[2, 0], [2, 1], [0, 1]]) facts.push({ kind: 'R', i, j, tex: `\\(\\dfrac{${sideName(P, i)}}{${sideName(Q, i)}} = \\dfrac{${sideName(P, j)}}{${sideName(Q, j)}}\\)` });
            // what a set of facts proves
            function analyze(set) {
                const angles = new Set(set.filter(f => f.kind === 'A').map(f => f.i));
                if (angles.size >= 2) { angles.add(0); angles.add(1); angles.add(2); }
                // sides in one ratio class (each pair of corresponding sides with the common ratio k); equal sides have ratio 1
                const eq = new Set(set.filter(f => f.kind === 'S').map(f => f.i));
                const ratioPairs = set.filter(f => f.kind === 'R').map(f => [f.i, f.j]);
                const cls = new Set();   // sides whose ratios are known to be equal to each other
                if (ratioPairs.length) { ratioPairs.forEach(([i, j]) => { cls.add(i); cls.add(j); }); if (ratioPairs.length >= 2) { cls.add(0); cls.add(1); cls.add(2); } }
                if ([...cls].some(i => eq.has(i))) cls.forEach(i => eq.add(i));   // ratio 1 → the whole class is equal
                const propSides = new Set([...cls]);
                const similar = angles.size === 3 || cls.size === 3 || eq.size === 3
                    || [[0, 1], [0, 2], [1, 2]].some(([i, j]) => ((propSides.has(i) && propSides.has(j)) || (eq.has(i) && eq.has(j))) && angles.has(included(i, j)));
                const congruent = eq.size === 3
                    || [[0, 1], [0, 2], [1, 2]].some(([i, j]) => eq.has(i) && eq.has(j) && angles.has(included(i, j)))
                    || (angles.size === 3 && eq.size >= 1)
                    || (similar && eq.size >= 1);
                return { similar, congruent };
            }
            for (let attempt = 0; attempt < 400; attempt++) {
                const goal = Math.random() < 0.5 ? 'congruent' : 'similar';
                const nGiven = goal === 'congruent' ? 2 : pick([1, 2]);
                const given = shuffle(facts.filter(f => goal === 'similar' ? f.kind !== 'S' : f.kind !== 'R')).slice(0, nGiven);
                if (analyze(given)[goal]) continue;
                const pool = facts.filter(f => !given.includes(f) && (goal === 'similar' ? f.kind !== 'S' || Math.random() < 0.3 : true));
                const good = pool.filter(f => analyze([...given, f])[goal] && (goal === 'similar' || f.kind !== 'R'));   // congruence keys are sides or angles
                const bad = pool.filter(f => !analyze([...given, f])[goal]);
                if (!good.length || bad.length < 3) continue;
                const key = pick(good);
                // prefer the classic traps: SSA (a side/angle that is not included) and AAA for congruence
                const ranked = shuffle(bad).sort((u, v) => (v.kind === 'A' ? 1 : 0) - (u.kind === 'A' ? 1 : 0));
                const wrong = [ranked[0], ...shuffle(ranked.slice(1))].slice(0, 3);
                const chosen = [key, ...wrong];
                if (chosen.filter(f => analyze([...given, f])[goal]).length !== 1) throw new Error('geo-similarity-criteria: choice check failed');
                const { choices, answer } = makeChoices(key.tex, wrong.map(f => f.tex));
                const givenTex = given.map(f => f.tex).join(' and ');
                const fullName = s => s === 'similar' ? 'similar to' : 'congruent to';
                return {
                    questionText: `<p>In triangles \\(${P}\\) and \\(${Q}\\), vertices \\(${P[0]}\\), \\(${P[1]}\\), and \\(${P[2]}\\) correspond to vertices \\(${Q[0]}\\), \\(${Q[1]}\\), and \\(${Q[2]}\\), respectively. It is given that ${givenTex}. Which additional piece of information is sufficient to prove that triangle \\(${P}\\) is ${fullName(goal)} triangle \\(${Q}\\)?</p>`,
                    choices, answer,
                    desmosSolutions: [
                        { type: 'text', id: 'note1', text: plainGeo(`Given ${givenTex}. With ${key.tex}, the triangles are ${goal}: ${explain(given, key, goal)}.`) },
                        { type: 'text', id: 'note2', text: `The other choices give SSA, AAA, or a ratio that does not include the given angle, which are not enough. Answer: ${answer}` },
                    ],
                };
                function explain(g, k, gl) {
                    const all = [...g, k];
                    const nA = new Set(all.filter(f => f.kind === 'A').map(f => f.i)).size, nS = all.filter(f => f.kind === 'S').length, nR = all.filter(f => f.kind === 'R').length;
                    if (gl === 'similar') return nA >= 2 ? 'AA similarity' : nR >= 2 ? 'SSS similarity' : 'SAS similarity (the angle is between the two sides in the same ratio)';
                    if (nS + nR >= 2 && nA <= 1) return nA === 1 ? 'SAS (the angle is between the two sides)' : 'SSS';
                    return nA >= 2 ? (nS >= 1 ? 'two angle pairs and a side pair (ASA or AAS)' : 'similar with a pair of equal sides') : 'SAS';
                }
            }
            const { choices, answer } = makeChoices('\\(\\angle A \\cong \\angle D\\)', ['\\(AC = DF\\)', '\\(\\dfrac{AB}{DE} = \\dfrac{AC}{DF}\\)', '\\(\\dfrac{AC}{DF} = \\dfrac{BC}{EF}\\)']);
            return {
                questionText: '<p>In triangles \\(ABC\\) and \\(DEF\\), vertices \\(A\\), \\(B\\), and \\(C\\) correspond to vertices \\(D\\), \\(E\\), and \\(F\\), respectively. It is given that \\(AB = DE\\) and \\(\\angle B \\cong \\angle E\\). Which additional piece of information is sufficient to prove that triangle \\(ABC\\) is congruent to triangle \\(DEF\\)?</p>',
                choices, answer,
                desmosSolutions: [{ type: 'text', id: 'note1', text: `Angle A with side AB and angle B gives ASA. Answer: ${answer}` }],
            };
        },
    },

]);

})();
