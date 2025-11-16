import { Router } from 'express'
import { pool } from '../config/db.js'

const router = Router()

router.get('/', async (req, res) => {
  try {
    const db = await pool.query('SELECT 1 as ok')
    res.json({ ok: true, db: db?.rows?.[0]?.ok === 1 })
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message })
  }
})

export default router
