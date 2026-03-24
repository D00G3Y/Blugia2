import express from 'express'
import cors from 'cors'
import bcrypt from 'bcryptjs'
import { v4 as uuidv4 } from 'uuid'
import fs from 'fs/promises'
import { fileURLToPath } from 'url'
import path from 'path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const USERS_PATH = path.join(__dirname, '..', 'data', 'users.json')
const FEEDBACK_PATH = path.join(__dirname, '..', 'data', 'feedback.json')

const app = express()
app.use(cors())
app.use(express.json())

async function readUsers() {
  try {
    const data = await fs.readFile(USERS_PATH, 'utf8')
    return JSON.parse(data)
  } catch {
    return { users: [] }
  }
}

async function writeUsers(data) {
  await fs.writeFile(USERS_PATH, JSON.stringify(data, null, 2))
}

async function readFeedback() {
  try {
    const data = await fs.readFile(FEEDBACK_PATH, 'utf8')
    return JSON.parse(data)
  } catch {
    return { feedback: [] }
  }
}

async function writeFeedback(data) {
  await fs.writeFile(FEEDBACK_PATH, JSON.stringify(data, null, 2))
}

function getToken(req) {
  const auth = req.headers.authorization
  if (auth && auth.startsWith('Bearer ')) return auth.slice(7)
  return null
}

async function getUser(req) {
  const token = getToken(req)
  if (!token) return null
  const { users } = await readUsers()
  return users.find(u => u.token === token) || null
}

// Register
app.post('/api/register', async (req, res) => {
  const { username, password } = req.body
  if (!username || !password) return res.status(400).json({ error: 'Username and password required' })
  if (username.length < 3) return res.status(400).json({ error: 'Username must be at least 3 characters' })
  if (password.length < 6) return res.status(400).json({ error: 'Password must be at least 6 characters' })

  const data = await readUsers()
  if (data.users.find(u => u.username.toLowerCase() === username.toLowerCase())) {
    return res.status(409).json({ error: 'Username already taken' })
  }

  const passwordHash = await bcrypt.hash(password, 10)
  const token = uuidv4()
  const user = {
    id: uuidv4(),
    username,
    passwordHash,
    token,
    bookmarks: [],
    createdAt: new Date().toISOString(),
  }

  data.users.push(user)
  await writeUsers(data)

  res.json({ id: user.id, username: user.username, token, bookmarks: user.bookmarks })
})

// Login
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body
  if (!username || !password) return res.status(400).json({ error: 'Username and password required' })

  const data = await readUsers()
  const user = data.users.find(u => u.username.toLowerCase() === username.toLowerCase())
  if (!user) return res.status(401).json({ error: 'Invalid username or password' })

  const valid = await bcrypt.compare(password, user.passwordHash)
  if (!valid) return res.status(401).json({ error: 'Invalid username or password' })

  user.token = uuidv4()
  await writeUsers(data)

  res.json({ id: user.id, username: user.username, token: user.token, bookmarks: user.bookmarks })
})

// Get current user
app.get('/api/me', async (req, res) => {
  const user = await getUser(req)
  if (!user) return res.status(401).json({ error: 'Not authenticated' })
  res.json({ id: user.id, username: user.username, bookmarks: user.bookmarks })
})

// Add bookmark
app.post('/api/bookmarks', async (req, res) => {
  const user = await getUser(req)
  if (!user) return res.status(401).json({ error: 'Not authenticated' })

  const { title, path } = req.body
  if (!title || !path) return res.status(400).json({ error: 'Title and path required' })
  if (user.bookmarks.length >= 5) return res.status(400).json({ error: 'Maximum 5 bookmarks allowed' })
  if (user.bookmarks.find(b => b.path === path)) return res.status(409).json({ error: 'Already bookmarked' })

  user.bookmarks.push({ title, path })
  const data = await readUsers()
  const idx = data.users.findIndex(u => u.id === user.id)
  data.users[idx] = user
  await writeUsers(data)

  res.json({ bookmarks: user.bookmarks })
})

// Remove bookmark
app.delete('/api/bookmarks', async (req, res) => {
  const user = await getUser(req)
  if (!user) return res.status(401).json({ error: 'Not authenticated' })

  const { path } = req.body
  if (!path) return res.status(400).json({ error: 'Path required' })

  user.bookmarks = user.bookmarks.filter(b => b.path !== path)
  const data = await readUsers()
  const idx = data.users.findIndex(u => u.id === user.id)
  data.users[idx] = user
  await writeUsers(data)

  res.json({ bookmarks: user.bookmarks })
})

// Profanity filter (server-side safety net)
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

function containsProfanity(text) {
  const lower = text.toLowerCase()
  const normalized = lower
    .replace(/0/g, 'o').replace(/1/g, 'i').replace(/3/g, 'e')
    .replace(/4/g, 'a').replace(/5/g, 's').replace(/\$/g, 's')
    .replace(/@/g, 'a').replace(/!/g, 'i')
  return BLOCKED_WORDS.some(word => {
    const pattern = new RegExp(`\\b${word}\\b`, 'i')
    return pattern.test(lower) || pattern.test(normalized)
  })
}

// Submit feedback
app.post('/api/feedback', async (req, res) => {
  const user = await getUser(req)
  if (!user) return res.status(401).json({ error: 'Not authenticated' })

  const { message } = req.body
  if (!message || !message.trim()) return res.status(400).json({ error: 'Message required' })

  // Silently accept but don't store vulgar messages
  if (containsProfanity(message)) {
    return res.json({ success: true })
  }

  const data = await readFeedback()
  data.feedback.push({
    id: uuidv4(),
    userId: user.id,
    username: user.username,
    message: message.trim(),
    createdAt: new Date().toISOString(),
  })
  await writeFeedback(data)

  res.json({ success: true })
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Auth server running on http://localhost:${PORT}`)
})
