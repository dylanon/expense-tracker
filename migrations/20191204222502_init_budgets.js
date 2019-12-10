exports.up = function(knex) {
  return knex.schema.createTable('budgets', table => {
    table.bigIncrements('id')
    table
      .bigInteger('projectId')
      .references('id')
      .inTable('projects')
    table
      .bigInteger('createdBy')
      .references('id')
      .inTable('users')
    table.text('name')
    table.timestamp('startDate', { useTz: true })
    table.timestamp('endDate', { useTz: true })
    table.specificType('target', 'money')
  })
}

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('budgets')
}
