import words from 'profane-words';

const PROFANE_WORDS = new Set(words);

for (const word of words) {
  if (!word.includes(' ')) {
    continue;
  }

  PROFANE_WORDS.add(word.replace(/\s/g, ''));
  PROFANE_WORDS.add(word.replace(/\s/g, '_'));
  PROFANE_WORDS.add(word.replace(/\s/g, '.'));
  PROFANE_WORDS.add(word.replace(/\s/g, '-'));
}

export { PROFANE_WORDS };
