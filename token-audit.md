# Token Audit Report

## Pre-Fix Audit

Measured with `google/gemini-2.0-flash-001` using `sample-inputs/sample-code.js` and user message:
`Analyze the following code for bugs and improvements:\n\n<sample-code.js>`

- System prompt token count (original): `411`
- Sample user message token count: `280`
- API response token count (completion): `220`
- Total per original call: `691 + 220 = 911` tokens

Cost formula used by this project:

- Prompt cost: `prompt_tokens x 0.0000025`
- Completion cost: `completion_tokens x 0.00001`

Per-call original cost:

- `691 x 0.0000025 = 0.0017275`
- `220 x 0.00001 = 0.0022`
- `Cost per call = 0.0017275 + 0.0022 = 0.0039275 USD`

Monthly call assumption:

- `200 users x 15 calls/day = 3,000 calls/day`
- `3,000 x 30 days = 90,000 calls/month`

Monthly original cost:

- `90,000 x 0.0039275 = 353.475 USD/month`

## Waste Sources

1. Pattern name: Redundant persona and greeting
- Location in prompt: Opening paragraph (`"Greetings! I am your helpful and dedicated AI assistant..."`)
- Explanation of waste: Long self-introduction adds tokens without affecting review quality or output structure.

2. Pattern name: Repeated scope restrictions
- Location in prompt: Paragraphs starting with `"First and foremost..."`, `"I would also like to remind you..."`, and final `"Finally..."`
- Explanation of waste: Same instruction (`only code review`) is repeated multiple times with different wording.

3. Pattern name: Over-explained formatting constraints
- Location in prompt: Long structure paragraph beginning with `"In terms of how you should structure your final response..."`
- Explanation of waste: Verbose wording repeats requirements that can be conveyed in compact bullet instructions.

## Rewritten Prompt

- Original token count (system only): `411`
- New token count (system only): `138`
- Reduction: `411 - 138 = 273 tokens`
- Percentage reduction: `(273 / 411) x 100 = 66.42%`

Full rewritten prompt:

```text
You are a senior engineer acting as a professional code reviewer. Your task is to analyze provided code snippets to identify critical bugs, security vulnerabilities, and meaningful improvements. Your feedback must be constructive, professional, and help the student learn.

You must only respond to code review requests. Do not answer or provide information unrelated to code analysis.

Structure your response into three sections:

Issues Found
Suggested Improvements
Overall Assessment

Use clear, complete sentences with sufficient context for understanding. Ensure formatting is consistent and readable, with appropriate headings for each section.

Limit your response to a maximum of 300 words.

Stay strictly focused on code review and do not address unrelated queries.
```

Instruction preservation mapping:

| Original Instruction | Location in Rewrite |
|---|---|
| Act as a senior professional code reviewer | Paragraph 1, sentence 1 |
| Identify critical bugs and security vulnerabilities | Paragraph 1, sentence 1 |
| Provide meaningful improvements and help student learn | Paragraph 1, sentence 2 |
| Respond only to code review requests | Paragraph 2, sentence 1 |
| Refuse unrelated/non-code-review questions | Paragraph 2, sentence 2 and final paragraph |
| Use three sections: Issues Found / Suggested Improvements / Overall Assessment | Section list under `Structure your response into three sections` |
| Keep language clear and readable with headings | Paragraph after section list |
| Limit output to 300 words max | `Limit your response to a maximum of 300 words.` |

## Cost Comparison Table

`monthly_calls = 200 x 15 x 30 = 90,000`

| Version        | Prompt Tokens | Completion Tokens | Cost Per Call | Monthly Cost |
|---------------|---------------|-------------------|---------------|--------------|
| Original      | 691           | 220               | $0.0039275    | $353.4750    |
| After Rewrite | 418           | 220               | $0.0032450    | $292.0500    |

Monthly savings:

- `$353.4750 - $292.0500 = $61.4250`
