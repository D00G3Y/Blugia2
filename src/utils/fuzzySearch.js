function levenshtein(a, b) {
  const m = a.length
  const n = b.length
  const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0))

  for (let i = 0; i <= m; i++) dp[i][0] = i
  for (let j = 0; j <= n; j++) dp[0][j] = j

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (a[i - 1] === b[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1]
      } else {
        dp[i][j] = 1 + Math.min(
          dp[i - 1][j],     // deletion
          dp[i][j - 1],     // insertion
          dp[i - 1][j - 1]  // substitution
        )
      }
    }
  }

  return dp[m][n]
}

function scoreItem(query, item) {
  const q = query.toLowerCase()
  const title = item.title.toLowerCase()
  const keywords = item.keywords.toLowerCase()

  // Exact substring match in title — best possible score
  if (title.includes(q)) return 0

  // Exact substring match in keywords
  if (keywords.includes(q)) return 0.1

  // Starts-with bonus on title
  if (title.startsWith(q)) return 0.05

  // Levenshtein against title
  const titleDist = levenshtein(q, title)
  const titleScore = titleDist / Math.max(q.length, title.length)

  // Levenshtein against individual keywords — find best match
  const words = keywords.split(/\s+/)
  let bestKeywordScore = 1
  for (const word of words) {
    if (!word) continue
    const dist = levenshtein(q, word)
    const score = dist / Math.max(q.length, word.length)
    if (score < bestKeywordScore) bestKeywordScore = score
  }

  return Math.min(titleScore, bestKeywordScore)
}

export function fuzzySearch(query, items, maxResults = 8, threshold = 0.55) {
  const q = query.trim()
  if (!q) return []

  const scored = items
    .map(item => ({ ...item, score: scoreItem(q, item) }))
    .filter(item => item.score <= threshold)
    .sort((a, b) => a.score - b.score)

  return scored.slice(0, maxResults)
}
