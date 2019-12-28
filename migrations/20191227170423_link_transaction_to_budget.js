exports.up = function(knex) {
  return knex.schema.alterTable('transactions', table => {
    table
      .bigInteger('budgetId')
      .references('id')
      .inTable('budgets')
  })
}

exports.down = function(knex) {
  return knex.schema.alterTable('transactions', table => {
    table.dropColumn('budgetId')
  })
}
