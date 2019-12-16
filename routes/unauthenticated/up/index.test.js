const { requestWithoutAuth } = require('../../../testing/helpers')

describe('/up (unauthenticated)', () => {
  test('GET sends a success response', () => {
    return requestWithoutAuth.get('/up').expect(200, '👍')
  })
})
