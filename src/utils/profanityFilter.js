const BLOCKED_WORDS = [
  'anal', 'anus', 'arse', 'ass', 'ballsack', 'balls', 'bastard', 'bitch',
  'blowjob', 'blow job', 'bollock', 'bollok', 'boner', 'boob', 'butt',
  'clitoris', 'cock', 'coon', 'crap', 'cunt', 'damn', 'dick', 'dildo',
  'dyke', 'fag', 'feck', 'fellate', 'fellatio', 'felching', 'fuck',
  'fudgepacker', 'fudge packer', 'flange', 'goddamn', 'god damn', 'hell',
  'homo', 'jerk', 'jizz', 'knobend', 'knob end', 'labia', 'lmao',
  'lmfao', 'muff', 'nigger', 'nigga', 'omg', 'penis', 'piss', 'poop',
  'prick', 'pube', 'pussy', 'queer', 'scrotum', 'sex', 'shit', 'slut',
  'smegma', 'spunk', 'tit', 'tosser', 'turd', 'twat', 'vagina',
  'wank', 'whore', 'wtf',
]

export function containsProfanity(text) {
  const lower = text.toLowerCase()
  // Strip common letter substitutions
  const normalized = lower
    .replace(/0/g, 'o')
    .replace(/1/g, 'i')
    .replace(/3/g, 'e')
    .replace(/4/g, 'a')
    .replace(/5/g, 's')
    .replace(/\$/g, 's')
    .replace(/@/g, 'a')
    .replace(/\!/g, 'i')

  return BLOCKED_WORDS.some(word => {
    const pattern = new RegExp(`\\b${word}\\b`, 'i')
    return pattern.test(lower) || pattern.test(normalized)
  })
}
