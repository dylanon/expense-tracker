const knex = require('../../db')
const { createAuthToken, hashPassword } = require('../../utils')

class User {
  constructor(username, plainTextPassword, email) {
    this.username = username
    this.plainTextPassword = plainTextPassword
    this.email = email
    this.id = null
    this.attributes = null
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
      // TODO: Remove non-standard property user.id
      this.id = created.id
      const { password, ...safeAttributes } = created
      this.attributes = safeAttributes
      return safeAttributes
    } catch (error) {
      console.log(`[fixtures/User]: Failed to create user. ${error}`)
    }
  }

  destroy = async () => {
    try {
      const [destroyed] = await knex(this.dbTable)
        .where('id', this.id)
        .del()
        .returning('*')
      return destroyed
    } catch (error) {
      console.log(`[fixtures/User]: Failed to delete user. ${error}`)
    }
  }

  getAuthCookie = () => {
    const token = createAuthToken({
      username: this.username,
    })
    return `auth=${token}; path=/; domain=localhost;`
  }
}

module.exports = User
