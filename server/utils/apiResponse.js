/**
 * Small helper so every controller returns the same envelope shape:
 * { success, message, data }. Keeps the frontend's API client simple —
 * it can always read `response.data.data` without checking per-endpoint.
 */
function sendSuccess(res, { statusCode = 200, message = "OK", data = null, meta } = {}) {
  const body = { success: true, message, data };
  if (meta) body.meta = meta;
  return res.status(statusCode).json(body);
}

module.exports = sendSuccess;
