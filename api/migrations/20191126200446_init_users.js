exports.up = function(knex) {
  return knex.schema.createTable('users', table => {
    table.bigIncrements('id')
    table.text('email')
    table.text('username')
    table.text('password')
  })
}

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('users')
}
