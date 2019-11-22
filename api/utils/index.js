function createBadRequestError(schemaError) {
  return { errors: schemaError.details.map(detail => detail.message) }
}

module.exports = {
  createBadRequestError,
}
