'use strict'

const models = require('../sequelize/models/index.cjs')

// Zones to insert (zoom is not stored; model has latitude/longitude only)
const ZONES = [
  { name: 'Kinshasa', latitude: -4.3276, longitude: 15.3136 },
  { name: 'Goma', latitude: -1.6792, longitude: 29.2285 },
  { name: 'Lubumbashi', latitude: -11.687, longitude: 27.5026 },
  { name: 'Kisangani', latitude: 0.5153, longitude: 25.191 },
  { name: 'Bukavu', latitude: -2.505, longitude: 28.86 },
  { name: 'Mbandaka', latitude: 0.0487, longitude: 18.2603 },
]

// Provided RAW_BATIMENTS mapped to backend fields (lat->latitude, lng->longitude)
const RAW_BATIMENTS = [
  // Jean (Kinshasa)
  { id: 1,  collecteur: 'Jean', ville: 'Kinshasa', commune: 'Gombe', quartier: 'Quartier 1', avenue: 'A1',  progression: 'Completed',      lat: -4.321, lng: 15.31 },
  { id: 1,  collecteur: 'Jean', ville: 'Kinshasa', commune: 'Gombe', quartier: 'Quartier 1', avenue: 'A1',  progression: 'Completed',      lat: -4.321, lng: 15.31 },
  { id: 1,  collecteur: 'Jean', ville: 'Kinshasa', commune: 'Gombe', quartier: 'Quartier 1', avenue: 'A1',  progression: 'Completed',      lat: -4.321, lng: 15.31 },
  { id: 1,  collecteur: 'Jean', ville: 'Kinshasa', commune: 'Gombe', quartier: 'Quartier 1', avenue: 'A1',  progression: 'Completed',      lat: -4.321, lng: 15.31 },
  { id: 1,  collecteur: 'Jean', ville: 'Kinshasa', commune: 'Gombe', quartier: 'Quartier 1', avenue: 'A1',  progression: 'Completed',      lat: -4.321, lng: 15.31 },
  { id: 1,  collecteur: 'Jean', ville: 'Kinshasa', commune: 'Gombe', quartier: 'Quartier 1', avenue: 'A1',  progression: 'Completed',      lat: -4.321, lng: 15.31 },
  { id: 1,  collecteur: 'Jean', ville: 'Kinshasa', commune: 'Gombe', quartier: 'Quartier 1', avenue: 'A1',  progression: 'Completed',      lat: -4.321, lng: 15.31 },
  { id: 1,  collecteur: 'Jean', ville: 'Kinshasa', commune: 'Gombe', quartier: 'Quartier 1', avenue: 'A1',  progression: 'Completed',      lat: -4.321, lng: 15.31 },
  { id: 2,  collecteur: 'Jean', ville: 'Kinshasa', commune: 'Gombe', quartier: 'Quartier 2', avenue: 'A2',  progression: 'In Progress',    lat: -4.333, lng: 15.314 },
  { id: 2,  collecteur: 'Jean', ville: 'Kinshasa', commune: 'Gombe', quartier: 'Quartier 2', avenue: 'A2',  progression: 'In Progress',    lat: -4.333, lng: 15.314 },
  { id: 2,  collecteur: 'Jean', ville: 'Kinshasa', commune: 'Gombe', quartier: 'Quartier 2', avenue: 'A2',  progression: 'In Progress',    lat: -4.333, lng: 15.314 },
  { id: 2,  collecteur: 'Jean', ville: 'Kinshasa', commune: 'Gombe', quartier: 'Quartier 2', avenue: 'A2',  progression: 'In Progress',    lat: -4.333, lng: 15.314 },
  { id: 3,  collecteur: 'Jean', ville: 'Kinshasa', commune: 'Gombe', quartier: 'Quartier 3', avenue: 'A3',  progression: 'Need Revisit',   lat: -4.329, lng: 15.302 },
  { id: 3,  collecteur: 'Jean', ville: 'Kinshasa', commune: 'Gombe', quartier: 'Quartier 3', avenue: 'A3',  progression: 'Need Revisit',   lat: -4.329, lng: 15.302 },
  { id: 3,  collecteur: 'Jean', ville: 'Kinshasa', commune: 'Gombe', quartier: 'Quartier 3', avenue: 'A3',  progression: 'Need Revisit',   lat: -4.329, lng: 15.302 },
  { id: 4,  collecteur: 'Jean', ville: 'Kinshasa', commune: 'Gombe', quartier: 'Quartier 4', avenue: 'A4',  progression: 'Pending Review', lat: -4.339, lng: 15.3 },
  { id: 4,  collecteur: 'Jean', ville: 'Kinshasa', commune: 'Gombe', quartier: 'Quartier 4', avenue: 'A4',  progression: 'Pending Review', lat: -4.339, lng: 15.3 },
  { id: 2,  collecteur: 'Jean', ville: 'Kinshasa', commune: 'Gombe', quartier: 'Quartier 2', avenue: 'A2',  progression: 'In Progress',    lat: -4.333, lng: 15.314 },
  { id: 2,  collecteur: 'Jean', ville: 'Kinshasa', commune: 'Gombe', quartier: 'Quartier 2', avenue: 'A2',  progression: 'In Progress',    lat: -4.333, lng: 15.314 },
  { id: 5,  collecteur: 'Jean', ville: 'Kinshasa', commune: 'Gombe', quartier: 'Quartier 5', avenue: 'A5',  progression: 'Empty',       lat: -4.345, lng: 15.318 },

  // Marie (Kinshasa)
  { id: 6,  collecteur: 'Marie', ville: 'Kinshasa', commune: 'Limete', quartier: 'Résidentiel', avenue: 'L1', progression: 'Completed',      lat: -4.361, lng: 15.346 },
  { id: 6,  collecteur: 'Marie', ville: 'Kinshasa', commune: 'Limete', quartier: 'Résidentiel', avenue: 'L1', progression: 'Completed',      lat: -4.361, lng: 15.346 },
  { id: 6,  collecteur: 'Marie', ville: 'Kinshasa', commune: 'Limete', quartier: 'Résidentiel', avenue: 'L1', progression: 'Completed',      lat: -4.361, lng: 15.346 },
  { id: 6,  collecteur: 'Marie', ville: 'Kinshasa', commune: 'Limete', quartier: 'Résidentiel', avenue: 'L1', progression: 'Completed',      lat: -4.361, lng: 15.346 },
  { id: 6,  collecteur: 'Marie', ville: 'Kinshasa', commune: 'Limete', quartier: 'Résidentiel', avenue: 'L1', progression: 'Completed',      lat: -4.361, lng: 15.346 },
  { id: 6,  collecteur: 'Marie', ville: 'Kinshasa', commune: 'Limete', quartier: 'Résidentiel', avenue: 'L1', progression: 'Completed',      lat: -4.361, lng: 15.346 },
  { id: 7,  collecteur: 'Marie', ville: 'Kinshasa', commune: 'Limete', quartier: 'Industriel',  avenue: 'L2', progression: 'In Progress',    lat: -4.351, lng: 15.339 },
  { id: 7,  collecteur: 'Marie', ville: 'Kinshasa', commune: 'Limete', quartier: 'Industriel',  avenue: 'L2', progression: 'In Progress',    lat: -4.351, lng: 15.339 },
  { id: 7,  collecteur: 'Marie', ville: 'Kinshasa', commune: 'Limete', quartier: 'Industriel',  avenue: 'L2', progression: 'In Progress',    lat: -4.351, lng: 15.339 },
  { id: 7,  collecteur: 'Marie', ville: 'Kinshasa', commune: 'Limete', quartier: 'Industriel',  avenue: 'L2', progression: 'In Progress',    lat: -4.351, lng: 15.339 },
  { id: 7,  collecteur: 'Marie', ville: 'Kinshasa', commune: 'Limete', quartier: 'Industriel',  avenue: 'L2', progression: 'In Progress',    lat: -4.351, lng: 15.339 },
  { id: 8,  collecteur: 'Marie', ville: 'Kinshasa', commune: 'Gombe',  quartier: 'Marché',      avenue: 'G5', progression: 'Need Revisit',   lat: -4.319, lng: 15.322 },
  { id: 8,  collecteur: 'Marie', ville: 'Kinshasa', commune: 'Gombe',  quartier: 'Marché',      avenue: 'G5', progression: 'Need Revisit',   lat: -4.319, lng: 15.322 },
  { id: 9,  collecteur: 'Marie', ville: 'Kinshasa', commune: 'Gombe',  quartier: 'Admin',       avenue: 'G6', progression: 'Pending Review', lat: -4.317, lng: 15.328 },
  { id: 9,  collecteur: 'Marie', ville: 'Kinshasa', commune: 'Gombe',  quartier: 'Admin',       avenue: 'G6', progression: 'Pending Review', lat: -4.317, lng: 15.328 },
  { id: 9,  collecteur: 'Marie', ville: 'Kinshasa', commune: 'Gombe',  quartier: 'Admin',       avenue: 'G6', progression: 'Pending Review', lat: -4.317, lng: 15.328 },
  { id: 9,  collecteur: 'Marie', ville: 'Kinshasa', commune: 'Gombe',  quartier: 'Admin',       avenue: 'G6', progression: 'Pending Review', lat: -4.317, lng: 15.328 },
  { id: 10, collecteur: 'Marie', ville: 'Kinshasa', commune: 'Selembao', quartier: 'Collines', avenue: 'S1', progression: 'Empty',        lat: -4.392, lng: 15.25 },
  { id: 10, collecteur: 'Marie', ville: 'Kinshasa', commune: 'Selembao', quartier: 'Collines', avenue: 'S1', progression: 'Empty',        lat: -4.392, lng: 15.25 },

  // Paul (Kinshasa)
  { id: 11, collecteur: 'Paul', ville: 'Kinshasa', commune: 'Ngaliema', quartier: 'Q5', avenue: 'N1', progression: 'Completed',      lat: -4.355, lng: 15.252 },
  { id: 11, collecteur: 'Paul', ville: 'Kinshasa', commune: 'Ngaliema', quartier: 'Q5', avenue: 'N1', progression: 'Completed',      lat: -4.355, lng: 15.252 },
  { id: 12, collecteur: 'Paul', ville: 'Kinshasa', commune: 'Ngaliema', quartier: 'Q6', avenue: 'N2', progression: 'In Progress',    lat: -4.363, lng: 15.269 },
  { id: 13, collecteur: 'Paul', ville: 'Kinshasa', commune: 'Limete',   quartier: 'Q4', avenue: 'L4', progression: 'Need Revisit',   lat: -4.374, lng: 15.334 },
  { id: 14, collecteur: 'Paul', ville: 'Kinshasa', commune: 'Limete',   quartier: 'Q3', avenue: 'L3', progression: 'Pending Review', lat: -4.369, lng: 15.328 },
  { id: 15, collecteur: 'Paul', ville: 'Kinshasa', commune: 'Gombe',    quartier: 'Q2', avenue: 'G2', progression: 'Empty',       lat: -4.325, lng: 15.299 },

  // Aïcha (Kinshasa)
  { id: 16, collecteur: 'Aïcha', ville: 'Kinshasa', commune: 'Selembao', quartier: 'Q7', avenue: 'S7', progression: 'Completed',      lat: -4.41, lng: 15.23 },
  { id: 16, collecteur: 'Aïcha', ville: 'Kinshasa', commune: 'Selembao', quartier: 'Q7', avenue: 'S7', progression: 'Completed',      lat: -4.41, lng: 15.23 },
  { id: 17, collecteur: 'Aïcha', ville: 'Kinshasa', commune: 'Selembao', quartier: 'Q8', avenue: 'S8', progression: 'In Progress',    lat: -4.401, lng: 15.237 },
  { id: 18, collecteur: 'Aïcha', ville: 'Kinshasa', commune: 'Ngaliema', quartier: 'Q9', avenue: 'N9', progression: 'Need Revisit',   lat: -4.366, lng: 15.26 },
  { id: 19, collecteur: 'Aïcha', ville: 'Kinshasa', commune: 'Ngaliema', quartier: 'Q10', avenue: 'N10', progression: 'Pending Review', lat: -4.373, lng: 15.276 },
  { id: 20, collecteur: 'Aïcha', ville: 'Kinshasa', commune: 'Gombe', quartier: 'Q1', avenue: 'G1', progression: 'Empty', lat: -4.315, lng: 15.316 },

  // Louis (Kinshasa)
  { id: 21, collecteur: 'Louis', ville: 'Kinshasa', commune: 'Selembao', quartier: 'Q7', avenue: 'S2', progression: 'Completed',      lat: -4.402, lng: 15.245 },
  { id: 21, collecteur: 'Louis', ville: 'Kinshasa', commune: 'Selembao', quartier: 'Q7', avenue: 'S2', progression: 'Completed',      lat: -4.402, lng: 15.245 },
  { id: 22, collecteur: 'Louis', ville: 'Kinshasa', commune: 'Selembao', quartier: 'Q12', avenue: 'S12', progression: 'In Progress',  lat: -4.396, lng: 15.241 },
  { id: 23, collecteur: 'Louis', ville: 'Kinshasa', commune: 'Gombe', quartier: 'Q4', avenue: 'G4', progression: 'Need Revisit',      lat: -4.322, lng: 15.319 },
  { id: 24, collecteur: 'Louis', ville: 'Kinshasa', commune: 'Ngaliema', quartier: 'Q11', avenue: 'N11', progression: 'Pending Review', lat: -4.36, lng: 15.265 },
  { id: 25, collecteur: 'Louis', ville: 'Kinshasa', commune: 'Limete', quartier: 'Q3', avenue: 'L3', progression: 'Empty',        lat: -4.372, lng: 15.337 },

  // Nadia (Kinshasa)
  { id: 26, collecteur: 'Nadia', ville: 'Kinshasa', commune: 'Gombe', quartier: 'Q1', avenue: 'A10', progression: 'Completed',        lat: -4.317, lng: 15.313 },
  { id: 26, collecteur: 'Nadia', ville: 'Kinshasa', commune: 'Gombe', quartier: 'Q1', avenue: 'A10', progression: 'Completed',        lat: -4.317, lng: 15.313 },
  { id: 27, collecteur: 'Nadia', ville: 'Kinshasa', commune: 'Gombe', quartier: 'Q2', avenue: 'A11', progression: 'In Progress',      lat: -4.319, lng: 15.321 },
  { id: 28, collecteur: 'Nadia', ville: 'Kinshasa', commune: 'Limete', quartier: 'Q6', avenue: 'L6', progression: 'Need Revisit',     lat: -4.37, lng: 15.34 },
  { id: 29, collecteur: 'Nadia', ville: 'Kinshasa', commune: 'Ngaliema', quartier: 'Q8', avenue: 'N8', progression: 'Pending Review', lat: -4.362, lng: 15.271 },
  { id: 30, collecteur: 'Nadia', ville: 'Kinshasa', commune: 'Selembao', quartier: 'Q9', avenue: 'S9', progression: 'Empty',       lat: -4.406, lng: 15.247 },

  // Vianney (Goma)
  { id: 31, collecteur: 'Vianney', ville: 'Goma', commune: 'Karisimbi', quartier: 'Q2', avenue: 'G1', progression: 'In Progress', lat: -1.672, lng: 29.237 },
  { id: 31, collecteur: 'Vianney', ville: 'Goma', commune: 'Karisimbi', quartier: 'Q2', avenue: 'G1', progression: 'In Progress', lat: -1.672, lng: 29.237 },

  { id: 32, collecteur: 'Vianney', ville: 'Goma', commune: 'Karisimbi', quartier: 'Q3', avenue: 'G2', progression: 'Completed',   lat: -1.674, lng: 29.224 },
  { id: 33, collecteur: 'Vianney', ville: 'Goma', commune: 'Goma',      quartier: 'Q4', avenue: 'G3', progression: 'Need Revisit',lat: -1.683, lng: 29.235 },
  { id: 34, collecteur: 'Vianney', ville: 'Goma', commune: 'Goma',      quartier: 'Q5', avenue: 'G4', progression: 'Pending Review', lat: -1.688, lng: 29.22 },
  { id: 35, collecteur: 'Vianney', ville: 'Goma', commune: 'Goma',      quartier: 'Q6', avenue: 'G5', progression: 'Empty',    lat: -1.692, lng: 29.215 },

  // Other cities for diversity
  { id: 36, collecteur: 'Jean',  ville: 'Lubumbashi', commune: 'Kamalondo', quartier: 'Q1', avenue: 'L1', progression: 'Completed', lat: -11.658, lng: 27.48 },
  { id: 36, collecteur: 'Jean',  ville: 'Lubumbashi', commune: 'Kamalondo', quartier: 'Q1', avenue: 'L1', progression: 'Completed', lat: -11.658, lng: 27.48 },
  { id: 37, collecteur: 'Marie', ville: 'Lubumbashi', commune: 'Kenya',     quartier: 'Q2', avenue: 'L2', progression: 'Pending Review', lat: -11.7, lng: 27.52 },
  { id: 38, collecteur: 'Paul',  ville: 'Kisangani',  commune: 'Makiso',    quartier: 'Q3', avenue: 'K1', progression: 'In Progress', lat: 0.516, lng: 25.19 },
  { id: 39, collecteur: 'Aïcha', ville: 'Bukavu',     commune: 'Ibanda',    quartier: 'Q4', avenue: 'B1', progression: 'Need Revisit', lat: -2.51, lng: 28.86 },
  { id: 40, collecteur: 'Louis', ville: 'Mbandaka',   commune: 'Mbandaka',  quartier: 'Q5', avenue: 'M1', progression: 'Empty',  lat: 0.05, lng: 18.265 },
]

