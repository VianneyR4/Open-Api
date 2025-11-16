import bcrypt from 'bcryptjs'
import { pool } from './db.js'

/**
 * Ensure an admin user exists.
 * - If no user with the admin email exists, create it with the provided password.
 * - If it exists but role is not 'admin', elevate role to 'admin'.
 * - Does NOT overwrite existing password for safety.
 */
export async function seedAdmin() {
  const adminEmail = 'admin@gmail.com'
  const defaultPassword = 'admin123456'

  try {
    // Check if user exists
    const existing = await pool.query(
      'SELECT id, role FROM users WHERE email=$1',
      [adminEmail]
    )

    if (existing.rowCount === 0) {
      const hash = await bcrypt.hash(defaultPassword, 10)
      const result = await pool.query(
        `INSERT INTO users (email, password_hash, name, phone, role, zone_scope)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING id, email, role`,
        [adminEmail, hash, 'Admin', null, 'admin', 'all']
      )
      const user = result.rows[0]
      console.log(`✅ Seeded admin user: ${user.email} (id=${user.id})`)
    } else {
      const { id, role } = existing.rows[0]
      if (role !== 'admin') {
        await pool.query('UPDATE users SET role=$1 WHERE id=$2', ['admin', id])
        console.log(`✅ Ensured user ${adminEmail} has role=admin (id=${id})`)
      } else {
        console.log('ℹ️ Admin user already present')
      }
    }
  } catch (e) {
    console.error('❌ Failed to seed admin user:', e.message)
  }
}
