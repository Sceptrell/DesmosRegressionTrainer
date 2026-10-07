# Batch review log

The manager appends one entry per builder batch, in the order the batches are reviewed. The plan is in `research/catalog.md` (125 types in 25 batches; 135 is a ceiling, not a quota).

Each entry records:
- **Checks:** `node tests/check-generators.js --only <ids> --samples 5`, the full `node tests/check-generators.js`, and `node tests/check-desmos.js --only <ids>`.
- **Math:** at least 2 samples per type, solved independently.
- **SAT-likeness:** wording, number sizes, honest difficulty label, MC/SPR as planned, distractors that match real errors, tips that teach a method, and a useful Desmos walkthrough. Code is checked for retry loops and variety.
- **Verdict:** APPROVED, APPROVED WITH FIXES (required fixes listed) or REJECTED (reasons listed), plus guidance for the next batch.
- **Progress:** done/125, domain, skill and difficulty balance, the quality trend, and any catalog changes.

The bar, per the user: fewer, excellent types beat many mediocre ones. A type that doesn't read like a real SAT question, has questionable math, or nearly duplicates another type is fixed or dropped.

---

## Batch 1 (#1–#5, algebra.js): APPROVED WITH FIXES

**Checks**
- `check-generators --only …`: all 5 ok, 300/300 distinct each. Full run: 20 categories, all pass.
- `check-desmos --only …`: no Desmos errors.
- My own verifier (`/tmp/mgr/verify-b1.js`) parses the rendered question text and re-solves it, 2,000 runs per type. #1 recomputes the combination and checks sorting and uniqueness. #4 confirms exactly one choice satisfies every inequality, and that it is the key. #5 re-solves the 2×2 system from the dollar amounts and checks for whole-number counts. #2 and #3 check that the key states the asked number in the correct role (rate vs starting value or total, and the right variable and direction).
- Result: 0 failures. A control with every answer letter shifted is flagged in every type.
- By hand: I solved 16 samples, at least 2 per type, including all 6 #5 systems and the check of each choice in #4. All keys are correct.

