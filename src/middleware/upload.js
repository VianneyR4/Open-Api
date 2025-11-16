import multer from 'multer'
import path from 'path'
import fs from 'fs'

const uploadsRoot = path.resolve(process.cwd(), 'uploads')
const batimentsDir = path.join(uploadsRoot, 'batiments')

function ensureDirs() {
  fs.mkdirSync(batimentsDir, { recursive: true })
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    try {
      ensureDirs()
      cb(null, batimentsDir)
    } catch (e) {
      cb(e)
    }
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname)
    const base = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9-_]/g, '_')
    const stamp = Date.now()
    cb(null, `${base}-${stamp}${ext}`)
  },
})

export const uploadBatimentImages = multer({ storage })

export function toPublicPath(filePath) {
  // Convert absolute path to /uploads relative public URL
  const rel = path.relative(uploadsRoot, filePath)
  return `/uploads/${rel.replace(/\\/g, '/')}`
}
