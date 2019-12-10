const request = require('supertest')
const app = require('../../../app')
const up = require('./')

app.use(up)

describe('/up (unauthenticated)', () => {
  test('GET sends a success response', () => {
    return request(app)
      .get('/up')
      .expect(200, '👍')
  })
})
