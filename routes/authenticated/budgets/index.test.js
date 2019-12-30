const moment = require('moment')
const formatCurrency = require('format-currency')
const UserFixture = require('../../../testing/fixtures/User')
const ProjectFixture = require('../../../testing/fixtures/Project')
const BudgetFixture = require('../../../testing/fixtures/Budget')
const {
  clearTable,
  createAuthenticatedClient,
  createDatabaseNoise,
  requestWithoutAuth,
} = require('../../../testing/helpers')

describe('with authentication', () => {
  const username = 'authedBudgetsEndpoint'
  const password = '12341234'
  const email = `${username}@test.com`

  let user
  let project
  let projectId
  let requestWithAuth

  beforeAll(async () => {
    user = new UserFixture(username, password, email)
    await user.create()
    project = new ProjectFixture({ createdBy: user.id })
    await project.create()
    projectId = project.attributes.id
    requestWithAuth = createAuthenticatedClient(user)
  })

  beforeEach(async () => {
    await clearTable('budgets')
  })

  afterAll(async () => {
    await clearTable('budgets')
    await project.destroy()
    await user.destroy()
  })

  describe('list', () => {
    let cleanupNoise

    beforeEach(async () => {
      cleanupNoise = await createDatabaseNoise()
    })

    afterEach(async () => {
      await cleanupNoise()
    })

    it(`lists the user's budgets`, async () => {
      const { id: projectId } = project.attributes
      const budgetAttributes = [
        {
          projectId,
          name: 'Budget One',
          createdBy: user.id,
        },
        {
          projectId,
          name: 'Budget Two',
          startDate: 1572566400000,
          endDate: 1575158399999,
          target: 2500,
          createdBy: user.id,
        },
        {
          projectId,
          name: 'Budget Three',
          startDate: 1575158400000,
          endDate: 1577836799999,
          target: 2250,
          createdBy: user.id,
        },
      ]
      const budgetFixtures = budgetAttributes.map(
        attributes => new BudgetFixture(attributes)
      )
      const budgetCreateOperations = budgetFixtures.map(budget =>
        budget.create()
      )
      const createdBudgets = await Promise.all(budgetCreateOperations)
      const expectedBudgets = createdBudgets.map(budget => {
        return Object.assign({}, budget, {
          startDate: budget.startDate
            ? moment(budget.startDate).toISOString()
            : budget.startDate,
          endDate: budget.endDate
            ? moment(budget.endDate).toISOString()
            : budget.endDate,
        })
        return budget
      })
      const { body } = await requestWithAuth.get('/budgets').expect(200)
      body.forEach(returnedBudget => {
        expect(expectedBudgets).toContainEqual(returnedBudget)
        expect(returnedBudget.createdBy).toBe(user.id)
      })
    })
  })

  describe('create', () => {
    it('creates a budget with the minimum attributes', async () => {
      const { body } = await requestWithAuth
        .post('/budgets')
        .send({
          projectId,
        })
        .expect(201)

      expect(body).toEqual(
        expect.objectContaining({
          projectId,
          name: null,
          startDate: null,
          endDate: null,
          target: null,
          id: expect.any(String),
          createdBy: user.id,
        })
      )
    })

    it('creates a budget with all possible attributes', async () => {
      const attributes = {
        projectId,
        name: 'Budget A',
        startDate: 1572566400000,
        endDate: 1575158399999,
        target: 3000,
      }
      const { body } = await requestWithAuth
        .post('/budgets')
        .send(attributes)
        .expect(201)

      const formattedDates = {
        startDate: moment(attributes.startDate).toISOString(),
        endDate: moment(attributes.endDate).toISOString(),
      }
      const formattedCurrencies = {
        target: formatCurrency(attributes.target, {
          format: '%s%v',
          symbol: '$',
        }),
      }
      const expectedProperties = Object.assign(
        {},
        attributes,
        formattedDates,
        formattedCurrencies,
        {
          id: expect.any(String),
          createdBy: user.id,
        }
      )
      expect(body).toEqual(expect.objectContaining(expectedProperties))
    })

    it('prevents creation of a budget with invalid attributes', async () => {
      const createWithCreatedBy = requestWithAuth.post('/budgets').send({
        projectId,
        name: 'Budget B',
        createdBy: user.id,
      })
      const createWithBlah = requestWithAuth
        .post('/budgets')
        .send({ projectId, blah: 2019 })
      const responses = await Promise.all([createWithCreatedBy, createWithBlah])

      responses.forEach(response => {
        const {
          status,
          body: { id, errors },
        } = response
        expect(status).toBe(400)
        expect(errors).toEqual(expect.any(Array))
        expect(id).toBeUndefined()
      })
    })
  })

  describe('read', () => {
    it('reads a budget by id', async () => {
      const budget = new BudgetFixture({
        projectId,
        createdBy: user.id,
      })
      const budgetAttributes = await budget.create()
      const { body } = await requestWithAuth
        .get(`/budgets/${budgetAttributes.id}`)
        .expect(200)
      expect(body).toEqual(budgetAttributes)
    })

    it('responds with 404 when the budget is not found', async () => {
      const {
        body: { errors },
      } = await requestWithAuth.get(`/budgets/1`).expect(404)
      expect(errors).toEqual(expect.any(Array))
    })
  })

  describe('update', () => {
    let otherProject
    beforeAll(async () => {
      otherProject = new ProjectFixture({ createdBy: user.id })
      await otherProject.create()
    })

    afterAll(async () => {
      await otherProject.destroy()
    })

    it('updates budget attributes', async () => {
      const originalAttributes = {
        projectId,
        createdBy: user.id,
        name: 'Old Budget C',
      }
      const attributesToUpdate = {
        projectId: otherProject.attributes.id,
        name: 'Budget C',
        startDate: 1572566400000,
        endDate: 1575158399999,
        target: 2100,
      }
      const budget = new BudgetFixture(originalAttributes)
      const { id: budgetId } = await budget.create()

      const { body } = await requestWithAuth
        .patch(`/budgets/${budgetId}`)
        .send(attributesToUpdate)
        .expect(200)
      const formattedDates = {
        startDate: moment(attributesToUpdate.startDate).toISOString(),
        endDate: moment(attributesToUpdate.endDate).toISOString(),
      }
      const formattedCurrencies = {
        target: formatCurrency(attributesToUpdate.target, {
          format: '%s%v',
          symbol: '$',
        }),
      }
      const expectedAttributes = Object.assign(
        {},
        originalAttributes,
        attributesToUpdate,
        formattedDates,
        formattedCurrencies
      )
      expect(attributesToUpdate).not.toEqual(originalAttributes)
      expect(body).toEqual(expect.objectContaining(expectedAttributes))
    })

    it('prevents updating invalid properties', async () => {
      const budget = new BudgetFixture({
        projectId,
        createdBy: user.id,
      })
      const { id: budgetId } = await budget.create()

      const updateCreatedBy = requestWithAuth
        .patch(`/budgets/${budgetId}`)
        .send({
          createdBy: user.id,
        })
      const updateBlah = requestWithAuth.patch(`/budgets/${budgetId}`).send({
        blah: 'Some text',
      })
      const responses = await Promise.all([updateCreatedBy, updateBlah])
      responses.forEach(response => {
        const {
          status,
          body: { id, errors },
        } = response
        expect(status).toBe(400)
        expect(errors).toEqual(expect.any(Array))
        expect(id).toBeUndefined()
      })
    })

    it('responds with 404 when the project is not found', async () => {
      const {
        body: { errors },
      } = await requestWithAuth
        .patch(`/budgets/1`)
        .send({ name: 'New Name' })
        .expect(404)
      expect(errors).toEqual(expect.any(Array))
    })
  })

  describe('delete', () => {
    it('deletes a budget', async () => {
      const budget = new BudgetFixture({
        projectId,
        createdBy: user.id,
      })
      const attributes = await budget.create()
      const { id: budgetId } = attributes

      const responseWhenRead = await requestWithAuth.get(`/budgets/${budgetId}`)

      const responseWhenDeleted = await requestWithAuth.del(
        `/budgets/${budgetId}`
      )

      const responseWhenReadAfterDeleted = await requestWithAuth.get(
        `/budgets/${budgetId}`
      )

      expect(responseWhenRead.body).toEqual(attributes)
      expect(responseWhenDeleted.body).toEqual(attributes)
      expect(responseWhenReadAfterDeleted.status).toBe(404)
      expect(responseWhenReadAfterDeleted.body.errors).toEqual(
        expect.any(Array)
      )
    })

    it('responds with 404 when the budget is not found', async () => {
      const {
        body: { errors },
      } = await requestWithAuth.del(`/budgets/1`).expect(404)
      expect(errors).toEqual(expect.any(Array))
    })
  })
})

describe('without authentication it responds with 403 Forbidden', () => {
  test('GET /budgets', () => {
    return requestWithoutAuth.get('/budgets').expect(403)
  })

  test('POST /budgets', () => {
    return requestWithoutAuth
      .post('/budgets')
      .send({
        blah: 'Some value',
      })
      .expect(403)
  })

  test('PATCH /budgets/:id', () => {
    return requestWithoutAuth
      .patch('/budgets/1')
      .send({
        blahblah: 'Some other value',
      })
      .expect(403)
  })

  test('DELETE /budgets/:id', () => {
    return requestWithoutAuth.delete('/budgets/1').expect(403)
  })
})
