exports.up = function(knex) {
  return knex.schema.createTable('transactions', table => {
    table.bigIncrements('id')
    table.specificType('amount', 'money')
    table.text('name')
    table.text('type')
    table.timestamp('date', { useTz: true })
  })
}

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('transactions')
}
