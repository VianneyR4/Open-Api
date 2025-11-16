import { Router } from 'express'
import {
  getAllBatiments,
  getBatimentById,
  getBatimentsStats,
  getBatimentsByZone,
  getBatimentsByCollecteur,
  searchBatiments,
  getBatimentsCities,
  getBatimentsProgressionSummary
} from '../controllers/batimentController.js'

const router = Router()

// GET /batiments - List all batiments with filters
router.get('/', getAllBatiments)

// GET /batiments/stats - Get batiments statistics (must come before /:id)
router.get('/stats', getBatimentsStats)

// GET /batiments/cities - Get unique cities from batiments (must come before /:id)
router.get('/cities', getBatimentsCities)

// GET /batiments/progression-summary - Get progression summary (must come before /:id)
router.get('/progression-summary', getBatimentsProgressionSummary)

// GET /batiments/by-zone/:zone_id - Get batiments by zone (must come before /:id)
router.get('/by-zone/:zone_id', getBatimentsByZone)

// GET /batiments/by-collecteur/:collecteur_id - Get batiments by collecteur (must come before /:id)
router.get('/by-collecteur/:collecteur_id', getBatimentsByCollecteur)

// GET /batiments/search/:term - Search batiments by term (must come before /:id)
router.get('/search/:term', searchBatiments)

// GET /batiments/:id - Get batiment by ID with details (must come last)
router.get('/:id', getBatimentById)

export default router
