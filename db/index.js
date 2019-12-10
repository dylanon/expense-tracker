const instantiateKnex = require('knex')

const dbHost = process.env.NODE_ENV === 'test' ? 'test_db' : 'db'

const knex = instantiateKnex({
  client: 'pg',
  connection: `postgresql://postgres@${dbHost}:5432`,
})

module.exports = knex
