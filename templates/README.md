# Adding a subject

1. Copy `templates/subject` to `content/subjects/<subject-slug>`.
2. Edit `subject.json` for the subject ID, display name, card description and ordering.
3. Edit `questions.json`. Add each topic to `topics`, then add 100–150 question records for that topic to `questions`. Use the matching zero-based `topicIndex` for each record.
4. Give every question a stable, globally unique `id`. Supported types are `MCQ`, `MSQ` and `NAT`. MCQ/MSQ records need `options`; every record needs an `answer` and worked `explanation`.
5. Run `node tools/build_catalog.js`. The builder discovers all subject folders automatically and rejects missing fields, duplicate IDs, and topic counts outside 100–150.
6. The running backend imports the new catalog the next time the frontend calls the catalog API. Reload the page to see the new subject.

For generated question banks, put a `question-bank.js` in the subject folder instead of `questions.json`. It must set `window.SUBJECT_QUESTION_BANK = { topics, questions }`, where each question has a zero-based `topicIndex`.

## Replacing one topic with an authored bank

For a large subject, a complete independently written topic can live in `authored-topics/<topic-name>.json` so it can be reviewed separately. The file shape is:

```json
{
  "topicIndex": 0,
  "questions": [
    {
      "id": "subject-topic-001",
      "type": "MCQ",
      "difficulty": "CHALLENGING",
      "prompt": "A self-contained, original problem statement.",
      "options": ["A", "B", "C", "D"],
      "answer": ["B"],
      "explanation": "A worked derivation that justifies the answer and rules out the key misconception."
    }
  ]
}
```

An authored topic file replaces that topic's entire bank; it must contain 100–150 questions. Do not fill a topic by changing constants in a small set of templates. Questions should assess distinct syllabus concepts or reasoning paths, use MCQ/MSQ/NAT in GATE style, and include enough working for a learner to follow the solution. The catalog builder also rejects prompt structures that become duplicates after numeric values are normalized for authored banks.
