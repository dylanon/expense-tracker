const request = require('supertest')
const up = require('./')

describe('GET /up', () => {
  test('sends a success response', () => {
    request(up)
      .get('/')
      .expect(200, '👍')
  })
})
