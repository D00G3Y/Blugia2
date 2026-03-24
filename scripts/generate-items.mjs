import fs from 'fs/promises'

const BASE_URL = 'https://pokeapi.co/api/v2/item'

function capitalize(str) {
  return str.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' ')
}

function formatCategory(name) {
  return capitalize(name)
}

async function fetchAllItemUrls() {
  const urls = []
  let url = `${BASE_URL}?limit=100`
  while (url) {
    const res = await fetch(url)
    if (!res.ok) throw new Error(`Failed to fetch item list: ${res.status}`)
    const data = await res.json()
    urls.push(...data.results.map(r => r.url))
    url = data.next
    if (url) await new Promise(r => setTimeout(r, 100))
  }
  return urls
}

function isFireRedItem(item) {
  return item.flavor_text_entries.some(
    e => e.version_group.name === 'firered-leafgreen'
  )
}

function getEnglishName(item) {
  const entry = item.names.find(n => n.language.name === 'en')
  return entry ? entry.name : capitalize(item.name)
}

function getEffect(item) {
  const entry = item.effect_entries.find(e => e.language.name === 'en')
  if (entry) return entry.short_effect
  const flavor = item.flavor_text_entries.find(
    e => e.language.name === 'en' && e.version_group.name === 'firered-leafgreen'
  )
  return flavor ? flavor.text.replace(/\n/g, ' ') : '?'
}

function formatItem(item) {
  const cost = item.cost || 0
  return {
    id: item.id,
    name: getEnglishName(item),
    category: formatCategory(item.category.name),
    buy_price: cost,
    sell_price: cost > 0 ? Math.floor(cost / 2) : 0,
    effect: getEffect(item),
    location: cost > 0 ? 'PokeMart' : '?',
    sprite: item.sprites.default || '',
  }
}

async function main() {
  console.log('Fetching item list from PokeAPI...')
  const urls = await fetchAllItemUrls()
  console.log(`Found ${urls.length} total items. Filtering for Fire Red...`)

  const items = []
  for (let i = 0; i < urls.length; i++) {
    const res = await fetch(urls[i])
    if (!res.ok) {
      console.warn(`  Skipping ${urls[i]}: ${res.status}`)
      continue
    }
    const item = await res.json()

    if (isFireRedItem(item)) {
      items.push(formatItem(item))
    }

    if ((i + 1) % 50 === 0) console.log(`  Checked ${i + 1}/${urls.length} (${items.length} Fire Red items so far)`)
    await new Promise(r => setTimeout(r, 100))
  }

  items.sort((a, b) => a.name.localeCompare(b.name))

  const outPath = new URL('../src/data/items.json', import.meta.url)
  await fs.writeFile(outPath, JSON.stringify({ items }, null, 2))
  console.log(`Done! Wrote ${items.length} Fire Red items to src/data/items.json`)
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
