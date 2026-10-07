# SAT Math research (deep-research run, 2026-10-05)

From the deep-research workflow (run `wf_e2f57b93-7cd`). It searched from 5 angles, fetched 21 sources and pulled out 92 claims. It verified 25 of them with 3 independent votes each: 17 confirmed, 2 refuted, 6 not checked because the usage limit was hit. The final synthesis step didn't run. The summary below is written from the confirmed claims, and every extracted claim is listed after it by source.

## Official format (confirmed 3-0 against College Board sources)

- **44 questions** in two adaptive modules of 35 minutes each (70 minutes total). Each module has 20 scored questions and 2 unscored pretest questions. Within a module, questions run **easy to hard**, and every module covers all four domains.
- **Domains and weights** (out of 40 scored questions): Algebra ≈35% (13–15), Advanced Math ≈35% (13–15), Problem-Solving & Data Analysis ≈15% (5–7), Geometry & Trigonometry ≈15% (5–7).
- **Answer formats:** ≈75% four-option multiple choice (28–32) and ≈25% student-produced response (SPR, 8–12). SPR questions per domain on the SAT: Algebra 3–4, Advanced Math 3–4, PSDA 1–2, Geometry/Trig 1–2.
- **About 30% are word problems** set in a real-world context; the other ~70% are pure math.
- **The 19 official skills:**
  - *Algebra (5):* linear equations in one variable; linear equations in two variables; linear functions; systems of two linear equations in two variables; linear inequalities in one or two variables.
  - *Advanced Math (3):* equivalent expressions; nonlinear equations in one variable and systems of equations in two variables; nonlinear functions. Covers absolute value, quadratic, exponential, polynomial, rational, radical and other nonlinear equations.
  - *Problem-Solving & Data Analysis (7):* ratios, rates, proportional relationships and units; percentages; one-variable data (distributions, measures of center and spread); two-variable data (models and scatterplots); probability and conditional probability; inference from sample statistics and margin of error; evaluating statistical claims (observational studies and experiments).
  - *Geometry & Trigonometry (4):* area and volume; lines, angles and triangles; right triangles and trigonometry; circles. This includes congruence, similarity, vertical angles, parallel lines cut by a transversal, the Pythagorean theorem, special right triangles, unit-circle trig, radians and circle theorems.
- **Difficulty:** question-bank items are tagged Easy, Medium or Hard.
- **Calculator:** the built-in Desmos graphing calculator is available on every math question. There is no no-calculator section.

## SPR (grid-in) answer rules

- Students type their own answer. Negative answers are allowed (the official sample keys include −32). An answer can be accepted in several equivalent forms (one sample lists both 3.44 and 86/25), and some questions accept any of several correct values.
- The claim about character limits ("up to 6 characters, only the first may be a negative sign") was **refuted 1-2**. Its exact wording didn't survive verification, so treat it as approximate. In practice the widely cited rule is up to 5 characters for a positive answer and 6 for a negative one, with long decimals truncated or rounded to fill the space.

## Where to find question types (best sources for building the list)

