export function cityFilter(req, res, next) {
  if (req.user?.role === 'admin') return next()
  const zoneId = req.user?.zone_id != null ? Number(req.user.zone_id) : null
  if (zoneId == null || Number.isNaN(zoneId)) {
    return res.status(400).json({ error: 'Zone not set for user' })
  }
  // Attach zone-based filter for downstream handlers.
  req.zoneFilter = { zone_id: zoneId }
  // Backward compatibility: some handlers may still read req.cityFilter
  req.cityFilter = { zone_id: zoneId }
  return next()
}
