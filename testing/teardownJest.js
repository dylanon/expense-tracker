const knex = require('../db')

const teardownJest = async () => {
  console.log('Running global teardown...')
  await knex.destroy()
  return console.log('Global teardown complete!')
}

module.exports = teardownJest
