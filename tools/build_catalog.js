// Discover subject packages and regenerate the SQLite seed catalog.
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');

const repoRoot = path.resolve(__dirname, '..');
const subjectRoot = path.join(repoRoot, 'content', 'subjects');
const outputPath = path.join(repoRoot, 'content', 'catalog.json');
const subjectDirs = fs.readdirSync(subjectRoot, {withFileTypes: true})
  .filter(entry => entry.isDirectory())
  .map(entry => path.join(subjectRoot, entry.name));

if (!subjectDirs.length) throw new Error(`No subject packages found in ${subjectRoot}`);

const seenSubjectIds = new Set();
const seenQuestionIds = new Set();
const subjects = subjectDirs.map(directory => {
  const manifestPath = path.join(directory, 'subject.json');
  const sourcePath = path.join(directory, 'question-bank.js');
  const dataPath = path.join(directory, 'questions.json');
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  for (const field of ['id', 'title', 'short', 'description']) {
    if (typeof manifest[field] !== 'string' || !manifest[field].trim()) {
      throw new Error(`${manifestPath} must define a non-empty ${field}`);
    }
  }
  if (seenSubjectIds.has(manifest.id)) throw new Error(`Duplicate subject id: ${manifest.id}`);
  seenSubjectIds.add(manifest.id);

  let generated;
  if (fs.existsSync(dataPath)) {
    generated = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  } else {
    if (!fs.existsSync(sourcePath)) throw new Error(`${directory} needs questions.json or question-bank.js`);
    const context = {window: {}};
    vm.createContext(context);
    vm.runInContext(fs.readFileSync(sourcePath, 'utf8'), context, {filename: sourcePath});
    generated = context.window.SUBJECT_QUESTION_BANK;
  }
  if (!generated || !Array.isArray(generated.topics) || !Array.isArray(generated.questions)) {
    throw new Error(`${sourcePath} must set window.SUBJECT_QUESTION_BANK = { topics, questions }`);
  }
  if (!generated.topics.length) throw new Error(`${manifest.id} has no topics`);

  // A topic may be replaced by an independently authored JSON bank without
  // rewriting the rest of a large subject package. The authored file is the
  // complete topic bank and always takes precedence over the legacy source.
  const authoredDir = path.join(directory, 'authored-topics');
  const authoredTopics = new Set();
  if (fs.existsSync(authoredDir)) {
    for (const entry of fs.readdirSync(authoredDir, {withFileTypes: true}).filter(item => item.isFile() && item.name.endsWith('.json'))) {
      const authoredPath = path.join(authoredDir, entry.name);
      const authored = JSON.parse(fs.readFileSync(authoredPath, 'utf8'));
      const index = authored.topicIndex;
      if (!Number.isInteger(index) || !generated.topics[index]) throw new Error(`${authoredPath} has an invalid topicIndex`);
      if (authoredTopics.has(index)) throw new Error(`${manifest.id} has multiple authored banks for topic ${index + 1}`);
      if (!Array.isArray(authored.questions)) throw new Error(`${authoredPath} must contain a questions array`);
      authoredTopics.add(index);
      generated.questions = generated.questions.filter(question => question.topicIndex !== index)
        .concat(authored.questions.map(question => ({...question, topicIndex: index})));
    }
  }

  const topicRows = generated.topics.map((topic, index) => {
    for (const field of ['title', 'subtitle', 'icon']) {
      if (typeof topic[field] !== 'string' || !topic[field].trim()) {
        throw new Error(`${manifest.id} topic ${index + 1} is missing ${field}`);
      }
    }
    const count = generated.questions.filter(question => question.topicIndex === index).length;
    if (count < 100 || count > 150) {
      throw new Error(`${manifest.id}/${topic.title} has ${count} questions; expected 100–150`);
    }
    if (fs.existsSync(dataPath) || authoredTopics.has(index)) {
      const topicQuestions = generated.questions.filter(question => question.topicIndex === index);
      const normalizedPrompts = new Set();
      for (const question of topicQuestions) {
        const normalized = question.prompt.toLowerCase().replace(/\s+/g, ' ').replace(/\b\d+(?:\.\d+)?\b/g, '#').trim();
        if (normalizedPrompts.has(normalized)) {
          throw new Error(`${manifest.id}/${topic.title} contains duplicate prompt structure: ${question.id}`);
        }
        normalizedPrompts.add(normalized);
      }
    }
    return {id: `${manifest.id}-${index + 1}`, title: topic.title, subtitle: topic.subtitle, icon: topic.icon, position: index};
  });

  const questionRows = generated.questions.map((question, position) => {
    if (!Number.isInteger(question.topicIndex) || !topicRows[question.topicIndex]) {
      throw new Error(`${manifest.id}/${question.id} refers to an unknown topic index`);
    }
    if (!question.id || seenQuestionIds.has(question.id)) throw new Error(`Missing or duplicate question id: ${question.id}`);
    seenQuestionIds.add(question.id);
    if (!['MCQ', 'MSQ', 'NAT'].includes(question.type)) throw new Error(`${question.id} has an unsupported type`);
    if (typeof question.prompt !== 'string' || !question.prompt.trim()) throw new Error(`${question.id} has no prompt`);
    if (typeof question.explanation !== 'string' || !question.explanation.trim()) throw new Error(`${question.id} has no explanation`);
    if (question.type !== 'NAT' && (!Array.isArray(question.options) || !question.options.length)) {
      throw new Error(`${question.id} must provide answer options`);
    }
    const isAuthoredBank = fs.existsSync(dataPath) || authoredTopics.has(question.topicIndex);
    if (isAuthoredBank && !['EASY', 'MODERATE', 'CHALLENGING'].includes(question.difficulty)) {
      throw new Error(`${question.id} has an unsupported difficulty label`);
    }
    if (question.answer === undefined || question.answer === null) throw new Error(`${question.id} has no answer`);
    if (question.type === 'NAT') {
      if (!Number.isFinite(Number(question.answer))) throw new Error(`${question.id} needs a numeric NAT answer`);
    } else {
      if (!Array.isArray(question.answer) || !question.answer.length) throw new Error(`${question.id} needs an answer array`);
      if (question.type === 'MCQ' && question.answer.length !== 1) throw new Error(`${question.id} MCQ must have exactly one answer`);
      if (!question.options.every(option => typeof option === 'string') || !question.answer.every(answer => question.options.includes(answer))) {
        throw new Error(`${question.id} answers must match its string options`);
      }
      if (isAuthoredBank && (question.options.length !== 4 || new Set(question.options).size !== 4)) {
        throw new Error(`${question.id} must have four distinct GATE-style options`);
      }
      if (isAuthoredBank && question.type === 'MSQ' && question.answer.length < 2) {
        throw new Error(`${question.id} MSQ must have at least two keyed options`);
      }
    }
    if (isAuthoredBank && question.explanation.trim().length < 40) {
      throw new Error(`${question.id} needs a worked explanation, not just an answer statement`);
    }
    return {
      id: question.id,
      topic_id: topicRows[question.topicIndex].id,
      position,
      type: question.type,
      difficulty: question.difficulty || 'MODERATE',
      prompt: question.prompt,
      options: question.options || [],
      answer: question.answer,
      explanation: question.explanation
    };
  });

  return {
    id: manifest.id,
    title: manifest.title,
    short: manifest.short,
    description: manifest.description,
    order: Number.isFinite(manifest.order) ? manifest.order : 1000,
    topics: topicRows,
    questions: questionRows
  };
}).sort((a, b) => a.order - b.order || a.title.localeCompare(b.title));

fs.mkdirSync(path.dirname(outputPath), {recursive: true});
fs.writeFileSync(outputPath, JSON.stringify({version: 1, subjects}, null, 2) + '\n', 'utf8');
const total = subjects.reduce((sum, subject) => sum + subject.questions.length, 0);
console.log(`Built ${subjects.length} subjects, ${subjects.reduce((sum, subject) => sum + subject.topics.length, 0)} topics and ${total} questions.`);
