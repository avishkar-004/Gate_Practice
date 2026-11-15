// Regenerate catalog.json after editing either static question-bank source.
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');

const context = { window: {} };
vm.createContext(context);
for (const filename of ['questions.js', 'algorithm-questions.js']) {
  const source = fs.readFileSync(path.join(__dirname, filename), 'utf8');
  vm.runInContext(source, context, { filename });
}

const subjects = [
  {
    id: 'pds', title: 'Programming and Data Structures', short: 'PROGRAMMING & DATA STRUCTURES',
    description: 'C programming, recursion and core data structures',
    topics: context.window.QUESTION_TOPICS, questions: context.window.QUESTION_BANK
  },
  {
    id: 'algorithms', title: 'Algorithms', short: 'ALGORITHMS',
    description: 'Complexity, searching, sorting, hashing, design paradigms and graphs',
    topics: context.window.ALGORITHM_TOPICS, questions: context.window.ALGORITHM_BANK
  }
].map(subject => ({
  ...subject,
  topics: subject.topics.map((topic, index) => ({
    id: `${subject.id}-${index + 1}`,
    title: topic.title,
    subtitle: topic.subtitle,
    icon: topic.icon,
    position: index
  })),
  questions: subject.questions.map((question, index) => ({
    id: question.id,
    topic_id: `${subject.id}-${question.topicIndex + 1}`,
    position: index,
    type: question.type,
    difficulty: question.difficulty,
    prompt: question.prompt,
    options: question.options || [],
    answer: question.answer,
    explanation: question.explanation
  }))
}));

const output = path.join(__dirname, 'catalog.json');
fs.writeFileSync(output, JSON.stringify({ version: 1, subjects }, null, 2) + '\n', 'utf8');
console.log(`Wrote ${subjects.reduce((total, item) => total + item.questions.length, 0)} questions to catalog.json`);
