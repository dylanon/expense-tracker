const knex = require('../../db')

class Resource {
  constructor(dbTable, attributes) {
    const { createdBy } = attributes
    if (!createdBy) {
      throw new Error(
        '[fixtures/Resource]: `createdBy` is a required argument in constructor.'
      )
    }
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
      console.log(
        `[fixtures/Resource]: Failed to create resource in table ${this.dbTable}. ${error}`
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
      console.log(
        `[fixtures/Resource]: Failed to delete resource with id ${this.attributes.id} from table '${this.dbTable}'. ${error}`
      )
    }
  }
}

module.exports = Resource
