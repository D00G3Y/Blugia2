import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext(null)

// Read stored session synchronously so we never depend on async calls for initial state
const getStoredUser = () => {
  try {
    const raw = localStorage.getItem('blugia-auth')
    if (!raw) return null
    const parsed = JSON.parse(raw)
    const session = parsed?.session || parsed
    if (!session?.user) return null
    const meta = session.user.user_metadata || {}
    return {
      id: session.user.id,
      username: meta.display_name || session.user.email?.split('@')[0] || 'User',
      bookmarks: [],
    }
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getStoredUser)
  const [loading, setLoading] = useState(false)

  const buildUser = (session) => {
    if (!session?.user) return null
    const meta = session.user.user_metadata || {}
    return {
      id: session.user.id,
      username: meta.display_name || session.user.email?.split('@')[0] || 'User',
      bookmarks: [],
    }
  }

  const fetchBookmarks = async (userId) => {
    const { data, error } = await supabase
      .from('bookmarks')
      .select('title, path')
      .eq('user_id', userId)
      .order('created_at', { ascending: true })
    if (error) return []
    return data || []
  }

  // Load bookmarks async after initial render
  useEffect(() => {
    if (user && user.bookmarks.length === 0) {
      fetchBookmarks(user.id).then(bookmarks => {
        setUser(prev => prev ? { ...prev, bookmarks } : null)
      }).catch(() => {})
    }
  }, [user?.id])

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        try {
          if (session?.user) {
            const u = buildUser(session)
            u.bookmarks = await fetchBookmarks(session.user.id)
            setUser(u)
          } else {
            setUser(null)
          }
        } catch (err) {
          console.error('Auth state change failed:', err)
        }
      }
    )

    return () => subscription?.unsubscribe()
  }, [])

  const login = async (username, password) => {
    const email = `${username.toLowerCase()}@users.blugia.net`
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw new Error(error.message)
    if (data.session?.user) {
      const u = buildUser(data.session)
      u.bookmarks = await fetchBookmarks(data.session.user.id)
      setUser(u)
    }
    return data
  }

  const register = async (username, password) => {
    if (username.length < 3) throw new Error('Username must be at least 3 characters')
    if (password.length < 6) throw new Error('Password must be at least 6 characters')

    const email = `${username.toLowerCase()}@users.blugia.net`
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { display_name: username } },
    })
    if (error) throw new Error(error.message)
    return data
  }

  const logout = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  const addBookmark = async (title, path) => {
    if (!user) throw new Error('Not authenticated')
    if (user.bookmarks.length >= 5) throw new Error('Maximum 5 bookmarks allowed')
    if (user.bookmarks.find(b => b.path === path)) throw new Error('Already bookmarked')

    const { error } = await supabase
      .from('bookmarks')
      .insert([{ user_id: user.id, title, path }])
    if (error) throw new Error(error.message)

    const bookmarks = await fetchBookmarks(user.id)
    setUser(prev => ({ ...prev, bookmarks }))
  }

  const removeBookmark = async (path) => {
    if (!user) throw new Error('Not authenticated')

    const { error } = await supabase
      .from('bookmarks')
      .delete()
      .eq('user_id', user.id)
      .eq('path', path)
    if (error) throw new Error(error.message)

    const bookmarks = await fetchBookmarks(user.id)
    setUser(prev => ({ ...prev, bookmarks }))
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, addBookmark, removeBookmark }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
