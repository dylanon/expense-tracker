const moment = require('moment')
const formatCurrency = require('format-currency')
const UserFixture = require('../../../testing/fixtures/User')
const ProjectFixture = require('../../../testing/fixtures/Project')
const BudgetFixture = require('../../../testing/fixtures/Budget')
const TransactionFixture = require('../../../testing/fixtures/Transaction')
const {
  clearTable,
  createAuthenticatedClient,
  requestWithoutAuth,
} = require('../../../testing/helpers')
const { TRANSACTION_TYPE } = require('../../../constants')

describe('with authentication', () => {
  const username = 'authedTransactionsEndpoint'
  const password = '12341234'
  const email = `${username}@test.com`

  let user
  let project
  let projectId
  // TODO: Reference specific budget from each transaction (change needed in route)
  let budget
  let budgetId
  let requestWithAuth

  beforeAll(async () => {
    user = new UserFixture(username, password, email)
    await user.create()
    project = new ProjectFixture({ createdBy: user.id })
    await project.create()
    projectId = project.attributes.id
    budget = new BudgetFixture({ projectId, createdBy: user.id })
    await budget.create()
    budgetId = budget.attributes.id
    requestWithAuth = createAuthenticatedClient(user)
  })

  beforeEach(async () => {
    await clearTable('transactions')
  })

  afterAll(async () => {
    await clearTable('transactions')
    await clearTable('budgets')
    await clearTable('projects')
    await clearTable('users')
  })

  it('lists transactions', async () => {
    const transactionAttributes = [
      {
        amount: 10,
        date: '2019-12-01',
        name: 'Transaction One',
        type: TRANSACTION_TYPE.EXPENSE,
        createdBy: user.id,
      },
      {
        amount: 500.45,
        date: '2019-12-13',
        name: 'Transaction Two',
        type: TRANSACTION_TYPE.INCOME,
        createdBy: user.id,
      },
      {
        amount: 74.12,
        date: '2019-12-11',
        name: 'Transaction Three',
        type: TRANSACTION_TYPE.EXPENSE,
        createdBy: user.id,
      },
    ]
    const transactionFixtures = transactionAttributes.map(
      attributes => new TransactionFixture(attributes)
    )
    const transactionCreateOperations = transactionFixtures.map(transaction =>
      transaction.create()
    )
    const createdTransactions = await Promise.all(transactionCreateOperations)
    const expectedTransactions = createdTransactions.map(transaction => {
      return Object.assign({}, transaction, {
        date: moment(transaction.date).toISOString(),
      })
    })

    const { body } = await requestWithAuth.get('/transactions').expect(200)
    body.forEach(returnedTransaction => {
      expect(expectedTransactions).toContainEqual(returnedTransaction)
    })
  })

  describe('create', () => {
    it('creates a transaction with the minimum attributes', async () => {
      const amount = 843.19
      const formattedAmount = formatCurrency(amount, {
        format: '%s%v',
        symbol: '$',
      })
      const type = TRANSACTION_TYPE.EXPENSE
      const { body } = await requestWithAuth
        .post('/transactions')
        .send({
          amount,
          type,
        })
        .expect(201)

      expect(body).toEqual(
        expect.objectContaining({
          amount: formattedAmount,
          type,
          date: null,
          name: null,
          id: expect.any(String),
          createdBy: user.id,
        })
      )
    })

    it('creates a transaction with all possible attributes', async () => {
      const amount = 754.96
      const formattedAmount = formatCurrency(amount, {
        format: '%s%v',
        symbol: '$',
      })
      const date = '2019-12-01'
      const formattedDate = moment(date).toISOString()
      const name = 'Test Budget'
      const type = TRANSACTION_TYPE.INCOME
      const { body } = await requestWithAuth
        .post('/transactions')
        .send({
          amount,
          date,
          name,
          type,
        })
        .expect(201)

      expect(body).toEqual(
        expect.objectContaining({
          amount: formattedAmount,
          date: formattedDate,
          name,
          type,
          id: expect.any(String),
          createdBy: user.id,
        })
      )
    })

    it('prevents creation of a transaction with invalid attributes', async () => {
      const createWithCreatedBy = requestWithAuth.post('/transactions').send({
        amount: 440,
        name: 'Test Budget X',
        type: TRANSACTION_TYPE.EXPENSE,
        createdBy: user.id,
      })
      const createWithBlah = requestWithAuth
        .post('/transactions')
        .send({ amount: 2, type: TRANSACTION_TYPE.EXPENSE, blah: 2019 })
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
    it('reads a transaction by id', async () => {
      const transaction = new TransactionFixture({
        amount: 111.11,
        type: TRANSACTION_TYPE.EXPENSE,
        name: 'Transaction Z',
        createdBy: user.id,
      })
      const createdTransaction = await transaction.create()
      const { id: transactionId } = createdTransaction
      const { body } = await requestWithAuth
        .get(`/transactions/${transactionId}`)
        .expect(200)
      expect(body).toEqual(createdTransaction)
    })

    it('responds with 404 when the transaction is not found', async () => {
      const {
        body: { errors },
      } = await requestWithAuth.get(`/transactions/1`).expect(404)
      expect(errors).toEqual(expect.any(Array))
    })
  })

  describe('update', () => {
    it('updates transaction attributes', async () => {
      const originalAttributes = {
        amount: 502.15,
        date: '2019-12-13',
        name: 'Transaction Q',
        type: TRANSACTION_TYPE.INCOME,
        createdBy: user.id,
      }
      const attributesToUpdate = {
        name: 'Transaction R',
        type: TRANSACTION_TYPE.EXPENSE,
      }
      const transaction = new TransactionFixture(originalAttributes)
      const { id: transactionId } = await transaction.create()

      const { body } = await requestWithAuth
        .patch(`/transactions/${transactionId}`)
        .send(attributesToUpdate)
        .expect(200)
      const formattedDates = {
        date: moment(originalAttributes.date).toISOString(),
      }
      const formattedCurrencies = {
        amount: formatCurrency(originalAttributes.amount, {
          format: '%s%v',
          symbol: '$',
        }),
      }
      const expectedAttributes = Object.assign(
        {},
        originalAttributes,
        formattedDates,
        attributesToUpdate,
        formattedCurrencies
      )
      expect(attributesToUpdate).not.toEqual(originalAttributes)
      expect(body).toEqual(expect.objectContaining(expectedAttributes))
    })

    it('prevents updating invalid properties', async () => {
      const transaction = new TransactionFixture({
        amount: 211.11,
        type: TRANSACTION_TYPE.EXPENSE,
        name: 'Transaction H',
        createdBy: user.id,
      })
      const { id: transactionId } = await transaction.create()

      const updateCreatedBy = requestWithAuth
        .patch(`/transactions/${transactionId}`)
        .send({
          createdBy: user.id,
        })
      const updateBlah = requestWithAuth
        .patch(`/transactions/${transactionId}`)
        .send({
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
        .patch(`/transactions/1`)
        .send({ name: 'New Name' })
        .expect(404)
      expect(errors).toEqual(expect.any(Array))
    })
  })

  describe('delete', () => {
    it('deletes a transaction', async () => {
      const transaction = new TransactionFixture({
        amount: 111.11,
        type: TRANSACTION_TYPE.EXPENSE,
        name: 'Transaction W',
        createdBy: user.id,
      })
      const createdTransaction = await transaction.create()
      const { id: transactionId } = createdTransaction

      const responseWhenRead = await requestWithAuth.get(
        `/transactions/${transactionId}`
      )

      const responseWhenDeleted = await requestWithAuth.del(
        `/transactions/${transactionId}`
      )

      const responseWhenReadAfterDeleted = await requestWithAuth.get(
        `/transactions/${transactionId}`
      )

      expect(responseWhenRead.body).toEqual(createdTransaction)
      expect(responseWhenDeleted.body).toEqual(createdTransaction)
      expect(responseWhenReadAfterDeleted.status).toBe(404)
      expect(responseWhenReadAfterDeleted.body.errors).toEqual(
        expect.any(Array)
      )
    })

    it('responds with 404 when the transaction is not found', async () => {
      const {
        body: { errors },
      } = await requestWithAuth.del(`/transactions/1`).expect(404)
      expect(errors).toEqual(expect.any(Array))
    })
  })
})

describe('without authentication it responds with 403 Forbidden', () => {
  test('GET /transactions', () => {
    return requestWithoutAuth.get('/transactions').expect(403)
  })

  test('POST /transactions', () => {
    return requestWithoutAuth
      .post('/transactions')
      .send({
        blah: 'Some value',
      })
      .expect(403)
  })

  test('PATCH /transactions/:id', () => {
    return requestWithoutAuth
      .patch('/transactions/1')
      .send({
        blahblah: 'Some other value',
      })
      .expect(403)
  })

  test('DELETE /transactions/:id', () => {
    return requestWithoutAuth.delete('/transactions/1').expect(403)
  })
})
