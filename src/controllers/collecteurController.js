import { pool } from '../config/db.js'

// GET /collecteurs - List all collecteurs with optional filters
export async function getAllCollecteurs(req, res) {
  try {
    const { 
      zone_id, 
      city, 
      statut, 
      lot,
      search,
      page = 1, 
      limit = 50 
    } = req.query
    
    const params = []
    const where = []
    
    if (zone_id) {
      params.push(Number(zone_id))
      where.push(`c.zone_id = $${params.length}`)
    }
    
    if (city) {
      params.push(city)
      where.push(`z.name = $${params.length}`)
    }
    
    if (statut) {
      params.push(statut)
      where.push(`c.statut = $${params.length}`)
    }
    
    if (lot) {
      params.push(lot)
      where.push(`c.lot = $${params.length}`)
    }
    
    if (search) {
      params.push(`%${search}%`)
      where.push(`(c.name ILIKE $${params.length} OR c.numero_collecteur ILIKE $${params.length} OR c.phone ILIKE $${params.length})`)
    }
    
    const limitVal = Math.min(Number(limit), 200)
    const offsetVal = (Number(page) - 1) * limitVal
    
    const countSql = `
      SELECT COUNT(*) as total
      FROM collecteurs c
      LEFT JOIN zones z ON z.id = c.zone_id
      ${where.length ? 'WHERE ' + where.join(' AND ') : ''}
    `
    
    const sql = `
      SELECT
        c.*,
        z.id as zone_id_ref,
        z.name as zone_name,
        (
          SELECT MAX(updated_at) FROM batiments b WHERE b.collecteur_id = c.id
        ) as derniere_activite
      FROM collecteurs c
      LEFT JOIN zones z ON z.id = c.zone_id
      ${where.length ? 'WHERE ' + where.join(' AND ') : ''}
      ORDER BY c.id ASC
      LIMIT $${params.length + 1} OFFSET $${params.length + 2}
    `
    
    params.push(limitVal, offsetVal)
    
    const [countResult, result] = await Promise.all([
      pool.query(countSql, where.length ? params.slice(0, -2) : []),
      pool.query(sql, params)
    ])
    
    const total = parseInt(countResult.rows[0].total)
    
    const mapped = result.rows.map(r => {
      const totalBatiments = Number(r.batiments_total || 0)
      const validees = Number(r.batiments_validee || 0)
      const avancement_percent = totalBatiments > 0 ? Math.round((validees / totalBatiments) * 100) : 0
      
      return {
        id: r.id,
        name: r.name,
        numero_collecteur: r.numero_collecteur,
        phone: r.phone,
        statut: r.statut,
        lot: r.lot,
        batiments_total: totalBatiments,
        batiments_validee: validees,
        avancement_percent,
        derniere_activite: r.derniere_activite,
        created_at: r.created_at,
        updated_at: r.updated_at,
        zone: r.zone_id_ref ? { 
          id: r.zone_id_ref, 
          name: r.zone_name 
        } : null
      }
    })
    
    res.json({
      data: mapped,
      pagination: {
        page: Number(page),
        limit: limitVal,
        total,
        totalPages: Math.ceil(total / limitVal)
      }
    })
  } catch (e) {
    console.error('Error in getAllCollecteurs:', e)
    res.status(500).json({ error: 'Internal server error' })
  }
}

// GET /collecteurs/:id - Get collecteur by ID
export async function getCollecteurById(req, res) {
  try {
    const sql = `
      SELECT
        c.*,
        z.id as zone_id_ref,
        z.name as zone_name,
        (
          SELECT MAX(updated_at) FROM batiments b WHERE b.collecteur_id = c.id
        ) as derniere_activite
      FROM collecteurs c
      LEFT JOIN zones z ON z.id = c.zone_id
      WHERE c.id = $1
      LIMIT 1
    `
    
    const result = await pool.query(sql, [req.params.id])
    
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Collecteur not found' })
    }
    
    const r = result.rows[0]
    const totalBatiments = Number(r.batiments_total || 0)
    const validees = Number(r.batiments_validee || 0)
    const avancement_percent = totalBatiments > 0 ? Math.round((validees / totalBatiments) * 100) : 0
    
    const collecteur = {
      id: r.id,
      name: r.name,
      numero_collecteur: r.numero_collecteur,
      phone: r.phone,
      statut: r.statut,
      lot: r.lot,
      batiments_total: totalBatiments,
      batiments_validee: validees,
      avancement_percent,
      derniere_activite: r.derniere_activite,
      created_at: r.created_at,
      updated_at: r.updated_at,
      zone: r.zone_id_ref ? { 
        id: r.zone_id_ref, 
        name: r.zone_name 
      } : null
    }
    
    res.json(collecteur)
  } catch (e) {
    console.error('Error in getCollecteurById:', e)
    res.status(500).json({ error: 'Internal server error' })
  }
}

// GET /collecteurs/stats - Get collecteurs statistics
export async function getCollecteursStats(req, res) {
  try {
    const { zone_id } = req.query
    
    let whereClause = ''
    const params = []
    
    if (zone_id) {
      whereClause = 'WHERE zone_id = $1'
      params.push(Number(zone_id))
    }
    
    const sql = `
      SELECT
        COUNT(*) as total_collecteurs,
        COUNT(CASE WHEN statut = 'actif' THEN 1 END) as actifs,
        COUNT(CASE WHEN statut = 'inactif' THEN 1 END) as inactifs,
        COALESCE(SUM(batiments_total), 0) as total_batiments,
        COALESCE(SUM(batiments_validee), 0) as total_batiments_validees,
        CASE 
          WHEN COALESCE(SUM(batiments_total), 0) > 0 
          THEN ROUND((SUM(batiments_validee)::float / SUM(batiments_total)) * 100, 2)
          ELSE 0 
        END as avg_avancement
      FROM collecteurs
      ${whereClause}
    `
    
    const result = await pool.query(sql, params)
    res.json(result.rows[0])
  } catch (e) {
    console.error('Error in getCollecteursStats:', e)
    res.status(500).json({ error: 'Internal server error' })
  }
}

