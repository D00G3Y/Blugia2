import { useState, useMemo } from 'react'
import { Navigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { fuzzySearch } from '../utils/fuzzySearch'
import pokemonData from '../data/pokemon.json'
import itemsData from '../data/items.json'
import './Profile.css'

const sitePages = [
  { title: 'Home', path: '/', keywords: 'home pokemon rom hack wiki discord' },
  { title: 'Pokedex', path: '/pokedex', keywords: 'pokedex pokemon browse entries' },
  { title: 'Submissions', path: '/submissions', keywords: 'submissions submit rom hack corrections updates' },
  { title: 'Fire Red', path: '/fire-red', keywords: 'fire red gba gameboy advance rom hack' },
  { title: 'Fire Red Legendaries', path: '/fire-red/legendaries', keywords: 'fire red legendaries legendary pokemon' },
  { title: 'Fire Red Gifts & Trades', path: '/fire-red/gifts-trades', keywords: 'fire red gifts trades pokemon' },
  { title: 'Fire Red Pokedex', path: '/fire-red/pokedex', keywords: 'fire red pokedex pokemon' },
  { title: 'Fire Red Items', path: '/fire-red/items', keywords: 'fire red items pokeball potion tm hm berry medicine' },
  ...pokemonData.pokemon.map(p => ({
    title: p.name,
    path: `/pokedex?pokemon=${p.id}`,
    keywords: `${p.name.toLowerCase()} #${p.id} pokemon pokedex`,
  })),
  ...itemsData.items.map(item => ({
    title: item.name,
    path: `/fire-red/items?item=${item.id}`,
    keywords: `${item.name.toLowerCase()} ${item.category.toLowerCase()} fire red item`,
  })),
]

function Profile() {
  const { user, loading, addBookmark, removeBookmark } = useAuth()
  const [bookmarkQuery, setBookmarkQuery] = useState('')

  const searchResults = useMemo(() => {
    if (!user) return []
    const bookmarkedPaths = new Set(user.bookmarks.map(b => b.path))
    return fuzzySearch(bookmarkQuery, sitePages)
      .filter(r => !bookmarkedPaths.has(r.path))
  }, [bookmarkQuery, user])

  if (loading) return null
  if (!user) return <Navigate to="/login" />

  const atMax = user.bookmarks.length >= 5

  const handleAdd = async (title, path) => {
    try {
      await addBookmark(title, path)
      setBookmarkQuery('')
    } catch (err) {
      alert(err.message)
    }
  }

  return (
    <div className="page-container">
      <h2>My Profile</h2>
      <div className="profile-info">
        <span className="profile-username">{user.username}</span>
      </div>

      <h3>Bookmarks ({user.bookmarks.length}/5)</h3>
      {user.bookmarks.length > 0 ? (
        <ul className="profile-bookmarks">
          {user.bookmarks.map(b => (
            <li key={b.path}>
              <Link to={b.path}>{b.title}</Link>
              <button onClick={() => removeBookmark(b.path)} className="remove-bookmark-btn">Remove</button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="profile-empty">No bookmarks yet.</p>
      )}

      <h3>Add Bookmark</h3>
      {atMax ? (
        <p className="profile-empty">Maximum 5 bookmarks reached. Remove one to add another.</p>
      ) : (
        <div className="bookmark-search">
          <input
            type="text"
            placeholder="Search for a page to bookmark..."
            value={bookmarkQuery}
            onChange={(e) => setBookmarkQuery(e.target.value)}
          />
          {bookmarkQuery.trim() && (
            <div className="bookmark-search-results">
              {searchResults.length > 0 ? (
                searchResults.map(r => (
                  <div key={r.path} className="bookmark-search-item">
                    <span>{r.title}</span>
                    <button onClick={() => handleAdd(r.title, r.path)}>Add</button>
                  </div>
                ))
              ) : (
                <div className="bookmark-search-empty">No results found</div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default Profile
