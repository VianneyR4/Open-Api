import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { checkDbConnection } from './config/db.js'
import zonesRouter from './routes/zones.js'
import collecteursRouter from './routes/collecteurs.js'
import batimentsRouter from './routes/batiments.js'
import swaggerUi from 'swagger-ui-express'
import { swaggerDocument } from './swagger-config.js'

const app = express()
app.use(cors())
app.use(express.json())

// Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Root
app.get('/', (req, res) => {
  res.json({ name: 'my-api-external', status: 'ok' })
})

// Health
app.get('/health', async (req, res) => {
  try {
    res.json({ ok: true })
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message })
  }
})

// Routes (GET-only)
app.use('/zones', zonesRouter)
app.use('/collecteurs', collecteursRouter)
app.use('/batiments', batimentsRouter)

const PORT = process.env.PORT || 4001

app.listen(PORT, async () => {
  console.log(`External API listening on http://localhost:${PORT}`)
  await checkDbConnection()
})

