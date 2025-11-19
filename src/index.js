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

// Simple CORS for all origins (since we're using API keys)
app.use(cors())
app.use(express.json())

// API Key validation middleware
const validateApiKey = (req, res, next) => {
  const apiKey = req.headers['x-api-key'] || req.query.apiKey;
  
  if (!apiKey) {
    return res.status(401).json({ error: 'API key required' });
  }
  
  // Validate against your stored API keys
  const validKeys = process.env.API_KEYS ? process.env.API_KEYS.split(',') : [];
  
  if (!validKeys.includes(apiKey)) {
    return res.status(403).json({ error: 'Invalid API key' });
  }
  
  next();
};

// Apply to all API routes
app.use('/zones', validateApiKey, zonesRouter);
app.use('/collecteurs', validateApiKey, collecteursRouter);
app.use('/batiments', validateApiKey, batimentsRouter);

// Public routes (no API key required)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.get('/', (req, res) => {
  res.json({ name: 'my-api-external', status: 'ok' })
});
app.get('/health', async (req, res) => {
  try {
    res.json({ ok: true })
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message })
  }
});

const PORT = process.env.PORT || 4001

app.listen(PORT, async () => {
  console.log(`External API listening on http://localhost:${PORT}`)
  await checkDbConnection()
})