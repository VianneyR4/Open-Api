export function requireRole(required) {
  return function (req, res, next) {
    const role = req.user?.role
    if (!role) return res.status(401).json({ error: 'Unauthorized' })
    if (Array.isArray(required)) {
      if (!required.includes(role)) return res.status(403).json({ error: 'Forbidden' })
    } else if (role !== required) {
      return res.status(403).json({ error: 'Forbidden' })
    }
    next()
  }
}