- **outlierlearning.substack.com/p/an-evolving-sat-data-base**: sorts *every* question in College Board's question bank into fine-grained recurring types coded by skill and difficulty. For example, Circles has 22 types (CIR-E-A … CIR-H-P), Percentages 37 (PER-E-A … PER-H-Q) and Right Triangles & Trig 28 (RIG-E-A … RIG-H-Q). **This is the main source for the type list.**
- **acely.com/desmos-guide-library/**: a library of Desmos walkthroughs, each named by template (for example "linear systems: no solutions w/ slider (SPR)", "number of points of intersection", "point of intersection").
- **satsuite.collegeboard.org/media/pdf/digital-sat-sample-questions.pdf**: official sample questions with explanations of each wrong choice.
- **College Board question bank** (satsuitequestionbank.collegeboard.org): filter by domain, skill and difficulty.
- Bank sizes per skill (from the outlier post): Nonlinear Functions is the largest (≈179–250), then Linear Functions ≈163, Nonlinear equations/systems ≈162, One-Variable Data 71, Percentages 67, Two-Variable Data 63, Ratios/Rates 57, Lines/Angles/Triangles 49, Area/Volume 44, Right Triangles/Trig 38, Probability 36, Circles 29, Inference/Margin of Error 22–27, Evaluating Statistical Claims 10–11. Weight the number of types toward the large skills.

## Distractor patterns (from sources; the official ones were not voted on before the limit hit)

- Each multiple-choice distractor reflects a specific, predictable error on the same numbers (College Board says this about its own items). Example: 40% are red and 30% of those are striped, so the key is 12%; the distractors are 40−30=10%, 40+30=70% and 30/40=75%.
- **A related quantity that answers a different question:** the other variable in a system, the vertex's x-coordinate instead of the minimum value, the y-intercept instead of the slope, arc length instead of circumference, x instead of 2x.
- Sign errors (a dropped negative, distributing a negative incorrectly), off-by-one errors, unit mix-ups (cm vs m, radius vs diameter).
- Percent traps: adding successive percents (10% then 20% off ≠ 30% off); multiplying by 1.36 instead of dividing by 0.64 for reverse percents; using 0.05 or 5 as the growth factor instead of 1.05; confusing linear (additive) change with exponential (multiplicative) change.
- Function traps: plugging the value straight into f(x+2) instead of solving x+2 = value first; getting the direction of a horizontal shift wrong.
- Numeric choices are usually listed in increasing order, and the right answer is usually in the cluster of close values.

## Where Desmos helps (and where it doesn't)

- **Helps:** systems (read off the intersection), one-variable equations of any kind (graph both sides), vertex/zeros/intercepts, equivalent expressions (graph the original and each choice; the one that overlaps is correct), unknown constants (sliders), regressions with `y_1 ~ m x_1 + b`, and statistics (`mean`, `median`, `stdev`).
- **Doesn't help:** one-step arithmetic, quick percent calculations, purely symbolic expressions with only letters, and most interpretation or statistics-reasoning questions.
- **Watch out:** Desmos starts in radians, so trig questions in degrees need degree mode.

---

# All extracted claims by source


## open-exam-prep.com

<https://open-exam-prep.com/study-guides/sat-math/introduction/desmos-calculator-mastery>  

- On the digital SAT, the built-in Desmos graphing calculator is available for every Math question in both modules. No section is calculator-free.
  > The built-in Desmos calculator is available on 100% of questions across both modules
- For non-linear systems such as a line meeting a parabola, graphing both equations in Desmos finds the intersection points and the number of solutions faster than substitution or the quadratic formula. The page's example is y=2x+1 and y=x^2-3x+5, which meet at (1,3) and (4,9), so there are 2 solutions.
  > Plotting both curves takes 10 seconds; avoids complex substitution and quadratic formula factoring
- Desmos speeds up questions that ask for a quadratic's vertex or its minimum or maximum, because one click on the graph shows the vertex coordinates and you skip completing the square. Its regression feature (y1 ~ m x1 + b for linear, y1 ~ a x1^2 + b x1 + c for quadratic) turns a table of points into an equation faster than working out the slope by hand.
  > Graphing directly reveals the vertex coordinates with one click; avoids completing the square.
- Desmos does not help on some question types. Simple one-step linear equations are faster to solve in your head. Abstract expressions that use only letters such as a, b, c and d and no numbers need algebra (factoring rules), not graphing.
  > Solving 3x=24 ⟹ x=8 takes 3 seconds mentally; typing into Desmos takes 8 seconds.
- Two techniques recur in the page's examples. First, for 'equivalent expression' multiple-choice questions, graph the original function and all four answer choices; the correct choice is the one whose graph lies exactly on the original. Second, use a slider to find an unknown constant that makes the graph meet the question's condition. The page also warns that Desmos starts in radians, so you must switch it to degrees for angle questions.
  > Graph the original function f(x) on line 1, graph the 4 choices on lines 2–5. The correct choice will perfectly overlap line 1.

## vibrantpublishers.com

<https://www.vibrantpublishers.com/blogs/blogs-on-act-sat/how-to-use-the-desmos-calculator-on-the-digital-sat>  

- On the digital SAT, the Desmos graphing calculator sits in the Math section toolbar and opens in a side panel next to the question. The page does not say whether this holds for both modules.
  > During the Math section, you'll see a calculator icon in the toolbar — click it and Desmos opens in a side panel next to your question.
- Desmos speeds up systems-of-equations questions: you graph each equation and read off the intersection point that Desmos highlights. This works for linear systems, linear-quadratic intersections, and systems where one equation is an inequality.
  > Type each equation on a separate line. The graph will show both lines, and Desmos will automatically highlight the intersection point. ... This works for linear systems, quadratic intersections, and even cases where one equation is an inequality.
- Desmos is especially useful for quadratic questions that ask for zeros, vertex or intercepts, because finding the vertex by hand means completing the square.
  > especially powerful for quadratic equations, where finding the vertex by hand involves completing the square.
- For data-analysis questions, Desmos can fit a line of best fit to a table and report its slope and intercept. Its built-in statistics functions, such as median([...]), return measures of center directly. Note: the page gives the regression syntax as 'y = mx + b', but Desmos actually fits a regression with a tilde, as in y1 ~ mx1 + b. The tilde may have been lost when the page was fetched.
  > Click the '+' button and insert a table. Enter your x and y values. ... Then, on a new line, type y = mx + b. Desmos will calculate the slope (m) and intercept (b) automatically and draw the line. ... Type median([14, 3, 27, 8, 11]) and it will return the answer instantly.
- Desmos does not save time on problems you can solve by hand in under 20–30 seconds, such as two-step linear equations, basic arithmetic and percentage calculations. Desmos sliders help most with questions about an unknown constant.
  > if a problem would take you less than 20–30 seconds to solve by hand, just solve it by hand. ... simple linear equations you can solve in two steps, basic arithmetic and percentage calculations

## acely.com

<https://acely.com/sat-prep/desmos-cheat-sheet>  
<https://acely.com/desmos-guide-library/linear-systems-of-equations-no-solutions-w-slider-spr>  

- On the digital SAT, the built-in Desmos graphing calculator is available for every math question, and there is no separate no-calculator section.
  > the built-in Desmos graphing calculator is available for every question ... There is no no-calculator section
- Desmos meaningfully speeds up single-variable equations of many types (linear, absolute value, radical, rational, quadratic, exponential, logarithmic): graph each side and read the x-coordinate of the intersection.
  > Graph each side of the equation separately ... The x-coordinate of the point where the graphs intersect is the solution
- For quadratics, equivalent-expression, and systems-of-equations questions, students can click graphs to reveal vertices, intercepts, and intersection points, or check equivalence by seeing whether two graphs overlap exactly.
  > Graph both expressions as y= equations. If the graphs overlap exactly, the expressions are equivalent
- Regression and data-fitting questions can be solved by entering a table and typing a tilde regression such as y1 ~ m*x1 + b. Desmos then returns the slope and y-intercept, and quadratic and exponential models work the same way.
  > Desmos will calculate the slope (m) and y-intercept (b)
- Desmos is most efficient for systems of equations, single-variable equations, function evaluation, quadratics, regressions and statistics (mean, median, standard deviation via built-in commands). It is less efficient for single-step arithmetic and simple algebra. Degree/radian mode confusion on trig problems is a common costly mistake.
  > Always check radians vs. degrees: Before any trigonometry problem, open the Settings (wrench icon)
- Acely, a commercial SAT prep site, files the template 'find the constant that gives a linear system no solutions' under Algebra, rates it Hard, and lists it as a student-produced response (SPR) question rather than multiple choice.
  > Linear Systems of Equations – No solutions w/ slider (SPR) ... Algebra , Hard
- The math condition behind this template: a linear system has no solution exactly when the two lines have the same slope and different y-intercepts, so a generator should pick a constant k that makes the slopes equal but keeps the intercepts different.
  > A linear system of equations has no solution when the lines represented by the equations are parallel, meaning they have the same slope but different *y*-intercepts, thus never intersecting in the coordinate plane.
- The Desmos strategy: type both equations as given. Desmos offers a slider for any letter other than x or y (here k), and the student drags it until the lines look parallel. This makes the template one where Desmos speeds up the solution.
  > When inputting a letter other than *x* or *y*, Desmos will prompt you to add a slider. ... Drag the slider left or right to change the value of *k* and change the orientation of the second line.
- In the worked example the SPR answer is a negative integer (k = –6). This shows that negative constants are expected answers for this grid-in type.
  > Upon inspecting the lines, the system of equations will have no solutions when *k* = –6.
- Acely's library treats linear systems as a group of related, separately named templates: no solutions with a slider (SPR), number of points of intersection, number of solutions, and point-of-intersection solution (SPR).
  > Up Next ... Linear Systems of Equations – Number of Points of Intersection ... Linear Systems of Equations – Number of Solutions ... Linear Systems of Equations – Point of intersection Solution (SPR)

## collegeprep.uworld.com

<https://collegeprep.uworld.com/blog/digital-sat-built-in-calculator-usage-and-tips/>  

- The digital SAT gives students a built-in Desmos graphing calculator for the whole Math section. Unlike the old paper SAT, there is no separate no-calculator portion.
  > The built-in Desmos calculator is available for the entire SAT Math section. There is no separate no-calculator portion like in the old paper-based SAT.
- Students may use an approved handheld calculator alongside the built-in calculator or in place of it.
  > an approved handheld calculator that meets SAT calculator guidelines
- According to UWorld, the built-in calculator helps most with function questions, systems of equations, and questions that ask students to interpret relationships, data or graphs. Graphing shows intercepts and intersections faster than multi-step algebra does.
  > especially useful for function questions, systems of equations, and visual interpretation problems. ... Graphs can reveal intercepts, intersections, and behavior faster than multi-step algebra.
- UWorld says linear and quadratic equations come up often on the SAT and are especially well suited to graphing in the calculator.
  > This is especially helpful for linear and quadratic equations, which appear often on the SAT.
- The built-in calculator can do basic and scientific calculations, graph equations, plot points and build tables. It handles fractions, exponents, square roots, absolute values and trigonometric expressions. UWorld advises using it only for long calculations, complex numbers or problems where a visual helps.
  > it supports fractions, exponents, square roots, absolute values, and trigonometric expressions ... Skip it for simple math and use it when calculations are long, numbers are complex, or visual tools add clarity.

## theaxiomacademy.org

<https://theaxiomacademy.org/learn/sat-common-traps-avoid>  

- A common SAT Math trap, and so a distractor pattern for answer choices, is an option equal to a correctly computed intermediate value when the question asks for a related quantity, such as 2x or half of that value.
  > You calculate a value correctly, but the question asks for a different form of that value (like 2x the value, or half the value).
- Unit and quantity mismatches are a recurring SAT trap: answering in the wrong unit (centimeters instead of meters) or giving the radius when the diameter was asked for.
  > The question asks for meters, but your calculation gave centimeters. Or you calculated the radius when the question asked for diameter.
- Missing or misreading a negative sign is one of the easiest SAT Math mistakes to make, which makes sign-flipped answers a likely distractor.
  > A tiny negative sign can change everything. Missing or misinterpreting a negative sign is one of the easiest mistakes to make.
- Arithmetic sign errors, such as distributing a negative incorrectly or adding and subtracting negative numbers carelessly, are a common SAT trap.
  > Distributing negatives incorrectly or making careless sign errors when adding/subtracting negative numbers is surprisingly common.
- The page claims that not every SAT problem needs a complicated method, and that overthinking leads students away from the correct answer.
  > Not every SAT problem requires a complicated solution. Sometimes the straightforward approach is correct, and overthinking leads you away from the right answer.

## ivymax.com

<https://ivymax.com/blog/cpp/top-10-sat-prep-mistakes-guide/>  

- A recurring SAT function question type gives a shifted input (e.g., f(x + 2) = 2x + 3) and asks for f(a specific value). The common wrong answer comes from plugging the value straight into the expression instead of first solving x + 2 = 6.
  > If f(x + 2) = 2x + 3, find f(6) ... They try to plug directly without adjusting for the shift. ... x + 2 = 6 → x = 4 → f(6) = 2(4) + 3 = 11
- SAT 'two-step' questions ask for an expression of the solution rather than the variable itself (e.g., solve for x, then find 2x). A predictable distractor is the value of x alone.
  > Solve for x, then find 2x. ... Students solve x correctly but forget the second step ... SAT often hides an extra step.
- In SAT math word problems, a common trap is mistranslating English into an equation, for example writing x + 12 = 5 instead of x + 5 = 12 for 'a number increased by 5 is 12'.
  > A number increased by 5 is 12 ... They mis-translate English into math. ... Most math mistakes are not math—they are reading errors in disguise.
- SAT graph-interpretation questions test whether students connect the visual data to the exact wording of the question, and most errors come from misreading what the graph shows, not from the math.
  > Most mistakes happen not from math—but from misreading what the graph actually shows.
- The article gives no specifics about the digital SAT format: no domains, question counts, Desmos policy or grid-in rules. Most of its 10 'question types' are Reading/Writing traps, not Math.
  > Evidence-Based Reading Questions (The "Looks Right" Trap) ... Paired Evidence Questions ... Vocabulary in Context ... Extreme Language Trap ... Trap Answer Matching the Passage but Not the Question

## sat.blog.targettestprep.com

<https://sat.blog.targettestprep.com/sat-percent-problems/>  

- SAT percent questions fall into seven recurring templates: 'percent of', sales tax (total cost), percent decrease (reverse to the original price), percent change between two values, successive percent markdowns, simple interest, and reading percents from data tables or charts.
  > Question types covered: 1. "Percent of" 2. Sales Tax 3. Percent Decrease 4. Percent Change 5. Successive Percent Markdown 6. Simple Interest 7. Percents in Data Interpretation Charts (e.g., 'What percent of renters are single?' from frequency table)
- Successive percent discounts are tested with the additive-percent trap as a wrong answer choice. For example, $15 marked down 10% and then another 20% correctly comes to $10.80 (15 x 0.90 x 0.80). The choice $10.50 is what a single 30% discount would give.
  > $15 socks marked down 10%, then 20% more. Final price? ... A) $9.70, B) $10.00, C) $10.50, D) $10.80 (Answer: D) ... Successive Discounts: Multiply remaining percentages (e.g., 0.90 × 0.80)
- Reverse-percent (original value) questions give the price after a percent decrease and ask for the original price. In the example, a 36% reduction leaves $57.60 and the original is $90. One distractor ($78) matches the wrong method of multiplying the new price by 1.36; that reading of the distractor is inferred, since the article only lists the choices.
  > After the price of a handbag was reduced by 36%, its new price was $57.60...What was the original price? A) $78, B) $90, C) $94, D) $95 (Answer: B) ... final price = (original price)(100% – percent decrease)
- Simple-interest percent problems appear as student-produced response (grid-in) questions solved with I = Prt. In the example, $600 at 7% per year for 3 years gives a total repayment of 726.
  > Mark borrows $600 at 7% simple interest per year for 3 years. How much does he pay? (Answer: 726) ... the simple interest example is explicitly identified as a "student-produced response (SPR)" question ... Simple Interest: "I = P x r x t"
- A digital SAT Math section has 44 questions and about 2-3 of them are percent questions. Percent questions belong to Problem-Solving and Data Analysis, which together with Geometry and Trigonometry makes up the remaining 30% of the section (about 15% each).
  > You can expect to see 2–3 percentage questions on the SAT Math section. ... There are a total of 44 questions in the SAT Math section. ... Problem Solving and Data Analysis questions and Geometry and Trigonometry questions make up the other 30%, at about 15% for each of those 2 categories.

## sparkl.me

<https://sparkl.me/blog/sat/patterns-in-sat-answer-choices-students-often-miss/>  

- SAT math multiple-choice distractors are typically built from predictable student errors: sign mistakes, off-by-one errors, incorrect simplification, or plugging in the wrong value.
  > Math multiple-choice answers are an engineer's playground. Distractors are often drawn from predictable student errors: sign mistakes, off-by-one errors, incorrect simplification, or plugging the wrong value.
- SAT math answer sets often include choices that are identical except for a negative sign or a unit conversion (e.g., meters vs. centimeters), meant to catch students who drop a minus sign or skip converting units.
  > Look for answers that are identical except for a negative sign or a unit conversion (meters vs centimeters, for instance). ... Those are designed to catch students who forgot to carry a minus sign or convert units.
- When three answer choices are numerically close, the correct answer is usually in that cluster and the other close values come from arithmetic mistakes.
  > When three choices are numerically close, that usually means the correct answer is near that cluster and that the near misses result from arithmetic mistakes.
- Numeric SAT math answer choices are often listed in numerical order, so when backsolving a student can start by testing the middle value.
  > Start with a middle value if choices are ordered numerically.
- Absolute words like 'always', 'never' and 'entirely' are usually wrong, but the article says this about the Reading section, not Math.
  > Extreme words like always, never, and entirely are commonly wrong in Reading; passages are nuanced, and absolute terms rarely fit.

## satsuite.collegeboard.org

<https://satsuite.collegeboard.org/k12-educators/about/alignment/math/psat-10-psat-nmsqt-sat>  
<https://satsuite.collegeboard.org/media/pdf/assessment-framework-for-digital-sat-suite.pdf>  
<https://satsuite.collegeboard.org/higher-ed-professionals/sat-validity/content-domains>  
<https://satsuite.collegeboard.org/digital/whats-on-the-test/math/student-produced>  
<https://satsuite.collegeboard.org/digital/whats-on-the-test/math/types/advanced>  
<https://satsuite.collegeboard.org/digital/whats-on-the-test/math/overview>  
<https://satsuite.collegeboard.org/media/pdf/digital-sat-sample-questions.pdf>  

- College Board tags each digital SAT math question with three levels: a domain (Algebra, Advanced Math, Problem-Solving and Data Analysis, or Geometry and Trigonometry), a skill, and a narrower testing point. Examples are Algebra > Linear functions > 'Evaluate a linear function given an input value' and Advanced Math > Nonlinear equations > the number of real solutions of a quadratic. Each testing point can serve directly as a generator template ID.
  > Domain Advanced Math Skill Nonlinear equations in one variable and systems of equations in two variables Determine the conditions under which a quadratic equation has zero, one, two, or infinitely many real solutions
- Official multiple-choice distractors are built from specific, predictable procedural errors on the same numbers. In the percent-of-a-percent item (40% red, 30% of those striped, key 12%), the wrong choices are 40−30=10%, 40+30=70%, and 30/40=75%.
  > Choice A is incorrect and may result from subtracting 30% from 40% rather than calculating 30% of 40%. Choice C is incorrect and may result from adding 30% and 40% rather than calculating 30% of 40%. Choice D is incorrect and may result from calculating the percentage that 30% is of 40% rather than calculating 30% of 40%.
- A common official distractor is a related quantity that answers a different question. Examples: the other variable in a system (raspberries instead of blackberries), the x-coordinate of the vertex instead of the minimum value, the y-intercept instead of the slope in an interpretation question, and the arc length instead of the circumference.
  > Choice D is incorrect. This is the number of pints of raspberries, not blackberries, in the purchase. ... Choice D is incorrect. This is the x-value at which the minimum value of g(x) occurs.
- Student-produced-response (grid-in) math items can have negative keys and can accept more than one equivalent form, such as an exact fraction or a decimal. The sample exponential-decay item lists two keys, 3.44 and 86/25. The y-intercept item's key is −32.
  > Keys 3.44, 86/25 ... Either 3.44 or 86/25 may be entered as the correct answer.
- The official sample math set includes these recurring templates: evaluate a combination of function values (4f(2) − g(2)); interpret the slope as a per-unit cost; test whether a point satisfies a linear inequality; interpret a coefficient in a linear equation in context; set up and solve a word-problem system of two linear equations; find a quadratic's minimum from vertex form; solve an exponential function for its constants from two points; count real solutions of a quadratic; subtract rational expressions; apply a percent decrease per step (exponential decay); use the discriminant for a line tangent to a parabola; make a line-of-best-fit prediction from a scatterplot; take a percent of a percent; use density/derived units with a cube root; use similar triangles (tree shadows); find a rectangle's side from its diagonal with the Pythagorean theorem; and find the circumference from an arc measure and arc length.
  > Math question 18 A circle has center O, and points A and B lie on the circle. The measure of arc AB is 45° and the length of arc AB is 3 inches. What is the circumference, in inches, of the circle?
- Official College Board question distribution for digital SAT Math by domain: Algebra 13-15 questions, Advanced Math 13-15 questions, Problem-Solving and Data Analysis 5-7 questions, Geometry and Trigonometry 5-7 questions (page table does not state whether per module or per section; the max values sum to 44).
  > Algebra: 13–15 ... Advanced Math: 13–15 ... Problem-Solving and Data Analysis: 5–7 ... Geometry and Trigonometry: 5–7
- The digital SAT Math section includes both multiple-choice and student-produced response (grid-in) question formats.
  > You'll answer multiple-choice and student-produced response questions that measure your fluency with, understanding of, and ability to apply the math concepts, skills, and practices that are most essential.
- About 30% of SAT Math questions are word problems set in a real-world context; the remaining ~70% are pure (non-contextual) math.
  > Approximately 30% of the Math section's questions are set in context.
- The Math section is split into two modules, and within each module questions are ordered from easiest to hardest.
  > Like the Reading and Writing section, the Math section is divided into two modules. ... Across each module, questions are arranged from easiest to hardest, allowing you to have the best opportunity to demonstrate what you know and can do.
- College Board's official SAT Math Algebra domain contains exactly five skills: linear equations in one variable, linear equations in two variables, linear functions, systems of two linear equations in two variables, and linear inequalities in one or two variables.
  > Linear equations in one variable, Linear equations in two variables, Linear functions, Systems of two linear equations in two variables, Linear inequalities in one or two variables
- The official Advanced Math domain contains three skills: equivalent expressions, nonlinear equations in one variable and systems of equations in two variables, and nonlinear functions (described as exponential, polynomial, etc.).
  > Equivalent expressions, Nonlinear equations in one variable and systems of equations in two variables, Nonlinear functions ... Nonlinear algebra (exponential, polynomial, etc.) forms the bridge to calculus and many STEM majors.
- The official Problem-Solving and Data Analysis domain contains seven skills, and on the SAT (unlike some PSAT tests) it includes margin of error and evaluating statistical claims (observational studies and experiments).
  > Ratios, rates, proportional relationships, and units / Percentages / One-variable data: Distributions and measures of center and spread / Two-variable data: Models and scatterplots / Probability and conditional probability / Inference from sample statistics (SAT, PSAT/NMSQT, and PSAT 10 only) and margin of error (SAT only) / Evaluating statistical claims: Observational studies and experiments (SAT only)
- The official SAT Geometry and Trigonometry domain contains four skills: area and volume; lines, angles, and triangles; right triangles and trigonometry; and circles. Circles and full trigonometry appear on the SAT only.
  > Area and volume / Lines, angles, and triangles (SAT, PSAT/NMSQT, and PSAT 10 only) ... / Right triangles and trigonometry (SAT only) ... / Circles (SAT only)
- College Board justifies the Algebra domain by saying postsecondary math faculty see linear algebra skills as among the most important for college readiness. This page does not give question counts, weighting, or answer-format rules.
  > Postsecondary math faculty view skills and knowledge in linear algebra as among the most critical for postsecondary readiness.
- SAT Math is organized into four content domains, weighted approximately 35% Algebra, 35% Advanced Math, 15% Problem-Solving and Data Analysis, and 15% Geometry and Trigonometry, so about 70% of the questions are algebra and advanced math.
  > Algebra: ≈35% ... Advanced Math: ≈35% ... Problem-Solving and Data Analysis: ≈15% ... Geometry and Trigonometry: ≈15%
- The official skill/knowledge testing points are: Algebra has 5 (linear equations in 1 variable; linear equations in 2 variables; linear functions; systems of 2 linear equations in 2 variables; linear inequalities in 1 or 2 variables). Advanced Math has 3 (equivalent expressions; nonlinear equations in 1 variable and systems of equations in 2 variables; nonlinear functions). Problem-Solving and Data Analysis has 7. Geometry and Trigonometry has 4. That makes 19 skills in total.
  > Algebra: Linear equations in 1 variable, Linear equations in 2 variables, Linear functions, Systems of 2 linear equations in 2 variables, Linear inequalities in 1 or 2 variables ... Problem-Solving and Data Analysis: Ratios, rates, proportional relationships, and units, Percentages, One-variable data: distributions and measures of center and spread, Two-variable data: models and scatterplots, Probability and conditional probability, Inference from sample statistics and margin of error, Evaluatin
- The SAT Math section has 44 questions in two modules. Each module has 20 operational (scored) questions and 2 pretest questions, with 35 minutes per module, for 70 minutes in total. Questions are either multiple-choice or student-produced response (SPR).
  > 1st module: 20 operational questions and 2 pretest questions ... 2nd module: 20 operational questions and 2 pretest questions ... Total: 70 minutes (~1 minute and 35 seconds per question) ... Students answer multiple-choice and student-produced response (SPR) questions
- Advanced Math covers absolute value, quadratic, exponential, polynomial, rational, radical and other nonlinear equations, and links between different representations of a nonlinear relationship. Problem-Solving and Data Analysis explicitly includes comparing linear and exponential growth, comparing distributions with the same or different standard deviations, basic study design, and interpreting margin of error.
  > Students will interpret, rewrite, fluently solve, make strategic use of structure, and create absolute value, quadratic, exponential, polynomial, rational, radical, and other nonlinear equations ... fit models to data and compare linear and exponential growth; and calculate, compare, and interpret mean, median, and range, compare distributions with the same and different standard deviation, understand basic study design, and interpret margin of error.
- Geometry and Trigonometry tests congruence, similarity and sufficiency using vertical angles, triangles, and parallel lines cut by a transversal. It also tests the Pythagorean theorem, right-triangle and unit-circle trigonometry, special right triangles, and circle theorems. Trigonometry is not tested on the PSAT 8/9.
  > determine congruence, similarity, and sufficiency using concepts and theorems about vertical angles, triangles, and parallel lines cut by a transversal; solve problems using the Pythagorean theorem, right triangle and unit circle trigonometry, and properties of special right triangles; and use properties and theorems relating to circles to solve problems.
- College Board's official skill list for the Digital SAT Advanced Math domain has exactly four question types: Equivalent expressions; Nonlinear equations in 1 variable; Systems of equations in 2 variables; Nonlinear functions.
  > Equivalent expressions ... Nonlinear equations in 1 variable ... Systems of equations in 2 variables ... Nonlinear functions
- Advanced Math covers absolute value, quadratic, exponential, polynomial, rational, radical and other nonlinear equations. This sets which equation and function families the Advanced Math generators should cover.
  > measures skills and knowledge central for progression to more advanced math courses, including demonstrating an understanding of absolute value, quadratic, exponential, polynomial, rational, radical, and other nonlinear equations.
- College Board says Advanced Math is the math needed for further study in science, economics and STEM fields. This suggests problem contexts can include science and economics settings.
  > Advanced Math focuses on the math you'll need to pursue further study in disciplines such as science or economics and for career opportunities in the STEM fields.
- This College Board page does not give a question count or percentage for Advanced Math. Domain weighting has to come from another official source, such as the SAT Suite test specifications.
  > Questions in this domain ... [no count, percentage, or calculator policy stated on this page]
- About 75% of digital SAT Math questions are 4-option multiple choice, and the remaining ~25% are student-produced response (SPR) questions.
  > Approximately 75% of questions in the Math section use the same 4-option multiple-choice format, while the remainder use the student-produced response (SPR) format.
- On SPR questions, students type their own answer into a response field next to the question instead of choosing from options. A generator therefore needs free-entry answer validation, not a list of distractors.
  > As the name implies, answering the SPR math questions means you'll generate your own response and enter it into a response field positioned near the question.
- An SPR question can have more than one correct answer (for example, any value in a range or any of several roots), but the student enters only one. A grader should accept any valid answer.
  > SPR questions may have more than one correct response, although you'll supply only one answer.
- College Board says SPR questions measure solving with less structure and support than multiple choice, which suggests SPR is used for open-ended computation items.
  > These questions assess your ability to solve math problems with greater independence and with less structure and support than that provided in the multiple-choice format.
- The digital SAT Math section has 44 questions in two separately timed, adaptive 35-minute modules (70 minutes total). Each module has 20 operational questions and 2 pretest questions. Within each module, questions go from easiest to hardest, and every module includes all four content domains.
  > 1st module: 20 operational questions and 2 pretest questions / 2nd module: 20 operational questions and 2 pretest questions / Total: 44 questions ... Total: 70 minutes ... Questions from all four content domains appear in each test module. Across each module, questions are arranged from easiest to hardest
- Of the 40 operational SAT Math questions, about 35% (13–15) are Algebra, about 35% (13–15) are Advanced Math, about 15% (5–7) are Problem-Solving and Data Analysis, and about 15% (5–7) are Geometry and Trigonometry. About 75% (28–32) are four-option multiple-choice and about 25% (8–12) are student-produced response. On the SAT, the student-produced response (SPR) questions per domain are 3–4 Algebra, 3–4 Advanced Math, 1–2 PSDA and 1–2 Geometry/Trig.
  > Multiple-Choice (MC) Student-Produced Response (SPR) ≈75% / 28–32 ≈25% / 8–12 ... Algebra Advanced Math Problem-Solving and Data Analysis Geometry and Trigonometry ≈35% / 13–15 ≈35% / 13–15 ≈15% / 5–7 ≈15% / 5–7 ... SAT SPR 3–4 3–4 1–2 1–2 8–12
- The official SAT skill/knowledge testing points are as follows. Algebra: linear equations in one variable; linear equations in two variables; linear functions; systems of two linear equations in two variables; linear inequalities in one or two variables. Advanced Math: equivalent expressions; nonlinear equations in one variable and systems of equations in two variables; nonlinear functions. PSDA: ratios, rates, proportional relationships, and units; percentages; one-variable data; two-variable data (models and scatterplots); probability and conditional probability; inference from sample statistics and margin of error; evaluating statistical claims. Geometry and Trigonometry: area and volume; lines, angles, and triangles; right triangles and trigonometry; circles.
  > Linear equations in one variable / Linear equations in two variables / Linear functions / Systems of two linear equations in two variables / Linear inequalities in one or two variables ... Equivalent expressions / Nonlinear equations in one variable and systems of equations in two variables / Nonlinear functions ... Ratios, rates, proportional relationships, and units / Percentages / One-variable data: distributions and measures of center and spread / Two-variable data: models and scatterplots /
- SPR answers can be up to six characters long, and only the first character may be a negative sign. Students round or truncate longer answers. An SPR question can have more than one accepted answer, such as a fraction and its decimal equivalent, but students enter only one.
  > Math SPR questions require students to enter answers of up to six characters, the first of which may be a negative sign. For answers exceeding this limit, students are instructed to either round or truncate their results ... Math SPR questions may have more than one answer that students could enter and have counted correct, although they are directed to provide only one answer per question. ... Either 3.44 or 86/25 may be entered as the correct answer.
- Calculators are allowed on every Math question. Students can use the Desmos Graphing Calculator built into Bluebook or their own approved device. Each multiple-choice distractor is designed to reflect a common student error or misconception.
  > students are allowed to use a calculator—either the Desmos Graphing Calculator built directly into Bluebook, the test delivery platform, or their own approved device—on all Math questions ... Each multiple-choice distractor represents a common error that students might reasonably make in answering the question or common misconception that students might hold

## alikhanprep.kz

<https://alikhanprep.kz/?p=66>  

- The SAT Math question bank is organized into 4 domains with 19 skills: Algebra (5 skills: linear equations in one variable; linear functions; linear equations in two variables; systems of two linear equations in two variables; linear inequalities in one or two variables), Advanced Math (3: equivalent expressions; nonlinear equations in one variable and systems in two variables; nonlinear functions), Problem-Solving and Data Analysis (7: ratios/rates/proportions/units; percentages; one-variable data; two-variable data; probability; inference/margin of error; evaluating statistical claims), and Geometry and Trigonometry (4: area and volume; lines, angles, and triangles; right triangles and trigonometry; circles).
  > Algebra 604 / Linear equations in one variable 112 / Linear functions 163 / Linear equations in two variables 130 / Systems of two linear equations in two variables 123 / Linear inequalities in one or two variables 76 / Advanced Math 526 / Equivalent expressions 114 / Nonlinear equations in one variable and systems of equations in two variables 162 / Nonlinear functions 250 / Problem-Solving and Data Analysis 408 / Ratios, rates, proportional relationships, and units 90 / Percentages 83 / One-va
- In this mirror of the College Board SAT Suite Question Bank, the Math question pool totals 1,873 items split Algebra 604, Advanced Math 526, Problem-Solving and Data Analysis 408, Geometry and Trigonometry 335 (about 32% / 28% / 22% / 18%). That is a usable weighting for how many generators to write per domain.
  > Questions are sourced from College Board's SAT Suite Question Bank ... Math 1873 ... Algebra 604 ... Advanced Math 526 ... Problem-Solving and Data Analysis 408 ... Geometry and Trigonometry 335
- 'Nonlinear functions' is the largest single skill in the Math bank at 250 questions, followed by Linear functions (163) and Nonlinear equations/systems (162). 'Evaluating statistical claims' (11) and 'Inference from sample statistics and margin of error' (27) are the smallest, so a generator set should weight template variety toward functions.
  > Nonlinear functions 250 ... Linear functions 163 ... Nonlinear equations in one variable and systems of equations in two variables 162 ... Inference from sample statistics and margin of error 27 ... Evaluating statistical claims: Observational studies and experiments 11
- Question-bank items carry three difficulty levels (Easy, Medium, Hard), a score band from 1 to 7, and program tags (SAT, PSAT 8/9, PSAT/NMSQT & PSAT 10). Bluebook-active items can be filtered separately.
  > "difficulty":{"name":"difficulty","label":"Difficulty","choices":[["easy","Easy"],["medium","Medium"],["hard","Hard"]] ... "score_band":{"name":"score_band","label":"Score Band","choices":[["1","1"],...,["7","7"]] ... "program":{..."choices":[["sat","SAT"],["psat89","PSAT 8/9"],["psat10","PSAT/NMSQT & PSAT 10"]]
- The page's own metadata gives a different Math count (1,678) from the 1,873 shown on the page, so its exact counts are inconsistent and may be out of date. They should be checked against the official College Board Question Bank.
  > Free access to College Board SAT Suite Question Bank: 1590 English & 1678 Math questions.

## outlierlearning.substack.com

<https://outlierlearning.substack.com/p/an-evolving-sat-data-base>  

- The author sorted every question in the College Board SAT question bank into fine-grained, recurring types coded by skill and difficulty (Easy/Medium/Hard), on the premise that the bank is made of repeating templates. That makes it a direct model for writing one generator per template.
  > I'm breaking down every question in the question bank by type, so once you learn how to do each question in each type, you can do them all.
- The Circles skill has 22 listed question types (CIR-E-A through CIR-H-P). Examples: arc length from circumference and central angle, converting between degrees and radians, writing a circle equation from center and radius, finding center/radius after completing the square, testing whether a point is inside or outside a circle, and the slope of a line tangent to a circle. The bank holds 29 Circles questions, most of them hard.
  > 29 total – 1 easy, 8 medium, 20 hard ... CIR-H-D: "find equation before completing square with center and radius" ... CIR-H-M: "slope of line tangent to circle"
- Percentages has 37 listed subtypes (PER-E-A through PER-H-Q) across 67 bank questions. They include percent change from a chart, percent of a percent, finding the original value from the value after a percent change, and multiple successive percent changes giving an overall change.
  > 67 total percentage questions in question bank ... PER-M-G: "find original number knowing number after percent change" ... PER-H-L: "multiple percent changes to an original, find overall change"
- Right Triangles and Trigonometry has 28 listed types (RIG-E-A to RIG-H-Q) across 38 bank questions, mostly hard. Types include the Pythagorean theorem with and without a figure, SOHCAHTOA, the complementary-angle sin/cos relationship, special right triangles, and similar triangles used to transfer trig ratios.
  > 38 questions total, 5 easy, 9 medium, 24 hard ... RIG-M-C: "complementary angles sin vs cos of angles" ... RIG-M-A: "similar triangles, find sohcahtoah of one using other, undrawn"
- The post gives question-bank counts for other skills. In Problem-Solving and Data Analysis: One-Variable Data 71, Two-Variable Data/Scatterplots 63, Ratios/Rates/Units 57 (27 easy, 21 medium, 9 hard), Probability 36, Inference/Margin of Error 22, Evaluating Statistical Claims 10. In Geometry: Lines/Angles/Triangles 49 and Area/Volume 44. In Advanced Math: Nonlinear Functions 179.
  > Ratios, rates, proportional relationships, and units: 57 questions in question bank - 27 easy, 9 hard, 21 medium ... Nonlinear Functions: 179 questions, 43 easy

## test-ninjas.com

<https://test-ninjas.com/sat-nonlinear-functions>  

- SAT Math domain weighting: Algebra and Advanced Math about 35% each; Problem-Solving and Data Analysis and Geometry and Trigonometry about 15% each. This matches College Board's published distribution.
  > Algebra and Advanced Math make up the bulk of the section at roughly 35% each, followed by Problem-Solving and Data Analysis at 15% and Geometry and Trigonometry at 15%.
- The Test Ninjas skill index lists 18 skills: Algebra (5) is Linear Equations in One Variable, Linear Equations in Two Variables, Linear Functions, Systems of Linear Equations and Linear Inequalities. PSDA (7) is Ratios/Rates/Proportions, Percentages, Distributions/Center & Spread, Two-Variable Data & Scatterplots, Probability, Data Inference & Margin of Error and Evaluating Statistical Claims. Geometry/Trig (4) is Area & Volume, Lines/Angles/Triangles, Circles and Trigonometry. Advanced Math has only 2 skills, Equivalent Expressions and Nonlinear Functions. College Board's official list also has 'Nonlinear equations in one variable and systems of equations in two variables', which this index leaves out.
  > Advanced Math (~35%) - Equivalent Expressions - Nonlinear Functions
- The Nonlinear Functions skill covers quadratic, exponential and other nonlinear relationships. Typical tasks are identifying the function family, interpreting parameters, evaluating and solving. Example stems are evaluating an exponential such as f(x)=3(2)^x at x=3 and reading the vertex from y=(x-3)^2+5. Story contexts are projectile/area (quadratic) and compound interest/population (exponential).
  > quadratic, exponential, and other nonlinear relationships — identify the family, interpret parameters, evaluate, or solve.
- Common distractors on exponential and quadratic questions: writing a percent growth rate as the wrong factor (0.05 or 5 where 1.05 is right; a 20% decay factor is 0.8), mixing up additive (linear) change with multiplicative (exponential) change, and misjudging how a horizontal shift like (x-3)^2 affects the parabola.
  > Growth of 5% is factor 1.05, not 0.05 and not 5. Decay of 20% is factor 0.8.
- How to tell function families apart from a table or story: a constant added amount per step means linear, a constant multiplier means exponential, and an x^2 term means quadratic.
  > A constant add each step is linear; a constant multiply is exponential; an x² term is quadratic.
