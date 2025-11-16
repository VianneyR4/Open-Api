import { Router } from 'express'
import {
  getAllCollecteurs,
  getCollecteurById,
  getCollecteursStats,
  getCollecteursByZone,
  searchCollecteurs
} from '../controllers/collecteurController.js'

const router = Router()

// GET /collecteurs - List all collecteurs with filters
router.get('/', getAllCollecteurs)

// GET /collecteurs/stats - Get collecteurs statistics (must come before /:id)
router.get('/stats', getCollecteursStats)

// GET /collecteurs/by-zone/:zone_id - Get collecteurs by zone (must come before /:id)
router.get('/by-zone/:zone_id', getCollecteursByZone)

// GET /collecteurs/search/:term - Search collecteurs by term (must come before /:id)
router.get('/search/:term', searchCollecteurs)

// GET /collecteurs/:id - Get collecteur by ID (must come last)
router.get('/:id', getCollecteurById)

export default router
