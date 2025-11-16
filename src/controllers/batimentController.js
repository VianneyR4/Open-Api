import { pool } from '../config/db.js'

// GET /batiments - List all batiments with optional filters
export async function getAllBatiments(req, res) {
  try {
    const { 
      zone_id, 
      collecteur_id, 
      city,
      statut,
      survey_status,
      progression,
      search,
      page = 1, 
      limit = 50,
      sort_by = 'id',
      sort_order = 'ASC'
    } = req.query
    
    const params = []
    const where = []
    
    if (zone_id) {
      params.push(Number(zone_id))
      where.push(`b.zone_id = $${params.length}`)
    }
    
    if (collecteur_id) {
      params.push(Number(collecteur_id))
      where.push(`b.collecteur_id = $${params.length}`)
    }
    
    if (city) {
      params.push(city)
      where.push(`z.name = $${params.length}`)
    }
    
    if (statut) {
      params.push(statut)
      where.push(`b.statut = $${params.length}`)
    }
    
    if (survey_status) {
      params.push(survey_status)
      where.push(`b.survey_status = $${params.length}`)
    }
    
    if (progression) {
      params.push(progression)
      where.push(`b.progression = $${params.length}`)
    }
    
    if (search) {
      params.push(`%${search}%`)
      where.push(`(
        b.code ILIKE $${params.length} OR 
        b.nom_batiment ILIKE $${params.length} OR 
        b.adresse ILIKE $${params.length} OR 
        b.ville ILIKE $${params.length} OR 
        b.occupant ILIKE $${params.length}
      )`)
    }
    
    const limitVal = Math.min(Number(limit), 1000)
    const offsetVal = (Number(page) - 1) * limitVal
    
    // Validate sort column
    const validSortColumns = ['id', 'code', 'nom_batiment', 'ville', 'created_at', 'updated_at']
    const sortBy = validSortColumns.includes(sort_by) ? sort_by : 'id'
    const sortOrder = sort_order.toUpperCase() === 'DESC' ? 'DESC' : 'ASC'
    
    const countSql = `
      SELECT COUNT(*) as total
      FROM batiments b
      LEFT JOIN zones z ON z.id = b.zone_id
      LEFT JOIN collecteurs c ON c.id = b.collecteur_id
      ${where.length ? 'WHERE ' + where.join(' AND ') : ''}
    `
    
    const sql = `
      SELECT
        b.*,
        z.name as zone_name,
        c.name as collecteur_name,
        c.numero_collecteur as collecteur_numero
      FROM batiments b
      LEFT JOIN zones z ON z.id = b.zone_id
      LEFT JOIN collecteurs c ON c.id = b.collecteur_id
      ${where.length ? 'WHERE ' + where.join(' AND ') : ''}
      ORDER BY b.${sortBy} ${sortOrder}
      LIMIT $${params.length + 1} OFFSET $${params.length + 2}
    `
    
    params.push(limitVal, offsetVal)
    
    const [countResult, result] = await Promise.all([
      pool.query(countSql, params.slice(0, -2)),
      pool.query(sql, params)
    ])
    
    const total = parseInt(countResult.rows[0].total)
    
    res.json({
      data: result.rows,
      pagination: {
        page: Number(page),
        limit: limitVal,
        total,
        totalPages: Math.ceil(total / limitVal)
      }
    })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Internal error' })
  }
}

// GET /batiments/:id - Get batiment by ID with details
export async function getBatimentById(req, res) {
  try {
    const { id } = req.params
    
    const sql = `
      SELECT
        b.*,
        z.name as zone_name,
        c.name as collecteur_name,
        c.numero_collecteur as collecteur_numero,
        c.phone as collecteur_phone
      FROM batiments b
      LEFT JOIN zones z ON z.id = b.zone_id
      LEFT JOIN collecteurs c ON c.id = b.collecteur_id
      WHERE b.id = $1
      LIMIT 1
    `
    
    const result = await pool.query(sql, [id])
    if (result.rowCount === 0) return res.status(404).json({ error: 'Not found' })
    
    res.json(result.rows[0])
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Internal error' })
  }
}

// GET /batiments/stats - Get batiments statistics
export async function getBatimentsStats(req, res) {
  try {
    const { zone_id, collecteur_id } = req.query
    
    let whereClause = ''
    const params = []
    
    if (zone_id) {
      whereClause += ' WHERE zone_id = $1'
      params.push(Number(zone_id))
    }
    
    if (collecteur_id) {
      whereClause += whereClause ? ' AND collecteur_id = $2' : ' WHERE collecteur_id = $1'
      params.push(Number(collecteur_id))
    }
    
    const sql = `
      SELECT
        COUNT(*) as total_batiments,
        COUNT(CASE WHEN statut = 'actif' THEN 1 END) as actifs,
        COUNT(CASE WHEN statut = 'inactif' THEN 1 END) as inactifs,
        COUNT(CASE WHEN survey_status = 'completed' THEN 1 END) as survey_completed,
        COUNT(CASE WHEN survey_status = 'pending' THEN 1 END) as survey_pending,
        COUNT(CASE WHEN progression = 'completed' THEN 1 END) as progression_completed,
        COUNT(CASE WHEN progression = 'in_progress' THEN 1 END) as progression_in_progress,
        AVG(surface_habitable) as avg_surface,
        MAX(surface_habitable) as max_surface,
        MIN(surface_habitable) as min_surface
      FROM batiments
      ${whereClause}
    `
    
    const result = await pool.query(sql, params)
    res.json(result.rows[0])
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Internal error' })
  }
}

