import fs from 'fs/promises'

const BASE_URL = 'https://pokeapi.co/api/v2/pokemon/'
const SPRITE_BASE = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/'

const NAME_OVERRIDES = {
  'nidoran-f': 'Nidoran (F)',
  'nidoran-m': 'Nidoran (M)',
  'mr-mime': 'Mr. Mime',
  'farfetchd': "Farfetch'd",
}

function capitalize(str) {
  return str.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' ')
}

function formatName(apiName) {
  return NAME_OVERRIDES[apiName] || capitalize(apiName)
}

function formatAreaName(name) {
  return capitalize(name.replace(/-area$/, ''))
}

function formatAbilities(abilitiesArray) {
  const regular = abilitiesArray
    .filter(a => !a.is_hidden)
    .map(a => capitalize(a.ability.name))
  const hidden = abilitiesArray
    .filter(a => a.is_hidden)
    .map(a => capitalize(a.ability.name))
  const result = [...regular, ...hidden]
  while (result.length < 3) result.push('')
  return result.slice(0, 3)
}

function formatLocations(encounterData) {
  const locations = []
  for (const loc of encounterData) {
    const frVersions = loc.version_details.filter(v => v.version.name === 'firered')
    for (const vd of frVersions) {
      const methods = new Set()
      let minLevel = Infinity
      let maxLevel = -Infinity
      for (const enc of vd.encounter_details) {
        methods.add(capitalize(enc.method.name))
        if (enc.min_level < minLevel) minLevel = enc.min_level
        if (enc.max_level > maxLevel) maxLevel = enc.max_level
      }
      locations.push({
        area: formatAreaName(loc.location_area.name),
        method: [...methods].join(', '),
        min_level: minLevel,
        max_level: maxLevel,
      })
    }
  }
  return locations
}

async function fetchPokemon(id) {
  const [pokRes, encRes] = await Promise.all([
    fetch(BASE_URL + id),
    fetch(BASE_URL + id + '/encounters'),
  ])
  if (!pokRes.ok) throw new Error(`Failed to fetch Pokemon #${id}: ${pokRes.status}`)
  if (!encRes.ok) throw new Error(`Failed to fetch encounters #${id}: ${encRes.status}`)

  const data = await pokRes.json()
  const encounters = await encRes.json()

  const types = data.types
    .sort((a, b) => a.slot - b.slot)
    .map(t => capitalize(t.type.name))
  while (types.length < 2) types.push('')

  return {
    id: data.id,
    name: formatName(data.name),
    types: types.slice(0, 2),
    abilities: formatAbilities(data.abilities),
    stats: {
      hp: data.stats[0].base_stat,
      attack: data.stats[1].base_stat,
      defense: data.stats[2].base_stat,
      sp_attack: data.stats[3].base_stat,
      sp_defense: data.stats[4].base_stat,
      speed: data.stats[5].base_stat,
    },
    images: {
      default: `${SPRITE_BASE}${id}.png`,
      shiny: `${SPRITE_BASE}shiny/${id}.png`,
    },
    locations: formatLocations(encounters),
  }
}

async function main() {
  console.log('Fetching 151 Pokemon from PokeAPI...')
  const pokemon = []

  for (let id = 1; id <= 151; id++) {
    const entry = await fetchPokemon(id)
    pokemon.push(entry)
    if (id % 10 === 0) console.log(`  ${id}/151`)
    await new Promise(r => setTimeout(r, 100))
  }

  const outPath = new URL('../src/data/pokemon.json', import.meta.url)
  await fs.writeFile(outPath, JSON.stringify({ pokemon }, null, 2))
  console.log(`Done! Wrote ${pokemon.length} entries to src/data/pokemon.json`)
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
