const knex = require('../db')

const teardownJest = async () => {
  console.log('Running global teardown...')
  await knex.destroy()
}

module.exports = teardownJest
