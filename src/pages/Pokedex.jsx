import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import pokemonData from '../data/pokemon.json'
import './Pokedex.css'

const ALL_TYPES = [...new Set(pokemonData.pokemon.flatMap(p => p.types).filter(Boolean))].sort()

function Pokedex() {
  const [selected, setSelected] = useState(null)
  const [showShiny, setShowShiny] = useState(false)
  const [typeFilter, setTypeFilter] = useState('')
  const [searchParams] = useSearchParams()

  useEffect(() => {
    const pokemonId = searchParams.get('pokemon')
    if (pokemonId) {
      const found = pokemonData.pokemon.find(p => p.id === Number(pokemonId))
      if (found) {
        setSelected(found)
        setShowShiny(false)
      }
    }
  }, [searchParams])

  const detailContent = selected && (
    <>
      <div className="pokedex-detail-header">
        <h3>{selected.name}</h3>
        <span className="pokedex-detail-number">#{String(selected.id).padStart(3, '0')}</span>
      </div>

      <div className="pokedex-detail-sprite">
        <img
          src={showShiny ? selected.images.shiny : selected.images.default}
          alt={selected.name}
        />
        <button
          className="pokedex-shiny-toggle"
          onClick={() => setShowShiny(!showShiny)}
        >
          {showShiny ? 'Default' : 'Shiny'}
        </button>
      </div>

      <div className="pokedex-detail-section">
        <h4>Abilities</h4>
        <div className="pokedex-abilities">
          {selected.abilities.filter(a => a).map((a, i) => (
            <span key={i} className="pokedex-ability">{a}</span>
          ))}
        </div>
      </div>

      <div className="pokedex-detail-section">
        <h4>Base Stats</h4>
        <div className="pokedex-stats">
          {Object.entries(selected.stats).map(([key, value]) => (
            <div key={key} className="pokedex-stat-row">
              <span className="pokedex-stat-label">
                {key.replace('sp_', 'Sp. ').replace(/^\w/, c => c.toUpperCase())}
              </span>
              <div className="pokedex-stat-bar-bg">
                <div
                  className="pokedex-stat-bar"
                  style={{ width: `${(value / 255) * 100}%` }}
                />
              </div>
              <span className="pokedex-stat-value">{value}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="pokedex-detail-section">
        <h4>Locations</h4>
        {selected.locations.length > 0 ? (
          <p className="pokedex-locations-text">
            {[...new Set(selected.locations.map(loc => loc.area.replace(/^Kanto\s+/i, '')))]
              .sort((a, b) => {
                const numA = a.match(/\d+/)
                const numB = b.match(/\d+/)
                if (numA && numB) return parseInt(numA[0]) - parseInt(numB[0])
                return a.localeCompare(b)
              })
              .join(', ')}
          </p>
        ) : (
          <p className="pokedex-no-locations">Not found in the wild</p>
        )}
      </div>
    </>
  )

  const filteredPokemon = typeFilter
    ? pokemonData.pokemon.filter(p => p.types.includes(typeFilter))
    : pokemonData.pokemon

  return (
    <div className="pokedex-page">
      <h2>Pokedex</h2>

      <div className="pokedex-type-filter">
        <button
          className={`type-filter-btn ${typeFilter === '' ? 'active' : ''}`}
          onClick={() => setTypeFilter('')}
        >
          All
        </button>
        {ALL_TYPES.map(type => (
          <button
            key={type}
            className={`type-filter-btn type-${type.toLowerCase()} ${typeFilter === type ? 'active' : ''}`}
            onClick={() => setTypeFilter(type)}
          >
            {type}
          </button>
        ))}
      </div>

      <div className="pokedex-layout">
        {/* Pokemon Grid */}
        <div className="pokedex-grid">
          {filteredPokemon.map(p => (
            <button
              key={p.id}
              id={`pokemon-${p.id}`}
              className={`pokedex-card ${selected?.id === p.id ? 'active' : ''}`}
              onClick={() => { setSelected(p); setShowShiny(false) }}
            >
              <img src={p.images.default} alt={p.name} />
              <span className="pokedex-card-number">#{String(p.id).padStart(3, '0')}</span>
              <span className="pokedex-card-name">{p.name}</span>
            </button>
          ))}
        </div>

        {/* Desktop Detail Panel */}
        {selected && (
          <div className="pokedex-detail">
            {detailContent}
          </div>
        )}
      </div>

      {/* Mobile Modal */}
      {selected && (
        <div className="pokedex-modal-overlay" onClick={() => setSelected(null)}>
          <div className="pokedex-modal" onClick={(e) => e.stopPropagation()}>
            <button className="pokedex-modal-close" onClick={() => setSelected(null)}>✕</button>
            {detailContent}
          </div>
        </div>
      )}
    </div>
  )
}

export default Pokedex
