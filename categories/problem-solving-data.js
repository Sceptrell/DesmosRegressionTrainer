// Problem-Solving & Data Analysis question types. Each category follows the contract in categories/README.md.
(() => {

// ===== Shared helpers for this file =====

// A number for display without float noise, with commas: num(1234.5) → "1,234.5".
function num(x) { return commas(roundTo(x, 6)); }

// The same inside TeX math: tnum(1234.5) → "1{,}234.5".
function tnum(x) { return texNum(roundTo(x, 6)); }

registerCategories('Problem-Solving & Data Analysis', [

    // ===== #11 =====
    {
        id: 'pct-percent-of-percent',
        title: '(Easy) Percent of a Percent',
        skill: 'Percentages',
        source: SRC.CBS,
        tips: [
            'A percent <i>of</i> a percent multiplies. If 40% of the items are red and 30% of the red items have stripes, the striped red items are 30% of 40% of the whole group: \\(0.30 \\times 0.40 = 0.12\\), or 12%.',
            'Traps: subtracting the percents (40 − 30 = 10%), adding them (40 + 30 = 70%), finding what percent 30 is of 40 (75%), and stopping at the decimal 0.12 without turning it back into a percent.',
            'Desmos: type <code>30% of 40</code> (Shift+5 makes %). The result is the percent of the whole group.',
        ],
        questionGenerator() {
            const stems = [
                (p, q) => `In a collection of marbles, ${p}% of the marbles are red. Of the red marbles, ${q}% have stripes. What percentage of the marbles in the collection are red and have stripes?`,
                (p, q) => `Of the members of a school club, ${p}% are seniors. Of the seniors in the club, ${q}% are on the student council. What percentage of the club's members are seniors who are on the student council?`,
                (p, q) => `In a parking lot, ${p}% of the cars are electric. Of the electric cars, ${q}% are white. What percentage of the cars in the parking lot are white electric cars?`,
                (p, q) => `In a survey, ${p}% of the respondents said they own a pet. Of the respondents who own a pet, ${q}% said they adopted the pet from a shelter. What percentage of all the respondents said they own a pet that was adopted from a shelter?`,
                (p, q) => `In a greenhouse, ${p}% of the plants are flowering plants. Of the flowering plants, ${q}% have red flowers. What percentage of the plants in the greenhouse are flowering plants with red flowers?`,
            ];
            const pct = v => `${num(v)}%`;
            let inst = balancedChoice(target => {
                const p = 5 * randInt(2, 18), q = 5 * randInt(1, 18);
                if (p + q > 100 || p === q || (p * q) % 100 !== 0) return null;
                const key = p * q / 100;
                // Errors: p − q and p + q (CB Q14); what percent the smaller is of the larger (CB: 30 is 75% of 40);
                // the decimal 0.3 × 0.4 = 0.12 reported as 0.12%; the other part of the first group (red, not striped)
                const pool = [Math.abs(p - q), p + q, roundTo(p * q / 10000, 4), p - key];
                const ratio = 100 * Math.min(p, q) / Math.max(p, q);
                if (Number.isInteger(ratio)) pool.push(ratio);
                const built = choicesFromPool(key, pool, pct, target);
                return built && { ...built, p, q, key };
            });
            if (!inst) inst = { ...makeChoicesSorted(12, [10, 70, 75], pct), p: 40, q: 30, key: 12 };
            const { p, q, key } = inst;
            return {
                questionText: `<p>${pick(stems)(p, q)}</p>`,
                choices: inst.choices,
                answer: inst.answer,
                desmosSolutions: [
                    { id: 'calc', latex: `${q}\\%\\operatorname{of}${p}` },
                    { type: 'text', id: 'note1', text: `${q}% of the ${p}% means 0.${String(q).padStart(2, '0')} × ${p} = ${num(key)}. Multiply; don't add, subtract or divide the two percents.` },
                    { type: 'text', id: 'note2', text: `So ${num(key)}% of the whole group is in both categories. Answer: ${num(key)}%` },
                ],
            };
        },
    },

    // ===== #12 =====
    {
        id: 'rat-density',
        title: '(Medium) Density, Mass and Volume',
        skill: 'Ratios, rates, proportional relationships, and units',
        source: SRC.CBS,
        tips: [
            'Density is mass per unit of volume: \\(\\text{density} = \\frac{\\text{mass}}{\\text{volume}}\\). So mass = density × volume, and volume = mass ÷ density. Units check: \\(\\text{kg} \\div \\frac{\\text{kg}}{\\text{m}^3} = \\text{m}^3\\).',
            'For a cube, volume = (edge)³, so the edge is the <b>cube root</b> of the volume. Traps: stopping at the volume, taking a square root, dividing by 3, and dividing the density by the mass. For a box, volume = length × width × height, not their sum and not the surface area.',
            'Desmos: type <code>cbrt(345/353)</code> for a cube root, then round as the question says. For a box, type the product, e.g. <code>2.7*2*3*5</code>.',
        ],
        questionGenerator() {
            const r1 = x => roundTo(x, 1), r2 = x => roundTo(x, 2);
            const block = () => { const l = randInt(2, 12), w = randInt(2, 12), h = randInt(2, 12); return { l, w, h, V: l * w * h, SA: 2 * (l * w + l * h + w * h) }; };
            // CB Q15: density and the mass of a cube → edge length
            function cube(target) {
                const [mat, lo, hi] = pick([['pine wood', 400, 550], ['oak wood', 600, 900], ['a certain type of wood', 300, 900], ['ice', 917, 917], ['concrete', 2300, 2500], ['granite', 2600, 2800]]);
                const D = randInt(lo, hi), s = randInt(40, 200) / 100, m = Math.round(D * s ** 3);
                if (m < 20) return null;
                const V = m / D;
                // Errors: the volume itself (no cube root, CB), D/m and its cube root (CB), a square root, dividing by 3
                const pool = [r2(V), r2(D / m), r2(Math.cbrt(D / m)), r2(Math.sqrt(V)), r2(V / 3)].filter(v => v > 0);
                const built = choicesFromPool(r2(Math.cbrt(V)), pool, v => `\\(${v.toFixed(2)}\\)`, target);
                return built && { ...built, kind: 'cube', mat, D, m, V };
            }
            // density and a box's dimensions → mass
            function massFromBlock(target) {
                const [mat, D] = pick([['aluminum', 2.7], ['iron', 7.9], ['copper', 8.9], ['lead', 11.3], ['glass', 2.5], ['silver', 10.5], ['oak', 0.7], ['granite', 2.7]]);
                const b = block();
                const [d1, d2] = shuffle([b.l, b.w, b.h]);
                // Errors: added the dimensions; used only two dimensions (a face's area); forgot the density; used the surface area
                const pool = [r1(D * (b.l + b.w + b.h)), r1(D * d1 * d2), b.V, r1(D * b.SA)];
                const built = choicesFromPool(r1(D * b.V), pool, v => `\\(${tnum(v)}\\)`, target);
                return built && { ...built, kind: 'mass', mat, D, ...b };
            }
            // mass and a box's dimensions → density
            function densityFromBlock(target) {
                const D = randInt(5, 120) / 10, b = block(), m = r1(D * b.V);
                const [d1, d2] = shuffle([b.l, b.w, b.h]);
                // Errors (each rounded to the tenth): divided by the sum of the dimensions, by one face's area, or by the
                // surface area; divided volume by mass
                const pool = [r1(m / (b.l + b.w + b.h)), r1(m / (d1 * d2)), r1(m / b.SA), r1(b.V / m)].filter(v => v > 0);
                const built = choicesFromPool(D, pool, v => `\\(${texNum(v, 1)}\\)`, target);
                return built && { ...built, kind: 'density', D, m, ...b };
            }
            let inst = balancedChoice(t => pick([cube, cube, massFromBlock, densityFromBlock])(t));
            if (!inst) inst = { ...makeChoicesSorted(0.99, [0.98, 1.01, 1.02], v => `\\(${v.toFixed(2)}\\)`), kind: 'cube', mat: 'a certain type of wood', D: 353, m: 345, V: 345 / 353 };

            let questionText, desmos;
            if (inst.kind === 'cube') {
                const { mat, D, m, V } = inst;
                questionText = `<p>A solid cube is made of ${mat}, which has a density of ${num(D)} kilograms per cubic meter. The mass of the cube is ${num(m)} kilograms. To the nearest hundredth of a meter, what is the length of one edge of the cube?</p>`;
                desmos = [
                    { id: 'V', latex: `V=\\frac{${m}}{${D}}` },
                    { id: 's', latex: 's=\\sqrt[3]{V}' },
                    { type: 'text', id: 'note1', text: `Volume = mass ÷ density = ${m}/${D} ≈ ${roundTo(V, 4)} cubic meters.` },
                    { type: 'text', id: 'note2', text: `A cube's volume is s³, so the edge is the cube root of the volume: s ≈ ${roundTo(Math.cbrt(V), 4)}. To the nearest hundredth, ${r2(Math.cbrt(V)).toFixed(2)} meter.` },
                ];
            } else if (inst.kind === 'mass') {
                const { mat, D, l, w, h, V } = inst;
                questionText = `<p>A rectangular block of ${mat} is ${l} centimeters long, ${w} centimeters wide, and ${h} centimeters high. The density of ${mat} is ${D} grams per cubic centimeter. What is the mass, in grams, of the block?</p>`;
                desmos = [
                    { id: 'V', latex: `V=${l}\\cdot${w}\\cdot${h}` },
                    { id: 'mass', latex: `${D}V` },
                    { type: 'text', id: 'note1', text: `Volume = length × width × height = ${l} × ${w} × ${h} = ${V} cubic centimeters.` },
                    { type: 'text', id: 'note2', text: `Mass = density × volume = ${D} × ${V} = ${num(r1(D * V))} grams.` },
                ];
            } else {
                const { D, m, l, w, h, V } = inst;
                questionText = `<p>A rectangular block of a certain material is ${l} centimeters long, ${w} centimeters wide, and ${h} centimeters high, and it has a mass of ${num(m)} grams. To the nearest tenth of a gram per cubic centimeter, what is the density of the material?</p>`;
                desmos = [
                    { id: 'V', latex: `V=${l}\\cdot${w}\\cdot${h}` },
                    { id: 'density', latex: `\\frac{${m}}{V}` },
                    { type: 'text', id: 'note1', text: `Volume = ${l} × ${w} × ${h} = ${V} cubic centimeters.` },
                    { type: 'text', id: 'note2', text: `Density = mass ÷ volume = ${num(m)}/${V} = ${D.toFixed(1)} grams per cubic centimeter.` },
                ];
            }
            desmos.push({ type: 'text', id: 'note3', text: `Answer: ${inst.answer}) ${noteText(inst.choices[CHOICE_LETTERS.indexOf(inst.answer)])}` });
            return { questionText, choices: inst.choices, answer: inst.answer, desmosSolutions: desmos };
        },
    },

    // ===== #13 =====
    {
        id: 'tvd-best-fit-prediction',
        title: '(Easy) Predict with a Line of Best Fit',
        skill: 'Two-variable data: Models and scatterplots',
        source: SRC.CBS,
        tips: [
            'The line of best fit gives the <b>predicted</b> value: substitute the x-value into its equation. For \\(y = 2.4x + 13\\) at \\(x = 15\\), the prediction is \\(2.4(15) + 13 = 49\\).',
            'A data point&#39;s actual y-value minus the predicted y-value tells how far the point is above the line (or below it, if negative). Traps: forgetting to add the y-intercept, dropping its minus sign, and plugging in the wrong x-value.',
            'Desmos: type <code>f(x)=2.4x+13</code>, then <code>f(15)</code>. For a data point (15, 52), <code>52-f(15)</code> gives how far it is above the line.',
        ],
        questionGenerator() {
            const contexts = [
                { x: 'the number of hours a student studied for a test', y: "the student's score on the test", things: 'students', n: [12, 15, 20],
                  m: () => randInt(30, 60) / 10, b: () => randInt(40, 60), x0: () => randInt(2, 8), r: 9,
                  ask: x => `the predicted test score for a student who studied ${x} hours`, actual: (x, y) => `One student studied ${x} hours and scored ${y} on the test.`, unit: 'points' },
                { x: 'the high temperature, in degrees Fahrenheit, on a given day', y: 'the number of iced drinks a café sold that day', things: 'days', n: [14, 15, 20],
                  m: () => randInt(20, 40) / 10, b: () => -randInt(60, 150), x0: () => randInt(70, 95), r: 15,
                  ask: x => `the predicted number of iced drinks sold on a day with a high temperature of ${x} degrees Fahrenheit`, actual: (x, y) => `On one day, the high temperature was ${x} degrees Fahrenheit and the café sold ${y} iced drinks.`, unit: 'drinks' },
                { x: 'the age, in years, of a used car', y: 'the price, in thousands of dollars, of the car', things: 'used cars', n: [18, 20, 25],
                  m: () => -randInt(10, 25) / 10, b: () => randInt(22, 35), x0: () => randInt(2, 10), r: 4,
                  ask: x => `the predicted price, in thousands of dollars, of a car that is ${x} years old`, actual: (x, y) => `One car is ${x} years old and its price is ${y} thousand dollars.`, unit: 'thousand dollars' },
                { x: 'the elevation, in kilometers, of a weather station', y: 'the average July temperature, in degrees Celsius, at the station', things: 'weather stations', n: [10, 12, 14],
                  m: () => -randInt(50, 70) / 10, b: () => randInt(18, 28), x0: () => randInt(1, 4), r: 3, negOk: true,
                  ask: x => `the predicted average July temperature, in degrees Celsius, at a station with an elevation of ${x} kilometer${x === 1 ? '' : 's'}`, actual: (x, y) => `One station has an elevation of ${x} kilometer${x === 1 ? '' : 's'} and an average July temperature of ${y} degrees Celsius.`, unit: 'degrees' },
                { x: 'the height, in inches, of a person', y: 'the arm span, in inches, of the person', things: 'people', n: [10, 12, 16],
                  m: () => randInt(8, 12) / 10, b: () => randNonZero(-6, 8), x0: () => randInt(60, 76), r: 3,
                  ask: x => `the predicted arm span, in inches, of a person who is ${x} inches tall`, actual: (x, y) => `One person is ${x} inches tall and has an arm span of ${y} inches.`, unit: 'inches' },
            ];
            const fmt = v => `\\(${tnum(v)}\\)`;
            let inst = balancedChoice(target => {
                const ctx = pick(contexts);
                const m = ctx.m(), b = ctx.b(), x = ctx.x0();
                const f = t => roundTo(m * t + b, 4);
                if (Math.random() < 0.7) {
                    // Errors: predictions at x − 1 and x + 1 (CB Q13); forgot the intercept; dropped the intercept's sign
                    // (a negative choice is dropped unless y can really be negative, e.g. a temperature)
                    const pool = [f(x - 1), f(x + 1), roundTo(m * x, 4), roundTo(m * x - b, 4)].filter(v => v > 0 || ctx.negOk);
                    if (f(x) <= 0 && !ctx.negOk) return null;
                    const built = choicesFromPool(f(x), pool, fmt, target);
                    return built && { ...built, mode: 'predict', ctx, m, b, x };
                }
                // the actual y-value is a whole number (a real score, count or measurement); r = actual − predicted
                const y = Math.round(f(x)) + randNonZero(-ctx.r, ctx.r), r = roundTo(y - f(x), 4);
                if (y <= 0 || r === 0) return null;
                // Errors: gave the predicted value (CB); compared with the prediction at x − 1 or x + 1; forgot the intercept
                const pool = [f(x), Math.abs(roundTo(r + m, 4)), Math.abs(roundTo(r - m, 4)), Math.abs(roundTo(y - m * x, 4))].filter(v => v > 0);
                const built = choicesFromPool(Math.abs(r), pool, fmt, target);
                return built && { ...built, mode: 'residual', ctx, m, b, x, y, r };
            });
            if (!inst) { const ctx = contexts[0]; inst = { ...makeChoicesSorted(64, [59.5, 68.5, 49], fmt), mode: 'predict', ctx, m: 4.5, b: 37, x: 6 }; }

            const { ctx, m, b, x } = inst;
            const n = pick(ctx.n);
            const line = `y = ${polyTex([m, b])}`;
            const intro = `<p>A scatterplot shows the relationship between \\(x\\), ${ctx.x}, and \\(y\\), ${ctx.y}, for ${n} ${ctx.things}. The equation of the line of best fit for the data is \\(${line}\\).</p>`;
            const pred = roundTo(m * x + b, 4);
            let ask, notes;
            if (inst.mode === 'predict') {
                ask = pick([
                    `<p>What is the \\(y\\)-value predicted by the line of best fit at \\(x = ${x}\\)?</p>`,
                    `<p>Based on the line of best fit, what is ${ctx.ask(x)}?</p>`,
                ]);
                notes = [
                    { type: 'text', id: 'note1', text: `Substitute x = ${x} into the line: ${m}(${x})${b < 0 ? ' - ' + -b : ' + ' + b} = ${num(pred)}.` },
                    { type: 'text', id: 'note2', text: `Answer: ${num(pred)}` },
                ];
            } else {
                const { y, r } = inst;
                ask = `<p>${ctx.actual(x, num(y))} For this data point, how much ${r > 0 ? 'greater' : 'less'} is the actual value of \\(y\\) than the value of \\(y\\) predicted by the line of best fit?</p>`;
                notes = [
                    { id: 'point', latex: `(${x},${y})` },
                    { id: 'resid', latex: `${y}-f(${x})` },
                    { type: 'text', id: 'note1', text: `Predicted: f(${x}) = ${num(pred)}. Actual: ${num(y)}. Actual − predicted = ${num(roundTo(y - pred, 4))}, so the point is ${num(Math.abs(r))} ${r > 0 ? 'above' : 'below'} the line.` },
                    { type: 'text', id: 'note2', text: `Answer: ${num(Math.abs(r))}` },
                ];
            }
            return {
                questionText: intro + ask,
                choices: inst.choices,
                answer: inst.answer,
                desmosSolutions: [
                    { id: 'line', latex: `f(x)=${polyTex([m, b]).replace(/ /g, '')}` },
                    { id: 'pred', latex: `f(${x})` },
                    ...notes,
                ],
            };
        },
    },

    // ===== #14 =====
    {
        id: 'stat-mean-frequency-table',
        title: '(Easy) Mean from a Frequency Table',
        skill: 'One-variable data: Distributions and measures of center and spread',
        source: 'https://acely.com/desmos-guide-library/one-variable-data-distributions-and-measures-of-center-and-spread-mean-from-frequency-table',
        tips: [
            'Each row of a frequency table stands for several data values. Multiply each value by its frequency, add the products to get the total, then divide by the total frequency (the number of data values), not by the number of rows.',
            'Traps: averaging the values in the first column without weighting them, and dividing by the number of rows. Check that the frequencies add up to the number of households (or students, or games) in the question.',
            'Desmos: make a table with the values in \\(x_1\\) and the frequencies in \\(y_1\\), then type <code>total(x_1y_1)/total(y_1)</code>.',
        ],
        questionGenerator() {
            // Each context has a realistic distribution: weights for each value, starting at `lo` (a peak near the
            // typical value, small tails, 0 included where it is natural).
            const contexts = [
                { lo: 0, w: [25, 35, 22, 10, 5, 3], head: 'Number of pets', what: n => `number of pets owned by each of ${n} households`, ask: 'number of pets per household' },
                { lo: 0, w: [6, 10, 16, 20, 18, 12, 8, 5, 5], head: 'Number of books', what: n => `number of books each of ${n} students read over the summer`, ask: 'number of books read per student' },
                { lo: 0, w: [18, 35, 27, 12, 6, 2], head: 'Number of siblings', what: n => `number of siblings of each of ${n} students in a class`, ask: 'number of siblings per student' },
                { lo: 0, w: [20, 28, 25, 15, 8, 3, 1], head: 'Goals scored', what: n => `number of goals a soccer team scored in each of its ${n} games this season`, ask: 'number of goals scored per game' },
                { lo: 5, w: [6, 15, 30, 30, 14, 5], head: 'Hours of sleep', what: n => `number of hours each of ${n} students slept last night, rounded to the nearest hour`, ask: 'number of hours of sleep per student' },
                { lo: 0, w: [40, 25, 15, 10, 5, 3, 2], head: 'Days absent', what: n => `number of days each of ${n} employees was absent last month`, ask: 'number of days absent per employee' },
            ];
            const ctx = pick(contexts);
            const draw = () => {   // one data value from the context's distribution
                let r = Math.random() * ctx.w.reduce((a, c) => a + c, 0);
                for (let i = 0; i < ctx.w.length; i++) { r -= ctx.w[i]; if (r < 0) return ctx.lo + i; }
                return ctx.lo + ctx.w.length - 1;
            };
            let values, freqs, total, sum;
            for (let attempt = 0; attempt < 1000; attempt++) {
                // totals that usually give a mean with at most 2 decimal places
                total = pick([20, 20, 25, 25, 40, 50, 16, 32]);
                const counts = {};
                for (let i = 0; i < total; i++) { const v = draw(); counts[v] = (counts[v] || 0) + 1; }
                const present = Object.keys(counts).map(Number).sort((p, q) => p - q);
                values = [];
                for (let v = present[0]; v <= present[present.length - 1]; v++) values.push(v);
                freqs = values.map(v => counts[v] || 0);
                sum = values.reduce((a, v, i) => a + v * freqs[i], 0);
                // 4–6 rows, no empty rows, and a mean that terminates within 2 decimal places
                if (values.length >= 4 && values.length <= 6 && freqs.every(f => f > 0) && (sum * 100) % total === 0) break;
                values = null;
            }
            if (!values) {   // deterministic fallback from the context's own shape: 5 rows, 20 data values (a mean in hundredths)
                const w = ctx.w.slice(0, 5), wsum = w.reduce((x, y) => x + y, 0);
                freqs = w.map(x => Math.max(1, Math.round(20 * x / wsum)));
                freqs[freqs.indexOf(Math.max(...freqs))] += 20 - freqs.reduce((x, y) => x + y, 0);
                values = w.map((_, i) => ctx.lo + i); total = 20;
                sum = values.reduce((acc, v, i) => acc + v * freqs[i], 0);
            }
            const mean = roundTo(sum / total, 4);
            const table = `<table><tr><th>${ctx.head}</th><th>Frequency</th></tr>${values.map((v, i) => `<tr><td>${v}</td><td>${freqs[i]}</td></tr>`).join('')}</table>`;
            return {
                questionText: `<p>The frequency table summarizes the ${ctx.what(total)}.</p>${table}<p>What is the mean ${ctx.ask}?</p>`,
                answer: mean,
                desmosSolutions: [
                    { type: 'table', columns: [{ latex: 'x_1', values: values.map(String) }, { latex: 'y_1', values: freqs.map(String) }] },
                    { id: 'mean', latex: '\\frac{\\operatorname{total}\\left(x_{1}y_{1}\\right)}{\\operatorname{total}\\left(y_{1}\\right)}' },
                    { type: 'text', id: 'note1', text: `Total of value × frequency: ${values.map((v, i) => `${v}(${freqs[i]})`).join(' + ')} = ${sum}.` },
                    { type: 'text', id: 'note2', text: `Total frequency: ${freqs.join(' + ')} = ${total}. Mean = ${sum}/${total} = ${mean}.` },
                    { type: 'text', id: 'note3', text: `Answer: ${mean}` },
                ],
            };
        },
    },

    // ===== #15 =====
    {
        id: 'pct-successive-changes',
        title: '(Hard) Overall Effect of Successive Percent Changes',
        skill: 'Percentages',
        source: SRC.OUT,
        tips: [
            'Successive percent changes multiply. An increase of 20% multiplies by 1.20 and a decrease of 25% multiplies by 0.75, so together they multiply by \\(1.20 \\times 0.75 = 0.90\\): the final value is 90% of the original, a 10% decrease.',
            'Trap: you can&#39;t add the percents (+20% and −25% is not −5%), because the second percent is taken of the new amount, not the original. Two discounts of 10% and 20% are not a 30% discount.',
            'Desmos: multiply the factors, e.g. <code>1.2*0.75</code>, or <code>15*0.9*0.8</code> for a price.',
        ],
        questionGenerator() {
            const pctOf = v => `${num(v)}%`;
            const change = v => (v === 0 ? 'No change' : `${aAn(Math.abs(v), true)} ${num(Math.abs(v))}% ${v < 0 ? 'decrease' : 'increase'}`);
            // product of (100 + c) / 100 for each change c, as an exact percent of the original
            const percentOf = cs => cs.reduce((acc, c) => acc * (100 + c), 100) / 100 ** cs.length;
            const verb = c => (c > 0 ? 'increased' : 'decreased');

            const scenarios = {
                jacket: cs => ({ setup: `The price of a jacket was ${verb(cs[0])} by ${Math.abs(cs[0])}%. Later, the new price was ${verb(cs[1])} by ${Math.abs(cs[1])}%.`, whatPct: 'The final price of the jacket is what percent of its original price?', whatChange: 'Which of the following describes the overall change in the price of the jacket?' }),
                town: cs => ({ setup: `The population of a town ${verb(cs[0])} by ${Math.abs(cs[0])}% from 2010 to 2015 and then ${verb(cs[1])} by ${Math.abs(cs[1])}% from 2015 to 2020.`, whatPct: "The town's population in 2020 was what percent of its population in 2010?", whatChange: "Which of the following describes the overall change in the town's population from 2010 to 2020?" }),
                club: cs => ({ setup: `The number of members of a hiking club ${verb(cs[0])} by ${Math.abs(cs[0])}% in its second year and then ${verb(cs[1])} by ${Math.abs(cs[1])}% in its third year.`, whatPct: "The number of members in the club's third year is what percent of the number in its first year?", whatChange: "Which of the following describes the overall change in the number of members from the club's first year to its third year?" }),
            };

            function twoChanges(mode, target) {
                const p = pick([10, 15, 20, 25, 30, 40, 50]), q = pick([10, 15, 20, 25, 30, 40, 50]);
                const cs = pick([[p, -q], [-p, q], [p, q], [-p, -q], [p, -q]]);
                const K = percentOf(cs);
                if (!Number.isInteger(roundTo(K * 10, 6))) return null;   // at most one decimal place
                const S = pick(Object.keys(scenarios)), text = scenarios[S](cs);
                const added = 100 + cs[0] + cs[1], rates = Math.abs(cs[0] * cs[1]) / 100;
                if (mode === 'pctOf') {
                    // Errors: the changes added; only one change applied; the overall change given instead; the rates multiplied
                    const pool = [added, 100 + cs[0], 100 + cs[1], Math.abs(roundTo(K - 100, 6)), rates].filter(v => v > 0);
                    const built = choicesFromPool(K, pool, pctOf, target);
                    return built && { ...built, kind: mode, cs, K, stem: `<p>${text.setup} ${text.whatPct}</p>` };
                }
                // overall change, written as "A 10% decrease" (listed from the biggest decrease to the biggest increase)
                const key = roundTo(K - 100, 6);
                const pool = [cs[0] + cs[1], cs[0], cs[1], -key, (cs[0] * cs[1] > 0 ? 1 : -1) * rates];
                const item = v => ({ value: v, html: change(v) });
                const built = choicesFromPool(item(key), pool.map(item), undefined, target);
                return built && { ...built, kind: mode, cs, K, stem: `<p>${text.setup} ${text.whatChange}</p>` };
            }
            function twoDiscounts(target) {
                const [item, prices] = pick([['pair of socks', [12, 15, 16, 20]], ['backpack', [36, 40, 48, 60]], ['lamp', [45, 50, 64, 80]], ['bicycle', [180, 240, 250, 320]]]);
                const price = pick(prices), d1 = pick([10, 15, 20, 25, 30, 40]), d2 = pick([10, 15, 20, 25, 30, 40]);
                const cents = price * (100 - d1) * (100 - d2);   // final price in cents × 100
                if (cents % 100 !== 0) return null;
                const P = x => roundTo(x, 2);
                const key = P(price * (100 - d1) * (100 - d2) / 10000);
                // Errors: one combined discount of d1 + d2; only the first or only the second discount; the rates multiplied
                const pool = [P(price * (100 - d1 - d2) / 100), P(price * (100 - d1) / 100), P(price * (100 - d2) / 100)];
                if ((price * (10000 - d1 * d2)) % 100 === 0) pool.push(P(price * (10000 - d1 * d2) / 10000));   // only if it is whole cents
                const built = choicesFromPool(key, pool, v => money(v, 2), target);
                return built && { ...built, kind: 'price', cs: [-d1, -d2], price, K: key,
                    stem: `<p>A store sells a ${item} for ${money(price, 2)}. During a sale, the price of the ${item} is reduced by ${d1}%. Later, the store reduces the sale price by ${d2}%. What is the final price of the ${item}?</p>` };
            }
            function threeChanges(target) {
                const cs = [pick([10, 20, 25, 50]), -pick([10, 20, 25, 40]), pick([10, 20, 25])];
                const K = percentOf(cs);
                if (!Number.isInteger(roundTo(K * 10, 6))) return null;
                // Errors: all three added; only the first two applied; the overall change given instead; the first change ignored
                const pool = [100 + cs[0] + cs[1] + cs[2], percentOf(cs.slice(0, 2)), Math.abs(roundTo(K - 100, 6)), percentOf(cs.slice(1))].filter(v => v > 0);
                const built = choicesFromPool(K, pool, pctOf, target);
                const [a, b, c] = cs;
                return built && { ...built, kind: 'three', cs, K,
                    stem: `<p>The value of a share of a certain stock ${verb(a)} by ${Math.abs(a)}% in January, ${verb(b)} by ${Math.abs(b)}% in February, and ${verb(c)} by ${Math.abs(c)}% in March. The value of the share at the end of March was what percent of its value at the start of January?</p>` };
            }
            let inst = balancedChoice(t => {
                const r = Math.random();
                return r < 0.35 ? twoChanges('pctOf', t) : r < 0.6 ? twoChanges('change', t) : r < 0.85 ? twoDiscounts(t) : threeChanges(t);
            });
            if (!inst) inst = { ...makeChoicesSorted(90, [5, 95, 120], pctOf), kind: 'pctOf', cs: [20, -25], K: 90, stem: '<p>The price of a jacket was increased by 20%. Later, the new price was decreased by 25%. The final price of the jacket is what percent of its original price?</p>' };

            const { cs, kind } = inst;
            const factors = cs.map(c => String(roundTo(1 + c / 100, 6)));
            const keyText = noteText(inst.choices[CHOICE_LETTERS.indexOf(inst.answer)]);
            const product = kind === 'price' ? `${inst.price}\\cdot${factors.join('\\cdot')}` : factors.join('\\cdot');
            return {
                questionText: inst.stem,
                choices: inst.choices,
                answer: inst.answer,
                desmosSolutions: [
                    { id: 'calc', latex: product },
                    { type: 'text', id: 'note1', text: `Each change is a multiplier: ${cs.map(c => `${c > 0 ? '+' : '−'}${Math.abs(c)}% → ×${roundTo(1 + c / 100, 6)}`).join(', ')}. Multiply them${kind === 'price' ? ' with the starting price' : ''}.` },
                    { type: 'text', id: 'note2', text: kind === 'price'
                        ? `${inst.price} × ${factors.join(' × ')} = ${roundTo(inst.K, 2).toFixed(2)}, so the final price is $${roundTo(inst.K, 2).toFixed(2)}.`
                        : `${factors.join(' × ')} = ${roundTo(percentOf(cs) / 100, 6)}, so the final value is ${num(percentOf(cs))}% of the original (${change(roundTo(percentOf(cs) - 100, 6)).toLowerCase()}).` },
                    { type: 'text', id: 'note3', text: `Answer: ${inst.answer}) ${keyText}` },
                ],
            };
        },
    },

    // ===== #31 =====
    {
        id: 'rat-unit-rate-conversion',
        title: '(Easy) Unit Rate with a Time Conversion',
        skill: 'Ratios, rates, proportional relationships, and units',
        source: SRC.OUT,
        tips: [
            'Get the rate and the time in the same unit first. There are 60 minutes in an hour, so 2.5 hours is \\(2.5 \\times 60 = 150\\) minutes. Then amount = rate × time: \\(18 \\times 150 = 2{,}700\\).',
            'Going the other way, time = amount ÷ rate. A rate of 1,800 per hour is \\(1{,}800 \\div 60 = 30\\) per minute, so 450 takes \\(450 \\div 30 = 15\\) minutes. Trap: forgetting the conversion, or multiplying by 60 when you should divide.',
            'Desmos: type the whole calculation, e.g. <code>18*60*2.5</code>.',
        ],
        questionGenerator() {
            const contexts = [
                { item: 'bottles', who: 'A machine', verb: 'fills', rate: [12, 40], ask: t => `how many bottles does the machine fill in ${t}`, needs: (q) => `fill ${q} bottles` },
                { item: 'pages', who: 'A printer', verb: 'prints', rate: [20, 60], ask: t => `how many pages does the printer print in ${t}`, needs: q => `print ${q} pages` },
                { item: 'gallons of water', who: 'A pump', verb: 'moves', rate: [8, 40], ask: t => `how many gallons of water does the pump move in ${t}`, needs: q => `move ${q} gallons of water` },
                { item: 'words', who: 'A typist', verb: 'types', rate: [40, 90], ask: t => `how many words does the typist type in ${t}`, needs: q => `type ${q} words` },
                { item: 'beats', who: "A resting person's heart", verb: 'beats', rate: [60, 80], ask: t => `how many times does the heart beat in ${t}`, needs: null },
            ];
            const ctx = pick(contexts);
            const r = randInt(ctx.rate[0], ctx.rate[1]);
            const reverse = ctx.needs && Math.random() < 0.4;
            let questionText, answer, calc, note;
            if (!reverse) {   // per minute → hours
                const hrs = pick([1, 1.5, 2, 2.5, 3, 4, 0.5, 0.75]);
                const minutes = hrs * 60;
                answer = r * minutes;
                const tText = `${num(hrs)} hour${hrs === 1 ? '' : 's'}`;
                const rateText = ctx.item === 'beats' ? `beats ${r} times per minute` : `${ctx.verb} ${r} ${ctx.item} per minute`;
                questionText = `<p>${ctx.who} ${rateText}. At this rate, ${ctx.ask(tText)}?</p>`;
                calc = `${r}\\cdot60\\cdot${hrs}`;
                note = `${num(hrs)} hours = ${num(hrs)} × 60 = ${minutes} minutes, and ${r} × ${minutes} = ${num(answer)}.`;
            } else {          // per hour → minutes needed
                const perMin = r, perHour = perMin * 60, mins = pick([10, 15, 20, 25, 30, 40, 45, 50, 75, 90]), q = perMin * mins;
                answer = mins;
                questionText = `<p>${ctx.who} ${ctx.verb} ${num(perHour)} ${ctx.item} per hour. At this rate, how many minutes will it take to ${ctx.needs(num(q))}?</p>`;
                calc = `\\frac{${q}}{${perHour}/60}`;
                note = `${num(perHour)} per hour is ${num(perHour)} ÷ 60 = ${perMin} per minute, so ${num(q)} ÷ ${perMin} = ${mins} minutes.`;
            }
            return {
                questionText,
                answer,
                desmosSolutions: [
                    { id: 'calc', latex: calc },
                    { type: 'text', id: 'note1', text: note },
                    { type: 'text', id: 'note2', text: `Answer: ${answer}` },
                ],
            };
        },
    },

    // ===== #32 =====
    {
        id: 'rat-proportion',
        title: '(Easy) Set Up and Solve a Proportion',
        skill: 'Ratios, rates, proportional relationships, and units',
        source: SRC.OUT,
        tips: [
            'Write two equal ratios with the same quantity on top in both: \\(\\frac{3 \\text{ cups}}{8 \\text{ muffins}} = \\frac{x \\text{ cups}}{20 \\text{ muffins}}\\). Cross-multiply: \\(8x = 60\\), so \\(x = 7.5\\).',
            'Traps: flipping one ratio (muffins over cups), adding the difference instead of scaling (3 + 12), and multiplying without dividing (3 × 20 = 60).',
            'Desmos: type the proportion, e.g. <code>3/8=x/20</code>. Desmos draws a vertical line at the answer.',
        ],
        questionGenerator() {
            const fmt = v => `\\(${num(v)}\\)`;
            const inst = balancedChoice(target => {
                const ctx = pick(['recipe', 'map', 'dose', 'fuel', 'model']);
                let a, b, n, stem, unitA;
                // realistic recipes: 1.5–3 cups of flour per 12 muffins, batches in multiples of 6
                if (ctx === 'recipe') { b = pick([12, 24]); a = (b / 12) * pick([1.5, 2, 2.5, 3]); n = 6 * randInt(2, 12); if (n === b) return null;
                    stem = `A recipe uses ${a} cups of flour for every ${b} muffins. At this rate, how many cups of flour are needed to make ${n} muffins?`; unitA = 'cups'; }
                // map distances of at most 15 inches (halves allowed)
                else if (ctx === 'map') { a = randInt(1, 4); b = pick([10, 15, 20, 25, 30, 50]); n = randInt(4, 30) / 2; if (n === a) return null;
                    // here the known quantity is inches (a) and we scale miles: answer = n·b/a
                    const key = n * b / a; if (!Number.isInteger(2 * key)) return null;
                    stem = `On a map, ${a} inch${a === 1 ? '' : 'es'} represent${a === 1 ? 's' : ''} ${b} miles. How many miles do ${num(n)} inches on the map represent?`;
                    return finish(key, b, a, n, `\\frac{${a}}{${b}}=\\frac{${n}}{x}`, stem, 'miles'); }
                else if (ctx === 'dose') { a = pick([2, 3, 4, 5, 6]); b = pick([5, 10, 15, 20]); n = b * randInt(2, 8);
                    stem = `A doctor prescribes ${a} milligrams of a medication for every ${b} kilograms of a patient's body weight. How many milligrams of the medication should be prescribed for a patient who weighs ${n} kilograms?`; unitA = 'milligrams'; }
                else if (ctx === 'fuel') { a = randInt(2, 6); b = a * randInt(24, 36); n = b * randInt(2, 5) / pick([1, 2]); if (!Number.isInteger(n)) return null;
                    stem = `A car uses ${a} gallons of gasoline to travel ${b} miles. At this rate, how many gallons of gasoline will the car use to travel ${n} miles?`; unitA = 'gallons'; }
                else { a = 1; b = pick([4, 6, 8, 12, 16]); n = randInt(3, 15) * pick([1, 0.5]);
                    stem = `In a scale model of a building, 1 inch represents ${b} feet. The actual building is ${num(n * b)} feet tall. How tall, in inches, is the model?`;
                    return finish(n, 1, b, n * b, `\\frac{1}{${b}}=\\frac{x}{${n * b}}`, stem, 'inches'); }
                return finish(a * n / b, a, b, n, `\\frac{${a}}{${b}}=\\frac{x}{${n}}`, stem, unitA);

                // key = a·n/b in general form "a per b, how much for n"; distractors use the same numbers
                function finish(key, A, B, N, eq, stemText, unit) {
                    if (!Number.isInteger(2 * key) || key <= 0) return null;
                    const pool = [
                        B * N / A,          // inverted ratio
                        A + (N - B),        // additive reasoning
                        A * N,              // multiplied without dividing
                        N / B,              // the scale factor alone (didn't multiply by the rate)
                        A * B / N,          // cross-multiplied the wrong pair
                    ].filter(v => v > 0 && Number.isInteger(10 * roundTo(v, 6)) && Math.abs(v - key) > 1e-9);
                    if (pool.length < 3) return null;
                    const built = choicesFromPool(key, pool, fmt, target);
                    return built && { ...built, key, eq, stem: stemText, unit, A, B, N };
                }
            });
            return {
                questionText: `<p>${inst.stem}</p>`,
                choices: inst.choices,
                answer: inst.answer,
                desmosSolutions: [
                    { id: 'prop', latex: inst.eq },
                    { type: 'text', id: 'note1', text: `Keep the same quantity on top of both ratios and solve. Desmos draws the solution as a vertical line at x = ${num(inst.key)}.` },
                    { type: 'text', id: 'note2', text: `Answer: ${num(inst.key)} ${inst.unit}` },
                ],
            };
        },
    },

    // ===== #33 =====
    {
        id: 'prob-two-way-simple',
        title: '(Easy) Probability from a Two-Way Table',
        skill: 'Probability and conditional probability',
        source: SRC.OUT,
        tips: [
            'Probability = (number of outcomes that fit) ÷ (number of possible outcomes). When one person is chosen from the whole group, the denominator is the grand total in the bottom-right corner of the table.',
            'Traps: dividing by a row or column total instead of the grand total, giving the probability that the event does <i>not</i> happen, and dividing the count by the rest of the group (that is a ratio, not a probability).',
            'Desmos isn&#39;t needed: read the count and the total from the table and write the fraction.',
        ],
        questionGenerator() {
            const contexts = [
                { who: 'students', rows: ['Grade 10', 'Grade 11', 'Grade 12'], cols: ['Online', 'In person'], intro: 'The table shows the number of students in each grade at a school who prefer online classes or in-person classes.',
                  ev: (r, c) => (r === null ? `prefers ${c === 'Online' ? 'online' : 'in-person'} classes` : c === null ? `is in ${r.toLowerCase().replace('grade', 'grade')}` : `is in ${r.toLowerCase()} and prefers ${c === 'Online' ? 'online' : 'in-person'} classes`), one: 'student' },
                { who: 'respondents', rows: ['Ages 18–34', 'Ages 35–54', 'Ages 55 and older'], cols: ['Yes', 'No'], intro: 'A survey asked adults whether they had visited a public library in the past month. The table shows the responses by age group.',
                  ev: (r, c) => (r === null ? `answered "${c.toLowerCase()}"` : c === null ? `is in the ${r.replace('Ages ', 'age group ')}` : `is in the ${r.replace('Ages ', 'age group ')} and answered "${c.toLowerCase()}"`), one: 'respondent' },
                { who: 'cars', rows: ['Red', 'Blue', 'White'], cols: ['Sedan', 'SUV'], intro: 'The table shows the colors and types of the cars on a dealer&#39;s lot.',
                  ev: (r, c) => (r === null ? `is ${c === 'SUV' ? 'an SUV' : 'a sedan'}` : c === null ? `is ${r.toLowerCase()}` : `is a ${r.toLowerCase()} ${c === 'SUV' ? 'SUV' : 'sedan'}`), one: 'car' },
                { who: 'plants', rows: ['Soil A', 'Soil B', 'Soil C'], cols: ['Under 10 cm', '10 cm or taller'], intro: 'A biologist grew plants in three types of soil. The table shows the number of plants in each soil type that were under 10 centimeters tall or 10 centimeters or taller after six weeks.',
                  ev: (r, c) => (r === null ? `was ${c === 'Under 10 cm' ? 'under 10 centimeters' : '10 centimeters or taller'}` : c === null ? `was grown in ${r.toLowerCase().replace('soil', 'soil')}` : `was grown in ${r.toLowerCase()} and was ${c === 'Under 10 cm' ? 'under 10 centimeters' : '10 centimeters or taller'}`), one: 'plant' },
            ];
            const inst = balancedChoice(target => {
                const ctx = pick(contexts);
                const counts = ctx.rows.map(() => ctx.cols.map(() => randInt(4, 30)));
                const rowT = counts.map(r => r[0] + r[1]), colT = [0, 1].map(j => counts.reduce((a, r) => a + r[j], 0));
                const total = rowT.reduce((a, b) => a + b, 0);
                const ask = pick(['joint', 'joint', 'col', 'row']);
                const ri = randInt(0, 2), ci = randInt(0, 1);
                let k, cond;
                if (ask === 'joint') { k = counts[ri][ci]; cond = [rowT[ri], colT[ci]]; }
                else if (ask === 'col') { k = colT[ci]; cond = [rowT[ri]]; }
                else { k = rowT[ri]; cond = [colT[ci]]; }
                // unreduced count/total fractions throughout, as College Board often writes them
                const F = (n, d) => ({ value: n / d, html: `\\(\\dfrac{${n}}{${d}}\\)` });   // \dfrac: readable at choice size
                const pool = [...cond.filter(d => d !== total && d >= k).map(d => F(k, d)),   // divided by a row or column total
                    F(total - k, total),                                                          // the complement
                    ...(k < total - k ? [F(k, total - k)] : []),                                  // part over the other part (only when below 1)
                    ...(ask === 'joint'
                        ? [F(counts[ri][1 - ci], total), ...[0, 1, 2].filter(i => i !== ri).map(i => F(counts[i][ci], total))]   // read the wrong cell
                        : ask === 'row'
                            ? [F(counts[ri][ci], total), ...[0, 1, 2].filter(i => i !== ri).map(i => F(rowT[i], total))]         // one cell only; the wrong row
                            : [F(counts[ri][ci], total), F(counts[(ri + 1) % 3][ci], total)])];                                   // one cell only
                if (k === total - k) return null;                                                 // the "part over the rest" must differ from the key
                const built = choicesFromPool(F(k, total), pool, undefined, target);
                const event = ask === 'joint' ? ctx.ev(ctx.rows[ri], ctx.cols[ci]) : ask === 'col' ? ctx.ev(null, ctx.cols[ci]) : ctx.ev(ctx.rows[ri], null);
                return built && { ...built, ctx, counts, rowT, colT, total, k, event };
            });
            const { ctx, counts, rowT, colT, total, k, event } = inst;
            const table = `<table><tr><th></th>${ctx.cols.map(c => `<th>${c}</th>`).join('')}<th>Total</th></tr>`
                + ctx.rows.map((r, i) => `<tr><th>${r}</th>${counts[i].map(v => `<td>${v}</td>`).join('')}<td>${rowT[i]}</td></tr>`).join('')
                + `<tr><th>Total</th>${colT.map(v => `<td>${v}</td>`).join('')}<td>${total}</td></tr></table>`;
            return {
                questionText: `<p>${ctx.intro}</p>${table}<p>If one of these ${ctx.who} is selected at random, what is the probability that the ${ctx.one} ${event}?</p>`,
                choices: inst.choices,
                answer: inst.answer,
                desmosSolutions: [
                    { type: 'text', id: 'note1', text: `The ${ctx.one} is chosen from all ${total} ${ctx.who}, so the denominator is the grand total, ${total}.` },
                    { type: 'text', id: 'note2', text: `The number that fit is ${k}, so the probability is ${k}/${total}. Answer: ${inst.answer}) ${k}/${total}` },
                ],
            };
        },
    },

    // ===== #34 =====
    {
        id: 'inf-estimate-population',
        title: '(Easy) Estimate a Population Count from a Random Sample',
        skill: 'Inference from sample statistics and margin of error',
        source: SRC.OUT,
        tips: [
            'A random sample represents the whole population, so the population has about the same proportion as the sample. Estimate = (sample proportion) × (population size): \\(\\frac{36}{200} \\times 5{,}000 = 900\\).',
            'Use the population size, not the sample size, at the end, and make sure the proportion is (number with the trait) ÷ (sample size). If the sample result is a percent, multiply the population by that percent written as a decimal.',
            'Desmos: type <code>36/200*5000</code>.',
        ],
        questionGenerator() {
            const contexts = [
                { pop: 'students at a university', pop2: 'students',  N: [4000, 6000, 8000, 10000, 12000, 15000, 20000], q: 'said they bike to campus', p: [8, 30], ask: 'bike to campus' },
                { pop: 'residents of a town', pop2: 'residents',  N: [5000, 8000, 12000, 16000, 20000, 24000, 30000], q: 'said they support building a new park', p: [35, 75], ask: 'support building a new park' },
                { pop: 'light bulbs made at a factory one week', pop2: 'light bulbs',  N: [20000, 25000, 40000, 50000, 60000], q: 'were defective', p: [1, 6], ask: 'were defective' },
                { pop: 'households in a city', pop2: 'households',  N: [10000, 20000, 30000, 40000, 50000], q: 'have at least one dog', p: [25, 45], ask: 'have at least one dog' },
                { pop: 'students at a high school', pop2: 'students',  N: [800, 1000, 1200, 1500, 2000, 2400], q: 'play a school sport', p: [25, 60], ask: 'play a school sport' },
            ];
            const ctx = pick(contexts);
            let n, k, N, pct, answer;
            for (let attempt = 0; attempt < 200; attempt++) {
                N = pick(ctx.N);
                n = pick([50, 80, 100, 120, 150, 200, 250, 300, 400, 500]);
                if (n >= N / 4) continue;
                k = Math.round(n * randInt(ctx.p[0], ctx.p[1]) / 100);
                if (k < 1) continue;
                answer = k * N / n;
                if (Number.isInteger(answer)) break;
                answer = null;
            }
            if (answer === null) { N = 5000; n = 200; k = 36; answer = 900; }
            const usePct = Math.random() < 0.35 && Number.isInteger(100 * k / n);
            pct = 100 * k / n;
            const sampleText = usePct ? `${num(pct)}% of them ${ctx.q}` : `${k} of them ${ctx.q}`;
            return {
                questionText: `<p>A random sample of ${num(n)} of the ${num(N)} ${ctx.pop} was selected. In the sample, ${sampleText}. Based on the sample, about how many of the ${num(N)} ${ctx.pop2} ${ctx.ask}?</p>`,
                answer,
                desmosSolutions: [
                    { id: 'calc', latex: usePct ? `${pct}\\%\\operatorname{of}${N}` : `\\frac{${k}}{${n}}\\cdot${N}` },
                    { type: 'text', id: 'note1', text: `The sample proportion is ${usePct ? `${num(pct)}%` : `${k}/${n}`}. Because the sample is random, about the same proportion of all ${num(N)} have the trait.` },
                    { type: 'text', id: 'note2', text: `${usePct ? `${num(pct)}% of ${num(N)}` : `${k}/${n} × ${num(N)}`} = ${num(answer)}. Answer: ${answer}` },
                ],
            };
        },
    },

    // ===== #35 =====
    {
        id: 'stat-missing-value-mean',
        title: '(Easy) Missing Value from a Known Mean',
        skill: 'One-variable data: Distributions and measures of center and spread',
        source: SRC.OUT,
        tips: [
            'Mean × (number of values) = total. If 6 numbers have a mean of 15, they add up to \\(6 \\times 15 = 90\\). Subtract the values you know from that total to get the missing one.',
            'When a value is added to a data set, the total goes from \\(n \\times m\\) to \\((n + 1) \\times m&#39;\\); the new value is the difference. Trap: averaging the two means, or subtracting the means instead of the totals.',
            'Desmos: type the mean equation with \\(x\\) for the missing value, e.g. <code>(12+18+9+21+14+x)/6=15</code>. Desmos draws a vertical line at the answer.',
        ],
        questionGenerator() {
            const mode = pick(['list', 'tests', 'added']);
            let questionText, answer, eq, note;
            for (let attempt = 0; attempt < 300; attempt++) {
                if (mode === 'list') {
                    const kind = pick(['numbers', 'points', 'hours']);
                    const [lo, hi] = { numbers: [5, 30], points: [8, 30], hours: [6, 20] }[kind];
                    const n = kind === 'numbers' ? randInt(5, 7) : 6, m = randInt(lo + 3, hi - 3);
                    const known = Array.from({ length: n - 1 }, () => randInt(lo, hi));
                    const sum = known.reduce((a, c) => a + c, 0), x = n * m - sum;
                    if (x < lo || x > hi) continue;   // the missing value fits the rest of the data
                    answer = x;
                    eq = `\\frac{${known.join('+')}+x}{${n}}=${m}`;
                    note = `The ${n} values add up to ${n} × ${m} = ${n * m}. The known values add up to ${sum}, so the missing value is ${n * m} − ${sum} = ${x}.`;
                    const listed = `${known.slice(0, -1).join(', ')}, and ${known[known.length - 1]}`;
                    questionText = {
                        numbers: `<p>The mean of ${n} numbers is ${m}. ${['Four', 'Five', 'Six'][n - 5]} of the numbers are ${listed}. What is the ${['fifth', 'sixth', 'seventh'][n - 5]} number?</p>`,
                        points: `<p>A basketball player scored a mean of ${m} points per game over 6 games. In the first 5 games, the player scored ${listed} points. How many points did the player score in the sixth game?</p>`,
                        hours: `<p>Over 6 weeks, a student worked a mean of ${m} hours per week. In the first 5 weeks, the student worked ${listed} hours. How many hours did the student work in the sixth week?</p>`,
                    }[kind];
                } else if (mode === 'tests') {
                    const name = pick(['Ana', 'Ben', 'Carmen', 'Dev', 'Elle', 'Femi']);
                    const n = randInt(4, 5), m = randInt(75, 92);
                    const known = Array.from({ length: n - 1 }, () => randInt(m - 12, Math.min(100, m + 10)));
                    const x = n * m - known.reduce((a, c) => a + c, 0);
                    if (x < 55 || x > 100) continue;   // a realistic test score
                    answer = x;
                    eq = `\\frac{${known.join('+')}+x}{${n}}=${m}`;
                    note = `A mean of ${m} on ${n} tests needs a total of ${n} × ${m} = ${n * m}. The first ${n - 1} scores add up to ${known.reduce((a, c) => a + c, 0)}, so the last test needs ${x}.`;
                    questionText = `<p>${name}'s scores on the first ${n - 1} tests in a class were ${known.slice(0, -1).join(', ')}, and ${known[known.length - 1]}. What score must ${name} earn on the ${{ 4: 'fourth', 5: 'fifth' }[n]} test so that the mean of the ${n} test scores is ${m}?</p>`;
                } else {
                    const [item, unit, lo, hi, one] = pick([['packages', 'pounds', 6, 30, 'package'], ['boxes of apples', 'kilograms', 8, 20, 'box of apples'], ['suitcases', 'pounds', 25, 45, 'suitcase']]);
                    const n = randInt(5, 12), m = randInt(lo, hi), m2 = m + pick([-2, -1, 1, 2, 3]);
                    const x = (n + 1) * m2 - n * m;
                    if (x <= 0 || x < lo / 2 || x > hi * 2) continue;
                    answer = x;
                    eq = `\\frac{${n}\\cdot${m}+x}{${n + 1}}=${m2}`;
                    note = `Before: total = ${n} × ${m} = ${n * m}. After: total = ${n + 1} × ${m2} = ${(n + 1) * m2}. The added value is ${(n + 1) * m2} − ${n * m} = ${x}.`;
                    questionText = `<p>The mean weight of ${n} ${item} is ${m} ${unit}. When one more of these ${item} is added, the mean weight of all ${n + 1} ${item} is ${m2} ${unit}. What is the weight, in ${unit}, of the ${one} that was added?</p>`;
                }
                break;
            }
            if (answer === undefined) { answer = 16; eq = '\\frac{12+18+9+21+14+x}{6}=15'; note = 'The 6 numbers add up to 90; the five known numbers add up to 74, so the sixth is 16.'; questionText = '<p>The mean of 6 numbers is 15. Five of the numbers are 12, 18, 9, 21, and 14. What is the sixth number?</p>'; }
            return {
                questionText,
                answer,
                desmosSolutions: [
                    { id: 'eq', latex: eq },
                    { type: 'text', id: 'note1', text: note },
                    { type: 'text', id: 'note2', text: `Desmos draws the solution as a vertical line at x = ${answer}. Answer: ${answer}` },
                ],
            };
        },
    },

    // ===== #111 =====
    {
        id: 'pct-part-whole-shift',
        title: '(Hard) Percent Composition After Members Join',
        skill: 'Percentages',
        source: SRC.OUT,
        tips: [
            'Let \\(x\\) be the original total. The part is a percent of the total before and after, so write one equation: (part after the change) = (new percent) × (total after the change). For 40% juniors and 6 juniors joining to make 50%: \\(0.4x + 6 = 0.5(x + 6)\\).',
            'Both the part and the total change when members join or leave the group being counted; only the total changes when the others join or leave. Read which total the question asks for: the original, or the current one.',
            'Desmos: type the equation, e.g. <code>0.4x+6=0.5(x+6)</code>; Desmos draws a vertical line at the original total.',
        ],
        questionGenerator() {
            const ctxs = [
                { group: 'club', part: 'juniors', other: 'other members', member: 'members' },
                { group: 'orchestra', part: 'violinists', other: 'musicians who are not violinists', member: 'musicians' },
                { group: 'garden', part: 'rose bushes', other: 'other plants', member: 'plants' },
                { group: 'company', part: 'remote employees', other: 'in-office employees', member: 'employees' },
            ];
            for (let attempt = 0; attempt < 4000; attempt++) {
                const ctx = pick(ctxs);
                const N = randInt(12, 120), p = 5 * randInt(2, 16), q = 5 * randInt(2, 17);
                if (Math.abs(p - q) < 5 || Math.abs(p - q) > 25 || (p * N) % 100 !== 0) continue;   // a realistic swing of at most 25 points
                const P = p * N / 100;
                const kind = pick(['partJoins', 'partLeaves', 'otherJoins']);
                let j, after, num;
                if (kind === 'partJoins') { if (q <= p) continue; j = (q - p) * N / (100 - q); after = N + j; }       // (P + j)/(N + j) = q
                else if (kind === 'partLeaves') { if (q >= p) continue; j = (p - q) * N / (100 - q); after = N - j; }  // (P − j)/(N − j) = q
                else { if (q >= p) continue; j = (100 * P - q * N) / q; after = N + j; }                                 // P/(N + j) = q
                if (!Number.isInteger(j) || j < 2 || j > 0.4 * N || !Number.isInteger(q * after / 100)) continue;   // at most 40% of the original group joins or leaves
                const askNow = Math.random() < 0.35;
                const answer = askNow ? after : N;
                const change = kind === 'partJoins' ? `${j} more ${ctx.part} join the ${ctx.group} and no ${ctx.member} leave`
                    : kind === 'partLeaves' ? `${j} of the ${ctx.part} leave the ${ctx.group} and no ${ctx.member} join`
                    : `${j} more ${ctx.other} join the ${ctx.group} and no ${ctx.member} leave`;
                const eq = kind === 'partJoins' ? `${p / 100}x+${j}=${q / 100}\\left(x+${j}\\right)` : kind === 'partLeaves' ? `${p / 100}x-${j}=${q / 100}\\left(x-${j}\\right)` : `${p / 100}x=${q / 100}\\left(x+${j}\\right)`;
                const art = /^[aeiou]/.test(ctx.group) ? 'an' : 'a';
                return {
                    questionText: `<p>In ${art} ${ctx.group}, ${p}% of the ${ctx.member} are ${ctx.part}. After ${change}, ${q}% of the ${ctx.member} are ${ctx.part}. How many ${ctx.member} ${askNow ? `are in the ${ctx.group} now` : `did the ${ctx.group} have originally`}?</p>`,
                    answer,
                    desmosSolutions: [
                        { id: 'eq', latex: eq },
                        { type: 'text', id: 'note1', text: `Let x be the original number of ${ctx.member}: ${p}% of x are ${ctx.part}. After the change the ${ctx.part} are ${q}% of the new total, which gives the equation above. Desmos shows x = ${N}.` },
                        { type: 'text', id: 'note2', text: `Originally ${N} ${ctx.member} (${P} ${ctx.part}); now ${after} (${kind === 'partJoins' ? P + j : kind === 'partLeaves' ? P - j : P} ${ctx.part}, ${q}%). Answer: ${answer}` },
                    ],
                };
            }
            // deterministic fallback (checked by hand): 40% of 30 = 12 juniors; 6 more join, so 18 of 36 = 50%
            return {
                questionText: '<p>In a club, 40% of the members are juniors. After 6 more juniors join the club and no members leave, 50% of the members are juniors. How many members did the club have originally?</p>',
                answer: 30,
                desmosSolutions: [
                    { id: 'eq', latex: '0.4x+6=0.5\\left(x+6\\right)' },
                    { type: 'text', id: 'note1', text: 'Let x be the original number of members: 0.4x + 6 = 0.5(x + 6), so x = 30.' },
                    { type: 'text', id: 'note2', text: 'Originally 30 members (12 juniors); now 36 (18 juniors, 50%). Answer: 30' },
                ],
            };
        },
    },

    // ===== #112 =====
    {
        id: 'stat-combined-mean',
        title: '(Hard) Mean of Combined Groups',
        skill: 'One-variable data: Distributions and measures of center and spread',
        source: SRC.OUT,
        tips: [
            'Combine <b>totals</b>, not means: total = mean × count for each group. The combined mean is (total of group 1 + total of group 2) ÷ (count 1 + count 2). With unequal group sizes, it is not the average of the two means.',
            'Working backward, write the same equation with the unknown in it: \\(\\frac{20(80) + 30x}{50} = 74\\). For an unknown group size, \\(\\frac{20(80) + 70n}{20 + n} = 74\\). Traps: averaging the means, and pairing a mean with the other group&#39;s size.',
            'Desmos: type the equation with \\(x\\) for the unknown; Desmos draws a vertical line at the answer.',
        ],
        questionGenerator() {
            const ctxs = [
                { a: 'Class A', b: 'Class B', unit: 'students', of: v => `a mean test score of ${v}`, ask: 'mean test score', lo: 55, hi: 95, min: 40, max: 100 },
                { a: 'the morning section', b: 'the afternoon section', unit: 'students', of: v => `a mean quiz score of ${v}`, ask: 'mean quiz score', lo: 60, hi: 95, min: 40, max: 100 },
                { a: 'Team A', b: 'Team B', unit: 'players', of: v => `a mean height of ${v} inches`, ask: 'mean height, in inches,', lo: 62, hi: 80, min: 50, max: 86 },
                { a: 'Shipment A', b: 'Shipment B', unit: 'boxes', of: v => `a mean weight of ${v} pounds`, ask: 'mean weight, in pounds,', lo: 12, hi: 60, min: 5, max: 80 },
            ];
            const fmt = v => `\\(${num(v)}\\)`;
            const clean = v => v > 0 && Number.isInteger(roundTo(10 * v, 6));
            const inst = balancedChoice(target => {
                const ctx = pick(ctxs);
                const n1 = randInt(8, 40), n2 = randInt(8, 40);
                if (Math.abs(n1 - n2) < 4) return null;   // unequal sizes, so the simple average is wrong
                const m1 = randInt(ctx.lo, ctx.hi), m2 = randInt(ctx.lo, ctx.hi);
                if (Math.abs(m1 - m2) < 4) return null;
                const tot = n1 * m1 + n2 * m2, M = tot / (n1 + n2);
                if (!Number.isInteger(M)) return null;
                const mode = pick(['forward', 'meanB', 'meanB', 'sizeB']);   // at least half reverse
                let key, pool;
                if (mode === 'forward') {
                    key = M;
                    pool = [(m1 + m2) / 2, (n2 * m1 + n1 * m2) / (n1 + n2), tot / Math.max(n1, n2), (m1 + m2) / 2 + 1];   // simple average; weights reversed; wrong count
                } else if (mode === 'meanB') {
                    key = m2;
                    pool = [2 * M - m1, (M * (n1 + n2) - n2 * m1) / n1, M * (n1 + n2) / n2 - m1, (M * (n1 + n2) - n1 * m1) / (n1 + n2)];   // averaging; sizes swapped; …; divided by the combined count
                } else {
                    key = n2;
                    pool = [n1, n1 * (M - m2) / (m1 - M), n1 + n2, Math.abs(n1 - n2)];   // equal sizes; ratio inverted; the combined size; the difference
                }
                // every choice must be plausible in context: a mean inside the context's range, a group size from 2 to 150
                const ok = mode === 'sizeB' ? v => Number.isInteger(v) && v >= 2 && v <= 150 : v => v >= ctx.min && v <= ctx.max;
                pool = [...new Set(pool.filter(v => clean(v) && ok(v) && Math.abs(v - key) > 1e-9).map(v => roundTo(v, 6)))];
                const built = choicesFromPool(key, pool, fmt, target);
                return built && { ...built, ctx, n1, n2, m1, m2, M, mode };
            }, 1500) || { ...makeChoicesSorted(74, [75, 76, 70], fmt), ctx: ctxs[0], n1: 20, n2: 30, m1: 80, m2: 70, M: 74, mode: 'forward' };
            const { ctx, n1, n2, m1, m2, M, mode } = inst;
            let stem, eq;
            const A = ctx.a[0].toUpperCase() + ctx.a.slice(1), B = ctx.b;
            if (mode === 'forward') { stem = `${A} has ${n1} ${ctx.unit} with ${ctx.of(m1)}. ${B[0].toUpperCase() + B.slice(1)} has ${n2} ${ctx.unit} with ${ctx.of(m2)}. What is the ${ctx.ask} of all ${n1 + n2} ${ctx.unit}?`; eq = `x=\\frac{${n1}\\cdot${m1}+${n2}\\cdot${m2}}{${n1 + n2}}`; }
            else if (mode === 'meanB') { stem = `${A} has ${n1} ${ctx.unit} with ${ctx.of(m1)}, and ${B} has ${n2} ${ctx.unit}. All ${n1 + n2} ${ctx.unit} together have ${ctx.of(M)}. What is the ${ctx.ask} of ${B}?`; eq = `\\frac{${n1}\\cdot${m1}+${n2}x}{${n1 + n2}}=${M}`; }
            else { stem = `${A} has ${n1} ${ctx.unit} with ${ctx.of(m1)}. The ${ctx.unit} in ${B} have ${ctx.of(m2)}. When the two groups are combined, the ${ctx.unit} have ${ctx.of(M)}. How many ${ctx.unit} are in ${B}?`; eq = `\\frac{${n1}\\cdot${m1}+${m2}x}{${n1}+x}=${M}`; }
            return {
                questionText: `<p>${stem}</p>`,
                choices: inst.choices,
                answer: inst.answer,
                desmosSolutions: [
                    { id: 'eq', latex: eq },
                    { type: 'text', id: 'note1', text: `Totals: ${n1} × ${m1} = ${n1 * m1} and ${n2} × ${m2} = ${n2 * m2}. Combined: ${n1 * m1 + n2 * m2} ÷ ${n1 + n2} = ${M}.` },
                    { type: 'text', id: 'note2', text: `The simple average of the means, ${num((m1 + m2) / 2)}, is wrong because the groups are different sizes. Answer: ${inst.answer}) ${mode === 'forward' ? M : mode === 'meanB' ? m2 : n2}` },
                ],
            };
        },
    },

    // ===== #113 =====
    {
        id: 'tvd-average-rate-of-change',
        title: '(Hard) Average Rate of Change of a Nonlinear Model',
        skill: 'Two-variable data: Models and scatterplots',
        source: SRC.OUT,
        tips: [
            'Average rate of change from \\(t = a\\) to \\(t = b\\) is \\(\\frac{f(b) - f(a)}{b - a}\\): the change in output divided by the change in input. For a nonlinear model it depends on the interval.',
            'Traps: stopping at the change in output (not dividing), averaging the two outputs, and dividing by the end time \\(b\\) instead of \\(b - a\\). Keep the units: dollars per year, feet per second.',
            'Desmos: define the function, then type <code>(f(3)-f(1))/(3-1)</code>. For a table, compute it from the two rows.',
        ],
        questionGenerator() {
            const fmt = u => v => `\\(${tnum(v)}\\) ${u}`;
            const clean = v => Number.isInteger(roundTo(10 * v, 6)) && v !== 0;
            const inst = balancedChoice(target => {
                const kind = pick(['exp', 'quad', 'table']);
                let f, t1, t2, stem, unitRate, fnLatex, rows;
                if (kind === 'exp') {
                    const [P0, b] = pick([[500, 2], [200, 3], [1000, 1.5], [800, 1.25], [64, 1.5], [4000, 0.5], [2400, 0.75]]);
                    t1 = randInt(0, 3); t2 = t1 + randInt(1, 3);
                    f = t => P0 * b ** t;
                    const ctx = pick([['V', 'the value, in dollars, of an investment', 't years after it was made', 'dollars per year'], ['N', 'the number of bacteria in a sample', 't hours after an experiment began', 'bacteria per hour']]);
                    stem = `The function \\(${ctx[0]}(t) = ${texNum(P0)}(${b})^{t}\\) models ${ctx[1]} ${ctx[2].replace('t ', '\\(t\\) ')}. What is the average rate of change of \\(${ctx[0]}(t)\\) from \\(t = ${t1}\\) to \\(t = ${t2}\\)?`;
                    unitRate = ctx[3]; fnLatex = `${ctx[0]}(t)=${P0}\\left(${b}\\right)^{t}`;
                } else if (kind === 'quad') {
                    const v = 16 * randInt(2, 6), h0 = pick([0, 4, 5, 6, 10]);
                    f = t => -16 * t * t + v * t + h0;
                    t1 = randInt(0, 2); t2 = t1 + randInt(1, 3);
                    if (f(t2) < 0) return null;
                    stem = `A ball is thrown upward. Its height, in feet, \\(t\\) seconds after it is thrown is modeled by \\(h(t) = ${polyTex([-16, v, h0]).replace(/x/g, 't')}\\). What is the average rate of change of \\(h(t)\\) from \\(t = ${t1}\\) to \\(t = ${t2}\\)?`;
                    unitRate = 'feet per second'; fnLatex = `h(t)=${polyTex([-16, v, h0]).replace(/x/g, 't').replace(/ /g, '')}`;
                } else {
                    const step = pick([1, 2]), ts = [0, 1, 2, 3, 4].map(x => x * step);
                    const c0 = randInt(2, 12), r = pick([1.5, 2]);
                    rows = ts.map(t => [t, roundTo(c0 * r ** (t / step) * (r === 1.5 ? 16 : 5), 6)]);
                    if (rows.some(([, y]) => !Number.isInteger(y))) return null;
                    const i1 = randInt(0, 2), i2 = i1 + randInt(1, 2);
                    [t1, t2] = [rows[i1][0], rows[i2][0]];
                    const map = new Map(rows); f = t => map.get(t);
                    stem = `The table shows the height, in centimeters, of a plant \\(t\\) weeks after it was planted.</p><table><tr><th>\\(t\\) (weeks)</th>${rows.map(r2 => `<td>${r2[0]}</td>`).join('')}</tr><tr><th>Height (cm)</th>${rows.map(r2 => `<td>${r2[1]}</td>`).join('')}</tr></table><p>What is the average rate of change of the plant&#39;s height from \\(t = ${t1}\\) to \\(t = ${t2}\\)?`;
                    unitRate = 'centimeters per week'; fnLatex = null;
                }
                const d = f(t2) - f(t1), key = d / (t2 - t1);
                if (!Number.isInteger(key) || key === 0) return null;
                // errors: the change not divided; the average of the outputs; divided by the end time; Δt/ΔP; the interval counted
                // inclusively (b − a + 1); only the first step of the interval
                const step1 = kind === 'table' ? null : f(t1 + 1) - f(t1);
                const pool = [d, (f(t1) + f(t2)) / 2, d / t2, (t2 - t1) / d, d / (t2 - t1 + 1), step1].filter(v => v !== null && Number.isFinite(v) && clean(v) && Math.abs(v - key) > 1e-9);
                const built = choicesFromPool(key, [...new Set(pool.map(v => roundTo(v, 6)))], fmt(unitRate), target);
                return built && { ...built, kind, stem, t1, t2, f1: f(t1), f2: f(t2), key, unitRate, fnLatex };
            });
            const { kind, stem, t1, t2, f1, f2, key, unitRate, fnLatex } = inst;
            const fn = kind === 'exp' ? fnLatex.split('(')[0] : 'h';
            return {
                questionText: `<p>${stem}</p>`,
                choices: inst.choices,
                answer: inst.answer,
                desmosSolutions: [
                    ...(fnLatex ? [{ id: 'f', latex: fnLatex }, { id: 'rate', latex: `\\frac{${fn}\\left(${t2}\\right)-${fn}\\left(${t1}\\right)}{${t2}-${t1}}` }] : [{ id: 'rate', latex: `\\frac{${f2}-${f1}}{${t2}-${t1}}` }]),
                    { type: 'text', id: 'note1', text: `At t = ${t1} the value is ${num(f1)}; at t = ${t2} it is ${num(f2)}. The change is ${num(f2 - f1)} over ${t2 - t1} unit${t2 - t1 === 1 ? '' : 's'} of time.` },
                    { type: 'text', id: 'note2', text: `Average rate of change = ${num(f2 - f1)} ÷ ${t2 - t1} = ${num(key)} ${unitRate}. Answer: ${inst.answer}` },
                ],
            };
        },
    },

    // ===== #114 =====
    {
        id: 'prob-fill-table-from-probability',
        title: '(Hard) Missing Table Entry from a Probability',
        skill: 'Probability and conditional probability',
        source: SRC.OUT,
        tips: [
            'Write the probability with the unknown: if a person is chosen from Group A, the denominator is the Group A total, which includes \\(x\\). For example, \\(\\frac{x}{x + 25} = \\frac{3}{8}\\); cross-multiply and solve.',
            'Traps: using the grand total or the other group&#39;s total as the denominator, and setting up the complement (the "no" probability) by mistake. Once \\(x\\) is known, fill in the table before answering any follow-up question.',
            'Desmos: type the probability equation, e.g. <code>x/(x+25)=3/8</code>; Desmos draws a vertical line at the answer.',
        ],
        questionGenerator() {
            const ctxs = [
                { rows: ['Morning shift', 'Evening shift'], cols: ['Yes', 'No'], intro: 'A company asked its employees whether they would like a later start time. The table shows the responses by shift.', who: 'employee', group: r => `the ${r.toLowerCase()}`, ev: c => `answered "${c.toLowerCase()}"` },
                { rows: ['Grade 9', 'Grade 10'], cols: ['Plays an instrument', 'Does not play an instrument'], intro: 'The table shows how many students in two grades at a school play a musical instrument.', who: 'student', group: r => r.toLowerCase().replace('grade', 'grade'), ev: c => (c.startsWith('Plays') ? 'plays an instrument' : 'does not play an instrument') },
                { rows: ['Store 1', 'Store 2'], cols: ['Defective', 'Not defective'], intro: 'The table shows the number of defective and non-defective light bulbs in a shipment to each of two stores.', who: 'bulb', group: r => r.toLowerCase(), ev: c => (c === 'Defective' ? 'is defective' : 'is not defective') },
            ];
            const F = (n, d) => ({ value: n / d, html: `\\(\\dfrac{${n}}{${d}}\\)` });
            const inst = balancedChoice(target => {
                const ctx = pick(ctxs);
                const [pn, pd] = pick([[1, 4], [3, 8], [2, 5], [3, 5], [1, 3], [2, 3], [3, 4], [5, 8], [3, 10], [7, 10]]);
                const known = (pd - pn) * randInt(2, 8);      // Group A's other cell; x/(x + known) = pn/pd
                const x = pn * known / (pd - pn);
                if (!Number.isInteger(x) || x < 2) return null;
                const yesB = randInt(4, 40), noB = randInt(4, 40);
                const grand = x + known + yesB + noB;
                const followUp = Math.random() < 0.5;
                let key, pool;
                if (!followUp) {
                    key = x;
                    // errors: grand total as the denominator; Group B's total as the denominator; the complement probability used
                    const g = pn * (known + yesB + noB) / (pd - pn), b = pn * (yesB + noB) / pd, cmp = known * (pd - pn) / pn;
                    const ratio = known * pn / pd;   // used yes : no = pn : pd instead of yes : total
                    pool = [g, b, cmp, x + known, ratio].filter(v => Number.isInteger(v) && v > 0 && v !== x);
                    const built = choicesFromPool(key, [...new Set(pool)], v => `\\(${v}\\)`, target);
                    return built && { ...built, ctx, x, known, yesB, noB, pn, pd, followUp };
                }
                // two steps: find x, then the probability that a person chosen from everyone is in the first column
                key = F(x + yesB, grand);
                pool = [F(x, grand), F(x + known, grand), F(known + noB, grand), F(x + yesB, grand - x), F(yesB, grand), F(x + yesB, grand + known), F(yesB, yesB + noB)];   // only Group A's; the wrong row (Group A's total); the other column; x left out of the total; x left out of the count; Group A's other cell counted twice; only Group B's rate
                pool = pool.filter(c => c.value > 0 && c.value < 1);   // every choice is a possible probability
                const built = choicesFromPool(key, pool, undefined, target);
                return built && { ...built, ctx, x, known, yesB, noB, pn, pd, followUp, grand };
            });
            const { ctx, x, known, yesB, noB, pn, pd, followUp } = inst;
            const table = `<table><tr><th></th>${ctx.cols.map(c => `<th>${c}</th>`).join('')}</tr><tr><th>${ctx.rows[0]}</th><td>\\(x\\)</td><td>${known}</td></tr><tr><th>${ctx.rows[1]}</th><td>${yesB}</td><td>${noB}</td></tr></table>`;
            const art = /^[aeiou]/.test(ctx.who) ? 'an' : 'a';
            const cond = `If ${art} ${ctx.who} is selected at random from ${ctx.group(ctx.rows[0])}, the probability that the ${ctx.who} ${ctx.ev(ctx.cols[0])} is \\(\\dfrac{${pn}}{${pd}}\\).`;
            const ask = followUp ? `If ${art} ${ctx.who} is selected at random from all the ${ctx.who}s in the table, what is the probability that the ${ctx.who} ${ctx.ev(ctx.cols[0])}?` : 'What is the value of \\(x\\)?';
            return {
                questionText: `<p>${ctx.intro}</p>${table}<p>${cond} ${ask}</p>`,
                choices: inst.choices,
                answer: inst.answer,
                desmosSolutions: [
                    { id: 'eq', latex: `\\frac{x}{x+${known}}=\\frac{${pn}}{${pd}}` },
                    { type: 'text', id: 'note1', text: `The denominator is ${ctx.group(ctx.rows[0])}'s total, x + ${known}. Solving x/(x + ${known}) = ${pn}/${pd} gives x = ${x}.` },
                    { type: 'text', id: 'note2', text: followUp ? `With x = ${x}, the table has ${x + known + yesB + noB} in all, and ${x} + ${yesB} = ${x + yesB} in the first column, so the probability is ${x + yesB}/${x + known + yesB + noB}. Answer: ${inst.answer}` : `Answer: ${inst.answer}) ${x}` },
                ],
            };
        },
    },

    // ===== #94 =====
    {
        id: 'rat-ratio-after-change',
        title: '(Hard) Ratio Before and After a Change',
        skill: 'Ratios, rates, proportional relationships, and units',
        source: SRC.OUT,
        tips: [
            'Turn the first ratio into actual amounts: a class of 64 with boys to girls 3 : 5 has \\(\\frac{3}{8}(64) = 24\\) boys and 40 girls. Then write the new ratio as an equation with the unknown change: \\(\\frac{24 + x}{40} = \\frac{1}{1}\\).',
            'When the same amount is added to both quantities, write them as \\(2k\\) and \\(3k\\): \\(\\frac{2k + 10}{3k + 10} = \\frac{3}{4}\\). Trap: adding to the ratio numbers themselves (2 + 10 to 3 + 10) instead of to the actual amounts.',
            'Desmos: type the equation for the new ratio, e.g. <code>(24+x)/40=1</code>; Desmos draws a vertical line at the answer.',
        ],
        questionGenerator() {
            for (let attempt = 0; attempt < 500; attempt++) {
                const mode = pick(['join', 'both', 'mixture']);
                let p, q, r, s;
                do { p = randInt(1, 7); q = randInt(1, 9); } while (gcd(p, q) !== 1 || p === q);
                do { r = randInt(1, 7); s = randInt(1, 9); } while (gcd(r, s) !== 1 || (r === p && s === q));
                if (mode === 'join') {   // T students, boys:girls = p:q; boys join to make r:s
                    const T = (p + q) * randInt(2, 8), B = p * T / (p + q), G = q * T / (p + q);
                    const j = r * G / s - B;
                    if (!Number.isInteger(j) || j < 1 || j > T / 2 || r / s <= p / q) continue;   // a realistic number of new students
                    return out(`<p>A class of ${T} students has a ratio of boys to girls of ${p} to ${q}. How many boys must join the class so that the ratio of boys to girls is ${r} to ${s}?</p>`, j,
                        `\\frac{${B}+x}{${G}}=\\frac{${r}}{${s}}`, `The class has ${p}/${p + q} × ${T} = ${B} boys and ${G} girls. Solve (${B} + x)/${G} = ${r}/${s}: x = ${j}.`);
                }
                if (mode === 'both') {   // x:y = p:q, add k to each → r:s
                    const k = randInt(2, 20);
                    const den = s * p - r * q;
                    if (den === 0) continue;
                    const t = k * (r - s) / den;
                    if (!Number.isInteger(t) || t < 1 || t > 20) continue;
                    const askX = Math.random() < 0.6, ans = askX ? p * t : q * t;
                    return out(`<p>The ratio of \\(x\\) to \\(y\\) is ${p} to ${q}, where \\(x\\) and \\(y\\) are positive. When ${k} is added to both \\(x\\) and \\(y\\), the ratio of the new values is ${r} to ${s}. What is the value of \\(${askX ? 'x' : 'y'}\\)?</p>`, ans,
                        `\\frac{${polyTex([p, k]).replace(/ /g, '')}}{${polyTex([q, k]).replace(/ /g, '')}}=\\frac{${r}}{${s}}`, `Write x = ${p}t and y = ${q}t (Desmos uses x for t). Solve (${polyText([p, k]).replace('x', 't')})/(${polyText([q, k]).replace('x', 't')}) = ${r}/${s}: t = ${t}, so x = ${p * t} and y = ${q * t}.`);
                }
                // juice : water = p : q in V cups; add water to make r : s
                const V = (p + q) * randInt(1, 6), J = p * V / (p + q), W = q * V / (p + q);
                const w = J * s / r - W;
                if (!Number.isInteger(w) || w < 1 || w > V || s / r <= q / p) continue;   // at most doubles the volume
                return out(`<p>A drink is made by mixing juice and water in a ratio of ${p} to ${q}, by volume. A pitcher contains ${V} cups of this drink. How many cups of water must be added to the pitcher so that the ratio of juice to water is ${r} to ${s}?</p>`, w,
                    `\\frac{${J}}{${W}+x}=\\frac{${r}}{${s}}`, `The pitcher has ${p}/${p + q} × ${V} = ${J} cups of juice and ${W} cups of water. Solve ${J}/(${W} + x) = ${r}/${s}: x = ${w}.`);
            }
            throw new Error('rat-ratio-after-change: no instance');
            function out(questionText, answer, eq, note) {
                return {
                    questionText,
                    answer,
                    desmosSolutions: [
                        { id: 'eq', latex: eq },
                        { type: 'text', id: 'note1', text: `${note} Desmos draws the solution as a vertical line.` },
                        { type: 'text', id: 'note2', text: `Answer: ${answer}` },
                    ],
                };
            }
        },
    },

    // ===== #95 =====
    {
        id: 'rat-area-unit-conversion',
        title: '(Hard) Convert Area and Volume Units',
        skill: 'Ratios, rates, proportional relationships, and units',
        source: SRC.OUT,
        tips: [
            'Area units use the conversion factor <b>squared</b>, and volume units use it <b>cubed</b>: 1 yard = 3 feet, so 1 square yard = \\(3^2 = 9\\) square feet and 1 cubic yard = \\(3^3 = 27\\) cubic feet. Likewise 1 square foot = 144 square inches and 1 square meter = 10,000 square centimeters.',
            'Safest method: convert each length first, then multiply. A floor 12 feet by 15 feet is 4 yards by 5 yards, so it is 20 square yards. Trap: dividing the area by 3 (or the volume by 3 or 9) instead of by 9 (or 27).',
            'Desmos is a calculator here, e.g. <code>12*15/3^2</code>.',
        ],
        questionGenerator() {
            const mode = pick(['ft2yd2', 'ft2yd2cost', 'yd2ft2', 'in2ft2', 'tiles', 'cm2m2', 'ft3yd3', 'ft3yd3cost', 'yd3bags']);   // chosen once, so every mode appears equally often
            for (let attempt = 0; attempt < 3000; attempt++) {
                let stem, answer, calc, note;
                if (mode === 'ft2yd2' || mode === 'ft2yd2cost') {
                    const L = randInt(9, 27), W = randInt(8, 24);
                    if (L <= W || (L * W) % 9 !== 0) continue;
                    const what = pick(['room', 'classroom', 'basement', 'hallway']);
                    const yd2 = L * W / 9;
                    if (mode === 'ft2yd2') {
                        answer = yd2; calc = `\\frac{${L}\\cdot${W}}{3^{2}}`;
                        stem = `The floor of a rectangular ${what} measures ${L} feet by ${W} feet. What is the area of the floor, in square yards? (1 yard = 3 feet)`;
                        note = `${L} × ${W} = ${L * W} square feet; 1 square yard = 3² = 9 square feet, so ${L * W}/9 = ${yd2} square yards.`;
                    } else {
                        const p = randInt(18, 45); answer = yd2 * p; calc = `\\frac{${L}\\cdot${W}}{3^{2}}\\cdot${p}`;
                        stem = `Carpet costs ${money(p)} per square yard. What is the cost, in dollars, of carpet to cover the floor of a rectangular ${what} that measures ${L} feet by ${W} feet? (1 yard = 3 feet)`;
                        note = `${L * W} square feet ÷ 9 = ${yd2} square yards; ${yd2} × ${p} = ${answer} dollars.`;
                    }
                } else if (mode === 'yd2ft2') {
                    const L = randInt(4, 30), W = randInt(3, 20);
                    if (L <= W) continue;
                    const what = pick(['lawn', 'vegetable garden', 'playground', 'parking area']);
                    answer = L * W * 9; calc = `${L}\\cdot${W}\\cdot3^{2}`;
                    stem = `A rectangular ${what} measures ${L} yards by ${W} yards. What is the area of the ${what}, in square feet? (1 yard = 3 feet)`;
                    note = `${L} × ${W} = ${L * W} square yards; each square yard is 3² = 9 square feet, so the area is ${answer} square feet.`;
                } else if (mode === 'in2ft2') {
                    const L = 6 * randInt(4, 16), W = 6 * randInt(3, 12);
                    if (L <= W || (L * W) % 144 !== 0) continue;
                    const what = pick(['tabletop', 'window', 'bulletin board', 'shower wall panel']);
                    answer = L * W / 144; calc = `\\frac{${L}\\cdot${W}}{12^{2}}`;
                    stem = `A rectangular ${what} measures ${L} inches by ${W} inches. What is the area of the ${what}, in square feet? (1 foot = 12 inches)`;
                    note = `${L} × ${W} = ${texNum(L * W).replace('{,}', ',')} square inches; 1 square foot = 12² = 144 square inches, so the area is ${answer} square feet.`;
                } else if (mode === 'tiles') {
                    const s = pick([4, 6, 8, 12]), L = randInt(6, 20), W = randInt(5, 16);
                    if (L <= W || (L * W * 144) % (s * s) !== 0) continue;
                    answer = L * W * 144 / (s * s); calc = `\\frac{${L}\\cdot${W}\\cdot12^{2}}{${s}^{2}}`;
                    stem = `A rectangular floor measures ${L} feet by ${W} feet. It will be covered, with no gaps or overlaps, by square tiles that are ${s} inches on each side. How many tiles are needed? (1 foot = 12 inches)`;
                    note = `${L} × ${W} = ${L * W} square feet = ${L * W} × 144 = ${L * W * 144} square inches; each tile covers ${s}² = ${s * s} square inches, so ${answer} tiles.`;
                } else if (mode === 'cm2m2') {
                    const L = 50 * randInt(4, 16), W = 50 * randInt(3, 12);
                    if (L <= W || (L * W) % 10000 !== 0) continue;
                    const what = pick(['garden bed', 'rug', 'stage floor', 'mural']);
                    answer = L * W / 10000; calc = `\\frac{${L}\\cdot${W}}{100^{2}}`;
                    stem = `A rectangular ${what} measures ${L} centimeters by ${W} centimeters. What is the area of the ${what}, in square meters? (1 meter = 100 centimeters)`;
                    note = `${L} cm = ${L / 100} m and ${W} cm = ${W / 100} m, so the area is ${answer} square meters (or divide ${L * W} by 100² = 10,000).`;
                } else if (mode === 'ft3yd3' || mode === 'ft3yd3cost') {
                    const what = pick([['sandbox', 1, 2, 4, 12], ['raised garden bed', 1, 3, 4, 15], ['concrete patio slab', 0.5, 1, 9, 30]]);
                    const H = what[1] === 0.5 ? 0.5 : randInt(what[1], what[2]);
                    const L = randInt(what[3], what[4]), W = randInt(what[3], Math.min(what[4], 20));
                    const V = L * W * H;
                    if (L < W || !Number.isInteger(V) || V % 27 !== 0) continue;
                    const dims = H === 0.5 ? `${L} feet long, ${W} feet wide, and 6 inches (0.5 foot) deep` : `${L} feet long, ${W} feet wide, and ${H} ${H === 1 ? 'foot' : 'feet'} deep`;
                    const fill = what[0].startsWith('concrete') ? 'concrete' : what[0] === 'sandbox' ? 'sand' : 'soil';
                    const shape = fill === 'concrete' ? 'shaped like a rectangular prism' : 'a rectangular box';
                    const goal = fill === 'concrete' ? 'to make the slab' : 'to fill it completely';
                    if (mode === 'ft3yd3') {
                        answer = V / 27; calc = `\\frac{${L}\\cdot${W}\\cdot${H}}{3^{3}}`;
                        stem = `A ${what[0]} is ${shape} ${dims}. How many cubic yards of ${fill} are needed ${goal}? (1 yard = 3 feet)`;
                    } else {
                        const p = fill === 'concrete' ? pick([120, 130, 140, 150]) : pick([30, 35, 40, 45, 50]);   // a realistic price per cubic yard
                        answer = V / 27 * p; calc = `\\frac{${L}\\cdot${W}\\cdot${H}}{3^{3}}\\cdot${p}`;
                        stem = `${fill[0].toUpperCase() + fill.slice(1)} costs ${money(p)} per cubic yard. A ${what[0]} is ${shape} ${dims}. What is the cost, in dollars, of the ${fill} needed ${goal}? (1 yard = 3 feet)`;
                    }
                    note = `${L} × ${W} × ${H} = ${V} cubic feet; 1 cubic yard = 3³ = 27 cubic feet, so ${V}/27 = ${V / 27} cubic yards${mode === 'ft3yd3cost' ? `, which cost ${answer} dollars` : ''}.`;
                } else {
                    const Y = randInt(2, 12), bag = pick([1.5, 2, 3]);
                    if (!Number.isInteger(27 * Y / bag)) continue;
                    answer = 27 * Y / bag; calc = `\\frac{${Y}\\cdot3^{3}}{${bag}}`;
                    stem = `A landscaper needs ${Y} cubic yards of mulch. The mulch is sold in bags that each hold ${bag} cubic feet. How many bags does the landscaper need? (1 yard = 3 feet)`;
                    note = `${Y} cubic yards = ${Y} × 3³ = ${27 * Y} cubic feet; ${27 * Y}/${bag} = ${answer} bags.`;
                }
                if (!Number.isInteger(answer) || answer < 2 || String(answer).length > 5) continue;
                return {
                    questionText: `<p>${stem}</p>`.replace(/ (\d{4,})/g, (_, m) => ` ${commas(+m)}`),
                    answer,
                    desmosSolutions: [
                        { id: 'calc', latex: calc },
                        { type: 'text', id: 'note1', text: note.replace(/(\d{4,})/g, m => commas(+m)) },
                        { type: 'text', id: 'note2', text: `Answer: ${answer}` },
                    ],
                };
            }
            return {
                questionText: '<p>A rectangular room floor measures 12 feet by 15 feet. What is the area of the room floor, in square yards? (1 yard = 3 feet)</p>',
                answer: 20,
                desmosSolutions: [
                    { id: 'calc', latex: '\\frac{12\\cdot15}{3^{2}}' },
                    { type: 'text', id: 'note1', text: '12 × 15 = 180 square feet; 180/9 = 20 square yards. Answer: 20' },
                ],
            };
        },
    },

    // ===== #115 =====
    {
        id: 'inf-compare-estimates',
        title: '(Hard) Compare Estimates with Margins of Error',
        skill: 'Inference from sample statistics and margin of error',
        source: SRC.OUT,
        tips: [
            'An estimate with a margin of error gives an interval of plausible values: 54% with a margin of error of 4% means the true percent is plausibly between 50% and 58%.',
            'To compare two groups, write both intervals. If they overlap, the data do <b>not</b> give convincing evidence of a difference (which is not the same as saying the percents are equal). If they do not overlap, the group with the higher interval likely has the higher percent. Traps: claiming an exact difference, and conclusions about individual people.',
            'A larger random sample gives a smaller margin of error (all else equal). It does not shrink in proportion: 4 times the sample size about halves it.',
        ],
        questionGenerator() {
            const ctxs = [
                { pop: 'residents', one: 'resident', places: ['Town A', 'Town B'], what: 'support the proposed park', intro: 'residents were asked whether they support a proposed park' },
                { pop: 'students', one: 'student', places: ['North High School', 'South High School'], what: 'walk to school', intro: 'students were asked whether they walk to school' },
                { pop: 'adults', one: 'adult', places: ['County X', 'County Y'], what: 'have a library card', intro: 'adults were asked whether they have a library card' },
                { pop: 'employees', one: 'employee', places: ['Factory 1', 'Factory 2'], what: 'prefer a four-day workweek', intro: 'employees were asked whether they prefer a four-day workweek' },
            ];
            const ctx = pick(ctxs);
            const [A, B] = ctx.places;
            if (Math.random() < 0.24) {   // sample-size variant
                const n = 100 * randInt(2, 8), m = randInt(3, 6), p = randInt(30, 70);
                const key = 'The margin of error would most likely decrease.';
                const { choices, answer } = makeChoices(key, ['The margin of error would most likely increase.', 'The margin of error would most likely stay the same.', `The margin of error would most likely increase to about ${4 * m}%.`]);
                return {
                    questionText: `<p>In a survey of a random sample of ${n} ${ctx.pop} of ${A}, ${p}% said they ${ctx.what}. The margin of error for this estimate is ${m}%. Suppose the survey had instead used a random sample of ${4 * n} ${ctx.pop} of ${A}. Which statement about the margin of error is most likely true?</p>`.replace(/ (\d{4,})/g, (_, x) => ` ${commas(+x)}`),
                    choices, answer,
                    desmosSolutions: [
                        { type: 'text', id: 'note1', text: 'A larger random sample gives a more precise estimate, so the margin of error gets smaller (about half as large for 4 times the sample size).' },
                        { type: 'text', id: 'note2', text: `Answer: ${answer}` },
                    ],
                };
            }
            const overlap = Math.random() < 0.5;
            let p1, p2, m1, m2;
            for (;;) {
                p1 = randInt(30, 70); p2 = randInt(30, 70); m1 = randInt(1, 6); m2 = randInt(1, 6);
                const gap = Math.abs(p1 - p2), sum = m1 + m2;
                if (p1 === p2) continue;
                if (overlap ? gap <= sum - 1 && gap >= 2 : gap >= sum + 1 && gap <= sum + 8) break;
            }
            const hi = p1 > p2 ? A : B, lo = p1 > p2 ? B : A;
            const all = `all ${ctx.pop}`;
            const S = {
                noEvidence: `The data do not provide convincing evidence that the proportion of ${ctx.pop} who ${ctx.what} is different in ${A} and ${B}.`,
                higher: `The proportion of ${ctx.pop} who ${ctx.what} is likely greater in ${hi} than in ${lo}.`,
                reversed: `The proportion of ${ctx.pop} who ${ctx.what} is likely greater in ${lo} than in ${hi}.`,
                equal: `The proportions of ${all} who ${ctx.what} are the same in ${A} and ${B}.`,
                exact: `The percent of ${all} who ${ctx.what} is exactly ${Math.abs(p1 - p2)} percentage points higher in ${hi} than in ${lo}.`,
                individual: `Every ${ctx.one} in ${hi} is more likely to ${ctx.what} than any ${ctx.one} in ${lo}.`,
            };
            const keyName = overlap ? 'noEvidence' : 'higher';
            const wrongNames = overlap ? ['higher', 'equal', 'exact', 'individual'] : ['noEvidence', 'reversed', 'exact', 'individual'];
            const wrong = shuffle(wrongNames).slice(0, 3);
            // self-check: the key matches the intervals, and no other chosen statement is supported
            const lo1 = p1 - m1, hi1 = p1 + m1, lo2 = p2 - m2, hi2 = p2 + m2;
            const overlaps = lo1 <= hi2 && lo2 <= hi1;
            const supported = name => name === 'noEvidence' ? overlaps : name === 'higher' ? !overlaps : false;
            if (!supported(keyName) || wrong.some(supported)) throw new Error('inf-compare-estimates: statement check failed');
            const { choices, answer } = makeChoices(S[keyName], wrong.map(w => S[w]));
            return {
                questionText: `<p>Independent random samples of ${ctx.pop} were surveyed in ${A} and in ${B}, and the ${ctx.intro}. In ${A}, ${p1}% said yes, with an associated margin of error of ${m1}%. In ${B}, ${p2}% said yes, with an associated margin of error of ${m2}%. Which conclusion is best supported by these data?</p>`,
                choices, answer,
                desmosSolutions: [
                    { type: 'text', id: 'note1', text: `${A}: ${p1} ± ${m1} gives ${lo1}% to ${hi1}%. ${B}: ${p2} ± ${m2} gives ${lo2}% to ${hi2}%. The intervals ${overlaps ? 'overlap, so a difference is not established' : `do not overlap, and ${hi}'s interval is higher`}.` },
                    { type: 'text', id: 'note2', text: `Answer: ${answer}` },
                ],
            };
        },
    },

    // ===== #125 =====
    {
        id: 'claims-experiment-causation',
        title: '(Hard) What Can a Study Conclude?',
        skill: 'Evaluating statistical claims: Observational studies and experiments',
        source: SRC.OUT,
        tips: [
            '<b>Random assignment</b> to groups (an experiment) is what allows a conclusion about <b>cause and effect</b>. Without it (an observational study), only an <b>association</b> can be concluded, because other differences between the groups could explain the result.',
            '<b>Random selection</b> from a population is what allows the result to be applied to that whole population. Volunteers represent only people similar to the volunteers. Traps: generalizing to everyone, and claiming that no conclusion at all is possible.',
            'Ask two questions: Were the participants randomly <i>assigned</i>? Were they randomly <i>selected</i>, and from what population?',
        ],
        questionGenerator() {
            const ctxs = [
                { people: 'adults', popWhere: 'a large city', popAll: 'adults in the city', broad: 'all adults', treat: 'take a daily vitamin supplement', other: 'take a placebo', doing: 'taking the supplement', outcome: 'lower blood pressure', result: 'had significantly lower blood pressure, on average' },
                { people: 'students', popWhere: 'a large high school', popAll: 'students at the school', broad: 'all high school students', treat: 'use a flashcard app for 20 minutes a day', other: 'study without the app', doing: 'using the app', outcome: 'higher vocabulary test scores', result: 'had significantly higher vocabulary test scores, on average' },
                { people: 'employees', popWhere: 'a large company', popAll: 'employees of the company', broad: 'all office workers', treat: 'take a 20-minute walk at lunch', other: 'take no walk', doing: 'taking a lunchtime walk', outcome: 'better afternoon focus scores', result: 'had significantly better afternoon focus scores, on average' },
                { people: 'patients', popWhere: 'a large clinic', popAll: 'patients of the clinic', broad: 'all people', treat: 'follow a low-sodium meal plan', other: 'follow their usual diet', doing: 'following the meal plan', outcome: 'fewer headaches', result: 'reported significantly fewer headaches, on average' },
            ];
            const ctx = pick(ctxs);
            const design = pick(['expVol', 'expVol', 'expRand', 'obsRand', 'obsRand']);
            const assigned = design !== 'obsRand';
            const allowedScope = design === 'expVol' ? 0 : 1;   // 0 = people like the participants, 1 = the sampled population, 2 = beyond it
            const n = 20 * randInt(6, 25);
            const scopeText = s => s === 0 ? `for people similar to the ${ctx.people} in the study` : s === 1 ? `for ${ctx.popAll}` : `for ${ctx.broad}`;
            const Doing = ctx.doing[0].toUpperCase() + ctx.doing.slice(1);
            const cands = [];
            const scopes = design === 'expVol' ? [0, 2] : [0, 1, 2];
            for (const s of scopes) {
                cands.push({ type: 'cause', s, text: `${Doing} is likely to cause ${ctx.outcome} ${scopeText(s)}.` });
                cands.push({ type: 'assoc', s, text: `${Doing} is associated with ${ctx.outcome} ${scopeText(s)}, but the study cannot show that ${ctx.doing} causes ${ctx.outcome}.` });
            }
            cands.push({ type: 'none', s: 0, text: design === 'expVol' ? `No conclusion can be drawn, because the participants were volunteers rather than a random sample.` : design === 'expRand' ? `No conclusion can be drawn, because the participants knew they were in a study.` : `No conclusion can be drawn, because the ${ctx.people} were not randomly assigned to groups.` });
            // a statement is supported if its kind of claim is allowed by the design and its scope is no wider than allowed
            const supported = c => c.type !== 'none' && (c.type === 'cause' ? assigned : !assigned) && c.s <= allowedScope;
            const key = cands.find(c => c.type === (assigned ? 'cause' : 'assoc') && c.s === allowedScope);
            const wrong = shuffle(cands.filter(c => !supported(c)));
            // keep the "no conclusion" trap and a too-broad claim whenever possible
            const pickWrong = [wrong.find(c => c.type === 'none'), wrong.find(c => c.s === 2 && c.type === key.type), ...wrong].filter(Boolean);
            const chosen = [...new Set(pickWrong)].slice(0, 3);
            if (!key || chosen.length < 3 || [key, ...chosen].filter(supported).length !== 1) throw new Error('claims-experiment-causation: statement check failed');
            const { choices, answer } = makeChoices(key.text, chosen.map(c => c.text));
            let study;
            if (design === 'expVol') study = `A researcher recruited ${n} ${ctx.people} who volunteered for a study. The researcher randomly assigned half of them to ${ctx.treat} and the other half to ${ctx.other}. After 8 weeks, the ${ctx.people} who were assigned to ${ctx.treat} ${ctx.result}.`;
            else if (design === 'expRand') study = `A researcher selected a random sample of ${n} ${ctx.people} from ${ctx.popWhere}. The researcher randomly assigned half of them to ${ctx.treat} and the other half to ${ctx.other}. After 8 weeks, the ${ctx.people} who were assigned to ${ctx.treat} ${ctx.result}.`;
            else study = `A researcher selected a random sample of ${n} ${ctx.people} from ${ctx.popWhere} and asked each whether they ${ctx.treat}. The ${ctx.people} who said they do ${ctx.result}.`;
            return {
                questionText: `<p>${study} Which of the following is the most appropriate conclusion?</p>`,
                choices, answer,
                desmosSolutions: [
                    { type: 'text', id: 'note1', text: `${assigned ? 'Random assignment: a cause-and-effect conclusion is allowed.' : 'No random assignment (observational study): only an association can be concluded.'} ${design === 'expVol' ? 'Volunteers, not a random sample: the conclusion applies only to people similar to the volunteers.' : `Random sample from ${ctx.popWhere}: the conclusion applies to ${ctx.popAll}, but not beyond.`}` },
                    { type: 'text', id: 'note2', text: `Answer: ${answer}` },
                ],
            };
        },
    },

]);

})();
