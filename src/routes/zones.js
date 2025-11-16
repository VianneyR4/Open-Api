import { Router } from 'express'
import {
  getAllZones,
  getZoneById,
  getZonesStats,
  searchZones,
  getZonesWithStats
} from '../controllers/zoneController.js'

const router = Router()

// GET /zones - List all zones with filters
router.get('/', getAllZones)

// GET /zones/stats - Get zones statistics (must come before /:id)
router.get('/stats', getZonesStats)

// GET /zones/with-stats - Get zones with detailed statistics (must come before /:id)
router.get('/with-stats', getZonesWithStats)

// GET /zones/search/:term - Search zones by term (must come before /:id)
router.get('/search/:term', searchZones)

// GET /zones/:id - Get zone by ID with details (must come last)
router.get('/:id', getZoneById)

export default router
