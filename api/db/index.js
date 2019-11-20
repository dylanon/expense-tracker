const instantiateKnex = require('knex')

const knex = instantiateKnex({
  client: 'pg',
  connection: 'postgresql://postgres@db:5432',
})

knex('transactions')
  .select('*')
  .then(txs => {
    console.log('txs', txs)
  })
