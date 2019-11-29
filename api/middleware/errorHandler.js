const { createBadRequestError } = require('../utils')

const errorHandler = (err, req, res, next) => {
  // TODO: Clean up error handling middleware
  if (err.name === 'ValidationError') {
    res.status(400).json(createBadRequestError(err))
  } else {
    res.status(500).json({ errors: ['Sorry, something went wrong.'] })
  }
}

module.exports = errorHandler
