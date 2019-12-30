const UserFixture = require('../fixtures/User')
const ProjectFixture = require('../fixtures/Project')
const BudgetFixture = require('../fixtures/Budget')
const TransactionFixture = require('../fixtures/Transaction')
const { TRANSACTION_TYPE } = require('../../constants')

const createDatabaseNoise = async () => {
  const user = new UserFixture('noiseUser', '12341234', 'noiseUser@test.com')
  await user.create()

  const project = new ProjectFixture({
    name: 'noiseUserProject',
    createdBy: user.id,
  })
  await project.create()

  const budget = new BudgetFixture({
    name: 'noiseUserBudget',
    projectId: project.attributes.id,
    createdBy: user.id,
  })
  await budget.create()

  const transaction = new TransactionFixture({
    amount: 1234,
    type: TRANSACTION_TYPE.EXPENSE,
    budgetId: budget.attributes.id,
    createdBy: user.id,
  })
  await transaction.create()

  async function cleanup() {
    await transaction.destroy()
    await budget.destroy()
    await project.destroy()
    await user.destroy()
  }

  return cleanup
}

module.exports = createDatabaseNoise
