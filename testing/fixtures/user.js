const knex = require('../../db')
const { hashPassword } = require('../../utils')

class User {
  constructor(username, plainTextPassword, email) {
    this.username = username
    this.plainTextPassword = plainTextPassword
    this.email = email
    this.dbTable = 'users'
  }

  create = async () => {
    try {
      const hashedPassword = await hashPassword(this.plainTextPassword)
      const [created] = await knex(this.dbTable)
        .insert({
          username: this.username,
          password: hashedPassword,
          email: this.email,
        })
        .returning('*')
      return created
    } catch (error) {
      throw new Error(`Failed to create user. ${error}`)
    }
  }

  destroy = async () => {
    try {
      const [destroyed] = await knex(this.dbTable)
        .where('username', this.username)
        .del()
        .returning('*')
      return destroyed
    } catch (error) {
      throw new Error(`Failed to delete user. ${error}`)
    }
  }
}

module.exports = User
