import fs from 'fs/promises'
import { fileURLToPath } from 'url'
import path from 'path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const dataDir = path.join(__dirname, '..', 'data')
const usersPath = path.join(dataDir, 'users.json')
const feedbackPath = path.join(dataDir, 'feedback.json')

async function init() {
  await fs.mkdir(dataDir, { recursive: true })

  try {
    await fs.access(usersPath)
    console.log('data/users.json already exists')
  } catch {
    await fs.writeFile(usersPath, JSON.stringify({ users: [] }, null, 2))
    console.log('Created data/users.json')
  }

  try {
    await fs.access(feedbackPath)
    console.log('data/feedback.json already exists')
  } catch {
    await fs.writeFile(feedbackPath, JSON.stringify({ feedback: [] }, null, 2))
    console.log('Created data/feedback.json')
  }
}

init()
