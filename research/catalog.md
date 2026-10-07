# Question-type catalog (build plan)

Written by the manager on 2026-10-05. The builder implements one batch of 5 at a time, in order. Unbuilt entries may be revised between reviews; any change is noted in `research/review-log.md`.

**Status:** 125 types in 25 batches. 135 is a ceiling, not a quota (user: "I would rather have less problems but have them be high quality"). An entry is listed only if it is a genuine, recurring SAT pattern that works as a randomized text question. The best-sourced types come first: batches 1–4 are built on College Board's own sample questions. Candidates that were cut, and gaps to fill later, are at the bottom.

## Scope change (2026-10-06): build only the remaining Hard types

The user said: "Keep what has been done so far, but now only continue to build the problems that were planned and that were hard difficulty."

- **Kept:** #1–#50 (built, or in review for batch 10).
- **Dropped, Easy/Medium:** #51–59, 61–68, 71–75, 81–87, 91–93, 101, 102, 106–110, 116–118, 120 (43 entries). No gap-filling types will be added.
- **Dropped, Hard, for quality:**
  - **#103 `lin1-constant-special`** is a near-duplicate of the built #42 `sys-no-solution-constant`: the same "match the x-coefficients, then keep the constants unequal" move, in one variable instead of two.
  - **#104 `linf-transformed-intercept`** is a near-duplicate of #41 `lin2-shifted-line-x-intercept` (translate a line, then read an intercept). It is also honestly Medium.
- **Result:** 30 Hard types remain, in 6 batches. The final set will be 50 + 30 = 80 types.

**Hard bar.** Every remaining type must need real multi-step reasoning. Bigger numbers alone don't make a question Hard. These entries are tightened for that:
- **#60 `geo-volume-cone-sphere`:** every question takes at least two steps. Give the diameter (not the radius) with the volume; or a cone and a cylinder with equal volumes; or a sphere's volume → its diameter (cube root).
- **#76 `circ-center-general-form`:** ask only for the center. The radius ask overlaps the original "Radius of Non-Standard Circle". At least 50% should have doubled coefficients (2x² + 2y² + …), so students must divide first.
- **#89 `nlf-product-sum-numbers`:** always set up from two stated conditions, such as a rectangle's area and perimeter, or a product and a sum. A plain "x(x + 4) = 192" is not enough.
- **#95 `rat-area-unit-conversion`:** every question needs the factor squared or cubed. Include a volume variant (ft³ → yd³, ÷27).
- **#96 `geo-triangle-area-coordinates`:** at least 50% of triangles have no horizontal or vertical side.
- **#112 `stat-combined-mean`:** at least 50% are reverse variants: find one group's mean, or its size, from the combined mean.

