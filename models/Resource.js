const { Router } = require('express')
const knex = require('../db')

class Resource {
  constructor(resourceName, dbTable, schemas, options = {}) {
    if (!resourceName || !dbTable || !schemas) {
      throw new Error(
        'ResourceHandler: One or more invalid constructor arguments.'
      )
    }
    const { operations, returnAttributes = '*' } = options
    const {
      list = true,
      create = true,
      read = true,
      update = true,
      delete: del = true,
    } = operations || {}
    const router = new Router()
    if (list) {
      router.get('/', this.list)
    }
    if (create) {
      router.post('/', this.create)
    }
    if (read) {
      router.get('/:id', this.read)
    }
    if (update) {
      router.patch('/:id', this.update)
    }
    if (del) {
      router.delete('/:id', this.del)
    }
    this.router = router
    this.resourceName = resourceName
    this.dbTable = dbTable
    this.schemas = schemas
    this.returnAttributes = returnAttributes
  }

  list = async (req, res) => {
    const list = await knex(this.dbTable)
      .select(this.returnAttributes)
      .where('id', req.user.id)
    res.json(list)
  }

  create = async (req, res, next) => {
    try {
      const { user } = req
      const body = await this.schemas.createSchema.validateAsync(req.body)
      const attributes = Object.assign(body, {
        createdBy: user.id,
      })
      const [resource] = await knex(this.dbTable)
        .returning(this.returnAttributes)
        .insert(attributes)
      res.status(201).json(resource)
    } catch (error) {
      next(error)
    }
  }

  read = async (req, res, next) => {
    try {
      const { id } = await this.schemas.readSchema.validateAsync(req.params)
      const [resource] = await knex(this.dbTable)
        .select(this.returnAttributes)
        .where('id', id)
      if (!resource) {
        // TODO: Add NotFoundError to error handling
        return res.status(404).json({
          errors: [`Could not find a ${this.resourceName} with id ${id}.`],
        })
      }
      res.json(resource)
    } catch (error) {
      next(error)
    }
  }

  update = async (req, res, next) => {
    try {
      const { id } = await this.schemas.updateParamsSchema.validateAsync(
        req.params
      )
      const updates = await this.schemas.updateBodySchema.validateAsync(
        req.body
      )
      const [updatedResource] = await knex(this.dbTable)
        .returning(this.returnAttributes)
        .where('id', id)
        .update(updates)
      if (!updatedResource) {
        // TODO: Add NotFoundError to error handling
        return res.status(404).json({
          errors: [`Could not find a ${this.resourceName} with id ${id}.`],
        })
      }
      res.json(updatedResource)
    } catch (error) {
      next(error)
    }
  }

  del = async (req, res, next) => {
    try {
      const { id } = await this.schemas.deleteSchema.validateAsync(req.params)
      const [deletedResource] = await knex(this.dbTable)
        .returning(this.returnAttributes)
        .where('id', id)
        .delete()
      if (!deletedResource) {
        // TODO: Add NotFoundError to error handling
        return res.status(404).json({
          errors: [`Could not find a ${this.resourceName} with id ${id}.`],
        })
      }
      res.json(deletedResource)
    } catch (error) {
      next(error)
    }
  }
}

module.exports = Resource
