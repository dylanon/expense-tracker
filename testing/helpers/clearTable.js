const knex = require('../../db')

const clearTable = async tableName => {
  try {
    await knex(tableName)
      .select('*')
      .del()
  } catch (error) {
    console.log(`Failed to clear table '${tableName}'. ${error}`)
  }
}

module.exports = clearTable
