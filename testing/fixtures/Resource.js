const knex = require('../../db')

class Resource {
  constructor(dbTable, attributes) {
    this.dbTable = dbTable
    this.attributes = attributes
  }

  create = async () => {
    try {
      const [resource] = await knex(this.dbTable)
        .returning('*')
        .insert(this.attributes)
      this.attributes = resource
      return resource
    } catch (error) {
      throw new Error(
        `Failed to create resource in table ${this.dbTable}. ${error}`
      )
    }
  }

  destroy = async () => {
    try {
      const [destroyed] = await knex(this.dbTable)
        .where('id', this.attributes.id)
        .del()
        .returning('*')
      return destroyed
    } catch (error) {
      throw new Error(
        `Failed to delete resource with id ${this.attributes.id} from table '${this.dbTable}'. ${error}`
      )
    }
  }
}

module.exports = Resource
