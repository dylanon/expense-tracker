exports.up = function(knex) {
  return knex.schema.createTable('projects', table => {
    table.bigIncrements('id')
    table.text('name')
    table
      .bigInteger('owner')
      .references('id')
      .inTable('users')
  })
}

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('projects')
}
