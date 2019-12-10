exports.up = function(knex) {
  return knex.schema.alterTable('transactions', table => {
    table
      .bigInteger('createdBy')
      .references('id')
      .inTable('users')
  })
}

exports.down = function(knex) {
  return knex.schema.alterTable('transactions', table => {
    table.dropColumn('createdBy')
  })
}