**SAT-likeness**
- #1, #3, #4 and #5 are near-faithful to CB Q1, Q5, Q4 and Q6: wording, number sizes and distractor logic all match.
- #2 uses CB Q3's 2×2 grid, plus a direction flip for decreasing models. Adding the y-intercept as a fourth thing to ask about is good. True-but-irrelevant choices (e.g. "The system costs \$100" when the slope is asked) match CB Q3's own choice B, so they are acceptable.
- The builder's deviations are all improvements: the trivia contest in place of the giveaway "3-point basket", the hiker in place of the ambiguous battery percent, and a positive x-coefficient in standard-form inequalities.
- Difficulty labels are honest: 4 Easy, and Medium for #5.
- The tips teach a method plus the trap. The Desmos walkthroughs are correct.
- Code: retry loops are capped and have verified deterministic fallbacks. Generation takes at most 0.5 ms per question (#5).

**Required fixes** (small; do them in the same pass as batch 2)
1. **#5 `sys-word-problem` answer position is skewed:** A 35%, B 30%, C 23%, D 12% over 4,000 runs. In "sum" mode, x + y is always the largest choice, so the key is never D there. On about half of the sum-mode runs, replace x + y with another legitimate error value (a second setup slip, or the other count from the slip system) that can fall below the key. Target 18–32% per letter.
2. **Desmos note polish:** `linText` (#1) and the standard-form `check` (#4) print a coefficient of 1 or −1 as "1(3)" or "-1(3)" ("f(3) = 1(3) + 8", "4 ≥ -1(3) + 2"). Print "3" or "−3" instead.

**On track:** 5/125 done (4%). Algebra 5/31: linear functions 2, two-variable equations 1, inequalities 1, systems 1. 4 Easy, 1 Medium, all MC. The first SPR types arrive in batches 5 and 9. The quality bar is met. Catalog change: added convention 10 (answer-position balance, readable notes). Nothing dropped.

## Batch 2 (#6–#10, advanced-math.js): APPROVED WITH FIXES. Batch 1 fixes confirmed.

**Batch 1 fixes, confirmed**
- #5 letter spread is now 24.5/24.8/25.5/25.2 over 4,000 runs; #1 is 25.4/24.5/25.4/24.8.
- A scan of 61,152 Desmos notes from batches 1–2 found no "1(…)", "1x", "+ -" or "- -".
- My batch 1 verifier, updated for the new contexts (museum general vs planetarium, boxes to Canada vs Mexico), still finds 0 failures, and the shifted-letter control is still flagged.

**Checks**
- `check-generators --only <10 ids> --runs 4000`: all pass. The only warning is #7, where "Infinitely many" is never the key (see the decision below).
- `check-desmos` on all 10 ids: no Desmos errors.
- My own verifier (`/tmp/mgr/verify-b2.js`) converts the rendered TeX to functions and recomputes every key, 3,000 runs per type.
  - #6: the key equals k, and min vs max matches the sign of a.
  - #7: rebuilds A, B and C from L − R and counts real solutions.
  - #8: exactly one choice matches the stated growth at t = 0, 1, 2, 5 and 7, and it is the key.
  - #9: every choice is numerically equivalent to the given equation, the given form is never repeated, and exactly one choice has the factored or vertex structure that was asked for.
  - #10: re-solves a and b from the two points, checks the asked value, and confirms the choices are strictly increasing.
- Result: 0 failures across 15,000 instances. The control is flagged 100% in every type.
- By hand: 22 samples (#6 ×5, #7 ×5, #10 ×12), all correct.
- #7's form spread over 6,000 runs: general ax² + bx + c = 0 31%, terms on both sides 22%, (x − h)² = q 20%, no x-term 14%, trinomial = q 13%. That is good variety. My earlier impression that it was mostly perfect squares came from 5 samples.

**SAT-likeness**
- #6 and #7 are faithful to CB Q7 and Q9. #8 includes CB Q11's own wording in about 22% of runs and has 7 contexts.
- #9 is the strongest item so far. All four choices are truly equivalent, which is checked in code. Dropping the y-intercept ask was right, since x(x − 6) + 5 also shows the constant.
- #10 follows CB Q8: 75% of the a^x + b items use a negative x and a fractional output. The ab^x variant is closer to Medium-Hard than Hard, but it still takes 3 nonlinear steps, so Hard is acceptable.
- Distractors are real errors: h vs k, −k, k², f(0), the rate used as the factor, growth vs decay, a linear model, the exponent kt vs t/k, a^(x₂)·b, and a times a y-value.
- Tips teach. The Desmos walkthroughs are correct, and #10 rightly uses explicit formulas, since a regression could converge to the negative root. #9's note honestly says Desmos can't pick the form.
- Code: every builder checks itself (the equivalence assert in #9, the discriminant assert in #7). The letter-target loops are capped at 300 with fallbacks.

**Decision on #7 ("Infinitely many" never correct):** YES, add identities. CB's own testing point reads "zero, one, two, or infinitely many real solutions".
- About 1 in 6 runs should be an identity (e.g. 3(x − 2)² = 3x² − 12x + 12), making C the key.
- Show the same both-sides-quadratic look just as often for non-identities where x² cancels: (x + 2)² = x² + 4x + 9 → Zero; (x + 3)² = x² + 4x + 7 → Exactly one. That way the look never reveals the answer.
- Update the self-check assert and the note text for the A = 0 case. C should land at about 17%, which clears the checker's 15% floor. The #7 catalog entry is updated.

**Required fixes** (ship with batch 4)
1. **#8 article errors.** "a 800-milligram dose" appears in the question text, in about 6% of #8 questions (175 of 3,000). The Desmos note says "A 8% / A 18% / A 80% decrease" (161 of 3,000). Add an `aAn(n)` helper (an for 8, 11, 18, 80–89, 800–899, 8,000–…) and use it everywhere an article precedes a generated number.
2. **#7 identity case,** as described above.

**On track:** 10/125 done (8%).
- Algebra 5/31; Advanced Math 5/38 (nonlinear functions 4, nonlinear equations 1).
- Difficulty: 5 Easy, 4 Medium, 1 Hard. Format: 10/10 MC so far; SPR starts in batch 3 (#14) and batch 5.
- Quality is high and steady: zero wrong keys in 25,000 independently checked instances.
- Catalog changes: the #7 entry (identity case); convention 10 extended with the a/an rule. Nothing dropped.

## Batch 3 (#11–#15, problem-solving-data.js): APPROVED WITH FIXES. Batch 2 fixes confirmed.

**Batch 2 fixes, confirmed**
- #7 now uses identities (key C) and look-alike equations where x² cancels. My batch 2 verifier, which handles A = B = 0, still finds 0 failures in 15,000 instances, and the shifted-letter control is flagged 100%.
- #8 now reads "receives an 800-milligram dose" and "An 18% decrease". The new a/an check in check-generators passes across all 30 categories at 1,000 runs.

**Checks**
- `check-generators`: the full run passes (30 categories) with no warnings.
- `check-desmos` on batch 3 plus #7 and #8: no errors.
- My own verifier (`/tmp/mgr/verify-b3.js`) parses the rendered text, 4,000 runs per type.
  - #11: pq/100.
  - #12: re-derives the cube root, mass or density from the stem and applies the stated rounding.
  - #13: evaluates the stated best-fit line at x, or the residual and its "less/greater" direction.
  - #14: recomputes Σvf/Σf from the HTML table and checks Σf against the count in the stem.
  - #15: multiplies the stated factors for each of the four modes.
- Result: 0 wrong keys. The handful of flags all traced to my own parsers: "each of its N games", "reduces the sale price", and "No change" keys, which are correct (1.25 × 0.8 = 1). The shifted-letter control is flagged 100% on all MC types.
- By hand: 22 samples, all correct (e.g. ∛(317/421) = 0.91; 3.1·7 + 54 − 68 = 7.7; Σ = 82/25 = 3.28; \$320 × 0.85 × 0.75 = \$204).

**SAT-likeness**
- #11 matches CB Q14. The extra pool distractors are real errors: "0.04%" is the decimal never converted, and "first minus overlap" is the part not in both groups.
- #12 matches CB Q15, with realistic material densities (pine, oak, concrete, granite, copper). The ÷3 and √ distractors are believable cube-root slips. Skipping the population-density variant is fine.
- #13 is text-adapted CB Q13 with good contexts; the residual wording ("how much less is the actual value…") is clear. Dropping "closest to" is right, since the values are exact.
- #15 is excellent: four modes, including the classic "+25% then −20% = No change".
- Difficulty labels are honest; the tips teach weighting and multiplying rather than adding percents.

**Required fix**
1. **#14 `stat-mean-frequency-table`: implausible data.** Frequencies are uniform random 1–12 (code line 266), so tables look unnatural: 11 of 25 students with 5 siblings, a soccer team scoring 6 goals in 11 of 50 games, and every employee absent at least once. In 54% of tables, 20% or more of the data sits at the largest value. SAT tables show plausible data. Shape the frequencies per context: unimodal, peaking near a typical value, with small tails; include 0 where natural (goals, siblings, pets); goals mostly 0–4, siblings and pets 0–4 with the mode at 1–2. Keep the mean terminating and the total N ≥ 12.

**On track:** 15/125 done (12%).
- By domain: Algebra 5, Advanced Math 5, PSDA 5.
- Difficulty: 7 Easy, 5 Medium, 3 Hard. Format: 14 MC, 1 SPR. SPR is behind for now; batches 5, 7 and 9 have 6 SPR types.
- Quality steady: 0 wrong keys in about 45,000 independently checked instances so far. The main defect class has moved from math to realism and polish, which this review now checks explicitly.
- Catalog: no changes.

## Batch 4 (#16–#20, geometry-trig.js): APPROVED. #14 realism fix confirmed.

**#14 fix, confirmed**
- Tables now look like real data: siblings `0:4 1:21 2:15 3:6 4:4`; absences `0:14 1:3 2:3 3:4 4:1`; sleep hours peak at 7.
- Tables with 20% or more of the data at the largest value fell from 54% to 8%, and the remaining cases are plausible.
- The batch 3 verifier still finds 0 wrong keys; its only flags are the correct "No change" keys in #15.

**Checks**
- `check-generators`: the full run passes (35 categories, 1,000 runs) with no warnings. At 4,000 runs, letters spread 21–29%.
- `check-desmos` on batch 4 plus #14: no errors.
- My own verifier (`/tmp/mgr/verify-b4.js`) parses the rendered text, 4,000 runs per type.
  - #16: the proportion, in both directions.
  - #17: the other side from √(d² − s²), then area, perimeter or the asked side.
  - #18: circumference, arc length (π form) or central angle.
  - #19: solves the equal or supplementary relationship, checks every angle is between 0° and 180° and the answer is a whole number.
  - #20: the triangle sum (180 or 90) or the exterior-angle equation, all angles positive.
- Result: 0 wrong keys in 20,000 instances. The shifted-letter control is flagged 100% on every MC type.
- #19 answers: 152 distinct values, none dominant (the repeated x = 19 in my samples was chance).
- By hand: 25 samples, all correct.

**SAT-likeness**
- #16, #17 and #18 are faithful to CB Q16, Q17 and Q18. The added distractors are real errors: the same difference instead of the same ratio; (k√m)² read as k·m; ab/2; arc length² (CB's own).
- #19 states the angle relationship in words, as planned for a text-only figure. It includes alternate exterior angles and "8x°" forms, and every angle is 25°–155°.
- #20's right-triangle mode (trap: A + B = 180) and exterior-angle mode add good variety.
- Difficulty labels are honest. The only loop with a retry is capped at 200 with a fallback.

**Required fixes:** none.

**On track:** 20/125 done (16%).
- By domain: Algebra 5, Advanced Math 5, PSDA 5, Geometry & Trig 5.
- Difficulty: 10 Easy, 7 Medium, 3 Hard. Format: 19 MC, 1 SPR. Hard and SPR lag by design of the best-sourced-first order: later batches are Hard-heavy, and batches 5–9 add 7 SPR.
- Quality is high. This is the first batch with no required fixes.
- Catalog: no changes.

## Batch 5 (#21–#25, algebra.js): APPROVED

**Checks**
- `check-generators`: the full run passes (40 categories, 1,000 runs). The only warning is #25 "Exactly two" never being the key, which is expected and correct for linear systems.
- `check-desmos`: clean.
- My own verifier (`/tmp/mgr/verify-b5.js`) parses the rendered TeX into Ax + By = C, 4,000 runs per type.
  - #21: the slope is −A/B; intercepts are (0, C/B) or (C/A, 0).
  - #22: re-solves the missing coordinate.
  - #23: Cramer's rule, for the coordinate asked.
  - #24: exactly one choice has a slope that multiplies with ℓ's to −1 and passes through the point, and every distractor also passes through it.
  - #25: classifies with the determinant and checks proportional constants.
- Result: 0 wrong keys in 20,000 instances. The control (shifted letter, or SPR answer + 1) is flagged 100% in all 5 types.
- My parser had three bugs, all fixed: the #22 unknown-coordinate swap, a missing point for the "y-intercept of ℓ" variant of #24, and float rounding in #25's determinant. None was a generator error.
- Spread: #25 gives zero/one/infinite at 32/33/35%. #22 has 41 distinct answers and #23 has 25 (the most common, 4, is about 8%). The repeated −3 in my samples was chance.
- By hand: 25 samples, all correct.

**SAT-likeness**
- #21 matches CB Q2. #22–#25 follow Acely's templates in College Board phrasing ("The solution to the given system of equations is (x, y)", "The given system of equations has how many solutions?").
- #24's four ways of giving line ℓ, with every distractor passing through the point, make it a strong item.
- #25's mix of a fractional slope-intercept equation and a scaled standard-form equation forces real comparison.
- Difficulty labels are honest.

**Required fixes:** none.

**On track:** 25/125 done (20%).
- By domain: Algebra 10, Advanced Math 5, PSDA 5, Geometry & Trig 5.
- Difficulty: 13 Easy, 9 Medium, 3 Hard. Format: 22 MC, 3 SPR.
- Two clean approvals in a row; the math is still at 0 errors in about 105,000 checked instances.
- Catalog: no changes.

## Batch 6 (#26–#30, advanced-math.js): APPROVED

**Checks**
- `check-generators`: the full run passes (45 categories). The only warning is the accepted one on #25.
- `check-desmos`: clean.
- My own verifier (`/tmp/mgr/verify-b6.js`) evaluates the rendered TeX numerically, 4,000 runs per type.
  - #26: exactly one choice equals the original at 6 test points.
  - #27: exactly one choice meets the discriminant condition (two distinct or no real solutions), for both unknown c and unknown b.
  - #28: the SPR answer is a root, and the only positive root.
  - #29: exactly one choice is (r, 0) with f(r) = 0.
  - #30: the answer equals f(0).
- Result: 0 wrong keys in 20,000 instances, and the control is flagged 100%. As before, the only failures were in my own parser: a test point at a pole, "bx", and "x(".
- Spread: #28 has 54 distinct answers. #30's forms are exponential 50% and quadratic, cubic and vertex about 16% each.
- By hand: 20 samples, all correct (e.g. 3(3x + 7) − 2(5x − 9) = −x + 39; 64 − 8c < 0 → c = 17; (5x − 7)(x + 9) → 7/5).

**SAT-likeness**
- #26 is faithful to CB Q10. The distractors are true error forms: tops and bottoms combined separately, the minus not distributed, and numerators over the product. One display detail: the numerator-and-denominator error can show as −2/(−2x − 6), with a double negative. That is what a student would compute, so it is acceptable.
- #27's rotation between "no real" and "two distinct", and between c and ±b, with the threshold as a distractor, is excellent.
- #28 has 4 equal-weight forms, including the non-standard ones.
- #29's deviation to three general linear factors is correct: an x factor would make (0, 0) a real intercept and clash with the y-intercept distractor.
- #30 asks for (0, k), which avoids a clash with the base b. Its b⁰ = 1 trap is covered in half the questions.
- Difficulty labels are honest.

**Required fixes:** none.

**On track:** 30/125 done (24%).
- By domain: Algebra 10, Advanced Math 10, PSDA 5, Geometry & Trig 5.
- Difficulty: 16 Easy, 9 Medium, 5 Hard. Format: 25 MC, 5 SPR.
- Third clean approval in a row; 0 wrong keys in about 125,000 checked instances.
- Catalog: no changes.

## Batch 7 (#31–#35, problem-solving-data.js): APPROVED WITH FIXES (1 small realism fix)

**Checks**
- `check-generators`: the full run passes (50 categories). The only warning is the accepted one on #25.
- `check-desmos`: clean.
- My own verifier (`/tmp/mgr/verify-b7.js`) parses the rendered text, 4,000 runs per type.
  - #31: rate × time, or amount ÷ rate in minutes.
  - #32: the proportion.
  - #33: every row and column total adds up, and the key equals the right count over the grand total, including joint, row and column events.
  - #34: the sample fraction or percent × N.
  - #35: n·mean − Σ for all three modes, and (n+1)·new mean − n·old mean for the added-box mode.
- Result: 0 wrong keys in 20,000 instances. The control is flagged 100% on #31, #33, #34 and #35, and 83% on #32: my #32 check accepts either ratio direction, so I covered it by hand. The intermediate flags were my parser's ("cm" vs "centimeters", "In person" vs "in-person", unmodeled modes); every flagged sample checked out by hand.
- By hand: 22 samples, all correct (e.g. 2,160/hr → 36/min → 1,440 gal in 40 min; 16/85 white sedans; 24·6 − 118 = 26; 7·12 − 6·10 = 24).

**SAT-likeness**
- #33 is very good: unreduced count/total fractions as CB writes them, tables that add up, and 4 contexts.
- #34 always says "random sample". #35's three modes are realistic (test scores 55–100).
- #31's rates are realistic.
- #32's scale factors vary (×2 is only 13%; ×1.5, ×2.5 and ×4.5 appear), but some instances are unrealistic.

**Required fix**
1. **#32 `rat-proportion` realism.** Map questions ask about up to 48 inches of map distance (a 4-foot map), and recipes use "4 cups of flour for every 6 muffins" (real recipes use about 1.5–3 cups per 12 muffins).
   - Cap the asked map distance at about 15 inches (halves are fine).
   - Keep recipe ratios realistic, with batch sizes in multiples of 6 or 12.
   - Sanity-check the other contexts the same way: dose about 0.1–2 mg/kg is fine as is, and so is the car at 31 mpg.

**On track:** 35/125 done (28%).
- By domain: Algebra 10, Advanced Math 10, PSDA 10, Geometry & Trig 5.
- Difficulty: 21 Easy, 9 Medium, 5 Hard. Format: 27 MC, 8 SPR.
- SPR is catching up (23%). Hard is behind because of the best-sourced-first order; from batch 9 on, batches are Medium/Hard-heavy.
- Math is still at 0 errors in about 145,000 checked instances. Realism is now the main thing being caught.

## Batch 8 (#36–#40, geometry-trig.js): APPROVED WITH FIXES (1 cosmetic fix). #32 realism fix confirmed.

**#32 fix, confirmed:** over 4,000 runs, the longest map distance asked is 15 inches. Recipes now use 1.5–3 cups per 12 muffins. Model and fuel contexts are realistic (e.g. 1 inch = 8 feet; 36 mpg).

**Checks**
- `check-generators`: the full run passes (55 categories). The only warning is the accepted one on #25.
- `check-desmos`: clean.
- My own verifier (`/tmp/mgr/verify-b8.js`) parses the rendered text, 4,000 runs per type.
  - #36: rebuilds the length and width for all four modes and recomputes the area or perimeter.
  - #37: works out the missing side and the opposite/adjacent sides for the asked angle, then sin, cos or tan; all four choices are distinct.
  - #38: the 30-60-90 ABC mode by ratio; I hand-checked the square and equilateral modes.
  - #39: base and apex angles from all three modes.
  - #40: all three modes.
- Result: 0 wrong keys in 20,000 instances. The control is flagged 100% on #36, #37, #39 and #40 (57% on #38 because of the partial automated coverage; hand checks cover the rest).
- By hand: 28 samples, all correct (e.g. cos E = 10/26 = 5/13; BC = 15/√3 = 5√3; an exterior angle of 133° gives an apex of 86°; equilateral side 16 → 8√3; AE = 10·¾ = 7.5).

**SAT-likeness**
- #37 varies the vertex names and right angle, includes the complementary sin B/cos A cases, and uses the 8-15-17, 7-24-25 and 20-21-29 triples.
- #38 covers 30-60-90, the square's diagonal and the equilateral height, with distractors (√2/√3 swapped, multiplying vs dividing) checked to be distinct.
- #39 states the equal sides in words, rotates the apex, and only mentions an extension when an exterior angle is involved.
- #40 states "DE is parallel to BC" explicitly.
- Difficulty labels are honest.

**Required fix**
1. **#40 `geo-similar-parallel-side`: unreduced ratios.** 12% of AE-mode questions say "the ratio of AD to DB is 12 to 4". The SAT always states a ratio in lowest terms ("3 to 1"). Reduce the displayed ratio. If a non-reduced pair is needed for variety, give AD and DB as lengths instead.

**On track:** 40/125 done (32%).
- 10 per domain.
- Difficulty: 23 Easy, 12 Medium, 5 Hard.
- Format: 31 MC, 9 SPR (#14, #22, #23, #28, #30, #31, #34, #35, #36; 23%).
- Hard (5) is behind plan because of the best-sourced-first order. Batches 9–25 hold 35 of the 40 Hard types, so the final mix still lands at about 30/38/32 as planned.
- Quality steady: 0 math errors in about 165,000 checked instances. The fixes requested are now purely realism and cosmetics.

## Batch 9 (#41–#45, algebra.js): APPROVED. #40 fix confirmed.

**#40 fix, confirmed:** 0 unreduced AD : DB ratios in 695 ratio-mode questions (4,000 runs). Letters 24–26%.

**Checks**
- `check-generators`: the full run passes (60 categories). The only warning is the accepted one on #25.
- `check-desmos`: clean.
- My own verifier (`/tmp/mgr/verify-b9.js`) parses the rendered TeX, 4,000 runs per type.
  - #41: applies the stated translation (up, down, left or right) to the line's equation and recomputes the x-intercept.
  - #42: substitutes the answer back. For "no solution" the determinant is 0 and the constants are not proportional; for "infinitely many" the equations are fully proportional.
  - #43: the answer is the unique root.
  - #44: solves for x, then evaluates the asked expression.
  - #45: (total − fee)/rate.
- Result: 0 wrong keys in 20,000 instances. The control is flagged 100% on all 5 types.
- By hand: 20 samples, all correct (e.g. 9x − 10y = 19 style: 11x − 5(y + 7) = 25 → 60/11; x + 7y = 9 with rx − 14y = 12 → r = −2, and 9·(−2) ≠ 12; 7x − 4 = 59 → 21x − 20 = 169).
- #43 shapes: plain 63%, one set of parentheses 31%, both sides 6%.

**SAT-likeness**
- #41 reproduces the real CB item's wording ("…is translated down 4 units in the xy-plane. What is the x-coordinate of the x-intercept of the resulting graph?"), with fraction answers through fracStr.
- #42 has the CB "In the given system of equations, k is a constant" framing, unknowns named k, a or r, and the 30% infinitely-many variant.
- #44's distractors are real near-misses (x itself, a scaled right side, no adjustment).
- #45 has 6 realistic contexts, and the swapped fee/rate distractor (e.g. 11.2) looks like a real error.
- Difficulty labels are honest.

**Required fixes:** none. Optional: #43 could use the "a(x + b) + c = d(x + e)" shape more often (6% now). It is not required.

**On track:** 45/125 done (36%).
- By domain: Algebra 15, Advanced Math 10, PSDA 10, Geometry & Trig 10.
- Difficulty: 26 Easy, 12 Medium, 7 Hard. Format: 33 MC, 12 SPR (27%). SPR is now on target.
- Quality steady: 0 math errors in about 185,000 checked instances.

## Scope change (2026-10-06): Hard types only from here

On the user's instruction, the 43 remaining Easy/Medium entries (#51–#125) are dropped. I also dropped 2 Hard entries for quality: #103 (near-duplicate of #42) and #104 (near-duplicate of #41, and honestly Medium). That leaves 30 Hard types in batches H1–H6 (see the catalog's "Scope change" section). Six of them got tightened specs so the Hard label is honest: #60, #76 (center only), #89, #95, #96 and #112. The final set will be 80 types: 50 built + 30 Hard. Batch 10 (#46–#50) is still reviewed when it arrives.

## Batch 10 (#46–#50, advanced-math.js): APPROVED. progress.md scope bookkeeping confirmed.

**Checks**
- `check-generators`: the full run passes (65 categories). The only warning is the accepted one on #25.
- `check-desmos`: clean.
- My own verifier (`/tmp/mgr/verify-b10.js`), 4,000 runs per type.
  - #46: solves both branches of the absolute value, then the sum, the greater solution, or the single positive solution.
  - #47: solves the line–parabola system. Exactly one choice is a true x (or y) value, and the other intersection is never offered.
  - #48: all three modes (the shifted-y = x² equation is checked pointwise; the vertex of f(x + p) + q; the y-intercept of a shifted exponential).
  - #49: the equation has two distinct real roots; checks the sum or product.
  - #50: solves for the constant from the given root, then the other root. The answer is never the given root.
- Result: 0 wrong keys in 20,000 instances. The control is flagged 100% in all 5 types.
- By hand: 20 samples, all correct (e.g. |5x + 6| = 13 → 7/5 + (−19/5) = −12/5; (x + 8)(2x − 4) = 3x + 7 → 2x² + 9x − 39 → −9/2; x² + ax + 50 with root −5 → a = 15).

**SAT-likeness**
- All five follow the Acely templates in CB phrasing.
- #47 filtering out the second intersection is exactly right.
- #48's change to integer-only exponential keys (no −728/243) was a good call.
- #49 requires rearranging and mostly doesn't factor, so −b/a is the honest efficient method, and Hard is earned.
- #50's non-monic variant (10/21) makes it genuinely Hard.

**Required fixes:** none.

**progress.md, confirmed against the catalog:**
- 125 rows, with 0 id mismatches.
- 43 rows "dropped (scope change)" (all are Easy/Medium #51+), and #103/#104 "dropped (quality)".
- 30 Hard rows are "todo", and their H1–H6 tags in Notes match my assignment exactly.
- 50 built (45 approved or fixed, plus batch 10 now approved).

**On track:** 50/80 done (62.5% of the reduced scope).
- By domain: Algebra 15, Advanced Math 15, PSDA 10, Geometry & Trig 10.
- Difficulty: 26 Easy, 15 Medium, 9 Hard. Format: 35 MC, 15 SPR.
- After H1–H6, the final 80 will be 26 Easy, 15 Medium and 39 Hard (49% Hard), and 56 MC / 24 SPR (30%). The heavy Hard share is the user's choice. Quality: 0 math errors in about 205,000 checked instances.

## H1 (#76–#80, geometry-trig.js): APPROVED

**Checks**
- `check-generators`: the full run passes (70 categories). The only warning is the accepted one on #25.
- `check-desmos`: clean (#79 loads in degree mode).
- My own verifier (`/tmp/mgr/verify-h1.js`) recovers each circle's center and r² from the rendered equation, in either form, 4,000 runs per type.
  - #78: the point lies on the circle; slope = −1 / (radius slope); the y-intercept of the tangent.
  - #77: exactly one choice is strictly inside (or outside); on-circle points correctly don't count.
  - #76: the center matches, and r² > 0.
  - #79: the two angles sum to 90°, both lie strictly between 0° and 90°, k is a whole number, and degreeMode is set.
  - #80: scales the stated ratio's triple to the given side and reads off the asked side.
- Result: 0 wrong keys in 20,000 instances. The control is flagged 100% in all 5 types. The 87 flags on #79 were all my regex missing the "(5n)°" form with no constant; the samples checked out by hand.
- By hand: 20 samples, all correct (e.g. center (−4, −3), r² = 169, point (1, −15) → radius slope −12/5 → tangent 5/12; 3x² + 3y² − 42x − 18y − 18 = 0 → (7, 3); 6n − 12 + 4n − 28 = 90 → n = 13; cos A = 7/25 with DE = 75 → DF = 21).

**Hard-label scrutiny**
- **#78:** expanded form in 50% (complete the square), then the radius slope and its negative reciprocal; 25% go on to the y-intercept. Real multi-step: Hard.
- **#77:** expanded form in 55% (find the center and r²), then a distance comparison, with on-circle and sign-trap points always present: Hard.
- **#76:** 55% have doubled or tripled coefficients, so students must divide before halving, and the "halved but not divided" trap is offered: Hard, per CIR-H-H/L.
- **#79:** recognizing that sin A = cos B means A + B = 90°, then a linear solve under range constraints. Matches RIG-H-L (Hard). Clearly distinct from the original "Trig Identity Evaluation".
- **#80:** carry a ratio across a stated correspondence, then scale a triple. It's the lightest of the five, but it matches College Board's own Hard examples of this type (RIG-H-M/J). Acceptable.

**Required fixes:** none.

**On track:** 55/80 done.
- By domain: Algebra 15, Advanced Math 15, PSDA 10, Geometry & Trig 15.
- Difficulty: 26 Easy, 15 Medium, 14 Hard. Format: 39 MC, 16 SPR.
- 0 math errors in about 225,000 checked instances.

## H2 (#124, #119, #123, #69, #70, advanced-math.js): APPROVED WITH FIXES (3 fixes to keep the Hard label honest)

**Checks**
- `check-generators`: the full run passes (75 categories). The only warning is the accepted one on #25.
- `check-desmos`: clean.
- My own verifier (`/tmp/mgr/verify-h2.js`), 3,000 runs per type.
  - #124 and #123: exactly one choice equals the original at 5 points.
  - #119: finds the actual solution set by substitution over a grid and compares it with the key set (excluded values never count).
  - #69: the key states the right "% / doubles / halved every k".
  - #70: the answer makes both sides equal and is not an identity.
- Result: 0 wrong keys in 15,000 instances. The control is flagged 100% in all 5 types.
- By hand: 20 samples, all correct (e.g. (3x² − 2x + 11)/(x − 1) = 3x + 1 + 12/(x − 1); x(x + 2) − 14(x − 7) = 63 → x = 5 or 7, with 7 excluded → {5}; ⁴√(x⁷)/⁵√(x²) = x^(27/20); 25^(x−4) = 125^(x+5) → x = −23).

**Hard-label scrutiny**
- #124 (leading coefficient 2–3 in half, negative remainders) and #69 (period in words, with a computed per-unit distractor) are honest Hard items.
- Three types each have a mode that is one step, not Hard:
  - **#119:** 15% of questions are a single cross-multiplication with one valid root (6/(x + 5) = 5/(x + 3) → x = 7). That is Medium.
  - **#123:** 30% are a single radical rewritten as one power (⁴√(x⁷) = x^(7/4)). That is one step, Easy to Medium.
  - **#70:** 4.7% have identical exponent expressions on both sides (125^(x − 2) = 25^(x − 2) → x = 2 by inspection).

**Required fixes**
1. **#119:** replace the simple-proportion mode with a quadratic-after-clearing mode where both roots are valid (key {r₁, r₂}). That keeps the answer pattern unguessable (none / one excluded / both valid) while every question needs clearing, solving and checking.
2. **#123:** replace the single-radical mode with a two-step form, such as a radical times a power (⁴√(x⁷)·x^(−1/2)), a nested radical (√(x·∛x)), or the coefficient form (64x⁶)^(4/3). That form appears in the spec but my sample of 4,000 found none. Make sure it actually appears.
3. **#70:** reject instances where the two exponent expressions are identical (or are equal multiples that make the answer obvious by inspection).

**On track:** 60/80 done.
- By domain: Algebra 15, Advanced Math 20, PSDA 10, Geometry & Trig 15.
- Difficulty: 26 Easy, 15 Medium, 19 Hard. Format: 43 MC, 17 SPR.
- 0 math errors in about 240,000 checked instances. The defects caught in the Hard phase are difficulty honesty, as intended.

## H3 (#111, #112, #113, #114, #94, problem-solving-data.js): APPROVED WITH FIXES (3 realism fixes). H2 fixes confirmed.

**H2 fixes, confirmed**
- #119 now uses "both roots valid" in place of the one-step mode (builder's mix: 1,200 / 1,005 / 795).
- #123 has no single-radical mode any more. Its modes over 4,000: coefficient 912, nested 457 + 675 (√(x³∛x²) style), radical × power 726, product 644, quotient 586. The coefficient form does appear now.
- #70 rejects identical exponents.
- The H2 verifier still finds 0 failures, and its control is flagged 100%.

**Checks**
- `check-generators`: the full run passes (85 categories). The warnings are the accepted #25 and `geo-triangle-area-coordinates` (H4, still in progress, so ignored).
- `check-desmos` on H3 plus the H2 fixes: clean.
- My own verifier (`/tmp/mgr/verify-h3.js`), 3,000 runs per type.
  - #111: solves p₁N ± Δ·[subgroup] = p₂(N ± Δ) for all three variants, original or current total.
  - #112: the weighted-mean identity for all ask types.
  - #113: (f(b) − f(a))/(b − a) for formula models and horizontal tables.
  - #114: derives x from the stated conditional probability, checks it's a whole number, and checks the follow-up overall probability.
  - #94: all three ratio variants.
- Result: 0 wrong keys in 15,000 instances. The control is flagged 100% in all 5 types. All interim flags were my parser's; each flagged sample checked out by hand.
- By hand: 24 samples, all correct (e.g. 0.8N − 20 = 0.4(N − 20) → N = 30; 12·80 + 66n = 72(12 + n) → n = 16; h(2) = 101, so (101 − 5)/2 = 48 ft/s; x/(x + 18) = 1/4 → x = 6 → 32/86; juice 35 : water 5 → 5 : 4 → add 23).

**Hard-label scrutiny**
- All five are genuinely multi-step: 75% of #112 are reverse questions; #114 has no totals row and 50% are two-step; #113 needs function evaluation on non-zero intervals; #111 and #94 need an equation set up from a change.

**Required fixes** (all realism; the math is correct)
1. **#114 offers probabilities greater than 1.** 30% of questions (1,212 of 4,000) include a choice such as 32/24 or 33/30. An impossible probability is a giveaway, and the SAT never offers one. Every probability choice must be between 0 and 1. Replace the "x over the given total" style error with a valid fraction error (e.g. the wrong row, or the other column).
2. **#112 offers impossible means.** 37% of mean-ask questions (1,008 of 2,710) offer an out-of-range value: a mean height of 92–99 inches, or a test score of 145 or 168.5. Every choice must be plausible for its context: scores 0–100, heights about 48–90 inches, and so on. Drop or replace any distractor outside the range.
3. **#111 changes are unrealistically large.**
   - In 37% of questions the joining or leaving count exceeds 40% of the original group, e.g. 112 violinists join an orchestra of 112, or 42 of 56 violinists leave.
   - In 27% the percent changes by more than 25 points (80% → 40%).
   - The SAT pattern (PER-H-B) uses modest shifts, such as 40% → 50% with 6 joining. Cap the change at about 40% of the original total and the percent shift at about 25 points.

**On track:** 65/80 done.
- By domain: Algebra 15, Advanced Math 20, PSDA 15, Geometry & Trig 15.
- Difficulty: 26 Easy, 15 Medium, 24 Hard. Format: 46 MC, 19 SPR.
- 0 math errors in about 270,000 checked instances. The Hard-phase defects are realism and difficulty honesty, caught and fixed batch by batch.

## H4 (#97, #98, #100, #96, #60, geometry-trig.js): APPROVED. H3 realism fixes confirmed.

**H3 fixes, confirmed (my own measurements, 4,000 runs each)**
- #114: 0 probability choices ≥ 1.
- #112: 0 out-of-range choices in 2,222 mean-ask questions.
- #111: 0 changes over 40% of the original total, and 0 swings over 25 points.
- The H3 verifier still finds 0 wrong keys.

**Checks**
- `check-generators`: the full run passes (85 categories). The only warning is the accepted one on #25; the earlier #96 letter warning is gone.
- `check-desmos`: clean.
- My own verifier (`/tmp/mgr/verify-h4.js`), 3,000 runs per type.
  - #97: converts the stated ratio (edge, area or volume) to a length scale, then to the asked quantity, for the larger or smaller solid.
  - #98: the product of the dimension factors, with the radius factor squared.
  - #100: closes the altitude relations (CD² = AD·DB, AC² = AD·AB, CD = AC·BC/AB, …) for every ask.
  - #96: shoelace area from the printed vertices.
  - #60: all four two-step modes.
- Result: 0 wrong keys in 15,000 instances. The control is flagged 100% in all 5 types. Interim flags were my parser's (an inverted conversion, missing phrasings); every one checked out by hand.
- By hand: 24 samples, all correct (e.g. volumes 27 : 125 → lengths 3 : 5 → SA × 25/9 → 125; ½ · 4 · ⅓ = 2/3; √(25 · 144) = 60; shoelace for (−2, −4), (0, 3), (−6, 4) → 22; a 972π sphere → r = 9 → d = 18).
- #60 variety: 112 distinct questions in 3,000. That is adequate, and more than the checker's floor.

**Hard-label scrutiny:** all honest.
- #97: 83% are two-step (area → length → volume).
- #98: three dimensions changed, always including a reduction, with the radius squared.
- #100: geometric-mean relations, including the leg-pair ask.
- #96: 87% have no axis-parallel side (box subtraction or shoelace).
- #60: every mode needs two steps.

**Required fixes:** none.

**On track:** 70/80 done.
- By domain: Algebra 15, Advanced Math 20, PSDA 15, Geometry & Trig 20.
- Difficulty: 26 Easy, 15 Medium, 29 Hard. Format: 50 MC, 20 SPR.
- 0 math errors in about 300,000 checked instances.

## H5 (#88, #90, #89, #122 in advanced-math.js; #105 in algebra.js): APPROVED WITH FIXES (1 small Hard-honesty fix)

**Checks**
- `check-generators`: the full run passes (90 categories). The only warning is the accepted one on #25.
- `check-desmos`: clean.
- My own verifier (`/tmp/mgr/verify-h5.js`), 3,000 runs per type.
  - #88: each choice is checked against the stated zeros, their multiplicity (sign change for "crosses", none for "touches"), "no other x-intercepts" by sampling, and the stated point. Exactly one choice passes, and it is the key.
  - #90: rebuilds a from the point (or from f(0)), then the max/min, f(k) or y-intercept; also checks that "maximum" goes with a < 0.
  - #89: rebuilds S and P from each condition pair (sum and product, sum and sum of squares, area and perimeter, diagonal and area) and checks the asked smaller/larger value, product or perimeter, with whole-number pairs.
  - #122: random-substitution test of every choice against the formula. Exactly one inverts it.
  - #105: separately checked the 766 money-variant keys directly, all correct.
- Result: 0 wrong keys in 15,000 instances. The control is flagged 100% in all 5 types. All interim flags came from my parser (a subscript regex that ate a brace, comma-formatted dollars, and the f(0) and product/perimeter asks); every one checked out by hand.
- By hand: 22 samples, all correct (e.g. −2(x + 5)(x + 2)² at 0 = −40, with the near-miss −4(x + 5)(x + 2) failing the touch; a = −1 → max 36; sum 35 and squares 617 → 16 and 19; d = √(Gm₁m₂/F); 0.2x + 0.5(80 − x) = 35.2 → 16).

**Hard-label scrutiny**
- #88: multiplicity and degree-4 variants, with seven checked error types. Hard.
- #90: two steps (find a, then the feature). Hard.
- #89: always two conditions → a quadratic system. Hard. The retitle to "Two Quantities from Two Conditions" is fine, since the product-and-difference variant reduced to one quadratic.
- #105: mixture with the target strictly between the two rates. Hard per the catalog.
- #122: 74% need a root or squaring. The linear share is 26%. Most of the linear pairs (cone h, trapezoid b₁, r in A = P(1 + rt)) still take at least two steps with fractions, but **Fahrenheit ↔ Celsius (8.7% of questions) is a classic Medium item**.

**Required fix**
1. **#122:** remove the F = (9/5)C + 32 → C pair. Keep the linear share at about 20% or less.

**On track:** 75/80 done.
- By domain: Algebra 16, Advanced Math 24, PSDA 15, Geometry & Trig 20.
- Difficulty: 26 Easy, 15 Medium, 34 Hard. Format: 53 MC, 22 SPR.
- 0 math errors in about 330,000 checked instances. H6 (5 types) remains.

## H6 (#95, #115, #125 in problem-solving-data.js; #121 in algebra.js; #99 in geometry-trig.js): APPROVED. #122 fix confirmed.

**#122 fix, confirmed:** no Fahrenheit/Celsius questions in 3,000 runs. The linear share is 8% by my stricter measure (16% by the builder's), both under the 20% target.

**Checks**
- `check-generators`: the full run passes (95 categories, 2,000 runs each). The only warning is the accepted one on #25.
- `check-desmos`: clean.
- My own verifier (`/tmp/mgr/verify-h6.js`), 3,000 runs per type.
  - #121: computes the vertex, and a grid search over the feasible region confirms it really is the max or min in the asked coordinate (bounded), including the "if b is as large as possible, what is a" asks.
  - #95: product of the dimensions ÷ or × factor², or factor³, for the plain area and volume modes; checks answers are whole numbers within 5 characters.
  - #115: the interval-overlap rule picks the key ("not convincing" vs "likely greater in the higher one"); the sample-size variant's key is "decrease".
  - #125: random assignment + volunteers → causal claim, scoped to people like the volunteers; observational → association only.
  - #99: my own rule engine (SAS, ASA, AAS, SSS; AA, SAS similarity, SSS similarity; SSA and AAA-for-congruence rejected) confirms the given facts alone are insufficient and exactly one choice makes them sufficient.
- Result: 0 wrong keys in 15,000 instances. The control is flagged 100% on #121, #115 and #99. It is partial on #95 (45%, since only the plain modes are automated) and #125 (80%); I hand-checked samples of both.
- By hand: 15 samples, all correct (e.g. y ≤ −3x + 6 with −x + 2y ≤ 5 → vertex (1, 3); 26·18/9 = 52; intervals 52–62 vs 58–64 overlap → "not convincing"; the included angle B gives SAS similarity).

**Hard-label scrutiny:** all honest.
- #121: find the vertex, and reason about which way the region is bounded.
- #95: the squared or cubed factor, plus cost/bag modes.
- #115: an inference about overlapping intervals.
- #125: scope versus design reasoning.
- #99: sufficiency logic.
- Optional polish: #121 says "the system of inequalities above". The digital SAT says "the given system". Not required.

**Required fixes:** none.

---

# FINAL SUMMARY (2026-10-07)

**Inventory.** 80 new types plus the original 15, for 95 categories in all. The counts below come straight from the code; my running tallies in earlier entries drifted by one in difficulty and format, and these are the correct figures.

| | Count |
| --- | --- |
| Algebra | 17 |
| Advanced Math | 24 |
| Problem-Solving & Data Analysis | 18 |
| Geometry & Trigonometry | 21 |
| Easy / Medium / Hard | 27 / 15 / 38 |
| MC / SPR | 55 / 25 (31% SPR) |

- All 19 official skills are covered.
- Thinnest skills: linear functions 2, inequalities 2, two-variable data 2, probability 2, inference 2, evaluating claims 1.
- The Hard tilt (48%) reflects the user's scope change (build only the remaining Hard types).

**Verification.**
- About 360,000 generated questions were independently re-solved by my verifiers (written separately from the builder's), plus about 400 samples solved by hand.
- **0 wrong answer keys were found in any shipped generator.** Every verifier was validated with a shifted-key control.
- Defects caught and fixed during review:
  - answer-letter skew (#5);
  - article errors ("a 800");
  - unrealistic data or distractors: #14 frequencies, #32 maps and recipes, #111 shifts, #112 means of 145 or 168.5, #114 probabilities above 1;
  - an unreduced ratio (#40);
  - "Hard" labels that weren't earned (#119, #123, #70, #122);
  - the #7 "Infinitely many" case being missing.
- Dropped for quality: #103 and #104 (near-duplicates), plus 10 candidates cut before building.

**Worth the user's attention**
1. **Linear functions has only 2 types,** though it is College Board's largest Algebra skill. #83 and #84 were planned but dropped as Medium under the scope change. They are the best candidates if the user wants more Algebra variety.
2. **Statement-choice types** (#2, #3, #115, #125, #99, #93-style) have fixed-phrase choices. They are correct and SAT-faithful but less varied than the numeric types. Worth a quick in-app look.
3. **#80 `trig-similar-triangle-ratio`** is the lightest Hard type (it matches College Board's Hard examples, but only just). #60 has the lowest variety (about 110 distinct questions in 3,000).
4. **#25 `sys-number-of-solutions`** keeps a permanent checker warning ("Exactly two" is never correct). This is correct by design.

**Left open**
- The optional "given system" wording polish in #121.
- `index.html.bak` is untouched (87,416 bytes).
- No gap-filling types were added, per the scope change.