// GET /collecteurs/by-zone/:zone_id - Get collecteurs by zone
export async function getCollecteursByZone(req, res) {
  try {
    const { zone_id } = req.params
    const { page = 1, limit = 50 } = req.query
    
    const limitVal = Math.min(Number(limit), 200)
    const offsetVal = (Number(page) - 1) * limitVal
    
    // Get total count for pagination
    const countSql = `
      SELECT COUNT(*) as total 
      FROM collecteurs 
      WHERE zone_id = $1
    `
    
    const sql = `
      SELECT
        c.*,
        z.name as zone_name,
        (
          SELECT MAX(updated_at) FROM batiments b WHERE b.collecteur_id = c.id
        ) as derniere_activite
      FROM collecteurs c
      LEFT JOIN zones z ON z.id = c.zone_id
      WHERE c.zone_id = $1
      ORDER BY c.name ASC
      LIMIT $2 OFFSET $3
    `
    
    const [countResult, result] = await Promise.all([
      pool.query(countSql, [zone_id]),
      pool.query(sql, [zone_id, limitVal, offsetVal])
    ])
    
    const total = parseInt(countResult.rows[0].total)
    
    const mapped = result.rows.map(r => {
      const totalBatiments = Number(r.batiments_total || 0)
      const validees = Number(r.batiments_validee || 0)
      const avancement_percent = totalBatiments > 0 ? Math.round((validees / totalBatiments) * 100) : 0
      
      return {
        id: r.id,
        name: r.name,
        numero_collecteur: r.numero_collecteur,
        phone: r.phone,
        statut: r.statut,
        lot: r.lot,
        batiments_total: totalBatiments,
        batiments_validee: validees,
        avancement_percent,
        derniere_activite: r.derniere_activite,
        created_at: r.created_at,
        updated_at: r.updated_at
      }
    })
    
    res.json({
      data: mapped,
      pagination: {
        page: Number(page),
        limit: limitVal,
        total,
        totalPages: Math.ceil(total / limitVal)
      }
    })
  } catch (e) {
    console.error('Error in getCollecteursByZone:', e)
    res.status(500).json({ error: 'Internal server error' })
  }
}

// GET /collecteurs/search/:term - Search collecteurs by term
export async function searchCollecteurs(req, res) {
  try {
    const { term } = req.params
    const { page = 1, limit = 20 } = req.query
    
    const limitVal = Math.min(Number(limit), 100)
    const offsetVal = (Number(page) - 1) * limitVal
    
    // Get total count for pagination
    const countSql = `
      SELECT COUNT(*) as total
      FROM collecteurs c
      LEFT JOIN zones z ON z.id = c.zone_id
      WHERE 
        c.name ILIKE $1 OR 
        c.numero_collecteur ILIKE $1 OR 
        c.phone ILIKE $1 OR
        c.lot ILIKE $1
    `
    
    const sql = `
      SELECT
        c.*,
        z.name as zone_name,
        (
          SELECT MAX(updated_at) FROM batiments b WHERE b.collecteur_id = c.id
        ) as derniere_activite
      FROM collecteurs c
      LEFT JOIN zones z ON z.id = c.zone_id
      WHERE 
        c.name ILIKE $1 OR 
        c.numero_collecteur ILIKE $1 OR 
        c.phone ILIKE $1 OR
        c.lot ILIKE $1
      ORDER BY 
        CASE 
          WHEN c.name ILIKE $2 THEN 1
          WHEN c.numero_collecteur ILIKE $2 THEN 2
          ELSE 3
        END,
        c.name ASC
      LIMIT $3 OFFSET $4
    `
    
    const [countResult, result] = await Promise.all([
      pool.query(countSql, [`%${term}%`]),
      pool.query(sql, [`%${term}%`, `${term}%`, limitVal, offsetVal])
    ])
    
    const total = parseInt(countResult.rows[0].total)
    
    const mapped = result.rows.map(r => {
      const totalBatiments = Number(r.batiments_total || 0)
      const validees = Number(r.batiments_validee || 0)
      const avancement_percent = totalBatiments > 0 ? Math.round((validees / totalBatiments) * 100) : 0
      
      return {
        id: r.id,
        name: r.name,
        numero_collecteur: r.numero_collecteur,
        phone: r.phone,
        statut: r.statut,
        lot: r.lot,
        batiments_total: totalBatiments,
        batiments_validee: validees,
        avancement_percent,
        derniere_activite: r.derniere_activite,
        created_at: r.created_at,
        updated_at: r.updated_at,
        zone: r.zone_id ? { 
          id: r.zone_id, 
          name: r.zone_name 
        } : null
      }
    })
    
    res.json({
      data: mapped,
      search_term: term,
      pagination: {
        page: Number(page),
        limit: limitVal,
        total,
        totalPages: Math.ceil(total / limitVal)
      }
    })
  } catch (e) {
    console.error('Error in searchCollecteurs:', e)
    res.status(500).json({ error: 'Internal server error' })
  }
}