// Basic collecteurs derived from the dataset by name, associated to a zone by city
const COLLECTEURS_BY_CITY = {
  Kinshasa: ['Jean', 'Marie', 'Paul', 'Aïcha', 'Louis', 'Nadia'],
  Goma: ['Vianney'],
  Lubumbashi: ['Jean', 'Marie'],
  Kisangani: ['Paul'],
  Bukavu: ['Aïcha'],
  Mbandaka: ['Louis'],
}

function toNumeroCollecteur(name, zoneName) {
  const prefix = zoneName.slice(0, 3).toUpperCase()
  const clean = name
    .normalize('NFD').replace(/[ -\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]/g, '')
    .toUpperCase()
  return `${prefix}-${clean}`
}

async function main() {
  try {
    await models.sequelize.authenticate()
    console.log('DB connected')

    // Upsert zones by name
    const zoneByName = {}
    for (const z of ZONES) {
      const [zone] = await models.Zone.findOrCreate({
        where: { name: z.name },
        defaults: { name: z.name, latitude: z.latitude, longitude: z.longitude },
      })
      // If exists but no coords yet, update once
      if ((zone.latitude == null || zone.longitude == null) && (z.latitude != null && z.longitude != null)) {
        await zone.update({ latitude: z.latitude, longitude: z.longitude })
      }
      zoneByName[z.name] = zone
    }

    // Upsert collecteurs per (name, zone)
    const collecteurByNameZone = {}
    for (const [zoneName, names] of Object.entries(COLLECTEURS_BY_CITY)) {
      const zone = zoneByName[zoneName]
      if (!zone) continue
      for (const name of names) {
        const numero_collecteur = toNumeroCollecteur(name, zoneName)
        const [col] = await models.Collecteur.findOrCreate({
          where: { numero_collecteur },
          defaults: {
            name,
            phone: null,
            numero_collecteur,
            zone_id: zone.id,
            lot: null,
            statut: 'active',
          }
        })
        collecteurByNameZone[`${name}|${zoneName}`] = col
      }
    }

    // Insert batiments
    let created = 0
    for (const b of RAW_BATIMENTS) {
      const zone = zoneByName[b.ville]
      const collecteur = collecteurByNameZone[`${b.collecteur}|${b.ville}`]
      const payload = {
        code: String(b.id),
        gref: null,
        usage_principal: null,
        proprietaire: null,
        ville: b.ville || null,
        commune: b.commune || null,
        quartier: b.quartier || null,
        avenue: b.avenue || null,
        numero: null,
        adresse: null,
        superficie: null,
        latitude: b.lat != null ? Number(b.lat) : null,
        longitude: b.lng != null ? Number(b.lng) : null,
        montant_loyer: null,
        occupant: null,
        nombre_appartements: null,
        has_business: null,
        type_business: null,
        photo: null,
        montant_a_payer: null,
        survey_status: null,
        progression: b.progression || null,
        statut: 'active',
        collecteur_id: collecteur ? collecteur.id : null,
        zone_id: zone ? zone.id : null,
      }
      await models.Batiment.create(payload)
      created += 1
    }

    console.log(`Seed complete: zones=${Object.keys(zoneByName).length}, collecteurs=${Object.keys(collecteurByNameZone).length}, batiments=${created}`)
  } catch (e) {
    console.error('Seed failed:', e)
    process.exitCode = 1
  } finally {
    await models.sequelize.close()
  }
}

if (require.main === module) {
  main()
}