**Hard build order** (batches H1–H6, best-sourced first; the original # stays the entry's id in this catalog):

| Batch | File | Types (format) |
| --- | --- | --- |
| H1 | geometry-trig | #78 circ-tangent-slope (MC), #77 circ-point-inside-outside (MC), #76 circ-center-general-form (MC), #79 trig-cofunction-angle-equation (SPR), #80 trig-similar-triangle-ratio (MC) |
| H2 | advanced-math | #124 eqx-polynomial-division (MC), #119 nleq-rational-equation (MC), #123 eqx-rational-exponents (MC), #69 nlf-exp-fractional-exponent-interpret (MC), #70 eqx-same-base-exponent (SPR) |
| H3 | problem-solving-data | #111 pct-part-whole-shift (SPR), #112 stat-combined-mean (MC), #113 tvd-average-rate-of-change (MC), #114 prob-fill-table-from-probability (MC), #94 rat-ratio-after-change (SPR) |
| H4 | geometry-trig | #97 geo-similar-solids-scale (MC), #98 geo-changed-dimensions (MC), #100 geo-altitude-on-hypotenuse (SPR), #96 geo-triangle-area-coordinates (MC), #60 geo-volume-cone-sphere (MC) |
| H5 | advanced-math + algebra | #88 nlf-polynomial-from-zeros (MC), #90 nlf-quadratic-from-zeros-and-point (SPR), #89 nlf-product-sum-numbers (SPR), #122 eqx-isolate-variable-formula (MC) [advanced-math]; #105 sys-mixture (MC) [algebra] |
| H6 | problem-solving-data + algebra + geometry-trig | #95 rat-area-unit-conversion (SPR), #115 inf-compare-estimates (MC), #125 claims-experiment-causation (MC) [problem-solving-data]; #121 ineq-system-max (SPR) [algebra]; #99 geo-similarity-criteria (MC) [geometry-trig] |

**Status 2026-10-07: COMPLETE.** All of H1–H6 are built and approved. Final set: 80 types (27 Easy / 15 Medium / 38 Hard; 55 MC / 25 SPR). See the final summary in review-log.md.

Hard totals: 30 types; 21 MC and 9 SPR. By domain: Geometry & Trig 11, Advanced Math 9, PSDA 8, Algebra 2.

## Allocation (original plan, kept for reference)

| Domain (file) | Types | Easy | Medium | Hard | MC | SPR |
| --- | --- | --- | --- | --- | --- | --- |
| Algebra (`algebra.js`) | 31 | 13 | 12 | 6 | 21 | 10 |
| Advanced Math (`advanced-math.js`) | 38 | 10 | 14 | 14 | 29 | 9 |
| Problem-Solving & Data Analysis (`problem-solving-data.js`) | 31 | 10 | 12 | 9 | 22 | 9 |
| Geometry & Trigonometry (`geometry-trig.js`) | 25 | 5 | 9 | 11 | 20 | 5 |
| **Total** | **125** | **38 (30%)** | **47 (38%)** | **40 (32%)** | **92 (74%)** | **33 (26%)** |

Types per official skill (all 19 covered):
- **Algebra:** linear equations in one variable 7, linear equations in two variables 7, linear functions 5, systems 7, inequalities 5.
- **Advanced Math:** equivalent expressions 10, nonlinear equations and systems 11, nonlinear functions 17.
- **PSDA:** ratios/rates/units 6, percentages 5, one-variable data 6, two-variable data 5, probability 4, inference/margin of error 3, evaluating claims 2.
- **Geometry & Trig:** area and volume 7, lines/angles/triangles 7, right triangles and trig 5, circles 6.

## Builder conventions (apply to every type)

1. **SAT wording.** Write stems the way College Board does: "What is the value of x?", "Which of the following…", "Which equation…", "In the xy-plane, …", "where k is a constant", "the given equation". Never write "Find…" or "Solve for…". Use commas in numbers of 1,000 or more, and write money as `\\$5.50`. Use units in the stem ("in feet", "in dollars").
2. **Build backward from the answer.** Pick the answer first (and any roots or solutions), then derive the coefficients. This avoids retry loops. If a retry loop is unavoidable, cap it (for example 50 tries) and give it a deterministic fallback.
3. **Distractors.** Every MC distractor listed below is a specific student error, computed from the same numbers. All four choices must be distinct. If two collide, perturb the parameters; never fill in a random number. As on the SAT, list numeric choices in increasing order: sort them, then set the answer letter (a small `makeChoicesSorted` helper in `js/helpers.js` is fine). Keep fixed-order choice sets (for example "Zero / Exactly one / …") in the order given.
4. **SPR answers.** Use an integer or `fracStr`, at most 5 characters (6 if negative). If a decimal is needed, the stem must say "to the nearest tenth" (or hundredth) and the answer must be rounded to match.
5. **Variety.** Rotate the stem shapes and contexts listed for each type, at least 3 contexts wherever the type uses context. The checker wants at least 30 distinct questions in 300 runs.
6. **No figures.** Describe figures in words ("Point D lies on side AB…") or give data in plain HTML `<table>`s with `<th>` headers. The app styles these.
7. **Tips (2 or more).** One tip teaches the method. Another names the classic trap or the Desmos move. Tips must teach, not just restate the answer.
8. **Desmos solution.** End with a note that states the answer. Set `degreeMode: true` for degree trig. When Desmos doesn't help, use 2–4 text notes that walk through the method. Run `node tests/check-desmos.js --only <ids>` before handing in a batch.
9. **`skill`** must be the exact official name: `Linear equations in one variable`, `Linear equations in two variables`, `Linear functions`, `Systems of two linear equations in two variables`, `Linear inequalities in one or two variables`, `Equivalent expressions`, `Nonlinear equations in one variable and systems of equations in two variables`, `Nonlinear functions`, `Ratios, rates, proportional relationships, and units`, `Percentages`, `One-variable data: Distributions and measures of center and spread`, `Two-variable data: Models and scatterplots`, `Probability and conditional probability`, `Inference from sample statistics and margin of error`, `Evaluating statistical claims: Observational studies and experiments`, `Area and volume`, `Lines, angles, and triangles`, `Right triangles and trigonometry`, `Circles`.
10. **Answer position (added after batch 1).** Over 4,000 runs, every MC type must put the key in each letter 18–32% of the time. Sorted numeric choices can hide a pattern such as "the answer is never the largest", so check the spread. In Desmos notes, never print a coefficient of 1 or −1 as "1(3)" or "-1(3)"; write "3" or "−3". *(Added after batch 2.)* When "a/an" comes before a generated number, choose the article by the number's spoken sound ("an 8%", "an 18%", "an 800-milligram", "an 11-foot"). Use a shared helper and scan the output for it.
11. **Stay inside the pattern.** Variants listed under an entry are allowed. Anything else is a different type. Do not duplicate the 15 originals in `desmos-techniques.js`, especially: slope or y-intercept from two points, reverse percent after a single change, the a-is-p%-of-b chains, center/radius → general-form coefficients, radius from a general form with a parameter p, a horizontal line meeting a parabola exactly once, other x-intercept from vertex symmetry, and growth factor per fractional step.

Source shorthand used below (each `source:` field should hold the full URL):
- **CBS** = https://satsuite.collegeboard.org/media/pdf/digital-sat-sample-questions.pdf (College Board's official samples, cited as "Q#").
- **OUT** = https://outlierlearning.substack.com/p/an-evolving-sat-data-base (type codes from College Board's question bank, e.g. PER-M-F).
- **ACE/…** = https://acely.com/desmos-guide-library/…
- **TN/…** = https://test-ninjas.com/…

## Batch plan

| Batch | # | File | Types |
| --- | --- | --- | --- |
| 1 | 1–5 | algebra | linf-evaluate-combination, linf-interpret-context, lin2-interpret-coefficient, ineq-point-satisfies, sys-word-problem |
| 2 | 6–10 | advanced-math | nlf-vertex-form-extremum, nleq-number-of-real-solutions, nlf-exp-model-from-context, nlf-form-shows-feature, nlf-exp-two-points |
| 3 | 11–15 | problem-solving-data | pct-percent-of-percent, rat-density, tvd-best-fit-prediction, stat-mean-frequency-table, pct-successive-changes |
| 4 | 16–20 | geometry-trig | geo-similar-shadows, trig-rectangle-diagonal, circ-arc-length, geo-parallel-transversal, geo-triangle-angle-sum |
| 5 | 21–25 | algebra | lin2-standard-form-features, lin2-point-on-line, sys-solve-intersection, lin2-perpendicular-line, sys-number-of-solutions |
| 6 | 26–30 | advanced-math | eqx-combine-rational, nleq-discriminant-condition, nleq-quadratic-positive-solution, nlf-factored-x-intercepts, nlf-y-intercept |
| 7 | 31–35 | problem-solving-data | rat-unit-rate-conversion, rat-proportion, prob-two-way-simple, inf-estimate-population, stat-missing-value-mean |
| 8 | 36–40 | geometry-trig | geo-rect-area-perimeter, trig-ratio-from-sides, trig-special-right, geo-isosceles-exterior-angle, geo-similar-parallel-side |
| 9 | 41–45 | algebra | lin2-shifted-line-x-intercept, sys-no-solution-constant, lin1-both-sides, lin1-solve-for-expression, lin1-word-fee-rate |
| 10 | 46–50 | advanced-math | nleq-absolute-value, nleq-linear-quadratic-system, nlf-transformation-vertex, nleq-sum-of-solutions, nleq-other-solution-from-known |
| 11 | 51–55 | problem-solving-data | pct-multiplier-to-percent, tvd-interpret-best-fit, stat-difference-medians, pct-change-between, rat-speed-conversion |
| 12 | 56–60 | geometry-trig | geo-cylinder-volume, geo-surface-area-box, circ-degrees-radians, circ-equation-from-points, geo-volume-cone-sphere |
| 13 | 61–65 | algebra | lin2-solve-for-variable, sys-create-system, ineq-solve-one-variable, lin1-fractions, lin1-number-of-solutions |
| 14 | 66–70 | advanced-math | nlf-exp-interpret-context, nlf-exp-from-table, nlf-exp-time-to-reach, nlf-exp-fractional-exponent-interpret, eqx-same-base-exponent |
| 15 | 71–75 | problem-solving-data | prob-conditional-two-way, prob-missing-count, inf-margin-of-error, claims-sample-generalize, stat-compare-sd |
| 16 | 76–80 | geometry-trig | circ-center-general-form, circ-point-inside-outside, circ-tangent-slope, trig-cofunction-angle-equation, trig-similar-triangle-ratio |
| 17 | 81–85 | algebra | lin1-break-even, lin2-model-from-context, linf-change-over-interval, linf-shifted-input, sys-solve-for-expression |
| 18 | 86–90 | advanced-math | nlf-quadratic-context-interpret, nlf-area-quadratic-model, nlf-polynomial-from-zeros, nlf-product-sum-numbers, nlf-quadratic-from-zeros-and-point |
| 19 | 91–95 | problem-solving-data | tvd-regression-from-table, tvd-linear-vs-exponential, stat-outlier-effect, rat-ratio-after-change, rat-area-unit-conversion |
| 20 | 96–100 | geometry-trig | geo-triangle-area-coordinates, geo-similar-solids-scale, geo-changed-dimensions, geo-similarity-criteria, geo-altitude-on-hypotenuse |
| 21 | 101–105 | algebra | ineq-word-max, ineq-create-from-context, lin1-constant-special, linf-transformed-intercept, sys-mixture |
| 22 | 106–110 | advanced-math | eqx-expand-binomials, eqx-subtract-polynomials, eqx-exponent-rules, eqx-factor-difference-squares, eqx-simplify-rational |
| 23 | 111–115 | problem-solving-data | pct-part-whole-shift, stat-combined-mean, tvd-average-rate-of-change, prob-fill-table-from-probability, inf-compare-estimates |
| 24 | 116–120 | advanced-math | nleq-square-root-method, nleq-quadratic-formula, nleq-radical-extraneous, nleq-rational-equation, nlf-composition |
| 25 | 121–125 | mixed* | ineq-system-max (algebra), eqx-isolate-variable-formula, eqx-rational-exponents, eqx-polynomial-division (advanced-math), claims-experiment-causation (problem-solving-data) |

\*Batch 25 holds the leftovers, since the domain counts aren't multiples of 5.

---

## Batch 1: Algebra, from College Board's official samples

**#1 · `linf-evaluate-combination` · (Easy) Evaluate a Combination of Linear Functions**
algebra.js · Linear functions · MC
- Stem: "If f(x) = x + 7 and g(x) = 7x, what is the value of 4f(2) − g(2)?" Generate f(x) = ax + b and g(x) = cx + d with a, c ∈ ±1–9 and b, d ∈ −12…12. The combination is k·f(n) ± m·g(n), where k ∈ 2–5, m ∈ 1–3 and n ∈ −5…6. Sometimes ask for f(n) + g(n) or f(n) − k·g(n).
- Answer: an integer.
- Distractors (from CBS Q1): (a) the combination without the coefficient, e.g. f(n) − g(n); (b) k applied to the x-term only, e.g. 4·2 + 7 − g(2); (c) the opposite operation, + instead of −.
- Desmos: define f(x) and g(x), then type `4f(2)-g(2)`.
- Source: CBS Q1.

**#2 · `linf-interpret-context` · (Easy) Interpret the Slope or Intercept of a Linear Model**
algebra.js · Linear functions · MC
- Stem: "The function C(n) = 25n + 100 gives the total cost, in dollars, of a video game system and n games. What is the best interpretation of 25 in this context?" Rotate what is asked: the rate, the constant, or "the slope of the graph of y = C(n)". Use at least 5 contexts, including some with a negative slope: games and a console (CBS), gym fee and months, a draining tank in liters per minute, plant height per week, taxi fare per mile, phone battery percent per hour.
- Answer: a statement in context.
- Distractors (CBS Q3): (a) the intercept's meaning given for the slope ("The system costs \$25"); (b) the right quantity with the wrong number ("Each game costs \$100"); (c) the slope's meaning with its units or roles swapped ("The system costs \$25"), or "increases" where the model decreases.
- Desmos: notes only. Explain that the rate multiplies the variable and the constant is the value at 0.
- Source: CBS Q3; TN/sat-linear-functions (pattern 4).

**#3 · `lin2-interpret-coefficient` · (Easy) Interpret a Coefficient in a Two-Variable Equation**
algebra.js · Linear equations in two variables · MC
- Stem (CBS Q5): "Figure A and figure B are both regular polygons. The sum of their perimeters is 63 inches. The equation 3x + 6y = 63 represents this situation, where x is the number of sides of figure A and y is the number of sides of figure B. Which statement is the best interpretation of 6 in this context?" Contexts: the polygons, adult and child tickets, 2-point and 3-point baskets, calories from two foods, boxes of two weights. Rotate between asking about either coefficient and the constant.
- Answer: a statement.
- Distractors: (a) the coefficient read as a count ("The number of sides of figure B is 6"); (b) the coefficient attached to the other variable; (c) the other variable read as the number ("The number of sides of figure A is 6"), or for the constant a count read as a total.
- Desmos: notes only.
- Source: CBS Q5.

**#4 · `ineq-point-satisfies` · (Easy) Which Point Satisfies the Inequality?**
algebra.js · Linear inequalities in one or two variables · MC
- Stem (CBS Q4): "y < −4x + 4. Which point (x, y) is a solution to the given inequality in the xy-plane?" Use the signs <, ≤, > and ≥, and use slope-intercept or standard form (e.g. 3x − 2y ≥ 6). In about 30% of questions, use a system of two inequalities: "…a solution to the given system".
- Answer: one point.
- Distractors: (a) a point exactly on the boundary when the inequality is strict; (b) points on the wrong side; (c) for systems, a point that satisfies only one inequality. Exactly one choice may work.
- Desmos: graph the inequality or inequalities and plot the four points. The correct point is in the shaded region (for a system, the overlap).
- Source: CBS Q4; TN/sat-linear-inequalities-in-one-or-two-variables (patterns 5–6).

**#5 · `sys-word-problem` · (Medium) Solve a System of Equations in Context**
algebra.js · Systems of two linear equations in two variables · MC
- Stem (CBS Q6): two stores, each with prices for item R and item B. "A certain purchase would cost \$37.00 at store A or \$66.00 at store B. How many pints of blackberries are in this purchase?" Prices are multiples of 0.25 or 0.50, counts are 2–15, and the coefficient matrix must not be singular. Contexts: berries at two stores, tickets on two days, two vendors' price lists, two shipping companies. Ask for either quantity.
- Answer: an integer count.
- Distractors: (a) the other variable's value (CBS); (b) the total number of items; (c) an elimination slip, such as the value from forgetting to scale a constant.
- Desmos: graph both equations, using x and y for the two counts, and click the intersection.
- Source: CBS Q6; TN/sat-systems-of-linear-equations (pattern 5).

## Batch 2: Advanced Math, from College Board's official samples

**#6 · `nlf-vertex-form-extremum` · (Easy) Maximum or Minimum from Vertex Form**
advanced-math.js · Nonlinear functions · MC
- Stem: "g(x) = −2(x − 3)² + 11. What is the maximum value of the given function?" Also use the CBS Q7 form g(x) = x² + 55 ("minimum value"). Use a ∈ ±1–5, h ∈ −9…9 and k ∈ −20…60. Rotate max/min to match the sign of a, and write `+ h` forms as well.
- Answer: k.
- Distractors (CBS Q7): (a) h, the x-value where the extremum occurs; (b) −k, or k with h's sign error; (c) k² or 2k (CBS: squared or doubled).
- Desmos: graph g and click the vertex. Its y-coordinate is the max or min.
- Source: CBS Q7; OUT (NOL-M-J).

**#7 · `nleq-number-of-real-solutions` · (Medium) How Many Real Solutions Does a Quadratic Have?**
advanced-math.js · Nonlinear equations in one variable and systems of equations in two variables · MC
- Stem (CBS Q9): "(x − 1)² = −4. How many distinct real solutions does the given equation have?" Forms: (x − h)² = k with k < 0, = 0 or > 0; ax² + bx + c = 0 (by the discriminant); ax² + c = 0; and perfect-square trinomials. Choose the true case evenly from zero, one and two. *(Revised after the batch 2 review.)* In about 1 in 6 runs, use an identity such as 3(x − 2)² = 3x² − 12x + 12, so "Infinitely many" is the key; College Board's testing point names this case. Use the same both-sides-quadratic look just as often for non-identities whose x² terms cancel ((x + 2)² = x² + 4x + 9 → zero; (x + 3)² = x² + 4x + 7 → exactly one), so the look of the equation never gives the answer away.
- Answer: fixed choices in this order: "Exactly one", "Exactly two", "Infinitely many", "Zero".
- Distractors: the other three fixed options.
- Desmos: graph y = (left side) − (right side) and count the x-intercepts.
- Source: CBS Q9; ACE/nonlinear-equations-number-of-solutions.

**#8 · `nlf-exp-model-from-context` · (Medium) Exponential Model from a Description**
advanced-math.js · Nonlinear functions · MC
- Stem: "A town's population was 18,000 in 2020 and decreases by 12% each year. Which function gives the population P(t), t years after 2020?" Variants: growth by r%; decay by r%; "doubles every 5 years" (2^(t/5)); "is halved every 8 hours". About 25% of questions use the CBS Q11 wording: "For the function f, f(0) = 86, and for each increase in x by 1, f(x) decreases by 80%. Which equation defines f?"
- Answer: an equation such as 18,000(0.88)^t.
- Distractors: (a) the rate used as the factor, 18,000(0.12)^t; (b) the wrong direction, 18,000(1.12)^t; (c) a linear model, 18,000(1 − 0.12t). For "doubles every k" variants, use 2^(kt) or 2^t as distractors.
- Desmos: graph each choice and check P(0) and P(1)/P(0).
- Source: CBS Q11; OUT (NOL-M-D); TN/sat-nonlinear-functions (pattern 5).

**#9 · `nlf-form-shows-feature` · (Medium) Which Equivalent Form Shows the Feature?**
advanced-math.js · Nonlinear functions · MC
- Stem: "f(x) = x² − 6x + 5. Which of the following is an equivalent form of the equation that displays the minimum value of f as a constant or coefficient?" All four choices are equivalent: vertex form (x − 3)² − 4, factored form (x − 1)(x − 5), standard form, and a partly factored form x(x − 6) + 5. Rotate the feature asked for: min/max value, x-intercepts, y-intercept, or the x-coordinate of the vertex. Use leading coefficients ±1, ±2 and integer roots.
- Answer: the form that matches the feature (vertex form for the extremum; factored form for the x-intercepts; standard form for the y-intercept).
- Distractors: the other three equivalent forms.
- Desmos: graph all four. They overlap, so the question is about structure: click the vertex and intercepts to see which numbers appear in which form.
- Source: CBS Q7 (testing point "Determine the most suitable form of a function to display key features"); https://www.albert.io/blog/?p=78023.

**#10 · `nlf-exp-two-points` · (Hard) Exponential Constants from Two Points**
advanced-math.js · Nonlinear functions · MC
- Stem (CBS Q8): "The function h is defined by h(x) = a^x + b, where a and b are positive constants. The graph of y = h(x) passes through (0, 10) and (−2, 325/36). What is the value of ab?" Variant: f(x) = a·b^x through (1, 12) and (3, 108); ask for f(0), f(4) or ab. Build from a ∈ 2–7 and b ∈ 2–12. Fractions must be exact.
- Answer: an integer or a reduced fraction.
- Distractors (CBS): (a) a^(−2)·b instead of ab; (b) a times the y-value of the first point, not b; (c) a + b, or the value of b alone.
- Desmos: `[a^0+b, a^{-2}+b] ~ [10, 325/36]` (list regression), then type `ab`. Or put a table of the two points and fit `y_1 ~ a b^{x_1}`.
- Source: CBS Q8; OUT (NOL-M-V).

## Batch 3: PSDA, from the official samples and the best-documented patterns

**#11 · `pct-percent-of-percent` · (Easy) Percent of a Percent**
problem-solving-data.js · Percentages · MC
- Stem (CBS Q14): "In a group, 40% of the items are red. Of all the red items in the group, 30% also have stripes. What percentage of the items in the group are red and have stripes?" Contexts: items, club members, cars that are electric, survey respondents, plants. p and q are multiples of 5, with pq/100 an integer and p + q ≤ 100.
- Answer: pq/100 %.
- Distractors (CBS): (a) p − q; (b) p + q; (c) q/p as a percent, rounded to a whole number.
- Desmos: `30% of 40`.
- Source: CBS Q14; OUT (PER-M-F).

**#12 · `rat-density` · (Medium) Density, Mass and Volume**
problem-solving-data.js · Ratios, rates, proportional relationships, and units · MC
- Stem (CBS Q15): "The density of a certain type of wood is 353 kilograms per cubic meter. A sample of this type of wood is in the shape of a cube and has a mass of 345 kilograms. To the nearest hundredth of a meter, what is the length of one edge of this sample?" Variants: density and prism dimensions → mass; mass and volume → density; population density → area or population.
- Answer: a value rounded as the stem states.
- Distractors: (a) and (b) the neighbouring roundings, e.g. 0.98 and 1.01; (c) the volume not cube-rooted, or density divided by mass instead of mass by density. For the cube variant, make all four choices distinct to 2 decimal places.
- Desmos: `\sqrt[3]{345/353}`.
- Source: CBS Q15; OUT (RAT-M-B).

**#13 · `tvd-best-fit-prediction` · (Easy) Predict with a Line of Best Fit**
problem-solving-data.js · Two-variable data: Models and scatterplots · MC
- Stem (text adaptation of CBS Q13): "A scatterplot shows the relationship between x, the [variable], and y, the [variable], for 12 [things]. The line of best fit is y = 2.4x + 13. Which of the following is closest to the y-value predicted by the line of best fit at x = 15?" Variant: "One of the data points is (15, 52). How much greater is the actual y-value than the predicted y-value?" (the residual).
- Answer: a number.
- Distractors (CBS): (a) and (b) the predictions at x − 1 and x + 1; (c) the residual given when the prediction is asked for, or the reverse.
- Desmos: graph the line and evaluate at x.
- Source: CBS Q13; OUT (SCA-E-C, SCA-E-D).

**#14 · `stat-mean-frequency-table` · (Easy) Mean from a Frequency Table**
problem-solving-data.js · One-variable data: Distributions and measures of center and spread · SPR
- Stem: an HTML table with columns Value and Frequency and 4–6 rows. "The frequency table summarizes the number of [pets] owned by each of 25 households. What is the mean number of [pets] per household?" Values 0–10, frequencies 1–12. Choose the numbers so the mean is an integer or terminates in at most 2 decimal places.
- Answer: the mean (decimal or fraction).
- Desmos: put values in x₁ and frequencies in y₁, then `total(x_1 y_1)/total(y_1)`.
- Source: ACE/one-variable-data-distributions-and-measures-of-center-and-spread-mean-from-frequency-table.

**#15 · `pct-successive-changes` · (Hard) Overall Effect of Successive Percent Changes**
problem-solving-data.js · Percentages · MC
- Stem: "The price of a jacket was increased by 20%, and then the new price was decreased by 25%. The final price is what percent of the original price?" Variants: ask for the overall percent change; give a dollar price after two discounts (\$15 marked down 10%, then another 20% → \$10.80); use three changes. Pick percents so the result is exact.
- Answer: a percent or dollar value.
- Distractors: (a) the changes added (95%, i.e. −5%, or a single 30% discount → \$10.50); (b) the decimal parts multiplied (0.20 × 0.25); (c) only one change applied.
- Desmos: `1.2·0.75` or `15·0.9·0.8`.
- Source: OUT (PER-H-L, PER-H-I); https://sat.blog.targettestprep.com/sat-percent-problems/ (successive markdowns).

## Batch 4: Geometry and Trigonometry, from College Board's official samples

**#16 · `geo-similar-shadows` · (Easy) Similar Triangles from Shadows**
geometry-trig.js · Lines, angles, and triangles · MC
- Stem (CBS Q16): "Two nearby trees are perpendicular to the ground, which is flat. One of these trees is 10 feet tall and has a shadow that is 5 feet long. At the same time, the shadow of the other tree is 2 feet long. How tall, in feet, is the other tree?" Contexts: trees, a flagpole and a person, a building and a lamp post. Sometimes give the heights and ask for a shadow (ANG-M-C). Answers are integers or halves.
- Answer: the missing length.
- Distractors (CBS): (a) the difference between the shadows; (b) the first height minus the other shadow; (c) the inverted proportion.
- Desmos: `10/5 = x/2` draws a vertical line at the answer.
- Source: CBS Q16; OUT (ANG-E-E).

**#17 · `trig-rectangle-diagonal` · (Medium) Rectangle Side from a Radical Diagonal**
geometry-trig.js · Right triangles and trigonometry · MC
- Stem (CBS Q17): "The length of a rectangle's diagonal is 5√17, and the length of the rectangle's shorter side is 5. What is the length of the rectangle's longer side?" Build from legs a < b with a² + b² = k²m, and write the diagonal as k√m in simplified radical form. Variants: ask for the area or perimeter; give the longer side and ask for the shorter one.
- Answer: an integer (or a simplified radical).
- Distractors (CBS): (a) diagonal ÷ given side (e.g. √17); (b) the diagonal used as a leg, √(d² + a²); (c) b², the length squared.
- Desmos: `\sqrt{(5\sqrt{17})^2-5^2}`.
- Source: CBS Q17; OUT (RIG-M-G).

**#18 · `circ-arc-length` · (Medium) Arc Length, Arc Measure and Circumference**
geometry-trig.js · Circles · MC
- Stem (CBS Q18): "A circle has center O, and points A and B lie on the circle. The measure of arc AB is 45° and the length of arc AB is 3 inches. What is the circumference, in inches, of the circle?" Variants: radius and central angle → arc length (in terms of π); circumference and arc length → central angle. Use angles that divide 360 evenly.
- Answer: a number, or an expression with π.
- Distractors (CBS): (a) the arc length itself; (b) 2 × arc length; (c) the arc length squared, or 180 used where 360 belongs.
- Desmos: notes, or `3·360/45`.
- Source: CBS Q18; OUT (CIR-E-A, CIR-H-O).

**#19 · `geo-parallel-transversal` · (Easy) Angles Formed by Parallel Lines and a Transversal**
geometry-trig.js · Lines, angles, and triangles · SPR
- Stem (described figure): "Lines ℓ and m are parallel and are intersected by line t. The angles with measures (5x − 12)° and (3x + 20)° are alternate interior angles. What is the value of x?" Use corresponding and alternate interior angles (equal) and same-side interior angles (supplementary). Sometimes ask for an angle's measure instead of x. Every angle must be between 1° and 179°.
- Answer: an integer.
- Desmos: type `5x-12=3x+20` (it draws a vertical line at the answer), or `=180` with the sum for supplementary angles.
- Source: OUT (ANG-E-A, ANG-M-A).

**#20 · `geo-triangle-angle-sum` · (Easy) Triangle Angle Sum with Expressions**
geometry-trig.js · Lines, angles, and triangles · MC
- Stem: "In triangle ABC, the measure of angle A is 2x°, the measure of angle B is (x + 15)°, and the measure of angle C is (3x − 21)°. What is the measure, in degrees, of angle B?" Variants: ask for x; a right triangle with two expressions; an exterior angle equal to the sum of the two remote interior angles.
- Answer: an integer.
- Distractors: (a) the value of x when an angle is asked for (or an angle when x is asked for); (b) a different angle's measure; (c) the result of using 360 instead of 180.
- Desmos: `2x+(x+15)+(3x-21)=180`, then evaluate the angle.
- Source: OUT (ANG-E-D, ANG-E-G).

## Batch 5: Algebra, with Acely-documented Desmos templates

**#21 · `lin2-standard-form-features` · (Easy) Slope and Intercepts from Standard Form**
algebra.js · Linear equations in two variables · MC
- Stem: "What is the slope of the graph of 4x − 6y = 18 in the xy-plane?" Rotate what is asked: the slope, the y-intercept as (0, b) (the CBS Q2 style), or the x-intercept as (a, 0). Choose A, B and C so intercepts are integers about 70% of the time.
- Answer: a number or a point.
- Distractors: for slope, (a) A/B (sign lost), (b) −B/A (reciprocal), (c) C/B. For intercepts, (a) coordinates swapped, (b) a sign error, (c) the other intercept.
- Desmos: graph the equation and click the intercepts. For the slope, click two lattice points.
- Source: CBS Q2; ACE/linear-equations-in-2-variables-x-intercept.

**#22 · `lin2-point-on-line` · (Easy) Missing Coordinate of a Point on a Line**
algebra.js · Linear equations in two variables · SPR
- Stem: "The point (4, k) lies on the graph of 3x − 2y = 6 in the xy-plane. What is the value of k?" Variants: (k, 9) on a line, asking for the x-coordinate; slope-intercept form with a fractional slope. Pick the point first.
- Answer: an integer.
- Desmos: graph the line and x = 4, then click the intersection.
- Source: ACE/linear-equations-in-2-variables-point-on-a-line-spr.

**#23 · `sys-solve-intersection` · (Easy) Solve a Linear System**
algebra.js · Systems of two linear equations in two variables · SPR
- Stem: "3x + 2y = 16 and x − 2y = 0. The solution to the given system of equations is (x, y). What is the value of x?" Ask for x or y. Forms: ready for elimination, one equation solved for y (substitution), or one equation with a fractional coefficient. Use integer solutions in −12…12.
- Answer: an integer.
- Desmos: graph both equations and click the intersection.
- Source: ACE/linear-systems-of-equations-point-of-intersection-solution-spr.

**#24 · `lin2-perpendicular-line` · (Medium) Equation of a Perpendicular Line**
algebra.js · Linear equations in two variables · MC
- Stem: "Line ℓ is defined by 3x − 4y = 8. Line p is perpendicular to line ℓ and passes through the point (6, −1). Which equation defines line p?" Variants: ℓ in slope-intercept form; ℓ given by two points; p "passes through the y-intercept of …" Choose numbers so p's intercept is an integer.
- Answer: an equation in slope-intercept form.
- Distractors (each passes through the given point): (a) the parallel slope; (b) the negated slope without the reciprocal; (c) the reciprocal slope without the negative.
- Desmos: graph ℓ, the point and each choice. The correct line meets ℓ at a right angle and passes through the point.
- Source: ACE/linear-equations-in-2-variables-perpendicular-line.

**#25 · `sys-number-of-solutions` · (Medium) Number of Solutions of a Linear System**
algebra.js · Systems of two linear equations in two variables · MC
- Stem: "How many solutions does the given system of equations have? y = (3/2)x − 4 and 6x − 4y = 16". Write one equation in slope-intercept form and the other in scaled standard form, so students must compare slopes and intercepts. Choose the true case evenly from zero, one and infinitely many.
- Answer: fixed choices in this order: "Exactly one", "Exactly two", "Infinitely many", "Zero".
- Distractors: the other fixed options.
- Desmos: graph both lines. They are either parallel, the same line, or crossing.
- Source: ACE/linear-systems-of-equations-number-of-solutions.

## Batch 6: Advanced Math

**#26 · `eqx-combine-rational` · (Hard) Add or Subtract Rational Expressions**
advanced-math.js · Equivalent expressions · MC
- Stem (CBS Q10): "Which expression is equivalent to 4/(4x − 5) − 1/(x + 1)?" Two linear denominators with no common factor. Rotate between sum and difference and choose numerators so the combined numerator is a constant or simple linear term.
- Answer: one fraction over the product of the denominators.
- Distractors: (a) numerators and denominators combined separately (3/(3x − 6)); (b) the negative not distributed (the numerator's sign error); (c) the right denominator with an unexpanded or wrong numerator.
- Desmos: graph the original and the four choices. Only the correct one overlaps.
- Source: CBS Q10.

**#27 · `nleq-discriminant-condition` · (Hard) Constant That Gives No (or Two) Real Solutions**
advanced-math.js · Nonlinear equations in one variable and systems of equations in two variables · MC
- Stem: "In the given equation, c is a constant: 2x² + 8x + c = 0. The equation has no real solutions. Which of the following could be the value of c?" Variants: "exactly two real solutions"; an unknown middle coefficient, "x² + bx + 16 = 0 has no real solutions" (|b| < 8). Choices are numbers. Exactly one satisfies the condition.
- Answer: a value on the correct side of the threshold.
- Distractors: (a) the threshold itself (gives exactly one solution); (b) a value on the wrong side; (c) a negative value, or one from a sign-flipped inequality.
- Desmos: put a slider on c and watch when the parabola stops touching, or starts crossing, the x-axis.
- Source: CBS Q12 (discriminant testing point); ACE/nonlinear-equations-number-of-solutions.

**#28 · `nleq-quadratic-positive-solution` · (Easy) Positive Solution of a Factorable Quadratic**
advanced-math.js · Nonlinear equations in one variable and systems of equations in two variables · SPR
- Stem: "What is the positive solution to the given equation? x² − 3x − 28 = 0". Forms: monic; leading coefficient 2–6 (one root a simple fraction); not in standard form ("x(x + 5) = 24", "2x² = 7x + 15"). Build from one positive root and one negative root.
- Answer: an integer or fraction.
- Desmos: graph y = (left side) − (right side) and click the positive x-intercept.
- Source: ACE/nonlinear-equations-solutions-for-quadratic.

**#29 · `nlf-factored-x-intercepts` · (Easy) x-Intercepts from Factored Form**
advanced-math.js · Nonlinear functions · MC
- Stem: "The function f is defined by f(x) = (x − 5)(2x + 3). Which of the following is an x-intercept of the graph of y = f(x) in the xy-plane?" Variants: a cubic x(x − a)(x + b); a negative leading coefficient. Exactly one choice is a true intercept.
- Answer: a point (r, 0).
- Distractors: (a) a root with its sign flipped, (−5, 0); (b) a root with the coefficient ignored, (−3, 0) or (3/2, 0); (c) the y-intercept written as a point, (0, −15).
- Desmos: graph f and click the x-intercepts.
- Source: OUT (NOL-M-U); ACE/nonlinear-functions-x-intercept.

**#30 · `nlf-y-intercept` · (Easy) y-Intercept of a Nonlinear Function**
advanced-math.js · Nonlinear functions · SPR
- Stem: "The function f is defined by f(x) = 4(3)^x − 7. The graph of y = f(x) in the xy-plane has a y-intercept at (0, b). What is the value of b?" Forms: a·b^x + c (the trap is that b^0 = 1); a(x − p)(x + q); k(x − p)(x − q)(x − r); a(x − h)² + k.
- Answer: an integer (may be negative).
- Desmos: graph f and click the y-intercept, or type f(0).
- Source: ACE/nonlinear-functions-y-intercept; OUT (NOL-M-Y).

## Batch 7: PSDA

**#31 · `rat-unit-rate-conversion` · (Easy) Unit Rate with a Time Conversion**
problem-solving-data.js · Ratios, rates, proportional relationships, and units · SPR
- Stem: "A machine fills 18 bottles per minute. At this rate, how many bottles does the machine fill in 2.5 hours?" Contexts: bottles, printer pages per second, a pump in gallons per minute, a typist in words per minute. Variant: a rate per hour, asking for minutes needed. The answer is an integer of 5 digits or fewer.
- Answer: an integer.
- Desmos: `18·60·2.5`.
- Source: OUT (RAT-E-A, RAT-E-C).

**#32 · `rat-proportion` · (Easy) Set Up and Solve a Proportion**
problem-solving-data.js · Ratios, rates, proportional relationships, and units · MC
- Stem: "A recipe uses 3 cups of flour for every 8 muffins. How many cups of flour are needed to make 20 muffins?" Contexts: recipes, map scale ("2 inches represent 15 miles"), a model's scale, medicine dosage per kilogram, fuel per mile. Answers are integers or halves.
- Answer: a number.
- Distractors: (a) the inverted ratio; (b) additive reasoning (3 + (20 − 8)); (c) the cross-product mistake, e.g. 3 × 20.
- Desmos: `3/8 = x/20`.
- Source: OUT (RAT-E-B).

**#33 · `prob-two-way-simple` · (Easy) Probability from a Two-Way Table**
problem-solving-data.js · Probability and conditional probability · MC
- Stem: an HTML two-way table (e.g. grade 10/11/12 × prefers A/B, with row and column totals). "If one of these students is selected at random, what is the probability that the student [prefers B] / [is in grade 11 and prefers B]?" Contexts: students, survey respondents, cars by color and type, plants by height and soil.
- Answer: a fraction (give it in the same form the choices use).
- Distractors: (a) divided by a row or column total instead of the grand total; (b) the complement; (c) part over the other part (odds).
- Desmos: notes only.
- Source: OUT (PRO-E-B, PRO-E-C).

**#34 · `inf-estimate-population` · (Easy) Estimate a Population Count from a Random Sample**
problem-solving-data.js · Inference from sample statistics and margin of error · SPR
- Stem: "A random sample of 200 of the 5,000 students at a university were asked whether they bike to campus. Of these, 36 said yes. Based on the sample, about how many of the 5,000 students bike to campus?" Variant: the sample result given as a percent. Numbers are chosen so the estimate is exact.
- Answer: an integer.
- Desmos: `36/200·5000`.
- Source: OUT (FER-E-A, FER-E-B).

**#35 · `stat-missing-value-mean` · (Easy) Missing Value from a Known Mean**
problem-solving-data.js · One-variable data: Distributions and measures of center and spread · SPR
- Stem: "The mean of 6 numbers is 15. Five of the numbers are 12, 18, 9, 21 and 14. What is the sixth number?" Variants: test scores ("What score on the fifth test makes the mean 88?"); the mean of n values is m, a value is added, and the new mean is m′.
- Answer: an integer.
- Desmos: `(12+18+9+21+14+x)/6=15`.
- Source: OUT (DIS-M-D, DIS-E-C).

## Batch 8: Geometry and Trigonometry

**#36 · `geo-rect-area-perimeter` · (Easy) Rectangle: Area and Perimeter**
geometry-trig.js · Area and volume · SPR
- Stem: "A rectangle has an area of 96 square inches and a length of 12 inches. What is the perimeter, in inches, of the rectangle?" Variants: perimeter and one side → area; a square's area → perimeter; "the length is 3 times the width and the perimeter is 64" → area.
- Answer: an integer.
- Desmos: notes and arithmetic.
- Source: OUT (AAV-E-B, AAV-E-D, AAV-E-A).

**#37 · `trig-ratio-from-sides` · (Easy) Trig Ratio from Side Lengths**
geometry-trig.js · Right triangles and trigonometry · MC
- Stem: "In right triangle ABC, angle C is a right angle, AC = 5, BC = 12 and AB = 13. What is the value of cos A?" Rotate the function and the angle. In about a third of questions ask for sin B or cos B, which tests the complementary-angle relationship. Use scaled Pythagorean triples. Sometimes give only two sides, so the third must be found first.
- Answer: a fraction.
- Distractors: (a) the ratio of the other function (sin A for cos A); (b) tan A; (c) the reciprocal (hypotenuse over adjacent).
- Desmos: notes (SOH-CAH-TOA, the side names relative to angle A).
- Source: OUT (RIG-E-B, RIG-M-C); TN/sat-trigonometry.

**#38 · `trig-special-right` · (Medium) Special Right Triangles**
geometry-trig.js · Right triangles and trigonometry · MC
- Stem: "In a right triangle, one acute angle measures 60° and the side opposite that angle has length 9√3. What is the length of the hypotenuse?" Variants: 30-60-90 (any side → another side); 45-45-90 ("the diagonal of a square is 12√2; what is the side length?"); the height of an equilateral triangle from its side or perimeter (RIG-H-E).
- Answer: an integer or simplified radical.
- Distractors: (a) the √2 ratio used for a 30-60-90 triangle (or the reverse); (b) multiplied where it should divide by √3; (c) the short leg given for the hypotenuse.
- Desmos: notes and arithmetic.
- Source: OUT (RIG-M-H, RIG-H-E); TN/sat-trigonometry (patterns 3–4).

**#39 · `geo-isosceles-exterior-angle` · (Medium) Isosceles Triangle and an Exterior Angle**
geometry-trig.js · Lines, angles, and triangles · MC
- Stem (described): "In triangle PQR, PQ = PR and the measure of angle P is 40°. Side QR is extended through R to point S. What is the measure, in degrees, of angle PRS?" Variants: a base angle given → the vertex angle; an exterior angle given → the vertex angle; the sides PQ = QR (so the equal angles change).
- Answer: an integer.
- Distractors: (a) the base angle (70); (b) the exterior angle at the vertex (140); (c) the base angle computed as 180 − 2·40 (100).
- Desmos: notes only.
- Source: OUT (ANG-E-B, ANG-M-G, ANG-E-I).

**#40 · `geo-similar-parallel-side` · (Medium) Parallel Segment Inside a Triangle**
geometry-trig.js · Lines, angles, and triangles · MC
- Stem (described): "In triangle ABC, point D lies on AB and point E lies on AC such that DE is parallel to BC. If AD = 6, DB = 4 and DE = 9, what is the length of BC?" Variants: find DB given BC; find AE given AC and the ratio AD : DB.
- Answer: a number (integer or .5).
- Distractors: (a) DB/AD used for AD/AB (9·4/6); (b) AD/DB (9·6/4); (c) additive reasoning, DE + DB.
- Desmos: `6/(6+4) = 9/x`.
- Source: OUT (ANG-M-J, ANG-H-I).

## Batch 9: Algebra

**#41 · `lin2-shifted-line-x-intercept` · (Hard) x-Intercept After Translating a Line**
algebra.js · Linear equations in two variables · SPR
- Stem (a real College Board item): "The graph of 9x − 10y = 19 is translated down 4 units in the xy-plane. What is the x-coordinate of the x-intercept of the resulting graph?" (answer 59/9). Translate up, down, left or right. Write the line in standard or slope-intercept form. Answers are often fractions.
- Answer: `fracStr`.
- Desmos: graph the shifted line `9x-10(y+4)=19` and click its x-intercept.
- Source: ACE/linear-equations-in-2-variables-x-intercept-translation-spr.

**#42 · `sys-no-solution-constant` · (Hard) Constant That Makes a System Have No Solution**
algebra.js · Systems of two linear equations in two variables · SPR
- Stem: "In the given system of equations, k is a constant: 3x − 5y = 12 and kx + 15y = 7. If the system has no solution, what is the value of k?" (k = −9). Variant (about 30%): "infinitely many solutions — what is the value of c?", where c is the constant term. Confirm that the constants are not proportional in the no-solution case.
- Answer: an integer or fraction (may be negative).
- Desmos: put a slider on k and drag until the lines are parallel.
- Source: ACE/linear-systems-of-equations-no-solutions-w-slider-spr.

**#43 · `lin1-both-sides` · (Easy) Solve a Linear Equation with Variables on Both Sides**
algebra.js · Linear equations in one variable · SPR
- Stem: "What value of x is the solution to the given equation? 7x − 12 = 3x + 20". Shapes: ax + b = cx + d; a(x + b) = cx + d; a(x + b) + c = d(x + e). Use integer coefficients only (fractions belong to #64). Choose x first, in −15…15.
- Answer: an integer.
- Desmos: type the equation as given (it draws a vertical line at the solution), or graph each side and click the intersection.
- Source: ACE/linear-equations-in-1-variable-solving-by-splitting-equation-method-2.

**#44 · `lin1-solve-for-expression` · (Easy) Value of an Expression from a Linear Equation**
algebra.js · Linear equations in one variable · MC
- Stem: "If 3x + 5 = 20, what is the value of 6x + 4?" The target is a multiple of the left side plus or minus an adjustment, or a shift such as x − 2.
- Answer: an integer.
- Distractors: (a) the value of x; (b) the multiple of the right side without the adjustment (40); (c) the multiple of x alone (30).
- Desmos: `3x+5=20` gives x, then evaluate the target. Tip: scale the whole equation instead of solving for x.
- Source: TN/sat-linear-equations-in-one-variable (trap: "solving for the wrong quantity").

**#45 · `lin1-word-fee-rate` · (Easy) Flat Fee Plus Rate Word Problem**
algebra.js · Linear equations in one variable · MC
- Stem: "A plumber charges a one-time fee of \$75 plus \$60 per hour of work. A customer's total bill was \$345. For how many hours did the plumber work?" Contexts (5 or more): a plumber, a truck rental per mile, a bike rental per hour, a phone plan per GB, a catering fee per guest. Units are 2–20 (halves allowed for hours).
- Answer: a number.
- Distractors: (a) total/rate (the fee ignored); (b) (total + fee)/rate; (c) the fee and rate swapped, (total − rate)/fee. If a distractor isn't a whole number or tenth, use the off-by-one value instead.
- Desmos: `75+60x=345`.
- Source: TN/sat-linear-equations-in-one-variable (pattern 4).

## Batch 10: Advanced Math

**#46 · `nleq-absolute-value` · (Medium) Absolute Value Equation**
advanced-math.js · Nonlinear equations in one variable and systems of equations in two variables · SPR
- Stem: "|2x − 7| = 11. What is the sum of the solutions to the given equation?" Rotate the ask: sum, positive solution, or greater solution. Variant: a|x − h| + c = k.
- Answer: an integer or fraction.
- Desmos: graph y = |2x − 7| and y = 11 and click both intersections.
- Source: ACE/nonlinear-equations-absolute-value-solutions.

**#47 · `nleq-linear-quadratic-system` · (Medium) Intersection of a Line and a Parabola**
advanced-math.js · Nonlinear equations in one variable and systems of equations in two variables · MC
- Stem: "y = x² − 4x + 1 and y = 2x − 7. If (x, y) is a solution to the system, which of the following could be the value of x?" Build from two distinct roots r₁ ≠ r₂. This is never a tangent case; the "exactly one point" types already exist. Variant: ask "which could be y".
- Answer: one root.
- Distractors: (a) the y-value of a solution; (b) a root with its sign flipped; (c) a root of the wrong combination (line added instead of subtracted).
- Desmos: graph both and click the intersections.
- Source: ACE/nonlinear-equations-systems-of-equations-solution-for-x.

**#48 · `nlf-transformation-vertex` · (Medium) Translate a Function's Graph**
advanced-math.js · Nonlinear functions · MC
- Stem: "The function f is defined by f(x) = (x − 2)² + 5. What is the vertex of the graph of y = f(x + 4) − 1?" Variants: f described only by its vertex or x-intercepts; "Which equation represents y = x² shifted 3 units right and 2 units down?"; an exponential f(x) = 2^x shifted (ask for the y-intercept).
- Answer: a point or an equation.
- Distractors: (a) the horizontal shift in the wrong direction; (b) the vertical shift in the wrong direction; (c) the shifts swapped between x and y.
- Desmos: define f, graph f(x+4)−1 and click the vertex.
- Source: ACE/nonlinear-functions-translate-function-with-constant-spr; https://www.kaptest.com/study/psat/psat-math-function-behavior-and-transformations/.

**#49 · `nleq-sum-of-solutions` · (Hard) Sum of the Solutions of a Quadratic**
advanced-math.js · Nonlinear equations in one variable and systems of equations in two variables · SPR
- Stem: "What is the sum of the solutions to (x − 4)(2x + 3) = 5x − 1?" (rearrange to 2x² − 10x − 11 = 0, sum 5). Use forms that must be rearranged and are not factorable, so −b/a is the efficient method. Variant: ask for the product of the solutions.
- Answer: an integer or fraction.
- Desmos: graph y = (left side) − (right side), click both zeros and add them. Note that −b/a is exact.
- Source: ACE/nonlinear-equations-solutions-for-quadratic.

**#50 · `nleq-other-solution-from-known` · (Hard) Use a Known Solution to Find a Constant**
advanced-math.js · Nonlinear equations in one variable and systems of equations in two variables · SPR
- Stem: "In the equation x² + ax − 24 = 0, a is a constant. If 3 is a solution, what is the other solution?" Variants: ask for a; a non-monic ax² − 10x + 3 = 0 with solution 1 (other solution 3/7).
- Answer: an integer or fraction.
- Desmos: put a slider on a until the graph crosses at x = 3, then read the other zero. Note that the product of the roots is c/a.
- Source: ACE/nonlinear-equations-solution-with-constant (tagged Hard).

## Batch 11: PSDA

**#51 · `pct-multiplier-to-percent` · (Easy) Read a Percent Change from a Multiplier**
problem-solving-data.js · Percentages · MC
- Stem: "The equation y = 1.35x relates the positive numbers x and y. Which of the following statements is true?" Multipliers 1.05–2.5 or 0.15–0.95. Context variant: "Each year, a car's value is 0.85 times its value the previous year."
- Answer: "y is 35% greater than x" (or "y is 28% less than x" for 0.72).
- Distractors: (a) "135% greater"; (b) the wrong direction ("35% less"); (c) "1.35% greater". Never include a true statement such as "y is 135% of x" as a distractor.
- Desmos: notes only.
- Source: OUT (PER-M-E, PER-H-M).

**#52 · `tvd-interpret-best-fit` · (Easy) Interpret a Line of Best Fit**
problem-solving-data.js · Two-variable data: Models and scatterplots · MC
- Stem: "The line of best fit for the data is y = 0.52x + 18, where x is the number of hours studied and y is the test score. Which is the best interpretation of 0.52?" (or of 18). Contexts: study hours, temperature and sales, age and value, distance and fare. "Weird axes" variant: x in thousands.
- Answer: "For each additional hour, the predicted score increases by 0.52 points."
- Distractors: (a) "actual" in place of "predicted" ("every student's score increases by exactly…"); (b) the intercept's meaning; (c) the variable roles reversed.
- Desmos: notes only.
- Source: OUT (SCA-E-D, SCA-M-A, SCA-M-C).

**#53 · `stat-difference-medians` · (Medium) Difference Between Two Medians**
problem-solving-data.js · One-variable data: Distributions and measures of center and spread · SPR
- Stem: two unsorted lists (7–10 values each; one has an even count): "Data set A: … Data set B: … What is the positive difference between the median of data set A and the median of data set B?" Context: scores of two classes, prices at two stores.
- Answer: an integer or .5.
- Desmos: `median([…])-median([…])`.
- Source: ACE/one-variable-data-distributions-and-measures-of-center-and-spread-difference-between-medians-spr.

**#54 · `pct-change-between` · (Medium) Percent Increase or Decrease Between Two Values**
problem-solving-data.js · Percentages · MC
- Stem: "The price of a jacket increased from \$40 to \$52. By what percent did the price increase?" In about 40% of questions, the values come from an HTML table (e.g. sales by year): "What was the percent decrease from 2019 to 2021?" The correct percent is a whole number.
- Answer: a percent.
- Distractors: (a) the change divided by the new value; (b) new/old as a percent (130%); (c) the raw change written as a percent (12%).
- Desmos: `(52-40)/40·100`.
- Source: OUT (PER-M-H, PER-E-A).

**#55 · `rat-speed-conversion` · (Medium) Convert a Rate Between Units**
problem-solving-data.js · Ratios, rates, proportional relationships, and units · MC
- Stem: "A car travels at a speed of 66 feet per second. What is this speed in miles per hour? (1 mile = 5,280 feet)" Variants: km/h ↔ m/s; gallons per minute → liters per hour (factor given); inches per second → feet per minute.
- Answer: a number.
- Distractors: (a) one conversion inverted; (b) the time conversion skipped; (c) the distance conversion skipped.
- Desmos: `66·3600/5280`.
- Source: OUT (RAT-M-A, RAT-M-D).

## Batch 12: Geometry and Trigonometry

**#56 · `geo-cylinder-volume` · (Medium) Cylinder Dimensions from Volume**
geometry-trig.js · Area and volume · MC
- Stem: "A right circular cylinder has a volume of 360π cubic centimeters and a height of 10 centimeters. What is the diameter, in centimeters, of the base?" Rotate the ask: radius, diameter or height. Variant: the volume as a decimal with "to the nearest tenth".
- Answer: a number.
- Distractors: (a) radius and diameter swapped; (b) r² (the square root forgotten); (c) V/(2πh).
- Desmos: `360\pi = \pi r^2 \cdot 10` (put a slider on r), or notes.
- Source: OUT (AAV-M-A, AAV-M-G).

**#57 · `geo-surface-area-box` · (Medium) Surface Area of a Prism or Cube**
geometry-trig.js · Area and volume · MC
- Stem: "A rectangular prism has length 6 inches, width 4 inches and height 3 inches. What is the surface area, in square inches?" Variant (AAV-H-K): "A cube has a surface area of 150 square inches. What is its volume?"
- Answer: an integer.
- Distractors: for the prism, (a) the volume, (b) lw + lh + wh (half the surface area), (c) only 4 faces. For the cube, (a) one face's area, (b) the edge length, (c) SA/4.
- Desmos: notes only.
- Source: OUT (AAV-H-F, AAV-H-K).

**#58 · `circ-degrees-radians` · (Medium) Convert Between Degrees and Radians**
geometry-trig.js · Circles · SPR
- Stem: "An angle has a measure of 3π/4 radians. What is the measure of the angle, in degrees?" Variants: "135° is equal to kπ radians; what is k?"; "an arc of length s on a circle of radius r subtends a central angle of how many degrees?" (CIR-M-C).
- Answer: integer degrees, or k as a fraction.
- Desmos: `3\pi/4·180/\pi`.
- Source: OUT (CIR-M-C, CIR-M-D).

**#59 · `circ-equation-from-points` · (Medium) Circle Equation from Its Center and a Point**
geometry-trig.js · Circles · MC
- Stem: "A circle in the xy-plane has center (−2, 5) and passes through the point (4, 13). Which equation represents this circle?" Variant: the endpoints of a diameter (center = midpoint, r = half the distance). Use Pythagorean triples so r is an integer.
- Answer: (x + 2)² + (y − 5)² = 100.
- Distractors: (a) r instead of r² on the right side; (b) the center's signs flipped; (c) the diameter² (or the full distance²) used.
- Desmos: graph each choice with the given point(s). The correct circle is centered right and passes through the point.
- Source: OUT (CIR-M-A); ACE/circles-coordinates-of-diameter.

**#60 · `geo-volume-cone-sphere` · (Hard) Cone and Sphere Volume**
geometry-trig.js · Area and volume · MC
- Stem: "A right circular cone has a volume of 96π cubic centimeters and a base radius of 6 centimeters. What is the height, in centimeters?" Variants: a sphere with volume 288π → diameter; a hemisphere; a cone's radius from its volume and height. The formulas come from the SAT reference sheet; the stem may restate them.
- Answer: an integer.
- Distractors: (a) the ⅓ forgotten; (b) radius and diameter swapped; (c) for spheres, the cube root not taken (r³).
- Desmos: `\frac{1}{3}\pi\cdot6^2x=96\pi`.
- Source: OUT (AAV-H-D).

## Batch 13: Algebra

**#61 · `lin2-solve-for-variable` · (Easy) Express One Variable in Terms of the Other**
algebra.js · Linear equations in two variables · MC
- Stem: "The given equation relates the variables x and y: 5x + 2y = 40. Which equation correctly expresses y in terms of x?" Sometimes in context: "A budget of \$40 is spent on x notebooks at \$5 and y pens at \$2…"
- Answer: y = 20 − (5/2)x.
- Distractors: (a) y = 40 − 5x (forgot to divide); (b) y = 20 + (5/2)x (sign); (c) the equation solved for x instead.
- Desmos: graph the original and each choice. The correct one overlaps.
- Source: TN/sat-linear-equations-in-two-variables (pattern 1).

**#62 · `sys-create-system` · (Easy) Write the System for a Context**
algebra.js · Systems of two linear equations in two variables · MC
- Stem: "A florist sold 40 flowers, all roses or tulips, for a total of \$104. Roses cost \$3 each and tulips cost \$2 each. Which system of equations represents this situation, where r is the number of roses and t is the number of tulips?" Contexts: flowers, adult and child tickets, small and large boxes, two coin types. Each choice shows two equations on two lines.
- Answer: r + t = 40 and 3r + 2t = 104.
- Distractors: (a) the two totals swapped; (b) the prices attached to the wrong variables; (c) r − t in place of r + t.
- Desmos: notes. Optionally graph the correct system to see a whole-number solution.
- Source: TN/sat-systems-of-linear-equations (pattern 5); CBS Q6.

**#63 · `ineq-solve-one-variable` · (Easy) Solve a Linear Inequality**
algebra.js · Linear inequalities in one or two variables · MC
- Stem: "Which of the following is the solution to the given inequality? −3(x − 2) ≥ 2x + 11". Variants: a negative coefficient that forces a flip; a compound inequality −1 ≤ 3x + 2 < 11.
- Answer: x ≤ −1.
- Distractors: (a) the sign not flipped; (b) a distribution error with the negative (−3x − 6); (c) the sign flipped while dividing by a positive.
- Desmos: graph y = (left side) and y = (right side) and read where one is above the other, or type the inequality in x to see the shaded region.
- Source: TN/sat-linear-inequalities-in-one-or-two-variables (patterns 1–3).

**#64 · `lin1-fractions` · (Medium) Linear Equation with Fractions**
algebra.js · Linear equations in one variable · MC
- Stem: "(x + 4)/3 = (2x − 1)/5. What is the value of x?" Shapes: two fractional sides; x/4 + x/6 = 10; (2/3)(x − 6) = (1/4)x + 1. The solution is an integer.
- Answer: an integer.
- Distractors: (a) the constant not multiplied by the LCD; (b) cross-multiplied without distributing; (c) a sign slip when moving terms. Check that all three are distinct; use ±1 off the answer as a fallback.
- Desmos: type the equation (it draws a vertical line).
- Source: TN/sat-linear-equations-in-one-variable (trap: "fraction multiplication error").

**#65 · `lin1-number-of-solutions` · (Medium) How Many Solutions Does a Linear Equation Have?**
algebra.js · Linear equations in one variable · MC
- Stem: "How many solutions does the given equation have? 4(3x − 5) + 2 = 12x − 18". Both sides need simplifying. Choose the true case evenly from zero, one and infinitely many.
- Answer: fixed choices in this order: "Exactly one", "Exactly two", "Infinitely many", "Zero".
- Distractors: the other fixed options.
- Desmos: graph y = (left side) and y = (right side). They are parallel, identical or crossing.
- Source: TN/sat-linear-equations-in-one-variable (pattern 3).

## Batch 14: Advanced Math, exponential functions

**#66 · `nlf-exp-interpret-context` · (Easy) Interpret an Exponential Model**
advanced-math.js · Nonlinear functions · MC
- Stem: "The function P(t) = 2,400(1.06)^t models the population of a town t years after 2015. What is the best interpretation of 2,400 in this context?" (or of 1.06). Contexts: population, an investment, bacteria, a car's value (0.85), medicine in the bloodstream (0.7).
- Answer: a statement.
- Distractors: for the rate, (a) "increases by 106% each year", (b) "increases by 1.06% each year", (c) "increases by 6 people each year". For the initial value, (a) the population after one year, (b) the increase per year, (c) the population in a later year.
- Desmos: notes only.
- Source: OUT (NOL-E-D, NOL-M-X); https://www.albert.io/blog/?p=78023.

**#67 · `nlf-exp-from-table` · (Medium) Exponential Function from a Table**
advanced-math.js · Nonlinear functions · MC
- Stem: an HTML table x: 0, 1, 2, 3 with f(x): 5, 15, 45, 135. "For the exponential function f, the table shows four values of x and their corresponding values of f(x). Which equation defines f?" Variants: decreasing values (ratio 1/2 or 1/3); a table that starts at x = 1 (so a = f(1)/b).
- Answer: f(x) = 5(3)^x.
- Distractors: (a) base and coefficient swapped, 3(5)^x; (b) f(1) used as the initial value, 15(3)^x; (c) the linear model from the first difference, 10x + 5.
- Desmos: put the table in and fit `y_1 \sim a b^{x_1}`.
- Source: OUT (NOL-M-C, NOL-M-I).

**#68 · `nlf-exp-time-to-reach` · (Medium) When Does an Exponential Model Reach a Value?**
advanced-math.js · Nonlinear functions · SPR
- Stem: "The function f(t) = 50(2)^(t/6) gives the number of bacteria in a sample t hours after an experiment begins. After how many hours will there be 400 bacteria?" Variants: halving (decay to a target), tripling, an investment that doubles every k years. Build the target as a·bⁿ so t is an integer.
- Answer: an integer.
- Desmos: graph y = 50·2^(x/6) and y = 400 and click the intersection.
- Source: OUT (NOL-M-K).

**#69 · `nlf-exp-fractional-exponent-interpret` · (Hard) Interpret an Exponent of the Form t/k**
advanced-math.js · Nonlinear functions · MC
- Stem: "The function f(t) = 1,000(0.84)^(t/3) gives the value, in dollars, of an item t years after it was purchased. Which of the following best describes how the value changes?" Variants: 1.08^(t/2) (increases 8% every 2 years); 2^(t/5) (doubles every 5 years); (1/2)^(t/12) (half-life of 12). This interprets the statement. It does not compute a factor per step from given equivalent forms, which the original "Exponential Coefficients" does.
- Answer: "It decreases by 16% every 3 years."
- Distractors: (a) "decreases by 84% every 3 years"; (b) "decreases by 16% every year"; (c) "decreases by about 5.3% every year" (16/3).
- Desmos: graph f and check f(3)/f(0) and f(1)/f(0).
- Source: OUT (NOL-M-E, NOL-M-X).

**#70 · `eqx-same-base-exponent` · (Hard) Equations with Exponents on a Common Base**
advanced-math.js · Equivalent expressions · SPR
- Stem: "If 8^(2x)/2^x = 2^30, what is the value of x?" Variants: 9^(x + 2) = 27^(x − 1); 4^a·2^b = 2^20 with b given; (25^x)(5^3) = 125^2.
- Answer: an integer or fraction.
- Desmos: graph y = (left side) and y = (right side) and click the intersection (zoom as needed).
- Source: OUT (EQE-H-A, "same base, equations in exponent").

## Batch 15: PSDA, probability and statistics

**#71 · `prob-conditional-two-way` · (Medium) Conditional Probability from a Two-Way Table**
problem-solving-data.js · Probability and conditional probability · MC
- Stem: an HTML two-way table with totals. "If a student is selected at random from those who prefer B, what is the probability that the student is in grade 11?" Rotate the condition between rows and columns.
- Answer: a fraction.
- Distractors: (a) divided by the grand total; (b) the condition reversed (divided by the grade 11 total); (c) the complement within the condition.
- Desmos: notes only.
- Source: OUT (PRO-M-A, PRO-M-B).

**#72 · `prob-missing-count` · (Medium) Find a Count from a Probability**
problem-solving-data.js · Probability and conditional probability · SPR
- Stem: "A bag contains only red, blue and green marbles. There are 12 red marbles and 18 blue marbles. If one marble is selected at random, the probability that it is green is 1/4. How many green marbles are in the bag?" Variants: the probability as a decimal or percent; how many blue marbles must be added to make P(blue) = 1/2.
- Answer: an integer.
- Desmos: `x/(30+x)=1/4`.
- Source: OUT (PRO-M-D, PRO-E-H).

**#73 · `inf-margin-of-error` · (Medium) Interpret a Margin of Error**
problem-solving-data.js · Inference from sample statistics and margin of error · MC
- Stem: "A random sample of 400 residents of a city found a mean commute time of 24.5 minutes, with an associated margin of error of 2.1 minutes. Which of the following is the most appropriate conclusion?" Variant: a proportion with a percent margin, asking "which value is a plausible proportion".
- Answer: "It is plausible that the mean commute time of all residents of the city is between 22.4 and 26.6 minutes."
- Distractors: (a) "every resident commutes between…" (individuals, not the mean); (b) "the mean commute time of all residents is exactly 24.5"; (c) a claim about another city, or a value outside the interval.
- Desmos: notes only.
- Source: OUT (FER-E-D, FER-E-E, FER-M-B).

**#74 · `claims-sample-generalize` · (Medium) Generalize from a Sample**
problem-solving-data.js · Evaluating statistical claims: Observational studies and experiments · MC
- Stem: "A researcher selected 300 members at random from a gym's member list and asked about their preferred workout time. 62% preferred mornings. To which population can the results most appropriately be generalized?" Variant (30%): a biased sample (volunteers, one location, an online poll), asking "why is the conclusion not valid?"
- Answer: "members of that gym" (or "the sample was not selected at random").
- Distractors: (a) all gym members in the country; (b) all adults; (c) only the 300 people surveyed.
- Desmos: notes only.
- Source: OUT (EVA-M-A, EVA-H-A, EVA-E-A, EVA-H-C).

**#75 · `stat-compare-sd` · (Medium) Compare Standard Deviations**
problem-solving-data.js · One-variable data: Distributions and measures of center and spread · MC
- Stem: two data sets as lists or HTML frequency tables, usually with the same mean, e.g. A: 40, 42, 44, 46, 48 and B: 24, 34, 44, 54, 64. "Which statement best compares the standard deviations of data sets A and B?" Variants: B = A + a constant (equal standard deviations); B = 2A (B's is twice A's); frequency tables, one clustered at the center and one spread to the ends.
- Answer: a comparison statement.
- Distractors: the other comparisons ("greater", "less", "equal"), plus "cannot be determined".
- Desmos: `stdev([…])` for each list.
- Source: OUT (DIS-M-K); TN/sat-distribution-center-spread (patterns 6, 8, 9).

## Batch 16: Geometry and Trigonometry, circles and trig

**#76 · `circ-center-general-form` · (Hard) Center (or Radius) from an Expanded Circle Equation**
geometry-trig.js · Circles · MC
- Stem: "The equation x² + y² − 6x + 10y − 15 = 0 defines a circle in the xy-plane. What are the coordinates of the center of the circle?" In about 30% of questions ask for the radius instead, with all coefficients doubled (2x² + 2y² …). Unlike the original, there is no parameter p.
- Answer: (3, −5), or the radius as an integer.
- Distractors: for the center, (a) the signs flipped, (b) not halved, (c) the coordinates swapped. For the radius, (a) r², (b) √(the constant term), (c) the division by 2 forgotten.
- Desmos: graph the equation. The center is the midpoint of the leftmost and rightmost points.
- Source: ACE/circles-coordinates-of-center; OUT (CIR-H-H, CIR-H-L).

**#77 · `circ-point-inside-outside` · (Hard) Inside, On or Outside a Circle**
geometry-trig.js · Circles · MC
- Stem: "The equation (x − 3)² + (y + 1)² = 25 represents a circle in the xy-plane. Which of the following points lies inside the circle?" Rotate the ask between inside and outside. Variant: the circle given in general form.
- Answer: the one point that meets the condition.
- Distractors: (a) a point exactly on the circle; (b) a point that is inside only if the center's signs are flipped; (c) a point on the other side of the boundary.
- Desmos: graph the circle and the four points.
- Source: ACE/circle-point-outside-of-circle; OUT (CIR-H-A).

**#78 · `circ-tangent-slope` · (Hard) Slope of a Line Tangent to a Circle**
geometry-trig.js · Circles · MC
- Stem: "The circle (x − 2)² + (y + 3)² = 25 has a line tangent to it at the point (5, 1). What is the slope of the tangent line?" The point must lie on the circle (offsets from scaled 3-4-5 or 5-12-13 triples). Variant: ask for the tangent line's y-intercept.
- Answer: −3/4.
- Distractors: (a) the radius's slope, 4/3; (b) its reciprocal, 3/4; (c) its negative, −4/3.
- Desmos: graph the circle, the point, and `y-1=m(x-5)` with a slider on m. The line touches the circle once when m = −3/4.
- Source: ACE/circles-slope-of-tangent-line; OUT (CIR-H-M).

**#79 · `trig-cofunction-angle-equation` · (Hard) sin x° = cos y° with Expressions**
geometry-trig.js · Right triangles and trigonometry · SPR
- Stem: "In the given equation, the angle measures are acute: sin((3k + 8)°) = cos((2k − 3)°). What is the value of k?" Variant: "In right triangle ABC, sin A = cos((4k − 10)°) and the measure of angle A is (2k + 4)°…". Both angles must be strictly between 0° and 90°. This is distinct from the original "Trig Identity Evaluation", which evaluates a numeric expression.
- Answer: an integer.
- Desmos (degreeMode): notes ("sin A = cos B when A + B = 90"), then `(3x+8)+(2x-3)=90`.
- Source: OUT (RIG-M-C, RIG-H-L); TN/sat-trigonometry (pattern 2).

**#80 · `trig-similar-triangle-ratio` · (Hard) Carry a Trig Ratio to a Similar Triangle**
geometry-trig.js · Right triangles and trigonometry · MC
- Stem: "Triangles ABC and DEF are similar, where A corresponds to D, and angles C and F are right angles. If tan A = 8/15 and DF = 45, what is the length of EF?" Variants: sin A with the hypotenuse DE given; cos given and a leg asked for. Scale a triple (8-15-17, 5-12-13, 7-24-25) so the answer is an integer.
- Answer: 24.
- Distractors: (a) the reciprocal ratio used; (b) the hypotenuse (51); (c) the wrong leg from the triple scaled.
- Desmos: notes only.
- Source: OUT (RIG-M-A, RIG-H-J, RIG-H-M).

## Batch 17: Algebra

**#81 · `lin1-break-even` · (Medium) When Are Two Linear Costs Equal?**
algebra.js · Linear equations in one variable · MC
- Stem: "Gym A charges a \$40 sign-up fee plus \$20 per month. Gym B charges a \$10 sign-up fee plus \$25 per month. After how many months will the total cost at the two gyms be the same?" Contexts: gyms, phone plans, car rentals, two candles burning at different rates, one person saving while another spends.
- Answer: an integer.
- Distractors: (a) the fees added instead of subtracted; (b) the common total cost (the y-value) instead of the months; (c) off by one.
- Desmos: graph both cost lines and click the intersection (x = months).
- Source: TN/sat-linear-equations-in-one-variable (pattern 7).

**#82 · `lin2-model-from-context` · (Medium) Build a Linear Model from Two Facts**
algebra.js · Linear equations in two variables · MC
- Stem: "A tank contains 200 gallons of water and is drained at a constant rate. After 4 minutes, 168 gallons remain. Which equation gives g, the number of gallons remaining after m minutes?" Contexts: a tank, a phone battery, savings, a plant measured at weeks 3 and 7 (so the intercept must be computed).
- Answer: g = 200 − 8m.
- Distractors: (a) g = 200 + 8m; (b) g = 200 − 42m (168/4 used as the rate); (c) g = 168 − 8m (the wrong intercept).
- Desmos: put (0, 200) and (4, 168) in a table and fit `y_1 \sim mx_1+b`.
- Source: TN/sat-linear-equations-in-two-variables (pattern 9).

**#83 · `linf-change-over-interval` · (Medium) How Much Does f(x) Change Over an Interval?**
algebra.js · Linear functions · MC
- Stem: "The function f is defined by f(x) = (3/4)x + 12. For every increase of 8 in the value of x, by how much does f(x) increase?" Context variant: "The function d(t) = 4.5t + 30 gives the depth… By how many feet does the depth increase every 20 minutes?" Also ask "f(x + 6) − f(x)".
- Answer: slope × interval.
- Distractors: (a) the slope alone; (b) f(interval), evaluated instead of differenced; (c) interval ÷ slope.
- Desmos: `f(a+8)-f(a)` with a slider on a (the result is constant).
- Source: TN/sat-linear-functions (pattern 3, "f(x + 2) − f(x)").

**#84 · `linf-shifted-input` · (Medium) Evaluate f When f(x + k) Is Given**
algebra.js · Linear functions · MC
- Stem: "If f(x + 2) = 3x − 5 for all values of x, what is the value of f(7)?" Variants: f(x − 3) = …; f(2x) = 4x + 1.
- Answer: 10.
- Distractors: (a) 7 plugged in directly (16); (b) the shift in the wrong direction (22); (c) the intermediate x-value (5).
- Desmos: `x+2=7` gives x = 5, then `3(5)-5`. Or define the rewritten f(x) = 3(x − 2) − 5.
- Source: https://ivymax.com/blog/cpp/top-10-sat-prep-mistakes-guide/ (the f(x + 2) trap); TN/sat-linear-functions (pattern 3).

**#85 · `sys-solve-for-expression` · (Medium) Value of an Expression from a System**
algebra.js · Systems of two linear equations in two variables · SPR
- Stem: "2x + 3y = 17 and 3x + 2y = 13. What is the value of x + y?" Variants: x − y (subtract the equations); 10x + 10y; a symmetric system where adding the equations isolates the target. The target must be clean even when x and y are not.
- Answer: an integer.
- Desmos: graph both and click the intersection to get x and y, then compute. Tip: add or subtract the equations first.
- Source: https://open-exam-prep.com/study-guides/sat-math/algebra-systems/solving-linear-systems.

## Batch 18: Advanced Math, quadratic and polynomial models

**#86 · `nlf-quadratic-context-interpret` · (Medium) Interpret a Quadratic Model in Context**
advanced-math.js · Nonlinear functions · MC
- Stem: "The function h(t) = −16t² + 64t + 5 gives the height, in feet, of a ball t seconds after it is thrown. Which is the best interpretation of 5 in this context?" Rotate the ask: the constant term, the meaning of the vertex, the max height value, the time of the max. Contexts: a ball, a rocket, revenue R(p) = −20p² + 800p, a fenced area.
- Answer: a statement or value.
- Distractors: (a) the initial height and the max height swapped; (b) the time and the height swapped; (c) "the ball travels 5 feet" (a misread quantity).
- Desmos: graph h for x ≥ 0 and click the vertex and the y-intercept.
- Source: OUT (NOL-E-L, NOL-M-H, NOL-M-L).

**#87 · `nlf-area-quadratic-model` · (Medium) Quadratic Model from an Area Description**
advanced-math.js · Nonlinear functions · MC
- Stem: "The length of a rectangle is 4 more than 3 times its width, w. Which function gives the area A(w) of the rectangle?" Variants: a walkway of width x around a 10 × 16 garden; a square with one side increased and the other decreased; "If the area is 160, what is the width?" (build w first).
- Answer: A(w) = 3w² + 4w.
- Distractors: (a) the perimeter expression; (b) 3w² + 4 (not distributed); (c) (3w + 4)².
- Desmos: graph the choices against a test value; for the solve variant, intersect with y = 160.
- Source: OUT (NOL-M-A).

**#88 · `nlf-polynomial-from-zeros` · (Hard) Polynomial from Its Zeros (Described Graph)**
advanced-math.js · Nonlinear functions · MC
- Stem: "The graph of the polynomial function p in the xy-plane crosses the x-axis only at x = −3, x = 1 and x = 4, and it passes through (0, 24). Which of the following could define p?" Variant: "touches the x-axis at x = 2" (a double root).
- Answer: p(x) = 2(x + 3)(x − 1)(x − 4).
- Distractors: (a) the zeros' signs flipped; (b) the right zeros with the wrong leading coefficient, so p(0) ≠ 24; (c) a missing factor, or a single root where a double root is needed.
- Desmos: graph each choice and compare the intercepts with the description.
- Source: OUT (NOL-M-F, NOL-M-G).

**#89 · `nlf-product-sum-numbers` · (Hard) Two Numbers from a Product and a Difference**
advanced-math.js · Nonlinear functions · SPR
- Stem: "The product of two positive numbers is 192. The larger number is 4 more than the smaller number. What is the larger number?" Contexts: rectangle dimensions (area and difference), consecutive even integers, rows and seats.
- Answer: an integer.
- Desmos: graph y = x(x + 4) and y = 192 and click the positive intersection.
- Source: OUT (NOL-M-T, NOL-H-C).

**#90 · `nlf-quadratic-from-zeros-and-point` · (Hard) Quadratic from Its x-Intercepts and One Point**
advanced-math.js · Nonlinear functions · SPR
- Stem: "A quadratic function f has x-intercepts at x = 2 and x = 8, and f(0) = 32. What is the minimum value of f?" Variants: ask f(k) at another input; a negative leading coefficient (maximum); a point other than the y-intercept.
- Answer: an integer.
- Desmos: `a(0-2)(0-8)\sim32`, then graph a(x−2)(x−8) and click the vertex.
- Source: OUT (NOL-H-A).

## Batch 19: PSDA

**#91 · `tvd-regression-from-table` · (Medium) Line of Best Fit from a Data Table**
problem-solving-data.js · Two-variable data: Models and scatterplots · MC
- Stem: an HTML table of 6–8 (x, y) pairs in context, generated from y = mx + b plus small noise. "Which equation is the most appropriate linear model for the data?" Variant: "Using a line of best fit, which is closest to the predicted y when x = 20?" Choices must differ by at least 15%.
- Answer: the rounded regression equation.
- Distractors: (a) the slope's sign flipped; (b) the slope and intercept swapped; (c) the right slope with an intercept far off.
- Desmos: put the table in, fit `y_1 \sim mx_1+b`, and read m and b.
- Source: OUT (SCA-E-G, SCA-M-G); ACE/linear-functions-table-plot-points-regression.

**#92 · `tvd-linear-vs-exponential` · (Medium) Linear or Exponential Model?**
problem-solving-data.js · Two-variable data: Models and scatterplots · MC
- Stem: "The value of an investment increases by 4% each year. Which type of function best models the value of the investment over time?" Variants: "decreases by \$300 each month"; "half of the remaining substance decays every 8 hours"; an HTML table with constant differences or constant ratios.
- Answer: fixed choices: "Increasing linear", "Decreasing linear", "Increasing exponential", "Decreasing exponential".
- Distractors: the other three fixed options.
- Desmos: for tables, compute the differences and ratios with lists. Otherwise use notes.
- Source: OUT (SCA-M-E, SCA-H-F); College Board framework (https://satsuite.collegeboard.org/media/pdf/assessment-framework-for-digital-sat-suite.pdf: "compare linear and exponential growth").

**#93 · `stat-outlier-effect` · (Medium) Which Measures Change When a Value Changes?**
problem-solving-data.js · One-variable data: Distributions and measures of center and spread · MC
- Stem: a list of 7–11 values. "If the value 98 is [removed / changed to 41 / a value of 30 is added], which of the following is true?" Choices are fixed: "The mean changes but the median does not", "The median changes but the mean does not", "Both the mean and the median change", "Neither changes". Compute the truth for each scenario and use each correct option across runs: changing the maximum while it stays the maximum gives "mean only"; removing an extreme value from an odd-length list gives "both"; adding a value equal to both the mean and the median gives "neither".
- Answer: the true statement.
- Distractors: the other fixed options.
- Desmos: list → mean and median before and after.
- Source: OUT (DIS-M-H, DIS-M-G); TN/sat-distribution-center-spread (pattern 3).

**#94 · `rat-ratio-after-change` · (Hard) Ratio Before and After a Change**
problem-solving-data.js · Ratios, rates, proportional relationships, and units · SPR
- Stem: "A class of 64 students has a ratio of boys to girls of 3 to 5. How many boys must join the class so that the ratio of boys to girls is 1 to 1?" Variants: "The ratio of x to y is 2 to 3. When 10 is added to each, the ratio is 3 to 4. What is x?"; mixing juice and water to change a concentration ratio.
- Answer: an integer.
- Desmos: `(2x+10)/(3x+10)=3/4`.
- Source: OUT (RAT-M-H, RAT-H-E, RAT-H-G).

**#95 · `rat-area-unit-conversion` · (Hard) Convert Area Units**
problem-solving-data.js · Ratios, rates, proportional relationships, and units · SPR
- Stem: "A rectangular floor measures 12 feet by 15 feet. What is the area of the floor, in square yards? (1 yard = 3 feet)" Variants: m² ↔ cm² (10,000); in² ↔ ft² (144); carpet priced per square yard.
- Answer: an integer of 5 characters or fewer.
- Desmos: `12·15/3^2`. Tip: square the conversion factor.
- Source: OUT (RAT-H-F, RAT-H-B).

## Batch 20: Geometry and Trigonometry, hard area/volume and triangles

**#96 · `geo-triangle-area-coordinates` · (Hard) Area of a Triangle from Its Vertices**
geometry-trig.js · Area and volume · MC
- Stem: "In the xy-plane, triangle PQR has vertices P(−3, 2), Q(5, 2) and R(1, 9). What is the area of triangle PQR?" About 70% of questions have one horizontal or vertical side. The other 30% have none, and need the box-subtraction method.
- Answer: an integer or .5.
- Distractors: (a) base × height without the ½; (b) a slanted side used as the height; (c) the box area without subtracting.
- Desmos: `polygon((-3,2),(5,2),(1,9))`, then read the base and height from the coordinates.
- Source: OUT (AAV-H-I, AAV-M-K).

**#97 · `geo-similar-solids-scale` · (Hard) Scale Factor for Area and Volume**
geometry-trig.js · Area and volume · MC
- Stem: "Two similar rectangular prisms have corresponding edge lengths in the ratio 2 : 3. The volume of the smaller prism is 48 cubic inches. What is the volume of the larger prism?" Variants: an area ratio → length ratio; a volume ratio → surface-area ratio; similar triangles and their areas.
- Answer: 162.
- Distractors: (a) linear scaling (72); (b) squared scaling (108); (c) the ratio inverted.
- Desmos: `48(3/2)^3`.
- Source: OUT (AAV-H-A).

**#98 · `geo-changed-dimensions` · (Hard) Volume or Area After Changing Dimensions**
geometry-trig.js · Area and volume · MC
- Stem: "The radius of a right circular cylinder is tripled and its height is halved. The volume of the new cylinder is how many times the volume of the original cylinder?" Variants: a prism with three changed dimensions; a cone with the radius halved and the height quadrupled; a rectangle's area.
- Answer: 4.5.
- Distractors: (a) the radius factor not squared (1.5); (b) the factors added; (c) the height factor squared instead of the radius factor.
- Desmos: notes, then compute the ratio.
- Source: OUT (AAV-H-H).

**#99 · `geo-similarity-criteria` · (Hard) What Proves Two Triangles Congruent or Similar?**
geometry-trig.js · Lines, angles, and triangles · MC
- Stem: "In triangles ABC and DEF, AB = DE and angle B is congruent to angle E. Which additional piece of information is sufficient to prove that triangle ABC is congruent to triangle DEF?" Similarity variant: "Angle A is congruent to angle D. Which additional information is sufficient to prove that the triangles are similar?"
- Answer: exactly one sufficient condition (SAS, ASA or AA, or SAS similarity with the included angle).
- Distractors: SSA, AAA used for congruence, or proportional sides that don't include the given angle. The generator must check that exactly one choice is sufficient.
- Desmos: notes only.
- Source: OUT (ANG-H-E, ANG-H-F, ANG-H-C).

**#100 · `geo-altitude-on-hypotenuse` · (Hard) Altitude to the Hypotenuse**
geometry-trig.js · Lines, angles, and triangles · SPR
- Stem (described): "In right triangle ABC, angle C is a right angle. Segment CD is the altitude from C to hypotenuse AB, with D on AB. If AD = 4 and DB = 9, what is the length of CD?" Variants: find a leg (AC² = AD·AB; e.g. AD = 9, AB = 25 gives AC = 15); find DB given CD and AD.
- Answer: an integer.
- Desmos: notes (the three similar triangles), then `\sqrt{4\cdot9}`.
- Source: OUT (ANG-H-D, ANG-H-G, RIG-M-F).

## Batch 21: Algebra, word problems and hard types

**#101 · `ineq-word-max` · (Medium) Maximum or Minimum Count from an Inequality**
algebra.js · Linear inequalities in one or two variables · SPR
- Stem: "An elevator can carry at most 1,500 pounds. A worker who weighs 180 pounds rides with boxes that weigh 45 pounds each. What is the maximum number of boxes the worker can take on one trip?" Variants: "at least" (round up), e.g. the minimum items to sell to reach \$500; a budget; a time limit. Make about half of the quotients non-integers.
- Answer: an integer (rounded in the right direction).
- Desmos: graph y = 180 + 45x and y = 1500, click the intersection, then round in the safe direction.
- Source: TN/sat-linear-inequalities-in-one-or-two-variables (pattern 4).

**#102 · `ineq-create-from-context` · (Medium) Write the Inequality for a Context**
algebra.js · Linear inequalities in one or two variables · MC
- Stem: "A delivery van can carry at most 2,000 pounds. Each small box weighs 25 pounds and each large box weighs 40 pounds. Which inequality represents the numbers of small boxes, s, and large boxes, l, the van can carry?" Rotate "at most", "at least", "more than" and "fewer than". One-variable variant: a fixed cost plus a rate.
- Answer: 25s + 40l ≤ 2,000.
- Distractors: (a) the inequality reversed; (b) the coefficients swapped; (c) the strict sign wrong (< for "at most").
- Desmos: notes only.
- Source: TN/sat-linear-inequalities-in-one-or-two-variables (pattern 4 and its trap table).

**#103 · `lin1-constant-special` · (Hard) Constant for No Solution or Infinitely Many Solutions**
algebra.js · Linear equations in one variable · SPR
- Stem: "In the given equation, k is a constant: 3(kx − 4) = 18x + 7. The equation has no solution. What is the value of k?" Variant: "5(x + 3) − 2 = 5x + c has infinitely many solutions. What is the value of c?"
- Answer: an integer or fraction.
- Desmos: put a slider on k and graph each side. The lines are parallel (no solution) or the same line (infinitely many).
- Source: TN/sat-linear-equations-in-one-variable (parameter questions; solution-type trap).

**#104 · `linf-transformed-intercept` · (Hard) Intercept of a Transformed Linear Function**
algebra.js · Linear functions · SPR
- Stem: "The function f is defined by f(x) = 4x − 9. The function g is defined by g(x) = f(x − 3) + 2. What is the y-intercept of the graph of y = g(x) in the xy-plane?" Rotate the ask: the y-intercept, or the x-coordinate of the x-intercept. Rotate the transformation: f(x + h) + k, f(x − h), or a·f(x) + k. Keep to translations and vertical stretches.
- Answer: an integer or fraction.
- Desmos: define f and g, graph g, and click the intercept.
- Source: https://www.kaptest.com/study/psat/psat-math-function-behavior-and-transformations/; ACE/linear-functions-input-a-function.

**#105 · `sys-mixture` · (Hard) Mixture or Blend System**
algebra.js · Systems of two linear equations in two variables · MC
- Stem: "A chemist has a 10% acid solution and a 30% acid solution. How many liters of the 10% solution should be mixed with the 30% solution to make 40 liters of a 25% acid solution?" Contexts: acid, coffee blends in dollars per pound, nut mixes, money invested at two simple-interest rates.
- Answer: 10.
- Distractors: (a) the other amount (30); (b) half the total (20); (c) the amount of pure acid (0.25 × total) when that differs from the answer; otherwise the percent gap read as liters (25 − 10 = 15).
- Desmos: graph x + y = 40 and 0.1x + 0.3y = 10 and click the intersection.
- Source: TN/sat-linear-equations-in-one-variable (pattern 8, "mixture/percent").

## Batch 22: Advanced Math, equivalent expressions

**#106 · `eqx-expand-binomials` · (Easy) Expand a Product of Binomials**
advanced-math.js · Equivalent expressions · MC
- Stem: "Which expression is equivalent to (3x − 4)(2x + 5)?" 30% are squared binomials (2x − 5)², and 20% use two variables, (ax + by)(cx + dy).
- Answer: the expanded trinomial.
- Distractors: (a) the middle term dropped; (b) the middle term with a sign error; (c) the constant with a sign error.
- Desmos: graph the original and each choice. Only one overlaps.
- Source: TN/sat-equivalent-expressions (expansion match).

**#107 · `eqx-subtract-polynomials` · (Easy) Add or Subtract Polynomials**
advanced-math.js · Equivalent expressions · MC
- Stem: "Which expression is equivalent to (4x² − 3x + 7) − (2x² + 5x − 1)?" Variants: a multiplier on the second polynomial, (…) − 2(…); three-term sums.
- Answer: the simplified polynomial.
- Distractors: (a) the negative distributed to the first term only; (b) the polynomials added; (c) a sign error on the constant only.
- Desmos: graph and compare.
- Source: TN/sat-equivalent-expressions.

**#108 · `eqx-exponent-rules` · (Easy) Simplify with Exponent Rules**
advanced-math.js · Equivalent expressions · MC
- Stem: "Which expression is equivalent to (2x³y)⁴, where x > 0 and y > 0?" Variants: the quotient (6x⁵y³)/(2x²y); a product with negative exponents.
- Answer: 16x¹²y⁴.
- Distractors: (a) exponents added instead of multiplied (2x⁷y⁵); (b) the coefficient not raised to the power (2x¹²y⁴); (c) the coefficient multiplied by 4 (8x¹²y⁴).
- Desmos: use sliders a and b for x and y, and compare the values of the original and each choice.
- Source: https://www.albert.io/blog/rewriting-rational-radical-expressions-for-sat-math-success/ (properties of exponents).

**#109 · `eqx-factor-difference-squares` · (Medium) Factor Special Products**
advanced-math.js · Equivalent expressions · MC
- Stem: "Which expression is equivalent to 12x² − 27?" Variants: a perfect-square trinomial, 4x² − 20x + 25; a²x⁴ − b².
- Answer: 3(2x − 3)(2x + 3).
- Distractors: (a) 3(2x − 3)² (squared instead of conjugates); (b) (2x − 3)(2x + 3) (the GCF lost); (c) 3(4x − 3)(4x + 3) (the square root not taken on the x-term).
- Desmos: graph and compare.
- Source: TN/sat-equivalent-expressions (factoring match).

**#110 · `eqx-simplify-rational` · (Medium) Simplify a Rational Expression**
advanced-math.js · Equivalent expressions · MC
- Stem: "Which expression is equivalent to (x² − 9)/(x² + x − 6), for x ≠ −3 and x ≠ 2?" Build from (x − a)(x + b)/((x + b)(x − c)). Variant: leading coefficient 2.
- Answer: (x − 3)/(x − 2).
- Distractors: (a) the x² terms cancelled illegally; (b) the wrong factor cancelled; (c) a sign error in one factor.
- Desmos: graph and compare. The correct choice overlaps except at the hole.
- Source: https://www.albert.io/blog/rewriting-rational-radical-expressions-for-sat-math-success/ (example 5); TN/sat-equivalent-expressions.

## Batch 23: PSDA, hard types

**#111 · `pct-part-whole-shift` · (Hard) Percent Composition After Members Join**
problem-solving-data.js · Percentages · SPR
- Stem: "In a club, 40% of the members are juniors. After 6 more juniors join and no members leave, 50% of the members are juniors. How many members did the club have originally?" Variants: members leave; different percent pairs (25% → 40%); ask how many members there are now.
- Answer: an integer.
- Desmos: `0.4x+6=0.5(x+6)`.
- Source: OUT (PER-H-B).

**#112 · `stat-combined-mean` · (Hard) Mean of Combined Groups**
problem-solving-data.js · One-variable data: Distributions and measures of center and spread · MC
- Stem: "Class A has 20 students with a mean score of 80. Class B has 30 students with a mean score of 70. What is the mean score of all 50 students?" Variants: find one group's mean from the combined mean; find a group's size.
- Answer: 74.
- Distractors: (a) the unweighted average (75); (b) the weights reversed (76); (c) the total divided by the wrong count.
- Desmos: `(20·80+30·70)/50`.
- Source: OUT (DIS-H-F); TN/sat-distribution-center-spread (pattern 12).

**#113 · `tvd-average-rate-of-change` · (Hard) Average Rate of Change of a Nonlinear Model**
problem-solving-data.js · Two-variable data: Models and scatterplots · MC
- Stem: "The function P(t) = 500(2)^t models … What is the average rate of change of P from t = 1 to t = 3?" Variants: a quadratic h(t) = −16t² + 80t; an HTML table of values. Build so the answer is an integer.
- Answer: (P(b) − P(a))/(b − a).
- Distractors: (a) ΔP not divided by the interval; (b) the average of the two outputs; (c) the growth factor (2) or Δt/ΔP.
- Desmos: define P, then `(P(3)-P(1))/(3-1)`.
- Source: OUT (SCA-M-B).

**#114 · `prob-fill-table-from-probability` · (Hard) Missing Table Entry from a Probability**
problem-solving-data.js · Probability and conditional probability · MC
- Stem: an HTML two-way table with one missing cell x. "If a person is selected at random from Group A, the probability that the person answered yes is 3/8. What is the value of x?" Variant: then ask a second probability that uses x.
- Answer: an integer (15 in the example, with 25 Group A "no").
- Distractors: (a) the grand total used as the denominator; (b) the other group's total used; (c) the complement probability used.
- Desmos: `x/(x+25)=3/8`.
- Source: OUT (PRO-H-B, PRO-H-C).

**#115 · `inf-compare-estimates` · (Hard) Compare Estimates with Margins of Error**
problem-solving-data.js · Inference from sample statistics and margin of error · MC
- Stem: "Independent random samples were taken in Town A and Town B. In Town A, 54% supported the plan, with a margin of error of 4%. In Town B, 49% supported it, with a margin of error of 3%. Which conclusion is best supported?" Make the intervals overlap or not, evenly. Variant (FER-H-C): "If the sample size were increased, the margin of error would most likely…"
- Answer: "The data do not provide convincing evidence that support differs" (overlap), or "Support is likely higher in Town A" (no overlap); "decrease" for the sample-size variant.
- Distractors: the opposite conclusion; a claim of an exact difference; a conclusion about individuals.
- Desmos: notes (write each interval).
- Source: OUT (FER-M-C, FER-H-A, FER-H-C).

## Batch 24: Advanced Math, solving nonlinear equations

**#116 · `nleq-square-root-method` · (Easy) Solve a Squared-Binomial Equation**
advanced-math.js · Nonlinear equations in one variable and systems of equations in two variables · MC
- Stem: "What are the solutions to the given equation? 4(x − 3)² = 64". Forms: a(x − h)² = k; (x + h)² − k = 0. Build x = h ± m.
- Answer: "x = −1 and x = 7".
- Distractors: (a) one root only (the ± forgotten); (b) h's sign flipped; (c) the division by a forgotten (or the square root not taken when a = 1).
- Desmos: graph both sides and click both intersections.
- Source: TN/sat-nonlinear-functions (pattern 4, the "missing ±" trap).

**#117 · `nleq-quadratic-formula` · (Medium) Solutions by the Quadratic Formula**
advanced-math.js · Nonlinear equations in one variable and systems of equations in two variables · MC
- Stem: "What are the solutions to 3x² − 4x − 2 = 0?" The discriminant is not a perfect square. Simplify the radical and reduce.
- Answer: x = (2 ± √10)/3.
- Distractors: (a) the denominator a instead of 2a; (b) −b's sign flipped; (c) b² + 4ac used under the radical. All are simplified the same way.
- Desmos: graph and read the zeros as decimals, then type each choice to compare.
- Source: ACE/nonlinear-equations-solutions-for-quadratic; TN/sat-nonlinear-functions (pattern 4).

**#118 · `nleq-radical-extraneous` · (Medium) Radical Equation with an Extraneous Solution**
advanced-math.js · Nonlinear equations in one variable and systems of equations in two variables · MC
- Stem: "What are all the solutions to √(2x + 15) = x?" Build √(ax + b) = x + c so that squaring gives two roots, one of them extraneous. Variant: √(x + k) + c = x.
- Answer: "5 only". Choices are fixed in shape: "r₁ only", "r₂ only", "r₁ and r₂", "There are no solutions."
- Distractors: the extraneous root only; both roots; no solutions.
- Desmos: graph y = √(2x + 15) and y = x. They meet once.
- Source: https://www.albert.io/blog/rewriting-rational-radical-expressions-for-sat-math-success/ (example 7); https://www.varsitytutors.com/practice/subjects/algebra/help/solving-rational-and-radical-equations.

**#119 · `nleq-rational-equation` · (Hard) Rational Equation with an Extraneous Solution**
advanced-math.js · Nonlinear equations in one variable and systems of equations in two variables · MC
- Stem: "What is the solution set of x/(x − 3) + 2 = 3/(x − 3)?" (the only candidate is 3, which is excluded, so there is no solution). Variants: clearing denominators gives a quadratic with one valid root and one excluded root; or a single valid root.
- Answer: a set, or "no solution".
- Distractors: the excluded value; both candidates; a sign-error root.
- Desmos: graph both sides. There is no intersection at the excluded x (a hole or asymptote).
- Source: https://www.varsitytutors.com/practice/subjects/algebra/help/solving-rational-and-radical-equations; https://www.albert.io/blog/rewriting-rational-radical-expressions-for-sat-math-success/.

**#120 · `nlf-composition` · (Easy) Evaluate a Composite Function**
advanced-math.js · Nonlinear functions · MC
- Stem: "The functions f and g are defined by f(x) = x² − 3 and g(x) = 2x + 1. What is the value of f(g(2))?" Variants: g(f(a)); f(f(a)); f and g given by an HTML table.
- Answer: an integer.
- Distractors: (a) the order reversed, g(f(2)); (b) f(2)·g(2); (c) f(2) + g(2).
- Desmos: define f and g, then type `f(g(2))`.
- Source: TN/sat-linear-functions (pattern 3, "function composition/addition traps").

## Batch 25: Mixed leftovers, hard types

**#121 · `ineq-system-max` · (Hard) Greatest Value in a System of Inequalities**
algebra.js · Linear inequalities in one or two variables · SPR
- Stem: "y ≤ −2x + 15 and y ≤ 3x − 5. In the xy-plane, the point (a, b) is a solution to the given system of inequalities. What is the maximum possible value of b?" Variant: two ≥ inequalities, asking for the minimum. Build from the vertex.
- Answer: the vertex's y-value (7).
- Desmos: graph both inequalities and click the top vertex of the overlap.
- Source: TN/sat-linear-inequalities-in-one-or-two-variables (pattern 6); CBS Q4 (inequality testing point).

**#122 · `eqx-isolate-variable-formula` · (Hard) Solve a Formula for One Variable**
advanced-math.js · Equivalent expressions · MC
- Stem: "The formula V = (1/3)πr²h gives the volume of a cone. Which equation correctly expresses r in terms of V and h?" Formulas: kinetic energy ½mv² (solve for v); F = Gm₁m₂/d² (d); P = I²R (I); A = ½(b₁ + b₂)h (b₁).
- Answer: r = √(3V/(πh)).
- Distractors: (a) the square root forgotten; (b) the fraction inverted; (c) the coefficient misplaced, √(V/(3πh)).
- Desmos: notes. Pick values for V and h and test which choice gives back the right r.
- Source: https://blog.prepscholar.com/single-variable-equations-sat-math-strategies (formula rearrangement); TN/sat-equivalent-expressions.

**#123 · `eqx-rational-exponents` · (Hard) Rewrite Radicals with Rational Exponents**
advanced-math.js · Equivalent expressions · MC
- Stem: "For x > 0, which expression is equivalent to ∛(x⁵)·√x?" Variants: (16x⁸)^(3/4); ⁴√(x⁵) written as a power; a quotient of radicals.
- Answer: x^(13/6).
- Distractors: (a) the exponents multiplied (x^(5/6)); (b) the index and power flipped (x^(3/5)·…); (c) the exponents added wrongly (x^(6/5)).
- Desmos: graph the original and each choice for x > 0.
- Source: https://www.albert.io/blog/rewriting-rational-radical-expressions-for-sat-math-success/ (examples 1, 2, 8).

**#124 · `eqx-polynomial-division` · (Hard) Quotient Plus Remainder Form**
advanced-math.js · Equivalent expressions · MC
- Stem: "Which expression is equivalent to (x² + 5x + 9)/(x + 2)?" Variants: a leading coefficient of 2; the divisor x − 3.
- Answer: x + 3 + 3/(x + 2).
- Distractors: (a) the remainder's sign wrong; (b) divided by the wrong root (synthetic division with +2); (c) the remainder dropped.
- Desmos: graph and compare.
- Source: CBS Q10 (testing point "Rewrite a rational expression"); https://www.albert.io/blog/rewriting-rational-radical-expressions-for-sat-math-success/.

**#125 · `claims-experiment-causation` · (Hard) What Can a Study Conclude?**
problem-solving-data.js · Evaluating statistical claims: Observational studies and experiments · MC
- Stem: "A researcher recruited 200 volunteers and randomly assigned half of them to take a new supplement and the other half to take a placebo. The supplement group had significantly lower [measure]. Which conclusion is most appropriate?" Variant: an observational study with no random assignment, where only an association can be concluded.
- Answer: "The supplement is likely to cause lower [measure] for people similar to the volunteers." (For the observational variant, an association only.)
- Distractors: (a) a causal claim for all adults (generalizing beyond volunteers); (b) "no conclusion is possible"; (c) a causal claim from the observational study.
- Desmos: notes only.
- Source: OUT (EVA-H-D, EVA-M-B); College Board framework ("understand basic study design").

---

## Cut for quality, and gaps to fill later

Cut before building:
- **Near-duplicates of the originals:** line tangent to a parabola (the original "Quadratic and Linear Intersection" covers the exactly-one-solution case); a linear function's equation from a table (same work as the original "Linear Properties from Two Points"); whole from a part ("35% is 126", the same mechanics as "Simple Percentage Change").
- **Near-duplicates of other entries:** f(x + k) − f(x) given → slope (same idea as #83); a context version of solving a linear function for its input (same as #45); the plain Pythagorean theorem (#17 covers it with the official radical twist); a side from a trig ratio in the same triangle (between #37 and #80); a two-item total (between #45 and #62); "evaluate a nonlinear function" (too thin).
- **Unsourced:** a linear function's constant from a condition such as f(4) = 2f(−1); intercepts with a + b = 0 → slope; a small percent with unit conversion (sourced but rare).

Gaps (up to 10 more entries may be added here once sourced, keeping the 135 ceiling):
- **Linear functions** has only 5 types, though it is Algebra's largest skill. Candidates: a model whose input is an unusual quantity (e.g. "f(x) = 36a + x", a car lease); time-offset models ("t years after 2010" built from 2014 and 2018 data).
- **Box plots** (described five-number summary) and the **median from a frequency table**.
- **Circles:** inscribed or central angle relationships (CIR-H-N); a circle shifted or tangent to an axis (ACE/circles-intersecting-the-y-axis-at-one-point).
