import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import itemsData from '../../data/items.json'
import '../../styles/Items.css'

function Items() {
  const { items } = itemsData
  const [searchParams] = useSearchParams()
  const selectedId = searchParams.get('item')
  const [selectedItem, setSelectedItem] = useState(null)

  // Desktop: scroll to item. Mobile: open popup.
  useEffect(() => {
    if (selectedId) {
      const item = items.find(i => String(i.id) === selectedId)
      if (item) {
        // Check if mobile
        const isMobile = window.innerWidth <= 768
        if (isMobile) {
          setSelectedItem(item)
        } else {
          const el = document.getElementById(`item-${selectedId}`)
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' })
            el.classList.add('item-highlight')
            const timer = setTimeout(() => el.classList.remove('item-highlight'), 2000)
            return () => clearTimeout(timer)
          }
        }
      }
    }
  }, [selectedId, items])

  const itemDetail = (item) => (
    <>
      <div className="item-modal-header">
        {item.sprite && <img src={item.sprite} alt={item.name} className="item-modal-sprite" />}
        <h3>{item.name}</h3>
      </div>
      <div className="item-modal-row">
        <span className="item-label">Buy:</span> {item.buy_price > 0 ? `¥${item.buy_price.toLocaleString()}` : '?'}
      </div>
      <div className="item-modal-row">
        <span className="item-label">Sell:</span> {item.sell_price > 0 ? `¥${item.sell_price.toLocaleString()}` : '?'}
      </div>
      <div className="item-modal-row">
        <span className="item-label">Effect:</span> {item.effect}
      </div>
      <div className="item-modal-row">
        <span className="item-label">Location:</span> {item.location}
      </div>
    </>
  )

  return (
    <div className="page-container items-page">
      <h2>Items</h2>
      <p className="page-description">
        All items available in Fire Red.
      </p>

      {/* Desktop table */}
      <table className="items-table">
        <thead>
          <tr>
            <th></th>
            <th>Name</th>
            <th>Buy</th>
            <th>Sell</th>
            <th>Effect</th>
            <th>Location</th>
          </tr>
        </thead>
        <tbody>
          {items.map(item => (
            <tr key={item.id} id={`item-${item.id}`}>
              <td className="item-sprite-cell">
                {item.sprite && <img src={item.sprite} alt={item.name} className="item-sprite" />}
              </td>
              <td className="item-name">{item.name}</td>
              <td>{item.buy_price > 0 ? `¥${item.buy_price.toLocaleString()}` : '?'}</td>
              <td>{item.sell_price > 0 ? `¥${item.sell_price.toLocaleString()}` : '?'}</td>
              <td className="item-effect">{item.effect}</td>
              <td>{item.location}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Mobile cards */}
      <div className="items-cards">
        {items.map(item => (
          <div key={item.id} id={`item-mobile-${item.id}`} className="item-card" onClick={() => setSelectedItem(item)}>
            <div className="item-card-image">
              {item.sprite && <img src={item.sprite} alt={item.name} />}
            </div>
            <div className="item-card-info">
              <div className="item-card-name">{item.name}</div>
              <div className="item-card-price-row">
                <div className="item-card-row">
                  <span className="item-label">Buy:</span> {item.buy_price > 0 ? `¥${item.buy_price.toLocaleString()}` : '?'}
                </div>
                <div className="item-card-row">
                  <span className="item-label">Sell:</span> {item.sell_price > 0 ? `¥${item.sell_price.toLocaleString()}` : '?'}
                </div>
              </div>
              <div className="item-card-row">
                <span className="item-label">Effect:</span> {item.effect}
              </div>
              <div className="item-card-row">
                <span className="item-label">Location:</span> {item.location}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Mobile item popup */}
      {selectedItem && (
        <div className="item-modal-overlay" onClick={() => setSelectedItem(null)}>
          <div className="item-modal" onClick={(e) => e.stopPropagation()}>
            <button className="item-modal-close" onClick={() => setSelectedItem(null)}>✕</button>
            {itemDetail(selectedItem)}
          </div>
        </div>
      )}
    </div>
  )
}

export default Items