// GET /batiments/by-zone/:zone_id - Get batiments by zone
export async function getBatimentsByZone(req, res) {
  try {
    const { zone_id } = req.params
    const { page = 1, limit = 100, statut } = req.query
    
    const limitVal = Math.min(Number(limit), 1000)
    const offsetVal = (Number(page) - 1) * limitVal
    
    let whereClause = 'WHERE b.zone_id = $1'
    const params = [zone_id]
    
    if (statut) {
      params.push(statut)
      whereClause += ` AND b.statut = $${params.length}`
    }
    
    const sql = `
      SELECT
        b.*,
        z.name as zone_name,
        c.name as collecteur_name,
        c.numero_collecteur as collecteur_numero
      FROM batiments b
      LEFT JOIN zones z ON z.id = b.zone_id
      LEFT JOIN collecteurs c ON c.id = b.collecteur_id
      ${whereClause}
      ORDER BY b.code ASC
      LIMIT $${params.length + 1} OFFSET $${params.length + 2}
    `
    
    params.push(limitVal, offsetVal)
    
    const result = await pool.query(sql, params)
    
    res.json({
      data: result.rows,
      pagination: {
        page: Number(page),
        limit: limitVal,
        total: result.rows.length
      }
    })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Internal error' })
  }
}

// GET /batiments/by-collecteur/:collecteur_id - Get batiments by collecteur
export async function getBatimentsByCollecteur(req, res) {
  try {
    const { collecteur_id } = req.params
    const { page = 1, limit = 100, statut } = req.query
    
    const limitVal = Math.min(Number(limit), 1000)
    const offsetVal = (Number(page) - 1) * limitVal
    
    let whereClause = 'WHERE b.collecteur_id = $1'
    const params = [collecteur_id]
    
    if (statut) {
      params.push(statut)
      whereClause += ` AND b.statut = $${params.length}`
    }
    
    const sql = `
      SELECT
        b.*,
        z.name as zone_name,
        c.name as collecteur_name,
        c.numero_collecteur as collecteur_numero
      FROM batiments b
      LEFT JOIN zones z ON z.id = b.zone_id
      LEFT JOIN collecteurs c ON c.id = b.collecteur_id
      ${whereClause}
      ORDER BY b.code ASC
      LIMIT $${params.length + 1} OFFSET $${params.length + 2}
    `
    
    params.push(limitVal, offsetVal)
    
    const result = await pool.query(sql, params)
    
    res.json({
      data: result.rows,
      pagination: {
        page: Number(page),
        limit: limitVal,
        total: result.rows.length
      }
    })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Internal error' })
  }
}

// GET /batiments/search/:term - Search batiments by term
export async function searchBatiments(req, res) {
  try {
    const { term } = req.params
    const { page = 1, limit = 50 } = req.query
    
    const limitVal = Math.min(Number(limit), 200)
    const offsetVal = (Number(page) - 1) * limitVal
    
    const sql = `
      SELECT
        b.*,
        z.name as zone_name,
        c.name as collecteur_name,
        c.numero_collecteur as collecteur_numero
      FROM batiments b
      LEFT JOIN zones z ON z.id = b.zone_id
      LEFT JOIN collecteurs c ON c.id = b.collecteur_id
      WHERE 
        b.code ILIKE $1 OR 
        b.nom_batiment ILIKE $1 OR 
        b.adresse ILIKE $1 OR
        b.ville ILIKE $1 OR
        b.occupant ILIKE $1 OR
        b.quartier ILIKE $1
      ORDER BY 
        CASE 
          WHEN b.code ILIKE $2 THEN 1
          WHEN b.nom_batiment ILIKE $2 THEN 2
          ELSE 3
        END,
        b.code ASC
      LIMIT $3 OFFSET $4
    `
    
    const result = await pool.query(sql, [`%${term}%`, `${term}%`, limitVal, offsetVal])
    
    res.json({
      data: result.rows,
      search_term: term,
      pagination: {
        page: Number(page),
        limit: limitVal,
        total: result.rows.length
      }
    })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Internal error' })
  }
}

// GET /batiments/cities - Get unique cities from batiments
export async function getBatimentsCities(req, res) {
  try {
    const sql = `
      SELECT DISTINCT ville as city, COUNT(*) as count
      FROM batiments
      WHERE ville IS NOT NULL AND ville != ''
      GROUP BY ville
      ORDER BY ville ASC
    `
    
    const result = await pool.query(sql)
    res.json(result.rows)
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Internal error' })
  }
}

// GET /batiments/progression-summary - Get progression summary
export async function getBatimentsProgressionSummary(req, res) {
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
        progression,
        COUNT(*) as count,
        ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER(), 2) as percentage
      FROM batiments
      ${whereClause}
      GROUP BY progression
      ORDER BY count DESC
    `
    
    const result = await pool.query(sql, params)
    res.json(result.rows)
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Internal error' })
  }
}
