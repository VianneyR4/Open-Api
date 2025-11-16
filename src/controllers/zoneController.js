import { pool } from '../config/db.js'

// GET /zones - List all zones with optional filters
export async function getAllZones(req, res) {
  try {
    const { 
      search, 
      page = 1, 
      limit = 50,
      sort_by = 'id',
      sort_order = 'ASC'
    } = req.query
    
    const params = []
    const where = []
    
    if (search) {
      params.push(`%${search}%`)
      where.push(`(name ILIKE $${params.length} OR lots ILIKE $${params.length})`)
    }
    
    const limitVal = Math.min(Number(limit), 200)
    const offsetVal = (Number(page) - 1) * limitVal
    
    // Validate sort column
    const validSortColumns = ['id', 'name', 'created_at', 'updated_at']
    const sortBy = validSortColumns.includes(sort_by) ? sort_by : 'id'
    const sortOrder = sort_order.toUpperCase() === 'DESC' ? 'DESC' : 'ASC'
    
    const countSql = `
      SELECT COUNT(*) as total
      FROM zones
      ${where.length ? 'WHERE ' + where.join(' AND ') : ''}
    `
    
    const sql = `
      SELECT 
        z.*,
        (
          SELECT COUNT(*) 
          FROM collecteurs c 
          WHERE c.zone_id = z.id
        ) as collecteurs_count,
        (
          SELECT COUNT(*) 
          FROM batiments b 
          WHERE b.zone_id = z.id
        ) as batiments_count
      FROM zones z
      ${where.length ? 'WHERE ' + where.join(' AND ') : ''}
      ORDER BY z.${sortBy} ${sortOrder}
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

// GET /zones/:id - Get zone by ID with details
export async function getZoneById(req, res) {
  try {
    const { id } = req.params
    
    const zoneSql = `
      SELECT 
        z.*,
        (
          SELECT COUNT(*) 
          FROM collecteurs c 
          WHERE c.zone_id = z.id
        ) as collecteurs_count,
        (
          SELECT COUNT(*) 
          FROM batiments b 
          WHERE b.zone_id = z.id
        ) as batiments_count,
        (
          SELECT MAX(updated_at) 
          FROM collecteurs c 
          WHERE c.zone_id = z.id
        ) as derniere_activite
      FROM zones z
      WHERE z.id = $1
      LIMIT 1
    `
    
    const zoneResult = await pool.query(zoneSql, [id])
    if (zoneResult.rowCount === 0) return res.status(404).json({ error: 'Not found' })
    
    const zone = zoneResult.rows[0]
    
    // Get collecteurs for this zone
    const collecteursSql = `
      SELECT 
        c.id,
        c.name,
        c.numero_collecteur,
        c.statut,
        c.batiments_total,
        c.batiments_validee,
        (
          SELECT COUNT(*) 
          FROM batiments b 
          WHERE b.collecteur_id = c.id
        ) as actual_batiments_count
      FROM collecteurs c
      WHERE c.zone_id = $1
      ORDER BY c.name ASC
    `
    
    const collecteursResult = await pool.query(collecteursSql, [id])
    
    const collecteursWithProgress = collecteursResult.rows.map(c => {
      const total = Number(c.batiments_total || 0)
      const validees = Number(c.batiments_validee || 0)
      const avancement_percent = total > 0 ? Math.round((validees / total) * 100) : 0
      return {
        ...c,
        avancement_percent
      }
    })
    
    res.json({
      ...zone,
      collecteurs: collecteursWithProgress
    })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Internal error' })
  }
}

// GET /zones/stats - Get zones statistics
export async function getZonesStats(req, res) {
  try {
    const sql = `
      SELECT
        COUNT(*) as total_zones,
        COUNT(CASE WHEN lots IS NOT NULL AND lots != '' THEN 1 END) as zones_with_lots,
        (
          SELECT COUNT(*) 
          FROM collecteurs
        ) as total_collecteurs,
        (
          SELECT COUNT(*) 
          FROM batiments
        ) as total_batiments,
        (
          SELECT COUNT(CASE WHEN statut = 'actif' THEN 1 END) 
          FROM collecteurs
        ) as collecteurs_actifs
      FROM zones
    `
    
    const result = await pool.query(sql)
    res.json(result.rows[0])
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Internal error' })
  }
}

// GET /zones/search/:term - Search zones by term
export async function searchZones(req, res) {
  try {
    const { term } = req.params
    const { page = 1, limit = 20 } = req.query
    
    const limitVal = Math.min(Number(limit), 100)
    const offsetVal = (Number(page) - 1) * limitVal
    
    const sql = `
      SELECT 
        z.*,
        (
          SELECT COUNT(*) 
          FROM collecteurs c 
          WHERE c.zone_id = z.id
        ) as collecteurs_count,
        (
          SELECT COUNT(*) 
          FROM batiments b 
          WHERE b.zone_id = z.id
        ) as batiments_count
      FROM zones z
      WHERE 
        z.name ILIKE $1 OR 
        z.lots ILIKE $1
      ORDER BY 
        CASE 
          WHEN z.name ILIKE $2 THEN 1
          ELSE 2
        END,
        z.name ASC
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

// GET /zones/with-stats - Get zones with detailed statistics
export async function getZonesWithStats(req, res) {
  try {
    const { page = 1, limit = 50 } = req.query
    
    const limitVal = Math.min(Number(limit), 200)
    const offsetVal = (Number(page) - 1) * limitVal
    
    const sql = `
      SELECT 
        z.*,
        (
          SELECT COUNT(*) 
          FROM collecteurs c 
          WHERE c.zone_id = z.id
        ) as collecteurs_count,
        (
          SELECT COUNT(CASE WHEN c.statut = 'actif' THEN 1 END) 
          FROM collecteurs c 
          WHERE c.zone_id = z.id
        ) as collecteurs_actifs,
        (
          SELECT COUNT(*) 
          FROM batiments b 
          WHERE b.zone_id = z.id
        ) as batiments_count,
        (
          SELECT SUM(c.batiments_validee) 
          FROM collecteurs c 
          WHERE c.zone_id = z.id
        ) as total_batiments_validees,
        (
          SELECT SUM(c.batiments_total) 
          FROM collecteurs c 
          WHERE c.zone_id = z.id
        ) as total_batiments_planned,
        (
          SELECT MAX(c.updated_at) 
          FROM collecteurs c 
          WHERE c.zone_id = z.id
        ) as derniere_activite
      FROM zones z
      ORDER BY z.name ASC
      LIMIT $1 OFFSET $2
    `
    
    const result = await pool.query(sql, [limitVal, offsetVal])
    
    const zonesWithStats = result.rows.map(zone => {
      const total = Number(zone.total_batiments_planned || 0)
      const validees = Number(zone.total_batiments_validees || 0)
      const avancement_percent = total > 0 ? Math.round((validees / total) * 100) : 0
      return {
        ...zone,
        avancement_percent
      }
    })
    
    res.json({
      data: zonesWithStats,
      pagination: {
        page: Number(page),
        limit: limitVal,
        total: zonesWithStats.length
      }
    })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Internal error' })
  }
}

// DELETE /zones/:id (admin)
export async function deleteZone(req, res) {
  try {
    const { id } = req.params
    const zone = await pool.query('SELECT * FROM zones WHERE id = $1', [id])
    if (zone.rowCount === 0) return res.status(404).json({ error: 'Not found' })
    
    // Capture data before deletion
    const dataBefore = zone.rows[0]
    const zoneName = zone.rows[0].name
    
    await pool.query('DELETE FROM zones WHERE id = $1', [id])
    
    // Log zone deletion with deleted data
    // await logActivity({
    //   userId: req.user?.id,
    //   action: 'delete',
    //   resourceType: 'zone',
    //   resourceId: id,
    //   description: `Zone supprimée: ${zoneName}`,
    //   metadata: { 
    //     action: 'delete',
    //     data_before: dataBefore
    //   },
    //   ipAddress: getClientIp(req),
    //   userAgent: getUserAgent(req),
    // })
    
    res.json({ ok: true })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Internal error' })
  }
}
