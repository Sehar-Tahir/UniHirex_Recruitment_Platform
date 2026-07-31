// Shared helper so every paginated endpoint behaves consistently.
// Usage: const { skip, limit, page } = getPaginationParams(req.query);
function getPaginationParams(query, defaultLimit = 9) {
  const page = Math.max(parseInt(query.page) || 1, 1);
  const limit = Math.max(parseInt(query.limit) || defaultLimit, 1);
  const skip = (page - 1) * limit;
  return { page, limit, skip };
}

function buildPaginatedResponse(data, total, page, limit) {
  return {
    data,
    total,
    page,
    totalPages: Math.ceil(total / limit) || 1,
  };
}

module.exports = { getPaginationParams, buildPaginatedResponse };