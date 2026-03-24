import { useState, useMemo, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Link, Navigate, useNavigate, useLocation } from 'react-router-dom'
import './App.css'
import Pokedex from './pages/Pokedex'
import Submissions from './pages/Submissions'
import Login from './pages/Login'
import Profile from './pages/Profile'
import FireRed from './pages/FireRed'
import Legendaries from './pages/fire-red/Legendaries'
import GiftsTrades from './pages/fire-red/GiftsTrades'
import Items from './pages/fire-red/Items'
import pokemonData from './data/pokemon.json'
import itemsData from './data/items.json'
import { fuzzySearch } from './utils/fuzzySearch'
import { AuthProvider, useAuth } from './context/AuthContext'
import Banner from './assets/Banner.png'
import fbIcon from './assets/Socials/fb.png'
import twIcon from './assets/Socials/tw.png'

function Layout() {
  const [leftMenuOpen, setLeftMenuOpen] = useState(false)
  const [rightMenuOpen, setRightMenuOpen] = useState(false)
  const [expandedCategory, setExpandedCategory] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()
  const location = useLocation()
  const isFireRed = location.pathname.startsWith('/fire-red')
  const { user, loading, logout } = useAuth()
  const [showBackToTop, setShowBackToTop] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > window.innerHeight)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout()
    }
  }

  const sitePages = useMemo(() => [
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
  ], [])

  const searchResults = useMemo(() => {
    return fuzzySearch(searchQuery, sitePages)
  }, [searchQuery, sitePages])

  const handleSearchSelect = (path) => {
    setSearchQuery('')
    closeMenus()
    navigate(path)
  }

  const toggleCategory = (category) => {
    setExpandedCategory(expandedCategory === category ? null : category)
  }

  const closeMenus = () => {
    setLeftMenuOpen(false)
    setRightMenuOpen(false)
    setExpandedCategory(null)
  }

  /* Mobile: collapsible game categories */
  const gameCategoriesMobile = (
    <div className="panel-content">
      <div className="category-item">
        <button className="category-toggle" onClick={() => toggleCategory('gba')}>
          GBA {expandedCategory === 'gba' ? '▾' : '▸'}
        </button>
        {expandedCategory === 'gba' && (
          <ul className="sub-links">
            <li><Link to="/fire-red" onClick={closeMenus}>Fire Red</Link></li>
          </ul>
        )}
      </div>
    </div>
  )

  /* Desktop: static game categories, always visible */
  const gameCategoriesDesktop = (
    <div className="panel-content">
      <div className="category-item">
        <div className="category-header">GBA</div>
        <ul className="sub-links">
          <li><Link to="/fire-red">Fire Red</Link></li>
        </ul>
      </div>
    </div>
  )

  const searchBar = (
    <div className="search-bar">
      <span className="search-icon">🔍</span>
      <input
        type="text"
        placeholder="Search..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && searchResults.length > 0) {
            handleSearchSelect(searchResults[0].path)
          }
        }}
      />
      {searchQuery.trim() && (
        <div className="search-results">
          {searchResults.length > 0 ? (
            searchResults.map(result => (
              <button
                key={result.path}
                className="search-result-item"
                onClick={() => handleSearchSelect(result.path)}
              >
                {result.title}
              </button>
            ))
          ) : (
            <div className="search-no-results">No results found</div>
          )}
        </div>
      )}
    </div>
  )

  const navLinks = (
    <div className="panel-content">
      <div className="mobile-search">
        {searchBar}
      </div>
      {user && user.bookmarks.length > 0 && (
        <div className="mobile-bookmarks">
          <div className="game-section-header">Bookmarks</div>
          {user.bookmarks.map(b => (
            <div key={b.path} className="nav-block"><Link to={b.path} onClick={closeMenus}>{b.title}</Link></div>
          ))}
        </div>
      )}
      <div className="mobile-nav-links">
        <div className="game-section-header">Navigation</div>
        <div className="nav-block"><Link to="/submissions" onClick={closeMenus}>Submissions</Link></div>
        <div className="nav-block"><Link to="/pokedex" onClick={closeMenus}>Pokedex</Link></div>
        {!loading && (
          user ? (
            <>
              <div className="nav-block"><Link to="/profile" onClick={closeMenus}>My Profile</Link></div>
              <div className="nav-block">
                <button onClick={() => { closeMenus(); handleLogout() }} className="mobile-nav-btn">Logout</button>
              </div>
            </>
          ) : (
            <div className="nav-block"><Link to="/login" onClick={closeMenus}>Login</Link></div>
          )
        )}
      </div>
      {isFireRed && (
        <>
          <div className="game-section-header">Fire Red</div>
          <div className="nav-block"><Link to="/fire-red/legendaries" onClick={closeMenus}>Legendaries</Link></div>
          <div className="nav-block"><Link to="/fire-red/gifts-trades" onClick={closeMenus}>Gifts & Trades</Link></div>
          <div className="nav-block"><Link to="/fire-red/pokedex" onClick={closeMenus}>Pokedex</Link></div>
          <div className="nav-block"><Link to="/fire-red/items" onClick={closeMenus}>Items</Link></div>
        </>
      )}
    </div>
  )

  return (
    <>
      {/* Header */}
      <header className="header">
        <button
          className="header-menu-toggle header-menu-left"
          onClick={() => setLeftMenuOpen(!leftMenuOpen)}
          aria-label="Open game categories menu"
        >
          ☰
        </button>
        <Link to="/">
          <img src={Banner} alt="Blugia" className="header-banner" />
        </Link>
        <button
          className="header-menu-toggle header-menu-right"
          onClick={() => setRightMenuOpen(!rightMenuOpen)}
          aria-label="Open navigation menu"
        >
          ☰
        </button>
      </header>

      {/* Desktop Nav Bar */}
      <nav className="main-nav">
        <div className="main-nav-left">
          <Link to="/submissions">Submissions</Link>
          <Link to="/pokedex">Pokedex</Link>
          {searchBar}
        </div>
        {user && user.bookmarks.length > 0 && (
          <div className="main-nav-center">
            {user.bookmarks.map(b => (
              <Link key={b.path} to={b.path}>{b.title}</Link>
            ))}
          </div>
        )}
        <div className="main-nav-right">
          <a href="#"><img src={fbIcon} alt="Facebook" className="social-icon" /></a>
          <a href="#"><img src={twIcon} alt="Twitter" className="social-icon" /></a>
          {!loading && (
            user ? (
              <>
                <Link to="/profile" className="profile-icon" title="My Profile">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="28" height="28">
                    <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
                  </svg>
                </Link>
                <button className="nav-auth-btn" onClick={handleLogout}>Logout</button>
              </>
            ) : (
              <Link to="/login" className="nav-auth-link">Login</Link>
            )
          )}
        </div>
      </nav>


      {/* Overlay (mobile only) */}
      {(leftMenuOpen || rightMenuOpen) && (
        <div className="menu-overlay" onClick={closeMenus} />
      )}

      {/* Mobile Left Slide-out */}
      <div className={`side-menu side-menu-left ${leftMenuOpen ? 'open' : ''}`}>
        <button className="menu-close" onClick={closeMenus}>✕</button>
        {gameCategoriesMobile}
      </div>

      {/* Mobile Right Slide-out */}
      <div className={`side-menu side-menu-right ${rightMenuOpen ? 'open' : ''}`}>
        <button className="menu-close" onClick={closeMenus}>✕</button>
        {navLinks}
      </div>

      {/* Three-column content area */}
      <div className="content-layout">
        {/* Desktop Left Panel */}
        <aside className="desktop-panel desktop-panel-left">
          {gameCategoriesDesktop}
        </aside>

        {/* Main Content */}
        <Routes>
          <Route path="/" element={
            <main className="hero">
              <h2>
                A Pokemon <span>Rom Hack</span> Wiki
              </h2>
              <p className="subtitle">
                Currently under construction but growing soon! Calling all casual gamers to expand the wiki catalog.
              </p>
              <a href="#" className="cta">
                Join our Discord
              </a>
            </main>
          } />
          <Route path="/pokedex" element={<Pokedex />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/submissions" element={<Submissions />} />
          <Route path="/fire-red" element={<FireRed />} />
          <Route path="/fire-red/legendaries" element={<Legendaries />} />
          <Route path="/fire-red/gifts-trades" element={<GiftsTrades />} />
          <Route path="/fire-red/pokedex" element={<Pokedex />} />
          <Route path="/fire-red/items" element={<Items />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        {/* Desktop Right Panel */}
        <aside className="desktop-panel desktop-panel-right">
          {navLinks}
        </aside>
      </div>

      {/* Footer */}
      <footer className="footer">
        <p>
          Developed by <a href="#">Noah J. Houser</a>
        </p>
        <div className="social-links">
          <a href="#"><img src={fbIcon} alt="Facebook" className="social-icon" /></a>
          <a href="#"><img src={twIcon} alt="Twitter" className="social-icon" /></a>
        </div>
      </footer>

      {/* Sitemap link */}
      <div className="sitemap-bar">
        <a href="/sitemap.xml">Sitemap</a>
      </div>

      {showBackToTop && (
        <button
          className="back-to-top"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Back to top"
        >
          ▲
        </button>
      )}
    </>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Layout />
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
