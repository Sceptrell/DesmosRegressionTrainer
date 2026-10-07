# Question categories

Each file here registers a group of categories, and `index.html` loads them with plain `<script>` tags:

| File | Group (heading in the category picker) |
| --- | --- |
| `desmos-techniques.js` | Desmos Techniques (the original 15) |
| `algebra.js` | Algebra |
| `advanced-math.js` | Advanced Math |
| `problem-solving-data.js` | Problem-Solving & Data Analysis |
| `geometry-trig.js` | Geometry & Trigonometry |

These groups match the four College Board SAT Math domains. Shared helpers (`randInt`, `pick`, `fracStr`, `polyTex`, `makeChoices`, …) live in `../js/helpers.js`. Add new helpers there instead of copying them into categories.

## Category shape

```js
{
    id: 'slope-from-two-points',            // unique, kebab-case
    title: '(Easy) Slope from Two Points',  // must start with (Easy), (Medium) or (Hard)
    skill: 'Linear functions',              // official College Board skill this tests
    source: 'https://…',                    // where this question type was found
    tips: ['…', '…'],                       // 2+ method tips; HTML allowed
    degreeMode: true,                       // optional: load the Desmos solution in degrees
    questionGenerator() {
        return { questionText, answer, choices, desmosSolutions };
    }
}
```

`explanationImage` (a screenshot of a solved example) is optional. The "View Solved Example" button is hidden when a category has none.

## What `questionGenerator()` returns

- **`questionText`**: an HTML string, shown left-aligned as flowing paragraphs. Write math as `\\(…\\)` for inline and `$$…$$` for a centered display equation, e.g. the given equation on its own line. A single `$` does **not** render; write money as `\\$5.50`. Whitespace collapses as normal HTML, so template-literal indentation is harmless. Use `<p>…</p>` to separate paragraphs, and plain `<table>` with `<th>`/`<td>` for data tables, which are already styled. (The original 15 categories use `layout: 'stacked'`, where each line is centered and newlines are kept. Don't use that for new categories.)
- **Student-produced response (grid-in)**: leave out `choices`. `answer` is a number or an `"a/b"` string (use `fracStr`). A non-integer answer must be a fraction string, or a decimal with at most 4 places. As on the SAT, students may type a fraction or a decimal with 3+ places that truncates or rounds it. Keep answers within 5 characters (6 if negative) where you can.
- **Multiple choice**: `choices` is an array of 4 HTML strings and `answer` is the letter of the correct one. Build both with `makeChoices(correct, [d1, d2, d3])`. Distractors should be realistic mistakes (wrong sign, the intermediate value, swapped variables, percent applied the wrong way), not random numbers.
- **`desmosSolutions`**: an array of Desmos expression states, loaded by "Load Desmos Solution". Give each entry a unique `id`. Use `{ id, latex }` for expressions, `{ type: 'table', columns: [...] }` for tables and `{ type: 'text', id, text }` for notes. Always end with a note stating the answer. When Desmos doesn't help, a few notes walking through the solution are fine.

## Rules of thumb

- Randomize the numbers, and the wording or context where it makes sense, so the same question rarely repeats. The checker requires at least 10 distinct questions in 300 runs and warns below 30.
- Pick numbers that give clean answers, as the SAT does. Retry loops are fine, but they must finish quickly.
- Model each type on public, recurring SAT question patterns. Don't copy College Board question text word for word.

## Checking your work

```sh
node tests/check-generators.js                          # every category, 300 runs each (exit 1 on errors)
node tests/check-generators.js --only my-id --samples 3 # one category, with sample questions to read
node tests/check-desmos.js --only my-id                 # load solutions into real Desmos (headless Chrome)
```
