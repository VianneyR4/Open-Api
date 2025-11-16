import { pool } from '../config/db.js'

/**
 * Log an activity to the database
 * @param {Object} options
 * @param {number} options.userId - User ID who performed the action
 * @param {string} options.action - Action type (login, logout, create, update, delete, view, etc.)
 * @param {string} options.resourceType - Resource type (user, batiment, collecteur, zone, etc.)
 * @param {number} options.resourceId - ID of the affected resource
 * @param {string} options.description - Human-readable description
 * @param {Object} options.metadata - Additional metadata (JSON)
 * @param {string} options.ipAddress - IP address of the user
 * @param {string} options.userAgent - User agent string
 */
export async function logActivity({
  userId = null,
  action,
  resourceType,
  resourceId = null,
  description = null,
  metadata = null,
  ipAddress = null,
  userAgent = null,
}) {
  try {
    await pool.query(
      `INSERT INTO activity_logs 
       (user_id, action, resource_type, resource_id, description, metadata, ip_address, user_agent) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [
        userId,
        action,
        resourceType,
        resourceId,
        description,
        metadata ? JSON.stringify(metadata) : null,
        ipAddress,
        userAgent,
      ]
    )
  } catch (error) {
    // Log errors but don't throw - we don't want logging failures to break the app
    console.error('Failed to log activity:', error)
  }
}

/**
 * Get client IP address from request
 */
export function getClientIp(req) {
  return (
    req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
    req.headers['x-real-ip'] ||
    req.connection?.remoteAddress ||
    req.socket?.remoteAddress ||
    'unknown'
  )
}

/**
 * Extract user agent from request
 */
export function getUserAgent(req) {
  return req.headers['user-agent'] || 'unknown'
}

