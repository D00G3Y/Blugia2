import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { containsProfanity } from '../utils/profanityFilter'
import { supabase } from '../lib/supabase'
import './Submissions.css'

function Submissions() {
  const { user } = useAuth()
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus(null)

    // Silently discard vulgar submissions — show success but don't send
    if (containsProfanity(message)) {
      setMessage('')
      setStatus('success')
      return
    }

    try {
      const { error } = await supabase
        .from('feedback')
        .insert([{ user_id: user.id, message: message.trim() }])
      if (error) throw new Error(error.message)
      setMessage('')
      setStatus('success')
    } catch (err) {
      setStatus(err.message)
    }
  }

  return (
    <div className="page-container">
      <h2>Submissions</h2>
      <p className="page-description">
        Submit new ROM hack information, corrections, or updates to help grow the wiki.
      </p>
      {user ? (
        <form className="feedback-form" onSubmit={handleSubmit}>
          {status === 'success' && (
            <div className="feedback-success">Thanks for your feedback!</div>
          )}
          {status && status !== 'success' && (
            <div className="feedback-error">{status}</div>
          )}
          <textarea
            placeholder="Share your feedback, corrections, or suggestions..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={5}
            required
          />
          <button type="submit" className="feedback-btn">Submit Feedback</button>
        </form>
      ) : (
        <div className="submissions-placeholder">
          <p><Link to="/login">Login</Link> to submit feedback.</p>
        </div>
      )}
    </div>
  )
}

export default Submissions
